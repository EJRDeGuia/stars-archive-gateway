
-- Create table for thesis access requests
CREATE TABLE public.thesis_access_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thesis_id UUID NOT NULL,
  user_id UUID NOT NULL,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  institution TEXT,
  purpose TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Add Row Level Security
ALTER TABLE public.thesis_access_requests ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own requests
CREATE POLICY "Users can view their own requests"
  ON public.thesis_access_requests
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy for users to create their own requests
CREATE POLICY "Users can create requests"
  ON public.thesis_access_requests
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policy for archivists and admins to view all requests
CREATE POLICY "Archivists and admins can view all requests"
  ON public.thesis_access_requests
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('archivist', 'admin')
    )
  );

-- Function to check if user has elevated access (archivist or admin)
CREATE OR REPLACE FUNCTION public.has_elevated_access(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role IN ('archivist', 'admin')
  )
$$;

-- Add trigger to update updated_at
CREATE TRIGGER update_thesis_access_requests_updated_at
  BEFORE UPDATE ON public.thesis_access_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
