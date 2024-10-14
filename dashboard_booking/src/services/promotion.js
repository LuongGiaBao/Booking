// src/services/promotion.js
import { handleApiRequest, instance } from "./instance";

// Base URL for promotions
const URL_PROMOTION = "/api/promotions";

export const createPromotion = async (promotionCreationRequest) => {
  return handleApiRequest(async () => {
    const response = await instance.post(
      URL_PROMOTION,
      promotionCreationRequest
    );
    return response.data;
  });
};

// Get all promotions
// export const getAllPromotions = async () => {
//   return handleApiRequest(async () => {
//     const response = await instance.get(URL_PROMOTION);
//     return response.data;
//   });
// };

export const getAllPromotions = async () => {
  return handleApiRequest(async () => {
    const response = await instance.get(URL_PROMOTION);
    // Set isActive based on startDate and endDate
    const currentDate = new Date();
    const promotions = response.data.map((promotion) => ({
      ...promotion,
      isActive:
        new Date(promotion.startDate) <= currentDate &&
        new Date(promotion.endDate) >= currentDate,
    }));
    return promotions;
  });
};

// Get a promotion by ID
export const getPromotionById = async (promotionId) => {
  return handleApiRequest(async () => {
    const response = await instance.get(`${URL_PROMOTION}/${promotionId}`);
    return response.data;
  });
};

// Update a promotion by ID
export const updatePromotion = async (promotionId, promotionUpdateRequest) => {
  return handleApiRequest(async () => {
    const response = await instance.put(
      `${URL_PROMOTION}/${promotionId}`,
      promotionUpdateRequest
    );
    return response.data; // Sửa từ response.data.result thành response.data
  });
};

// Delete a promotion by ID
export const deletePromotion = async (promotionId) => {
  return handleApiRequest(async () => {
    const response = await instance.delete(`${URL_PROMOTION}/${promotionId}`);
    return response.data;
  });
};

// Cập nhật trạng thái isActive của một promotion
export const updatePromotionStatus = async (promotionId, isActive) => {
  return handleApiRequest(async () => {
    const response = await instance.patch(
      `${URL_PROMOTION}/${promotionId}/status`,
      { isActive }
    );
    return response.data;
  });
};
