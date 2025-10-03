-- Fix search_path for cleanup_orphaned_theses function
CREATE OR REPLACE FUNCTION cleanup_orphaned_theses()
RETURNS TABLE(
  deleted_count integer,
  deleted_ids uuid[]
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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