package com.devteria.identityservice.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BusUpdateRequest {

    String name;
    String image;
    String descBus;
    String type;
    double priceReal;
    String licensePlate;
    int seatCapacity;
    String phoneNumber;
    double rating;
}
