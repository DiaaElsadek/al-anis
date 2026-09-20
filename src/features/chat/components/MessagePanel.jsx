import {
  Send,
  MessageSquare,
  CheckCheck,
  Sparkles,
  ArrowLeft,
  ArrowDown,
  Clock,
  Search,
  Phone,
  PanelRight,
  Paperclip,
  Mic,
  Smile,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  X,
  ExternalLink,
  Briefcase,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";
import PropTypes from "prop-types";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import chatWallpaper from "@/assets/chat-wallpaper.jpg";
import DirectionalIcon from "@/components/shared/DirectionalIcon";
import EmptyState from "@/components/shared/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn, getInitials, getMediaUrl } from "@/lib/utils";

const COMMON_EMOJIS = ["👍", "👋", "🙏", "❤️", "😊", "🚗", "⏱️", "📍", "✅", "🤝", "🩺", "⭐"];

function isSameDay(d1, d2) {
  if (!d1 || !d2) return false;
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function formatDateDivider(dateStr, t, lang) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) return t("chat.today", "Today");
  if (isYesterday) return t("chat.yesterday", "Yesterday");

  const locale = lang === "ar" ? "ar-EG" : "en-US";
  return date.toLocaleDateString(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function MessagePanel({
  activeChat,
  messages,
  messagesLoading,
  messageText,
  onMessageTextChange,
  onSend,
  isSending,
  onBackToList,
  currentUser,
  isProvider,
}) {
  const { t, i18n } = useTranslation("common");
  const scrollContainerRef = useRef(null);
  const messagesEndAnchorRef = useRef(null);
  const textareaRef = useRef(null);

  // In-chat search state
  const [showInChatSearch, setShowInChatSearch] = useState(false);
  const [inChatSearchQuery, setInChatSearchQuery] = useState("");
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);

  // Right details drawer state
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);

  // Wallpaper visibility state
  const [wallpaperMode, setWallpaperMode] = useState("default"); // "default" | "subtle" | "off"

  // Emoji popover state
  const [emojiOpen, setEmojiOpen] = useState(false);

  // Scroll to bottom button state
  const [showNewMessagesBtn, setShowNewMessagesBtn] = useState(false);
  const prevMessagesCountRef = useRef(messages.length);
  const prevChatIdRef = useRef(activeChat?.id);

  // Filter messages for in-chat search
  const matchedMessageIds = useMemo(() => {
    const q = inChatSearchQuery.trim().toLowerCase();
    if (!q) return [];
    return messages
      .filter((m) => m.message && m.message.toLowerCase().includes(q))
      .map((m) => m.id);
  }, [messages, inChatSearchQuery]);

  // Safe measurement: Check if user is near bottom
  const isNearBottom = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return true;
    const threshold = 100;
    return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
  }, []);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
    setShowNewMessagesBtn(false);
  }, []);

  // Handle active chat switch or incoming messages
  useEffect(() => {
    const isChatSwitched = activeChat?.id !== prevChatIdRef.current;
    prevChatIdRef.current = activeChat?.id;

    if (isChatSwitched) {
      prevMessagesCountRef.current = messages.length;
      setShowNewMessagesBtn(false);
      setShowInChatSearch(false);
      setInChatSearchQuery("");
      const timer = setTimeout(() => {
        scrollToBottom("auto");
      }, 50);
      return () => clearTimeout(timer);
    }

    const prevCount = prevMessagesCountRef.current;
    prevMessagesCountRef.current = messages.length;

    if (messages.length > prevCount) {
      if (isNearBottom()) {
        scrollToBottom("smooth");
      } else {
        setShowNewMessagesBtn(true);
      }
    }
  }, [messages.length, activeChat?.id, isNearBottom, scrollToBottom]);

  const handleScroll = useCallback(() => {
    if (isNearBottom() && showNewMessagesBtn) {
      setShowNewMessagesBtn(false);
    }
  }, [isNearBottom, showNewMessagesBtn]);

  // Reset textarea height when messageText is empty
  useEffect(() => {
    if (!messageText && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [messageText]);

  // Quick replies
  const quickReplies = useMemo(
    () => [
      t("chat.quickReplies.greeting", "Hello! 👋"),
      t("chat.quickReplies.onMyWay", "I'm on my way 🚗"),
      t("chat.quickReplies.arrived", "I have arrived 📍"),
      t("chat.quickReplies.confirmTime", "Can you confirm the start time? ⏱️"),
      t("chat.quickReplies.thankYou", "Thank you very much! 🙏"),
    ],
    [t]
  );

  const handleSelectQuickReply = (text) => {
    onMessageTextChange(text);
    textareaRef.current?.focus();
  };

  const handleInsertEmoji = (emoji) => {
    onMessageTextChange((prev) => prev + emoji);
    setEmojiOpen(false);
    textareaRef.current?.focus();
  };

  // Navigate through in-chat search matches
  const handleNextMatch = () => {
    if (matchedMessageIds.length === 0) return;
    const nextIdx = (activeMatchIndex + 1) % matchedMessageIds.length;
    setActiveMatchIndex(nextIdx);
    const targetEl = document.getElementById(`msg-${matchedMessageIds[nextIdx]}`);
    targetEl?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handlePrevMatch = () => {
    if (matchedMessageIds.length === 0) return;
    const prevIdx = (activeMatchIndex - 1 + matchedMessageIds.length) % matchedMessageIds.length;
    setActiveMatchIndex(prevIdx);
    const targetEl = document.getElementById(`msg-${matchedMessageIds[prevIdx]}`);
    targetEl?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Request details URL
  const requestDetailsUrl = activeChat?.serviceRequestId
    ? isProvider
      ? `/provider/requests/${activeChat.serviceRequestId}`
      : `/app/requests/${activeChat.serviceRequestId}`
    : null;

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background/30 text-center">
        <div className="p-6 rounded-2xl bg-card border border-border/50 max-w-sm shadow-xs">
          <EmptyState
            icon={MessageSquare}
            title={t("chat.noActiveChat", "No active chat selected")}
            description={t(
              "chat.chooseConversation",
              "Choose a conversation from the left to start messaging."
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background/30 relative overflow-hidden">
      {/* 1. Conversation Header */}
      <header className="h-16 px-4 sm:px-6 border-b border-border/60 flex items-center justify-between bg-card/95 backdrop-blur-sm z-20 select-none">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Back button */}
          {onBackToList && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onBackToList}
              className="md:hidden h-8 w-8 -ms-1 text-muted-foreground hover:text-foreground rounded-full flex-shrink-0"
              aria-label={t("chat.backToConversations", "Back to conversations")}
            >
              <DirectionalIcon icon={ArrowLeft} className="h-4 w-4" />
            </Button>
          )}

          {/* Participant Avatar with online presence */}
          <div className="relative flex-shrink-0">
            <Avatar className="h-10 w-10 rounded-full border border-border/60 shadow-xs">
              <AvatarImage
                src={getMediaUrl(activeChat.otherPartyAvatar)}
                alt={activeChat.otherPartyName}
              />
              <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                {getInitials(activeChat.otherPartyName)}
              </AvatarFallback>
            </Avatar>
            {activeChat.isOtherPartyOnline && (
              <span
                className="absolute bottom-0 end-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card"
                title={t("chat.activeNow", "Active now")}
              />
            )}
          </div>

          {/* Participant Name & Status */}
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-foreground truncate leading-tight">
              {activeChat.otherPartyName || t("nav.messages", "Messages")}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5">
                <span
                  className={cn(
                    "inline-block h-1.5 w-1.5 rounded-full",
                    activeChat.isOtherPartyOnline
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-muted-foreground/40"
                  )}
                />
                {activeChat.isOtherPartyOnline
                  ? t("chat.activeNow", "Active now")
                  : t("chat.offline", "Offline")}
              </p>

              {/* Linked Service Request Pill */}
              {activeChat.serviceRequestId && requestDetailsUrl && (
                <Link
                  to={requestDetailsUrl}
                  className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/15 px-2 py-0.5 rounded-md border border-primary/20 transition-colors"
                  title={t("chat.viewRequest", "View Request Details")}
                >
                  <Briefcase className="h-2.5 w-2.5" />
                  <span className="truncate max-w-[120px]">
                    {t("chat.requestNumber", { id: activeChat.serviceRequestId.slice(0, 8) })}
                  </span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Header Right Action Icons */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {/* In-Chat Search Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowInChatSearch((prev) => !prev);
              if (!showInChatSearch) {
                setInChatSearchQuery("");
              }
            }}
            className={cn(
              "h-8.5 w-8.5 text-muted-foreground hover:text-foreground rounded-full transition-colors",
              showInChatSearch && "bg-muted text-foreground"
            )}
            aria-label="Search in conversation"
            title={t("chat.searchInChat", "Search in conversation...")}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Voice call */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              toast.info(t("common.comingSoon", "Voice calling will be available soon"))
            }
            className="h-8.5 w-8.5 text-muted-foreground hover:text-foreground rounded-full"
            aria-label="Voice call"
          >
            <Phone className="h-4 w-4" />
          </Button>

          {/* Details Drawer Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowDetailsPanel((prev) => !prev)}
            className={cn(
              "h-8.5 w-8.5 text-muted-foreground hover:text-foreground rounded-full transition-colors",
              showDetailsPanel && "bg-muted text-foreground"
            )}
            aria-label="Toggle details sidebar"
            title={t("chat.chatDetails", "Chat Details")}
          >
            <PanelRight className="h-4 w-4" />
          </Button>

          {/* More options menu */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              setWallpaperMode((prev) =>
                prev === "default" ? "subtle" : prev === "subtle" ? "off" : "default"
              );
              toast.success(
                wallpaperMode === "default"
                  ? "Wallpaper dimmed"
                  : wallpaperMode === "subtle"
                    ? "Wallpaper hidden"
                    : "Wallpaper visible"
              );
            }}
            className="h-8.5 w-8.5 text-muted-foreground hover:text-foreground rounded-full"
            aria-label="Toggle wallpaper"
            title="Toggle wallpaper opacity"
          >
            {wallpaperMode === "off" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {/* In-Chat Search Bar (Slide down) */}
      {showInChatSearch && (
        <div className="px-4 py-2.5 bg-card/95 border-b border-border/50 flex items-center gap-2 z-20 animate-in slide-in-from-top duration-200">
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder={t("chat.searchInChat", "Search in conversation...")}
            value={inChatSearchQuery}
            onChange={(e) => {
              setInChatSearchQuery(e.target.value);
              setActiveMatchIndex(0);
            }}
            className="flex-1 bg-transparent border-0 text-xs sm:text-sm focus:outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          {matchedMessageIds.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
              <span>
                {activeMatchIndex + 1} of {matchedMessageIds.length}
              </span>
              <button
                type="button"
                onClick={handlePrevMatch}
                className="p-1 hover:bg-muted rounded"
                aria-label="Previous match"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextMatch}
                className="p-1 hover:bg-muted rounded"
                aria-label="Next match"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              setShowInChatSearch(false);
              setInChatSearchQuery("");
            }}
            className="p-1 text-muted-foreground hover:text-foreground rounded"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 2. Message Thread Pane with WhatsApp-style Background Wallpaper */}
      <div className="flex-1 relative overflow-hidden flex">
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {/* WhatsApp-Style Background Layer */}
          {wallpaperMode !== "off" && (
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
              {/* Photo of the user and another user chatting */}
              <div
                className={cn(
                  "absolute inset-0 bg-cover bg-center bg-no-repeat filter saturate-85 transition-opacity",
                  wallpaperMode === "default"
                    ? "opacity-[0.16] dark:opacity-[0.09]"
                    : "opacity-[0.08] dark:opacity-[0.04]"
                )}
                style={{ backgroundImage: `url(${chatWallpaper})` }}
              />

              {/* WhatsApp doodle pattern texture overlay */}
              <div
                className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
                style={{
                  backgroundImage: `radial-gradient(#000 0.8px, transparent 0.8px), radial-gradient(#000 0.8px, transparent 0.8px)`,
                  backgroundSize: "24px 24px",
                  backgroundPosition: "0 0, 12px 12px",
                }}
              />

              {/* Gradient vignette for optimal message bubble readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/35 to-background/75 dark:from-background/85 dark:via-background/50 dark:to-background/90" />
            </div>
          )}

          {/* Scrollable messages container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 p-4 sm:p-6 overflow-y-auto scrollbar-thin relative z-10 space-y-4"
          >
            {/* WhatsApp-style Chat Introduction & Participants Badge */}
            <div className="flex justify-center mb-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/85 dark:bg-card/75 backdrop-blur-xs border border-border/50 text-[11px] text-muted-foreground shadow-2xs">
                <div className="flex items-center -space-x-1.5 rtl:space-x-reverse">
                  <Avatar className="h-5 w-5 rounded-full border border-card shadow-xs">
                    <AvatarImage
                      src={getMediaUrl(currentUser?.profilePicture || currentUser?.avatar)}
                    />
                    <AvatarFallback className="text-[9px]">U</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-5 w-5 rounded-full border border-card shadow-xs">
                    <AvatarImage src={getMediaUrl(activeChat.otherPartyAvatar)} />
                    <AvatarFallback className="text-[9px]">U</AvatarFallback>
                  </Avatar>
                </div>
                <span className="font-medium text-foreground/85">{activeChat.otherPartyName}</span>
                <span className="text-muted-foreground/60">&bull;</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  {t("chat.activeNow", "Connected")}
                </span>
              </div>
            </div>

            {messagesLoading && messages.length === 0 ? (
              <div className="space-y-4 py-6 max-w-lg mx-auto">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={cn("flex", i % 2 === 0 ? "justify-start" : "justify-end")}
                  >
                    <Skeleton className={cn("h-14 rounded-2xl", i % 2 === 0 ? "w-60" : "w-48")} />
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-8 px-4 text-center max-w-md mx-auto space-y-3">
                <div className="p-3.5 rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">
                  {t("chat.startConversation", "Start the conversation")}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t(
                    "chat.startConversationDesc",
                    "Send a message to coordinate shift requirements, arrival time, or details."
                  )}
                </p>
              </div>
            ) : (
              messages.map((m, index) => {
                const isMine = m.isMine;
                const prevMessage = index > 0 ? messages[index - 1] : null;
                const showDateDivider = index === 0 || !isSameDay(m.sentAt, prevMessage?.sentAt);
                const isMatched = matchedMessageIds.includes(m.id);

                return (
                  <div key={m.id || index} id={`msg-${m.id}`} className="space-y-2">
                    {/* Centered Date Badge */}
                    {showDateDivider && (
                      <div className="flex justify-center my-4">
                        <span className="bg-muted/85 dark:bg-muted/60 backdrop-blur-xs text-muted-foreground text-[11px] font-medium px-3.5 py-1 rounded-full shadow-2xs border border-border/40">
                          {formatDateDivider(m.sentAt, t, i18n.language)}
                        </span>
                      </div>
                    )}

                    {/* Message Row with Avatars on both sides */}
                    <div
                      className={cn(
                        "flex items-end gap-2.5",
                        isMine ? "justify-end" : "justify-start"
                      )}
                    >
                      {/* Incoming Sender Avatar on left */}
                      {!isMine && (
                        <Avatar className="h-9 w-9 rounded-full flex-shrink-0 border border-border/50 shadow-2xs">
                          <AvatarImage
                            src={getMediaUrl(activeChat.otherPartyAvatar)}
                            alt={m.senderName || activeChat.otherPartyName}
                          />
                          <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                            {getInitials(m.senderName || activeChat.otherPartyName)}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={cn(
                          "max-w-[80%] md:max-w-[65%] p-3.5 space-y-1 shadow-2xs backdrop-blur-xs transition-all",
                          isMine
                            ? "bg-primary text-primary-foreground rounded-2xl rounded-ee-xs"
                            : "bg-white/95 dark:bg-card/95 border border-border/50 text-foreground rounded-2xl rounded-ss-xs",
                          isMatched && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                        )}
                      >
                        {/* Sender name for incoming messages */}
                        {!isMine && (
                          <span className="block text-xs font-semibold text-foreground/90 mb-1">
                            {m.senderName || activeChat.otherPartyName}
                          </span>
                        )}

                        {/* Message Body */}
                        <p
                          className={cn(
                            "text-sm leading-relaxed whitespace-pre-wrap break-words select-text",
                            isMine ? "text-primary-foreground" : "text-foreground/90"
                          )}
                        >
                          {m.message}
                        </p>

                        {/* Timestamp and Checkmarks footer */}
                        <div
                          className={cn(
                            "flex items-center gap-1 justify-end text-[10px] pt-1 select-none",
                            isMine ? "text-primary-foreground/75" : "text-muted-foreground"
                          )}
                        >
                          <span>
                            {new Date(m.sentAt).toLocaleTimeString(
                              i18n.language === "ar" ? "ar-EG" : "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                          {isMine ? (
                            <CheckCheck className="h-3 w-3 text-cyan-200" />
                          ) : (
                            <CheckCheck className="h-3 w-3 text-primary/80" />
                          )}
                        </div>
                      </div>

                      {/* Outgoing Sender Avatar on right */}
                      {isMine && (
                        <Avatar className="h-9 w-9 rounded-full flex-shrink-0 border border-border/50 shadow-2xs">
                          <AvatarImage
                            src={getMediaUrl(currentUser?.profilePicture || currentUser?.avatar)}
                            alt={currentUser?.fullName || "Me"}
                          />
                          <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                            {getInitials(currentUser?.fullName || "Me")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndAnchorRef} />
          </div>
        </div>

        {/* Slide-over Conversation Details Panel */}
        {showDetailsPanel && (
          <aside className="w-[280px] sm:w-[320px] flex-shrink-0 border-s border-border/50 bg-card p-4 space-y-4 overflow-y-auto z-20 animate-in slide-in-from-right duration-200 select-none">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <h4 className="text-xs font-semibold text-muted-foreground">
                {t("chat.chatDetails", "Chat Details")}
              </h4>
              <button
                type="button"
                onClick={() => setShowDetailsPanel(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
                aria-label="Close details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Participant Profile Card */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-muted/40 border border-border/40">
              <Avatar className="h-16 w-16 rounded-full border-2 border-border/60 shadow-xs mb-2">
                <AvatarImage
                  src={getMediaUrl(activeChat.otherPartyAvatar)}
                  alt={activeChat.otherPartyName}
                />
                <AvatarFallback className="text-base font-bold bg-primary/10 text-primary">
                  {getInitials(activeChat.otherPartyName)}
                </AvatarFallback>
              </Avatar>
              <h4 className="text-sm font-bold text-foreground">{activeChat.otherPartyName}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activeChat.isOtherPartyOnline
                  ? t("chat.activeNow", "Active now")
                  : t("chat.offline", "Offline")}
              </p>
            </div>

            {/* Linked Service Request Card */}
            {activeChat.serviceRequestId && (
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <div className="flex items-center gap-1.5 text-primary text-xs font-semibold">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>{t("chat.linkedToRequest", "Linked Service Request")}</span>
                </div>
                {activeChat.serviceRequestDescription && (
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    {activeChat.serviceRequestDescription}
                  </p>
                )}
                {requestDetailsUrl && (
                  <Link
                    to={requestDetailsUrl}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-1"
                  >
                    <span>{t("chat.viewRequest", "View Request Details")}</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>
            )}

            {/* Shared Files & Documents Section */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{t("chat.sharedFiles", "Shared Documents")}</span>
              </h5>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/30 hover:bg-muted/60 border border-border/30 transition-colors cursor-pointer text-xs">
                  <div className="h-7 w-7 rounded bg-blue-500/15 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                    PDF
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-foreground">
                      Care_Coordination_Agreement.pdf
                    </p>
                    <p className="text-[10px] text-muted-foreground">1.4 MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/30 hover:bg-muted/60 border border-border/30 transition-colors cursor-pointer text-xs">
                  <div className="h-7 w-7 rounded bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-bold text-[10px]">
                    DOC
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-foreground">
                      Shift_Checklist_Requirements.docx
                    </p>
                    <p className="text-[10px] text-muted-foreground">840 KB</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Floating "New messages" pill button */}
      {showNewMessagesBtn && (
        <button
          type="button"
          onClick={() => scrollToBottom("smooth")}
          className="absolute bottom-20 start-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-all animate-in fade-in slide-in-from-bottom-2"
        >
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
          <span>{t("chat.newMessages", "New messages")}</span>
        </button>
      )}

      {/* 3. Composer: Sticky bottom tray */}
      <div className="p-3 bg-card/95 backdrop-blur-sm border-t border-border/50 z-20 select-none">
        {/* Quick replies strip */}
        {messages.length > 0 && (
          <div className="mb-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {quickReplies.slice(0, 3).map((reply, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuickReply(reply)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-muted/60 hover:bg-primary/10 hover:text-primary text-muted-foreground border border-border/60 transition-colors whitespace-nowrap flex-shrink-0"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={onSend} className="flex items-end gap-2">
          {/* Pill Container with Attachment, Emoji, Textarea, and Mic */}
          <div className="flex-1 min-w-0 rounded-2xl bg-[#f4f5f7] dark:bg-muted/40 border border-border/50 px-3 py-1.5 flex items-end gap-2 focus-within:ring-1 focus-within:ring-primary transition-all">
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() =>
                toast.info(
                  t("chat.attachmentsComingSoon", "Attachment sharing will be available soon")
                )
              }
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full flex-shrink-0 mb-1"
              aria-label="Attach file"
              title="Attach document or photo"
            >
              <Paperclip className="h-4.5 w-4.5" />
            </button>

            {/* Emoji Picker Popover */}
            <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full flex-shrink-0 mb-1"
                  aria-label="Add emoji"
                  title="Emoji"
                >
                  <Smile className="h-4.5 w-4.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="start"
                className="w-56 p-2 rounded-xl shadow-lg border border-border/80 bg-card z-30"
              >
                <div className="grid grid-cols-4 gap-1">
                  {COMMON_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleInsertEmoji(emoji)}
                      className="h-9 w-9 text-lg rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Auto-expanding Textarea */}
            <Textarea
              ref={textareaRef}
              rows={1}
              placeholder={t("chat.typeMessage", "Type your message here...")}
              value={messageText}
              onChange={(e) => {
                onMessageTextChange(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 130)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              className="flex-1 bg-transparent border-0 text-sm focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground text-foreground resize-none py-1 min-h-[36px] max-h-[130px] leading-relaxed scrollbar-thin shadow-none"
            />

            {/* Mic / Voice Note button */}
            <button
              type="button"
              onClick={() =>
                toast.info(t("common.comingSoon", "Voice messages will be available soon"))
              }
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full flex-shrink-0 mb-1"
              aria-label="Record voice note"
              title="Voice message"
            >
              <Mic className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Circular Primary Send Button */}
          <Button
            type="submit"
            size="icon"
            disabled={!messageText.trim() || isSending}
            className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 shadow-md transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={t("chat.send", "Send")}
          >
            {isSending ? (
              <Clock className="h-4 w-4 animate-spin" />
            ) : (
              <DirectionalIcon icon={Send} className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

MessagePanel.propTypes = {
  activeChat: PropTypes.object,
  messages: PropTypes.array.isRequired,
  messagesLoading: PropTypes.bool.isRequired,
  messageText: PropTypes.string.isRequired,
  onMessageTextChange: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  isSending: PropTypes.bool,
  onBackToList: PropTypes.func,
  currentUser: PropTypes.object,
  isProvider: PropTypes.bool,
};
