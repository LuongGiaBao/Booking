package com.devteria.identityservice.dto.request;


import com.devteria.identityservice.entity.Promotions;
import com.devteria.identityservice.entity.Trip;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TicketPricesCreationRequest {
    private Long id;
    private Double price;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isActive;
    private TripCreationRequest trip;
    private PromotionCreationRequest promotion;
}
