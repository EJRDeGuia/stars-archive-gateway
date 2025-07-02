-- CRITICAL SECURITY FIX: Remove dangerous overly permissive policies

-- Fix user_roles table - MOST CRITICAL
DROP POLICY IF EXISTS "Users can manage their roles" ON public.user_roles;

-- Create secure role policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Fix collections table
DROP POLICY IF EXISTS "collections_select_policy" ON public.collections;
DROP POLICY IF EXISTS "collections_insert_policy" ON public.collections;
DROP POLICY IF EXISTS "collections_update_policy" ON public.collections;
DROP POLICY IF EXISTS "collections_delete_policy" ON public.collections;

-- Create secure collection policies
CREATE POLICY "Anyone can view public collections"
  ON public.collections
  FOR SELECT
  USING (is_public = true OR created_by = auth.uid() OR public.has_elevated_access(auth.uid()));

CREATE POLICY "Authenticated users can create collections"
  ON public.collections
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Owners and admins can update collections"
  ON public.collections
  FOR UPDATE
  USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners and admins can delete collections"
  ON public.collections
  FOR DELETE
  USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Fix collection_theses table
DROP POLICY IF EXISTS "collection_theses_select_policy" ON public.collection_theses;
DROP POLICY IF EXISTS "collection_theses_insert_policy" ON public.collection_theses;
DROP POLICY IF EXISTS "collection_theses_update_policy" ON public.collection_theses;
DROP POLICY IF EXISTS "collection_theses_delete_policy" ON public.collection_theses;

-- Create secure collection_theses policies
CREATE POLICY "Users can view collection theses for accessible collections"
  ON public.collection_theses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.collections c 
      WHERE c.id = collection_id 
      AND (c.is_public = true OR c.created_by = auth.uid() OR public.has_elevated_access(auth.uid()))
    )
  );

CREATE POLICY "Collection owners and archivists can manage collection theses"
  ON public.collection_theses
  FOR ALL
  USING (
    public.has_elevated_access(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.collections c 
      WHERE c.id = collection_id AND c.created_by = auth.uid()
    )
  )
  WITH CHECK (
    public.has_elevated_access(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.collections c 
      WHERE c.id = collection_id AND c.created_by = auth.uid()
    )
  );