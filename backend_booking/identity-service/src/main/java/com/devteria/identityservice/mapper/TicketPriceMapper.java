package com.devteria.identityservice.mapper;

import com.devteria.identityservice.dto.request.TicketPricesCreationRequest;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import com.devteria.identityservice.entity.TicketPrice;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
@Mapper(componentModel = "spring")
public interface TicketPriceMapper {
    @Autowired
    TripMapper tripMapper;

    public TicketPricesCreationRequest toTicketPriceDTO(TicketPrice ticketPrice) {
        String promotionName = (ticketPrice.getPromotion() != null) ? ticketPrice.getPromotion().getName() : "Không có";
        return TicketPricesCreationRequest.builder()
                .id(ticketPrice.getId())
                .price(ticketPrice.getPrice())
                .startDate(LocalDateTime.parse(ticketPrice.getStartDate().toString())) // Định dạng lại nếu cần
                .endDate(LocalDateTime.parse(ticketPrice.getEndDate().toString())) // Định dạng lại nếu cần
                .isActive(ticketPrice.getIsActive())
                .trip(tripMapper.toTripResponse(ticketPrice.getTrip()))
                .promotions(promotionName)
                .build();
    }
}
