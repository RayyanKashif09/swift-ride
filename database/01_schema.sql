CREATE DATABASE IF NOT EXISTS swiftride;
USE swiftride;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role ENUM('RIDER', 'DRIVER', 'ADMIN') NOT NULL,
    phone VARCHAR(30),
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS drivers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    license_number VARCHAR(60),
    available BOOLEAN DEFAULT TRUE,
    current_lat DOUBLE DEFAULT 31.5204,
    current_lng DOUBLE DEFAULT 74.3587,
    rating_average DOUBLE DEFAULT 5,
    CONSTRAINT fk_drivers_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    driver_id BIGINT NOT NULL,
    make VARCHAR(60),
    model VARCHAR(60),
    plate_number VARCHAR(30),
    color VARCHAR(40),
    CONSTRAINT fk_vehicles_driver FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

CREATE TABLE IF NOT EXISTS fare_rates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    vehicle_type VARCHAR(60),
    base_fare DOUBLE NOT NULL,
    per_km_rate DOUBLE NOT NULL,
    per_minute_rate DOUBLE NOT NULL,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS trips (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    rider_id BIGINT NOT NULL,
    driver_id BIGINT,
    pickup_address VARCHAR(180),
    dropoff_address VARCHAR(180),
    pickup_lat DOUBLE,
    pickup_lng DOUBLE,
    dropoff_lat DOUBLE,
    dropoff_lng DOUBLE,
    distance_km DOUBLE,
    fare DOUBLE,
    status ENUM('REQUESTED', 'ACCEPTED', 'COMPLETED', 'CANCELLED') DEFAULT 'REQUESTED',
    requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    CONSTRAINT fk_trips_rider FOREIGN KEY (rider_id) REFERENCES users(id),
    CONSTRAINT fk_trips_driver FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

CREATE TABLE IF NOT EXISTS ratings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    trip_id BIGINT NOT NULL UNIQUE,
    rider_id BIGINT NOT NULL,
    driver_id BIGINT NOT NULL,
    stars INT NOT NULL,
    comment VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ratings_trip FOREIGN KEY (trip_id) REFERENCES trips(id),
    CONSTRAINT fk_ratings_rider FOREIGN KEY (rider_id) REFERENCES users(id),
    CONSTRAINT fk_ratings_driver FOREIGN KEY (driver_id) REFERENCES drivers(id)
);
