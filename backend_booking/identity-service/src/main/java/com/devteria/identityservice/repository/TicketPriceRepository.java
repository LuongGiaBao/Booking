package com.devteria.identityservice.repository;

import com.devteria.identityservice.entity.TicketPrice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketPriceRepository extends JpaRepository<TicketPrice, Long> {
    List<TicketPrice> findByTripId(Long tripId);
}
