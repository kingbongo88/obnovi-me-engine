
-- Seed variety of colors per model for testing color functionality
INSERT INTO public.inventory (device_id, storage_gb, grade, battery_health, list_price, color, status, description_me)
SELECT d.id, s.storage_gb, s.grade, s.battery, s.price, s.color, 'available', 'Testni primjerak'
FROM public.devices d
CROSS JOIN LATERAL (VALUES
  (128, 'A+', 100, 349, 'Pink'),
  (128, 'A', 92, 319, 'Blue'),
  (256, 'A', 90, 369, 'Starlight'),
  (256, 'B', 87, 329, 'Green')
) AS s(storage_gb, grade, battery, price, color)
WHERE d.model_name = 'iPhone 13';

INSERT INTO public.inventory (device_id, storage_gb, grade, battery_health, list_price, color, status, description_me)
SELECT d.id, s.storage_gb, s.grade, s.battery, s.price, s.color, 'available', 'Testni primjerak'
FROM public.devices d
CROSS JOIN LATERAL (VALUES
  (128, 'A+', 100, 549, 'Blue'),
  (128, 'A', 91, 509, 'Starlight'),
  (256, 'A', 89, 559, 'Midnight'),
  (256, 'B', 86, 479, 'Yellow')
) AS s(storage_gb, grade, battery, price, color)
WHERE d.model_name = 'iPhone 15';

INSERT INTO public.inventory (device_id, storage_gb, grade, battery_health, list_price, color, status, description_me)
SELECT d.id, s.storage_gb, s.grade, s.battery, s.price, s.color, 'available', 'Testni primjerak'
FROM public.devices d
CROSS JOIN LATERAL (VALUES
  (128, 'A', 91, 429, 'Purple'),
  (128, 'A+', 100, 469, 'Midnight'),
  (256, 'A', 88, 469, 'Starlight'),
  (256, 'B', 86, 419, 'Red')
) AS s(storage_gb, grade, battery, price, color)
WHERE d.model_name = 'iPhone 14';

INSERT INTO public.inventory (device_id, storage_gb, grade, battery_health, list_price, color, status, description_me)
SELECT d.id, s.storage_gb, s.grade, s.battery, s.price, s.color, 'available', 'Testni primjerak'
FROM public.devices d
CROSS JOIN LATERAL (VALUES
  (128, 'A+', 100, 619, 'Black'),
  (128, 'A', 90, 579, 'Ultramarine'),
  (256, 'A', 89, 629, 'Teal'),
  (256, 'B', 87, 549, 'Pink')
) AS s(storage_gb, grade, battery, price, color)
WHERE d.model_name = 'iPhone 16';

INSERT INTO public.inventory (device_id, storage_gb, grade, battery_health, list_price, color, status, description_me)
SELECT d.id, s.storage_gb, s.grade, s.battery, s.price, s.color, 'available', 'Testni primjerak'
FROM public.devices d
CROSS JOIN LATERAL (VALUES
  (256, 'A+', 100, 949, 'Natural Titanium'),
  (256, 'A', 92, 899, 'Blue Titanium'),
  (512, 'A', 90, 1099, 'White Titanium'),
  (512, 'B', 87, 999, 'Black Titanium')
) AS s(storage_gb, grade, battery, price, color)
WHERE d.model_name = 'iPhone 15 Pro';

INSERT INTO public.inventory (device_id, storage_gb, grade, battery_health, list_price, color, status, description_me)
SELECT d.id, s.storage_gb, s.grade, s.battery, s.price, s.color, 'available', 'Testni primjerak'
FROM public.devices d
CROSS JOIN LATERAL (VALUES
  (128, 'A+', 100, 449, 'Deep Purple'),
  (128, 'A', 91, 419, 'Gold'),
  (256, 'A', 89, 479, 'Silver'),
  (256, 'B', 86, 429, 'Space Black')
) AS s(storage_gb, grade, battery, price, color)
WHERE d.model_name = 'iPhone 14 Pro';

INSERT INTO public.inventory (device_id, storage_gb, grade, battery_health, list_price, color, status, description_me)
SELECT d.id, s.storage_gb, s.grade, s.battery, s.price, s.color, 'available', 'Testni primjerak'
FROM public.devices d
CROSS JOIN LATERAL (VALUES
  (64, 'A', 90, 249, 'Purple'),
  (64, 'A+', 100, 279, 'Blue'),
  (128, 'A', 88, 279, 'Red'),
  (128, 'B', 86, 239, 'Black')
) AS s(storage_gb, grade, battery, price, color)
WHERE d.model_name = 'iPhone 12';
