import axiosClient from "./axiosClient";

/**
 * GET /api/ServicePricing/categories-with-pricing
 */
export const getCategoriesWithPricing = () =>
  axiosClient.get("/ServicePricing/categories-with-pricing");

/**
 * GET /api/ServicePricing/category/{categoryId}
 * @param {string} categoryId
 */
export const getCategoryPricing = (categoryId) =>
  axiosClient.get(`/ServicePricing/category/${categoryId}`);

/**
 * GET /api/ServicePricing/active
 */
export const getActivePricing = () => axiosClient.get("/ServicePricing/active");

/**
 * GET /api/ServicePricing/{id}
 * @param {string} id
 */
export const getPricing = (id) => axiosClient.get(`/ServicePricing/${id}`);

/**
 * PUT /api/ServicePricing/{id}
 * @param {string} id
 * @param {Object} data - { pricePerShift, description, isActive }
 */
export const updatePricing = (id, data) => axiosClient.put(`/ServicePricing/${id}`, data);

/**
 * DELETE /api/ServicePricing/{id}
 * @param {string} id
 */
export const deletePricing = (id) => axiosClient.delete(`/ServicePricing/${id}`);

/**
 * POST /api/ServicePricing
 * @param {Object} data - { categoryId, shiftType, pricePerShift, description, isActive }
 */
export const createPricing = (data) => axiosClient.post("/ServicePricing", data);

/**
 * POST /api/ServicePricing/bulk
 * @param {Object} data - { categoryId, pricings: [{ shiftType, pricePerShift, description }] }
 */
export const createBulkPricing = (data) => axiosClient.post("/ServicePricing/bulk", data);
