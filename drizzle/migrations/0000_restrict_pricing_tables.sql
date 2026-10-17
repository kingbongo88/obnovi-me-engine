DROP POLICY IF EXISTS "grade_multipliers public read" ON public.grade_multipliers;
DROP POLICY IF EXISTS "storage_multipliers public read" ON public.storage_multipliers;
DROP POLICY IF EXISTS "pricing_config public read" ON public.pricing_config;
REVOKE SELECT ON public.grade_multipliers, public.storage_multipliers, public.pricing_config FROM anon;
GRANT ALL ON public.grade_multipliers, public.storage_multipliers, public.pricing_config TO service_role;