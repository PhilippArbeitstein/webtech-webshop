-- Von ChatGPT generierte Sample Daten
-- Populate table: address
INSERT INTO address (city, address, province) VALUES
('Wien', 'Mariahilfer Straße 50', 'Wien'),
('Graz', 'Herrengasse 10', 'Steiermark'),
('Linz', 'Landstraße 20', 'Oberösterreich'),
('Salzburg', 'Getreidegasse 15', 'Salzburg');

-- Populate table: users
INSERT INTO users (email, username, password, address_id) VALUES
('hans.muster@example.at', 'hansm', 'securepassword', 1),
('anna.scherzer@example.at', 'annas', 'anothersecurepassword', 2),
('lukas.lechner@example.at', 'lukasl', 'yetanotherpassword', 3),
('sophia.fuchs@example.at', 'sophiaf', 'safepassword', 4);

-- Populate table: statuses
INSERT INTO statuses (status_name) VALUES
('Available'),
('Sold'),
('Reserved');

-- Populate table: categories
INSERT INTO categories (name, additional_properties) VALUES
('Vehicles', '{"type": "category"}'),
('Real Estate', '{"type": "category"}'),
('Retail', '{"type": "category"}');

-- Populate table: conditions
INSERT INTO conditions (condition_name) VALUES
('New'),
('Used'),
('Broken');

-- Populate table: delivery_methods
INSERT INTO delivery_methods (delivery_method_name) VALUES
('Self Pick-Up'),
('Postal Delivery'), 
('Both');

-- Populate table: product
INSERT INTO product (user_id, image_url, name, description, price, status_id, additional_properties) VALUES
(1, 'https://www.autoscout24.de/cms-content-assets/3B9Y6H0d0IKW0ME1vvMYED-6c735012b9f221707af8eb7bf297c004-Audi-A4-2008-1280-0b-1100.jpg', 'Audi A4', 'Audi A4, Benziner, top Zustand', 15000.00, 1, '{"year": 2018, "kilometers": 50000}'),
(2, 'https://cdn2.yamaha-motor.eu/prod/product-assets/2024/MT07AB-35/2024-Yamaha-MT07AB-35-EU-Yamaha_Black-Studio-001-03.jpg', 'Yamaha MT-07', 'Leichtes und schnelles Motorrad', 7000.00, 1, '{"year": 2020, "kilometers": 10000}'),
(3, 'https://www.hgh.haus/assets/images/wohnung/top-3/mietwohnung-salzburg-glaserstrasse-top-3-gross.jpg', 'Wohnung in Graz', '3-Zimmer-Wohnung in zentraler Lage', 250000.00, 1, '{"size": "80m²"}');

-- Populate table: product_has_category
INSERT INTO product_has_category (product_id, category_id) VALUES
(1, 1),
(2, 1),
(3, 2);

-- Populate table: retail
INSERT INTO retail (product_id, delivery_method_id, condition_id) VALUES
(1, 1, 2),
(2, 2, 2);

-- Populate table: vehicle_marks
INSERT INTO vehicle_marks (mark_name) VALUES
('Audi'),
('BMW'),
('Yamaha'),
('Honda');

-- Populate table: vehicle_models
INSERT INTO vehicle_models (mark_id, model_name) VALUES
(1, 'A4'),
(2, '3 Series'),
(3, 'MT-07'),
(4, 'CBR500R');

-- Populate table: vehicle_types
INSERT INTO vehicle_types (type_name) VALUES
('Car'),
('Motorcycle');

-- Populate table: fuel_types
INSERT INTO fuel_types (fuel_type_name) VALUES
('Petrol'),
('Diesel'),
('Electric');

-- Populate table: vehicles
INSERT INTO vehicles (product_id, mark_id, model_id, type_id, first_registration_date, mileage, fuel_type_id, color, condition_id) VALUES
(1, 1, 1, 1, '2018-06-01', 50000, 1, 'Black', 2),
(2, 3, 3, 2, '2020-08-15', 10000, 1, 'Blue', 2);

-- Populate table: real_estate_types
INSERT INTO real_estate_types (type_name) VALUES
('Apartment'),
('House'),
('Commercial');

-- Populate table: real_estate
INSERT INTO real_estate (product_id, type_id, address_id, address_details, advance_payment, rent_start, rent_end) VALUES
(3, 1, 2, 'Near Graz Hauptplatz', 25000.00, '2024-01-01', '2025-01-01');

-- Populate table: requests
INSERT INTO requests (product_id, from_user_id, to_user_id, message, status_id) VALUES
(1, 2, 1, 'Is this Audi A4 still available?', 1),
(3, 4, 3, 'I am interested in renting this apartment.', 1);

-- Populate table: messages
INSERT INTO messages (from_user_id, to_user_id, product_id, message) VALUES
(2, 1, 1, 'Can we arrange a viewing?'),
(4, 3, 3, 'Is the price negotiable?');


-- Weitere Fahrzeuge
INSERT INTO product (user_id, image_url, name, description, price, status_id, additional_properties) VALUES
(2, 'https://www.motorprofis.at/images/stories/1755/motmag~650223b5dbe8f.jpg', 'Peugeot 3008', 'SUV in hervorragendem Zustand, Diesel', 20000.00, 1, '{"year": 2019, "kilometers": 40000}'),
(3, 'https://www.motorrad-bilder.at/slideshows/291/016980/2019_YAM_YZF-R125_EU_DPBMC_STA_002-61813.jpg', 'Yamaha YZF-R125', 'Sportmotorrad für Anfänger, sehr gepflegt', 4500.00, 1, '{"year": 2022, "kilometers": 5000}'),
(4, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3bXeVE1CMdhLnZTYD_6tBOMh4T-Pk5iRpgQ&s', 'BMW X5', 'Luxuriöser SUV, ideal für Familien', 45000.00, 1, '{"year": 2021, "kilometers": 25000}');

-- Weitere Immobilien
INSERT INTO product (user_id, image_url, name, description, price, status_id, additional_properties) VALUES
(4, 'https://schubertstone.com/wp-content/uploads/2020/09/Hollywood-Villa-in-Wien-mit-Naturstein-von-SCHUBERT-STONE-07-1-1024x684.jpg', 'Villa in Wien', 'Exklusive Villa im 19. Bezirk, 300m² Wohnfläche', 1250000.00, 1, '{"size": "300m²"}'),
(1, 'https://asset.dibeo.at/220/72a735f8539b4139aba67ee6b9caa2f0/big-jpeg/hausansicht-von-sueden.jpeg', 'Einfamilienhaus in Graz', 'Schönes Haus mit Garten in ruhiger Lage', 350000.00, 1, '{"size": "150m²"}');

-- Weitere Retail-Produkte
INSERT INTO product (user_id, image_url, name, description, price, status_id, additional_properties) VALUES
(2, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTHDK1_wkn3Sj52eX2ZweUp1N9qCqvoKG3ZQ&s', 'Apple MacBook Pro', 'Neuer MacBook Pro 16 Zoll, 512GB SSD', 2500.00, 1, '{"model": "2023"}'),
(3, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4UJ2r9GCc7lvSWszOGXhJWga8SKuOmJpq6Q&s', 'LG OLED TV', '55-Zoll OLED-Fernseher, 4K HDR', 1200.00, 1, '{"model": "2023"}');

-- Kategorienzuordnung für neue Produkte
INSERT INTO product_has_category (product_id, category_id) VALUES
(4, 1), -- BMW X5 zu Vehicles
(5, 1), -- Yamaha YZF-R125 zu Vehicles
(6, 2), -- Villa in Wien zu Real Estate
(7, 2), -- Einfamilienhaus in Graz zu Real Estate
(8, 3), -- MacBook Pro zu Retail
(9, 3); -- LG OLED TV zu Retail

-- Weitere Retail-Daten
INSERT INTO retail (product_id, delivery_method_id, condition_id) VALUES
(8, 3, 1), -- MacBook Pro, Lieferung und Selbstabholung, Neu
(9, 2, 1); -- LG OLED TV, Lieferung und Selbstabholung, Neu

-- Weitere Fahrzeugdaten
INSERT INTO vehicles (product_id, mark_id, model_id, type_id, first_registration_date, mileage, fuel_type_id, color, condition_id) VALUES
(4, 2, 2, 1, '2021-05-10', 25000, 2, 'White', 2), -- BMW X5
(5, 3, 4, 2, '2022-03-20', 5000, 1, 'Red', 1); -- Yamaha YZF-R125

-- Weitere Immobilien-Daten
INSERT INTO real_estate_types (type_name) VALUES
('Villa'), ('Family House');

INSERT INTO real_estate (product_id, type_id, address_id, address_details, advance_payment, rent_start, rent_end) VALUES
(6, 3, 1, 'Exklusives Viertel im 19. Bezirk', 50000.00, '2024-06-01', '2025-06-01'), -- Villa in Wien
(7, 2, 2, 'Ruhige Wohngegend in Graz', 20000.00, '2024-03-01', '2025-03-01'); -- Einfamilienhaus in Graz
