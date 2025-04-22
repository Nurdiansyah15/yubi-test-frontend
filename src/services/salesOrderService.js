import axiosInstance from "../lib/axios";

const getAllSalesOrders = () => axiosInstance.get("/sales-orders");

const getSalesOrderById = (soId) => axiosInstance.get(`/sales-orders/${soId}`);

const createSalesOrder = (data) => axiosInstance.post("/sales-orders", data);

const updateSalesOrder = (soId, data) =>
  axiosInstance.put(`/sales-orders/${soId}`, data);

const deleteSalesOrder = (soId) =>
  axiosInstance.delete(`/sales-orders/${soId}`);

export const salesOrderService = {
  getAllSalesOrders,
  getSalesOrderById,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
};
