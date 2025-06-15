
-- Add 'embedding' vector column to theses table for OpenAI embeddings (1536 dimensions)
ALTER TABLE public.theses
ADD COLUMN embedding vector(1536);

-- Add index for fast vector search using cosine similarity
CREATE INDEX IF NOT EXISTS idx_theses_embedding
ON public.theses USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

