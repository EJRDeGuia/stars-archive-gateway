
-- Drop the profiles table since we'll use user_roles instead
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create enum type for app roles if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'archivist', 'researcher', 'guest_researcher');
  END IF;
END $$;

-- Create user_roles table for mapping user_id <-> role
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT, INSERT ON public.user_roles TO anon, authenticated, service_role;

-- Create function to check roles (replaces the profile-based approach)
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

-- Policy so users can view their own roles
CREATE POLICY "Users can view their roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Update the update_thesis_status function to use user_roles instead of profiles
CREATE OR REPLACE FUNCTION public.update_thesis_status(thesis_uuid uuid, new_status thesis_status, user_uuid uuid)
RETURNS TABLE(success boolean, message text, thesis_id uuid, thesis_title text, old_status thesis_status, updated_status thesis_status)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  thesis_record RECORD;
  user_is_admin BOOLEAN;
BEGIN
  -- Check if user is admin using user_roles table
  SELECT public.has_role(user_uuid, 'admin') INTO user_is_admin;
  
  IF NOT user_is_admin THEN
    RETURN QUERY SELECT FALSE, 'Only administrators can update thesis status', NULL::UUID, NULL::TEXT, NULL::thesis_status, NULL::thesis_status;
    RETURN;
  END IF;
  
  -- Get the current thesis
  SELECT * FROM theses WHERE id = thesis_uuid INTO thesis_record;
  
  IF thesis_record.id IS NULL THEN
    RETURN QUERY SELECT FALSE, 'Thesis not found', NULL::UUID, NULL::TEXT, NULL::thesis_status, NULL::thesis_status;
    RETURN;
  END IF;
  
  -- Update the thesis status
  UPDATE theses 
  SET status = new_status, updated_at = NOW()
  WHERE id = thesis_uuid;
  
  -- Return success with details
  RETURN QUERY SELECT 
    TRUE, 
    'Thesis status updated successfully',
    thesis_record.id,
    thesis_record.title,
    thesis_record.status,
    new_status;
END;
$$;
