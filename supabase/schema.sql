-- ========================================================
-- SAKALA WEB — SUPABASE POSTGRESQL SCHEMA & SEED DATA
-- Archival Speed Culture & Custom Guild (Bandung, ID)
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE STORAGE BUCKET FOR REMOTE ASSETS
-- All high-resolution photos, bikes, apparel, and profile avatars are stored in this cloud bucket.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('sakala-assets', 'sakala-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to all assets in sakala-assets bucket
CREATE POLICY "Public Read Access on sakala-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'sakala-assets');

-- Allow upload and update to sakala-assets bucket
CREATE POLICY "Allow public upload to sakala-assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'sakala-assets');

CREATE POLICY "Allow public update to sakala-assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'sakala-assets');

-- 3. PROFILES TABLE (User accounts & artisans)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('member', 'artisan', 'founder', 'admin')) DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BIKES TABLE (Custom Garage & Machines)
CREATE TABLE IF NOT EXISTS public.bikes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  year INT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  specs JSONB NOT NULL DEFAULT '{}'::jsonb,
  image_url TEXT NOT NULL,
  status TEXT CHECK (status IN ('archival', 'commissioned', 'private_collection')) DEFAULT 'archival',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCTS TABLE (SAKALA Supply Apparel & Gear)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('t-shirts', 'hoodies', 'jackets', 'headwear', 'accessories')),
  price_idr NUMERIC NOT NULL,
  price_usd NUMERIC NOT NULL,
  stock_status TEXT CHECK (stock_status IN ('available', 'low_stock', 'waitlist', 'sold_out')) DEFAULT 'available',
  stock_count INT DEFAULT 0,
  description TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. JOURNAL_POSTS TABLE (Editorial & Monographs)
CREATE TABLE IF NOT EXISTS public.journal_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  read_time TEXT,
  author TEXT NOT NULL,
  publish_date TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT,
  cover_image_url TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NEWSLETTER_SUBSCRIBERS TABLE (Stay in the Circle)
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORDERS TABLE (Dispatch Manifest Orders)
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

-- 9. SITE_CONTENT TABLE (CMS Editable Content)
CREATE TABLE IF NOT EXISTS public.site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  section TEXT NOT NULL,
  label TEXT,
  field_type TEXT CHECK (field_type IN ('text', 'textarea', 'richtext', 'url', 'number')) DEFAULT 'text',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Public can read bikes, products, journal posts, site_content
CREATE POLICY "Allow public read on bikes" ON public.bikes FOR SELECT USING (true);
CREATE POLICY "Allow public read on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read on journal_posts" ON public.journal_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read on site_content" ON public.site_content FOR SELECT USING (true);

-- Public can subscribe to newsletter
CREATE POLICY "Allow public insert on newsletter_subscribers" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Public can insert and read orders
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on orders" ON public.orders FOR SELECT USING (true);

-- Admin-only write policies for content tables
CREATE POLICY "Admin insert products" ON public.products FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update products" ON public.products FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete products" ON public.products FOR DELETE USING (public.is_admin());

CREATE POLICY "Admin insert bikes" ON public.bikes FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update bikes" ON public.bikes FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete bikes" ON public.bikes FOR DELETE USING (public.is_admin());

CREATE POLICY "Admin insert journal_posts" ON public.journal_posts FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update journal_posts" ON public.journal_posts FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete journal_posts" ON public.journal_posts FOR DELETE USING (public.is_admin());

CREATE POLICY "Admin update orders" ON public.orders FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin insert site_content" ON public.site_content FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update site_content" ON public.site_content FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete site_content" ON public.site_content FOR DELETE USING (public.is_admin());

-- Profile policies
CREATE POLICY "Allow public read on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Allow authenticated update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admin update profiles" ON public.profiles FOR UPDATE USING (public.is_admin());

-- Auto-create profile on sign-up trigger
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

-- BACKFILL EXISTING USERS: Automatically copies existing auth.users into public.profiles
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

-- ========================================================
-- INITIAL SEED DATA
-- ========================================================

-- Insert Bikes
INSERT INTO public.bikes (id, title, year, make, model, specs, image_url, status)
VALUES
(
  'bike-01',
  '''KUJANG GOLD''',
  1978,
  'Honda',
  'CB550 Four',
  '{"frame": "De-tabbed Raw Steel", "exhaust": "4-into-1 Custom Megaphone", "colorway": "Sakala Royal Blue & Gold", "workshop": "Nikko Garage x Sakala"}'::jsonb,
  '/assets/bike_cb550.png',
  'archival'
),
(
  'bike-02',
  '''NIGHT CRAWLER''',
  1982,
  'Yamaha',
  'XS650',
  '{"engine": "650cc Twin Rebuilt Stage II", "chassis": "Weld-on Rigid Hardtail", "finish": "Grounding Black #000000", "wheels": "19\" Front / 16\" Rear Firestone"}'::jsonb,
  '/assets/bike_xs650.png',
  'commissioned'
),
(
  'bike-03',
  '''THE NOMAD''',
  1994,
  'Harley-Davidson',
  'Sportster 1200',
  '{"exhaust": "Twin High-Mount Scrambler", "suspension": "Ohlins Piggyback 390mm", "rims": "Forged Lightweight Alloy", "displacement": "1200cc Evolution V-Twin"}'::jsonb,
  '/assets/bike_sportster.png',
  'private_collection'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url;

-- Insert Products
INSERT INTO public.products (id, sku, name, category, price_idr, price_usd, stock_status, stock_count, description, image_url)
VALUES
(
  'prod-01',
  'SKL-TEE-01',
  'CIRCLE EMBLEM HEAVYWEIGHT TEE',
  't-shirts',
  385000,
  28,
  'available',
  15,
  'Vintage Royal Navy screenprint with distressed Bandung guild insignia.',
  '/assets/product_tee.png'
),
(
  'prod-02',
  'SKL-HD-02',
  'GARAGE CREW ZIP HOODIE',
  'hoodies',
  720000,
  52,
  'low_stock',
  4,
  '420 GSM French Terry with Grounding Black body and Golden Yellow embroidery.',
  '/assets/product_hoodie.png'
),
(
  'prod-03',
  'SKL-JKT-03',
  'BROTHERHOOD COACH JACKET',
  'jackets',
  1150000,
  82,
  'available',
  8,
  'Quilted lining with chain-stitched SAKALA cursive chest and back script.',
  '/assets/product_jacket.png'
),
(
  'prod-04',
  'SKL-CAP-04',
  'LOYALTY TRUCKER CAP',
  'headwear',
  260000,
  19,
  'waitlist',
  0,
  'Direct embroidery, heavy mesh back, and stamped custom brass rear closure.',
  '/assets/product_cap.png'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_idr = EXCLUDED.price_idr,
  price_usd = EXCLUDED.price_usd,
  stock_status = EXCLUDED.stock_status,
  stock_count = EXCLUDED.stock_count;

-- Insert Journal Posts
INSERT INTO public.journal_posts (id, title, slug, category, read_time, author, publish_date, excerpt, cover_image_url, featured)
VALUES
(
  'post-01',
  'MIDNIGHT THROUGH SUBANG PASS: 400KM ON RIGID FRAMES',
  'midnight-through-subang-pass-400km',
  'RIDES',
  '12 MIN READ',
  'A. PRATAMA',
  'OCTOBER 2026',
  'When the fog drops over Cikole at 02:00 AM, mechanical sympathy becomes an instinct rather than a theory. A minute-by-minute chronicling of nine hand-built motorcycles carving the northern mountain ridge of West Java in torrential monsoon rain.',
  '/assets/journal_subang.png',
  true
),
(
  'post-02',
  'FORGING STEEL IN CIROYOM: INSIDE THE SAKALA ENGINE LAB',
  'forging-steel-ciroyom-engine-lab',
  'BUILDS',
  '8 MIN READ',
  'R. HENDRA',
  'SEP 2026',
  'From hand-beaten aluminum tanks to custom bronze bushings, a photographic monograph inside our Bandung workshop.',
  '/assets/culture_workshop.png',
  false
),
(
  'post-03',
  'THE MEANING OF THE CIRCLE: AN ORAL HISTORY OF THE BANDUNG SCENE',
  'meaning-of-the-circle-bandung-scene',
  'BROTHERHOOD',
  '15 MIN READ',
  'ARCHIVE EDITORS',
  'SEP 2026',
  'Interviews with early custom motorcycle pioneers who shaped West Java''s distinct mechanical subculture over three decades.',
  '/assets/culture_ceremony.png',
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  cover_image_url = EXCLUDED.cover_image_url;

-- Seed initial site content
INSERT INTO public.site_content (key, value, section, label, field_type) VALUES
  ('hero_title', 'SAKALA', 'hero', 'Hero Title', 'text'),
  ('hero_subtitle', 'EST. 2026 • BANDUNG', 'hero', 'Hero Subtitle', 'text'),
  ('hero_tagline', 'Archival Speed Culture & Custom Guild', 'hero', 'Hero Tagline', 'text'),
  ('manifesto_title', 'THE MANIFESTO', 'manifesto', 'Section Title', 'text'),
  ('manifesto_body', 'SAKALA is a closed fraternity of motorcycle builders, riders, and cultural archivists founded in Bandung, Indonesia. We are not a club of machines — we are a guild of hands. Every bolt turned, every tank hammered, every mile ridden writes a sentence in the mechanical scripture of West Java.', 'manifesto', 'Manifesto Text', 'richtext'),
  ('about_description', 'A cultural collective and custom engineering atelier built around the philosophy of lifelong fraternity, raw displacement, and Indonesian archival motorcycle heritage.', 'about', 'About Description', 'textarea'),
  ('newsletter_heading', 'JOIN THE CIRCLE', 'newsletter', 'Newsletter Heading', 'text'),
  ('newsletter_subtext', 'Dispatch coordinates for new builds, archival stories, and supply drops.', 'newsletter', 'Newsletter Subtext', 'text'),
  ('footer_tagline', 'Archival Speed Culture & Custom Guild — Bandung, Indonesia', 'footer', 'Footer Tagline', 'text')
ON CONFLICT (key) DO NOTHING;
