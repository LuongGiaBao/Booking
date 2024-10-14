package com.devteria.identityservice.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PromotionCreationRequest {
   // Long id;
    String name;
    String description;
    Double discount;
    LocalDateTime startDate;
    LocalDateTime endDate;
    Boolean isActive;

}
