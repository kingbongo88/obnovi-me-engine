
-- CMS site_content table
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT ALL ON public.site_content TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.site_content TO authenticated;

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read site_content" ON public.site_content
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admins manage site_content" ON public.site_content
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_content_touch BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- Seed default CMS keys
INSERT INTO public.site_content (key, value) VALUES
  ('home.hero_eyebrow', 'Obnovljeni iPhone iz Crne Gore'),
  ('home.hero_title', 'Vrhunski iPhone. Pola cijene.'),
  ('home.hero_sub', 'Provjeren, testiran u 40 tačaka, sa 6 mjeseci garancije. Dostava po cijeloj Crnoj Gori.'),
  ('home.trust_1', '40-tačaka provjera'),
  ('home.trust_2', '6 mjeseci garancije'),
  ('home.trust_3', '14 dana povrata'),
  ('home.trust_4', 'Dostava 1-2 dana'),
  ('about.body', 'Obnovi.me je crnogorski marketplace za obnovljene iPhone uređaje. Svaki uređaj prolazi rigoroznu provjeru prije nego stigne do vas.'),
  ('faq.intro', 'Najčešća pitanja o kupovini, otkupu i garanciji.')
ON CONFLICT (key) DO NOTHING;

-- Auto-grant admin to admin@obnovi.me on verified signup
CREATE OR REPLACE FUNCTION public.grant_admin_for_seed_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL AND lower(NEW.email) = 'admin@obnovi.me' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_seed_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_admin_for_seed_email();

CREATE TRIGGER on_auth_user_confirmed_seed_admin
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW
WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.grant_admin_for_seed_email();
