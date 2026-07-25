
INSERT INTO public.devices (model_name, release_year, base_resale_value, buy_tier, storage_options, sort_order, active) VALUES
  ('iPhone 16e', 2025, 520, 1, ARRAY[128,256,512], 260, true),
  ('iPhone 17e', 2025, 680, 1, ARRAY[128,256], 265, true),
  ('iPhone 17', 2025, 665, 1, ARRAY[256,512], 270, true),
  ('iPhone Air', 2025, 739, 1, ARRAY[256,512,1024], 275, true),
  ('iPhone 17 Pro', 2025, 817, 1, ARRAY[256,512,1024], 280, true),
  ('iPhone 17 Pro Max', 2025, 1043, 1, ARRAY[256,512,1024], 285, true)
ON CONFLICT DO NOTHING;
