package com.swiftride.model;

import jakarta.persistence.*;

@Entity
@Table(name = "fare_rates")
public class FareRate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleType;
    private double baseFare;
    private double perKmRate;
    private double perMinuteRate;
    private boolean active = true;

    public FareRate() {
    }

    public FareRate(String vehicleType, double baseFare, double perKmRate, double perMinuteRate) {
        this.vehicleType = vehicleType;
        this.baseFare = baseFare;
        this.perKmRate = perKmRate;
        this.perMinuteRate = perMinuteRate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
    public double getBaseFare() { return baseFare; }
    public void setBaseFare(double baseFare) { this.baseFare = baseFare; }
    public double getPerKmRate() { return perKmRate; }
    public void setPerKmRate(double perKmRate) { this.perKmRate = perKmRate; }
    public double getPerMinuteRate() { return perMinuteRate; }
    public void setPerMinuteRate(double perMinuteRate) { this.perMinuteRate = perMinuteRate; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
