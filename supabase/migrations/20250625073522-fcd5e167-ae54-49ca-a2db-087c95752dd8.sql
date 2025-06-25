
-- Create table for system statistics
CREATE TABLE public.system_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_key TEXT NOT NULL UNIQUE,
  stat_value INTEGER NOT NULL DEFAULT 0,
  stat_label TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for about page content
CREATE TABLE public.about_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for team members
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for resources/help content
CREATE TABLE public.resources_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  icon TEXT,
  category TEXT DEFAULT 'general',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert initial system statistics
INSERT INTO public.system_statistics (stat_key, stat_value, stat_label) VALUES
('total_theses', 0, 'Total Theses'),
('total_colleges', 0, 'Academic Colleges'),
('total_collections', 0, 'Public Collections'),
('active_users', 0, 'Active Users'),
('monthly_uploads', 0, 'Monthly Uploads'),
('weekly_views', 0, 'Weekly Views');

-- Insert sample about content
INSERT INTO public.about_content (section, title, content, order_index) VALUES
('mission', 'Our Mission', 'STARS is designed to revolutionize how academic research is stored, discovered, and accessed at De La Salle Lipa. We provide a modern, intuitive platform that bridges the gap between traditional library systems and contemporary digital needs, fostering innovation and collaboration in academic research.', 1),
('vision', 'Our Vision', 'To become the premier digital repository for academic excellence, empowering researchers and students with seamless access to scholarly works while preserving the intellectual heritage of De La Salle Lipa.', 2),
('values', 'Our Values', 'We are committed to academic integrity, innovation, accessibility, and collaborative learning. Our platform embodies these values by providing secure, user-friendly access to research while maintaining the highest standards of academic excellence.', 3);

-- Insert sample team members
INSERT INTO public.team_members (name, role, description, order_index) VALUES
('Learning Resource Center', 'Repository Management', 'Our dedicated LRC team manages the digital repository, ensuring quality control and accessibility of all academic materials.', 1),
('IT Development Team', 'Technical Support', 'The IT team maintains and develops the STARS platform, providing technical support and continuous improvements.', 2),
('Academic Faculty', 'Content Review', 'Faculty members from various colleges contribute to content curation and quality assurance of submitted research.', 3);

-- Insert sample resources content
INSERT INTO public.resources_content (section, title, content, category, order_index) VALUES
('getting-started', 'Account Access', 'All DLSL students, faculty, and staff can access STARS using their institutional credentials. Guest users can browse public content with limited access.', 'access', 1),
('search-tips', 'Advanced Search', 'Use keywords, author names, or thesis titles to find specific research. Utilize filters by college, year, or subject area for refined results.', 'search', 2),
('document-access', 'Document Viewing', 'Full thesis documents are available for viewing within the platform. For downloads or external access, please contact the LRC directly.', 'access', 3),
('support', 'Technical Support', 'For technical issues, account problems, or general inquiries, contact the LRC team during business hours or submit a support request.', 'support', 4);

-- Create function to update system statistics
CREATE OR REPLACE FUNCTION update_system_statistics()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update total theses count
  UPDATE public.system_statistics 
  SET stat_value = (SELECT COUNT(*) FROM public.theses WHERE status = 'approved'),
      updated_at = now()
  WHERE stat_key = 'total_theses';
  
  -- Update total colleges count
  UPDATE public.system_statistics 
  SET stat_value = (SELECT COUNT(*) FROM public.colleges),
      updated_at = now()
  WHERE stat_key = 'total_colleges';
  
  -- Update total collections count
  UPDATE public.system_statistics 
  SET stat_value = (SELECT COUNT(*) FROM public.collections WHERE is_public = true),
      updated_at = now()
  WHERE stat_key = 'total_collections';
  
  -- Update active users count (profiles created in last 30 days)
  UPDATE public.system_statistics 
  SET stat_value = (SELECT COUNT(*) FROM public.profiles WHERE created_at > now() - interval '30 days'),
      updated_at = now()
  WHERE stat_key = 'active_users';
  
  -- Update monthly uploads count
  UPDATE public.system_statistics 
  SET stat_value = (SELECT COUNT(*) FROM public.theses WHERE created_at > now() - interval '1 month'),
      updated_at = now()
  WHERE stat_key = 'monthly_uploads';
  
  -- Update weekly views count
  UPDATE public.system_statistics 
  SET stat_value = (SELECT COUNT(*) FROM public.thesis_views WHERE viewed_at > now() - interval '7 days'),
      updated_at = now()
  WHERE stat_key = 'weekly_views';
END;
$$;

-- Create trigger to automatically update statistics when relevant tables change
CREATE OR REPLACE FUNCTION trigger_update_statistics()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM update_system_statistics();
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add triggers to relevant tables
CREATE TRIGGER update_stats_on_thesis_change
  AFTER INSERT OR UPDATE OR DELETE ON public.theses
  FOR EACH STATEMENT EXECUTE FUNCTION trigger_update_statistics();

CREATE TRIGGER update_stats_on_college_change
  AFTER INSERT OR UPDATE OR DELETE ON public.colleges
  FOR EACH STATEMENT EXECUTE FUNCTION trigger_update_statistics();

CREATE TRIGGER update_stats_on_collection_change
  AFTER INSERT OR UPDATE OR DELETE ON public.collections
  FOR EACH STATEMENT EXECUTE FUNCTION trigger_update_statistics();

CREATE TRIGGER update_stats_on_profile_change
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH STATEMENT EXECUTE FUNCTION trigger_update_statistics();

CREATE TRIGGER update_stats_on_view_change
  AFTER INSERT OR DELETE ON public.thesis_views
  FOR EACH STATEMENT EXECUTE FUNCTION trigger_update_statistics();

-- Initialize statistics with current data
SELECT update_system_statistics();
