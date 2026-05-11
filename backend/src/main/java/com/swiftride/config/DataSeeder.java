package com.swiftride.config;

import com.swiftride.model.*;
import com.swiftride.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final FareRateRepository fareRateRepository;
    private final TripRepository tripRepository;

    public DataSeeder(
            UserRepository userRepository,
            DriverRepository driverRepository,
            VehicleRepository vehicleRepository,
            FareRateRepository fareRateRepository,
            TripRepository tripRepository
    ) {
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.vehicleRepository = vehicleRepository;
        this.fareRateRepository = fareRateRepository;
        this.tripRepository = tripRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        User admin = userRepository.save(new User("Admin User", "admin@swiftride.com", "admin123", Role.ADMIN, "0300-0000000"));
        User rider = userRepository.save(new User("Ahmed Khan", "ahmed@gmail.com", "rider123", Role.RIDER, "0301-1111111"));
        User driverUser = userRepository.save(new User("Bilal Ahmed", "bilal@gmail.com", "driver123", Role.DRIVER, "0302-2222222"));

        Driver driver = driverRepository.save(new Driver(driverUser, "LHR-DRV-2044", 31.5109, 74.3441));
        vehicleRepository.save(new Vehicle(driver, "Toyota", "Corolla", "LEA-2026", "White"));

        FareRate standard = fareRateRepository.save(new FareRate("Standard", 120, 65, 8));
        fareRateRepository.save(new FareRate("Premium", 180, 95, 12));

        Trip sample = new Trip();
        sample.setRider(rider);
        sample.setDriver(driver);
        sample.setPickupAddress("Liberty Market, Lahore");
        sample.setDropoffAddress("Emporium Mall, Lahore");
        sample.setPickupLat(31.5102);
        sample.setPickupLng(74.3441);
        sample.setDropoffLat(31.4676);
        sample.setDropoffLng(74.2652);
        sample.setDistanceKm(9.2);
        sample.setFare(standard.getBaseFare() + 9.2 * standard.getPerKmRate() + 10 * standard.getPerMinuteRate());
        sample.setStatus(TripStatus.COMPLETED);
        tripRepository.save(sample);

        User secondDriver = userRepository.save(new User("Sara Malik", "sara.driver@gmail.com", "driver123", Role.DRIVER, "0303-3333333"));
        Driver available = driverRepository.save(new Driver(secondDriver, "LHR-DRV-2045", 31.5497, 74.3436));
        vehicleRepository.save(new Vehicle(available, "Honda", "City", "LHR-4455", "Black"));

        admin.setActive(true);
    }
}
