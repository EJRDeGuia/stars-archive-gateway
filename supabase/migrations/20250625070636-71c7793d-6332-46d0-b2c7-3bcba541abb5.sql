
-- Remove the foreign key constraint on collections.created_by
ALTER TABLE public.collections DROP CONSTRAINT IF EXISTS collections_created_by_fkey;

-- Also check and remove any similar constraints on collection_theses if they exist
ALTER TABLE public.collection_theses DROP CONSTRAINT IF EXISTS collection_theses_collection_id_fkey;
ALTER TABLE public.collection_theses DROP CONSTRAINT IF EXISTS collection_theses_thesis_id_fkey;

-- Re-add the collection_theses foreign keys to proper tables that exist
ALTER TABLE public.collection_theses 
ADD CONSTRAINT collection_theses_collection_id_fkey 
FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;

ALTER TABLE public.collection_theses 
ADD CONSTRAINT collection_theses_thesis_id_fkey 
FOREIGN KEY (thesis_id) REFERENCES public.theses(id) ON DELETE CASCADE;
