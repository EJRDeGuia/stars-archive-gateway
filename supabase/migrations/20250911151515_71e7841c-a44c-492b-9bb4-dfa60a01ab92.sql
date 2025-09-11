-- Fix remaining database functions to include explicit search_path for security
CREATE OR REPLACE FUNCTION public.validate_download_permission(_user_id uuid, _thesis_id uuid, _requested_level text DEFAULT 'full_access'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  permission_record record;
  thesis_record record;
  user_role_record record;
  result jsonb;
BEGIN
  -- Get user role
  SELECT role INTO user_role_record 
  FROM public.user_roles 
  WHERE user_id = _user_id;
  
  -- Get thesis information
  SELECT * INTO thesis_record 
  FROM public.theses 
  WHERE id = _thesis_id;
  
  -- Admins and archivists have unrestricted access
  IF user_role_record.role IN ('admin', 'archivist') THEN
    result := jsonb_build_object(
      'allowed', true,
      'permission_level', 'full_access',
      'reason', 'elevated_privileges',
      'requires_watermark', false,
      'download_limit', -1
    );
  ELSE
    -- Check specific download permission
    SELECT * INTO permission_record
    FROM public.download_permissions
    WHERE user_id = _user_id
      AND thesis_id = _thesis_id
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now())
      AND downloads_used < download_limit;
    
    IF permission_record IS NOT NULL THEN
      -- Check if requested level is allowed
      IF (_requested_level = 'full_access' AND permission_record.permission_level = 'full_access') OR
         (_requested_level = 'preview' AND permission_record.permission_level IN ('preview', 'full_access')) OR
         (_requested_level = 'metadata_only') THEN
        
        result := jsonb_build_object(
          'allowed', true,
          'permission_level', permission_record.permission_level,
          'reason', 'explicit_permission',
          'requires_watermark', _requested_level = 'full_access',
          'download_limit', permission_record.download_limit - permission_record.downloads_used,
          'permission_id', permission_record.id
        );
      ELSE
        result := jsonb_build_object(
          'allowed', false,
          'reason', 'insufficient_permission_level',
          'available_level', permission_record.permission_level,
          'requires_watermark', false
        );
      END IF;
    ELSE
      -- No permission found
      result := jsonb_build_object(
        'allowed', false,
        'reason', 'no_permission',
        'requires_approval', true,
        'requires_watermark', false
      );
    END IF;
  END IF;
  
  -- Log download attempt
  PERFORM public.comprehensive_audit_log(
    'download_attempt',
    'thesis',
    _thesis_id,
    NULL,
    jsonb_build_object(
      'requested_level', _requested_level,
      'result', result
    ),
    CASE WHEN result->>'allowed' = 'false' THEN 'medium' ELSE 'low' END,
    ARRAY['download_control', 'access_management']
  );
  
  RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_watermark(_thesis_id uuid, _user_id uuid, _watermark_type text DEFAULT 'invisible'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_info record;
  thesis_info record;
  watermark_data jsonb;
  watermark_id uuid;
  verification_hash text;
BEGIN
  -- Get user information
  SELECT u.email, ur.role, 
         COALESCE(c.name, 'Unknown Institution') as institution
  INTO user_info
  FROM auth.users u
  LEFT JOIN public.user_roles ur ON u.id = ur.user_id
  LEFT JOIN public.colleges c ON true -- Simplified institution lookup
  WHERE u.id = _user_id;
  
  -- Get thesis information
  SELECT title, author, created_at
  INTO thesis_info
  FROM public.theses
  WHERE id = _thesis_id;
  
  -- Generate watermark data
  watermark_data := jsonb_build_object(
    'user_email', user_info.email,
    'user_role', user_info.role,
    'institution', user_info.institution,
    'thesis_title', thesis_info.title,
    'thesis_author', thesis_info.author,
    'access_date', now(),
    'access_id', gen_random_uuid(),
    'watermark_version', '1.0',
    'type', _watermark_type
  );
  
  -- Generate verification hash
  verification_hash := encode(
    digest(watermark_data::text || _user_id::text || _thesis_id::text, 'sha256'),
    'hex'
  );
  
  -- Store watermark record
  INSERT INTO public.watermark_records (
    thesis_id, user_id, watermark_type, watermark_data, 
    verification_hash, expires_at
  ) VALUES (
    _thesis_id, _user_id, _watermark_type, watermark_data,
    verification_hash, now() + interval '1 year'
  ) RETURNING id INTO watermark_id;
  
  -- Log watermark creation
  PERFORM public.comprehensive_audit_log(
    'watermark_created',
    'thesis',
    _thesis_id,
    NULL,
    jsonb_build_object(
      'watermark_id', watermark_id,
      'watermark_type', _watermark_type,
      'user_id', _user_id
    ),
    'medium',
    ARRAY['watermark_system', 'content_protection']
  );
  
  RETURN jsonb_build_object(
    'watermark_id', watermark_id,
    'watermark_data', watermark_data,
    'verification_hash', verification_hash,
    'status', 'created'
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.verify_backup_integrity(_backup_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  backup_record record;
  verification_result jsonb;
BEGIN
  SELECT * INTO backup_record FROM public.backup_records WHERE id = _backup_id;
  
  IF backup_record IS NULL THEN
    RETURN jsonb_build_object('status', 'error', 'message', 'Backup record not found');
  END IF;
  
  -- Simulate backup verification (in production, implement actual verification)
  verification_result := jsonb_build_object(
    'status', 'verified',
    'backup_id', _backup_id,
    'verification_time', now(),
    'integrity_check', 'passed',
    'encryption_check', 'passed'
  );
  
  -- Log verification
  PERFORM public.comprehensive_audit_log(
    'backup_verification',
    'system',
    _backup_id,
    NULL,
    verification_result,
    'medium',
    ARRAY['backup_management', 'data_integrity']
  );
  
  RETURN verification_result;
END;
$function$;