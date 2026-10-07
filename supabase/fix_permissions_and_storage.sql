-- ========================================================
-- SAKALA WEB — SUPABASE MASTER PERMISSION & STORAGE FIX
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ========================================================

-- 0. ENABLE UUID EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PASTIKAN TABEL ORDERS & SITE_CONTENT TERBUAT (JIKA BELUM ADA)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  courier TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal_idr NUMERIC NOT NULL,
  shipping_fee_idr NUMERIC NOT NULL,
  total_idr NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('pending', 'paid', 'dispatching', 'delivered', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  section TEXT NOT NULL,
  label TEXT,
  field_type TEXT CHECK (field_type IN ('text', 'textarea', 'richtext', 'url', 'number')) DEFAULT 'text',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FIX PROFILES CONSTRAINT & SET ADMIN ROLE
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('member', 'artisan', 'founder', 'admin'));

-- Pastikan akun Anda memiliki role 'admin'
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'raihanputrairawan8@gmail.com';

-- 3. CREATE FUNCTION is_admin() DENGAN SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Strict verification against profiles.role for authenticated UID
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() 
      AND role IN ('admin', 'founder', 'artisan')
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- 4. ENABLE RLS PADA SEMUA TABEL
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 5. POLICIES: BIKES (GARAGE)
DROP POLICY IF EXISTS "Allow public read on bikes" ON public.bikes;
DROP POLICY IF EXISTS "Admin insert bikes" ON public.bikes;
DROP POLICY IF EXISTS "Admin update bikes" ON public.bikes;
DROP POLICY IF EXISTS "Admin delete bikes" ON public.bikes;

CREATE POLICY "Allow public read on bikes" ON public.bikes FOR SELECT USING (true);
CREATE POLICY "Admin insert bikes" ON public.bikes FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update bikes" ON public.bikes FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete bikes" ON public.bikes FOR DELETE USING (public.is_admin());

-- 6. POLICIES: PRODUCTS (SUPPLY)
DROP POLICY IF EXISTS "Allow public read on products" ON public.products;
DROP POLICY IF EXISTS "Admin insert products" ON public.products;
DROP POLICY IF EXISTS "Admin update products" ON public.products;
DROP POLICY IF EXISTS "Admin delete products" ON public.products;

CREATE POLICY "Allow public read on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin insert products" ON public.products FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update products" ON public.products FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete products" ON public.products FOR DELETE USING (public.is_admin());

-- 7. POLICIES: JOURNAL POSTS
DROP POLICY IF EXISTS "Allow public read on journal_posts" ON public.journal_posts;
DROP POLICY IF EXISTS "Admin insert journal_posts" ON public.journal_posts;
DROP POLICY IF EXISTS "Admin update journal_posts" ON public.journal_posts;
DROP POLICY IF EXISTS "Admin delete journal_posts" ON public.journal_posts;

CREATE POLICY "Allow public read on journal_posts" ON public.journal_posts FOR SELECT USING (true);
CREATE POLICY "Admin insert journal_posts" ON public.journal_posts FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update journal_posts" ON public.journal_posts FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete journal_posts" ON public.journal_posts FOR DELETE USING (public.is_admin());

-- 8. POLICIES: SITE_CONTENT
DROP POLICY IF EXISTS "Allow public read on site_content" ON public.site_content;
DROP POLICY IF EXISTS "Admin insert site_content" ON public.site_content;
DROP POLICY IF EXISTS "Admin update site_content" ON public.site_content;
DROP POLICY IF EXISTS "Admin delete site_content" ON public.site_content;

CREATE POLICY "Allow public read on site_content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admin insert site_content" ON public.site_content FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update site_content" ON public.site_content FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete site_content" ON public.site_content FOR DELETE USING (public.is_admin());

-- 9. POLICIES: ORDERS (REMEDIATED: SEC-003 PII LEAK FIXED)
DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public select on orders" ON public.orders;
DROP POLICY IF EXISTS "Admin select all orders" ON public.orders;
DROP POLICY IF EXISTS "Customer select own orders" ON public.orders;
DROP POLICY IF EXISTS "Admin update orders" ON public.orders;

-- 9a. Admin select all orders
CREATE POLICY "Admin select all orders" 
ON public.orders FOR SELECT TO authenticated 
USING (public.is_admin());

-- 9b. Customer select only own orders
CREATE POLICY "Customer select own orders" 
ON public.orders FOR SELECT TO authenticated 
USING (
  (auth.jwt() ->> 'email') IS NOT NULL 
  AND customer_email = (auth.jwt() ->> 'email')
);

-- 9c. Guest checkout INSERT (INSERT != SELECT)
CREATE POLICY "Allow public insert on orders" 
ON public.orders FOR INSERT TO public 
WITH CHECK (true);

-- 9d. Admin update orders
CREATE POLICY "Admin update orders" 
ON public.orders FOR UPDATE TO authenticated 
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 9e. Secure Guest Order Tracking RPC (no table dump, no phone/address PII)
CREATE OR REPLACE FUNCTION public.get_order_tracking(p_order_id TEXT)
RETURNS TABLE (
  id TEXT,
  status TEXT,
  customer_name TEXT,
  city TEXT,
  courier TEXT,
  total_idr NUMERIC,
  items JSONB,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.status,
    o.customer_name,
    o.city,
    o.courier,
    o.total_idr,
    o.items,
    o.created_at
  FROM public.orders o
  WHERE o.id = p_order_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_order_tracking(TEXT) TO anon, authenticated;

-- 10. POLICIES & TRIGGERS: PROFILES (REMEDIATED: SEC-002 SELF-ESCALATION PREVENTED)
DROP POLICY IF EXISTS "Allow public read on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin update profiles" ON public.profiles;

CREATE POLICY "Allow public read on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Allow authenticated update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admin update profiles" ON public.profiles FOR UPDATE USING (public.is_admin());

-- Database Triggers to prevent unauthorized role escalation
CREATE OR REPLACE FUNCTION public.prevent_unauthorized_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Access Denied: Ordinary members cannot alter authorization role.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_role_change ON public.profiles;
CREATE TRIGGER trg_prevent_role_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_unauthorized_role_change();

CREATE OR REPLACE FUNCTION public.enforce_profile_insert_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS NOT NULL AND NEW.role != 'member' THEN
    IF NOT public.is_admin() THEN
      NEW.role := 'member';
    END IF;
  END IF;
  IF NEW.role IS NULL THEN
    NEW.role := 'member';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_profile_insert_role ON public.profiles;
CREATE TRIGGER trg_enforce_profile_insert_role
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.enforce_profile_insert_role();

-- 11. STORAGE: BUCKET 'sakala-assets' UNTUK UPLOAD GAMBAR
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'sakala-assets',
  'sakala-assets',
  true,
  10485760, -- 10MB
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Read Access on sakala-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload to sakala-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update to sakala-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete on sakala-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload to sakala-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin update on sakala-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete on sakala-assets" ON storage.objects;

-- Public read for assets (needed for storefront & gallery display)
CREATE POLICY "Public Read Access on sakala-assets" ON storage.objects FOR SELECT USING (bucket_id = 'sakala-assets');

-- Admin-only upload, update, and delete (SEC-005)
CREATE POLICY "Admin upload to sakala-assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'sakala-assets' AND public.is_admin());
CREATE POLICY "Admin update on sakala-assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'sakala-assets' AND public.is_admin()) WITH CHECK (bucket_id = 'sakala-assets' AND public.is_admin());
CREATE POLICY "Admin delete on sakala-assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'sakala-assets' AND public.is_admin());

