package com.devteria.identityservice.repository;

import com.devteria.identityservice.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface SeatRepository extends JpaRepository<Seat,Integer> {
    List<Seat> findAllByIdIn(List<Integer> ids);
    List<Seat> findByTripIdAndBusId(int tripId, int busId);
}
