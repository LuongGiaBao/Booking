package com.devteria.identityservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TripResponse {
    int id;
    String departureLocation;
    String arrivalLocation;
    double distance;
    String travelTime;
    LocalDate creationDate;
    LocalDateTime departureTime;
    List<PickupLocationResponse> pickupLocations;
    List<DropoffLocationResponse> dropoffLocations;
    List<BusResponse> buses;
}
