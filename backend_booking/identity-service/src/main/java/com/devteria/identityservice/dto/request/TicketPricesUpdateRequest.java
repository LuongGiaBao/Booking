package com.devteria.identityservice.dto.request;

import com.devteria.identityservice.entity.Promotions;
import com.devteria.identityservice.entity.Trip;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)

public class TicketPricesUpdateRequest {
    Long id;
    Trip trip;
    BigDecimal price;
    Promotions promotion;
}
