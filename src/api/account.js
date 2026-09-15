import axiosClient from "./axiosClient";

/**
 * POST /api/Account/login
 * @param {Object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @param {string} [credentials.phoneNumber]
 */
export const login = ({ email, password, phoneNumber = "" }) =>
  axiosClient.post("/Account/login", { email, password, phoneNumber });

/**
 * POST /api/Account/login/google
 * @param {Object} data
 * @param {string} data.idToken
 */
export const loginWithGoogle = ({ idToken }) =>
  axiosClient.post("/Account/login/google", { idToken });

/**
 * POST /api/Account/register-user
 * multipart/form-data containing:
 * Email, PhoneNumber, Password, ConfirmPassword, FirstName, LastName, Address, ProfilePicture, DateOfBirth
 * @param {FormData} formData
 */
export const registerUser = (formData) =>
  axiosClient.post("/Account/register-user", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/**
 * POST /api/Account/register-service-provider
 * multipart/form-data containing:
 * Email, PhoneNumber, Password, ConfirmPassword, FirstName, LastName, Address, DateOfBirth,
 * Bio, NationalId, Experience, HourlyRate, IdDocument, Certificate, CV, SelectedCategoryIds
 * @param {FormData} formData
 */
export const registerServiceProvider = (formData) =>
  axiosClient.post("/Account/register-service-provider", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/**
 * POST /api/Account/create-admin
 * @param {Object} adminData
 * @param {string} adminData.email
 * @param {string} adminData.phoneNumber
 * @param {string} adminData.password
 * @param {string} adminData.confirmPassword
 * @param {string} adminData.firstName
 * @param {string} adminData.lastName
 */
export const createAdmin = (adminData) => axiosClient.post("/Account/create-admin", adminData);

/**
 * POST /api/Account/verify-otp
 * @param {Object} payload
 * @param {string} payload.userId
 * @param {string} payload.otp
 */
export const verifyOtp = ({ userId, otp }) =>
  axiosClient.post("/Account/verify-otp", { userId, otp });

/**
 * POST /api/Account/resend-otp
 * @param {Object|string} payload - { userId } or raw userId string
 */
export const resendOtp = (payload) => {
  const userId = typeof payload === "string" ? payload : payload.userId;
  return axiosClient.post("/Account/resend-otp", { userId });
};

/**
 * POST /api/Account/forget-password
 * @param {Object} payload
 * @param {string} payload.email
 * @param {string} payload.phoneNumber
 */
export const forgetPassword = ({ email, phoneNumber }) =>
  axiosClient.post("/Account/forget-password", { email, phoneNumber });

/**
 * POST /api/Account/reset-password
 * @param {Object} payload
 * @param {string} payload.userId
 * @param {string} payload.otp
 * @param {string} payload.newPassword
 * @param {string} payload.confirmPassword
 */
export const resetPassword = ({ userId, otp, newPassword, confirmPassword }) =>
  axiosClient.post("/Account/reset-password", {
    userId,
    otp,
    newPassword,
    confirmPassword,
  });

/**
 * POST /api/Account/refresh-token
 * Body is a raw string matching Swagger schema "string"
 * @param {string} token
 */
export const refreshToken = (token) =>
  axiosClient.post("/Account/refresh-token", JSON.stringify(token), {
    headers: { "Content-Type": "application/json" },
  });

/**
 * POST /api/Account/change-password
 * @param {Object} payload
 * @param {string} payload.currentPassword
 * @param {string} payload.newPassword
 * @param {string} payload.confirmNewPassword
 */
export const changePassword = ({ currentPassword, newPassword, confirmNewPassword }) =>
  axiosClient.post("/Account/change-password", {
    currentPassword,
    newPassword,
    confirmNewPassword,
  });

/**
 * POST /api/Account/logout
 * Bearer token is automatically attached by axios request interceptor
 */
export const logout = () => axiosClient.post("/Account/logout");
