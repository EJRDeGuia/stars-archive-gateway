-- Drop existing function if exists
DROP FUNCTION IF EXISTS public.generate_security_report(timestamp with time zone, timestamp with time zone);

-- Create system notification broadcast function
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
SET search_path = 'public'
AS $$
DECLARE
  notification_id uuid;
  target_user record;
  notifications_created integer := 0;
BEGIN
  -- Get all users with specified roles
  FOR target_user IN 
    SELECT DISTINCT ur.user_id
    FROM user_roles ur
    WHERE ur.role = ANY(_target_roles)
  LOOP
    -- Create notification for each user
    INSERT INTO notifications (
      user_id, title, message, type, expires_at
    ) VALUES (
      target_user.user_id, _title, _message, _type, _expires_at
    ) RETURNING id INTO notification_id;
    
    notifications_created := notifications_created + 1;
  END LOOP;
  
  -- Log the broadcast
  PERFORM comprehensive_audit_log(
    'system_notification_broadcast',
    'notification',
    notification_id,
    NULL,
    jsonb_build_object(
      'title', _title,
      'type', _type,
      'target_roles', _target_roles,
      'notifications_created', notifications_created
    ),
    'low',
    ARRAY['notification_system', 'communication']
  );
  
  RETURN notification_id;
END;
$$;

-- Create security report generation function
CREATE OR REPLACE FUNCTION public.generate_security_report(
  _start_date timestamp with time zone,
  _end_date timestamp with time zone
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  report_data jsonb;
  alert_stats jsonb;
  session_stats jsonb;
  login_stats jsonb;
BEGIN
  -- Gather security alerts statistics
  SELECT jsonb_build_object(
    'total_alerts', COUNT(*),
    'resolved_alerts', COUNT(*) FILTER (WHERE resolved = true),
    'unresolved_alerts', COUNT(*) FILTER (WHERE resolved = false),
    'high_severity', COUNT(*) FILTER (WHERE severity = 'high'),
    'medium_severity', COUNT(*) FILTER (WHERE severity = 'medium'),
    'low_severity', COUNT(*) FILTER (WHERE severity = 'low'),
    'alert_types', ARRAY_AGG(DISTINCT alert_type)
  ) INTO alert_stats
  FROM security_alerts
  WHERE created_at BETWEEN _start_date AND _end_date;
  
  -- Gather session activity statistics
  SELECT jsonb_build_object(
    'total_sessions', COUNT(*),
    'active_sessions', COUNT(*) FILTER (WHERE is_active = true),
    'unique_users', COUNT(DISTINCT user_id),
    'unique_ips', COUNT(DISTINCT ip_address),
    'average_session_duration', COALESCE(
      EXTRACT(EPOCH FROM AVG(last_activity - created_at)) / 60, 0
    )
  ) INTO session_stats
  FROM session_tracking
  WHERE created_at BETWEEN _start_date AND _end_date;
  
  -- Gather failed login statistics
  SELECT jsonb_build_object(
    'total_failed_attempts', COUNT(*),
    'unique_ips_blocked', COUNT(DISTINCT ip_address) FILTER (WHERE blocked_until IS NOT NULL),
    'most_targeted_emails', ARRAY_AGG(DISTINCT email ORDER BY email) FILTER (WHERE email IS NOT NULL)
  ) INTO login_stats
  FROM failed_login_attempts
  WHERE attempted_at BETWEEN _start_date AND _end_date;
  
  -- Build comprehensive report
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

-- Create automatic cleanup function for expired notifications
CREATE OR REPLACE FUNCTION public.cleanup_expired_notifications()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  deleted_count integer;
BEGIN
  -- Delete expired notifications
  WITH deleted AS (
    DELETE FROM notifications
    WHERE expires_at IS NOT NULL 
      AND expires_at < now()
      AND is_read = true
    RETURNING id
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted;
  
  -- Log cleanup if notifications were deleted
  IF deleted_count > 0 THEN
    PERFORM comprehensive_audit_log(
      'notification_cleanup',
      'system',
      NULL,
      NULL,
      jsonb_build_object('deleted_count', deleted_count),
      'low',
      ARRAY['notification_system', 'maintenance']
    );
  END IF;
  
  RETURN deleted_count;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.create_system_notification TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_security_report TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_notifications TO authenticated;