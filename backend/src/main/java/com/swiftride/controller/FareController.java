package com.swiftride.controller;

import com.swiftride.model.FareRate;
import com.swiftride.repository.FareRateRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fares")
public class FareController {
    private final FareRateRepository fareRateRepository;

    public FareController(FareRateRepository fareRateRepository) {
        this.fareRateRepository = fareRateRepository;
    }

    @GetMapping
    public List<FareRate> all() {
        return fareRateRepository.findAll();
    }

    @PostMapping
    public FareRate save(@RequestBody FareRate fareRate) {
        return fareRateRepository.save(fareRate);
    }

    @PutMapping("/{id}")
    public FareRate update(@PathVariable Long id, @RequestBody FareRate input) {
        FareRate rate = fareRateRepository.findById(id).orElseThrow();
        rate.setVehicleType(input.getVehicleType());
        rate.setBaseFare(input.getBaseFare());
        rate.setPerKmRate(input.getPerKmRate());
        rate.setPerMinuteRate(input.getPerMinuteRate());
        rate.setActive(input.isActive());
        return fareRateRepository.save(rate);
    }
}
