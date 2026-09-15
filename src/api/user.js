import axiosClient from "./axiosClient";

/**
 * GET /api/User/profile
 */
export const getUserProfile = () => axiosClient.get("/User/profile");

/**
 * PUT /api/User/profile-picture
 * multipart/form-data containing ProfilePicture
 * @param {FormData} formData
 */
export const updateProfilePicture = (formData) =>
  axiosClient.put("/User/profile-picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
