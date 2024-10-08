import { handleApiRequest, instance } from "./instance";
import dayjs from "dayjs"; // Đảm bảo bạn có dayjs để định dạng ngày

const URL_TRIP_FILTER = "/api/trips/filter";

// Cập nhật để sử dụng departureTime thay vì creationDate
const tripFilterRequest = (from, to, departureTime) => {
  // Chuyển đổi departureTime thành định dạng YYYY-MM-DD nếu cần
  const formattedDate = dayjs(departureTime).format("YYYY-MM-DD");
  return {
    departureLocation: from,
    arrivalLocation: to,
    departureDate: formattedDate, // Chỉ gửi ngày (YYYY-MM-DD)
  };
};

export async function filterTrips(from, to, departureTime) {
  return handleApiRequest(async () => {
    const response = await instance.post(
      URL_TRIP_FILTER,
      tripFilterRequest(from, to, departureTime)
    );
  
    return response.data;
  });
}
