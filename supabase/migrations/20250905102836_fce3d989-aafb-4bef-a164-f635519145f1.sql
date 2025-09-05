-- Create session_tracking table for advanced session management
CREATE TABLE public.session_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  device_fingerprint JSONB,
  ip_address INET,
  user_agent TEXT,
  location_data JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_type TEXT NOT NULL DEFAULT 'regular' CHECK (session_type IN ('regular', 'remember_me', 'guest'))
);

-- Create security_alerts table for anomaly detection
CREATE TABLE public.security_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  ip_address INET,
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create file_scan_results table for malware scanning
CREATE TABLE public.file_scan_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_path TEXT NOT NULL,
  scan_status TEXT NOT NULL DEFAULT 'pending' CHECK (scan_status IN ('pending', 'scanning', 'clean', 'infected', 'error')),
  scan_provider TEXT NOT NULL DEFAULT 'virustotal',
  scan_results JSONB,
  quarantined BOOLEAN NOT NULL DEFAULT false,
  uploaded_by UUID,
  scanned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create failed_login_attempts table for brute force protection
CREATE TABLE public.failed_login_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  ip_address INET NOT NULL,
  user_agent TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  blocked_until TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on new tables
ALTER TABLE public.session_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failed_login_attempts ENABLE ROW LEVEL SECURITY;

-- RLS policies for session_tracking
CREATE POLICY "Users can view their own sessions" 
ON public.session_tracking 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "System can manage sessions" 
ON public.session_tracking 
FOR ALL 
USING (true)
WITH CHECK (true);

-- RLS policies for security_alerts
CREATE POLICY "Users can view their own alerts" 
ON public.security_alerts 
FOR SELECT 
USING (user_id = auth.uid() OR has_elevated_access(auth.uid()));

CREATE POLICY "System can create alerts" 
ON public.security_alerts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage alerts" 
ON public.security_alerts 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- RLS policies for file_scan_results
CREATE POLICY "Users can view their scan results" 
ON public.file_scan_results 
FOR SELECT 
USING (uploaded_by = auth.uid() OR has_elevated_access(auth.uid()));

CREATE POLICY "System can manage scan results" 
ON public.file_scan_results 
FOR ALL 
USING (true)
WITH CHECK (true);

-- RLS policies for failed_login_attempts
CREATE POLICY "Admins can view failed attempts" 
ON public.failed_login_attempts 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can log failed attempts" 
ON public.failed_login_attempts 
FOR INSERT 
WITH CHECK (true);

-- Function to check for suspicious login patterns
CREATE OR REPLACE FUNCTION public.check_failed_login_attempts(_ip_address inet, _email text DEFAULT NULL)
RETURNS TABLE(is_blocked boolean, attempts_count bigint, blocked_until timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Function to log failed login attempts
CREATE OR REPLACE FUNCTION public.log_failed_login(_email text, _ip_address inet, _user_agent text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Function to manage user sessions
CREATE OR REPLACE FUNCTION public.create_user_session(
  _user_id uuid,
  _session_token text,
  _device_fingerprint jsonb DEFAULT NULL,
  _ip_address inet DEFAULT NULL,
  _user_agent text DEFAULT NULL,
  _location_data jsonb DEFAULT NULL,
  _session_type text DEFAULT 'regular',
  _expires_in_hours integer DEFAULT 2
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  session_id uuid;
  max_sessions integer := 5; -- Maximum concurrent sessions per user
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

-- Function to detect anomalous behavior
CREATE OR REPLACE FUNCTION public.detect_user_anomalies(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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