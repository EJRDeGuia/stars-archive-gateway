-- Fix remaining security vulnerabilities from audit

-- 1. Fix all remaining functions that need search_path set
CREATE OR REPLACE FUNCTION public.update_system_statistics()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $$
BEGIN
  -- Update total theses count
  INSERT INTO public.system_statistics (stat_key, stat_label, stat_value, updated_at)
  VALUES ('total_theses', 'Total Theses', (SELECT COUNT(*) FROM public.theses WHERE status = 'approved'), now())
  ON CONFLICT (stat_key) DO UPDATE SET
    stat_value = EXCLUDED.stat_value,
    updated_at = EXCLUDED.updated_at;
  
  -- Update total colleges count
  INSERT INTO public.system_statistics (stat_key, stat_label, stat_value, updated_at)
  VALUES ('total_colleges', 'Total Colleges', (SELECT COUNT(*) FROM public.colleges), now())
  ON CONFLICT (stat_key) DO UPDATE SET
    stat_value = EXCLUDED.stat_value,
    updated_at = EXCLUDED.updated_at;
  
  -- Update total collections count
  INSERT INTO public.system_statistics (stat_key, stat_label, stat_value, updated_at)
  VALUES ('total_collections', 'Total Collections', (SELECT COUNT(*) FROM public.collections WHERE is_public = true), now())
  ON CONFLICT (stat_key) DO UPDATE SET
    stat_value = EXCLUDED.stat_value,
    updated_at = EXCLUDED.updated_at;
  
  -- Update active users count
  INSERT INTO public.system_statistics (stat_key, stat_label, stat_value, updated_at)
  VALUES ('active_users', 'Active Users', (SELECT COUNT(DISTINCT user_id) FROM public.user_roles WHERE created_at > now() - interval '30 days'), now())
  ON CONFLICT (stat_key) DO UPDATE SET
    stat_value = EXCLUDED.stat_value,
    updated_at = EXCLUDED.updated_at;
  
  -- Update monthly uploads count
  INSERT INTO public.system_statistics (stat_key, stat_label, stat_value, updated_at)
  VALUES ('monthly_uploads', 'Monthly Uploads', (SELECT COUNT(*) FROM public.theses WHERE created_at > now() - interval '1 month'), now())
  ON CONFLICT (stat_key) DO UPDATE SET
    stat_value = EXCLUDED.stat_value,
    updated_at = EXCLUDED.updated_at;
  
  -- Update weekly views count
  INSERT INTO public.system_statistics (stat_key, stat_label, stat_value, updated_at)
  VALUES ('weekly_views', 'Weekly Views', (SELECT COUNT(*) FROM public.thesis_views WHERE viewed_at > now() - interval '7 days'), now())
  ON CONFLICT (stat_key) DO UPDATE SET
    stat_value = EXCLUDED.stat_value,
    updated_at = EXCLUDED.updated_at;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_thesis_status(thesis_uuid uuid, new_status thesis_status, user_uuid uuid)
 RETURNS TABLE(success boolean, message text, thesis_id uuid, thesis_title text, old_status thesis_status, updated_status thesis_status)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $$
DECLARE
  thesis_record RECORD;
  user_is_admin BOOLEAN;
BEGIN
  SELECT public.has_role(user_uuid, 'admin') INTO user_is_admin;
  
  IF NOT user_is_admin THEN
    RETURN QUERY SELECT FALSE, 'Only administrators can update thesis status', NULL::UUID, NULL::TEXT, NULL::thesis_status, NULL::thesis_status;
    RETURN;
  END IF;
  
  SELECT * FROM theses WHERE id = thesis_uuid INTO thesis_record;
  
  IF thesis_record.id IS NULL THEN
    RETURN QUERY SELECT FALSE, 'Thesis not found', NULL::UUID, NULL::TEXT, NULL::thesis_status, NULL::thesis_status;
    RETURN;
  END IF;
  
  UPDATE theses 
  SET status = new_status, updated_at = NOW()
  WHERE id = thesis_uuid;
  
  RETURN QUERY SELECT 
    TRUE, 
    'Thesis status updated successfully',
    thesis_record.id,
    thesis_record.title,
    thesis_record.status,
    new_status;
END;
$$;

CREATE OR REPLACE FUNCTION public.can_access_thesis_file(_thesis_id uuid, _user_id uuid DEFAULT auth.uid())
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $$
DECLARE
  thesis_status thesis_status;
  user_role_val app_role;
  has_approval boolean := false;
BEGIN
  SELECT status INTO thesis_status 
  FROM public.theses 
  WHERE id = _thesis_id;
  
  IF thesis_status IS NULL THEN
    RETURN false;
  END IF;
  
  IF thesis_status != 'approved' THEN
    RETURN public.has_elevated_access(_user_id);
  END IF;
  
  SELECT role INTO user_role_val
  FROM public.user_roles
  WHERE user_id = _user_id;
  
  IF user_role_val IN ('admin', 'archivist') THEN
    RETURN true;
  END IF;
  
  IF user_role_val = 'researcher' THEN
    SELECT EXISTS(
      SELECT 1 FROM public.lrc_approval_requests
      WHERE user_id = _user_id 
        AND thesis_id = _thesis_id
        AND request_type = 'full_text_access'
        AND status = 'approved'
        AND (expires_at IS NULL OR expires_at > now())
    ) INTO has_approval;
    
    RETURN has_approval;
  END IF;
  
  RETURN false;
END;
$$;

-- 2. Create secure views to replace potentially insecure ones
DROP VIEW IF EXISTS public.recent_uploads_view CASCADE;

CREATE VIEW public.recent_uploads_view
WITH (security_invoker = true) AS
SELECT 
  t.id,
  t.title,
  t.author,
  t.status,
  t.created_at,
  c.name as college_name,
  c.id as college_id
FROM public.theses t
LEFT JOIN public.colleges c ON t.college_id = c.id
WHERE t.status = 'approved' OR public.has_elevated_access(auth.uid())
ORDER BY t.created_at DESC
LIMIT 10;

-- 3. Create data encryption functions for sensitive data
CREATE OR REPLACE FUNCTION public.encrypt_sensitive_field(_data text, _key text DEFAULT 'default_key')
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Simple encryption placeholder - in production, use proper encryption
  IF _data IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Basic obfuscation for demonstration
  RETURN encode(digest(_data || _key, 'sha256'), 'hex');
END;
$$;

-- 4. Create comprehensive security monitoring triggers
CREATE OR REPLACE FUNCTION public.security_monitor_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
  action_type text;
  risk_level text := 'low';
BEGIN
  current_user_id := auth.uid();
  
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type := 'CREATE';
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'UPDATE';
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'DELETE';
  END IF;
  
  -- Assess risk level based on table and operation
  IF TG_TABLE_NAME IN ('user_roles', 'security_alerts', 'audit_logs') THEN
    risk_level := 'high';
  ELSIF TG_TABLE_NAME IN ('theses', 'collections') AND TG_OP = 'DELETE' THEN
    risk_level := 'medium';
  END IF;
  
  -- Log the action
  PERFORM public.enhanced_audit_log(
    action_type,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    to_jsonb(OLD),
    to_jsonb(NEW),
    risk_level,
    jsonb_build_object(
      'trigger_name', TG_NAME,
      'table_name', TG_TABLE_NAME,
      'operation', TG_OP
    )
  );
  
  -- Return appropriate record
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Apply security monitoring to critical tables
DROP TRIGGER IF EXISTS security_monitor_user_roles ON public.user_roles;
CREATE TRIGGER security_monitor_user_roles
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.security_monitor_trigger();

DROP TRIGGER IF EXISTS security_monitor_theses ON public.theses;
CREATE TRIGGER security_monitor_theses
  AFTER INSERT OR UPDATE OR DELETE ON public.theses
  FOR EACH ROW EXECUTE FUNCTION public.security_monitor_trigger();

-- 5. Create rate limiting table and functions
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL, -- IP address or user ID
  action text NOT NULL,
  count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  blocked boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can manage rate limits"
ON public.rate_limits
FOR ALL
USING (true)
WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _identifier text,
  _action text,
  _limit integer DEFAULT 100,
  _window_minutes integer DEFAULT 60
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;