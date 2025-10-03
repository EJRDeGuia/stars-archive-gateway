-- Fix can_access_thesis_file to allow admins/archivists to view pending theses during review
CREATE OR REPLACE FUNCTION public.can_access_thesis_file(_thesis_id uuid, _user_id uuid, _bypass_network_check boolean DEFAULT false)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role_record record;
  thesis_record record;
  client_ip inet;
BEGIN
  -- Get thesis status and existence
  SELECT id, status INTO thesis_record
  FROM public.theses 
  WHERE id = _thesis_id;
  
  IF thesis_record.id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get user role
  SELECT role INTO user_role_record 
  FROM public.user_roles 
  WHERE user_id = _user_id;
  
  -- Only allow researchers, archivists, and admins
  IF user_role_record.role NOT IN ('researcher', 'archivist', 'admin') THEN
    RETURN false;
  END IF;
  
  -- Admins and archivists can access ANY thesis (including pending ones for review)
  IF user_role_record.role IN ('archivist', 'admin') THEN
    -- Log that elevated access was used
    INSERT INTO public.audit_logs (
      user_id, action, resource_type, resource_id, details, severity, category
    ) VALUES (
      _user_id,
      'elevated_file_access',
      'thesis',
      _thesis_id,
      jsonb_build_object(
        'user_role', user_role_record.role,
        'thesis_status', thesis_record.status,
        'timestamp', now()
      ),
      'low',
      'access_control'
    );
    
    RETURN true;
  END IF;
  
  -- For researchers, thesis must be approved
  IF thesis_record.status != 'approved' THEN
    RETURN false;
  END IF;
  
  -- If bypass is enabled for testing, skip network check
  IF _bypass_network_check THEN
    INSERT INTO public.audit_logs (
      user_id, action, resource_type, resource_id, details, severity, category
    ) VALUES (
      _user_id,
      'network_bypass_used',
      'thesis',
      _thesis_id,
      jsonb_build_object(
        'bypass_enabled', true,
        'user_role', user_role_record.role,
        'timestamp', now()
      ),
      'low',
      'access_control'
    );
    
    RETURN true;
  END IF;
  
  -- Get client IP from request headers
  BEGIN
    client_ip := inet(current_setting('request.headers', true)::jsonb->>'x-forwarded-for');
  EXCEPTION
    WHEN OTHERS THEN
      RETURN false;
  END;
  
  -- Check if network access is authorized
  IF NOT public.is_authorized_network(client_ip) THEN
    INSERT INTO public.security_alerts (
      user_id, alert_type, severity, title, description, metadata, ip_address
    ) VALUES (
      _user_id,
      'unauthorized_network_access',
      'high',
      'Unauthorized Network Access Attempt',
      format('User attempted to access thesis from unauthorized network: %s', client_ip),
      jsonb_build_object(
        'thesis_id', _thesis_id,
        'client_ip', client_ip,
        'user_role', user_role_record.role
      ),
      client_ip
    );
    
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;