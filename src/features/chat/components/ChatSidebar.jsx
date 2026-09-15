import { MessageSquare, Search, AlertCircle } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import EmptyState from "@/components/shared/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials, getMediaUrl } from "@/lib/utils";

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

  const filteredChats = chats.filter((c) =>
    (c.otherPartyName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full sm:w-80 md:w-96 flex flex-col border-e border-border/70 bg-card">
      {/* Top search & title */}
      <div className="p-4 border-b border-border/60 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">{t("chat.directMessages")}</h2>
          <Badge variant="outline" className="text-[11px] font-mono">
            {t("chat.threads", { count: chats.length })}
          </Badge>
        </div>

        <div className="relative">
          <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("chat.searchConversations")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
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
          <div className="text-center py-12 px-4 text-xs text-muted-foreground space-y-1">
            <MessageSquare className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="font-semibold text-foreground">{t("chat.noConversations")}</p>
            <p>{t("chat.noConversationsDesc")}</p>
          </div>
        ) : (
          filteredChats.map((c) => {
            const isSelected = c.id === activeChatId;

            return (
              <button
                key={c.id}
                onClick={() => onSelectChat(c.id)}
                className={`w-full p-3.5 flex items-start gap-3 text-start transition-colors ${
                  isSelected ? "bg-primary/10 border-s-4 border-s-primary" : "hover:bg-muted/40"
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
                    <span className="absolute -bottom-0.5 end-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-foreground truncate">
                      {c.otherPartyName || t("chat.participant")}
                    </h4>
                    {c.lastMessageAt && (
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(c.lastMessageAt).toLocaleTimeString(
                          i18n.language === "ar" ? "ar-EG" : "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {c.lastMessage || c.serviceRequestDescription || t("chat.shiftChatInit")}
                  </p>

                  {c.serviceRequestDescription && (
                    <span className="inline-block text-[10px] text-teal-700 dark:text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded mt-1 font-medium truncate max-w-[170px]">
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
