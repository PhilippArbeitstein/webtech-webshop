-- Von ChatGPT generierte Sample Daten

-- Delete all data and reset identity sequences
TRUNCATE TABLE product RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
TRUNCATE TABLE address RESTART IDENTITY CASCADE;
TRUNCATE TABLE statuses RESTART IDENTITY CASCADE;
TRUNCATE TABLE categories RESTART IDENTITY CASCADE;
TRUNCATE TABLE conditions RESTART IDENTITY CASCADE;
TRUNCATE TABLE delivery_methods RESTART IDENTITY CASCADE;
TRUNCATE TABLE vehicle_marks RESTART IDENTITY CASCADE;
TRUNCATE TABLE vehicle_models RESTART IDENTITY CASCADE;
TRUNCATE TABLE vehicle_types RESTART IDENTITY CASCADE;
TRUNCATE TABLE fuel_types RESTART IDENTITY CASCADE;
TRUNCATE TABLE real_estate_types RESTART IDENTITY CASCADE;

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
('sophia.fuchs@example.at', 'sophiaf', 'safepassword', 4),
('max.mustermann@example.at', 'maxm', 'supersecurepassword', 3);

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

INSERT INTO categories (category_id, parent_category_id, name, additional_properties)
VALUES 
    -- Level 1: Real Estate -> Apartments
    (4, 2, 'Apartments', '{"type": "subcategory"}'),
    -- Level 2: Apartments -> Family Apartment
    (5, 4, 'Family Apartment', '{"type": "subcategory"}'),
    -- Level 2: Apartments -> Studio Apartment
    (6, 4, 'Studio Apartment', '{"type": "subcategory"}'),
    
    -- Level 1: Real Estate -> Houses
    (7, 2, 'Houses', '{"type": "subcategory"}'),
    -- Level 2: Houses -> Family House
    (8, 7, 'Family House', '{"type": "subcategory"}'),
    -- Level 2: Houses -> Villas
    (9, 7, 'Villa', '{"type": "subcategory"}'),
    
    -- Level 1: Real Estate -> Commercial Properties
    (10, 2, 'Commercial Properties', '{"type": "subcategory"}'),
    -- Level 2: Commercial Properties -> Offices
    (11, 10, 'Office', '{"type": "subcategory"}'),
    -- Level 2: Commercial Properties -> Retail Spaces
    (12, 10, 'Retail Space', '{"type": "subcategory"}');

    INSERT INTO categories (category_id, parent_category_id, name, additional_properties)
VALUES 
    -- Level 1: Electronics
    (13, 3, 'Electronics', '{"type": "subcategory"}'),
    -- Level 2: Electronics -> Mobile Phones
    (14, 13, 'Mobile Phones', '{"type": "subcategory"}'),
    -- Level 2: Electronics -> Laptops
    (15, 13, 'Laptops', '{"type": "subcategory"}'),
    -- Level 2: Electronics -> Accessories
    (16, 13, 'Accessories', '{"type": "subcategory"}'),

    -- Level 1: Toys
    (17, 3, 'Toys', '{"type": "subcategory"}'),
    -- Level 2: Toys -> Action Figures
    (18, 17, 'Action Figures', '{"type": "subcategory"}'),
    -- Level 2: Toys -> Educational Toys
    (19, 17, 'Educational Toys', '{"type": "subcategory"}'),
    -- Level 2: Toys -> Board Games
    (20, 17, 'Board Games', '{"type": "subcategory"}'),

    -- Level 1: Clothing
    (21, 3, 'Clothing', '{"type": "subcategory"}'),
    -- Level 2: Clothing -> Men
    (22, 21, 'Men', '{"type": "subcategory"}'),
    -- Level 2: Clothing -> Women
    (23, 21, 'Women', '{"type": "subcategory"}'),
    -- Level 2: Clothing -> Kids
    (24, 21, 'Kids', '{"type": "subcategory"}'),

    -- Level 1: Home Appliances
    (25, 3, 'Home Appliances', '{"type": "subcategory"}'),
    -- Level 2: Home Appliances -> Kitchen Appliances
    (26, 25, 'Kitchen Appliances', '{"type": "subcategory"}'),
    -- Level 2: Home Appliances -> Cleaning Appliances
    (27, 25, 'Cleaning Appliances', '{"type": "subcategory"}'),
    -- Level 2: Home Appliances -> Air Conditioners
    (28, 25, 'Air Conditioners', '{"type": "subcategory"}');



-- Populate table: conditions
INSERT INTO conditions (condition_name) VALUES
('New'),
('Used'),
('Broken');

-- Populate table: delivery_methods
INSERT INTO delivery_methods (delivery_method_name) VALUES
('Self Pick-Up'),
('Postal Delivery'), 
('Self Pick-up & Postal Delivery');

-- Populate table: product
INSERT INTO product (user_id, image_url, name, description, price, status_id, additional_properties) VALUES
(1, 'https://www.autoscout24.de/cms-content-assets/3B9Y6H0d0IKW0ME1vvMYED-6c735012b9f221707af8eb7bf297c004-Audi-A4-2008-1280-0b-1100.jpg', 'Audi A4', 'Audi A4, Benziner, top Zustand', 15000.00, 1, '{"year": 2018, "kilometers": 50000}'),
(2, 'https://cdn2.yamaha-motor.eu/prod/product-assets/2024/MT07AB-35/2024-Yamaha-MT07AB-35-EU-Yamaha_Black-Studio-001-03.jpg', 'Yamaha MT-07', 'Leichtes und schnelles Motorrad', 7000.00, 1, '{"year": 2020, "kilometers": 10000}'),
(3, 'https://www.hgh.haus/assets/images/wohnung/top-3/mietwohnung-salzburg-glaserstrasse-top-3-gross.jpg', 'Wohnung in Graz', '3-Zimmer-Wohnung in zentraler Lage', 250000.00, 1, '{"size": "80m²"}'),
(2, 'https://www.motorprofis.at/images/stories/1755/motmag~650223b5dbe8f.jpg', 'Peugeot 3008', 'SUV in hervorragendem Zustand, Diesel', 20000.00, 1, '{"year": 2019, "kilometers": 40000}'),
(3, 'https://www.motorrad-bilder.at/slideshows/291/016980/2019_YAM_YZF-R125_EU_DPBMC_STA_002-61813.jpg', 'Yamaha YZF-R125', 'Sportmotorrad für Anfänger, sehr gepflegt', 4500.00, 1, '{"year": 2022, "kilometers": 5000}'),
(4, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3bXeVE1CMdhLnZTYD_6tBOMh4T-Pk5iRpgQ&s', 'BMW X5', 'Luxuriöser SUV, ideal für Familien', 45000.00, 1, '{"year": 2021, "kilometers": 25000}'),
(4, 'https://schubertstone.com/wp-content/uploads/2020/09/Hollywood-Villa-in-Wien-mit-Naturstein-von-SCHUBERT-STONE-07-1-1024x684.jpg', 'Villa in Wien', 'Exklusive Villa im 19. Bezirk, 300m² Wohnfläche', 1250000.00, 1, '{"size": "300m²"}'),
(1, 'https://asset.dibeo.at/220/72a735f8539b4139aba67ee6b9caa2f0/big-jpeg/hausansicht-von-sueden.jpeg', 'Einfamilienhaus in Graz', 'Schönes Haus mit Garten in ruhiger Lage', 350000.00, 1, '{"size": "150m²"}'),
(2, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTHDK1_wkn3Sj52eX2ZweUp1N9qCqvoKG3ZQ&s', 'Apple MacBook Pro', 'Neuer MacBook Pro 16 Zoll, 512GB SSD', 2500.00, 1, '{"model": "2023"}'),
(3, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4UJ2r9GCc7lvSWszOGXhJWga8SKuOmJpq6Q&s', 'LG OLED TV', '55-Zoll OLED-Fernseher, 4K HDR', 1200.00, 1, '{"model": "2023"}'),
(1, 'https://www.bmw.at/content/dam/bmw/common/all-models/3-series/series-overview/bmw-3er-overview-page-ms-06.jpg', 'BMW 3er', 'Elegante Limousine, bestens gepflegt', 35000.00, 1, '{"year": 2020, "kilometers": 30000}'),
(2, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhD7pFyEJXv1iwi3T9Q9YzgiNARCZKb8L_mQ&s', 'Toyota Corolla', 'Kompaktwagen mit wenig Verbrauch', 20000.00, 1, '{"year": 2019, "kilometers": 45000}'),
(3, 'https://www.topgear.com/sites/default/files/cars-car/image/2021/08/5219-AudiUK00019837AudiA6Avant.jpg?w=1280&h=720', 'Audi A6', 'Luxuriöser Firmenwagen', 55000.00, 1, '{"year": 2021, "kilometers": 20000}'),
(4, 'https://images.ctfassets.net/uaddx06iwzdz/3gqiFBuETgFwyOGsjgAbap/59e252ef761c9b0a8ee42d784d08c546/Toyota-RAV4-Hybrid-Hero.jpg', 'Toyota RAV4', 'Moderner SUV mit Hybridantrieb', 40000.00, 1, '{"year": 2022, "kilometers": 15000}'),
(5, 'https://ai.dimaster.io/assets/cache/1920/960/media/Artikel/240912-Audi-Q5-neu/Audi-Q5-6.jpg', 'Audi Q5', 'Sportlicher SUV mit Allradantrieb', 60000.00, 1, '{"year": 2023, "kilometers": 5000}'),
(1, 'https://static.office-discount.at/img/16/17/Zoom_m2437166.jpg?width=800&height=800&fit=contain&bg=ffffff', 'iPhone 15', 'Das neueste Smartphone von Apple mit innovativen Features.', 999.99, 1, '{"brand": "Apple", "model": "iPhone 15", "color": "Silver"}'),
(2, 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mba13-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1708367688034', 'MacBook Air', 'Leichtes, leistungsstarkes Notebook mit M2 Chip.', 1199.99, 1, '{"brand": "Apple", "RAM": "8GB", "SSD": "256GB"}'),
(3, 'https://images.samsung.com/at/galaxy-watch6/feature/galaxy-watch6-kv-pc.jpg', 'Galaxy Watch 6', 'Stylische Smartwatch mit erweiterten Fitness-Funktionen.', 349.99, 1, '{"brand": "Samsung", "color": "Black", "batteryLife": "48 hours"}'),
(4, 'https://sony.scene7.com/is/image/sonyglobalsolutions/Primary_image_black?$categorypdpnav$&fmt=png-alpha', 'Sony WF-1000XM5', 'Kabellose Ohrhörer mit branchenführender Geräuschunterdrückung.', 299.99, 1, '{"brand": "Sony", "color": "White", "noiseCancelling": "Yes"}'),
(5, 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/refurb-ipad-pro-13inch-6th-gen-wifi-spacegray-202409?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1721694129629', 'iPad Pro', 'Tablet mit M2-Chip für Kreative und Professionals.', 1099.99, 1, '{"brand": "Apple", "RAM": "8GB", "SSD": "128GB"}'),
-- Electronics -> Mobile Phones
(3, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRw-AGQCGJ_sQHHKpskUlWdrkQiGSV23rF04ZxstNGv9UhmLoGtsMI8Up28IgH0aSelTDTMtwLXK-t0S09gwLwiqV3Y0iOVRcAaeZICcKKDZM3m504yT_Si', 'Google Pixel 8', 'Pure Android experience with exceptional camera', 799.99, 1, '{"brand": "Google", "model": "Pixel 8", "color": "Snow"}'),
-- Electronics -> Laptops
(4, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSLBORYbqOkZ0xtA7iB3u9iFbQD2ZeGLNOe6siqaOJ-fj-47UJW0lXv17LBsCuL9URjpIAqy1daQFpj5hggMoxzpScRTaiC6ePvceAu7R46JlZk9Aj0I7xA', 'Dell XPS 13', 'Compact, high-performance ultrabook', 1499.99, 1, '{"brand": "Dell", "RAM": "16GB", "SSD": "512GB"}'),
-- Electronics -> Accessories
(2, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSenaXpg3o-hVJahepd3tnRWAaFTVJbPSfZRxCKovlX2d8t3COJo5qps5zMt6jOg9ICnYzGGQqq_p4RvCjgVHleOaNskHLynJXJ6_MLQAyxolMXTRDcktxdTQ', 'Anker PowerCore 20000', 'High-capacity power bank with fast charging', 49.99, 1, '{"brand": "Anker", "capacity": "20000mAh", "ports": "2"}'),
-- Toys -> Action Figures
(5, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcT3f1xHoVipg5UhwbM-sTGbT9i5WKQecckRyE-WdsinndSW7kcz5nuS7sDUCIoJ7sZy3HrQMvsAC5nMyiQr4FLawZTEtzMv8Sf46QKel1DsV0t2RIj6EalWeZQ', 'Spider-Man Action Figure', 'Highly detailed action figure of Spider-Man', 29.99, 1, '{"brand": "Marvel", "height": "6 inches"}'),
(3, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcStWflDvunxjy11e3TEqMXEpEWJAOSd_mojakFbG__WQUqxR2-IA58nuiKwGf2ars21-3VBWzlt8lrqJqnBXp87WJ2PObHeysbDzUZKFbM0DRfCHp0t0_vQ', 'Batman Action Figure', 'Premium collectible of Batman', 39.99, 1, '{"brand": "DC", "height": "7 inches"}'),
-- Toys -> Educational Toys
(4, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSauGLK6w0QtZAdEwP29PI4va35klSi3QktUudDc9CUt0CcHDjF0mh373RsSJN89t-tAYmahWGETBk0aSLcGsDja21nq_fYEKz_mROKxwqOvz1HPxYyzZ0q5A', 'Magnetic Building Blocks', 'STEM toy for kids to develop creativity', 49.99, 1, '{"pieces": "100", "ageGroup": "3+"}'),
(2, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTLQKrLTdu5hWUtmeYWcE0K3Nz-162kj8_fxPj__dQ4tIb4CElq89_nhSIAZu7XREY5ZPflBJ5PjIK3GHocnlof9D13pXmazZf3kaWfqI6B', 'Math Flashcards', 'Interactive flashcards for learning basic math', 19.99, 1, '{"subjects": "Math", "ageGroup": "6+"}'),
-- Toys -> Board Games
(1, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTB55XhyhGGeDsqpMycLNRbzbCvKlWqnPIf9kXzTNwxh0aERWbTGyi5eDH3LcONp4K01UAu4UEoKfILvVzEVJCS-vlvS8LEO5CUYXB47NF0', 'Settlers of Catan', 'Popular strategy board game', 44.99, 1, '{"players": "3-4", "ageGroup": "10+"}'),
(5, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT7aJre8JI_pQA4KfW5oaf9xRKW2v_FXZdFgkqSOQHdK5DHHbNQ1rNzSLm6T2nVOEkuzQKwSRSJso0hpqflPFhGCsK4lwtpMuzOUBmNdHxxilEGczPmTMRM', 'Scrabble', 'Classic word game', 24.99, 1, '{"players": "2-4", "ageGroup": "8+"}'),
-- Clothing -> Men
(3, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcT9iGs5hSJF2s1u5ZH_PGjLHgp9X32QKzomVPNVMoed56mTOF7yn4pJo8BEQNkALhCFG-IAWr11jgLISmTiTYeLNTcBFqNDA0_F520Pm8ZJd6xucpBuqJ7a', 'Leather Jacket', 'Stylish men’s leather jacket', 199.99, 1, '{"size": "L", "color": "Black"}'),
(4, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT47ov9vTZkc1mtXCAU86dcshcoezEWfX-6I29817ea0hNTHpl0USkK2xUeZGh03eA1dO-71lpn0TlvdbcIBmmeLH60io3xT4rlnN9_Rz5ifxf5nOP-LCuh', 'Blue Jeans', 'Classic men’s denim jeans', 49.99, 1, '{"size": "32", "color": "Blue"}'),
-- Clothing -> Women
(2, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRGyW4ri2AU_ELW0o9C4JFCnYZVYtzMBtRv5Yd3j4g_K0jjRNWiKNu2swOrupM_T4rsYVnlenSiOkDOPRSP79pi3GSaOL6FFW9UE2AQj5yyL0sJijUwfQlHQQ', 'Summer Dress', 'Lightweight floral dress for summer', 39.99, 1, '{"size": "M", "color": "Red"}'),
(5, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQrGigNYLpqPZ-wXrIQpHqSikzaFSzoQwKhKwfweQW16GYyrxFMy06Rko7MHb4kYDtxK3b2I45Lp9okT83ZEOjlK_52bonp8PiVnXmYvYzZ76y_BA4SiuDrYA', 'Winter Jacket', 'Warm and cozy jacket for women', 149.99, 1, '{"size": "S", "color": "Grey"}'),
-- Clothing -> Kids
(1, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSvpIJtjXpJPmKbUmq8f2jZd8GY3LeRLUFP76Pr19Q3PkRkDaLSIiCow0cJCxKH_g2jbrdXdlyB83UgqcxcaUpNX6jQ-FMI-8wWhTmZHJrXFwxFoFZylTjoQQ', 'Kids T-Shirt', 'Fun graphic T-shirt for kids', 19.99, 1, '{"size": "S", "color": "Green"}'),
(3, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSqW2oQ_3P7vop0JZOxSIUxFcnSSLlxUKkjGAqpjlrd0LUvlkmqEpOgfRM5DyW32MULw-D0PBeowFu2XTLVMQV_9CdYpluDt3_-gXbShtNHiPcVqH89btAwxQ', 'Kids Hoodie', 'Comfortable hoodie for kids', 29.99, 1, '{"size": "M", "color": "Blue"}'),
-- Home Appliances -> Kitchen Appliances
(4, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSjsU254NgMIy-Lc9zopYtCUqytUzBpuYWQk8VM6yqGnWpFMTpoB0UBYvrUpMpRmO7D7qrVeiiXiHN94rfZto6TJ-XbhYgt1lA_FdlC0hQONNX3mQ2trfZr', 'High-Speed Blender', 'Durable blender for smoothies and shakes', 79.99, 1, '{"brand": "Ninja", "wattage": "1000W"}'),
(2, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQEfDWaKIulxPCEZKwzUqo3R8ZmBbwP6TmhpRMi7nfN40t_czlSRQMUu8rD9JxdyGZx6uKqfMvpiVOcnCx7n1inb01Xha2mK7naiorDrlASJSAwngU8Ms30Tm8', 'Coffee Maker', 'Automatic coffee maker with timer', 59.99, 1, '{"brand": "Philips", "capacity": "1.2L"}'),
-- Home Appliances -> Cleaning Appliances
(3, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRFX9I8ic1buf9J-KDoeS7_XQLIy7gewuJhM7I3adEihYvH039p8CiVHS13teHmm9QVDj79zANCxuMTTJBKrFn_Wz8DvcsZJkoKFJCwhuq4', 'Vacuum Cleaner', 'High-efficiency vacuum cleaner', 199.99, 1, '{"brand": "Dyson", "type": "Cordless"}'),
(5, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcS58Cw-FZ7Rha488coWZgESwL2Pvi9MItndiD-CtILeqpPdQLGNaQ0HCc5ClOqcThI5V_zV120lK9I_xXfV31nsIfoTC_D3MUXiPFKJXbz4xsKHSpDxRWos', 'Robot Vacuum', 'Smart robot vacuum with app control', 399.99, 1, '{"brand": "iRobot", "model": "Roomba 694"}'),
-- Home Appliances -> Air Conditioners
(1, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQnUPI3H12UAteV53oTqXyurlZIj-LXJndJFtnuRGpXDFCwvAfFYAS2RO3j-qaXihVctgOJVzMMYhpb2F2uDxGVx7xlEITeWOEhc-vQELM9natk3ySGc4JG', 'Window Air Conditioner', 'Energy-efficient window AC unit', 249.99, 1, '{"brand": "LG", "coolingCapacity": "12000 BTU"}'),
(2, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSNu1ukzLWhPPQzPf9hSkSBKjLHl2r30rf_ecNPAld7MHD4xB7bmkxCwUk-_g-xp_49gix5zT_1j-S5mdGDsMp7Uio1n6nBHoOn-myHTrwfH1PcjgPMqSsb7Q', 'Split Air Conditioner', 'Split AC with remote control', 699.99, 1, '{"brand": "Samsung", "coolingCapacity": "24000 BTU"}');


-- Populate table: product_has_category
INSERT INTO product_has_category (product_id, category_id) VALUES
(1, 1), -- Audi A4 to Vehicles
(2, 1), -- Yamaha MT-07 to Vehicles
(3, 2), -- Wohnung in Graz to Real Estate
(4, 1), -- Peugeot 3008 to Vehicles
(5, 1), -- Yamaha YZF-R125 to Vehicles
(6, 1), -- BMW X5 to Vehicles
(7, 2), -- Villa in Wien to Real Estate
(8, 2), -- Einfamilienhaus in Graz to Real Estate
(9, 3), -- Apple MacBook Pro to Retail
(10, 3), -- LG OLED TV to Retail
(11, 1), -- BMW 3er to Vehicles
(12, 1), -- Toyota Corolla to Vehicles
(13, 1), -- Audi A6 to Vehicles
(14, 1), -- Toyota RAV4 to Vehicles
(15, 1), -- Audi Q5 to Vehicles
(16, 3), -- iPhone 15 to Retail
(16, 14), -- iPhone 15 zu Mobile Phones
(17, 3), -- MacBook Air to Retail
(17, 15), -- MacBook Air zu Laptops
(18, 3), -- Galaxy Watch 6 to Retail
(18, 16), -- Galaxy Watch 6 zu Accessories
(19, 3), -- Sony WF-1000XM5 to Retail
(19, 16), -- Sony WF-1000XM5 zu Accessories
(20, 3), -- iPad Pro to Retail
(20, 16), -- iPad Pro zu Accessories
(21, 3), -- Google Pixel 8 to Retail
(21, 14), -- Google Pixel 8 to Mobile Phones
(22, 3), -- Dell XPS 13 to Retail
(22, 15), -- Dell XPS 13 to Laptops
(23, 3), -- Anker PowerCore 20000 to Retail
(23, 16), -- Anker PowerCore 20000 to Accessories
(24, 3), -- Spider-Man Action Figure to Retail
(24, 18), -- Spider-Man Action Figure to Action Figures
(25, 3), -- Batman Action Figure to Retail
(25, 18), -- Batman Action Figure to Action Figures
(26, 3), -- Magnetic Building Blocks to Retail
(26, 19), -- Magnetic Building Blocks to Educational Toys
(27, 3), -- Math Flashcards to Retail
(27, 19), -- Math Flashcards to Educational Toys
(28, 3), -- Settlers of Catan to Retail
(28, 20), -- Settlers of Catan to Board Games
(29, 3), -- Scrabble to Retail
(29, 20), -- Scrabble to Board Games
(30, 3), -- Leather Jacket to Retail
(30, 22), -- Leather Jacket to Men Clothing
(31, 3), -- Blue Jeans to Retail
(31, 22), -- Blue Jeans to Men Clothing
(32, 3), -- Summer Dress to Retail
(32, 23), -- Summer Dress to Women Clothing
(33, 3), -- Winter Jacket to Retail
(33, 23), -- Winter Jacket to Women Clothing
(34, 3), -- Kids T-Shirt to Retail
(34, 24), -- Kids T-Shirt to Kids Clothing
(35, 3), -- Kids Hoodie to Retail
(35, 24), -- Kids Hoodie to Kids Clothing
(36, 3), -- High-Speed Blender to Retail
(36, 26), -- High-Speed Blender to Kitchen Appliances
(37, 3), -- Coffee Maker to Retail
(37, 26), -- Coffee Maker to Kitchen Appliances
(38, 3), -- Vacuum Cleaner to Retail
(38, 27), -- Vacuum Cleaner to Cleaning Appliances
(39, 3), -- Robot Vacuum to Retail
(39, 27), -- Robot Vacuum to Cleaning Appliances
(40, 3), -- Window Air Conditioner to Retail
(40, 28), -- Window Air Conditioner to Air Conditioners
(41, 3), -- Split Air Conditioner to Retail
(41, 28); -- Split Air Conditioner to Air Conditioners

-- Populate table: vehicle_marks
INSERT INTO vehicle_marks (mark_name) VALUES
('Audi'), -- ID 1: Audi
('BMW'), -- ID 2: BMW
('Yamaha'), -- ID 3: Yamaha
('Honda'), -- ID 4: Honda
('Toyota'); -- ID 5: Toyota

-- Populate table: vehicle_models
INSERT INTO vehicle_models (mark_id, model_name) VALUES
(1, 'A4'), -- mark_id 1 refers to Audi
(2, '3 Series'), -- mark_id 2 refers to BMW
(3, 'MT-07'), -- mark_id 3 refers to Yamaha
(4, 'CBR500R'), -- mark_id 4 refers to Honda
(1, 'A6'), -- mark_id 1 refers to Audi
(1, 'Q5'), -- mark_id 1 refers to Audi
(5, 'Corolla'), -- mark_id 5 refers to Toyota
(5, 'RAV4'); -- mark_id 5 refers to Toyota

-- Populate table: vehicle_types
INSERT INTO vehicle_types (type_name, top_level_category) VALUES
('Limousine', 'Car'), -- type_id 1 refers to sedans under the category 'Car'
('SUV', 'Car'), -- type_id 2 refers to SUVs under the category 'Car'
('Sports Car', 'Car'), -- type_id 3 refers to sports cars under the category 'Car'
('Motorcycle', 'Motorcycle'); -- type_id 4 refers to motorcycles under the category 'Motorcycle'

-- Populate table: fuel_types
INSERT INTO fuel_types (fuel_type_name) VALUES
('Petrol'), -- fuel_type_id 1: Petrol
('Diesel'), -- fuel_type_id 2: Diesel
('Electric'); -- fuel_type_id 3: Electric

-- Weitere Fahrzeugdaten
INSERT INTO vehicles (product_id, mark_id, model_id, type_id, first_registration_date, mileage, fuel_type_id, color, condition_id) VALUES
(4, 2, 2, 2, '2021-05-10', 25000, 2, 'White', 2), -- BMW X5: type_id updated to 2 (SUV)
(5, 3, 4, 4, '2022-03-20', 5000, 1, 'Red', 1), -- Yamaha YZF-R125: type_id updated to 4 (Motorcycle)
(1, 1, 1, 1, '2018-06-01', 50000, 1, 'Black', 2), -- Audi A4: type_id remains 1 (Limousine)
(2, 3, 3, 4, '2020-08-15', 10000, 1, 'Blue', 2), -- Yamaha MT-07: type_id updated to 4 (Motorcycle)
(11, 2, 2, 1, '2020-07-15', 30000, 1, 'Black', 2), -- BMW 3 Series: type_id remains 1 (Limousine)
(12, 5, 5, 1, '2019-05-01', 45000, 1, 'Silver', 2), -- Toyota Corolla: type_id remains 1 (Limousine)
(13, 1, 6, 1, '2021-09-10', 20000, 1, 'Blue', 1), -- Audi A6: type_id remains 1 (Limousine)
(14, 5, 7, 2, '2022-02-20', 15000, 3, 'White', 1), -- Toyota RAV4: type_id updated to 2 (SUV)
(15, 1, 8, 2, '2023-05-01', 5000, 1, 'Gray', 1); -- Audi Q5: type_id updated to 2 (SUV)

-- Populate table: real_estate_types
INSERT INTO real_estate_types (type_name) VALUES
('Family Apartment'),
('Studio Apartment'),
('Office'),
('Retail Space'), 
('Family House'),
('Villa');

-- Populate table: real_estate
INSERT INTO real_estate (product_id, type_id, address_id, address_details, advance_payment, rent_start, rent_end) VALUES
(3, 1, 2, 'Near Graz Hauptplatz', 25000.00, '2024-01-01', '2025-01-01'),
(7, 3, 1, 'Exklusives Viertel im 19. Bezirk', 50000.00, '2024-06-01', '2025-06-01'), -- Villa in Wien
(8, 2, 2, 'Ruhige Wohngegend in Graz', 20000.00, '2024-03-01', '2025-03-01'); -- Einfamilienhaus in Graz

-- Weitere Retail-Daten
INSERT INTO retail (product_id, delivery_method_id, condition_id) VALUES
(9, 3, 1), -- MacBook Pro, Lieferung und Selbstabholung, Neu
(10, 2, 1), -- LG OLED TV, Lieferung, Neu
(16, 2, 2), -- Iphone 15, Lieferung, Used
(17, 1, 2), -- MacBook Air, Selbstabholung, Used
(18, 3, 3), -- Galaxy Watch 6, Beides, Broken
(19, 3, 1), -- Sony WF-1000XMS, Beides, New
(20, 1, 1), -- IPad Pro, Selbstabholung, New
(21, 3, 1), -- Google Pixel 8, Beides, New
(22, 3, 1), -- Dell XPS 13, Beides, New
(23, 2, 1), -- Anker PowerCore 20000, Lieferung, New
(24, 1, 1), -- Spider-Man Action Figure, Selbstabholung, New
(25, 1, 1), -- Batman Action Figure, Selbstabholung, New
(26, 3, 1), -- Magnetic Building Blocks, Beides, New
(27, 3, 1), -- Math Flashcards, Beides, New
(28, 3, 1), -- Settlers of Catan, Beides, New
(29, 3, 1), -- Scrabble, Beides, New
(30, 2, 1), -- Leather Jacket, Lieferung, New
(31, 2, 1), -- Blue Jeans, Lieferung, New
(32, 3, 2), -- Summer Dress, Beides, Used
(33, 3, 2), -- Winter Jacket, Beides, Used
(34, 1, 1), -- Kids T-Shirt, Selbstabholung, New
(35, 1, 1), -- Kids Hoodie, Selbstabholung, New
(36, 2, 1), -- High-Speed Blender, Lieferung, New
(37, 2, 1), -- Coffee Maker, Lieferung, New
(38, 3, 1), -- Vacuum Cleaner, Beides, New
(39, 3, 1), -- Robot Vacuum, Beides, New
(40, 1, 1), -- Window Air Conditioner, Selbstabholung, New
(41, 1, 1); -- Split Air Conditioner, Selbstabholung, New

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

-- Fixing stupid mistake
ALTER TABLE vehicles
ALTER COLUMN first_registration_date TYPE TIMESTAMP USING first_registration_date::TIMESTAMP;
