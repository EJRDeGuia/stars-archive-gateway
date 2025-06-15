
-- Enable RLS if not already enabled (should already be on, but harmless to run)
alter table theses enable row level security;

-- Allow users with 'archivist' role to insert new theses
create policy "Archivist can insert theses"
  on theses
  for insert
  with check (public.has_role(auth.uid(), 'archivist'));

-- (Optional) Allow archivists to update theses as well
create policy "Archivist can update theses"
  on theses
  for update
  using (public.has_role(auth.uid(), 'archivist'));
