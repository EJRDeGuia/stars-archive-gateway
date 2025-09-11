-- Populate system statistics with real data and create new admin functionality

-- 1. Insert/Update system statistics with real calculated data
INSERT INTO public.system_statistics (stat_key, stat_label, stat_value) VALUES
('active_users', 'Active Users', 0),
('total_theses', 'Total Theses', 0),
('total_colleges', 'Total Colleges', 0),
('weekly_views', 'Weekly Views', 0),
('monthly_uploads', 'Monthly Uploads', 0),
('pending_approvals', 'Pending Approvals', 0),
('security_alerts', 'Security Alerts', 0),
('total_downloads', 'Total Downloads', 0)
ON CONFLICT (stat_key) DO UPDATE SET 
  stat_value = EXCLUDED.stat_value,
  updated_at = now();

-- 2. Create function to update system statistics automatically
CREATE OR REPLACE FUNCTION public.update_system_statistics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Update active users (users who logged in last 30 days)
  UPDATE public.system_statistics 
  SET stat_value = (
    SELECT COUNT(DISTINCT user_id) 
    FROM public.session_tracking 
    WHERE created_at >= now() - interval '30 days'
  ), updated_at = now()
  WHERE stat_key = 'active_users';
  
  -- Update total theses
  UPDATE public.system_statistics 
  SET stat_value = (SELECT COUNT(*) FROM public.theses), updated_at = now()
  WHERE stat_key = 'total_theses';
  
  -- Update total colleges
  UPDATE public.system_statistics 
  SET stat_value = (SELECT COUNT(*) FROM public.colleges), updated_at = now()
  WHERE stat_key = 'total_colleges';
  
  -- Update weekly views
  UPDATE public.system_statistics 
  SET stat_value = (
    SELECT COUNT(*) 
    FROM public.thesis_views 
    WHERE viewed_at >= now() - interval '7 days'
  ), updated_at = now()
  WHERE stat_key = 'weekly_views';
  
  -- Update monthly uploads
  UPDATE public.system_statistics 
  SET stat_value = (
    SELECT COUNT(*) 
    FROM public.theses 
    WHERE created_at >= date_trunc('month', now())
  ), updated_at = now()
  WHERE stat_key = 'monthly_uploads';
  
  -- Update pending approvals
  UPDATE public.system_statistics 
  SET stat_value = (
    SELECT COUNT(*) 
    FROM public.theses 
    WHERE status = 'pending_review'
  ), updated_at = now()
  WHERE stat_key = 'pending_approvals';
  
  -- Update security alerts
  UPDATE public.system_statistics 
  SET stat_value = (
    SELECT COUNT(*) 
    FROM public.security_alerts 
    WHERE resolved = false
  ), updated_at = now()
  WHERE stat_key = 'security_alerts';
  
  -- Update total downloads
  UPDATE public.system_statistics 
  SET stat_value = (SELECT COUNT(*) FROM public.thesis_downloads), updated_at = now()
  WHERE stat_key = 'total_downloads';
END;
$$;

-- 3. Create system settings table for admin configuration
CREATE TABLE IF NOT EXISTS public.system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL UNIQUE,
  setting_value jsonb NOT NULL,
  setting_label text NOT NULL,
  setting_description text,
  setting_type text NOT NULL DEFAULT 'string', -- string, number, boolean, json
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for system settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage system settings
CREATE POLICY "Only admins can manage system settings"
ON public.system_settings
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default system settings
INSERT INTO public.system_settings (setting_key, setting_label, setting_value, setting_description, setting_type) VALUES
('site_name', 'Site Name', '"DLSL Thesis Repository"', 'The name displayed across the application', 'string'),
('site_description', 'Site Description', '"Digital repository for De La Salle Lipa theses and research papers"', 'Description shown on the main page', 'string'),
('max_file_size', 'Maximum File Size (MB)', '50', 'Maximum allowed file size for uploads in megabytes', 'number'),
('allowed_file_types', 'Allowed File Types', '["pdf", "doc", "docx"]', 'List of allowed file extensions', 'json'),
('enable_email_notifications', 'Email Notifications', 'true', 'Enable email notifications system-wide', 'boolean'),
('enable_auto_backup', 'Automatic Backup', 'true', 'Enable automatic database backups', 'boolean'),
('backup_frequency', 'Backup Frequency', '"daily"', 'How often automatic backups run (hourly, daily, weekly, monthly)', 'string'),
('maintenance_mode', 'Maintenance Mode', 'false', 'Enable maintenance mode to restrict access', 'boolean'),
('enable_registration', 'User Registration', 'true', 'Allow new user registrations', 'boolean'),
('require_email_verification', 'Email Verification Required', 'true', 'Require email verification for new accounts', 'boolean')
ON CONFLICT (setting_key) DO NOTHING;

-- 4. Create enhanced notification management functions
CREATE OR REPLACE FUNCTION public.create_system_notification(
  _title text,
  _message text,
  _type text DEFAULT 'info',
  _target_roles text[] DEFAULT ARRAY['researcher', 'archivist', 'admin'],
  _expires_at timestamp with time zone DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  notification_id uuid;
  target_user record;
BEGIN
  -- Create notifications for users with specified roles
  FOR target_user IN 
    SELECT DISTINCT ur.user_id 
    FROM public.user_roles ur 
    WHERE ur.role::text = ANY(_target_roles)
  LOOP
    INSERT INTO public.notifications (
      user_id, title, message, type, expires_at, created_at
    ) VALUES (
      target_user.user_id, _title, _message, _type, _expires_at, now()
    ) RETURNING id INTO notification_id;
  END LOOP;
  
  RETURN notification_id;
END;
$$;

-- 5. Create security report generation functions
CREATE OR REPLACE FUNCTION public.generate_security_report(
  _start_date timestamp with time zone DEFAULT now() - interval '30 days',
  _end_date timestamp with time zone DEFAULT now()
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  report_data jsonb;
  alert_stats jsonb;
  session_stats jsonb;
  login_stats jsonb;
BEGIN
  -- Security alerts summary
  SELECT jsonb_build_object(
    'total_alerts', COUNT(*),
    'resolved_alerts', COUNT(*) FILTER (WHERE resolved = true),
    'unresolved_alerts', COUNT(*) FILTER (WHERE resolved = false),
    'high_severity', COUNT(*) FILTER (WHERE severity = 'high'),
    'medium_severity', COUNT(*) FILTER (WHERE severity = 'medium'),
    'low_severity', COUNT(*) FILTER (WHERE severity = 'low'),
    'alert_types', jsonb_agg(DISTINCT alert_type)
  ) INTO alert_stats
  FROM public.security_alerts
  WHERE created_at BETWEEN _start_date AND _end_date;
  
  -- Session statistics
  SELECT jsonb_build_object(
    'total_sessions', COUNT(*),
    'active_sessions', COUNT(*) FILTER (WHERE is_active = true),
    'unique_users', COUNT(DISTINCT user_id),
    'unique_ips', COUNT(DISTINCT ip_address),
    'average_session_duration', EXTRACT(EPOCH FROM AVG(last_activity - created_at))/3600
  ) INTO session_stats
  FROM public.session_tracking
  WHERE created_at BETWEEN _start_date AND _end_date;
  
  -- Failed login attempts
  SELECT jsonb_build_object(
    'total_failed_attempts', COUNT(*),
    'unique_ips_blocked', COUNT(DISTINCT ip_address) FILTER (WHERE blocked_until IS NOT NULL),
    'most_targeted_emails', jsonb_agg(DISTINCT email ORDER BY email) FILTER (WHERE email IS NOT NULL)
  ) INTO login_stats
  FROM public.failed_login_attempts
  WHERE attempted_at BETWEEN _start_date AND _end_date;
  
  -- Combine all statistics
  report_data := jsonb_build_object(
    'report_generated_at', now(),
    'report_period', jsonb_build_object(
      'start_date', _start_date,
      'end_date', _end_date
    ),
    'security_alerts', alert_stats,
    'session_activity', session_stats,
    'failed_logins', login_stats
  );
  
  RETURN report_data;
END;
$$;

-- 6. Create automatic statistics update trigger
CREATE OR REPLACE FUNCTION public.trigger_stats_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Update statistics after any significant data change
  PERFORM public.update_system_statistics();
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers for automatic statistics updates
DROP TRIGGER IF EXISTS update_stats_on_thesis_change ON public.theses;
CREATE TRIGGER update_stats_on_thesis_change
  AFTER INSERT OR UPDATE OR DELETE ON public.theses
  FOR EACH STATEMENT EXECUTE FUNCTION public.trigger_stats_update();

DROP TRIGGER IF EXISTS update_stats_on_view_insert ON public.thesis_views;
CREATE TRIGGER update_stats_on_view_insert
  AFTER INSERT ON public.thesis_views
  FOR EACH STATEMENT EXECUTE FUNCTION public.trigger_stats_update();

-- 7. Update audit logs table with additional metadata for better reporting
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS severity text DEFAULT 'low';
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS category text DEFAULT 'general';

-- 8. Create initial statistics update
SELECT public.update_system_statistics();