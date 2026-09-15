import axiosClient from "./axiosClient";

/**
 * GET /api/ServicePricing — list all pricing
 */
export const getPricing = (params) =>
  axiosClient.get("/ServicePricing", { params });

/**
 * POST /api/ServicePricing — set pricing for a category/shift
 */
export const setPricing = (data) => axiosClient.post("/ServicePricing", data);

/**
 * PUT /api/ServicePricing/:id — update pricing
 */
export const updatePricing = (id, data) =>
  axiosClient.put(`/ServicePricing/${id}`, data);

/**
 * DELETE /api/ServicePricing/:id — delete pricing
 */
export const deletePricing = (id) =>
  axiosClient.delete(`/ServicePricing/${id}`);

/**
 * POST /api/ServicePricing/bulk — bulk set pricing
 */
export const bulkSetPricing = (data) =>
  axiosClient.post("/ServicePricing/bulk", data);
