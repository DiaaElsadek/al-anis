import axiosClient from "./axiosClient";

/**
 * POST /api/Payment — create payment (returns checkoutUrl)
 */
export const createPayment = (data) => axiosClient.post("/Payment", data);

/**
 * GET /api/Payment/:id — get payment details / status
 */
export const getPayment = (id) => axiosClient.get(`/Payment/${id}`);

/**
 * GET /api/Payment — list user's payments
 */
export const getPayments = (params) =>
  axiosClient.get("/Payment", { params });

/**
 * GET /api/Payment/:id/status — poll payment status after redirect
 */
export const getPaymentStatus = (id) =>
  axiosClient.get(`/Payment/${id}/status`);
