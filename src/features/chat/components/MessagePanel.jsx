import {
  Send,
  MessageSquare,
  Check,
  CheckCheck,
  Sparkles,
  Wifi,
  WifiOff,
  ArrowLeft,
  ExternalLink,
  Smile,
  ChevronDown,
  Paperclip,
  Clock,
} from "lucide-react";
import PropTypes from "prop-types";
import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import DirectionalIcon from "@/components/shared/DirectionalIcon";
import EmptyState from "@/components/shared/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { SIGNALR_STATUS } from "@/lib/signalrConstants";
import { cn, getInitials, getMediaUrl } from "@/lib/utils";

const COMMON_EMOJIS = ["👍", "👋", "🙏", "❤️", "😊", "🚗", "⏱️", "📍", "✅", "🤝", "🔧", "⭐"];

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
  messagesEndRef,
  messageText,
  onMessageTextChange,
  onSend,
  isSending,
  connectionStatus,
  onBackToList,
  isProvider,
}) {
  const { t, i18n } = useTranslation("common");
  const scrollContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);

  // Monitor scroll position to show/hide "Scroll to bottom" button
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const isUp = el.scrollHeight - el.scrollTop - el.clientHeight > 140;
    setShowScrollBottom(isUp);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Reset textarea height when messageText becomes empty (e.g. after send)
  useEffect(() => {
    if (!messageText && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [messageText]);

  // Quick reply options
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

  const handleInsertEmoji = (emoji) => {
    onMessageTextChange((prev) => prev + emoji);
    setEmojiOpen(false);
    textareaRef.current?.focus();
  };

  const handleSelectQuickReply = (text) => {
    onMessageTextChange(text);
    textareaRef.current?.focus();
  };

  // Construct request link URL
  const requestDetailsUrl = activeChat?.serviceRequestId
    ? isProvider
      ? `/provider/requests/${activeChat.serviceRequestId}`
      : `/app/requests/${activeChat.serviceRequestId}`
    : null;

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background/50 text-center">
        <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 max-w-sm">
          <EmptyState
            icon={MessageSquare}
            title={t("chat.noActiveChat")}
            description={t("chat.chooseConversation")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background/50 relative overflow-hidden">
      {/* Active Thread Header */}
      <div className="p-3 sm:p-3.5 px-4 sm:px-6 border-b border-border/70 flex items-center justify-between bg-card/90 backdrop-blur-xs z-10">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Mobile Back Button */}
          {onBackToList && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onBackToList}
              className="md:hidden h-8 w-8 -ms-1 text-muted-foreground hover:text-foreground rounded-lg flex-shrink-0"
              aria-label={t("chat.backToConversations", "Back to conversations")}
            >
              <DirectionalIcon icon={ArrowLeft} className="h-4 w-4" />
            </Button>
          )}

          {/* Partner Avatar with Online Indicator */}
          <div className="relative flex-shrink-0">
            <Avatar className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl border border-border/80 ring-1 ring-border/20 shadow-xs">
              <AvatarImage
                src={getMediaUrl(activeChat.otherPartyAvatar)}
                alt={activeChat.otherPartyName}
              />
              <AvatarFallback className="rounded-xl text-xs font-bold bg-primary/10 text-primary">
                {getInitials(activeChat.otherPartyName)}
              </AvatarFallback>
            </Avatar>
            {activeChat.isOtherPartyOnline && (
              <span className="absolute -bottom-0.5 end-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
            )}
          </div>

          {/* Partner Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs sm:text-sm font-bold text-foreground truncate">
                {activeChat.otherPartyName || t("nav.messages")}
              </h3>
            </div>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate flex items-center gap-1">
              <span
                className={cn(
                  "inline-block h-1.5 w-1.5 rounded-full",
                  activeChat.isOtherPartyOnline ? "bg-emerald-500" : "bg-muted-foreground/50"
                )}
              />
              {activeChat.isOtherPartyOnline ? t("chat.activeNow") : t("chat.offline")}
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Linked Service Request Chip */}
          {activeChat.serviceRequestId && requestDetailsUrl && (
            <Link
              to={requestDetailsUrl}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-muted/60 hover:bg-primary/10 hover:text-primary border border-border/70 transition-colors"
              title={t("chat.viewRequest", "View Request Details")}
            >
              <span className="truncate max-w-[90px] sm:max-w-[130px]">
                {t("chat.requestNumber", { id: activeChat.serviceRequestId.slice(0, 6) })}
              </span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </Link>
          )}

          {/* SignalR connection status badge */}
          {connectionStatus &&
            (() => {
              const statusConfig = {
                [SIGNALR_STATUS.NOT_CONFIGURED]: null,
                [SIGNALR_STATUS.CONNECTING]: {
                  label: t("chat.signalr.connecting", "Connecting..."),
                  className:
                    "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
                  icon: <Wifi className="h-3 w-3 animate-pulse" />,
                },
                [SIGNALR_STATUS.CONNECTED]: {
                  label: t("chat.signalr.connected", "Live"),
                  className:
                    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
                  icon: <Wifi className="h-3 w-3" />,
                },
                [SIGNALR_STATUS.RECONNECTING]: {
                  label: t("chat.signalr.reconnecting", "Reconnecting..."),
                  className:
                    "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
                  icon: <Wifi className="h-3 w-3 animate-pulse" />,
                },
                [SIGNALR_STATUS.DISCONNECTED]: {
                  label: t("chat.signalr.disconnected", "Offline"),
                  className: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
                  icon: <WifiOff className="h-3 w-3" />,
                },
              };
              const cfg = statusConfig[connectionStatus];
              if (!cfg) return null;
              return (
                <Badge
                  variant="outline"
                  className={`hidden sm:inline-flex text-[10px] gap-1 font-medium ${cfg.className}`}
                >
                  {cfg.icon}
                  {cfg.label}
                </Badge>
              );
            })()}
        </div>
      </div>

      {/* Message Stream */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-2 bg-muted/15 scrollbar-thin relative"
      >
        {messagesLoading && messages.length === 0 ? (
          <div className="space-y-3 py-4 max-w-lg mx-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={cn("flex", i % 2 === 0 ? "justify-start" : "justify-end")}>
                <Skeleton className={cn("h-12 rounded-2xl", i % 2 === 0 ? "w-56" : "w-44")} />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          /* Empty Chat Welcome State with Quick Replies */
          <div className="h-full flex flex-col items-center justify-center py-8 px-4 text-center max-w-md mx-auto space-y-4">
            <div className="p-3.5 rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground">{t("chat.startConversation")}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("chat.startConversationDesc")}
              </p>
            </div>

            {/* Quick replies prompt */}
            <div className="w-full pt-2">
              <p className="text-[11px] font-semibold text-muted-foreground mb-2 text-start">
                {t("chat.quickReplyTitle", "Quick replies")}:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectQuickReply(reply)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-card hover:bg-primary/10 hover:text-primary border border-border/80 transition-colors text-start"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Message List with Date Dividers & Consecutive Grouping */
          messages.map((m, index) => {
            const isMine = m.isMine;
            const prevMessage = index > 0 ? messages[index - 1] : null;

            // Check if this message starts a new day
            const showDateDivider = index === 0 || !isSameDay(m.sentAt, prevMessage?.sentAt);

            // Check if consecutive from same sender within 2 minutes
            const isConsecutive =
              prevMessage &&
              prevMessage.isMine === m.isMine &&
              Math.abs(new Date(m.sentAt).getTime() - new Date(prevMessage.sentAt).getTime()) <
                120000;

            return (
              <div key={m.id || index} className="space-y-1.5">
                {/* Date Divider Badge */}
                {showDateDivider && (
                  <div className="flex justify-center my-3">
                    <span className="text-[10px] font-medium tracking-wide text-muted-foreground bg-card/80 dark:bg-card/60 backdrop-blur-xs border border-border/60 px-3 py-0.5 rounded-full shadow-2xs">
                      {formatDateDivider(m.sentAt, t, i18n.language)}
                    </span>
                  </div>
                )}

                {/* Message Bubble Row */}
                <div
                  className={cn(
                    "flex group",
                    isMine ? "justify-end" : "justify-start",
                    isConsecutive ? "mt-0.5" : "mt-2.5"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] sm:max-w-md p-3 rounded-2xl text-xs space-y-1 shadow-xs transition-shadow relative",
                      isMine
                        ? "bg-gradient-to-br from-primary to-primary/95 text-primary-foreground rounded-ee-xs"
                        : "bg-card text-foreground border border-border/80 rounded-es-xs",
                      isConsecutive && isMine && "rounded-te-md",
                      isConsecutive && !isMine && "rounded-ts-md"
                    )}
                  >
                    {/* Sender Name (only on first message in an incoming run) */}
                    {!isMine && !isConsecutive && m.senderName && (
                      <span className="block text-[10px] font-bold text-primary/80 mb-0.5">
                        {m.senderName}
                      </span>
                    )}

                    {/* Message Body */}
                    <p className="leading-relaxed whitespace-pre-wrap break-words select-text">
                      {m.message}
                    </p>

                    {/* Timestamp & Status Receipt */}
                    <div
                      className={cn(
                        "flex items-center gap-1 justify-end text-[10px] pt-0.5 select-none",
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
                      {isMine &&
                        (m.isRead ? (
                          <CheckCheck className="h-3 w-3 text-cyan-200" />
                        ) : (
                          <Check className="h-3 w-3" />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Scroll-to-Bottom Button */}
      {showScrollBottom && (
        <Button
          type="button"
          size="icon"
          variant="secondary"
          onClick={scrollToBottom}
          className="absolute bottom-20 end-6 h-8 w-8 rounded-full shadow-md bg-card/95 hover:bg-card border border-border/80 z-20 transition-all animate-in fade-in zoom-in"
          aria-label={t("chat.scrollToBottom", "Scroll to bottom")}
        >
          <ChevronDown className="h-4 w-4 text-foreground" />
        </Button>
      )}

      {/* Quick Replies Strip (collapsible if messages exist) */}
      {messages.length > 0 && (
        <div className="px-3 sm:px-4 py-1.5 bg-card/60 border-t border-border/40 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase flex-shrink-0 tracking-wider">
            ⚡
          </span>
          {quickReplies.slice(0, 3).map((reply, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectQuickReply(reply)}
              className="text-[11px] px-2 py-0.5 rounded-md bg-muted/60 hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap flex-shrink-0 text-muted-foreground"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Compose Bar */}
      <form
        onSubmit={onSend}
        className="p-2.5 sm:p-3 bg-card border-t border-border/70 flex items-end gap-1.5 sm:gap-2 relative z-10"
      >
        {/* Attachment Placeholder */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() =>
            toast.info(t("chat.attachmentsComingSoon", "Attachment sharing will be available soon"))
          }
          className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-xl flex-shrink-0"
          aria-label="Attach file"
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        {/* Emoji Popover */}
        <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-xl flex-shrink-0"
              aria-label="Add emoji"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="start"
            className="w-56 p-2 rounded-xl shadow-lg border border-border/80 bg-card"
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

        {/* Multi-line auto-expanding textarea container */}
        <div className="flex-1 min-w-0 rounded-xl border border-border/80 bg-background/80 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={t("chat.typeMessage")}
            value={messageText}
            onChange={(e) => {
              onMessageTextChange(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            className="w-full resize-none bg-transparent py-2 px-3 text-xs focus:outline-none placeholder:text-muted-foreground min-h-[38px] max-h-[120px] leading-relaxed scrollbar-thin"
          />
        </div>

        {/* Send button */}
        <Button
          type="submit"
          size="icon"
          className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl shadow-sm flex-shrink-0 transition-transform active:scale-95"
          disabled={!messageText.trim() || isSending}
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
  );
}

MessagePanel.propTypes = {
  activeChat: PropTypes.object,
  messages: PropTypes.array.isRequired,
  messagesLoading: PropTypes.bool.isRequired,
  messagesEndRef: PropTypes.object.isRequired,
  messageText: PropTypes.string.isRequired,
  onMessageTextChange: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  isSending: PropTypes.bool,
  connectionStatus: PropTypes.string,
  onBackToList: PropTypes.func,
  isProvider: PropTypes.bool,
};
