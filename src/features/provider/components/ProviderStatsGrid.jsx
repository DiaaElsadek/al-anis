import { CheckCircle2, Clock, DollarSign, Star } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

export default function ProviderStatsGrid({ stats }) {
  const { t } = useTranslation(["provider", "common"]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Earnings */}
      <Card className="border-border/70 shadow-xs">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {t("provider:dashboard.totalEarnings")}
            </span>
            <div className="p-2 rounded-lg bg-muted text-foreground">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-foreground tracking-tight">
              {formatPrice(stats.totalEarnings || 0)}
            </span>
            <span className="text-[11px] text-muted-foreground block mt-1">
              {t("provider:dashboard.thisMonth", {
                amount: formatPrice(stats.currentMonthEarnings || 0),
              })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Completed Shifts */}
      <Card className="border-border/70 shadow-xs">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {t("provider:dashboard.completedShifts")}
            </span>
            <div className="p-2 rounded-lg bg-muted text-foreground">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-foreground tracking-tight">
              {stats.completedJobs || 0}
            </span>
            <span className="text-[11px] text-muted-foreground block mt-1">
              {t("provider:dashboard.daysWorked", { count: stats.workedDays || 0 })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      <Card className="border-border/70 shadow-xs">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {t("provider:dashboard.pendingRequests")}
            </span>
            <div className="p-2 rounded-lg bg-muted text-foreground">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-foreground tracking-tight">
              {stats.pendingRequests || 0}
            </span>
            <span
              className={`text-[11px] font-medium block mt-1 ${
                stats.pendingRequests > 0
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground"
              }`}
            >
              {stats.pendingRequests > 0
                ? t("provider:dashboard.awaitingAction", { count: stats.pendingRequests })
                : t("provider:dashboard.upToDate")}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Client Rating */}
      <Card className="border-border/70 shadow-xs">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {t("provider:dashboard.rating")}
            </span>
            <div className="p-2 rounded-lg bg-muted text-amber-500">
              <Star className="h-4 w-4 fill-current" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-foreground tracking-tight">
              {stats.averageRating ? stats.averageRating.toFixed(1) : "—"}
            </span>
            <span className="text-[11px] text-muted-foreground block mt-1">
              {t("provider:dashboard.fromReviews", { count: stats.totalReviews || 0 })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

ProviderStatsGrid.propTypes = {
  stats: PropTypes.object.isRequired,
};
