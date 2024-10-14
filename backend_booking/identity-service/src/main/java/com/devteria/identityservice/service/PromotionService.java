package com.devteria.identityservice.service;

import com.devteria.identityservice.entity.Promotions;
import com.devteria.identityservice.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    public List<Promotions> getAllPromotions() {
        return promotionRepository.findAll();
    }

    public Optional<Promotions> getPromotionById(Long id) {
        return promotionRepository.findById(id);
    }

    public Promotions createPromotion(Promotions promotion) {
        // Tính toán trạng thái khi tạo
        promotion.calculateIsActive();
        return promotionRepository.save(promotion);
    }

    public Promotions updatePromotion(Long id, Promotions promotionDetails) {
        // Tìm mã khuyến mãi theo ID
        Promotions promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id " + id));

        // Cập nhật thông tin khuyến mãi
        promotion.setName(promotionDetails.getName());
        promotion.setDescription(promotionDetails.getDescription());
        promotion.setDiscount(promotionDetails.getDiscount());
        promotion.setStartDate(promotionDetails.getStartDate());
        promotion.setEndDate(promotionDetails.getEndDate());

        // Tính toán trạng thái isActive mới
        promotion.calculateIsActive();

        // Lưu khuyến mãi đã cập nhật
        return promotionRepository.save(promotion);
    }

    public void deletePromotion(Long id) {
        if (!promotionRepository.existsById(id)) {
            throw new RuntimeException("Promotion not found with id " + id);
        }
        promotionRepository.deleteById(id);
    }

    // Phương thức để cập nhật trạng thái isActive (nếu cần)
    public Promotions updatePromotionStatus(Long id, Boolean isActive) {
        Promotions promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id " + id));

        // Cập nhật trạng thái isActive
        promotion.setIsActive(isActive);
        return promotionRepository.save(promotion);
    }
}
