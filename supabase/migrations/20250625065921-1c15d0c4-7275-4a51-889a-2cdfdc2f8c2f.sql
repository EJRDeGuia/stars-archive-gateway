
-- Drop all policies that depend on the has_role function
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage colleges" ON public.colleges;
DROP POLICY IF EXISTS "Admins can manage programs" ON public.programs;
DROP POLICY IF EXISTS "Admins can delete theses" ON public.theses;

-- Now we can safely drop the has_role function
DROP FUNCTION IF EXISTS public.has_role(uuid, user_role) CASCADE;
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;

-- Disable RLS temporarily to clean up all policies on collections tables
ALTER TABLE public.collections DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_theses DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on collections table
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'collections'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END $$;

-- Drop ALL existing policies on collection_theses table
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'collection_theses'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_theses ENABLE ROW LEVEL SECURITY;

-- Create simple, working policies for collections
CREATE POLICY "collections_select_policy" 
ON public.collections FOR SELECT 
USING (true);

CREATE POLICY "collections_insert_policy" 
ON public.collections FOR INSERT 
WITH CHECK (true);

CREATE POLICY "collections_update_policy" 
ON public.collections FOR UPDATE 
USING (true);

CREATE POLICY "collections_delete_policy" 
ON public.collections FOR DELETE 
USING (true);

-- Create simple policies for collection_theses
CREATE POLICY "collection_theses_select_policy" 
ON public.collection_theses FOR SELECT 
USING (true);

CREATE POLICY "collection_theses_insert_policy" 
ON public.collection_theses FOR INSERT 
WITH CHECK (true);

CREATE POLICY "collection_theses_update_policy" 
ON public.collection_theses FOR UPDATE 
USING (true);

CREATE POLICY "collection_theses_delete_policy" 
ON public.collection_theses FOR DELETE 
USING (true);
