import axiosClient from "./axiosClient";

/**
 * GET /api/Category
 */
export const getCategories = () => axiosClient.get("/Category");

/**
 * GET /api/Category/active
 */
export const getActiveCategories = () => axiosClient.get("/Category/active");

/**
 * GET /api/Category/{id}
 * @param {string} id
 */
export const getCategory = (id) => axiosClient.get(`/Category/${id}`);

/**
 * POST /api/Category
 * @param {Object} data - { name, nameEn, description, icon, isActive }
 */
export const createCategory = (data) => axiosClient.post("/Category", data);

/**
 * PUT /api/Category/{id}
 * @param {string} id
 * @param {Object} data - { name, nameEn, description, icon, isActive }
 */
export const updateCategory = (id, data) => axiosClient.put(`/Category/${id}`, data);

/**
 * DELETE /api/Category/{id}
 * @param {string} id
 */
export const deleteCategory = (id) => axiosClient.delete(`/Category/${id}`);
