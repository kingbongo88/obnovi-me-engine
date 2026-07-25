
-- Drop public read on orders (PII exposure). Server functions use service role.
DROP POLICY IF EXISTS "public read orders by id" ON public.orders;

-- Drop public insert policies; server functions will insert via service role.
DROP POLICY IF EXISTS "anyone can place order" ON public.orders;
DROP POLICY IF EXISTS "anyone can submit trade-in" ON public.trade_in_submissions;

-- Revoke EXECUTE on SECURITY DEFINER trigger functions from client-facing roles.
-- has_role stays executable so RLS policies can use it.
REVOKE EXECUTE ON FUNCTION public.tg_touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.grant_admin_for_seed_email() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
