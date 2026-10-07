-- ============================================================================
-- SAKALA MOTORCYCLE CLUB — P0.5 SECURITY BLOCKER REMEDIATION MIGRATION
-- File: supabase/migrations/20260930153000_p0_5_security_blocker_remediation.sql
-- Objectives:
-- 1. SEC-004: Close direct INSERT on public.orders (Drop 'WITH CHECK (true)')
-- 2. SEC-004: Implement atomic SECURITY DEFINER public.create_verified_order()
-- 3. SEC-DEFINER: Revoke anon execution on public.decrement_product_stock()
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. CLOSE DIRECT ORDERS INSERT BYPASS (SEC-004)
-- Drop the permissive public insert policy. Direct REST inserts are strictly denied.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;

-- Ensure RLS is active on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Only verified admins or internal service role can perform direct updates/inserts
DROP POLICY IF EXISTS "Admin insert orders" ON public.orders;
CREATE POLICY "Admin insert orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 2. SEC-DEFINER: REVOKE ANONYMOUS EXECUTION ON decrement_product_stock
-- Prevents attackers from calling rpc/decrement_product_stock to drain inventory
-- ----------------------------------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.decrement_product_stock(TEXT, INT) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.decrement_product_stock(TEXT, INT) TO service_role;

-- ----------------------------------------------------------------------------
-- 3. SEC-004: AUTHORITATIVE ORDER CREATION RPC (SECURITY DEFINER)
-- Derives all financial values (prices, subtotal, shipping, grand total)
-- directly from public.products and courier rates within a single transaction.
-- Client CANNOT inject prices or arbitrary financial values.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_verified_order(
  p_order_id TEXT,
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_phone TEXT,
  p_shipping_address TEXT,
  p_city TEXT,
  p_postal_code TEXT,
  p_courier TEXT,
  p_payment_method TEXT,
  p_items JSONB
)
RETURNS TABLE (
  order_id TEXT,
  subtotal_idr NUMERIC,
  shipping_fee_idr NUMERIC,
  total_idr NUMERIC,
  status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_item RECORD;
  v_prod_id TEXT;
  v_prod_qty INT;
  v_prod_size TEXT;
  v_current_stock INT;
  v_stock_status TEXT;
  v_official_price NUMERIC;
  v_sku TEXT;
  v_name TEXT;
  v_category TEXT;
  v_image_url TEXT;
  v_subtotal NUMERIC := 0;
  v_shipping_fee NUMERIC := 35000;
  v_total NUMERIC := 0;
  v_enriched_items JSONB := '[]'::jsonb;
  v_item_obj JSONB;
BEGIN
  -- 1. Input sanitization & validation
  IF p_order_id IS NULL OR length(trim(p_order_id)) < 8 THEN
    RAISE EXCEPTION 'Invalid order identifier.';
  END IF;

  IF p_customer_name IS NULL OR length(trim(p_customer_name)) < 2 THEN
    RAISE EXCEPTION 'Invalid customer name.';
  END IF;

  IF p_customer_email IS NULL OR p_customer_email NOT LIKE '%_@__%.__%' THEN
    RAISE EXCEPTION 'Invalid customer email address.';
  END IF;

  IF p_customer_phone IS NULL OR length(trim(p_customer_phone)) < 6 THEN
    RAISE EXCEPTION 'Invalid customer phone number.';
  END IF;

  IF p_shipping_address IS NULL OR length(trim(p_shipping_address)) < 5 THEN
    RAISE EXCEPTION 'Invalid shipping address.';
  END IF;

  IF p_city IS NULL OR length(trim(p_city)) < 2 THEN
    RAISE EXCEPTION 'Invalid city.';
  END IF;

  IF p_postal_code IS NULL OR length(trim(p_postal_code)) < 3 THEN
    RAISE EXCEPTION 'Invalid postal code.';
  END IF;

  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Cart cannot be empty.';
  END IF;

  -- 2. Process each item: lookup official price and atomically decrement stock
  -- DETERMINISTIC ORDERING (ORDER BY productId): Prevents concurrency deadlocks across multi-item checkouts
  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(
    "productId" TEXT,
    "quantity" INT,
    "size" TEXT
  ) ORDER BY x."productId" ASC
  LOOP
    v_prod_id := trim(v_item."productId");
    v_prod_qty := v_item."quantity";
    v_prod_size := COALESCE(v_item."size", 'M');

    -- Quantity bounds check: 1 <= quantity <= 10
    IF v_prod_qty IS NULL OR v_prod_qty < 1 OR v_prod_qty > 10 THEN
      RAISE EXCEPTION 'Invalid quantity for product %. Allowed: 1-10.', v_prod_id;
    END IF;

    -- Lock product row FOR UPDATE to prevent race conditions
    SELECT 
      price_idr, stock_count, stock_status, name, sku, category, image_url
    INTO 
      v_official_price, v_current_stock, v_stock_status, v_name, v_sku, v_category, v_image_url
    FROM public.products
    WHERE id = v_prod_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product with ID % not found in catalog.', v_prod_id;
    END IF;

    IF v_stock_status = 'sold_out' THEN
      RAISE EXCEPTION 'Product % is sold out.', v_name;
    END IF;

    -- Inventory check
    IF v_current_stock IS NOT NULL THEN
      IF v_current_stock < v_prod_qty THEN
        RAISE EXCEPTION 'Insufficient stock for product %. Available: %, Requested: %',
          v_name, v_current_stock, v_prod_qty;
      END IF;

      -- Atomic stock decrement
      UPDATE public.products
      SET 
        stock_count = stock_count - v_prod_qty,
        stock_status = CASE 
          WHEN (stock_count - v_prod_qty) <= 0 THEN 'sold_out'
          WHEN (stock_count - v_prod_qty) <= 3 THEN 'low_stock'
          ELSE stock_status
        END
      WHERE id = v_prod_id;
    END IF;

    -- Authoritative subtotal calculation
    v_subtotal := v_subtotal + (v_official_price * v_prod_qty);

    -- Build enriched item object
    v_item_obj := jsonb_build_object(
      'product', jsonb_build_object(
        'id', v_prod_id,
        'sku', v_sku,
        'name', v_name,
        'category', v_category,
        'price_idr', v_official_price,
        'stock_status', v_stock_status,
        'image_url', v_image_url
      ),
      'quantity', v_prod_qty,
      'size', v_prod_size
    );

    v_enriched_items := v_enriched_items || jsonb_build_array(v_item_obj);
  END LOOP;

  -- 3. Authoritative shipping calculation based on courier
  v_shipping_fee := CASE p_courier
    WHEN 'jne_yes' THEN 35000
    WHEN 'jne_reg' THEN 20000
    WHEN 'sicepat_best' THEN 30000
    WHEN 'jnt' THEN 22000
    WHEN 'cargo' THEN 45000
    ELSE 35000
  END;

  -- 4. Authoritative grand total
  v_total := v_subtotal + v_shipping_fee;

  -- 5. Insert verified order into public.orders table
  INSERT INTO public.orders (
    id,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    city,
    postal_code,
    courier,
    payment_method,
    items,
    subtotal_idr,
    shipping_fee_idr,
    total_idr,
    status,
    created_at
  ) VALUES (
    p_order_id,
    trim(p_customer_name),
    lower(trim(p_customer_email)),
    trim(p_customer_phone),
    trim(p_shipping_address),
    trim(p_city),
    trim(p_postal_code),
    COALESCE(p_courier, 'jne_yes'),
    COALESCE(p_payment_method, 'bca_va'),
    v_enriched_items,
    v_subtotal,
    v_shipping_fee,
    v_total,
    'pending',
    NOW()
  );

  RETURN QUERY
  SELECT 
    p_order_id,
    v_subtotal,
    v_shipping_fee,
    v_total,
    'pending'::TEXT;
END;
$$;

-- Allow guest & member checkout via the authoritative RPC
GRANT EXECUTE ON FUNCTION public.create_verified_order(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB
) TO anon, authenticated, service_role;
