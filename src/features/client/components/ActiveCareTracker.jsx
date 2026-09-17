import { Calendar, Clock, MapPin, MessageSquare, Sparkles } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import CategoryIcon from "@/components/shared/CategoryIcon";
import DirectionalIcon from "@/components/shared/DirectionalIcon";
import StatusBadge from "@/components/shared/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  formatLocalizedDate,
  formatPrice,
  getInitials,
  getMediaUrl,
  getShiftLabel,
} from "@/lib/utils";

export default function ActiveCareTracker({ activeRequest, onStartChat, isStartingChat }) {
  const { t, i18n } = useTranslation(["client", "common"]);

  if (!activeRequest) {
    return (
      <Card className="border-border/70 shadow-xs bg-gradient-to-r from-teal-500/5 via-emerald-500/5 to-transparent p-5 sm:p-6 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {t("client:dashboard.noActiveCareTitle")}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
                {t("client:dashboard.noActiveCareDesc")}
              </p>
            </div>
          </div>

          <Button asChild size="sm" className="font-semibold shadow-sm shrink-0">
            <Link to="/app/providers">
              <span>{t("client:dashboard.quickBook")}</span>
              <DirectionalIcon className="h-3.5 w-3.5 ms-1.5" />
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  const shiftLabel = getShiftLabel(activeRequest.shiftType, t, activeRequest.shiftTypeName);

  return (
    <Card className="border-teal-500/30 shadow-md bg-card overflow-hidden rounded-2xl relative">
      {/* Top status band */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />

      <div className="p-5 sm:p-6 space-y-4">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {t("client:dashboard.activeCareTitle")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={activeRequest.status} label={activeRequest.statusName} />
            {activeRequest.totalPrice ? (
              <span className="font-mono text-sm font-bold text-primary">
                {formatPrice(activeRequest.totalPrice, "EGP", i18n.language)}
              </span>
            ) : null}
          </div>
        </div>

        {/* Caregiver Profile Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 rounded-2xl ring-2 ring-primary/20 shadow-sm border">
              <AvatarImage
                src={getMediaUrl(activeRequest.providerAvatar)}
                alt={activeRequest.providerName}
                className="object-cover"
              />
              <AvatarFallback className="rounded-2xl font-bold text-sm bg-primary/10 text-primary">
                {getInitials(activeRequest.providerName)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-base text-foreground">
                  {activeRequest.providerName}
                </h4>
                <Badge variant="secondary" className="text-[10px] px-2 py-0 font-medium">
                  <CategoryIcon
                    icon={activeRequest.categoryIcon}
                    name={activeRequest.categoryName}
                    className="h-3 w-3 me-1"
                  />
                  <span>{activeRequest.categoryName}</span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{t("client:profile.reviewedByTeam")}</p>
            </div>
          </div>

          {/* Quick Chat / Details CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-semibold h-9"
              onClick={() => onStartChat(activeRequest.id)}
              disabled={isStartingChat}
            >
              <MessageSquare className="h-3.5 w-3.5 me-1.5 text-primary" />
              <span>{t("client:requests.chatButton")}</span>
            </Button>

            <Button asChild size="sm" className="text-xs font-semibold h-9 shadow-xs">
              <Link to="/app/requests">
                <span>{t("common:actions.view")}</span>
                <DirectionalIcon className="h-3.5 w-3.5 ms-1.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Shift Details Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-muted/20 border border-border/50 rounded-xl text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="font-medium text-foreground">
              {formatLocalizedDate(activeRequest.preferredDate, "dd MMMM yyyy", i18n.language)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-teal-600 shrink-0" />
            <span className="font-medium text-foreground capitalize">{shiftLabel}</span>
          </div>

          <div className="flex items-center gap-2 truncate">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">{activeRequest.address || activeRequest.governorate}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

ActiveCareTracker.propTypes = {
  activeRequest: PropTypes.object,
  onStartChat: PropTypes.func.isRequired,
  isStartingChat: PropTypes.bool,
};
