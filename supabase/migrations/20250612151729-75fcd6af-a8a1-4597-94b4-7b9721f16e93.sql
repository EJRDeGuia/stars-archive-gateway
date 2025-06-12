
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('researcher', 'archivist', 'admin', 'guest_researcher');
CREATE TYPE thesis_status AS ENUM ('pending_review', 'approved', 'needs_revision', 'rejected');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'researcher',
  college_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create colleges table
CREATE TABLE public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- e.g., 'CITE', 'CBEAM'
  full_name TEXT NOT NULL, -- e.g., 'College of Information Technology and Engineering'
  description TEXT,
  color TEXT DEFAULT '#059669', -- Default DLSL green
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create programs table
CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  degree_level TEXT NOT NULL, -- e.g., 'Bachelor', 'Master', 'Doctorate'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create theses table
CREATE TABLE public.theses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  abstract TEXT,
  keywords TEXT[], -- Array of keywords
  author TEXT NOT NULL,
  adviser TEXT,
  co_adviser TEXT,
  college_id UUID NOT NULL REFERENCES public.colleges(id),
  program_id UUID REFERENCES public.programs(id),
  publish_date DATE,
  file_url TEXT, -- URL to the PDF file in storage
  cover_image_url TEXT, -- URL to cover image
  status thesis_status NOT NULL DEFAULT 'pending_review',
  uploaded_by UUID REFERENCES auth.users(id),
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create thesis_downloads table for tracking downloads
CREATE TABLE public.thesis_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thesis_id UUID NOT NULL REFERENCES public.theses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create thesis_views table for tracking views
CREATE TABLE public.thesis_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thesis_id UUID NOT NULL REFERENCES public.theses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create collections table for curated thesis collections
CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create collection_theses junction table
CREATE TABLE public.collection_theses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  thesis_id UUID NOT NULL REFERENCES public.theses(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, thesis_id)
);

-- Create user_favorites table
CREATE TABLE public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thesis_id UUID NOT NULL REFERENCES public.theses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, thesis_id)
);

-- Add foreign key constraint for college_id in profiles
ALTER TABLE public.profiles 
ADD CONSTRAINT fk_profiles_college 
FOREIGN KEY (college_id) REFERENCES public.colleges(id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thesis_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thesis_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_theses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Create security definer functions for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_archivist(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role IN ('admin', 'archivist')
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for colleges (public read access)
CREATE POLICY "Anyone can view colleges" ON public.colleges
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage colleges" ON public.colleges
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for programs (public read access)
CREATE POLICY "Anyone can view programs" ON public.programs
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage programs" ON public.programs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for theses
CREATE POLICY "Anyone can view approved theses" ON public.theses
  FOR SELECT USING (status = 'approved' OR public.is_admin_or_archivist(auth.uid()));

CREATE POLICY "Archivists and admins can insert theses" ON public.theses
  FOR INSERT WITH CHECK (public.is_admin_or_archivist(auth.uid()));

CREATE POLICY "Archivists and admins can update theses" ON public.theses
  FOR UPDATE USING (public.is_admin_or_archivist(auth.uid()));

CREATE POLICY "Admins can delete theses" ON public.theses
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for thesis downloads
CREATE POLICY "Users can view their own downloads" ON public.thesis_downloads
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_archivist(auth.uid()));

CREATE POLICY "Anyone can insert downloads" ON public.thesis_downloads
  FOR INSERT WITH CHECK (true);

-- RLS Policies for thesis views
CREATE POLICY "Users can view their own views" ON public.thesis_views
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_archivist(auth.uid()));

CREATE POLICY "Anyone can insert views" ON public.thesis_views
  FOR INSERT WITH CHECK (true);

-- RLS Policies for collections
CREATE POLICY "Anyone can view public collections" ON public.collections
  FOR SELECT USING (is_public = true OR created_by = auth.uid() OR public.is_admin_or_archivist(auth.uid()));

CREATE POLICY "Users can manage their own collections" ON public.collections
  FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Admins can manage all collections" ON public.collections
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for collection_theses
CREATE POLICY "Users can view collection theses if they can view the collection" ON public.collection_theses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.collections c 
      WHERE c.id = collection_id 
      AND (c.is_public = true OR c.created_by = auth.uid() OR public.is_admin_or_archivist(auth.uid()))
    )
  );

CREATE POLICY "Users can manage their own collection theses" ON public.collection_theses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.collections c 
      WHERE c.id = collection_id 
      AND c.created_by = auth.uid()
    )
  );

-- RLS Policies for user_favorites
CREATE POLICY "Users can view their own favorites" ON public.user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites" ON public.user_favorites
  FOR ALL USING (auth.uid() = user_id);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_colleges_updated_at 
  BEFORE UPDATE ON public.colleges 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_programs_updated_at 
  BEFORE UPDATE ON public.programs 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_theses_updated_at 
  BEFORE UPDATE ON public.theses 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_collections_updated_at 
  BEFORE UPDATE ON public.collections 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    'researcher'
  );
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert default colleges
INSERT INTO public.colleges (name, full_name, description) VALUES
('CITE', 'College of Information Technology and Engineering', 'Focuses on computer science, information technology, and engineering programs.'),
('CBEAM', 'College of Business, Economics, Accountancy, and Management', 'Offers programs in business administration, economics, accountancy, and management.'),
('CEAS', 'College of Education, Arts, and Sciences', 'Provides liberal arts, education, and science programs.'),
('CON', 'College of Nursing', 'Dedicated to nursing education and healthcare programs.'),
('CIHTM', 'College of International Hospitality and Tourism Management', 'Specializes in hospitality, tourism, and culinary arts programs.');

-- Create indexes for better performance
CREATE INDEX idx_theses_college_id ON public.theses(college_id);
CREATE INDEX idx_theses_status ON public.theses(status);
CREATE INDEX idx_theses_created_at ON public.theses(created_at);
CREATE INDEX idx_thesis_downloads_thesis_id ON public.thesis_downloads(thesis_id);
CREATE INDEX idx_thesis_views_thesis_id ON public.thesis_views(thesis_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_college_id ON public.profiles(college_id);
