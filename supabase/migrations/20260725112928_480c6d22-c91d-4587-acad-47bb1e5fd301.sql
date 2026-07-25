
UPDATE public.devices SET active = false
WHERE model_name IN (
  'iPhone 7','iPhone 7 Plus','iPhone 8','iPhone 8 Plus',
  'iPhone XR','iPhone XS','iPhone XS Max','iPhone SE (2020)'
);

DELETE FROM public.inventory
WHERE device_id IN (
  SELECT id FROM public.devices WHERE active = false
);
