-- Fix all remaining database functions with search_path security parameter
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert a default 'researcher' role for new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'researcher')
  ON CONFLICT DO NOTHING;
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.security_monitor_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.trigger_update_statistics()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM update_system_statistics();
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.simple_stats_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only update stats every 100th thesis or so to avoid constant updates
  IF (NEW.id::text ~ '00$') THEN
    PERFORM update_system_statistics();
  END IF;
  RETURN NEW;
END;
$function$;