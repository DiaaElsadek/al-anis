import axiosClient from "./axiosClient";

/**
 * GET /api/Admin/dashboard-stats
 */
export const getDashboardStats = () =>
  axiosClient.get("/Admin/dashboard-stats");

/**
 * GET /api/Admin/service-provider-applications
 * @param {Object} [params] - { page, pageSize }
 */
export const getServiceProviderApplications = (params = { page: 1, pageSize: 10 }) =>
  axiosClient.get("/Admin/service-provider-applications", { params });

/**
 * GET /api/Admin/service-provider-applications/{id}
 * @param {string} id
 */
export const getServiceProviderApplication = (id) =>
  axiosClient.get(`/Admin/service-provider-applications/${id}`);

/**
 * POST /api/Admin/service-provider-applications/{id}/approve
 * @param {string} id
 */
export const approveServiceProviderApplication = (id) =>
  axiosClient.post(`/Admin/service-provider-applications/${id}/approve`);

/**
 * POST /api/Admin/service-provider-applications/{id}/reject
 * @param {string} id
 * @param {string} rejectionReason
 */
export const rejectServiceProviderApplication = (id, rejectionReason) =>
  axiosClient.post(`/Admin/service-provider-applications/${id}/reject`, {
    rejectionReason,
  });

/**
 * POST /api/Admin/service-providers/{id}/suspend
 * @param {string} id
 * @param {string} reason
 */
export const suspendServiceProvider = (id, reason) =>
  axiosClient.post(`/Admin/service-providers/${id}/suspend`, { reason });

/**
 * POST /api/Admin/service-providers/{id}/activate
 * @param {string} id
 */
export const activateServiceProvider = (id) =>
  axiosClient.post(`/Admin/service-providers/${id}/activate`);

/**
 * GET /api/Admin/users
 * @param {Object} [params] - { Search, Role, Status, Page, PageSize }
 */
export const getUsers = (params) =>
  axiosClient.get("/Admin/users", { params });

/**
 * POST /api/Admin/users/{userId}/suspend
 * @param {string} userId
 */
export const suspendUser = (userId) =>
  axiosClient.post(`/Admin/users/${userId}/suspend`);

/**
 * POST /api/Admin/users/{userId}/activate
 * @param {string} userId
 */
export const activateUser = (userId) =>
  axiosClient.post(`/Admin/users/${userId}/activate`);

/**
 * GET /api/Admin/bookings/recent
 * @param {Object} [params] - { limit }
 */
export const getRecentBookings = (params = { limit: 10 }) =>
  axiosClient.get("/Admin/bookings/recent", { params });

/**
 * GET /api/Admin/payments
 */
export const getAdminPayments = () =>
  axiosClient.get("/Admin/payments");
