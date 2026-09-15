import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { getMyChats, getChatMessages, sendChatMessage, markChatAsRead } from "@/api/chat";
import ChatSidebar from "@/features/chat/components/ChatSidebar";
import MessagePanel from "@/features/chat/components/MessagePanel";
import { handleMutationError } from "@/lib/utils";

export default function ChatInboxPage() {
  const { t } = useTranslation("common");
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const activeChatId = searchParams.get("active");

  // Fetch all user chat threads
  const {
    data: chats = [],
    isLoading: chatsLoading,
    isError: chatsError,
    refetch: refetchChats,
  } = useQuery({
    queryKey: ["my-chats"],
    queryFn: getMyChats,
    refetchInterval: 5000,
  });

  // Select first chat if none selected and chats exist
  useEffect(() => {
    if (!activeChatId && chats.length > 0) {
      setSearchParams({ active: chats[0].id }, { replace: true });
    }
  }, [activeChatId, chats, setSearchParams]);

  // Active chat object
  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  // Fetch messages for active chat
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ["chat-messages", activeChatId],
    queryFn: () => getChatMessages(activeChatId, { page: 1, pageSize: 50 }),
    enabled: !!activeChatId,
    refetchInterval: 4000,
  });

  const messages = messagesData?.messages || [];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Mark active chat as read
  useEffect(() => {
    if (activeChatId && activeChat?.unreadCount > 0) {
      markChatAsRead(activeChatId).then(() => {
        queryClient.invalidateQueries(["my-chats"]);
      });
    }
  }, [activeChatId, activeChat?.unreadCount, queryClient]);

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: (text) =>
      sendChatMessage({
        chatId: activeChatId,
        message: text,
      }),
    onSuccess: () => {
      setMessageText("");
      queryClient.invalidateQueries(["chat-messages", activeChatId]);
      queryClient.invalidateQueries(["my-chats"]);
    },
    onError: (error) => handleMutationError(error, t, "chat.sendFailed"),
  });

  const handleSend = (e) => {
    e?.preventDefault();
    const trimmed = messageText.trim();
    if (!trimmed || !activeChatId) return;
    sendMutation.mutate(trimmed);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex rounded-2xl border border-border/80 shadow-md bg-card overflow-hidden">
      <ChatSidebar
        chats={chats}
        chatsLoading={chatsLoading}
        chatsError={chatsError}
        onRetryChats={() => refetchChats()}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeChatId={activeChatId}
        onSelectChat={(id) => setSearchParams({ active: id })}
      />

      <MessagePanel
        activeChat={activeChat}
        messages={messages}
        messagesLoading={messagesLoading}
        messagesEndRef={messagesEndRef}
        messageText={messageText}
        onMessageTextChange={setMessageText}
        onSend={handleSend}
        isSending={sendMutation.isPending}
      />
    </div>
  );
}
