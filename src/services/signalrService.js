import * as signalR from "@microsoft/signalr";

import {
  SIGNALR_STATUS,
  SIGNALR_CONFIG,
  SIGNALR_RECONNECT_DELAYS,
  isSignalRConfigured,
} from "@/lib/signalrConstants";

/**
 * Singleton service that manages a single SignalR HubConnection.
 *
 * The service is strictly opt-in:
 * - If `isSignalRConfigured()` returns false, no connection is ever created.
 * - All server-method invocations check for a non-empty method name before calling.
 * - Status listeners are notified so the UI can display accurate state.
 */
class SignalRService {
  /** @type {signalR.HubConnection | null} */
  _connection = null;

  /** @type {string} */
  _status = isSignalRConfigured() ? SIGNALR_STATUS.DISCONNECTED : SIGNALR_STATUS.NOT_CONFIGURED;

  /** @type {Set<(status: string) => void>} */
  _statusListeners = new Set();

  /** @type {Map<string, Set<Function>>} */
  _eventListeners = new Map();

  /** Whether start() has been called and not yet stopped */
  _started = false;

  // ─── public API ──────────────────────────────────────────

  /** Current connection status */
  getStatus() {
    return this._status;
  }

  /** Whether SignalR env vars are populated */
  isConfigured() {
    return isSignalRConfigured();
  }

  /**
   * Subscribe to status changes.
   * @param {(status: string) => void} cb
   * @returns {() => void} unsubscribe function
   */
  onStatusChange(cb) {
    this._statusListeners.add(cb);
    return () => this._statusListeners.delete(cb);
  }

  /**
   * Build the connection (if needed) and start it.
   * No-op when SignalR is not configured.
   */
  async start() {
    if (!isSignalRConfigured()) {
      this._setStatus(SIGNALR_STATUS.NOT_CONFIGURED);
      return;
    }

    // Avoid double-start
    if (this._started && this._connection) {
      return;
    }

    this._buildConnection();
    this._setStatus(SIGNALR_STATUS.CONNECTING);

    try {
      await this._connection.start();
      this._started = true;
      this._setStatus(SIGNALR_STATUS.CONNECTED);
    } catch (err) {
      console.error("[SignalR] Connection failed:", err);
      this._setStatus(SIGNALR_STATUS.DISCONNECTED);
    }
  }

  /**
   * Stop the connection and clean up all listeners.
   */
  async stop() {
    this._started = false;

    if (this._connection) {
      try {
        // Remove all registered event listeners from the connection
        for (const [event] of this._eventListeners) {
          this._connection.off(event);
        }
        this._eventListeners.clear();

        await this._connection.stop();
      } catch (err) {
        console.error("[SignalR] Stop error:", err);
      }
      this._connection = null;
    }

    if (isSignalRConfigured()) {
      this._setStatus(SIGNALR_STATUS.DISCONNECTED);
    } else {
      this._setStatus(SIGNALR_STATUS.NOT_CONFIGURED);
    }
  }

  /**
   * Register a handler for a specific Hub client event.
   * @param {string} event
   * @param {Function} handler
   * @returns {() => void} unsubscribe function
   */
  on(event, handler) {
    if (!event || !this._connection) return () => {};

    if (!this._eventListeners.has(event)) {
      this._eventListeners.set(event, new Set());
    }

    const handlers = this._eventListeners.get(event);

    // Prevent duplicate registrations of the exact same handler reference
    if (handlers.has(handler)) {
      return () => this._off(event, handler);
    }

    handlers.add(handler);
    this._connection.on(event, handler);

    return () => this._off(event, handler);
  }

  /**
   * Invoke a server-side Hub method.
   * No-op if the method name is empty or the connection is not active.
   * @param {string} method
   * @param  {...any} args
   * @returns {Promise<any>}
   */
  async invoke(method, ...args) {
    if (
      !method ||
      !this._connection ||
      this._connection.state !== signalR.HubConnectionState.Connected
    ) {
      return undefined;
    }

    try {
      return await this._connection.invoke(method, ...args);
    } catch (err) {
      console.error(`[SignalR] invoke(${method}) failed:`, err);
      return undefined;
    }
  }

  /**
   * Join a chat room (if JOIN_CHAT_METHOD is configured).
   * @param {string} chatId
   */
  async joinChat(chatId) {
    if (!SIGNALR_CONFIG.JOIN_CHAT_METHOD || !chatId) return;
    await this.invoke(SIGNALR_CONFIG.JOIN_CHAT_METHOD, chatId);
  }

  /**
   * Leave a chat room (if LEAVE_CHAT_METHOD is configured).
   * @param {string} chatId
   */
  async leaveChat(chatId) {
    if (!SIGNALR_CONFIG.LEAVE_CHAT_METHOD || !chatId) return;
    await this.invoke(SIGNALR_CONFIG.LEAVE_CHAT_METHOD, chatId);
  }

  /**
   * Send a chat message via SignalR.
   * Returns `null` if SEND_MESSAGE_METHOD is not configured — callers should
   * fall back to the REST API in that case.
   * @param {{ chatId: string, message: string }} payload
   * @returns {Promise<any | null>}
   */
  async sendMessage({ chatId, message }) {
    if (!SIGNALR_CONFIG.SEND_MESSAGE_METHOD) return null;
    return this.invoke(SIGNALR_CONFIG.SEND_MESSAGE_METHOD, chatId, message);
  }

  // ─── internal helpers ────────────────────────────────────

  /** @private */
  _buildConnection() {
    if (this._connection) return;

    this._connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_CONFIG.HUB_URL, {
        accessTokenFactory: () => localStorage.getItem("accessToken") || "",
      })
      .withAutomaticReconnect(SIGNALR_RECONNECT_DELAYS)
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this._connection.onreconnecting(() => {
      this._setStatus(SIGNALR_STATUS.RECONNECTING);
    });

    this._connection.onreconnected(() => {
      this._setStatus(SIGNALR_STATUS.CONNECTED);
    });

    this._connection.onclose(() => {
      this._setStatus(SIGNALR_STATUS.DISCONNECTED);
      this._started = false;
    });
  }

  /** @private Remove a single event handler */
  _off(event, handler) {
    const handlers = this._eventListeners.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (this._connection) {
        this._connection.off(event, handler);
      }
      if (handlers.size === 0) {
        this._eventListeners.delete(event);
      }
    }
  }

  /** @private Broadcast status change to all subscribers */
  _setStatus(status) {
    if (this._status === status) return;
    this._status = status;
    for (const cb of this._statusListeners) {
      try {
        cb(status);
      } catch {
        // never let a listener error crash the service
      }
    }
  }
}

/** Singleton instance */
const signalrService = new SignalRService();
export default signalrService;
