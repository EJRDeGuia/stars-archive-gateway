
-- 1. Create enum type for app roles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'archivist', 'researcher', 'guest_researcher');
  END IF;
END $$;

-- 2. Create user_roles table for mapping user_id <-> role
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 3. Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Grant insert/select for your app's service role (and for future RLS policies)
GRANT SELECT, INSERT ON public.user_roles TO anon, authenticated, service_role;

-- 5. Ensure public.has_role function exists (replaces the Supabase one)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 6. (Optional) Add a policy so users can view their own roles
CREATE POLICY "Users can view their roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- 7. (Optional) Insert an archivist role for your test user (replace UUID below)
-- INSERT INTO public.user_roles (user_id, role) VALUES ('YOUR_USER_UUID', 'archivist') ON CONFLICT DO NOTHING;
