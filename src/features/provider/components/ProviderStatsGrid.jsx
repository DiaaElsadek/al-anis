import { CheckCircle2, Clock, DollarSign, Star } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

export default function ProviderStatsGrid({ stats }) {
  const { t, i18n } = useTranslation(["provider", "common"]);
  const isAr = i18n.language === "ar";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Earnings */}
      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {t("provider:dashboard.totalEarnings")}
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-foreground">
              {formatPrice(stats.totalEarnings || 0)}
            </span>
            <span className="text-[11px] text-muted-foreground block mt-0.5">
              {isAr
                ? `هذا الشهر: ${formatPrice(stats.currentMonthEarnings || 0)}`
                : `This month: ${formatPrice(stats.currentMonthEarnings || 0)}`}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Completed Shifts */}
      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {t("provider:dashboard.completedShifts")}
            </span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-foreground">
              {stats.completedJobs || 0}
            </span>
            <span className="text-[11px] text-muted-foreground block mt-0.5">
              {stats.workedDays || 0} {isAr ? "أيام عمل" : "days worked"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {t("provider:dashboard.pendingRequests")}
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-foreground">
              {stats.pendingRequests || 0}
            </span>
            <span className="text-[11px] text-amber-600 font-medium block mt-0.5">
              {stats.pendingRequests > 0
                ? isAr
                  ? `${stats.pendingRequests} بانتظار الإجراء`
                  : `${stats.pendingRequests} awaiting action`
                : isAr
                  ? "لا توجد طلبات معلقة"
                  : "Up to date"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Client Rating */}
      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {t("provider:dashboard.rating")}
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Star className="h-4 w-4 fill-current" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-foreground">
              {stats.averageRating ? stats.averageRating.toFixed(1) : "—"}
            </span>
            <span className="text-[11px] text-muted-foreground block mt-0.5">
              {isAr
                ? `من ${stats.totalReviews || 0} تقييم`
                : `from ${stats.totalReviews || 0} reviews`}
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
