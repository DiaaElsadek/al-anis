import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, useCallback } from "react";

import { useAuth } from "@/hooks/useAuth";
import { SIGNALR_STATUS, SIGNALR_CONFIG } from "@/lib/signalrConstants";
import signalrService from "@/services/signalrService";

/**
 * React hook that manages the SignalR real-time chat connection.
 *
 * Behaviour:
 * - When SignalR is not configured, returns `status: "not-configured"` and
 *   does nothing. The chat works entirely through REST + polling.
 * - When configured:
 *   - Starts the connection after login (accessToken present).
 *   - Joins/leaves chat rooms when `activeChatId` changes (if methods configured).
 *   - Appends incoming messages to React Query cache, preserving the
 *     existing data shape (`{ messages: [...], ... }`) and deduplicating by `id`.
 *   - Stops the connection on logout or component unmount.
 *
 * @param {string | null} activeChatId - The currently viewed chat ID
 * @returns {{ status: string, isConfigured: boolean, isConnected: boolean, sendMessage: Function }}
 */
export function useChatSignalR(activeChatId) {
  const { accessToken, user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [status, setStatus] = useState(signalrService.getStatus());
  const prevChatIdRef = useRef(null);
  const messageHandlerRef = useRef(null);

  // ─── Connection lifecycle ─────────────────────────────────
  useEffect(() => {
    if (!signalrService.isConfigured()) {
      setStatus(SIGNALR_STATUS.NOT_CONFIGURED);
      return;
    }

    // Subscribe to status changes
    const unsubStatus = signalrService.onStatusChange(setStatus);

    if (isAuthenticated && accessToken) {
      signalrService.start();
    }

    return () => {
      unsubStatus();
    };
  }, [isAuthenticated, accessToken]);

  // Stop connection when auth is lost (logout)
  useEffect(() => {
    if (!isAuthenticated && signalrService.getStatus() !== SIGNALR_STATUS.NOT_CONFIGURED) {
      signalrService.stop();
    }
  }, [isAuthenticated]);

  // Stop connection on full unmount
  useEffect(() => {
    return () => {
      signalrService.stop();
    };
  }, []);

  // ─── Message listener ─────────────────────────────────────
  useEffect(() => {
    if (!signalrService.isConfigured() || !SIGNALR_CONFIG.RECEIVE_MESSAGE_EVENT) {
      return;
    }

    // Remove previous handler before creating a new one
    if (messageHandlerRef.current) {
      messageHandlerRef.current();
      messageHandlerRef.current = null;
    }

    const handler = (incomingMessage) => {
      if (!incomingMessage || !incomingMessage.id) return;

      // Normalise the isMine flag if the server does not include it
      const normalised = {
        ...incomingMessage,
        isMine:
          typeof incomingMessage.isMine === "boolean"
            ? incomingMessage.isMine
            : incomingMessage.senderId === user?.id,
      };

      // Determine which chat this message belongs to
      const targetChatId = incomingMessage.chatId || activeChatId;
      if (!targetChatId) return;

      // ── Update messages cache (preserving existing data shape) ──
      queryClient.setQueryData(["chat-messages", targetChatId], (oldData) => {
        if (!oldData) return oldData;

        const currentList = oldData.messages ?? [];

        // Deduplicate by message id
        if (currentList.some((m) => m.id === normalised.id)) {
          return oldData;
        }

        return {
          ...oldData,
          messages: [...currentList, normalised],
        };
      });

      // ── Update chat list with latest message metadata ──
      queryClient.setQueryData(["my-chats"], (oldChats) => {
        if (!Array.isArray(oldChats)) return oldChats;

        return oldChats.map((chat) => {
          if (chat.id !== targetChatId) return chat;
          return {
            ...chat,
            lastMessage: normalised.message,
            lastMessageAt: normalised.sentAt,
            // Only bump unread if it is not the currently active chat
            // and the message is not from the current user
            unreadCount:
              targetChatId !== activeChatId && !normalised.isMine
                ? (chat.unreadCount || 0) + 1
                : chat.unreadCount,
          };
        });
      });
    };

    const unsubMessage = signalrService.on(SIGNALR_CONFIG.RECEIVE_MESSAGE_EVENT, handler);
    messageHandlerRef.current = unsubMessage;

    return () => {
      if (messageHandlerRef.current) {
        messageHandlerRef.current();
        messageHandlerRef.current = null;
      }
    };
  }, [activeChatId, user?.id, queryClient]);

  // ─── Room join / leave ────────────────────────────────────
  useEffect(() => {
    if (!signalrService.isConfigured()) return;

    const prevId = prevChatIdRef.current;

    if (prevId && prevId !== activeChatId) {
      signalrService.leaveChat(prevId);
    }

    if (activeChatId) {
      signalrService.joinChat(activeChatId);
    }

    prevChatIdRef.current = activeChatId;

    return () => {
      if (activeChatId) {
        signalrService.leaveChat(activeChatId);
      }
    };
  }, [activeChatId]);

  // ─── Send helper ──────────────────────────────────────────
  const sendMessage = useCallback(async ({ chatId, message }) => {
    return signalrService.sendMessage({ chatId, message });
  }, []);

  return {
    status,
    isConfigured: signalrService.isConfigured(),
    isConnected: status === SIGNALR_STATUS.CONNECTED,
    sendMessage,
  };
}
