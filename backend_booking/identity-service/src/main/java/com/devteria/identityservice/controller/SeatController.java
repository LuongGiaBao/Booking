package com.devteria.identityservice.controller;


import com.devteria.identityservice.dto.request.ApiResponse;
import com.devteria.identityservice.dto.request.SeatCreationMoreRequest;
import com.devteria.identityservice.dto.request.SeatCreationRequest;
import com.devteria.identityservice.dto.request.SeatUpdateRequest;
import com.devteria.identityservice.dto.response.SeatResponse;
import com.devteria.identityservice.entity.Seat;
import com.devteria.identityservice.service.SeatService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class SeatController {
    SeatService seatService;

    @PostMapping()
    public Seat createSeat(@RequestBody SeatCreationRequest request){
        return seatService.createSeat(request);
    }

    @PostMapping("/batch")
    public List<Seat> createSeats(@RequestBody SeatCreationMoreRequest request) {
        return seatService.createSeats(request);
    }

    @GetMapping()
    public List<SeatResponse> getSeats(){
        return seatService.getSeats();
    }

    @GetMapping("/{id}")
    public SeatResponse getSeatById(@PathVariable Integer id) {
        return seatService.getSeatById(id);
    }

    @DeleteMapping("/{seatId}")
    public ApiResponse<String> deleteSeat(@PathVariable Integer seatId) {
        seatService.deleteSeat(seatId);
        return ApiResponse.<String>builder().result("Seat has been deleted").build();
    }

    @PutMapping("/{seatId}")
    public ApiResponse<SeatResponse> updateSeat(@PathVariable Integer seatId, @RequestBody SeatUpdateRequest request) {
        return ApiResponse.<SeatResponse>builder()
                .result(seatService.updateSeat(seatId, request))
                .build();
    }
}
