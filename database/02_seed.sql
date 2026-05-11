USE swiftride;

INSERT IGNORE INTO users (id, name, email, password, role, phone, active) VALUES
(1, 'Admin User', 'admin@swiftride.com', 'admin123', 'ADMIN', '0300-0000000', true),
(2, 'Ahmed Khan', 'ahmed@gmail.com', 'rider123', 'RIDER', '0301-1111111', true),
(3, 'Bilal Ahmed', 'bilal@gmail.com', 'driver123', 'DRIVER', '0302-2222222', true),
(4, 'Sara Malik', 'sara.driver@gmail.com', 'driver123', 'DRIVER', '0303-3333333', true);

INSERT IGNORE INTO drivers (id, user_id, license_number, available, current_lat, current_lng, rating_average) VALUES
(1, 3, 'LHR-DRV-2044', true, 31.5109, 74.3441, 5),
(2, 4, 'LHR-DRV-2045', true, 31.5497, 74.3436, 5);

INSERT IGNORE INTO vehicles (id, driver_id, make, model, plate_number, color) VALUES
(1, 1, 'Toyota', 'Corolla', 'LEA-2026', 'White'),
(2, 2, 'Honda', 'City', 'LHR-4455', 'Black');

INSERT IGNORE INTO fare_rates (id, vehicle_type, base_fare, per_km_rate, per_minute_rate, active) VALUES
(1, 'Standard', 120, 65, 8, true),
(2, 'Premium', 180, 95, 12, true);

INSERT IGNORE INTO trips (id, rider_id, driver_id, pickup_address, dropoff_address, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, distance_km, fare, status) VALUES
(1, 2, 1, 'Liberty Market, Lahore', 'Emporium Mall, Lahore', 31.5102, 74.3441, 31.4676, 74.2652, 9.2, 798, 'COMPLETED');
