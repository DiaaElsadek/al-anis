import axiosClient from "./axiosClient";

/**
 * POST /api/Review — create a review
 */
export const createReview = (data) => axiosClient.post("/Review", data);

/**
 * GET /api/Review/provider/:id — get reviews for a provider
 */
export const getProviderReviews = (providerId, params) =>
  axiosClient.get(`/Review/provider/${providerId}`, { params });

/**
 * GET /api/Review/request/:id — get review for a specific request
 */
export const getRequestReview = (requestId) =>
  axiosClient.get(`/Review/request/${requestId}`);
