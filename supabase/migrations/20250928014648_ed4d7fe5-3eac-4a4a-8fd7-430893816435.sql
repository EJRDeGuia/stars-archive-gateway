-- Drop and recreate the can_access_thesis_file function to allow researchers direct access
DROP FUNCTION IF EXISTS public.can_access_thesis_file(uuid, uuid);

CREATE OR REPLACE FUNCTION public.can_access_thesis_file(_thesis_id uuid, _user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_role_record record;
  thesis_exists boolean;
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
  
  -- Allow direct access for researchers, archivists, and admins
  IF user_role_record.role IN ('researcher', 'archivist', 'admin') THEN
    RETURN true;
  END IF;
  
  -- Deny access for all other cases
  RETURN false;
END;
$function$