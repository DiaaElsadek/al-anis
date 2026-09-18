import { MessageSquare, Search, AlertCircle, X, Briefcase } from "lucide-react";
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
  const [filter, setFilter] = useState("all"); // "all" | "unread"

  const unreadThreadsCount = useMemo(
    () => chats.filter((c) => (c.unreadCount || 0) > 0).length,
    [chats]
  );

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
      return matchesSearch;
    });
  }, [chats, searchTerm, filter]);

  return (
    <div className="w-full flex flex-col h-full bg-card select-none">
      {/* Top search & header */}
      <div className="p-3.5 sm:p-4 border-b border-border/70 space-y-3 bg-card/60 backdrop-blur-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-foreground">
              {t("chat.directMessages")}
            </h2>
            {chats.length > 0 && (
              <Badge variant="secondary" className="text-[11px] font-mono px-2 py-0.5 rounded-full">
                {chats.length}
              </Badge>
            )}
          </div>
        </div>

        {/* Search input with clear button */}
        <div className="relative">
          <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={t("chat.searchConversations")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="ps-9 pe-9 h-9 text-xs rounded-xl bg-background/80 border-border/70 focus-visible:ring-1"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute end-2.5 top-2.5 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-sm"
              aria-label={t("chat.clearSearch")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-medium transition-all",
              filter === "all"
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            {t("chat.allChats", "All")}
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
              filter === "unread"
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <span>{t("chat.unreadChats", "Unread")}</span>
            {unreadThreadsCount > 0 && (
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] leading-none font-bold",
                  filter === "unread"
                    ? "bg-primary-foreground text-primary"
                    : "bg-primary text-primary-foreground"
                )}
              >
                {unreadThreadsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/40 scrollbar-thin">
        {chatsLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3 items-center">
                <Skeleton className="h-11 w-11 rounded-xl flex-shrink-0" />
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                  <Skeleton className="h-3 w-36" />
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
              {searchTerm || filter === "unread"
                ? t("chat.noSearchResults", "No conversations found")
                : t("chat.noConversations")}
            </p>
            <p className="max-w-[240px] mx-auto leading-relaxed">
              {searchTerm || filter === "unread"
                ? t("chat.noSearchResultsDesc", "Try searching with a different name or keyword.")
                : t("chat.noConversationsDesc")}
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
                onClick={() => onSelectChat(c.id)}
                className={cn(
                  "w-full p-3 sm:p-3.5 flex items-start gap-3 text-start transition-all relative group",
                  isSelected
                    ? "bg-primary/10 border-s-4 border-s-primary shadow-xs"
                    : "hover:bg-muted/40"
                )}
              >
                {/* Avatar with online presence */}
                <div className="relative flex-shrink-0 mt-0.5">
                  <Avatar className="h-11 w-11 rounded-xl border border-border/80 ring-1 ring-border/20 shadow-xs">
                    <AvatarImage src={getMediaUrl(c.otherPartyAvatar)} alt={c.otherPartyName} />
                    <AvatarFallback className="rounded-xl text-xs font-bold bg-primary/10 text-primary">
                      {getInitials(c.otherPartyName)}
                    </AvatarFallback>
                  </Avatar>
                  {c.isOtherPartyOnline && (
                    <span className="absolute -bottom-0.5 end-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-card" />
                  )}
                </div>

                {/* Conversation Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4
                      className={cn(
                        "text-xs truncate font-semibold",
                        hasUnread ? "text-foreground font-bold" : "text-foreground/90"
                      )}
                    >
                      {c.otherPartyName || t("chat.participant")}
                    </h4>
                    {c.lastMessageAt && (
                      <span className="text-[10px] text-muted-foreground flex-shrink-0 font-medium">
                        {formatChatTimestamp(c.lastMessageAt, t, i18n.language)}
                      </span>
                    )}
                  </div>

                  {/* Last message preview */}
                  <p
                    className={cn(
                      "text-[11px] truncate mt-0.5 leading-relaxed",
                      hasUnread
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground group-hover:text-foreground/80"
                    )}
                  >
                    {c.lastMessage || c.serviceRequestDescription || t("chat.shiftChatInit")}
                  </p>

                  {/* Service Request Tag */}
                  {c.serviceRequestDescription && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-primary/90 bg-primary/10 px-1.5 py-0.5 rounded-md w-fit max-w-[200px] truncate">
                      <Briefcase className="h-2.5 w-2.5 flex-shrink-0" />
                      <span className="truncate font-medium">{c.serviceRequestDescription}</span>
                    </div>
                  )}
                </div>

                {/* Unread badge */}
                {hasUnread && (
                  <Badge className="h-5 px-1.5 text-[10px] bg-primary text-primary-foreground font-bold rounded-full flex-shrink-0 shadow-xs animate-in zoom-in duration-150">
                    {c.unreadCount}
                  </Badge>
                )}
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
