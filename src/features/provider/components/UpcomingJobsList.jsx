import { Calendar } from "lucide-react";
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
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold">
            {t("provider:dashboard.upcomingSchedule")}
          </CardTitle>
          <CardDescription className="text-xs">{t("provider:dashboard.subtitle")}</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-xs" asChild>
          <Link to="/provider/availability">{t("provider:dashboard.manageCalendar")}</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {upcomingJobs.length === 0 ? (
          <div className="text-center py-10 text-xs text-muted-foreground">
            {t("provider:dashboard.noUpcomingShifts")}
          </div>
        ) : (
          upcomingJobs.slice(0, 3).map((job) => (
            <div
              key={job.id}
              className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <h4 className="text-xs font-bold text-foreground">{job.clientName}</h4>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {getShiftLabel(job.shiftType, t, job.shiftTypeName)}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  {formatLocalizedDate(job.preferredDate, "dd/MM/yyyy", language)}
                </span>
                <span className="truncate max-w-[180px]">{job.address || job.governorate}</span>
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
