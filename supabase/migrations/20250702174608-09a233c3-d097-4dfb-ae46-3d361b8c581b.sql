-- Fix RLS performance issues by optimizing policies and removing problematic triggers

-- First, let's drop any triggers that might be causing the timeout
DROP TRIGGER IF EXISTS trigger_update_statistics ON public.theses;

-- Optimize the thesis insertion policy to be more efficient
DROP POLICY IF EXISTS "Only archivists can insert theses" ON public.theses;

-- Create a more efficient policy that doesn't need complex joins
CREATE POLICY "Archivists and admins can insert theses"
  ON public.theses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('archivist', 'admin')
    )
  );

-- Optimize the SELECT policy for better performance
DROP POLICY IF EXISTS "Anyone can view approved theses" ON public.theses;

CREATE POLICY "View approved theses or elevated access"
  ON public.theses
  FOR SELECT
  USING (
    status = 'approved'::thesis_status 
    OR EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('archivist', 'admin')
    )
  );

-- Add better indexes for performance (without CONCURRENTLY)
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles(user_id, role);
CREATE INDEX IF NOT EXISTS idx_theses_status_created ON public.theses(status, created_at);

-- Create a simpler trigger that only updates statistics periodically, not on every insert
CREATE OR REPLACE FUNCTION public.simple_stats_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update stats every 100th thesis or so to avoid constant updates
  IF (NEW.id::text ~ '00$') THEN
    PERFORM update_system_statistics();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER simple_stats_trigger
  AFTER INSERT ON public.theses
  FOR EACH ROW
  EXECUTE FUNCTION simple_stats_update();