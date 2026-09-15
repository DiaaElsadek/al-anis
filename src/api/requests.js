import axiosClient from "./axiosClient";

/**
 * POST /api/Requests
 * @param {Object} data - { providerId, categoryId, shiftType, preferredDate, address, governorate, description }
 */
export const createRequest = (data) =>
  axiosClient.post("/Requests", data);

/**
 * GET /api/Requests/user — current client's requests
 */
export const getUserRequests = () =>
  axiosClient.get("/Requests/user");

/**
 * GET /api/Requests/provider/{providerId} — incoming requests for a provider
 * @param {string} providerId
 */
export const getProviderRequests = (providerId) =>
  axiosClient.get(`/Requests/provider/${providerId}`);

/**
 * PUT /api/Requests/{requestId}/response — accept or reject request
 * @param {string} requestId
 * @param {Object} payload - { status: 1 for Accepted or 4 for Rejected, reason: string }
 */
export const respondToRequest = (requestId, { status, reason = "" }) =>
  axiosClient.put(`/Requests/${requestId}/response`, { status, reason });

/**
 * POST /api/Requests/{requestId}/start — mark shift as started
 * @param {string} requestId
 */
export const startRequest = (requestId) =>
  axiosClient.post(`/Requests/${requestId}/start`);

/**
 * POST /api/Requests/{requestId}/complete — mark shift as completed
 * @param {string} requestId
 */
export const completeRequest = (requestId) =>
  axiosClient.post(`/Requests/${requestId}/complete`);
