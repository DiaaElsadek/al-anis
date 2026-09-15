import axiosClient from "./axiosClient";

/**
 * GET /api/ServiceProvider — list providers with filters
 */
export const getProviders = (params) =>
  axiosClient.get("/ServiceProvider", { params });

/**
 * GET /api/ServiceProvider/:id — single provider detail
 */
export const getProvider = (id) => axiosClient.get(`/ServiceProvider/${id}`);

/**
 * PUT /api/ServiceProvider/profile — update provider's own profile
 */
export const updateProviderProfile = (formData) =>
  axiosClient.put("/ServiceProvider/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/**
 * GET /api/ServiceProvider/dashboard — provider dashboard stats
 */
export const getProviderDashboard = () =>
  axiosClient.get("/ServiceProvider/dashboard");

/**
 * GET /api/ServiceProvider/availability — get availability calendar
 */
export const getAvailability = (params) =>
  axiosClient.get("/ServiceProvider/availability", { params });

/**
 * POST /api/ServiceProvider/availability — set single-day availability
 */
export const setAvailability = (data) =>
  axiosClient.post("/ServiceProvider/availability", data);

/**
 * POST /api/ServiceProvider/availability/bulk — bulk set availability
 */
export const setBulkAvailability = (data) =>
  axiosClient.post("/ServiceProvider/availability/bulk", data);

/**
 * GET /api/ServiceProvider/working-areas
 */
export const getWorkingAreas = () =>
  axiosClient.get("/ServiceProvider/working-areas");

/**
 * POST /api/ServiceProvider/working-areas
 */
export const addWorkingArea = (data) =>
  axiosClient.post("/ServiceProvider/working-areas", data);

/**
 * DELETE /api/ServiceProvider/working-areas/:id
 */
export const removeWorkingArea = (id) =>
  axiosClient.delete(`/ServiceProvider/working-areas/${id}`);

/**
 * GET /api/ServiceProvider/application-status
 */
export const getApplicationStatus = () =>
  axiosClient.get("/ServiceProvider/application-status");
