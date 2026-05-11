package com.swiftride.service;

import com.swiftride.model.Trip;
import com.swiftride.model.TripStatus;
import com.swiftride.repository.DriverRepository;
import com.swiftride.repository.TripRepository;
import com.swiftride.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ReportService {
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;

    public ReportService(UserRepository userRepository, DriverRepository driverRepository, TripRepository tripRepository) {
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.tripRepository = tripRepository;
    }

    public Map<String, Object> summary() {
        var trips = tripRepository.findAll();
        double revenue = trips.stream()
                .filter(trip -> trip.getStatus() == TripStatus.COMPLETED)
                .mapToDouble(Trip::getFare)
                .sum();

        Map<String, Object> data = new HashMap<>();
        data.put("users", userRepository.count());
        data.put("drivers", driverRepository.count());
        data.put("trips", trips.size());
        data.put("completedTrips", trips.stream().filter(t -> t.getStatus() == TripStatus.COMPLETED).count());
        data.put("requestedTrips", trips.stream().filter(t -> t.getStatus() == TripStatus.REQUESTED).count());
        data.put("revenue", Math.round(revenue * 100.0) / 100.0);
        return data;
    }
}
