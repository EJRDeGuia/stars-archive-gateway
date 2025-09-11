-- Fix the final remaining database functions with search_path security parameter
CREATE OR REPLACE FUNCTION public.get_uploads_analytics(days_back integer DEFAULT 7)
 RETURNS TABLE(date date, uploads bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT 
    created_at::date as date,
    COUNT(*) as uploads
  FROM public.theses 
  WHERE created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
  GROUP BY created_at::date
  ORDER BY date;
$function$;

CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
 RETURNS TABLE(total_theses bigint, approved_theses bigint, pending_review bigint, this_month_uploads bigint, total_collections bigint, total_views_7days bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT 
    (SELECT COUNT(*) FROM public.theses),
    (SELECT COUNT(*) FROM public.theses WHERE status = 'approved'),
    (SELECT COUNT(*) FROM public.theses WHERE status = 'pending_review'),
    (SELECT COUNT(*) FROM public.theses WHERE created_at >= date_trunc('month', CURRENT_DATE)),
    (SELECT COUNT(*) FROM public.collections WHERE is_public = true),
    (SELECT COUNT(*) FROM public.thesis_views WHERE viewed_at >= CURRENT_DATE - INTERVAL '7 days');
$function$;

CREATE OR REPLACE FUNCTION public.get_college_thesis_counts()
 RETURNS TABLE(college_id uuid, college_name text, thesis_count bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT 
    c.id as college_id,
    c.name as college_name,
    COUNT(t.id) as thesis_count
  FROM public.colleges c
  LEFT JOIN public.theses t ON c.id = t.college_id AND t.status = 'approved'
  GROUP BY c.id, c.name
  ORDER BY c.name;
$function$;

CREATE OR REPLACE FUNCTION public.get_recent_uploads()
 RETURNS TABLE(id uuid, title text, author text, status thesis_status, created_at timestamp with time zone, college_name text, college_id uuid)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  ORDER BY t.created_at DESC
  LIMIT 10;
$function$;