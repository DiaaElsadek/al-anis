import { Calendar, Clock, MapPin } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatLocalizedDate, formatPrice, getShiftLabel } from "@/lib/utils";

export default function RecentRequestsList({ recentRequests, onRespond, isResponding, language }) {
  const { t } = useTranslation(["provider", "common"]);

  return (
    <Card className="border-border/70 shadow-xs">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-foreground">
            {t("provider:dashboard.pendingRequestsTitle")}
          </CardTitle>
          <CardDescription className="text-xs">{t("provider:requests.subtitle")}</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-xs h-8" asChild>
          <Link to="/provider/requests">{t("common:viewAll")}</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {recentRequests.length === 0 ? (
          <div className="text-center py-10 text-xs text-muted-foreground">
            {t("provider:dashboard.noUrgentRequests")}
          </div>
        ) : (
          recentRequests.slice(0, 3).map((r) => {
            // Strictly derived rule: does the shift start within the next 24 hours?
            let isWithin24Hours = false;
            if (r.preferredDate) {
              const diffHours =
                (new Date(r.preferredDate).getTime() - Date.now()) / (1000 * 60 * 60);
              isWithin24Hours = diffHours >= 0 && diffHours <= 24;
            }

            return (
              <div
                key={r.id}
                className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-foreground">{r.clientName}</h4>
                      {isWithin24Hours && (
                        <Badge
                          variant="outline"
                          className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 border-amber-500/30 bg-amber-500/10 gap-1 px-1.5 py-0"
                        >
                          <Clock className="h-2.5 w-2.5" />
                          <span>{t("provider:dashboard.within24Hours")}</span>
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {r.categoryName} •{" "}
                      <span className="font-semibold text-primary">
                        {getShiftLabel(r.shiftType, t, r.shiftTypeName)}
                      </span>
                    </p>
                  </div>

                  <span className="font-bold text-xs text-foreground shrink-0">
                    {r.price ? formatPrice(r.price) : "—"}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-primary shrink-0" />
                    {formatLocalizedDate(r.preferredDate, "dd/MM/yyyy", language)}
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3 text-primary shrink-0" />
                    <span className="truncate">{r.address || r.governorate}</span>
                  </span>
                </div>

                {/* Accept / Decline actions */}
                {r.status === 0 && (
                  <div className="flex justify-end gap-2 pt-1 border-t border-border/40">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs text-destructive hover:bg-destructive/10"
                      onClick={() =>
                        onRespond({
                          requestId: r.id,
                          status: 4, // Rejected
                          reason: "Schedule unavailable",
                        })
                      }
                      disabled={isResponding}
                    >
                      {t("provider:requests.rejectButton")}
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() =>
                        onRespond({
                          requestId: r.id,
                          status: 1, // Accepted
                        })
                      }
                      disabled={isResponding}
                    >
                      {t("provider:requests.acceptButton")}
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

RecentRequestsList.propTypes = {
  recentRequests: PropTypes.array.isRequired,
  onRespond: PropTypes.func.isRequired,
  isResponding: PropTypes.bool,
  language: PropTypes.string.isRequired,
};
