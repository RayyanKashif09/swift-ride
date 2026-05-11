package com.swiftride.controller;

import com.swiftride.model.Role;
import com.swiftride.model.User;
import com.swiftride.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> all() {
        return userRepository.findAll();
    }

    @GetMapping("/role/{role}")
    public List<User> byRole(@PathVariable Role role) {
        return userRepository.findByRole(role);
    }

    @PostMapping
    public User create(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PutMapping("/{id}/status")
    public User setStatus(@PathVariable Long id, @RequestParam boolean active) {
        User user = userRepository.findById(id).orElseThrow();
        user.setActive(active);
        return userRepository.save(user);
    }
}
