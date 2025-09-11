-- Fix remaining database functions to include explicit search_path for security
CREATE OR REPLACE FUNCTION public.create_user_session(_user_id uuid, _session_token text, _device_fingerprint jsonb DEFAULT NULL::jsonb, _ip_address inet DEFAULT NULL::inet, _user_agent text DEFAULT NULL::text, _location_data jsonb DEFAULT NULL::jsonb, _session_type text DEFAULT 'regular'::text, _expires_in_hours integer DEFAULT 2)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.check_ip_reputation(_ip_address inet)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.validate_session_security(_session_token text, _current_ip inet, _current_user_agent text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.check_rate_limit(_identifier text, _action text, _limit integer DEFAULT 100, _window_minutes integer DEFAULT 60)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_count integer;
  window_start timestamp with time zone;
  is_blocked boolean := false;
  result jsonb;
BEGIN
  -- Clean old records
  DELETE FROM public.rate_limits 
  WHERE window_start < now() - interval '1 hour' * (_window_minutes / 60);
  
  -- Get or create rate limit record
  SELECT count, rate_limits.window_start, blocked
  INTO current_count, window_start, is_blocked
  FROM public.rate_limits
  WHERE identifier = _identifier 
    AND action = _action
    AND window_start > now() - interval '1 minute' * _window_minutes;
  
  IF current_count IS NULL THEN
    -- First request in window
    INSERT INTO public.rate_limits (identifier, action, count, window_start)
    VALUES (_identifier, _action, 1, now());
    current_count := 1;
  ELSE
    -- Update existing record
    current_count := current_count + 1;
    UPDATE public.rate_limits
    SET count = current_count
    WHERE identifier = _identifier AND action = _action;
  END IF;
  
  -- Check if limit exceeded
  IF current_count > _limit THEN
    is_blocked := true;
    UPDATE public.rate_limits
    SET blocked = true
    WHERE identifier = _identifier AND action = _action;
    
    -- Create security alert for rate limit exceeded
    INSERT INTO public.security_alerts (
      alert_type, severity, title, description, metadata
    ) VALUES (
      'rate_limit_exceeded',
      'medium',
      'Rate Limit Exceeded',
      format('Identifier %s exceeded rate limit for action %s', _identifier, _action),
      jsonb_build_object(
        'identifier', _identifier,
        'action', _action,
        'count', current_count,
        'limit', _limit
      )
    );
  END IF;
  
  result := jsonb_build_object(
    'allowed', NOT is_blocked,
    'count', current_count,
    'limit', _limit,
    'reset_time', window_start + interval '1 minute' * _window_minutes
  );
  
  RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  cleaned_count integer;
BEGIN
  -- Mark expired sessions as inactive
  UPDATE public.session_tracking
  SET is_active = false
  WHERE expires_at < now() OR last_activity < now() - interval '2 hours';
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  
  -- Log session cleanup
  IF cleaned_count > 0 THEN
    PERFORM public.comprehensive_audit_log(
      'session_cleanup',
      'system',
      NULL,
      NULL,
      jsonb_build_object('sessions_cleaned', cleaned_count),
      'low',
      ARRAY['session_management', 'security_maintenance']
    );
  END IF;
  
  RETURN cleaned_count;
END;
$function$;