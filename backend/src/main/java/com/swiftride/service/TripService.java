package com.swiftride.service;

import com.swiftride.dto.RatingRequest;
import com.swiftride.dto.TripRequest;
import com.swiftride.model.*;
import com.swiftride.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TripService {
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final FareRateRepository fareRateRepository;
    private final RatingRepository ratingRepository;

    public TripService(
            TripRepository tripRepository,
            UserRepository userRepository,
            DriverRepository driverRepository,
            FareRateRepository fareRateRepository,
            RatingRepository ratingRepository
    ) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.fareRateRepository = fareRateRepository;
        this.ratingRepository = ratingRepository;
    }

    public Trip bookTrip(TripRequest request) {
        User rider = userRepository.findById(request.getRiderId())
                .orElseThrow(() -> new IllegalArgumentException("Rider not found"));

        FareRate rate = fareRateRepository.findFirstByActiveTrueOrderByIdAsc()
                .orElse(new FareRate("Standard", 120, 65, 8));

        double distance = request.getDistanceKm() > 0 ? request.getDistanceKm() : calculateDistanceKm(
                request.getPickupLat(), request.getPickupLng(), request.getDropoffLat(), request.getDropoffLng());

        Trip trip = new Trip();
        trip.setRider(rider);
        trip.setPickupAddress(request.getPickupAddress());
        trip.setDropoffAddress(request.getDropoffAddress());
        trip.setPickupLat(request.getPickupLat());
        trip.setPickupLng(request.getPickupLng());
        trip.setDropoffLat(request.getDropoffLat());
        trip.setDropoffLng(request.getDropoffLng());
        trip.setDistanceKm(round(distance));
        trip.setFare(round(rate.getBaseFare() + distance * rate.getPerKmRate() + 10 * rate.getPerMinuteRate()));
        trip.setStatus(TripStatus.REQUESTED);

        return tripRepository.save(trip);
    }

    public Trip acceptTrip(Long tripId, Long driverId) {
        Trip trip = findTrip(tripId);
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
        trip.setDriver(driver);
        trip.setStatus(TripStatus.ACCEPTED);
        driver.setAvailable(false);
        driver.setCurrentLat(trip.getPickupLat());
        driver.setCurrentLng(trip.getPickupLng());
        driverRepository.save(driver);
        return tripRepository.save(trip);
    }

    public Trip completeTrip(Long tripId) {
        Trip trip = findTrip(tripId);
        trip.setStatus(TripStatus.COMPLETED);
        trip.setCompletedAt(LocalDateTime.now());
        if (trip.getDriver() != null) {
            Driver driver = trip.getDriver();
            driver.setAvailable(true);
            driver.setCurrentLat(trip.getDropoffLat());
            driver.setCurrentLng(trip.getDropoffLng());
            driverRepository.save(driver);
        }
        return tripRepository.save(trip);
    }

    public Rating rateTrip(RatingRequest request) {
        Trip trip = findTrip(request.getTripId());
        if (trip.getDriver() == null || trip.getStatus() != TripStatus.COMPLETED) {
            throw new IllegalArgumentException("Only completed trips with drivers can be rated");
        }
        ratingRepository.findByTrip(trip).ifPresent(existing -> {
            throw new IllegalArgumentException("Trip already rated");
        });

        Rating rating = new Rating();
        rating.setTrip(trip);
        rating.setRider(trip.getRider());
        rating.setDriver(trip.getDriver());
        rating.setStars(Math.max(1, Math.min(5, request.getStars())));
        rating.setComment(request.getComment());
        Rating saved = ratingRepository.save(rating);
        refreshDriverRating(trip.getDriver());
        return saved;
    }

    public List<Trip> riderTrips(Long riderId) {
        User rider = userRepository.findById(riderId).orElseThrow();
        return tripRepository.findByRiderOrderByRequestedAtDesc(rider);
    }

    public List<Trip> driverTrips(Long driverId) {
        Driver driver = driverRepository.findById(driverId).orElseThrow();
        return tripRepository.findByDriverOrderByRequestedAtDesc(driver);
    }

    public List<Trip> requestedTrips() {
        return tripRepository.findByStatusOrderByRequestedAtDesc(TripStatus.REQUESTED);
    }

    private Trip findTrip(Long tripId) {
        return tripRepository.findById(tripId).orElseThrow(() -> new IllegalArgumentException("Trip not found"));
    }

    private void refreshDriverRating(Driver driver) {
        List<Rating> ratings = ratingRepository.findByDriver(driver);
        double average = ratings.stream().mapToInt(Rating::getStars).average().orElse(5.0);
        driver.setRatingAverage(round(average));
        driverRepository.save(driver);
    }

    private double calculateDistanceKm(double lat1, double lng1, double lat2, double lng2) {
        double earthRadius = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
