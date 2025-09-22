-- Create function for Gemini-based semantic search
-- This supports 768-dimensional embeddings from Gemini API

CREATE OR REPLACE FUNCTION match_theses_gemini(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  title text,
  author text,
  abstract text,
  keywords text[],
  publish_date date,
  view_count int,
  download_count int,
  cover_image_url text,
  college_name text,
  similarity_score float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    t.id,
    t.title,
    t.author,
    t.abstract,
    t.keywords,
    t.publish_date,
    t.view_count,
    t.download_count,
    t.cover_image_url,
    c.name as college_name,
    (1 - (t.embedding_gemini <=> query_embedding)) as similarity_score
  FROM theses t
  LEFT JOIN colleges c ON t.college_id = c.id
  WHERE t.status = 'approved'
    AND t.embedding_gemini IS NOT NULL
    AND (1 - (t.embedding_gemini <=> query_embedding)) > match_threshold
  ORDER BY t.embedding_gemini <=> query_embedding
  LIMIT match_count;
$$;

-- Add new column for Gemini embeddings (768 dimensions)
ALTER TABLE theses ADD COLUMN IF NOT EXISTS embedding_gemini vector(768);

-- Create index for efficient similarity search
CREATE INDEX IF NOT EXISTS theses_embedding_gemini_idx 
ON theses USING hnsw (embedding_gemini vector_cosine_ops)
WHERE embedding_gemini IS NOT NULL;