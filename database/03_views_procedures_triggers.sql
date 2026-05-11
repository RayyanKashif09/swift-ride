USE swiftride;

CREATE OR REPLACE VIEW trip_report_view AS
SELECT
    t.id AS trip_id,
    rider.name AS rider_name,
    driver_user.name AS driver_name,
    t.pickup_address,
    t.dropoff_address,
    t.distance_km,
    t.fare,
    t.status,
    t.requested_at
FROM trips t
JOIN users rider ON rider.id = t.rider_id
LEFT JOIN drivers d ON d.id = t.driver_id
LEFT JOIN users driver_user ON driver_user.id = d.user_id;

DELIMITER //

CREATE PROCEDURE get_driver_earnings(IN input_driver_id BIGINT)
BEGIN
    SELECT
        input_driver_id AS driver_id,
        COUNT(*) AS completed_trips,
        COALESCE(SUM(fare), 0) AS total_earnings
    FROM trips
    WHERE driver_id = input_driver_id AND status = 'COMPLETED';
END //

CREATE TRIGGER after_rating_insert
AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    UPDATE drivers
    SET rating_average = (
        SELECT AVG(stars)
        FROM ratings
        WHERE driver_id = NEW.driver_id
    )
    WHERE id = NEW.driver_id;
END //

DELIMITER ;
