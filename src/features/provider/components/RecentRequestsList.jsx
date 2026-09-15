import { Calendar, MapPin } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatLocalizedDate, formatPrice, getShiftLabel } from "@/lib/utils";

export default function RecentRequestsList({ recentRequests, onRespond, isResponding, language }) {
  const { t } = useTranslation(["provider", "common"]);

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold">
            {t("provider:dashboard.urgentRequests")}
          </CardTitle>
          <CardDescription className="text-xs">{t("provider:requests.subtitle")}</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-xs" asChild>
          <Link to="/provider/requests">{t("common:viewAll")}</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {recentRequests.length === 0 ? (
          <div className="text-center py-10 text-xs text-muted-foreground">
            {t("provider:dashboard.noUrgentRequests")}
          </div>
        ) : (
          recentRequests.slice(0, 3).map((r) => (
            <div
              key={r.id}
              className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground">{r.clientName}</h4>
                  <p className="text-[11px] text-muted-foreground">
                    {r.categoryName} •{" "}
                    <span className="font-semibold text-primary">
                      {getShiftLabel(r.shiftType, t, r.shiftTypeName)}
                    </span>
                  </p>
                </div>

                <span className="font-bold text-xs text-foreground">
                  {r.price ? formatPrice(r.price) : "-"}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-primary" />
                  {formatLocalizedDate(r.preferredDate, "dd/MM/yyyy", language)}
                </span>
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
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
          ))
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
