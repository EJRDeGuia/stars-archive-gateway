
-- Add demo entry for "Featured Research"
INSERT INTO public.collection_highlights (title, color, image_url, type, description)
VALUES (
  'AI in Agriculture',
  '#059669',
  '/public/placeholder.svg',
  'featured',
  'Exploring how artificial intelligence is transforming modern agriculture.'
);

-- Add demo entry for "Trending this Month"
INSERT INTO public.collection_highlights (title, color, image_url, type, description)
VALUES (
  'Renewable Energy Solutions',
  '#f59e42',
  '/public/placeholder.svg',
  'trending',
  'Innovations in solar and wind technologies making headlines this month.'
);

-- Add demo entry for "New Additions"
INSERT INTO public.collection_highlights (title, color, image_url, type, description)
VALUES (
  'Water Conservation Methods',
  '#2563eb',
  '/public/placeholder.svg',
  'new',
  'Recently added research on efficient water usage and conservation.'
);
