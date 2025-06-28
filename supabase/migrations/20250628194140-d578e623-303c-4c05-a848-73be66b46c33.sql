
-- Drop the trigger first to remove the dependency
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Now drop the old handle_new_user function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Update the has_elevated_access function to use user_roles instead of profiles
CREATE OR REPLACE FUNCTION public.has_elevated_access(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('archivist', 'admin')
  )
$$;

-- Update the is_admin_or_archivist function to use user_roles instead of profiles
CREATE OR REPLACE FUNCTION public.is_admin_or_archivist(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'archivist')
  )
$$;

-- Create a new trigger function for user_roles (optional, for when users sign up)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Insert a default 'researcher' role for new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'researcher')
  ON CONFLICT DO NOTHING;
  RETURN new;
END;
$$;

-- Recreate the trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
