package com.swiftride.controller;

import com.swiftride.model.Driver;
import com.swiftride.model.User;
import com.swiftride.repository.DriverRepository;
import com.swiftride.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {
    private final DriverRepository driverRepository;
    private final UserRepository userRepository;

    public DriverController(DriverRepository driverRepository, UserRepository userRepository) {
        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Driver> all() {
        return driverRepository.findAll();
    }

    @GetMapping("/available")
    public List<Driver> available() {
        return driverRepository.findByAvailableTrue();
    }

    @GetMapping("/by-user/{userId}")
    public Driver byUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return driverRepository.findByUser(user).orElseThrow();
    }

    @PutMapping("/{id}/availability")
    public Driver availability(@PathVariable Long id, @RequestParam boolean available) {
        Driver driver = driverRepository.findById(id).orElseThrow();
        driver.setAvailable(available);
        return driverRepository.save(driver);
    }
}
