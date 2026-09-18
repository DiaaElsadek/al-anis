import { Calendar, Clock, MessageSquare, FileText } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import CategoryIcon from "@/components/shared/CategoryIcon";
import DirectionalIcon from "@/components/shared/DirectionalIcon";
import EmptyState from "@/components/shared/EmptyState";
import StatusBadge from "@/components/shared/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  formatLocalizedDate,
  formatPrice,
  getInitials,
  getMediaUrl,
  getShiftLabel,
} from "@/lib/utils";

export default function RecentClientRequests({ requests = [], onStartChat, isStartingChat }) {
  const { t, i18n } = useTranslation(["client", "common"]);

  const recentRequests = requests.slice(0, 4);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            {t("client:dashboard.recentRequestsTitle")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("client:dashboard.recentRequestsSubtitle")}
          </p>
        </div>

        {requests.length > 0 && (
          <Button asChild variant="ghost" size="sm" className="text-xs font-semibold">
            <Link to="/app/requests">
              <span>{t("client:dashboard.viewAll")}</span>
              <DirectionalIcon className="h-3.5 w-3.5 ms-1.5" />
            </Link>
          </Button>
        )}
      </div>

      {recentRequests.length === 0 ? (
        <Card className="border-border/70 p-6 shadow-xs">
          <EmptyState
            icon={FileText}
            title={t("client:requests.emptyTitle")}
            description={t("client:requests.emptyDesc")}
            actionLabel={t("client:requests.findProvidersButton")}
            onAction={() => {
              window.location.href = "/app/providers";
            }}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {recentRequests.map((req) => {
            const shiftLabel = getShiftLabel(req.shiftType, t, req.shiftTypeName);

            return (
              <Card
                key={req.id}
                className="border-border/70 hover:border-border shadow-xs hover:shadow-md transition-all duration-200 bg-card p-5 space-y-3.5 rounded-2xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-border/50 pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11 rounded-xl border">
                        <AvatarImage
                          src={getMediaUrl(req.providerAvatar)}
                          alt={req.providerName}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-xl font-bold text-xs bg-primary/10 text-primary">
                          {getInitials(req.providerName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-foreground truncate">
                          {req.providerName}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                          <CategoryIcon
                            icon={req.categoryIcon}
                            name={req.categoryName}
                            className="h-3 w-3 shrink-0"
                          />
                          <span className="truncate">{req.categoryName}</span>
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={req.status} label={req.statusName} />
                  </div>

                  {/* Metadata info */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">
                        {formatLocalizedDate(req.preferredDate, "dd MMM yyyy", i18n.language)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 truncate">
                      <Clock className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                      <span className="truncate capitalize">{shiftLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Price & Action Row */}
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">
                      {t("client:requests.amountLabel")}
                    </span>
                    <span className="font-mono text-sm font-bold text-primary">
                      {req.totalPrice ? formatPrice(req.totalPrice, "EGP", i18n.language) : "-"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2.5 text-xs font-semibold"
                      onClick={() => onStartChat(req.id)}
                      disabled={isStartingChat}
                      title={t("client:requests.chatButton")}
                    >
                      <MessageSquare className="h-3.5 w-3.5 me-1" />
                      <span>{t("common:actions.chat")}</span>
                    </Button>

                    <Button
                      asChild
                      size="sm"
                      variant="secondary"
                      className="h-8 px-2.5 text-xs font-semibold"
                    >
                      <Link to="/app/requests">
                        <span>{t("common:actions.view")}</span>
                        <DirectionalIcon className="h-3 w-3 ms-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

RecentClientRequests.propTypes = {
  requests: PropTypes.array,
  onStartChat: PropTypes.func.isRequired,
  isStartingChat: PropTypes.bool,
};
