import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  Select,
  Switch,
  message,
  Input,
} from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import {
  getAllTicketPrices,
  deleteTicketPrices,
  updateTicketPrice,
  createTicketPrices,
  getAllTrips,
  getAllPromotions,
} from "../services/ticket_prices"; // Điều chỉnh đường dẫn nếu cần
import moment from "moment";

const { Option } = Select;

const TicketPrices = () => {
  const [ticketPrices, setTicketPrices] = useState([]);
  const [trips, setTrips] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Trạng thái quản lý modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // 'add' hoặc 'edit'
  const [currentTicketPrice, setCurrentTicketPrice] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [form] = Form.useForm();

  // Fetching dữ liệu
  const fetchData = async () => {
    try {
      const [ticketPricesData, tripsData, promotionsData] = await Promise.all([
        getAllTicketPrices(),
        getAllTrips(),
        getAllPromotions(),
      ]);
      setTicketPrices(ticketPricesData);
      setTrips(tripsData);
      setPromotions(promotionsData);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Delete
  const handleDeleteTicketPrice = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giá vé này không?")) {
      try {
        await deleteTicketPrices(id);
        setTicketPrices((prev) => prev.filter((ticket) => ticket.id !== id));
        message.success("Xóa giá vé thành công!");
      } catch (err) {
        setError("Không thể xóa giá vé.");
        console.error(err);
        message.error("Xóa giá vé thất bại!");
      }
    }
  };

  // Handle Open Modal
  const openModal = (type, ticketPrice = null) => {
    setModalType(type);
    setCurrentTicketPrice(ticketPrice);
    if (type === "edit" && ticketPrice) {
      form.setFieldsValue({
        price: ticketPrice.price,
        startDate: moment(ticketPrice.startDate).format("YYYY-MM-DDTHH:mm"),
        endDate: moment(ticketPrice.endDate).format("YYYY-MM-DDTHH:mm"),
        isActive: ticketPrice.isActive,
        tripId: ticketPrice.trip.id,
        promotionId: ticketPrice.promotion ? ticketPrice.promotion.id : "",
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Handle Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalError(null);
    form.resetFields();
  };

  // Handle Submit Form
  const handleSubmit = async (values) => {
    setModalLoading(true);
    setModalError(null);

    // Validate Dates
    const currentDate = moment();
    const startDate = moment(values.startDate);
    const endDate = moment(values.endDate);

    if (!startDate.isValid() || !endDate.isValid()) {
      setModalError("Định dạng ngày không hợp lệ.");
      setModalLoading(false);
      return;
    }

    if (startDate.isBefore(currentDate)) {
      setModalError("Ngày bắt đầu không được trước thời gian hiện tại.");
      setModalLoading(false);
      return;
    }

    if (startDate.isAfter(endDate)) {
      setModalError("Ngày bắt đầu phải trước ngày kết thúc.");
      setModalLoading(false);
      return;
    }

    try {
      if (modalType === "add") {
        const newTicketPrice = {
          price: values.price,
          startDate: values.startDate,
          endDate: values.endDate,
          isActive: values.isActive,
          tripId: values.tripId,
          promotionId: values.promotionId || null,
        };
        const addedTicketPrice = await createTicketPrices(newTicketPrice);
        setTicketPrices([...ticketPrices, addedTicketPrice]);
        message.success("Thêm giá vé thành công!");
      } else if (modalType === "edit") {
        const updatedTicketPrice = {
          price: values.price,
          startDate: values.startDate,
          endDate: values.endDate,
          isActive: values.isActive,
          tripId: values.tripId,
          promotionId: values.promotionId || null,
        };
        const result = await updateTicketPrice(
          currentTicketPrice.id,
          updatedTicketPrice
        );
        setTicketPrices(
          ticketPrices.map((ticket) =>
            ticket.id === result.id ? result : ticket
          )
        );
        message.success("Cập nhật giá vé thành công!");
      }
      closeModal();
    } catch (err) {
      setModalError(
        `Không thể ${modalType === "add" ? "thêm" : "cập nhật"} giá vé.`
      );
      console.error(err);
      message.error(
        `Không thể ${modalType === "add" ? "thêm" : "cập nhật"} giá vé!`
      );
    } finally {
      setModalLoading(false);
    }
  };

  // Handle Read Modal
  const openReadModal = (ticketPrice) => {
    Modal.info({
      title: "Thông Tin Giá Vé",
      content: (
        <div>
          <p>ID: {ticketPrice.id}</p>
          <p>Giá: {ticketPrice.price.toLocaleString()} VNĐ</p>
          <p>
            Ngày Bắt Đầu:{" "}
            {moment(ticketPrice.startDate).format("DD/MM/YYYY HH:mm")}
          </p>
          <p>
            Ngày Kết Thúc:{" "}
            {moment(ticketPrice.endDate).format("DD/MM/YYYY HH:mm")}
          </p>
          <p>
            Trạng Thái: {ticketPrice.isActive ? "Hoạt động" : "Không hoạt động"}
          </p>
          <p>
            Chuyến: {ticketPrice.trip.departureLocation} -{" "}
            {ticketPrice.trip.arrivalLocation}
          </p>
          <p>
            Khuyến Mãi:{" "}
            {ticketPrice.promotion ? ticketPrice.promotion.name : "Không có"}
          </p>
        </div>
      ),
      onOk() {},
    });
  };

  // Table Columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      key: "price",
      render: (text) => `${new Intl.NumberFormat("en-US").format(text || 0)} đ`,
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Chuyến",
      dataIndex: "trip",
      key: "trip",
      render: (ticket) => `${ticket.trip.id}`,
    },
    {
      title: "Khuyến Mãi",
      dataIndex: "promotion",
      key: "promotion",
      render: (promotion) => (promotion ? promotion.name : "Không có"),
    },
    {
      title: "Trạng Thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (isActive ? "Hoạt động" : "Không hoạt động"),
    },
    {
      title: "Hành Động",
      key: "action",
      render: (text, record) => (
        <div>
          <Button
            icon={<EyeOutlined />}
            onClick={() => openReadModal(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => openModal("edit", record)}
            style={{ marginRight: 8 }}
            type="primary"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTicketPrice(record.id)}
            danger
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 min-h-[620px]">
      <Button type="primary" onClick={() => openModal("add")}>
        Thêm Giá Vé
      </Button>
      <Table
        columns={columns}
        dataSource={ticketPrices}
        rowKey="id"
        loading={loading}
        className="mt-4"
      />

      {/* Add/Edit TicketPrice Modal */}
      <Modal
        title={modalType === "add" ? "Thêm Giá Vé" : "Chỉnh Sửa Giá Vé"}
        visible={isModalOpen}
        onCancel={closeModal}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="price"
            label="Giá (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập giá vé!" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Ngày Bắt Đầu"
            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
          >
            <Input type="datetime-local" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="Ngày Kết Thúc"
            rules={[
              { required: true, message: "Vui lòng chọn ngày kết thúc!" },
            ]}
          >
            <Input type="datetime-local" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="isActive" label="Trạng Thái" valuePropName="checked">
            <Switch
              checkedChildren="Hoạt động"
              unCheckedChildren="Không hoạt động"
            />
          </Form.Item>
          <Form.Item
            name="tripId"
            label="Chuyến"
            rules={[{ required: true, message: "Vui lòng chọn chuyến xe!" }]}
          >
            <Select placeholder="Chọn Chuyến">
              {trips.map((trip) => (
                <Option key={trip.id} value={trip.id}>
                  {trip.departureLocation} - {trip.arrivalLocation}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="promotionId" label="Khuyến Mãi">
            <Select placeholder="Chọn Khuyến Mãi" allowClear>
              {promotions.map((promo) => (
                <Option key={promo.id} value={promo.id}>
                  {promo.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            {modalError && <p style={{ color: "red" }}>{modalError}</p>}
            <Button
              type="primary"
              htmlType="submit"
              loading={modalLoading}
              block
            >
              {modalType === "add" ? "Thêm" : "Cập Nhật"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TicketPrices;
