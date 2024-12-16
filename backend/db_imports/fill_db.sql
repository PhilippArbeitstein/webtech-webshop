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


-- Weiteren Benutzer Hinzufügen
INSERT INTO users (email, username, password, address_id) 
VALUES ('max.mustermann@example.at', 'maxm', 'supersecurepassword', 3);

-- Sicherstellen, dass Toyota in vehicle_marks existiert (falls nicht vorhanden)
INSERT INTO vehicle_marks (mark_name) VALUES
('Toyota');

-- Neue Modelle zu vehicle_models hinzufügen (falls nicht vorhanden)
INSERT INTO vehicle_models (mark_id, model_name) VALUES
(1, 'A6'),
(1, 'Q5'),
(5, 'Corolla'),
(5, 'RAV4');

-- Weitere Produkte hinzufügen
INSERT INTO product (user_id, image_url, name, description, price, status_id, additional_properties) VALUES
(1, 'https://www.bmw.at/content/dam/bmw/common/all-models/3-series/series-overview/bmw-3er-overview-page-ms-06.jpg', 'BMW 3er', 'Elegante Limousine, bestens gepflegt', 35000.00, 1, '{"year": 2020, "kilometers": 30000}'),
(2, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhD7pFyEJXv1iwi3T9Q9YzgiNARCZKb8L_mQ&s', 'Toyota Corolla', 'Kompaktwagen mit wenig Verbrauch', 20000.00, 1, '{"year": 2019, "kilometers": 45000}'),
(3, 'https://www.topgear.com/sites/default/files/cars-car/image/2021/08/5219-AudiUK00019837AudiA6Avant.jpg?w=1280&h=720', 'Audi A6', 'Luxuriöser Firmenwagen', 55000.00, 1, '{"year": 2021, "kilometers": 20000}'),
(4, 'https://images.ctfassets.net/uaddx06iwzdz/3gqiFBuETgFwyOGsjgAbap/59e252ef761c9b0a8ee42d784d08c546/Toyota-RAV4-Hybrid-Hero.jpg', 'Toyota RAV4', 'Moderner SUV mit Hybridantrieb', 40000.00, 1, '{"year": 2022, "kilometers": 15000}'),
(5, 'https://ai.dimaster.io/assets/cache/1920/960/media/Artikel/240912-Audi-Q5-neu/Audi-Q5-6.jpg', 'Audi Q5', 'Sportlicher SUV mit Allradantrieb', 60000.00, 1, '{"year": 2023, "kilometers": 5000}');

-- Produkte den Kategorien zuordnen
INSERT INTO product_has_category (product_id, category_id) VALUES
(36, 1), -- BMW 3er
(37, 1), -- Toyota Corolla
(38, 1), -- Audi A6
(39, 1), -- Toyota RAV4
(40, 1); -- Audi Q5

-- Weitere Fahrzeugdaten hinzufügen
INSERT INTO vehicles (product_id, mark_id, model_id, type_id, first_registration_date, mileage, fuel_type_id, color, condition_id) VALUES
(36, 2, 2, 1, '2020-07-15', 30000, 1, 'Black', 2), -- BMW 3er
(37, 5, 5, 1, '2019-05-01', 45000, 1, 'Silver', 2), -- Toyota Corolla
(38, 1, 6, 1, '2021-09-10', 20000, 1, 'Blue', 1), -- Audi A6
(39, 5, 7, 1, '2022-02-20', 15000, 3, 'White', 1), -- Toyota RAV4
(40, 1, 8, 1, '2023-05-01', 5000, 1, 'Gray', 1); -- Audi Q5

-- messages hinzufügen
-- Messages about product_id 1 (Audi A4)
INSERT INTO messages (from_user_id, to_user_id, product_id, message, created_at) VALUES
(2, 1, 1, 'Hello! Is the Audi A4 still available?', '2024-12-16 10:30:00'),
(1, 2, 1, 'Yes, it is available. Are you interested?', '2024-12-16 10:45:00'),
(2, 1, 1, 'I am. Can we schedule a test drive this weekend?', '2024-12-16 11:00:00'),
(1, 2, 1, 'Sure, Saturday morning works for me.', '2024-12-16 11:15:00');

-- Messages about product_id 3 (Wohnung in Graz)
INSERT INTO messages (from_user_id, to_user_id, product_id, message, created_at) VALUES
(3, 2, 3, 'I saw your listing for the apartment in Graz. Is it still for sale?', '2024-12-15 09:00:00'),
(2, 3, 3, 'Yes, it is. Do you want to arrange a viewing?', '2024-12-15 09:15:00'),
(3, 2, 3, 'Yes, can we do Friday afternoon?', '2024-12-15 09:30:00'),
(2, 3, 3, 'Perfect, I will send you the address details.', '2024-12-15 09:45:00');

-- Messages about product_id 8 (Apple MacBook Pro)
INSERT INTO messages (from_user_id, to_user_id, product_id, message, created_at) VALUES
(4, 2, 8, 'Is the MacBook Pro still available for pick-up?', '2024-12-14 14:00:00'),
(2, 4, 8, 'Yes, it is. When would you like to pick it up?', '2024-12-14 14:15:00'),
(4, 2, 8, 'Tomorrow afternoon, if that works for you.', '2024-12-14 14:30:00'),
(2, 4, 8, 'Sounds good! I will confirm the location via email.', '2024-12-14 14:45:00');

-- Messages about product_id 6 (Villa in Wien)
INSERT INTO messages (from_user_id, to_user_id, product_id, message, created_at) VALUES
(1, 4, 6, 'Is the villa still available? It looks amazing.', '2024-12-13 12:00:00'),
(4, 1, 6, 'It is. Would you like to schedule a tour?', '2024-12-13 12:15:00'),
(1, 4, 6, 'Yes, please. How about next Monday?', '2024-12-13 12:30:00'),
(4, 1, 6, 'That works. I will send you the details shortly.', '2024-12-13 12:45:00');

-- Messages about product_id 2 (Yamaha MT-07)
INSERT INTO messages (from_user_id, to_user_id, product_id, message, created_at) VALUES
(3, 1, 2, 'Hi, I am interested in the Yamaha MT-07. Is it available?', '2024-12-12 10:00:00'),
(1, 3, 2, 'Yes, it is available. Do you want to take a look?', '2024-12-12 10:15:00'),
(3, 1, 2, 'Yes, I would like to see it in person. When are you free?', '2024-12-12 10:30:00'),
(1, 3, 2, 'I am free on Wednesday afternoon. Does that work?', '2024-12-12 10:45:00'),
(3, 1, 2, 'Perfect. See you then.', '2024-12-12 11:00:00');