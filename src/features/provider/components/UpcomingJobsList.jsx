import { MapPin, Plus } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatLocalizedDate, getShiftLabel } from "@/lib/utils";

export default function UpcomingJobsList({ upcomingJobs, language }) {
  const { t } = useTranslation(["provider", "common"]);

  return (
    <Card className="border-border/70 shadow-xs">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-foreground">
            {t("provider:dashboard.upcomingSchedule")}
          </CardTitle>
          <CardDescription className="text-xs">{t("provider:dashboard.subtitle")}</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-xs h-8" asChild>
          <Link to="/provider/availability">{t("provider:dashboard.manageCalendar")}</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {upcomingJobs.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-xs text-muted-foreground">
              {t("provider:dashboard.noUpcomingShifts")}
            </p>
            <Button variant="outline" size="sm" className="text-xs gap-1.5 h-8" asChild>
              <Link to="/provider/availability">
                <Plus className="h-3.5 w-3.5" />
                <span>{t("provider:dashboard.openAvailability")}</span>
              </Link>
            </Button>
          </div>
        ) : (
          upcomingJobs.slice(0, 3).map((job) => (
            <div
              key={job.id}
              className="p-3 rounded-xl border border-border/60 bg-muted/20 flex items-center gap-3.5"
            >
              {/* Calendar Tile */}
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-primary/10 text-primary min-w-[52px] shrink-0 border border-primary/20 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {formatLocalizedDate(job.preferredDate, "EEE", language)}
                </span>
                <span className="text-base font-extrabold leading-tight">
                  {formatLocalizedDate(job.preferredDate, "d", language)}
                </span>
              </div>

              {/* Job Details */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-foreground truncate">{job.clientName}</h4>
                  <Badge variant="outline" className="text-[10px] shrink-0">
                    {getShiftLabel(job.shiftType, t, job.shiftTypeName)}
                  </Badge>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{job.address || job.governorate}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

UpcomingJobsList.propTypes = {
  upcomingJobs: PropTypes.array.isRequired,
  language: PropTypes.string.isRequired,
};
