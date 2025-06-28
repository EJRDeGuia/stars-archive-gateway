
-- Fix any remaining references to profiles table in system statistics
CREATE OR REPLACE FUNCTION public.update_system_statistics()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update total theses count
  INSERT INTO public.system_statistics (stat_key, stat_label, stat_value, updated_at)
  VALUES ('total_theses', 'Total Theses', (SELECT COUNT(*) FROM public.theses WHERE status = 'approved'), now())
  ON CONFLICT (stat_key) DO UPDATE SET
    stat_value = EXCLUDED.stat_value,
    updated_at = EXCLUDED.updated_at;
  
  -- Update total colleges count
  INSERT INTO public.system_statistics (stat_key, stat_label, stat_value, updated_at)
  VALUES ('total_colleges', 'Total Colleges', (SELECT COUNT(*) FROM public.colleges), now())
  ON CONFLICT (stat_key) DO UPDATE SET
    stat_value = EXCLUDED.stat_value,
    updated_at = EXCLUDED.updated_at;
  
  -- Update total collections count
  INSERT INTO public.system_statistics (stat_key, stat_label, stat_value, updated_at)
  VALUES ('total_collections', 'Total Collections', (SELECT COUNT(*) FROM public.collections WHERE is_public = true), now())
  ON CONFLICT (stat_key) DO UPDATE SET
    stat_value = EXCLUDED.stat_value,
    updated_at = EXCLUDED.updated_at;
  
  -- Update active users count (user_roles created in last 30 days)
  INSERT INTO public.system_statistics (stat_key, stat_label, stat_value, updated_at)
  VALUES ('active_users', 'Active Users', (SELECT COUNT(DISTINCT user_id) FROM public.user_roles WHERE created_at > now() - interval '30 days'), now())
  ON CONFLICT (stat_key) DO UPDATE SET
    stat_value = EXCLUDED.stat_value,
    updated_at = EXCLUDED.updated_at;
  
  -- Update monthly uploads count
  INSERT INTO public.system_statistics (stat_key, stat_label, stat_value, updated_at)
  VALUES ('monthly_uploads', 'Monthly Uploads', (SELECT COUNT(*) FROM public.theses WHERE created_at > now() - interval '1 month'), now())
  ON CONFLICT (stat_key) DO UPDATE SET
    stat_value = EXCLUDED.stat_value,
    updated_at = EXCLUDED.updated_at;
  
  -- Update weekly views count
  INSERT INTO public.system_statistics (stat_key, stat_label, stat_value, updated_at)
  VALUES ('weekly_views', 'Weekly Views', (SELECT COUNT(*) FROM public.thesis_views WHERE viewed_at > now() - interval '7 days'), now())
  ON CONFLICT (stat_key) DO UPDATE SET
    stat_value = EXCLUDED.stat_value,
    updated_at = EXCLUDED.updated_at;
END;
$$;
