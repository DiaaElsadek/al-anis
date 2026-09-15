import axiosClient from "./axiosClient";

/**
 * GET /api/Provider/application-status
 */
export const getApplicationStatus = () =>
  axiosClient.get("/Provider/application-status");

/**
 * GET /api/Provider/dashboard
 */
export const getProviderDashboard = () =>
  axiosClient.get("/Provider/dashboard");

/**
 * GET /api/Provider/profile
 */
export const getProviderProfile = () =>
  axiosClient.get("/Provider/profile");

/**
 * PUT /api/Provider/profile
 * multipart/form-data containing Bio, Experience, ProfilePicture
 * @param {FormData} formData
 */
export const updateProviderProfile = (formData) =>
  axiosClient.put("/Provider/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/**
 * GET /api/Provider
 * @param {Object} [params] - { Available, Governorate, City, CategoryId, Search, Page, PageSize }
 */
export const getProviders = (params) =>
  axiosClient.get("/Provider", { params });

/**
 * GET /api/Provider/{providerId}
 * @param {string} providerId
 */
export const getProvider = (providerId) =>
  axiosClient.get(`/Provider/${providerId}`);

/**
 * PUT /api/Provider/profile/availability
 * @param {boolean} isAvailable
 */
export const updateAvailabilityStatus = (isAvailable) =>
  axiosClient.put("/Provider/profile/availability", { isAvailable });

/**
 * GET /api/Provider/working-areas
 */
export const getWorkingAreas = () =>
  axiosClient.get("/Provider/working-areas");

/**
 * POST /api/Provider/working-areas
 * @param {Object} data - { governorate, city, district }
 */
export const addWorkingArea = (data) =>
  axiosClient.post("/Provider/working-areas", data);

/**
 * DELETE /api/Provider/working-areas/{id}
 * @param {string} id
 */
export const deleteWorkingArea = (id) =>
  axiosClient.delete(`/Provider/working-areas/${id}`);

/**
 * GET /api/Provider/availability
 * @param {Object} [params] - { startDate, endDate }
 */
export const getAvailability = (params) =>
  axiosClient.get("/Provider/availability", { params });

/**
 * POST /api/Provider/availability
 * @param {Object} data - { date, isAvailable, availableShift, notes }
 */
export const setAvailability = (data) =>
  axiosClient.post("/Provider/availability", data);

/**
 * PUT /api/Provider/availability/{id}
 * @param {string} id
 * @param {Object} data - { id, isAvailable, availableShift, notes }
 */
export const updateAvailability = (id, data) =>
  axiosClient.put(`/Provider/availability/${id}`, data);

/**
 * DELETE /api/Provider/availability/{id}
 * @param {string} id
 */
export const deleteAvailability = (id) =>
  axiosClient.delete(`/Provider/availability/${id}`);

/**
 * POST /api/Provider/availability/bulk
 * @param {Object} data - { startDate, endDate, isAvailable, availableShift, excludeDays }
 */
export const setBulkAvailability = (data) =>
  axiosClient.post("/Provider/availability/bulk", data);
