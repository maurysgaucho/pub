-- ==========================================
-- KENYAN BEVERAGE SEED CATALOGUE
-- ==========================================

-- Note: These are template products. Tenants will copy these to their own space.

INSERT INTO product_categories (tenant_id, name, description) VALUES
('TEMPLATE_ID', 'Beers', 'Lagers and Stouts'),
('TEMPLATE_ID', 'Spirits', 'Vodkas, Gins, Whiskies'),
('TEMPLATE_ID', 'Soft Drinks', 'Sodas and Water'),
('TEMPLATE_ID', 'Wines', 'Red, White and Sparkling');

-- BEERS
INSERT INTO products (tenant_id, category_id, name, brand, selling_price, unit_of_measure) VALUES
('TEMPLATE_ID', (SELECT id FROM product_categories WHERE name='Beers'), 'Tusker Lager', 'EABL', 250, 'Bottle'),
('TEMPLATE_ID', (SELECT id FROM product_categories WHERE name='Beers'), 'Tusker Lite', 'EABL', 250, 'Bottle'),
('TEMPLATE_ID', (SELECT id FROM product_categories WHERE name='Beers'), 'WhiteCap Lager', 'EABL', 300, 'Bottle'),
('TEMPLATE_ID', (SELECT id FROM product_categories WHERE name='Beers'), 'Guinness Smooth', 'EABL', 300, 'Bottle'),
('TEMPLATE_ID', (SELECT id FROM product_categories WHERE name='Beers'), 'Summit Lager', 'Keroche', 200, 'Bottle');

-- SPIRITS
INSERT INTO products (tenant_id, category_id, name, brand, selling_price, unit_of_measure) VALUES
('TEMPLATE_ID', (SELECT id FROM product_categories WHERE name='Spirits'), 'Kenya Cane', 'KWAL', 1200, 'Bottle'),
('TEMPLATE_ID', (SELECT id FROM product_categories WHERE name='Spirits'), 'Kibao Vodka', 'KWAL', 600, 'Bottle'),
('TEMPLATE_ID', (SELECT id FROM product_categories WHERE name='Spirits'), 'Gilbey''s Gin', 'Diageo', 1500, 'Bottle');

-- SOFT DRINKS
INSERT INTO products (tenant_id, category_id, name, brand, selling_price, unit_of_measure) VALUES
('TEMPLATE_ID', (SELECT id FROM product_categories WHERE name='Soft Drinks'), 'Coca Cola', 'Coca Cola', 100, 'Bottle'),
('TEMPLATE_ID', (SELECT id FROM product_categories WHERE name='Soft Drinks'), 'Stoney Tangawizi', 'Coca Cola', 100, 'Bottle'),
('TEMPLATE_ID', (SELECT id FROM product_categories WHERE name='Soft Drinks'), 'Mineral Water', 'Aquafina', 80, 'Bottle');
