import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Send,
  MessageSquare,
  Search,
  Check,
  CheckCheck,
  User,
  ArrowLeft,
  Circle,
  Clock,
  Sparkles,
} from "lucide-react";

import {
  getMyChats,
  getChatMessages,
  sendChatMessage,
  markChatAsRead,
} from "@/api/chat";
import { getMediaUrl, getInitials } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";

export default function ChatInboxPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const activeChatId = searchParams.get("active");

  // Fetch all user chat threads
  const { data: chats = [], isLoading: chatsLoading } = useQuery({
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
  const {
    data: messagesData,
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = useQuery({
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
    onSuccess: (sentMsg) => {
      setMessageText("");
      queryClient.invalidateQueries(["chat-messages", activeChatId]);
      queryClient.invalidateQueries(["my-chats"]);
    },
    onError: (error) => {
      toast.error("Failed to send message", {
        description: error?.response?.data?.message || "Please check connection.",
      });
    },
  });

  const handleSend = (e) => {
    e?.preventDefault();
    const trimmed = messageText.trim();
    if (!trimmed || !activeChatId) return;
    sendMutation.mutate(trimmed);
  };

  const filteredChats = chats.filter((c) =>
    (c.otherPartyName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8.5rem)] flex rounded-2xl border border-border/80 shadow-md bg-card overflow-hidden">
      {/* Left Chat Threads List */}
      <div className="w-full sm:w-80 md:w-96 flex flex-col border-e border-border/70 bg-card">
        {/* Top search & title */}
        <div className="p-4 border-b border-border/60 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Direct Messages</h2>
            <Badge variant="outline" className="text-[11px] font-mono">
              {chats.length} Threads
            </Badge>
          </div>

          <div className="relative">
            <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ps-9 h-9 text-xs rounded-xl"
            />
          </div>
        </div>

        {/* Thread items */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/40">
          {chatsLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center py-12 px-4 text-xs text-muted-foreground space-y-1">
              <MessageSquare className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="font-semibold text-foreground">No conversations yet</p>
              <p>When you book or receive a shift request, your chat thread will appear here.</p>
            </div>
          ) : (
            filteredChats.map((c) => {
              const isSelected = c.id === activeChatId;

              return (
                <button
                  key={c.id}
                  onClick={() => setSearchParams({ active: c.id })}
                  className={`w-full p-3.5 flex items-start gap-3 text-start transition-colors ${
                    isSelected
                      ? "bg-primary/10 border-s-4 border-s-primary"
                      : "hover:bg-muted/40"
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-11 w-11 rounded-xl border">
                      <AvatarImage src={getMediaUrl(c.otherPartyAvatar)} alt={c.otherPartyName} />
                      <AvatarFallback className="rounded-xl text-xs font-bold bg-primary/10 text-primary">
                        {getInitials(c.otherPartyName)}
                      </AvatarFallback>
                    </Avatar>
                    {c.isOtherPartyOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-foreground truncate">
                        {c.otherPartyName || "Participant"}
                      </h4>
                      {c.lastMessageAt && (
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(c.lastMessageAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {c.lastMessage || c.serviceRequestDescription || "Shift chat initialized"}
                    </p>

                    {c.serviceRequestDescription && (
                      <span className="inline-block text-[10px] text-teal-700 bg-teal-500/10 px-1.5 py-0.5 rounded mt-1 font-medium truncate max-w-[170px]">
                        {c.serviceRequestDescription}
                      </span>
                    )}
                  </div>

                  {c.unreadCount > 0 && (
                    <Badge className="h-5 px-1.5 text-[10px] bg-primary text-primary-foreground font-bold rounded-full">
                      {c.unreadCount}
                    </Badge>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Active Conversation Panel */}
      <div className="flex-1 flex flex-col bg-background/50">
        {activeChat ? (
          <>
            {/* Active Thread Header */}
            <div className="p-3.5 px-6 border-b border-border/70 flex items-center justify-between bg-card">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-xl border">
                  <AvatarImage
                    src={getMediaUrl(activeChat.otherPartyAvatar)}
                    alt={activeChat.otherPartyName}
                  />
                  <AvatarFallback className="rounded-xl text-xs font-bold bg-primary/10 text-primary">
                    {getInitials(activeChat.otherPartyName)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">
                      {activeChat.otherPartyName || "Chat"}
                    </h3>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        activeChat.isOtherPartyOnline ? "bg-emerald-500" : "bg-muted-foreground/40"
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {activeChat.isOtherPartyOnline ? "Active now" : "Offline"} • Linked to Service Request
                  </p>
                </div>
              </div>

              {activeChat.serviceRequestId && (
                <Badge variant="outline" className="text-xs bg-muted/30">
                  Request #{activeChat.serviceRequestId.slice(0, 8)}
                </Badge>
              )}
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-muted/10">
              {messagesLoading && messages.length === 0 ? (
                <div className="space-y-3 py-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-48 rounded-xl" />
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-16 text-xs text-muted-foreground space-y-1">
                  <Sparkles className="h-6 w-6 text-primary mx-auto mb-1.5" />
                  <p className="font-semibold text-foreground">Start the conversation</p>
                  <p>Send a message to coordinate shift requirements, arrival time, or details.</p>
                </div>
              ) : (
                messages.map((m) => {
                  const isMine = m.isMine;

                  return (
                    <div
                      key={m.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] sm:max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-sm ${
                          isMine
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-card text-foreground border border-border/80 rounded-bl-none"
                        }`}
                      >
                        {!isMine && m.senderName && (
                          <span className="block text-[10px] font-bold text-muted-foreground">
                            {m.senderName}
                          </span>
                        )}

                        <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>

                        <div
                          className={`flex items-center gap-1 justify-end text-[10px] ${
                            isMine ? "text-primary-foreground/75" : "text-muted-foreground"
                          }`}
                        >
                          <span>
                            {new Date(m.sentAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {isMine && (
                            m.isRead ? (
                              <CheckCheck className="h-3 w-3 text-cyan-200" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Compose bar */}
            <form
              onSubmit={handleSend}
              className="p-3 sm:p-4 bg-card border-t border-border/70 flex items-center gap-2"
            >
              <Input
                placeholder="Type your message here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="h-10 text-xs rounded-xl"
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 rounded-xl shadow-sm flex-shrink-0"
                disabled={!messageText.trim() || sendMutation.isPending}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <EmptyState
              icon={MessageSquare}
              title="No active chat selected"
              description="Choose a conversation from the left to start messaging."
            />
          </div>
        )}
      </div>
    </div>
  );
}
