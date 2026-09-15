import axiosClient from "./axiosClient";

/**
 * GET /api/Admin/dashboard — admin dashboard stats
 */
export const getDashboardStats = () => axiosClient.get("/Admin/dashboard");

/**
 * GET /api/Admin/applications — provider applications queue
 */
export const getApplications = (params) =>
  axiosClient.get("/Admin/applications", { params });

/**
 * GET /api/Admin/applications/:id — single application detail
 */
export const getApplication = (id) =>
  axiosClient.get(`/Admin/applications/${id}`);

/**
 * PUT /api/Admin/applications/:id/approve
 */
export const approveApplication = (id) =>
  axiosClient.put(`/Admin/applications/${id}/approve`);

/**
 * PUT /api/Admin/applications/:id/reject
 */
export const rejectApplication = (id, reason) =>
  axiosClient.put(`/Admin/applications/${id}/reject`, { reason });

/**
 * GET /api/Admin/users — user management list
 */
export const getUsers = (params) =>
  axiosClient.get("/Admin/users", { params });

/**
 * PUT /api/Admin/users/:id/suspend
 */
export const suspendUser = (id) =>
  axiosClient.put(`/Admin/users/${id}/suspend`);

/**
 * PUT /api/Admin/users/:id/activate
 */
export const activateUser = (id) =>
  axiosClient.put(`/Admin/users/${id}/activate`);

/**
 * GET /api/Admin/bookings — recent bookings
 */
export const getRecentBookings = (params) =>
  axiosClient.get("/Admin/bookings", { params });

/**
 * GET /api/Admin/payments — payment transactions
 */
export const getAdminPayments = (params) =>
  axiosClient.get("/Admin/payments", { params });

/**
 * GET /api/Admin/payments/summary — revenue summary
 */
export const getPaymentsSummary = () =>
  axiosClient.get("/Admin/payments/summary");
