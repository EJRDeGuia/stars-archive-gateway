
-- Remove the old policy if it exists
drop policy if exists "Archivist can upload thesis pdfs" on storage.objects;

-- Correct insert policy: Only archivists can upload thesis pdfs (WITH CHECK)
create policy "Archivist can upload thesis pdfs"
  on storage.objects
  for insert
  with check (
    bucket_id = 'thesis-pdfs' AND public.has_role(auth.uid(), 'archivist')
  );
