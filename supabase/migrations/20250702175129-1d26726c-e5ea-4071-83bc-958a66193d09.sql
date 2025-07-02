-- COMPREHENSIVE PERFORMANCE OPTIMIZATION

-- 1. Add missing critical indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_theses_created_at_status ON public.theses(created_at DESC, status);
CREATE INDEX IF NOT EXISTS idx_theses_college_status ON public.theses(college_id, status);
CREATE INDEX IF NOT EXISTS idx_thesis_views_thesis_viewed ON public.thesis_views(thesis_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_thesis_downloads_thesis_downloaded ON public.thesis_downloads(thesis_id, downloaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_thesis_access_requests_status ON public.thesis_access_requests(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_collections_public_created ON public.collections(is_public, created_at DESC) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_created ON public.user_favorites(user_id, created_at DESC);

-- 2. Create materialized view for dashboard statistics (much faster than live queries)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.dashboard_stats AS
SELECT 
  'total_theses' as stat_key,
  COUNT(*) as stat_value,
  NOW() as last_updated
FROM public.theses
UNION ALL
SELECT 
  'approved_theses' as stat_key,
  COUNT(*) as stat_value,
  NOW() as last_updated
FROM public.theses WHERE status = 'approved'
UNION ALL
SELECT 
  'pending_review' as stat_key,
  COUNT(*) as stat_value,
  NOW() as last_updated
FROM public.theses WHERE status = 'pending_review'
UNION ALL
SELECT 
  'this_month_uploads' as stat_key,
  COUNT(*) as stat_value,
  NOW() as last_updated
FROM public.theses 
WHERE created_at >= date_trunc('month', CURRENT_DATE)
UNION ALL
SELECT 
  'total_collections' as stat_key,
  COUNT(*) as stat_value,
  NOW() as last_updated
FROM public.collections WHERE is_public = true
UNION ALL
SELECT 
  'total_views_7days' as stat_key,
  COUNT(*) as stat_value,
  NOW() as last_updated
FROM public.thesis_views 
WHERE viewed_at >= CURRENT_DATE - INTERVAL '7 days';

-- 3. Create unique index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_stats_key ON public.dashboard_stats(stat_key);

-- 4. Create function to refresh materialized view efficiently
CREATE OR REPLACE FUNCTION public.refresh_dashboard_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.dashboard_stats;
END;
$$;

-- 5. Optimize RLS policies with better indexing strategy
DROP POLICY IF EXISTS "View approved theses or elevated access" ON public.theses;

-- Create optimized policy using function for better performance
CREATE POLICY "View theses optimized"
  ON public.theses
  FOR SELECT
  USING (
    status = 'approved'::thesis_status 
    OR (auth.uid() IS NOT NULL AND has_elevated_access(auth.uid()))
  );

-- 6. Create optimized view for recent uploads with pre-joined data
CREATE OR REPLACE VIEW public.recent_uploads_view AS
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

-- 7. Add RLS policy for the materialized view
ALTER TABLE public.dashboard_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dashboard stats viewable by elevated users"
  ON public.dashboard_stats
  FOR SELECT
  USING (has_elevated_access(auth.uid()));

-- 8. Create trigger to auto-refresh stats periodically
CREATE OR REPLACE FUNCTION public.auto_refresh_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Only refresh every 10th operation to avoid constant updates
  IF (NEW.id::text ~ '[05]$') THEN
    PERFORM refresh_dashboard_stats();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS auto_stats_refresh ON public.theses;
CREATE TRIGGER auto_stats_refresh
  AFTER INSERT OR UPDATE ON public.theses
  FOR EACH ROW
  EXECUTE FUNCTION auto_refresh_stats();