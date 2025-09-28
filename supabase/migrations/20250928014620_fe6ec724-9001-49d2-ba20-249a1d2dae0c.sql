-- First drop the storage policy that depends on the function
DROP POLICY IF EXISTS "Secure thesis file access" ON storage.objects;