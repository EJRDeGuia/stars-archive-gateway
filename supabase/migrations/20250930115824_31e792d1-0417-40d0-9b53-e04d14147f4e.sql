-- Create function to check if IP is in authorized network
CREATE OR REPLACE FUNCTION public.is_authorized_network(_ip_address inet)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  authorized_ranges text[] := ARRAY[
    '10.0.0.0/8',      -- Private network range
    '172.16.0.0/12',   -- Private network range  
    '192.168.0.0/16',  -- Private network range
    '127.0.0.1/32'     -- Localhost
  ];
  ip_range text;
BEGIN
  -- Allow localhost
  IF _ip_address = '127.0.0.1'::inet THEN
    RETURN true;
  END IF;
  
  -- Check each authorized range
  FOREACH ip_range IN ARRAY authorized_ranges
  LOOP
    IF _ip_address << ip_range::inet THEN
      RETURN true;
    END IF;
  END LOOP;
  
  RETURN false;
END;
$$;

-- Update can_access_thesis_file to check network restrictions
CREATE OR REPLACE FUNCTION public.can_access_thesis_file(_thesis_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_role_record record;
  thesis_exists boolean;
  client_ip inet;
  bypass_enabled boolean := false;
BEGIN
  -- Check if thesis exists and is approved
  SELECT EXISTS(
    SELECT 1 FROM public.theses 
    WHERE id = _thesis_id 
    AND status = 'approved'
  ) INTO thesis_exists;
  
  IF NOT thesis_exists THEN
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
  
  -- Get client IP from request headers
  BEGIN
    client_ip := inet(current_setting('request.headers', true)::jsonb->>'x-forwarded-for');
  EXCEPTION
    WHEN OTHERS THEN
      -- If we can't get the IP, deny access
      RETURN false;
  END;
  
  -- Check if network access is authorized
  IF NOT public.is_authorized_network(client_ip) THEN
    -- Log unauthorized network access attempt
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