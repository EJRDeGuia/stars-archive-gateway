
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view their roles" ON public.user_roles;

-- Create a more permissive policy that allows inserts for development
CREATE POLICY "Users can manage their roles"
  ON public.user_roles
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions for the service role
GRANT ALL ON public.user_roles TO service_role;

-- Also ensure the has_role function has proper permissions
GRANT EXECUTE ON FUNCTION public.has_role TO anon, authenticated, service_role;
