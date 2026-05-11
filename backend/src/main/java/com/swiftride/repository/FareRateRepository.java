package com.swiftride.repository;

import com.swiftride.model.FareRate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FareRateRepository extends JpaRepository<FareRate, Long> {
    Optional<FareRate> findFirstByActiveTrueOrderByIdAsc();
}
