package com.swiftride.service;

import com.swiftride.dto.LoginRequest;
import com.swiftride.dto.SignupRequest;
import com.swiftride.model.Driver;
import com.swiftride.model.Role;
import com.swiftride.model.User;
import com.swiftride.repository.DriverRepository;
import com.swiftride.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;

    public AuthService(UserRepository userRepository, DriverRepository driverRepository) {
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
    }

    public User login(LoginRequest request) {
        return userRepository.findByEmail(request.getEmail())
                .filter(user -> user.isActive() && user.getPassword().equals(request.getPassword()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
    }

    @Transactional
    public User signup(SignupRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (request.getRole() == null) {
            throw new IllegalArgumentException("Role is required");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = userRepository.save(new User(
                request.getName().trim(),
                request.getEmail().trim().toLowerCase(),
                request.getPassword(),
                request.getRole(),
                request.getPhone()
        ));

        if (request.getRole() == Role.DRIVER) {
            String licenseNumber = "LHR-DRV-" + String.format("%04d", user.getId());
            driverRepository.save(new Driver(user, licenseNumber, 31.5204, 74.3587));
        }

        return user;
    }
}
