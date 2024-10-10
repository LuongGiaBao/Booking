import { useEffect, useState } from "react";
import { List, message } from "antd";
import { getAllTickets } from "../services/ticket"; // Sử dụng hàm lấy vé từ API
import { FaBusAlt, FaMapMarkerAlt } from "react-icons/fa"; // Sử dụng icon để làm đẹp

function MyTicket() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách vé từ API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getAllTickets(); // Gọi API lấy danh sách vé
        setTickets(response); // Cập nhật danh sách vé vào state
      } catch (error) {
        message.error("Không thể tải vé của bạn, vui lòng thử lại sau.");
        console.error(error);
      } finally {
        setLoading(false); // Tắt trạng thái loading sau khi hoàn tất
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-5">Danh sách vé của tôi</h2>
      {loading ? (
        <p>Đang tải vé...</p>
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }} // Hiển thị từng vé thành từng dòng
          dataSource={tickets}
          renderItem={(ticket) => (
            <List.Item>
              <div className="bg-white shadow-md rounded-lg p-6 mb-4">
                {/* Header - Chuyến đi */}
                <div className="flex justify-between items-center border-b pb-3 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-700 flex items-center">
                      <FaBusAlt className="mr-2" /> 
                      {ticket.trip?.departureLocation} → {ticket.trip?.arrivalLocation}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Ngày tạo vé: {new Date(ticket.creationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-red-500">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(ticket.price)}
                    </p>
                    {/* {ticket.discount > 0 && <p className="text-sm">Giảm giá: {ticket.discount}%</p>} */}
                  </div>
                </div>

                {/* Nội dung chính */}
                <div className="flex justify-between">
                  <div className="text-sm">
                    <p className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-blue-500" /> 
                      Điểm đón: {ticket.pickupLocation?.name || ticket.pickupLocation?.id}
                    </p>
                    <p className="flex items-center">
                       {ticket.pickupLocation?.address || ticket.pickupLocation?.id}
                    </p>
                    <p className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-blue-500" /> 
                      Điểm trả: {ticket.dropoffLocation?.name || ticket.dropoffLocation?.id}
                    </p>
                    <p className="flex items-center">
                       {ticket.dropoffLocation?.address || ticket.dropoffLocation?.id}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold">Mã ghế: {ticket.seats?.map(seat => seat.id).join(", ")}</p>
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}

export default MyTicket;
