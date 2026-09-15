import axiosClient from "./axiosClient";

/**
 * GET /api/User/profile — get current user profile
 */
export const getProfile = () => axiosClient.get("/User/profile");

/**
 * PUT /api/User/profile — update user profile
 */
export const updateProfile = (data) =>
  axiosClient.put("/User/profile", data);

/**
 * PUT /api/User/change-password
 */
export const changePassword = (data) =>
  axiosClient.put("/User/change-password", data);
