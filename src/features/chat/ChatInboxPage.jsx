import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { getMyChats, getChatMessages, sendChatMessage, markChatAsRead } from "@/api/chat";
import ChatSidebar from "@/features/chat/components/ChatSidebar";
import MessagePanel from "@/features/chat/components/MessagePanel";
import { useAuth } from "@/hooks/useAuth";
import { useChatSignalR } from "@/hooks/useChatSignalR";
import { UserRole } from "@/lib/constants";
import { handleMutationError } from "@/lib/utils";

export default function ChatInboxPage() {
  const { t } = useTranslation("common");
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const isProvider = user?.role === UserRole.SERVICE_PROVIDER;

  const activeChatId = searchParams.get("active");

  // Track desktop breakpoint (768px)
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // SignalR real-time connection (opt-in: no-op when env vars are empty)
  const { status: signalrStatus } = useChatSignalR(activeChatId);

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

  // Auto-select first chat on desktop if none selected
  useEffect(() => {
    if (isDesktop && !activeChatId && chats.length > 0) {
      setSearchParams({ active: chats[0].id }, { replace: true });
    }
  }, [isDesktop, activeChatId, chats, setSearchParams]);

  // Active chat object
  const activeChat = chats.find((c) => c.id === activeChatId) || (isDesktop ? chats[0] : null);

  // Fetch messages for active chat
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ["chat-messages", activeChatId],
    queryFn: () => getChatMessages(activeChatId, { page: 1, pageSize: 50 }),
    enabled: !!activeChatId,
    refetchInterval: 4000,
  });

  const messages = messagesData?.messages || [];

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

  const handleSelectChat = useCallback(
    (id) => {
      setSearchParams({ active: id });
    },
    [setSearchParams]
  );

  const handleBackToList = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("active");
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return (
    <div className="h-[calc(100dvh-7.5rem)] min-h-[560px] max-h-[920px] flex rounded-2xl border border-border/70 shadow-sm bg-card overflow-hidden">
      {/* Left conversation rail: fixed width 320-350px */}
      <aside
        className={`w-full md:w-[320px] lg:w-[350px] flex-shrink-0 flex flex-col border-e border-border/60 bg-card ${
          activeChatId ? "hidden md:flex" : "flex"
        }`}
      >
        <ChatSidebar
          chats={chats}
          chatsLoading={chatsLoading}
          chatsError={chatsError}
          onRetryChats={() => refetchChats()}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
        />
      </aside>

      {/* Main conversation pane: flexible width with WhatsApp-style wallpaper behind messages */}
      <main
        className={`flex-1 min-w-0 flex flex-col bg-background/50 ${activeChatId ? "flex" : "hidden md:flex"}`}
      >
        <MessagePanel
          activeChat={activeChat}
          messages={messages}
          messagesLoading={messagesLoading}
          messageText={messageText}
          onMessageTextChange={setMessageText}
          onSend={handleSend}
          isSending={sendMutation.isPending}
          connectionStatus={signalrStatus}
          onBackToList={handleBackToList}
          isProvider={isProvider}
          currentUser={user}
        />
      </main>
    </div>
  );
}
