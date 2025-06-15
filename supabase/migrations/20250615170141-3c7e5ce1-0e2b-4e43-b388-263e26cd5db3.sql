
-- Create a public storage bucket for thesis PDFs (already done if previous command succeeded)
insert into storage.buckets
  (id, name, public)
values
  ('thesis-pdfs', 'thesis-pdfs', true)
on conflict do nothing;

-- Policy: Allow anyone to upload thesis pdfs (correct: use WITH CHECK)
create policy "Anyone can upload thesis pdfs"
  on storage.objects
  for insert
  with check (bucket_id = 'thesis-pdfs');

-- Policy: Allow anyone to read thesis pdfs (correct: use USING)
create policy "Anyone can read thesis pdfs"
  on storage.objects
  for select
  using (bucket_id = 'thesis-pdfs');
