package com.devteria.identityservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "promotions")
@Getter
@Setter
public class Promotions {
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    private String name;

    @Getter
    private String description;

    @Getter
    private Double discount;

    @Getter
    private LocalDateTime startDate;

    @Getter
    private LocalDateTime endDate;

    private Boolean isActive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;



    public void calculateIsActive() {
        LocalDateTime now = LocalDateTime.now();
        this.isActive = (now.isAfter(startDate) && now.isBefore(endDate));
    }
}