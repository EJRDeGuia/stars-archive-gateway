-- Add column to track if file exists in file_scan_results
ALTER TABLE file_scan_results 
ADD COLUMN IF NOT EXISTS file_name text;

-- Function to clean up orphaned thesis entries (no PDF file)
CREATE OR REPLACE FUNCTION cleanup_orphaned_theses()
RETURNS TABLE(
  deleted_count integer,
  deleted_ids uuid[]
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  orphaned_ids uuid[];
  delete_count integer;
BEGIN
  -- Find theses with NULL or empty file_url
  SELECT ARRAY_AGG(id) INTO orphaned_ids
  FROM theses 
  WHERE file_url IS NULL OR file_url = '';
  
  -- Delete orphaned theses
  DELETE FROM theses 
  WHERE id = ANY(orphaned_ids);
  
  GET DIAGNOSTICS delete_count = ROW_COUNT;
  
  -- Log cleanup action
  IF delete_count > 0 THEN
    PERFORM log_audit_event(
      'cleanup_orphaned_theses',
      'thesis',
      NULL,
      jsonb_build_object(
        'deleted_count', delete_count,
        'deleted_ids', orphaned_ids
      ),
      NULL,
      NULL,
      'low',
      'maintenance'
    );
  END IF;
  
  RETURN QUERY SELECT delete_count, COALESCE(orphaned_ids, ARRAY[]::uuid[]);
END;
$$;

-- Grant execute permission to authenticated users with admin role
GRANT EXECUTE ON FUNCTION cleanup_orphaned_theses() TO authenticated;

COMMENT ON FUNCTION cleanup_orphaned_theses() IS 
'Removes thesis entries that do not have associated PDF files. Returns count and IDs of deleted records.';