-- Add missing columns to audit_logs table if they don't exist
DO $$ 
BEGIN
    -- Add severity column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'severity') THEN
        ALTER TABLE public.audit_logs ADD COLUMN severity text DEFAULT 'low'::text;
    END IF;
    
    -- Add category column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'category') THEN
        ALTER TABLE public.audit_logs ADD COLUMN category text DEFAULT 'general'::text;
    END IF;
END $$;

-- Create indexes for better performance on audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON public.audit_logs (resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON public.audit_logs (severity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_category ON public.audit_logs (category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_address ON public.audit_logs (ip_address);

-- Enable real-time for audit logs
ALTER TABLE public.audit_logs REPLICA IDENTITY FULL;

-- Add audit_logs to realtime publication if not already added
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;
    EXCEPTION
        WHEN duplicate_object THEN
            -- Table already in publication, ignore
            NULL;
    END;
END $$;

-- Create enhanced audit logging function
CREATE OR REPLACE FUNCTION public.log_audit_event(
    _action text,
    _resource_type text,
    _resource_id uuid DEFAULT NULL,
    _details jsonb DEFAULT NULL,
    _ip_address text DEFAULT NULL,
    _user_agent text DEFAULT NULL,
    _severity text DEFAULT 'low',
    _category text DEFAULT 'general'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    audit_id uuid;
    current_user_id uuid;
BEGIN
    current_user_id := auth.uid();
    
    -- Determine severity automatically if not specified
    IF _severity = 'low' THEN
        IF _action ILIKE '%delete%' OR _action ILIKE '%unauthorized%' OR _action ILIKE '%failed%' THEN
            _severity := 'high';
        ELSIF _action ILIKE '%login%' OR _action ILIKE '%create%' THEN
            _severity := 'medium';
        END IF;
    END IF;
    
    -- Insert audit log entry
    INSERT INTO public.audit_logs (
        user_id, action, resource_type, resource_id, 
        details, ip_address, user_agent, severity, category
    ) VALUES (
        current_user_id, _action, _resource_type, _resource_id,
        _details, inet(_ip_address), _user_agent, _severity, _category
    ) RETURNING id INTO audit_id;
    
    -- Create security alert for critical actions
    IF _severity IN ('critical', 'high') THEN
        INSERT INTO public.security_alerts (
            user_id, alert_type, severity, title, description, metadata
        ) VALUES (
            current_user_id,
            'audit_alert',
            _severity,
            format('High Priority Audit Event: %s', _action),
            format('User performed %s action on %s', _action, _resource_type),
            jsonb_build_object(
                'audit_id', audit_id,
                'action', _action,
                'resource_type', _resource_type,
                'resource_id', _resource_id
            )
        );
    END IF;
    
    RETURN audit_id;
END;
$$;

-- Update the existing comprehensive audit log function to use the new columns
CREATE OR REPLACE FUNCTION public.comprehensive_audit_log(
    _action text,
    _resource_type text, 
    _resource_id uuid DEFAULT NULL,
    _old_data jsonb DEFAULT NULL,
    _new_data jsonb DEFAULT NULL,
    _risk_level text DEFAULT 'low',
    _compliance_tags text[] DEFAULT '{}',
    _additional_metadata jsonb DEFAULT '{}'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    audit_id uuid;
    enhanced_details jsonb;
    current_user_id uuid;
    session_info jsonb;
    severity_level text;
    audit_category text;
BEGIN
    current_user_id := auth.uid();
    
    -- Determine category based on resource type
    audit_category := CASE 
        WHEN _resource_type IN ('thesis', 'thesis_files') THEN 'academic_data'
        WHEN _resource_type IN ('user_roles', 'permissions') THEN 'access_control'
        WHEN _resource_type IN ('security_alerts', 'audit_logs') THEN 'security'
        WHEN _resource_type IN ('system_settings', 'backup') THEN 'system_admin'
        ELSE 'general'
    END;
    
    -- Map risk level to severity
    severity_level := CASE _risk_level
        WHEN 'critical' THEN 'critical'
        WHEN 'high' THEN 'high' 
        WHEN 'medium' THEN 'medium'
        ELSE 'low'
    END;
    
    -- Build comprehensive session information
    session_info := jsonb_build_object(
        'user_id', current_user_id,
        'timestamp', now(),
        'action', _action,
        'resource', _resource_type,
        'ip_address', current_setting('request.headers', true)::jsonb->>'x-forwarded-for',
        'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent'
    );
    
    -- Build enhanced audit details
    enhanced_details := jsonb_build_object(
        'old_data', _old_data,
        'new_data', _new_data,
        'risk_level', _risk_level,
        'compliance_tags', _compliance_tags,
        'session_info', session_info,
        'additional', _additional_metadata,
        'data_classification', audit_category
    );
    
    -- Insert comprehensive audit log
    INSERT INTO public.audit_logs (
        user_id, action, resource_type, resource_id, 
        details, ip_address, user_agent, severity, category
    ) VALUES (
        current_user_id,
        _action,
        _resource_type,
        _resource_id,
        enhanced_details,
        inet(current_setting('request.headers', true)::jsonb->>'x-forwarded-for'),
        current_setting('request.headers', true)::jsonb->>'user-agent',
        severity_level,
        audit_category
    ) RETURNING id INTO audit_id;
    
    -- Create compliance audit record for sensitive actions
    IF severity_level IN ('high', 'critical') OR _resource_type IN ('thesis', 'user_roles') THEN
        INSERT INTO public.security_alerts (
            user_id, alert_type, severity, title, description, metadata
        ) VALUES (
            current_user_id,
            'compliance_audit',
            CASE WHEN severity_level = 'critical' THEN 'high' ELSE 'medium' END,
            format('Compliance Audit: %s', _action),
            format('High-risk action "%s" performed on %s by user %s', _action, _resource_type, current_user_id),
            jsonb_build_object(
                'audit_id', audit_id,
                'compliance_tags', _compliance_tags,
                'risk_assessment', _risk_level,
                'requires_review', severity_level = 'critical'
            )
        );
    END IF;
    
    RETURN audit_id;
END;
$$;