
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "user can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins can read all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ DEVICES ============
CREATE TABLE public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_type TEXT NOT NULL DEFAULT 'iphone' CHECK (device_type IN ('iphone','ipad')),
  model_name TEXT NOT NULL UNIQUE,
  release_year INT NOT NULL,
  base_resale_value NUMERIC(10,2) NOT NULL,
  buy_tier INT NOT NULL CHECK (buy_tier IN (1,2)),
  storage_options INT[] NOT NULL,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.devices TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.devices TO authenticated;
GRANT ALL ON public.devices TO service_role;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "devices public read" ON public.devices FOR SELECT USING (active);
CREATE POLICY "admins manage devices" ON public.devices FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ STORAGE MULTIPLIERS ============
CREATE TABLE public.storage_multipliers (
  storage_gb INT PRIMARY KEY,
  multiplier NUMERIC(5,3) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.storage_multipliers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.storage_multipliers TO authenticated;
GRANT ALL ON public.storage_multipliers TO service_role;
ALTER TABLE public.storage_multipliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "storage_multipliers public read" ON public.storage_multipliers FOR SELECT USING (true);
CREATE POLICY "admins manage storage_multipliers" ON public.storage_multipliers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ GRADE MULTIPLIERS ============
CREATE TABLE public.grade_multipliers (
  grade TEXT PRIMARY KEY CHECK (grade IN ('A+','A','B')),
  label_me TEXT NOT NULL,
  description_me TEXT NOT NULL,
  multiplier NUMERIC(5,3) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.grade_multipliers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.grade_multipliers TO authenticated;
GRANT ALL ON public.grade_multipliers TO service_role;
ALTER TABLE public.grade_multipliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "grade_multipliers public read" ON public.grade_multipliers FOR SELECT USING (true);
CREATE POLICY "admins manage grade_multipliers" ON public.grade_multipliers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ REFURB COST ITEMS ============
CREATE TABLE public.refurb_cost_items (
  key TEXT PRIMARY KEY,
  label_me TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.refurb_cost_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.refurb_cost_items TO authenticated;
GRANT ALL ON public.refurb_cost_items TO service_role;
ALTER TABLE public.refurb_cost_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "refurb_cost_items public read" ON public.refurb_cost_items FOR SELECT USING (active);
CREATE POLICY "admins manage refurb_cost_items" ON public.refurb_cost_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ PRICING CONFIG (singleton) ============
CREATE TABLE public.pricing_config (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  target_margin NUMERIC(5,3) NOT NULL DEFAULT 0.33,
  warranty_reserve NUMERIC(5,3) NOT NULL DEFAULT 0.05,
  min_payout_floor NUMERIC(10,2) NOT NULL DEFAULT 20,
  tier2_flat_payout NUMERIC(10,2) NOT NULL DEFAULT 25,
  round_step NUMERIC(10,2) NOT NULL DEFAULT 5,
  list_price_ending INT NOT NULL DEFAULT 9,
  diagnostic_min_battery INT NOT NULL DEFAULT 85,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pricing_config TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.pricing_config TO authenticated;
GRANT ALL ON public.pricing_config TO service_role;
ALTER TABLE public.pricing_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pricing_config public read" ON public.pricing_config FOR SELECT USING (true);
CREATE POLICY "admins manage pricing_config" ON public.pricing_config FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ TRADE-IN SUBMISSIONS ============
CREATE TABLE public.trade_in_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code TEXT NOT NULL UNIQUE,
  device_id UUID REFERENCES public.devices(id),
  model_name TEXT NOT NULL,
  storage_gb INT NOT NULL,
  screening_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  battery_health INT NOT NULL,
  cosmetic_grade TEXT,
  effective_grade TEXT,
  functional_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  cracked_screen BOOLEAN NOT NULL DEFAULT FALSE,
  cracked_back BOOLEAN NOT NULL DEFAULT FALSE,
  resale_value NUMERIC(10,2),
  refurb_cost NUMERIC(10,2),
  calculated_payout NUMERIC(10,2),
  breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  rejection_reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','completed','cancelled')),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  dropoff_method TEXT NOT NULL,
  dropoff_city TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.trade_in_submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.trade_in_submissions TO authenticated;
GRANT ALL ON public.trade_in_submissions TO service_role;
ALTER TABLE public.trade_in_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit trade-in" ON public.trade_in_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "admins read submissions" ON public.trade_in_submissions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins update submissions" ON public.trade_in_submissions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete submissions" ON public.trade_in_submissions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- ============ INVENTORY ============
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES public.devices(id),
  storage_gb INT NOT NULL,
  grade TEXT NOT NULL CHECK (grade IN ('A+','A','B')),
  battery_health INT NOT NULL,
  list_price NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','reserved','sold','hidden')),
  photos TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  description_me TEXT,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.inventory TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.inventory TO authenticated;
GRANT ALL ON public.inventory TO service_role;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inventory public read available" ON public.inventory FOR SELECT USING (status = 'available');
CREATE POLICY "admins read all inventory" ON public.inventory FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage inventory" ON public.inventory FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ ORDERS ============
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code TEXT NOT NULL UNIQUE,
  inventory_id UUID REFERENCES public.inventory(id),
  item_snapshot JSONB NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT,
  notes TEXT,
  payment_method TEXT NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod','card')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','confirmed','shipped','delivered','cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT SELECT ON public.orders TO anon, authenticated;
GRANT UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can place order" ON public.orders FOR INSERT WITH CHECK (true);
-- Public lookup by reference_code is fine (guests need order status). No PII listed on the client
-- unless they know the code (obscure UUID-derived). Admins can update.
CREATE POLICY "public read orders by id" ON public.orders FOR SELECT USING (true);
CREATE POLICY "admins update orders" ON public.orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete orders" ON public.orders FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- ============ updated_at trigger ============
CREATE OR REPLACE FUNCTION public.tg_touch_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER t_devices_updated BEFORE UPDATE ON public.devices FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER t_storage_updated BEFORE UPDATE ON public.storage_multipliers FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER t_grade_updated BEFORE UPDATE ON public.grade_multipliers FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER t_refurb_updated BEFORE UPDATE ON public.refurb_cost_items FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER t_pricing_updated BEFORE UPDATE ON public.pricing_config FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER t_subs_updated BEFORE UPDATE ON public.trade_in_submissions FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER t_inv_updated BEFORE UPDATE ON public.inventory FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER t_orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- ============ SEED DATA ============
INSERT INTO public.pricing_config (id) VALUES (1);

INSERT INTO public.storage_multipliers (storage_gb, multiplier) VALUES
  (64, 0.90), (128, 1.00), (256, 1.15), (512, 1.35), (1024, 1.55);

INSERT INTO public.grade_multipliers (grade, label_me, description_me, multiplier, sort_order) VALUES
  ('A+', 'Odlično', 'Bez vidljivih tragova korišćenja na ekranu ili leđima.', 1.08, 1),
  ('A',  'Vrlo dobro', 'Lagane ogrebotine, nevidljive sa normalne razdaljine.', 1.00, 2),
  ('B',  'Dobro', 'Vidljive ogrebotine ili udubljenja, ili napuklo staklo na leđima (ekran mora biti ispravan).', 0.85, 3);

INSERT INTO public.refurb_cost_items (key, label_me, amount, sort_order) VALUES
  ('diagnostic',         'Dijagnostika i čišćenje (uvijek)',        12, 1),
  ('battery_replace',    'Zamjena baterije (85–89%)',               35, 2),
  ('screen_cracked',     'Zamjena napuklog ekrana',                 70, 3),
  ('back_cracked',       'Zamjena napuklog stakla / okvira',        50, 4),
  ('back_dented',        'Kozmetička obrada leđa / okvira',         15, 5),
  ('charging_port',      'Popravka konektora za punjenje',          25, 6),
  ('speaker_mic',        'Popravka zvučnika / mikrofona',           20, 7),
  ('camera',             'Popravka kamere',                         40, 8);

INSERT INTO public.devices (model_name, release_year, base_resale_value, buy_tier, storage_options, sort_order) VALUES
  ('iPhone XR',           2018,  90, 1, ARRAY[64,128,256], 10),
  ('iPhone XS',           2018, 100, 1, ARRAY[64,256,512], 20),
  ('iPhone XS Max',       2018, 110, 1, ARRAY[64,256,512], 30),
  ('iPhone 11',           2019, 150, 1, ARRAY[64,128,256], 40),
  ('iPhone 11 Pro',       2019, 190, 1, ARRAY[64,256,512], 50),
  ('iPhone 11 Pro Max',   2019, 210, 1, ARRAY[64,256,512], 60),
  ('iPhone 12 mini',      2020, 170, 1, ARRAY[64,128,256], 70),
  ('iPhone 12',           2020, 210, 1, ARRAY[64,128,256], 80),
  ('iPhone 12 Pro',       2020, 270, 1, ARRAY[128,256,512], 90),
  ('iPhone 12 Pro Max',   2020, 300, 1, ARRAY[128,256,512], 100),
  ('iPhone 13 mini',      2021, 280, 1, ARRAY[128,256,512], 110),
  ('iPhone 13',           2021, 330, 1, ARRAY[128,256,512], 120),
  ('iPhone 13 Pro',       2021, 430, 1, ARRAY[128,256,512,1024], 130),
  ('iPhone 13 Pro Max',   2021, 500, 1, ARRAY[128,256,512,1024], 140),
  ('iPhone 14',           2022, 380, 1, ARRAY[128,256,512], 150),
  ('iPhone 14 Plus',      2022, 440, 1, ARRAY[128,256,512], 160),
  ('iPhone 14 Pro',       2022, 510, 1, ARRAY[128,256,512,1024], 170),
  ('iPhone 14 Pro Max',   2022, 570, 1, ARRAY[128,256,512,1024], 180),
  ('iPhone 15',           2023, 500, 1, ARRAY[128,256,512], 190),
  ('iPhone 15 Plus',      2023, 550, 1, ARRAY[128,256,512], 200),
  ('iPhone 15 Pro',       2023, 675, 1, ARRAY[128,256,512,1024], 210),
  ('iPhone 15 Pro Max',   2023, 780, 1, ARRAY[256,512,1024], 220),
  ('iPhone 16',           2024, 690, 1, ARRAY[128,256,512], 230),
  ('iPhone 16 Plus',      2024, 790, 1, ARRAY[128,256,512], 240),
  ('iPhone 16 Pro',       2024, 930, 1, ARRAY[128,256,512,1024], 250),
  ('iPhone 16 Pro Max',   2024, 1070,1, ARRAY[256,512,1024], 260),
  ('iPhone 7',            2016,  55, 2, ARRAY[32,128,256], 1),
  ('iPhone 7 Plus',       2016,  55, 2, ARRAY[32,128,256], 2),
  ('iPhone 8',            2017,  70, 2, ARRAY[64,128,256], 3),
  ('iPhone 8 Plus',       2017,  70, 2, ARRAY[64,128,256], 4),
  ('iPhone SE (2020)',    2020,  60, 2, ARRAY[64,128,256], 5);
