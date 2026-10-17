INSERT INTO public.storage_multipliers (storage_gb, multiplier) SELECT 2048, 1.85 WHERE NOT EXISTS (SELECT 1 FROM public.storage_multipliers WHERE storage_gb = 2048);
INSERT INTO public.devices (device_type, model_name, release_year, base_resale_value, buy_tier, storage_options, sort_order, active)
SELECT v.* FROM (VALUES
 ('iphone','iPhone 18 Pro',2026,950::numeric,1,ARRAY[256,512,1024,2048],290,true),
 ('iphone','iPhone 18 Pro Max',2026,1150::numeric,1,ARRAY[256,512,1024,2048],295,true),
 ('iphone','iPhone Duo',2026,1550::numeric,1,ARRAY[256,512,1024,2048],300,true)
) AS v(device_type, model_name, release_year, base_resale_value, buy_tier, storage_options, sort_order, active)
WHERE NOT EXISTS (SELECT 1 FROM public.devices d WHERE d.model_name = v.model_name);