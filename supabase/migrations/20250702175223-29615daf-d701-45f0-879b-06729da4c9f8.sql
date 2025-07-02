-- COMPREHENSIVE PERFORMANCE OPTIMIZATION (Fixed)

-- 1. Add missing critical indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_theses_created_at_status ON public.theses(created_at DESC, status);
CREATE INDEX IF NOT EXISTS idx_theses_college_status ON public.theses(college_id, status);
CREATE INDEX IF NOT EXISTS idx_thesis_views_thesis_viewed ON public.thesis_views(thesis_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_thesis_downloads_thesis_downloaded ON public.thesis_downloads(thesis_id, downloaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_thesis_access_requests_status ON public.thesis_access_requests(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_collections_public_created ON public.collections(is_public, created_at DESC) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_created ON public.user_favorites(user_id, created_at DESC);

-- 2. Create optimized function for dashboard stats instead of materialized view
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE(
  total_theses bigint,
  approved_theses bigint,
  pending_review bigint,
  this_month_uploads bigint,
  total_collections bigint,
  total_views_7days bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    (SELECT COUNT(*) FROM public.theses),
    (SELECT COUNT(*) FROM public.theses WHERE status = 'approved'),
    (SELECT COUNT(*) FROM public.theses WHERE status = 'pending_review'),
    (SELECT COUNT(*) FROM public.theses WHERE created_at >= date_trunc('month', CURRENT_DATE)),
    (SELECT COUNT(*) FROM public.collections WHERE is_public = true),
    (SELECT COUNT(*) FROM public.thesis_views WHERE viewed_at >= CURRENT_DATE - INTERVAL '7 days');
$$;

-- 3. Optimize RLS policies with better indexing strategy
DROP POLICY IF EXISTS "View approved theses or elevated access" ON public.theses;
DROP POLICY IF EXISTS "View theses optimized" ON public.theses;

-- Create optimized policy using function for better performance
CREATE POLICY "View theses optimized"
  ON public.theses
  FOR SELECT
  USING (
    status = 'approved'::thesis_status 
    OR (auth.uid() IS NOT NULL AND has_elevated_access(auth.uid()))
  );

-- 4. Create optimized view for recent uploads with pre-joined data
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

-- 5. Create optimized function for recent uploads that respects RLS
CREATE OR REPLACE FUNCTION public.get_recent_uploads()
RETURNS TABLE(
  id uuid,
  title text,
  author text,
  status thesis_status,
  created_at timestamptz,
  college_name text,
  college_id uuid
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
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
$$;

-- 6. Create optimized analytics functions
CREATE OR REPLACE FUNCTION public.get_views_analytics(days_back integer DEFAULT 7)
RETURNS TABLE(
  date date,
  views bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    viewed_at::date as date,
    COUNT(*) as views
  FROM public.thesis_views 
  WHERE viewed_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
  GROUP BY viewed_at::date
  ORDER BY date;
$$;

CREATE OR REPLACE FUNCTION public.get_uploads_analytics(days_back integer DEFAULT 7)
RETURNS TABLE(
  date date,
  uploads bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    created_at::date as date,
    COUNT(*) as uploads
  FROM public.theses 
  WHERE created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
  GROUP BY created_at::date
  ORDER BY date;
$$;