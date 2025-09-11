-- Fix database security vulnerabilities identified in security audit

-- 1. Fix search_path for all security-related functions to prevent SQL injection
CREATE OR REPLACE FUNCTION public.check_failed_login_attempts(_ip_address inet, _email text DEFAULT NULL::text)
 RETURNS TABLE(is_blocked boolean, attempts_count bigint, blocked_until timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $$
DECLARE
  recent_attempts bigint;
  block_until timestamp with time zone;
BEGIN
  -- Count failed attempts in last 15 minutes
  SELECT COUNT(*) INTO recent_attempts
  FROM public.failed_login_attempts
  WHERE ip_address = _ip_address
    AND (_email IS NULL OR email = _email)
    AND attempted_at > now() - interval '15 minutes';
  
  -- Check if currently blocked
  SELECT MAX(blocked_until) INTO block_until
  FROM public.failed_login_attempts
  WHERE ip_address = _ip_address
    AND blocked_until > now();
  
  -- Return results
  RETURN QUERY SELECT 
    CASE WHEN block_until IS NOT NULL THEN true ELSE false END as is_blocked,
    recent_attempts,
    block_until;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_failed_login(_email text, _ip_address inet, _user_agent text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $$
DECLARE
  attempts_count bigint;
  block_duration interval;
BEGIN
  -- Log the failed attempt
  INSERT INTO public.failed_login_attempts (email, ip_address, user_agent)
  VALUES (_email, _ip_address, _user_agent);
  
  -- Count recent attempts
  SELECT COUNT(*) INTO attempts_count
  FROM public.failed_login_attempts
  WHERE ip_address = _ip_address
    AND attempted_at > now() - interval '15 minutes';
  
  -- Apply progressive blocking
  IF attempts_count >= 5 THEN
    -- Calculate block duration (exponential backoff)
    block_duration := interval '5 minutes' * power(2, least(attempts_count - 5, 5));
    
    -- Update the block time
    UPDATE public.failed_login_attempts
    SET blocked_until = now() + block_duration
    WHERE ip_address = _ip_address
      AND attempted_at = (
        SELECT MAX(attempted_at) 
        FROM public.failed_login_attempts 
        WHERE ip_address = _ip_address
      );
      
    -- Create security alert
    INSERT INTO public.security_alerts (
      alert_type, severity, title, description, metadata, ip_address
    ) VALUES (
      'brute_force_attempt',
      CASE WHEN attempts_count >= 10 THEN 'high' ELSE 'medium' END,
      'Brute Force Attack Detected',
      format('Multiple failed login attempts (%s) detected from IP %s', attempts_count, _ip_address),
      jsonb_build_object(
        'attempts_count', attempts_count,
        'email', _email,
        'blocked_until', now() + block_duration
      ),
      _ip_address
    );
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_user_session(_user_id uuid, _session_token text, _device_fingerprint jsonb DEFAULT NULL::jsonb, _ip_address inet DEFAULT NULL::inet, _user_agent text DEFAULT NULL::text, _location_data jsonb DEFAULT NULL::jsonb, _session_type text DEFAULT 'regular'::text, _expires_in_hours integer DEFAULT 2)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $$
DECLARE
  session_id uuid;
  max_sessions integer := 5;
  session_count integer;
BEGIN
  -- Check concurrent session limit
  SELECT COUNT(*) INTO session_count
  FROM public.session_tracking
  WHERE user_id = _user_id 
    AND is_active = true 
    AND expires_at > now();
  
  -- Remove oldest sessions if limit exceeded
  IF session_count >= max_sessions THEN
    UPDATE public.session_tracking
    SET is_active = false
    WHERE user_id = _user_id
      AND id IN (
        SELECT id FROM public.session_tracking
        WHERE user_id = _user_id AND is_active = true
        ORDER BY last_activity ASC
        LIMIT session_count - max_sessions + 1
      );
  END IF;
  
  -- Create new session
  INSERT INTO public.session_tracking (
    user_id, session_token, device_fingerprint, ip_address,
    user_agent, location_data, session_type,
    expires_at, last_activity
  ) VALUES (
    _user_id, _session_token, _device_fingerprint, _ip_address,
    _user_agent, _location_data, _session_type,
    now() + interval '1 hour' * _expires_in_hours,
    now()
  ) RETURNING id INTO session_id;
  
  RETURN session_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.detect_user_anomalies(_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $$
DECLARE
  download_count integer;
  location_changes integer;
  recent_sessions integer;
BEGIN
  -- Check excessive downloads (10+ in last hour)
  SELECT COUNT(*) INTO download_count
  FROM public.thesis_downloads
  WHERE user_id = _user_id
    AND downloaded_at > now() - interval '1 hour';
  
  IF download_count >= 10 THEN
    INSERT INTO public.security_alerts (
      user_id, alert_type, severity, title, description, metadata
    ) VALUES (
      _user_id, 'excessive_downloads', 'medium',
      'Unusual Download Activity',
      format('User has downloaded %s theses in the last hour', download_count),
      jsonb_build_object('download_count', download_count, 'timeframe', '1 hour')
    );
  END IF;
  
  -- Check suspicious location changes (multiple locations in 1 hour)
  SELECT COUNT(DISTINCT (location_data->>'country')) INTO location_changes
  FROM public.session_tracking
  WHERE user_id = _user_id
    AND created_at > now() - interval '1 hour'
    AND location_data IS NOT NULL;
  
  IF location_changes >= 3 THEN
    INSERT INTO public.security_alerts (
      user_id, alert_type, severity, title, description, metadata
    ) VALUES (
      _user_id, 'location_anomaly', 'high',
      'Suspicious Location Activity',
      format('User accessed from %s different countries in the last hour', location_changes),
      jsonb_build_object('location_changes', location_changes, 'timeframe', '1 hour')
    );
  END IF;
  
  -- Check concurrent sessions from different IPs
  SELECT COUNT(DISTINCT ip_address) INTO recent_sessions
  FROM public.session_tracking
  WHERE user_id = _user_id
    AND is_active = true
    AND last_activity > now() - interval '30 minutes';
  
  IF recent_sessions >= 4 THEN
    INSERT INTO public.security_alerts (
      user_id, alert_type, severity, title, description, metadata
    ) VALUES (
      _user_id, 'concurrent_sessions', 'medium',
      'Multiple Concurrent Sessions',
      format('User has %s active sessions from different IP addresses', recent_sessions),
      jsonb_build_object('session_count', recent_sessions, 'timeframe', '30 minutes')
    );
  END IF;
END;
$$;

-- 2. Create secure data masking functions
CREATE OR REPLACE FUNCTION public.mask_sensitive_data(_data text, _mask_type text DEFAULT 'email')
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  CASE _mask_type
    WHEN 'email' THEN
      RETURN CASE 
        WHEN _data IS NULL THEN NULL
        WHEN position('@' in _data) > 0 THEN 
          substring(_data, 1, 2) || '***@' || split_part(_data, '@', 2)
        ELSE '***'
      END;
    WHEN 'ip' THEN
      RETURN CASE
        WHEN _data IS NULL THEN NULL
        ELSE regexp_replace(_data, '\d+$', 'xxx')
      END;
    WHEN 'partial' THEN
      RETURN CASE
        WHEN _data IS NULL THEN NULL
        WHEN length(_data) <= 4 THEN '***'
        ELSE substring(_data, 1, 2) || repeat('*', length(_data) - 4) || substring(_data, length(_data) - 1)
      END;
    ELSE
      RETURN '***';
  END CASE;
END;
$$;

-- 3. Create comprehensive audit trail function
CREATE OR REPLACE FUNCTION public.enhanced_audit_log(
  _action text,
  _resource_type text,
  _resource_id uuid DEFAULT NULL::uuid,
  _old_data jsonb DEFAULT NULL::jsonb,
  _new_data jsonb DEFAULT NULL::jsonb,
  _risk_level text DEFAULT 'low',
  _additional_metadata jsonb DEFAULT NULL::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  audit_id uuid;
  enhanced_details jsonb;
BEGIN
  -- Build enhanced audit details
  enhanced_details := jsonb_build_object(
    'old_data', _old_data,
    'new_data', _new_data,
    'risk_level', _risk_level,
    'session_info', jsonb_build_object(
      'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent',
      'timestamp', now()
    ),
    'additional', _additional_metadata
  );
  
  -- Insert audit log
  INSERT INTO public.audit_logs (
    user_id, action, resource_type, resource_id, 
    details, ip_address, user_agent
  ) VALUES (
    auth.uid(),
    _action,
    _resource_type,
    _resource_id,
    enhanced_details,
    inet(current_setting('request.headers', true)::jsonb->>'x-forwarded-for'),
    current_setting('request.headers', true)::jsonb->>'user-agent'
  ) RETURNING id INTO audit_id;
  
  -- Create security alert for high-risk actions
  IF _risk_level IN ('high', 'critical') THEN
    INSERT INTO public.security_alerts (
      user_id, alert_type, severity, title, description, metadata
    ) VALUES (
      auth.uid(),
      'high_risk_action',
      _risk_level,
      format('High Risk Action: %s', _action),
      format('User performed high-risk action "%s" on %s', _action, _resource_type),
      jsonb_build_object(
        'audit_id', audit_id,
        'resource_id', _resource_id,
        'action', _action
      )
    );
  END IF;
  
  RETURN audit_id;
END;
$$;

-- 4. Create IP reputation checking function
CREATE TABLE IF NOT EXISTS public.ip_reputation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address inet NOT NULL,
  reputation_score integer DEFAULT 50, -- 0-100, lower is more suspicious
  threat_types text[] DEFAULT '{}',
  blocked boolean DEFAULT false,
  last_updated timestamp with time zone DEFAULT now(),
  source text DEFAULT 'internal',
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.ip_reputation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage IP reputation"
ON public.ip_reputation
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.check_ip_reputation(_ip_address inet)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rep_record record;
  result jsonb;
BEGIN
  -- Get IP reputation
  SELECT * FROM public.ip_reputation 
  WHERE ip_address = _ip_address 
  INTO rep_record;
  
  IF rep_record IS NULL THEN
    -- No reputation data, return neutral
    result := jsonb_build_object(
      'reputation_score', 50,
      'blocked', false,
      'threat_types', '[]'::jsonb,
      'recommendation', 'monitor'
    );
  ELSE
    result := jsonb_build_object(
      'reputation_score', rep_record.reputation_score,
      'blocked', rep_record.blocked,
      'threat_types', to_jsonb(rep_record.threat_types),
      'recommendation', 
        CASE 
          WHEN rep_record.blocked THEN 'block'
          WHEN rep_record.reputation_score < 20 THEN 'block'
          WHEN rep_record.reputation_score < 40 THEN 'challenge'
          ELSE 'allow'
        END
    );
  END IF;
  
  RETURN result;
END;
$$;

-- 5. Create session hijacking protection
CREATE OR REPLACE FUNCTION public.validate_session_security(_session_token text, _current_ip inet, _current_user_agent text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_record record;
  ip_distance numeric;
  agent_similarity numeric;
  risk_score integer := 0;
  result jsonb;
BEGIN
  -- Get session details
  SELECT * FROM public.session_tracking 
  WHERE session_token = _session_token 
    AND is_active = true 
    AND expires_at > now()
  INTO session_record;
  
  IF session_record IS NULL THEN
    RETURN jsonb_build_object(
      'valid', false,
      'risk_score', 100,
      'reason', 'session_not_found'
    );
  END IF;
  
  -- Check IP consistency (simplified geographic distance)
  IF session_record.ip_address != _current_ip THEN
    risk_score := risk_score + 30;
  END IF;
  
  -- Check user agent consistency
  IF session_record.user_agent != _current_user_agent THEN
    risk_score := risk_score + 20;
  END IF;
  
  -- Check session age
  IF session_record.created_at < now() - interval '24 hours' THEN
    risk_score := risk_score + 10;
  END IF;
  
  -- Update session activity
  UPDATE public.session_tracking 
  SET last_activity = now()
  WHERE id = session_record.id;
  
  result := jsonb_build_object(
    'valid', risk_score < 80,
    'risk_score', risk_score,
    'session_id', session_record.id,
    'recommendations', 
      CASE 
        WHEN risk_score >= 80 THEN '["terminate_session", "require_reauth"]'::jsonb
        WHEN risk_score >= 50 THEN '["challenge_user", "log_suspicious_activity"]'::jsonb
        ELSE '["continue"]'::jsonb
      END
  );
  
  -- Log suspicious activity
  IF risk_score >= 50 THEN
    INSERT INTO public.security_alerts (
      user_id, alert_type, severity, title, description, metadata
    ) VALUES (
      session_record.user_id,
      'suspicious_session',
      CASE WHEN risk_score >= 80 THEN 'high' ELSE 'medium' END,
      'Suspicious Session Activity',
      format('Session validation failed with risk score %s', risk_score),
      jsonb_build_object(
        'session_id', session_record.id,
        'risk_score', risk_score,
        'original_ip', session_record.ip_address,
        'current_ip', _current_ip,
        'original_agent', session_record.user_agent,
        'current_agent', _current_user_agent
      )
    );
  END IF;
  
  RETURN result;
END;
$$;