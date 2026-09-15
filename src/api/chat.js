import axiosClient from "./axiosClient";

/**
 * POST /api/Chat/create-or-get/{serviceRequestId}
 * @param {string} serviceRequestId
 */
export const createOrGetChat = (serviceRequestId) =>
  axiosClient.post(`/Chat/create-or-get/${serviceRequestId}`);

/**
 * GET /api/Chat/my-chats
 */
export const getMyChats = () =>
  axiosClient.get("/Chat/my-chats");

/**
 * GET /api/Chat/{chatId}/messages
 * @param {string} chatId
 * @param {Object} [params] - { page, pageSize }
 */
export const getChatMessages = (chatId, params = { page: 1, pageSize: 50 }) =>
  axiosClient.get(`/Chat/${chatId}/messages`, { params });

/**
 * POST /api/Chat/send-message
 * @param {Object} payload - { chatId, message }
 */
export const sendChatMessage = ({ chatId, message }) =>
  axiosClient.post("/Chat/send-message", { chatId, message });

/**
 * PUT /api/Chat/{chatId}/mark-read
 * @param {string} chatId
 */
export const markChatAsRead = (chatId) =>
  axiosClient.put(`/Chat/${chatId}/mark-read`);
