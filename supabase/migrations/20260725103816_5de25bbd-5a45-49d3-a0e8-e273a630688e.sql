
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

-- Recreate has_role in the private schema
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;

-- Rewrite policies that referenced public.has_role
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
    FROM pg_policies
    WHERE (qual LIKE '%has_role%' OR with_check LIKE '%has_role%')
      AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- Recreate the admin policies using private.has_role
-- trade_in_submissions
CREATE POLICY "admins read submissions" ON public.trade_in_submissions
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update submissions" ON public.trade_in_submissions
  FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete submissions" ON public.trade_in_submissions
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

-- orders
CREATE POLICY "admins read orders" ON public.orders
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update orders" ON public.orders
  FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete orders" ON public.orders
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

-- Recreate admin policies for other tables that used public.has_role
-- inventory
CREATE POLICY "admins manage inventory" ON public.inventory
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- devices
CREATE POLICY "admins manage devices" ON public.devices
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- pricing_config
CREATE POLICY "admins manage pricing_config" ON public.pricing_config
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- storage_multipliers
CREATE POLICY "admins manage storage_multipliers" ON public.storage_multipliers
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- grade_multipliers
CREATE POLICY "admins manage grade_multipliers" ON public.grade_multipliers
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- refurb_cost_items
CREATE POLICY "admins manage refurb_cost_items" ON public.refurb_cost_items
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- site_content
CREATE POLICY "admins manage site_content" ON public.site_content
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- user_roles
CREATE POLICY "admins manage user_roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- Now drop the public.has_role wrapper (no longer referenced)
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
