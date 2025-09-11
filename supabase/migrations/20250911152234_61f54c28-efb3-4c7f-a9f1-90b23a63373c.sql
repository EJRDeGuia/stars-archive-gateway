-- Fix the final remaining database functions with search_path security parameter
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.has_elevated_access(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('archivist', 'admin')
  )
$function$;

CREATE OR REPLACE FUNCTION public.is_admin_or_archivist(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'archivist')
  )
$function$;

CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission_type text, _resource_type text DEFAULT NULL::text, _resource_id uuid DEFAULT NULL::uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if user has the specific permission
  RETURN EXISTS (
    SELECT 1 FROM public.user_permissions
    WHERE user_id = _user_id
      AND permission_type = _permission_type
      AND (_resource_type IS NULL OR resource_type = _resource_type)
      AND (_resource_id IS NULL OR resource_id = _resource_id)
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now())
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_views_analytics(days_back integer DEFAULT 7)
 RETURNS TABLE(date date, views bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT 
    viewed_at::date as date,
    COUNT(*) as views
  FROM public.thesis_views 
  WHERE viewed_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
  GROUP BY viewed_at::date
  ORDER BY date;
$function$;