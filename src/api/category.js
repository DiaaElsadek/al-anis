import axiosClient from "./axiosClient";

/**
 * GET /api/Category — list all categories
 */
export const getCategories = (params) =>
  axiosClient.get("/Category", { params });

/**
 * GET /api/Category/:id — single category
 */
export const getCategory = (id) => axiosClient.get(`/Category/${id}`);

/**
 * POST /api/Category — create category (admin)
 */
export const createCategory = (data) => axiosClient.post("/Category", data);

/**
 * PUT /api/Category/:id — update category (admin)
 */
export const updateCategory = (id, data) =>
  axiosClient.put(`/Category/${id}`, data);

/**
 * DELETE /api/Category/:id — delete category (admin)
 */
export const deleteCategory = (id) => axiosClient.delete(`/Category/${id}`);
