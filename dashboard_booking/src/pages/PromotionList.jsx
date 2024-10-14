// src/components/PromotionList.jsx
import React, { useState, useEffect } from "react";
import {
  getAllPromotions,
  deletePromotion,
  updatePromotionStatus,
  createPromotion,
  updatePromotion,
} from "../services/promotion";
import { format } from "date-fns";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa"; // Importing icons
import ReactTooltip from "react-tooltip";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Button } from "antd";
const PromotionList = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State to manage modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [newPromotion, setNewPromotion] = useState({
    name: "",
    description: "",
    discount: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });
  const [modalError, setModalError] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllPromotions();
        setPromotions(data);
      } catch (err) {
        setError("Unable to load promotions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const handleDeletePromotion = async (id) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      try {
        await deletePromotion(id);
        setPromotions(promotions.filter((promotion) => promotion.id !== id));
      } catch (err) {
        setError("Unable to delete promotion.");
        console.error(err);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const updatedPromotion = await updatePromotionStatus(id, !currentStatus);
      setPromotions(
        promotions.map((promotion) =>
          promotion.id === id
            ? { ...promotion, isActive: updatedPromotion.isActive }
            : promotion
        )
      );
    } catch (err) {
      setError("Unable to update promotion status.");
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy HH:mm");
  };

  // Function to open add promotion modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Function to close add promotion modal
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewPromotion({
      name: "",
      description: "",
      discount: "",
      startDate: "",
      endDate: "",
      isActive: true,
    });
    setModalError(null);
  };

  // Function to open edit promotion modal
  const openEditModal = (promotion) => {
    setCurrentPromotion(promotion);
    setNewPromotion({
      name: promotion.name,
      description: promotion.description,
      discount: promotion.discount,
      startDate: promotion.startDate.substring(0, 16), // Format for datetime-local
      endDate: promotion.endDate.substring(0, 16),
      isActive: promotion.isActive,
    });
    setIsEditModalOpen(true);
  };

  // Function to close edit promotion modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentPromotion(null);
    setNewPromotion({
      name: "",
      description: "",
      discount: "",
      startDate: "",
      endDate: "",
      isActive: true,
    });
    setModalError(null);
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPromotion((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle submit for adding a promotion
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);

    // Validate dates
    const currentDate = new Date();

    // Check if start date is in the past
    if (new Date(newPromotion.startDate) < currentDate) {
      setModalError("Start date cannot be before the current time.");
      setModalLoading(false);
      return;
    }

    // Check if start date is before end date
    if (new Date(newPromotion.startDate) > new Date(newPromotion.endDate)) {
      setModalError("Start date must be before end date.");
      setModalLoading(false);
      return;
    }

    try {
      const createdPromotion = await createPromotion(newPromotion);
      setPromotions([...promotions, createdPromotion]);
      closeAddModal();
    } catch (err) {
      setModalError("Unable to create promotion.");
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  // Handle submit for editing a promotion
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);

    // Lấy ngày hiện tại
    const currentDate = new Date();

    // Kiểm tra thời gian bắt đầu
    const startDate = new Date(newPromotion.startDate);

    // Nếu thời gian bắt đầu nhỏ hơn thời gian hiện tại thì không cho phép edit
    if (startDate < currentDate) {
      setModalError("Ngày-giờ bắt đầu không thể trước thời gian hiện tại.");
      setModalLoading(false);
      return;
    }

    // Kiểm tra nếu thời gian bắt đầu lớn hơn thời gian kết thúc
    if (startDate > new Date(newPromotion.endDate)) {
      setModalError("Ngày bắt đầu phải trước ngày kết thúc.");
      setModalLoading(false);
      return;
    }

    try {
      const updatedPromotion = await updatePromotion(
        currentPromotion.id,
        newPromotion
      );
      setPromotions(
        promotions.map((promotion) =>
          promotion.id === currentPromotion.id ? updatedPromotion : promotion
        )
      );
      closeEditModal();
    } catch (err) {
      setModalError("Không thể cập nhật khuyến mãi.");
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Promotion List</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Promotion
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading promotions...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : promotions.length === 0 ? (
        <p className="text-center text-gray-500">No promotions available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Discount (VND)</th>
                <th className="py-2 px-4 border-b">Start Date</th>
                <th className="py-2 px-4 border-b">End Date</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promotion) => (
                <tr key={promotion.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b text-center">
                    {promotion.id}
                  </td>
                  <td className="py-2 px-4 border-b">{promotion.name}</td>
                  <td className="py-2 px-4 border-b">
                    {promotion.description}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {promotion.discount}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {formatDate(promotion.startDate)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {formatDate(promotion.endDate)}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <span
                      className={`px-2 py-1 rounded ${
                        promotion.isActive
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {promotion.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b flex space-x-2 justify-center">
                    {/* Edit Button */}
                    <Button
                      onClick={() => openEditModal(promotion)}
                      className="text-yellow-500 border-yellow-500 hover:bg-yellow-600 hover:border-yellow-600"
                      data-tip="Edit"
                      aria-label="Edit"
                    >
                      {<EditOutlined />}
                    </Button>

                    {/* Delete Button */}
                    <Button
                      onClick={() => handleDeletePromotion(promotion.id)}
                      className="text-red-500 hover:text-red-600"
                      data-tip="Delete"
                      aria-label="Delete"
                    >
                      <FaTrash size={20} />
                    </Button>

                    {/* Toggle Status Button */}
                    <Button
                      onClick={() =>
                        handleToggleStatus(promotion.id, promotion.isActive)
                      }
                      className={`rounded text-white ${
                        promotion.isActive
                          ? "text-red-500 hover:text-red-600"
                          : "text-green-500 hover:text-green-600"
                      }`}
                      disabled={
                        new Date() < new Date(promotion.startDate) ||
                        new Date() > new Date(promotion.endDate) // Disable if current date is after the end date
                      } // Disable if current date is before the start date
                      data-tip={
                        promotion.isActive
                          ? "Deactivate Promotion"
                          : "Activate Promotion"
                      }
                      aria-label={
                        promotion.isActive
                          ? "Deactivate Promotion"
                          : "Activate Promotion"
                      }
                    >
                      {promotion.isActive ? (
                        <FaToggleOn size={20} />
                      ) : (
                        <FaToggleOff size={20} />
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <ReactTooltip place="top" type="dark" effect="solid" /> */}
        </div>
      )}

      {/* Add Promotion Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg w-11/12 md:w-1/2 lg:w-1/3 p-6 relative">
            <button
              onClick={closeAddModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              &#10005;
            </button>
            <h2 className="text-2xl font-bold mb-4">Add Promotion</h2>
            {modalError && <p className="text-red-500 mb-2">{modalError}</p>}
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Promotion Name</label>
                <input
                  type="text"
                  name="name"
                  value={newPromotion.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={newPromotion.description}
                  onChange={handleInputChange}
                  required
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Discount (VND)</label>
                <input
                  type="number"
                  name="discount"
                  value={newPromotion.discount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Start Date</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={newPromotion.startDate}
                  onChange={handleInputChange}
                  required
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">End Date</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={newPromotion.endDate}
                  onChange={handleInputChange}
                  required
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={newPromotion.isActive}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-gray-700">Activate</label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  disabled={modalLoading}
                >
                  {modalLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Promotion Modal */}
      {isEditModalOpen && currentPromotion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg w-11/12 md:w-1/2 lg:w-1/3 p-6 relative">
            <button
              onClick={closeEditModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              &#10005;
            </button>
            <h2 className="text-2xl font-bold mb-4">Edit Promotion</h2>
            {modalError && <p className="text-red-500 mb-2">{modalError}</p>}
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Promotion Name</label>
                <input
                  type="text"
                  name="name"
                  value={newPromotion.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={newPromotion.description}
                  onChange={handleInputChange}
                  required
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Discount (VND)</label>
                <input
                  type="number"
                  name="discount"
                  value={newPromotion.discount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Start Date</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={newPromotion.startDate}
                  onChange={handleInputChange}
                  required
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">End Date</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={newPromotion.endDate}
                  onChange={handleInputChange}
                  required
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={newPromotion.isActive}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-gray-700">Activate</label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  disabled={modalLoading}
                >
                  {modalLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionList;
