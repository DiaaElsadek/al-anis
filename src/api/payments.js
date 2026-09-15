import axiosClient from "./axiosClient";

/**
 * POST /api/payments/create-checkout
 * @param {Object} payload - { serviceRequestId }
 */
export const createCheckout = ({ serviceRequestId }) =>
  axiosClient.post("/payments/create-checkout", { serviceRequestId });

/**
 * GET /api/payments/request/{requestId}
 * @param {string} requestId
 */
export const getPaymentByRequest = (requestId) => axiosClient.get(`/payments/request/${requestId}`);
