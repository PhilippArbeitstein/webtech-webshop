-- Create table: address
CREATE TABLE address (
    address_id SERIAL PRIMARY KEY,
    city VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL
);

-- Create table: users
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address_id INT REFERENCES address(address_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_creation CHECK (created_at <= updated_at)
);

-- Create table: statuses
CREATE TABLE statuses (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL
);

-- Create table: categories
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    parent_category_id INT REFERENCES categories(category_id),
    name VARCHAR(255),
    additional_properties JSONB
);

-- Create table: conditions
CREATE TABLE conditions (
    condition_id SERIAL PRIMARY KEY,
    condition_name VARCHAR(255) UNIQUE NOT NULL
);

-- Create table: delivery_methods
CREATE TABLE delivery_methods (
    delivery_method_id SERIAL PRIMARY KEY,
    delivery_method_name VARCHAR(50) UNIQUE NOT NULL
);

-- Create table: product
CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    image_url TEXT UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    status_id INT NOT NULL REFERENCES statuses(status_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT product_creation CHECK (created_at <= updated_at),
    additional_properties JSONB
);

-- Create table: product_has_category
CREATE TABLE product_has_category (
    product_id INT REFERENCES product(product_id),
    category_id INT REFERENCES categories(category_id),
    PRIMARY KEY (product_id, category_id)
);

-- Create table: retail
CREATE TABLE retail (
    product_id INT PRIMARY KEY REFERENCES product(product_id),
    delivery_method_id INT REFERENCES delivery_methods(delivery_method_id),
    condition_id INT REFERENCES conditions(condition_id)
);

-- Create table: vehicle_marks
CREATE TABLE vehicle_marks (
    mark_id SERIAL PRIMARY KEY,
    mark_name VARCHAR(255) NOT NULL
);

-- Create table: vehicle_models
CREATE TABLE vehicle_models (
    model_id SERIAL PRIMARY KEY,
    mark_id INT NOT NULL REFERENCES vehicle_marks(mark_id),
    model_name VARCHAR(255) NOT NULL
);

-- Create table: vehicle_types
CREATE TABLE vehicle_types (
    type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(255) NOT NULL,
    Top_level_category VARCHAR(50)
);

-- Create table: fuel_types
CREATE TABLE fuel_types (
    fuel_type_id SERIAL PRIMARY KEY,
    fuel_type_name VARCHAR(50) UNIQUE NOT NULL
);

-- Create table: vehicles
CREATE TABLE vehicles (
    product_id INT PRIMARY KEY REFERENCES product(product_id),
    mark_id INT NOT NULL REFERENCES vehicle_marks(mark_id),
    model_id INT NOT NULL REFERENCES vehicle_models(model_id),
    type_id INT NOT NULL REFERENCES vehicle_types(type_id),
    first_registration_date DATE,
    mileage INT,
    fuel_type_id INT REFERENCES fuel_types(fuel_type_id),
    color VARCHAR(50),
    condition_id INT REFERENCES conditions(condition_id)
);

-- Create table: real_estate_types
CREATE TABLE real_estate_types (
    type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(255) NOT NULL
);

-- Create table: real_estate
CREATE TABLE real_estate (
    product_id INT PRIMARY KEY REFERENCES product(product_id),
    type_id INT NOT NULL REFERENCES real_estate_types(type_id),
    address_id INT REFERENCES address(address_id),
    address_details TEXT,
    advance_payment NUMERIC(10, 2),
    rent_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rent_end TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT rent_period CHECK (rent_start < rent_end)
);

-- Create table: messages
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    from_user_id INT NOT NULL REFERENCES users(user_id),
    to_user_id INT NOT NULL REFERENCES users(user_id),
    product_id INT NOT NULL REFERENCES product(product_id),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

