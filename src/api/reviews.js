import axiosClient from "./axiosClient";

/**
 * POST /api/Reviews
 * @param {Object} data - { serviceRequestId, rating, comment }
 */
export const createReview = ({ serviceRequestId, rating, comment }) =>
  axiosClient.post("/Reviews", { serviceRequestId, rating, comment });

/**
 * GET /api/Reviews/provider/{providerId}
 * @param {string} providerId
 */
export const getProviderReviews = (providerId) =>
  axiosClient.get(`/Reviews/provider/${providerId}`);

/**
 * GET /api/Reviews/user — current user's submitted reviews
 */
export const getUserReviews = () =>
  axiosClient.get("/Reviews/user");

/**
 * GET /api/Reviews/request/{requestId} — review for a specific request
 * @param {string} requestId
 */
export const getRequestReview = (requestId) =>
  axiosClient.get(`/Reviews/request/${requestId}`);
