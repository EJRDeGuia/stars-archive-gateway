
-- Phase A: Critical Security & Roles Implementation

-- 1. Make thesis-pdfs bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'thesis-pdfs';

-- 2. Add missing roles to the app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'guest_researcher';

-- 3. Create audit logging table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 4. Create LRC approval requests table
CREATE TABLE IF NOT EXISTS public.lrc_approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  thesis_id UUID REFERENCES public.theses(id) NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('full_text_access', 'download_access')),
  justification TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewer_notes TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, thesis_id, request_type)
);

-- Enable RLS on LRC approval requests
ALTER TABLE public.lrc_approval_requests ENABLE ROW LEVEL SECURITY;

-- 5. Create guest sessions table for temporary access
CREATE TABLE IF NOT EXISTS public.guest_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address INET,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS on guest sessions
ALTER TABLE public.guest_sessions ENABLE ROW LEVEL SECURITY;

-- 6. Fix database function security (set proper search_path)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.has_elevated_access(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('archivist', 'admin')
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_archivist(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'archivist')
  )
$$;

-- 7. Create audit logging function
CREATE OR REPLACE FUNCTION public.log_audit_event(
  _action TEXT,
  _resource_type TEXT,
  _resource_id UUID DEFAULT NULL,
  _details JSONB DEFAULT NULL,
  _ip_address INET DEFAULT NULL,
  _user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    user_id, action, resource_type, resource_id, details, ip_address, user_agent
  )
  VALUES (
    auth.uid(), _action, _resource_type, _resource_id, _details, _ip_address, _user_agent
  )
  RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;

-- 8. Create secure file access checking function
CREATE OR REPLACE FUNCTION public.can_access_thesis_file(
  _thesis_id UUID,
  _user_id UUID DEFAULT auth.uid()
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  thesis_status thesis_status;
  user_role_val app_role;
  has_approval boolean := false;
BEGIN
  -- Get thesis status
  SELECT status INTO thesis_status 
  FROM public.theses 
  WHERE id = _thesis_id;
  
  IF thesis_status IS NULL THEN
    RETURN false;
  END IF;
  
  -- If thesis is not approved, only admin/archivist can access
  IF thesis_status != 'approved' THEN
    RETURN public.has_elevated_access(_user_id);
  END IF;
  
  -- Get user role
  SELECT role INTO user_role_val
  FROM public.user_roles
  WHERE user_id = _user_id;
  
  -- Admin and archivist always have access
  IF user_role_val IN ('admin', 'archivist') THEN
    RETURN true;
  END IF;
  
  -- Researchers need LRC approval for full text
  IF user_role_val = 'researcher' THEN
    SELECT EXISTS(
      SELECT 1 FROM public.lrc_approval_requests
      WHERE user_id = _user_id 
        AND thesis_id = _thesis_id
        AND request_type = 'full_text_access'
        AND status = 'approved'
        AND (expires_at IS NULL OR expires_at > now())
    ) INTO has_approval;
    
    RETURN has_approval;
  END IF;
  
  -- Guest researchers cannot access files
  RETURN false;
END;
$$;

-- 9. Create RLS policies for new tables

-- Audit logs policies
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own audit logs" ON public.audit_logs
  FOR SELECT USING (user_id = auth.uid());

-- LRC approval requests policies
CREATE POLICY "Users can create their own approval requests" ON public.lrc_approval_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own approval requests" ON public.lrc_approval_requests
  FOR SELECT USING (user_id = auth.uid() OR public.has_elevated_access(auth.uid()));

CREATE POLICY "Admins and archivists can manage approval requests" ON public.lrc_approval_requests
  FOR ALL USING (public.has_elevated_access(auth.uid()))
  WITH CHECK (public.has_elevated_access(auth.uid()));

-- Guest sessions policies
CREATE POLICY "Users can view their own guest sessions" ON public.guest_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all guest sessions" ON public.guest_sessions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 10. Update storage policies for secure access
CREATE POLICY "Secure thesis file access" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'thesis-pdfs' AND 
    public.can_access_thesis_file(
      (regexp_match(name, '^([a-f0-9-]+)'))[1]::UUID
    )
  );

-- 11. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON public.audit_logs(resource_type);

CREATE INDEX IF NOT EXISTS idx_lrc_approval_user_thesis ON public.lrc_approval_requests(user_id, thesis_id);
CREATE INDEX IF NOT EXISTS idx_lrc_approval_status ON public.lrc_approval_requests(status);

CREATE INDEX IF NOT EXISTS idx_guest_sessions_token ON public.guest_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_guest_sessions_expires ON public.guest_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_theses_status ON public.theses(status);
CREATE INDEX IF NOT EXISTS idx_theses_title ON public.theses USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_theses_abstract ON public.theses USING gin(to_tsvector('english', abstract));
