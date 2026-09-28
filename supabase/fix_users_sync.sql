-- ========================================================
-- SAKALA WEB — SUPABASE FIX FOR USERS & PROFILES SYNC
-- Run this in your Supabase Dashboard -> SQL Editor
-- ========================================================

-- 1. Ensure RLS policies exist so authenticated users can insert & update their own profile
DROP POLICY IF EXISTS "Allow public read on profiles" ON public.profiles;
CREATE POLICY "Allow public read on profiles" 
ON public.profiles FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert own profile" ON public.profiles;
CREATE POLICY "Allow authenticated insert own profile" 
ON public.profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Allow authenticated update own profile" ON public.profiles;
CREATE POLICY "Allow authenticated update own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin update profiles" ON public.profiles;
CREATE POLICY "Admin update profiles" 
ON public.profiles FOR UPDATE 
USING (public.is_admin());

-- 2. Create or replace the automatic sign-up trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1), 'Member'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    'member'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    email = COALESCE(EXCLUDED.email, profiles.email),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. BACKFILL ALL EXISTING USERS FROM auth.users INTO public.profiles
-- This immediately inserts all users who already signed in into your profiles table!
INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1), 'Member'),
  email,
  COALESCE(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture', ''),
  'member'
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);

-- 4. Check results
SELECT id, full_name, email, role, created_at FROM public.profiles;
