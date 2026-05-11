package com.swiftride.controller;

import com.swiftride.dto.RatingRequest;
import com.swiftride.dto.TripRequest;
import com.swiftride.model.Rating;
import com.swiftride.model.Trip;
import com.swiftride.repository.TripRepository;
import com.swiftride.service.TripService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {
    private final TripService tripService;
    private final TripRepository tripRepository;

    public TripController(TripService tripService, TripRepository tripRepository) {
        this.tripService = tripService;
        this.tripRepository = tripRepository;
    }

    @GetMapping
    public List<Trip> all() {
        return tripRepository.findAll();
    }

    @GetMapping("/requested")
    public List<Trip> requested() {
        return tripService.requestedTrips();
    }

    @GetMapping("/rider/{riderId}")
    public List<Trip> riderTrips(@PathVariable Long riderId) {
        return tripService.riderTrips(riderId);
    }

    @GetMapping("/driver/{driverId}")
    public List<Trip> driverTrips(@PathVariable Long driverId) {
        return tripService.driverTrips(driverId);
    }

    @PostMapping
    public Trip book(@RequestBody TripRequest request) {
        return tripService.bookTrip(request);
    }

    @PutMapping("/{tripId}/accept/{driverId}")
    public Trip accept(@PathVariable Long tripId, @PathVariable Long driverId) {
        return tripService.acceptTrip(tripId, driverId);
    }

    @PutMapping("/{tripId}/complete")
    public Trip complete(@PathVariable Long tripId) {
        return tripService.completeTrip(tripId);
    }

    @PostMapping("/rate")
    public Rating rate(@RequestBody RatingRequest request) {
        return tripService.rateTrip(request);
    }
}
