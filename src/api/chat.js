import axiosClient from "./axiosClient";

/**
 * GET /api/Chat/threads — list chat threads
 */
export const getThreads = () => axiosClient.get("/Chat/threads");

/**
 * GET /api/Chat/threads/:id/messages — get messages in a thread
 */
export const getMessages = (threadId, params) =>
  axiosClient.get(`/Chat/threads/${threadId}/messages`, { params });

/**
 * POST /api/Chat/threads/:id/messages — send a message
 */
export const sendMessage = (threadId, data) =>
  axiosClient.post(`/Chat/threads/${threadId}/messages`, data);

/**
 * PUT /api/Chat/threads/:id/mark-read
 */
export const markThreadRead = (threadId) =>
  axiosClient.put(`/Chat/threads/${threadId}/mark-read`);

/**
 * GET /api/Chat/unread-count
 */
export const getUnreadCount = () => axiosClient.get("/Chat/unread-count");
