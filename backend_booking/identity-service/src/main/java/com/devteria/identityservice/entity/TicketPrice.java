package com.devteria.identityservice.entity;

import com.devteria.identityservice.entity.Trip;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_prices")
@Getter
@Setter
public class TicketPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double price;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isActive;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    @JsonIgnore
    private Trip trip;

    @ManyToOne
    @JoinColumn(name = "promotion_id")
    @JsonIgnore
    private Promotions promotion;
}
