
-- Remove the previous archivist-only insert policy if it exists
DROP POLICY IF EXISTS "Archivist can insert theses" ON theses;

-- Create a new policy: Anyone can insert theses
CREATE POLICY "Anyone can insert theses"
  ON theses
  FOR INSERT
  WITH CHECK (true);

-- Optionally, allow anyone to update theses as well (remove this if not needed)
DROP POLICY IF EXISTS "Archivist can update theses" ON theses;
-- Uncomment to allow updates by anyone:
-- CREATE POLICY "Anyone can update theses"
--   ON theses
--   FOR UPDATE
--   USING (true);
