UPDATE public.devices d SET base_resale_value = v.b, updated_at = now()
FROM (VALUES
('iPhone 11',165),('iPhone 11 Pro',195),('iPhone 11 Pro Max',225),
('iPhone 12 mini',185),('iPhone 12',215),('iPhone 12 Pro',265),('iPhone 12 Pro Max',300),
('iPhone 13 mini',255),('iPhone 13',285),('iPhone 13 Pro',365),('iPhone 13 Pro Max',415),
('iPhone 14',330),('iPhone 14 Plus',365),('iPhone 14 Pro',440),('iPhone 14 Pro Max',500),
('iPhone 15',420),('iPhone 15 Plus',460),('iPhone 15 Pro',540),('iPhone 15 Pro Max',610),
('iPhone 16e',400),('iPhone 16',520),('iPhone 16 Plus',570),('iPhone 16 Pro',680),('iPhone 16 Pro Max',760),
('iPhone 17e',540),('iPhone 17',600),('iPhone Air',680),('iPhone 17 Pro',820),('iPhone 17 Pro Max',920),
('iPhone 18 Pro',1000),('iPhone 18 Pro Max',1090),('iPhone Duo',1650)
) AS v(name,b) WHERE d.model_name = v.name;