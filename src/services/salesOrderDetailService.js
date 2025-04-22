import axiosInstance from "../lib/axios";

const getAllDetailsBySalesOrderId = (soId) =>
  axiosInstance.get(`/sales-orders/${soId}/details`);

const getDetailById = (soId, soDtId) =>
  axiosInstance.get(`/sales-orders/${soId}/details/${soDtId}`);

const createDetail = (soId, data) =>
  axiosInstance.post(`/sales-orders/${soId}/details`, data);

const updateDetail = (soId, soDtId, data) =>
  axiosInstance.put(`/sales-orders/${soId}/details/${soDtId}`, data);

const deleteDetail = (soId, soDtId) =>
  axiosInstance.delete(`/sales-orders/${soId}/details/${soDtId}`);

export const salesOrderDetailService = {
  getAllDetailsBySalesOrderId,
  getDetailById,
  createDetail,
  updateDetail,
  deleteDetail,
};
