package com.swiftride.repository;

import com.swiftride.model.Driver;
import com.swiftride.model.Rating;
import com.swiftride.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByTrip(Trip trip);
    List<Rating> findByDriver(Driver driver);
}
