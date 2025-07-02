
-- First, let's check what policies currently exist and then fix them
-- Drop any conflicting policies that might be causing issues
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.user_favorites;

-- Create proper RLS policies for user_favorites table
-- Policy for SELECT operations
CREATE POLICY "Users can view their own favorites" 
  ON public.user_favorites 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for INSERT operations
CREATE POLICY "Users can add their own favorites" 
  ON public.user_favorites 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for DELETE operations
CREATE POLICY "Users can remove their own favorites" 
  ON public.user_favorites 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Policy for UPDATE operations (in case needed)
CREATE POLICY "Users can update their own favorites" 
  ON public.user_favorites 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
