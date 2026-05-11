package com.swiftride.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "driver_id")
    private Driver driver;

    private String make;
    private String model;
    private String plateNumber;
    private String color;

    public Vehicle() {
    }

    public Vehicle(Driver driver, String make, String model, String plateNumber, String color) {
        this.driver = driver;
        this.make = make;
        this.model = model;
        this.plateNumber = plateNumber;
        this.color = color;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Driver getDriver() { return driver; }
    public void setDriver(Driver driver) { this.driver = driver; }
    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public String getPlateNumber() { return plateNumber; }
    public void setPlateNumber(String plateNumber) { this.plateNumber = plateNumber; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
