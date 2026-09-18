// ============================================================
// SignalR Configuration Constants
// ============================================================

/**
 * Connection status enum for the SignalR integration.
 * "not-configured" is shown when environment variables are missing.
 */
export const SIGNALR_STATUS = {
  NOT_CONFIGURED: "not-configured",
  CONNECTING: "connecting",
  CONNECTED: "connected",
  RECONNECTING: "reconnecting",
  DISCONNECTED: "disconnected",
};

/**
 * Read SignalR configuration from environment variables.
 * All values default to empty strings — no guesswork, no assumed names.
 */
export const SIGNALR_CONFIG = {
  HUB_URL: import.meta.env.VITE_SIGNALR_CHAT_HUB_URL || "",
  RECEIVE_MESSAGE_EVENT: import.meta.env.VITE_SIGNALR_RECEIVE_MESSAGE_EVENT || "",
  SEND_MESSAGE_METHOD: import.meta.env.VITE_SIGNALR_SEND_MESSAGE_METHOD || "",
  JOIN_CHAT_METHOD: import.meta.env.VITE_SIGNALR_JOIN_CHAT_METHOD || "",
  LEAVE_CHAT_METHOD: import.meta.env.VITE_SIGNALR_LEAVE_CHAT_METHOD || "",
};

/**
 * Reconnection delay schedule (ms) for automatic reconnect.
 * Only used when SignalR is actually configured and connected.
 */
export const SIGNALR_RECONNECT_DELAYS = [0, 2000, 5000, 10000, 30000];

/**
 * Returns true only when both the Hub URL and at least one receive
 * event are explicitly configured. Otherwise SignalR stays off.
 */
export function isSignalRConfigured() {
  return Boolean(SIGNALR_CONFIG.HUB_URL && SIGNALR_CONFIG.RECEIVE_MESSAGE_EVENT);
}
