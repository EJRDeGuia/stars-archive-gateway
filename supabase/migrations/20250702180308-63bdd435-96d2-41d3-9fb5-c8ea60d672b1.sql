-- Create optimized function to get thesis counts by college
CREATE OR REPLACE FUNCTION public.get_college_thesis_counts()
RETURNS TABLE(
  college_id uuid,
  college_name text,
  thesis_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    c.id as college_id,
    c.name as college_name,
    COUNT(t.id) as thesis_count
  FROM public.colleges c
  LEFT JOIN public.theses t ON c.id = t.college_id AND t.status = 'approved'
  GROUP BY c.id, c.name
  ORDER BY c.name;
$$;