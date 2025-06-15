
-- Enable SELECT on theses table for everyone (anonymous/select all)
CREATE POLICY "Anyone can read theses"
  ON public.theses
  FOR SELECT
  USING (true);
