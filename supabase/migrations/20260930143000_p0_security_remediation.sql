-- ============================================================================
-- SAKALA MOTORCYCLE CLUB — P0 SECURITY REMEDIATION MIGRATION
-- File: supabase/migrations/20260930143000_p0_security_remediation.sql
-- Objectives:
-- 1. SEC-001: Trusted Database Admin Authorization (Replace email substring matching)
-- 2. SEC-002: Prevent Self-Admin Privilege Escalation on public.profiles
-- 3. SEC-003: Prevent Order PII Exposure on public.orders while preserving guest checkout
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. STRICT DATABASE AUTHORIZATION (is_admin function)
-- Eliminates substring matching and derives admin status strictly from public.profiles
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Strict check: Authenticated UID must exist in profiles with admin / founder / artisan role
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() 
      AND role IN ('admin', 'founder', 'artisan')
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- Ensure legitimate admin account is preserved with admin role in public.profiles (idempotent)
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'raihanputrairawan8@gmail.com';

-- ----------------------------------------------------------------------------
-- 2. PREVENT PRIVILEGE ESCALATION ON public.profiles (Database Triggers)
-- Ordinary users can update profile details (name, avatar, address)
-- but CANNOT alter the authorization 'role' column.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_unauthorized_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If role is modified
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Only allow if the executing user is already verified admin
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

-- Also ensure INSERT on profiles defaults to 'member' for non-admins
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

-- ----------------------------------------------------------------------------
-- 3. SECURE public.orders RLS POLICIES (Remediate SEC-003 PII Leak)
-- DROP dangerous 'USING (true)' SELECT policy
-- ----------------------------------------------------------------------------
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select on orders" ON public.orders;
DROP POLICY IF EXISTS "Admin and owner select on orders" ON public.orders;
DROP POLICY IF EXISTS "Admin select all orders" ON public.orders;
DROP POLICY IF EXISTS "Customer select own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
DROP POLICY IF EXISTS "Admin update orders" ON public.orders;

-- 3a. Admin can view all orders
CREATE POLICY "Admin select all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.is_admin());

-- 3b. Authenticated customer can only view orders matching their auth email
CREATE POLICY "Customer select own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  (auth.jwt() ->> 'email') IS NOT NULL 
  AND customer_email = (auth.jwt() ->> 'email')
);

-- 3c. Public INSERT for guest checkout remains functional (INSERT != SELECT)
CREATE POLICY "Allow public insert on orders"
ON public.orders
FOR INSERT
TO public
WITH CHECK (true);

-- 3d. Admin update orders
CREATE POLICY "Admin update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4. SECURE GUEST ORDER TRACKING RPC
-- Allows guest tracking by exact Order ID without granting SELECT * on orders table
-- Returns only non-sensitive tracking fields (excludes email, phone, street address)
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
