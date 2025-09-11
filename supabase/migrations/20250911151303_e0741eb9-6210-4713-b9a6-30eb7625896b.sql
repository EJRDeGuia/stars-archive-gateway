-- Fix session tracking RLS policy to prevent data exposure
DROP POLICY IF EXISTS "System can manage sessions" ON public.session_tracking;
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.session_tracking;

-- Create more restrictive policies
CREATE POLICY "Users can view their own sessions only" 
ON public.session_tracking 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "System can insert sessions" 
ON public.session_tracking 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update sessions" 
ON public.session_tracking 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can manage all sessions" 
ON public.session_tracking 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Update database functions to include explicit search_path for security
CREATE OR REPLACE FUNCTION public.check_failed_login_attempts(_ip_address inet, _email text DEFAULT NULL::text)
 RETURNS TABLE(is_blocked boolean, attempts_count bigint, blocked_until timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.log_failed_login(_email text, _ip_address inet, _user_agent text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.detect_user_anomalies(_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;