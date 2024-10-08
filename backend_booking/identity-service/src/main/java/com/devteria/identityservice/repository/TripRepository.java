package com.devteria.identityservice.repository;

import com.devteria.identityservice.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TripRepository extends JpaRepository<Trip,Integer> {
    boolean existsById(Integer tripId);

    Optional<Trip> findById(Integer tripId);
    List<Trip> findByDepartureTimeBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);

}
