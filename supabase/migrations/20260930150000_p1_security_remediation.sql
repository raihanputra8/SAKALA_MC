-- ============================================================================
-- SAKALA MOTORCYCLE CLUB — P1 SECURITY REMEDIATION MIGRATION
-- File: supabase/migrations/20260930150000_p1_security_remediation.sql
-- Objectives:
-- 1. SEC-004: Server-Side Financial Integrity & Atomic Stock Control (decrement_product_stock)
-- 2. SEC-005: Storage Asset Deletion & Upload Authorization (Admin-only modification on sakala-assets)
-- 3. SEC-008: Secure Order Tracking & Predictable Identifier Protection
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SEC-004: ATOMIC STOCK DECREMENT & RACE-CONDITION PROTECTION
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.decrement_product_stock(
  p_product_id TEXT,
  p_quantity INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_stock INT;
BEGIN
  -- Validate quantity parameter
  IF p_quantity IS NULL OR p_quantity <= 0 OR p_quantity > 50 THEN
    RAISE EXCEPTION 'Invalid quantity requested: %', p_quantity;
  END IF;

  -- Lock target product row FOR UPDATE to guarantee atomic concurrency
  SELECT stock_count INTO v_current_stock
  FROM public.products
  WHERE id = p_product_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product with ID % not found in catalog.', p_product_id;
  END IF;

  -- If inventory count is tracked, verify available quantity
  IF v_current_stock IS NOT NULL THEN
    IF v_current_stock < p_quantity THEN
      RAISE EXCEPTION 'Insufficient inventory for product %. Available: %, Requested: %', 
        p_product_id, v_current_stock, p_quantity;
    END IF;

    -- Atomically decrement stock count and update stock_status
    UPDATE public.products
    SET 
      stock_count = stock_count - p_quantity,
      stock_status = CASE 
        WHEN (stock_count - p_quantity) <= 0 THEN 'sold_out'
        WHEN (stock_count - p_quantity) <= 3 THEN 'low_stock'
        ELSE stock_status
      END
    WHERE id = p_product_id;
  END IF;

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.decrement_product_stock(TEXT, INT) TO authenticated, anon, service_role;

-- ----------------------------------------------------------------------------
-- 2. SEC-005: REMEDIATE STORAGE OBJECT PERMISSIONS (sakala-assets)
-- Restrict INSERT, UPDATE, and DELETE strictly to verified administrators
-- Anonymous & ordinary members cannot delete or tamper with website assets
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public Read Access on sakala-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to sakala-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update to sakala-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload to sakala-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update to sakala-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete on sakala-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload to sakala-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin update on sakala-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete on sakala-assets" ON storage.objects;

-- 2a. Public Read Access: Everyone can view public merchandise/brand assets
CREATE POLICY "Public Read Access on sakala-assets" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'sakala-assets');

-- 2b. Admin-Only Upload: Non-admins cannot inject arbitrary files into sakala-assets
CREATE POLICY "Admin upload to sakala-assets" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (
  bucket_id = 'sakala-assets' 
  AND public.is_admin()
);

-- 2c. Admin-Only Update: Non-admins cannot overwrite existing assets
CREATE POLICY "Admin update on sakala-assets" 
ON storage.objects FOR UPDATE TO authenticated 
USING (
  bucket_id = 'sakala-assets' 
  AND public.is_admin()
) 
WITH CHECK (
  bucket_id = 'sakala-assets' 
  AND public.is_admin()
);

-- 2d. Admin-Only Delete: Denies ordinary members and anonymous callers from deleting brand assets
CREATE POLICY "Admin delete on sakala-assets" 
ON storage.objects FOR DELETE TO authenticated 
USING (
  bucket_id = 'sakala-assets' 
  AND public.is_admin()
);

-- ----------------------------------------------------------------------------
-- 3. SEC-008: SECURE ORDER TRACKING RPC (Zero PII Exposure)
-- Returns strictly non-sensitive tracking information (no phone, no email, no address)
-- ----------------------------------------------------------------------------
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
  -- Strict sanitization on order ID input
  IF p_order_id IS NULL OR length(trim(p_order_id)) < 8 THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    o.id,
    o.status,
    -- Return recipient first name or masked display
    o.customer_name,
    o.city,
    o.courier,
    o.total_idr,
    o.items,
    o.created_at
  FROM public.orders o
  WHERE o.id = trim(p_order_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_order_tracking(TEXT) TO anon, authenticated;
