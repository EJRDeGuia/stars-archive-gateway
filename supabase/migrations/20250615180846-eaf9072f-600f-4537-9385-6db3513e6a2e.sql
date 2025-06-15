
-- Remove the archivist-only insert policy if it exists
DROP POLICY IF EXISTS "Archivist can upload thesis pdfs" ON storage.objects;

-- Create a new policy: Anyone can upload thesis pdfs
CREATE POLICY "Anyone can upload thesis pdfs"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'thesis-pdfs');
