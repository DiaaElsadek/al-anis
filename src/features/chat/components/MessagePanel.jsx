import { Send, MessageSquare, Check, CheckCheck, Sparkles } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import DirectionalIcon from "@/components/shared/DirectionalIcon";
import EmptyState from "@/components/shared/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials, getMediaUrl } from "@/lib/utils";

export default function MessagePanel({
  activeChat,
  messages,
  messagesLoading,
  messagesEndRef,
  messageText,
  onMessageTextChange,
  onSend,
  isSending,
}) {
  const { t, i18n } = useTranslation("common");

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-background/50">
        <EmptyState
          icon={MessageSquare}
          title={t("chat.noActiveChat")}
          description={t("chat.chooseConversation")}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background/50">
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
                {activeChat.otherPartyName || t("nav.messages")}
              </h3>
              <span
                className={`h-2 w-2 rounded-full ${
                  activeChat.isOtherPartyOnline ? "bg-emerald-500" : "bg-muted-foreground/40"
                }`}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              {activeChat.isOtherPartyOnline ? t("chat.activeNow") : t("chat.offline")} •{" "}
              {t("chat.linkedToRequest")}
            </p>
          </div>
        </div>

        {activeChat.serviceRequestId && (
          <Badge variant="outline" className="text-xs bg-muted/30">
            {t("chat.requestNumber", { id: activeChat.serviceRequestId.slice(0, 8) })}
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
            <p className="font-semibold text-foreground">{t("chat.startConversation")}</p>
            <p>{t("chat.startConversationDesc")}</p>
          </div>
        ) : (
          messages.map((m) => {
            const isMine = m.isMine;

            return (
              <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] sm:max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-sm ${
                    isMine
                      ? "bg-primary text-primary-foreground rounded-ee-none"
                      : "bg-card text-foreground border border-border/80 rounded-es-none"
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
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Compose bar */}
      <form
        onSubmit={onSend}
        className="p-3 sm:p-4 bg-card border-t border-border/70 flex items-center gap-2"
      >
        <Input
          placeholder={t("chat.typeMessage")}
          value={messageText}
          onChange={(e) => onMessageTextChange(e.target.value)}
          className="h-10 text-xs rounded-xl"
        />
        <Button
          type="submit"
          size="icon"
          className="h-10 w-10 rounded-xl shadow-sm flex-shrink-0"
          disabled={!messageText.trim() || isSending}
        >
          <DirectionalIcon icon={Send} className="h-4 w-4" />
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
};
