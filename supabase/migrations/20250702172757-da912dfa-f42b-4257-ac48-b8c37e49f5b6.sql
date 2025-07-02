-- Enable RLS on tables missing security policies
ALTER TABLE public.resources_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for resources_content (public read, admin write)
CREATE POLICY "Anyone can view active resources"
  ON public.resources_content
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage resources"
  ON public.resources_content
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for system_statistics (admin/archivist read, admin write)
CREATE POLICY "Admins and archivists can view statistics"
  ON public.system_statistics
  FOR SELECT
  USING (public.has_elevated_access(auth.uid()));

CREATE POLICY "Admins can manage statistics"
  ON public.system_statistics
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for about_content (public read, admin write)
CREATE POLICY "Anyone can view active about content"
  ON public.about_content
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage about content"
  ON public.about_content
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for team_members (public read, admin write)
CREATE POLICY "Anyone can view active team members"
  ON public.team_members
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage team members"
  ON public.team_members
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));