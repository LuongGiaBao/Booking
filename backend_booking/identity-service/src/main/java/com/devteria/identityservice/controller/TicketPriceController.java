package com.devteria.identityservice.controller;

import com.devteria.identityservice.dto.request.TicketPricesCreationRequest;
import com.devteria.identityservice.dto.request.TripCreationRequest;
import com.devteria.identityservice.entity.TicketPrice;
import com.devteria.identityservice.entity.Trip;
import com.devteria.identityservice.service.TicketPriceService;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ticket-prices")
@CrossOrigin(origins = "http://localhost:3000") // Điều chỉnh theo địa chỉ frontend
public class TicketPriceController {

    @Autowired
    private TicketPriceService ticketPriceService;

    @GetMapping
    public List<TicketPrice> getAllTicketPrices() {
        return ticketPriceService.getAllTicketPrices();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketPrice> getTicketPriceById(@PathVariable Long id) {
        TicketPrice ticketPrice = ticketPriceService.getTicketPriceById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TicketPrice not found with id " + id));
        return ResponseEntity.ok(ticketPrice);
    }

    @PostMapping
    public TicketPrice createTicketPrice(@RequestBody TicketPrice ticketPrice) {
        return ticketPriceService.createTicketPrice(ticketPrice);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TicketPrice> updateTicketPrice(@PathVariable Long id, @RequestBody TicketPrice ticketPriceDetails) {
        TicketPrice updatedTicketPrice = ticketPriceService.updateTicketPrice(id, ticketPriceDetails);
        return ResponseEntity.ok(updatedTicketPrice);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicketPrice(@PathVariable Long id) {
        ticketPriceService.deleteTicketPrice(id);
        return ResponseEntity.noContent().build();
    }

    // Hàm chuyển đổi từ TicketPrice sang TicketPriceDTO
    private TicketPricesCreationRequest convertToDTO(TicketPrice ticketPrice) {
        Trip trip = ticketPrice.getTrip();
        TripCreationRequest tripDTO = new TripCreationRequest(trip.getId(), trip.getDepartureLocation(), trip.getArrivalLocation());

        Promotion promotion = ticketPrice.getPromotion();
        PromotionDTO promotionDTO = null;
        if (promotion != null) {
            promotionDTO = new PromotionDTO(promotion.getId(), promotion.getName(), promotion.getStartDate(), promotion.getEndDate());
        }

        return new TicketPriceDTO(
                ticketPrice.getId(),
                ticketPrice.getPrice(),
                ticketPrice.getStartDate(),
                ticketPrice.getEndDate(),
                ticketPrice.getIsActive(),
                tripDTO,
                promotionDTO
        );
    }
}
