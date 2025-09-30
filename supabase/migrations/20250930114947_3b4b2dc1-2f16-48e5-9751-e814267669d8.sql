-- Recreate the storage policy with the updated function
CREATE POLICY "Secure thesis file access" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'thesis-pdfs' 
    AND auth.uid() IS NOT NULL
    AND public.can_access_thesis_file(
      (storage.foldername(name))[1]::uuid,
      auth.uid()
    )
  );