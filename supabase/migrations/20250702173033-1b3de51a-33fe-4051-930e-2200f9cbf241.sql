-- Fix theses table - remove duplicate policies and secure properly
DROP POLICY IF EXISTS "Anyone can insert theses" ON public.theses;
DROP POLICY IF EXISTS "Anyone can read theses" ON public.theses;
DROP POLICY IF EXISTS "Anyone can view approved theses" ON public.theses;
DROP POLICY IF EXISTS "Archivists and admins can insert theses" ON public.theses;
DROP POLICY IF EXISTS "Archivists and admins can update theses" ON public.theses;

-- Create secure and efficient theses policies
CREATE POLICY "Anyone can view approved theses"
  ON public.theses
  FOR SELECT
  USING (
    status = 'approved'::thesis_status OR 
    public.has_elevated_access(auth.uid())
  );

CREATE POLICY "Only archivists can insert theses"
  ON public.theses
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'archivist') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only archivists and admins can update theses"
  ON public.theses
  FOR UPDATE
  USING (public.has_elevated_access(auth.uid()))
  WITH CHECK (public.has_elevated_access(auth.uid()));

-- Add missing thesis access request policies for admins/archivists
CREATE POLICY "Archivists and admins can manage access requests"
  ON public.thesis_access_requests
  FOR ALL
  USING (public.has_elevated_access(auth.uid()))
  WITH CHECK (public.has_elevated_access(auth.uid()));

-- Improve performance with better indexing for RLS
CREATE INDEX IF NOT EXISTS idx_collections_created_by ON public.collections(created_by);
CREATE INDEX IF NOT EXISTS idx_collections_public ON public.collections(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_theses_status ON public.theses(status);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_theses_collection_id ON public.collection_theses(collection_id);