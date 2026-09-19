import { MessageSquare, Search, AlertCircle, X, Briefcase, CheckCheck } from "lucide-react";
import PropTypes from "prop-types";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import EmptyState from "@/components/shared/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, getInitials, getMediaUrl } from "@/lib/utils";

function formatChatTimestamp(dateStr, t, lang) {
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

  const locale = lang === "ar" ? "ar-EG" : "en-US";

  if (isToday) {
    return date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  }
  if (isYesterday) {
    return t("chat.yesterday", "Yesterday");
  }
  return date.toLocaleDateString(locale, { month: "short", day: "numeric" });
}

export default function ChatSidebar({
  chats,
  chatsLoading,
  chatsError,
  onRetryChats,
  searchTerm,
  onSearchChange,
  activeChatId,
  onSelectChat,
}) {
  const { t, i18n } = useTranslation("common");
  const [filter, setFilter] = useState("all"); // "all" | "unread" | "requests"

  const unreadThreadsCount = useMemo(
    () => chats.filter((c) => (c.unreadCount || 0) > 0).length,
    [chats]
  );

  const requestsCount = useMemo(() => chats.filter((c) => !!c.serviceRequestId).length, [chats]);

  const filteredChats = useMemo(() => {
    const term = (searchTerm || "").toLowerCase().trim();
    return chats.filter((c) => {
      const name = (c.otherPartyName || "").toLowerCase();
      const desc = (c.serviceRequestDescription || "").toLowerCase();
      const last = (c.lastMessage || "").toLowerCase();
      const matchesSearch =
        !term || name.includes(term) || desc.includes(term) || last.includes(term);

      if (filter === "unread") {
        return matchesSearch && (c.unreadCount || 0) > 0;
      }
      if (filter === "requests") {
        return matchesSearch && !!c.serviceRequestId;
      }
      return matchesSearch;
    });
  }, [chats, searchTerm, filter]);

  return (
    <div className="w-full flex flex-col h-full bg-card select-none">
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-border/60 space-y-2.5 bg-card/80 backdrop-blur-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              {t("chat.directMessages", "Messages")}
            </h2>
            {unreadThreadsCount > 0 ? (
              <Badge className="text-[10px] font-bold px-1.5 py-0.5 bg-primary text-primary-foreground rounded-full">
                {unreadThreadsCount} {t("chat.unreadChats", "unread")}
              </Badge>
            ) : chats.length > 0 ? (
              <span className="text-[11px] font-medium text-muted-foreground">
                ({chats.length})
              </span>
            ) : null}
          </div>
        </div>

        {/* Search input with instant clear */}
        <div className="relative">
          <Search className="absolute start-3 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={t("chat.searchConversations", "Search conversations...")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="ps-9 pe-8 h-8.5 text-xs rounded-xl bg-background/70 border-border/70 focus-visible:ring-1 focus-visible:ring-primary"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute end-2.5 top-2.5 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded"
              aria-label={t("chat.clearSearch", "Clear search")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 pt-0.5 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
              filter === "all"
                ? "bg-muted text-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            {t("chat.allChats", "All")}
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap",
              filter === "unread"
                ? "bg-muted text-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            <span>{t("chat.unreadChats", "Unread")}</span>
            {unreadThreadsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-primary text-primary-foreground leading-4">
                {unreadThreadsCount}
              </span>
            )}
          </button>
          {requestsCount > 0 && (
            <button
              type="button"
              onClick={() => setFilter("requests")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 whitespace-nowrap",
                filter === "requests"
                  ? "bg-muted text-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <Briefcase className="h-3 w-3 opacity-70" />
              <span>{t("chat.careRequests", "Requests")}</span>
            </button>
          )}
        </div>
      </div>

      {/* Conversation list rows */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/30 scrollbar-thin">
        {chatsLoading ? (
          <div className="p-3 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-3 items-center py-1.5 px-2">
                <Skeleton className="h-11 w-11 rounded-full flex-shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-2.5 w-10" />
                  </div>
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>
        ) : chatsError ? (
          <div className="py-8 px-4">
            <EmptyState
              icon={AlertCircle}
              title={t("error")}
              description={t("empty.tryAdjusting")}
              actionLabel={t("actions.retry")}
              onAction={onRetryChats}
            />
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center py-12 px-4 text-xs text-muted-foreground space-y-2">
            <MessageSquare className="h-8 w-8 text-muted-foreground/30 mx-auto mb-1" />
            <p className="font-semibold text-foreground text-sm">
              {searchTerm || filter !== "all"
                ? t("chat.noSearchResults", "No conversations found")
                : t("chat.noConversations", "No conversations yet")}
            </p>
            <p className="max-w-[220px] mx-auto leading-relaxed">
              {searchTerm || filter !== "all"
                ? t("chat.noSearchResultsDesc", "Try searching with a different name or keyword.")
                : t(
                    "chat.noConversationsDesc",
                    "When you book or receive a shift request, your chat thread will appear here."
                  )}
            </p>
            {(searchTerm || filter !== "all") && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onSearchChange("");
                    setFilter("all");
                  }}
                  className="h-8 text-xs rounded-lg"
                >
                  {t("chat.clearSearch", "Clear search")}
                </Button>
              </div>
            )}
          </div>
        ) : (
          filteredChats.map((c) => {
            const isSelected = c.id === activeChatId;
            const hasUnread = (c.unreadCount || 0) > 0;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectChat(c.id)}
                className={cn(
                  "w-full px-3.5 py-3 flex items-start gap-3 text-start transition-all relative group",
                  isSelected
                    ? "bg-primary/[0.08] dark:bg-primary/[0.14] before:absolute before:inset-y-0 before:start-0 before:w-0.5 before:bg-primary"
                    : "hover:bg-muted/40"
                )}
              >
                {/* Avatar with live online presence dot */}
                <div className="relative flex-shrink-0 mt-0.5">
                  <Avatar className="h-11 w-11 rounded-full border border-border/60 shadow-2xs">
                    <AvatarImage src={getMediaUrl(c.otherPartyAvatar)} alt={c.otherPartyName} />
                    <AvatarFallback className="rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      {getInitials(c.otherPartyName)}
                    </AvatarFallback>
                  </Avatar>
                  {c.isOtherPartyOnline && (
                    <span
                      className="absolute bottom-0 end-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card"
                      title={t("chat.activeNow", "Active now")}
                    />
                  )}
                </div>

                {/* Conversation Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <h3
                      className={cn(
                        "text-sm truncate",
                        hasUnread ? "font-bold text-foreground" : "font-semibold text-foreground/90"
                      )}
                    >
                      {c.otherPartyName || t("chat.participant", "Participant")}
                    </h3>
                    {c.lastMessageAt && (
                      <span className="text-[11px] text-muted-foreground flex-shrink-0 font-normal">
                        {formatChatTimestamp(c.lastMessageAt, t, i18n.language)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-1 mt-0.5">
                    <p
                      className={cn(
                        "text-xs truncate max-w-[170px] leading-normal",
                        hasUnread
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground group-hover:text-foreground/80"
                      )}
                    >
                      {c.lastMessage ||
                        c.serviceRequestDescription ||
                        t("chat.shiftChatInit", "Shift chat initialized")}
                    </p>

                    {/* Unread badge or check status */}
                    {hasUnread ? (
                      <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center flex-shrink-0 shadow-xs">
                        {c.unreadCount}
                      </span>
                    ) : (
                      <CheckCheck className="h-3.5 w-3.5 text-primary/70 flex-shrink-0" />
                    )}
                  </div>

                  {/* Service Request Tag if linked */}
                  {c.serviceRequestDescription && (
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/60 dark:bg-muted/40 px-1.5 py-0.5 rounded-md w-fit max-w-[200px] truncate">
                      <Briefcase className="h-2.5 w-2.5 flex-shrink-0 opacity-70" />
                      <span className="truncate">{c.serviceRequestDescription}</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

ChatSidebar.propTypes = {
  chats: PropTypes.array.isRequired,
  chatsLoading: PropTypes.bool.isRequired,
  chatsError: PropTypes.bool,
  onRetryChats: PropTypes.func,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  activeChatId: PropTypes.string,
  onSelectChat: PropTypes.func.isRequired,
};
