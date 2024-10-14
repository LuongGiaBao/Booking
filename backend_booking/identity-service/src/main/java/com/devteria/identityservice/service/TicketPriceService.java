package com.devteria.identityservice.service;

import com.devteria.identityservice.entity.Promotions;
import com.devteria.identityservice.entity.TicketPrice;
import com.devteria.identityservice.entity.Trip;
import com.devteria.identityservice.repository.PromotionRepository;
import com.devteria.identityservice.repository.TicketPriceRepository;
import com.devteria.identityservice.repository.TripRepository;
import jakarta.transaction.Transactional;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TicketPriceService {

    @Autowired
    private TicketPriceRepository ticketPriceRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private PromotionRepository promotionRepository;
    public List<TicketPrice> getAllTicketPrices() {
        return ticketPriceRepository.findAll();
    }
    public Optional<TicketPrice> getTicketPriceById(Long id) {
        return ticketPriceRepository.findById(id);
    }

    public TicketPrice createTicketPrice(TicketPrice ticketPrice) {
        // Kiểm tra Trip
        Trip trip = tripRepository.findById(ticketPrice.getTrip().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + ticketPrice.getTrip().getId()));

        // Kiểm tra Promotion nếu có
        if (ticketPrice.getPromotion() != null) {
            Promotions promotion = promotionRepository.findById(ticketPrice.getPromotion().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Promotion not found with id " + ticketPrice.getPromotion().getId()));
            ticketPrice.setPromotion(promotion);
        }

        ticketPrice.setTrip(trip);

        return ticketPriceRepository.save(ticketPrice);
    }

    @Transactional
    public TicketPrice updateTicketPrice(Long id, TicketPrice ticketPriceDetails) {
        TicketPrice ticketPrice = ticketPriceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TicketPrice not found with id " + id));

        // Kiểm tra Trip
        Trip trip = tripRepository.findById(ticketPriceDetails.getTrip().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + ticketPriceDetails.getTrip().getId()));

        // Kiểm tra Promotion nếu có
        if (ticketPriceDetails.getPromotion() != null) {
            Promotions promotion = promotionRepository.findById(ticketPriceDetails.getPromotion().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Promotion not found with id " + ticketPriceDetails.getPromotion().getId()));
            ticketPrice.setPromotion(promotion);
        } else {
            ticketPrice.setPromotion(null);
        }

        ticketPrice.setPrice(ticketPriceDetails.getPrice());
        ticketPrice.setStartDate(ticketPriceDetails.getStartDate());
        ticketPrice.setEndDate(ticketPriceDetails.getEndDate());
        ticketPrice.setIsActive(ticketPriceDetails.getIsActive());
        ticketPrice.setTrip(trip);

        return ticketPriceRepository.save(ticketPrice);
    }

    public void deleteTicketPrice(Long id) {
        TicketPrice ticketPrice = ticketPriceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TicketPrice not found with id " + id));
        ticketPriceRepository.delete(ticketPrice);
    }
}
