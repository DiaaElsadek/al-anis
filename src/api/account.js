import axiosClient from "./axiosClient";

/**
 * POST /api/Account/login
 */
export const login = (credentials) =>
  axiosClient.post("/Account/login", credentials);

/**
 * POST /api/Account/register
 */
export const register = (userData) =>
  axiosClient.post("/Account/register", userData);

/**
 * POST /api/Account/register-service-provider (multipart)
 */
export const registerProvider = (formData) =>
  axiosClient.post("/Account/register-service-provider", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/**
 * POST /api/Account/verify-otp
 */
export const verifyOtp = ({ email, otp }) =>
  axiosClient.post("/Account/verify-otp", { email, otp });

/**
 * POST /api/Account/resend-otp
 */
export const resendOtp = (email) =>
  axiosClient.post("/Account/resend-otp", { email });

/**
 * POST /api/Account/forgot-password
 */
export const forgotPassword = (email) =>
  axiosClient.post("/Account/forgot-password", { email });

/**
 * POST /api/Account/reset-password
 */
export const resetPassword = (data) =>
  axiosClient.post("/Account/reset-password", data);

/**
 * POST /api/Account/refresh-token
 */
export const refreshToken = (refreshToken) =>
  axiosClient.post("/Account/refresh-token", { refreshToken });

/**
 * GET /api/Account/profile
 */
export const getProfile = () => axiosClient.get("/Account/profile");

/**
 * PUT /api/Account/change-password
 */
export const changePassword = (data) =>
  axiosClient.put("/Account/change-password", data);
