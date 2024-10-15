package com.devteria.identityservice.controller;

import com.devteria.identityservice.dto.request.PromotionCreationRequest;
import com.devteria.identityservice.entity.Promotions;
import com.devteria.identityservice.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "http://localhost:3001") // Điều chỉnh URL nếu frontend triển khai ở nơi khác
public class PromotionController {
    @Autowired
    private PromotionService promotionService;

    @GetMapping
    public List<Promotions> getAllPromotions() {
        return promotionService.getAllPromotions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Promotions> getPromotionById(@PathVariable Long id) {
        return promotionService.getPromotionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Promotions> createPromotion(@RequestBody PromotionCreationRequest request) {
        Promotions promotion = new Promotions();
        promotion.setName(request.getName());
        promotion.setDescription(request.getDescription());
        promotion.setDiscount(request.getDiscount());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setIsActive(request.getIsActive());

        Promotions createdPromotion = promotionService.createPromotion(promotion);
        return ResponseEntity.ok(createdPromotion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Promotions> updatePromotion(@PathVariable Long id, @RequestBody PromotionCreationRequest request) {
        try {
            Promotions promotion = new Promotions();
            promotion.setName(request.getName());
            promotion.setDescription(request.getDescription());
            promotion.setDiscount(request.getDiscount());
            promotion.setStartDate(request.getStartDate());
            promotion.setEndDate(request.getEndDate());
            promotion.setIsActive(request.getIsActive());

            Promotions updatedPromotion = promotionService.updatePromotion(id, promotion);
            return ResponseEntity.ok(updatedPromotion);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        try {
            promotionService.deletePromotion(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint để cập nhật trạng thái isActive
    @PatchMapping("/{id}/status")
    public ResponseEntity<Promotions> updatePromotionStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        try {
            Promotions updatedPromotion = promotionService.updatePromotionStatus(id, request.getIsActive());
            return ResponseEntity.ok(updatedPromotion);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DTO cho yêu cầu cập nhật trạng thái
    public static class StatusUpdateRequest {
        private Boolean isActive;

        public Boolean getIsActive() {
            return isActive;
        }

        public void setIsActive(Boolean isActive) {
            this.isActive = isActive;
        }
    }
}