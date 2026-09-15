import axiosClient from "./axiosClient";

/**
 * POST /api/ServiceRequest — create a new request
 */
export const createRequest = (data) =>
  axiosClient.post("/ServiceRequest", data);

/**
 * GET /api/ServiceRequest — list requests (client or provider side)
 */
export const getRequests = (params) =>
  axiosClient.get("/ServiceRequest", { params });

/**
 * GET /api/ServiceRequest/:id — single request detail
 */
export const getRequest = (id) => axiosClient.get(`/ServiceRequest/${id}`);

/**
 * PUT /api/ServiceRequest/:id/accept
 */
export const acceptRequest = (id) =>
  axiosClient.put(`/ServiceRequest/${id}/accept`);

/**
 * PUT /api/ServiceRequest/:id/reject
 */
export const rejectRequest = (id, reason) =>
  axiosClient.put(`/ServiceRequest/${id}/reject`, { reason });

/**
 * PUT /api/ServiceRequest/:id/start
 */
export const startRequest = (id) =>
  axiosClient.put(`/ServiceRequest/${id}/start`);

/**
 * PUT /api/ServiceRequest/:id/complete
 */
export const completeRequest = (id) =>
  axiosClient.put(`/ServiceRequest/${id}/complete`);

/**
 * PUT /api/ServiceRequest/:id/cancel
 */
export const cancelRequest = (id) =>
  axiosClient.put(`/ServiceRequest/${id}/cancel`);
