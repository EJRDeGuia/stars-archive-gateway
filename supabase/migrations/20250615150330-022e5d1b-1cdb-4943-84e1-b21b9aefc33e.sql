
-- Table for saved searches per user
create table public.saved_searches (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  query text not null,
  filters jsonb,
  created_at timestamp with time zone not null default now(),
  primary key (id)
);

-- Enable RLS
alter table public.saved_searches enable row level security;

-- Policy: Users can select their own saved searches
create policy "Users can view their saved searches"
  on public.saved_searches
  for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own saved searches
create policy "Users can save search queries"
  on public.saved_searches
  for insert
  with check (auth.uid() = user_id);

-- Policy: Users can delete their own saved searches
create policy "Users can delete their saved searches"
  on public.saved_searches
  for delete
  using (auth.uid() = user_id);
