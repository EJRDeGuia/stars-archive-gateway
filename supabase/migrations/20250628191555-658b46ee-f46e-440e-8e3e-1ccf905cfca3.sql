
-- First, let's check and fix any potential duplicate thesis IDs
-- This shouldn't happen, but let's be safe
DELETE FROM theses a USING (
  SELECT MIN(ctid) as ctid, id
  FROM theses 
  GROUP BY id HAVING COUNT(*) > 1
) b
WHERE a.id = b.id 
AND a.ctid <> b.ctid;

-- Ensure the theses table has proper constraints
ALTER TABLE theses 
  ALTER COLUMN id SET NOT NULL,
  ALTER COLUMN status SET NOT NULL,
  ALTER COLUMN status SET DEFAULT 'pending_review';

-- Add a unique constraint on thesis ID if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'theses_id_unique'
  ) THEN
    ALTER TABLE theses ADD CONSTRAINT theses_id_unique UNIQUE (id);
  END IF;
END $$;

-- Create an index on status for better query performance
CREATE INDEX IF NOT EXISTS idx_theses_status ON theses(status);

-- Add a function to safely update thesis status
CREATE OR REPLACE FUNCTION public.update_thesis_status(
  thesis_uuid UUID,
  new_status thesis_status,
  user_uuid UUID
)
RETURNS TABLE(
  success BOOLEAN,
  message TEXT,
  thesis_id UUID,
  thesis_title TEXT,
  old_status thesis_status,
  updated_status thesis_status
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  thesis_record RECORD;
  user_is_admin BOOLEAN;
BEGIN
  -- Check if user is admin
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_uuid AND role = 'admin'
  ) INTO user_is_admin;
  
  IF NOT user_is_admin THEN
    RETURN QUERY SELECT FALSE, 'Only administrators can update thesis status', NULL::UUID, NULL::TEXT, NULL::thesis_status, NULL::thesis_status;
    RETURN;
  END IF;
  
  -- Get the current thesis
  SELECT * FROM theses WHERE id = thesis_uuid INTO thesis_record;
  
  IF thesis_record.id IS NULL THEN
    RETURN QUERY SELECT FALSE, 'Thesis not found', NULL::UUID, NULL::TEXT, NULL::thesis_status, NULL::thesis_status;
    RETURN;
  END IF;
  
  -- Update the thesis status
  UPDATE theses 
  SET status = new_status, updated_at = NOW()
  WHERE id = thesis_uuid;
  
  -- Return success with details
  RETURN QUERY SELECT 
    TRUE, 
    'Thesis status updated successfully',
    thesis_record.id,
    thesis_record.title,
    thesis_record.status,
    new_status;
END;
$$;
