package com.swiftride.repository;

import com.swiftride.model.Driver;
import com.swiftride.model.Trip;
import com.swiftride.model.TripStatus;
import com.swiftride.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByRiderOrderByRequestedAtDesc(User rider);
    List<Trip> findByDriverOrderByRequestedAtDesc(Driver driver);
    List<Trip> findByStatusOrderByRequestedAtDesc(TripStatus status);
}
