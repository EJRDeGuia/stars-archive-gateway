-- Ensure the current user has admin role
INSERT INTO public.user_roles (user_id, role) 
VALUES ('7f2f2da9-5448-466b-8578-609f5491c79e', 'admin') 
ON CONFLICT (user_id, role) DO NOTHING;