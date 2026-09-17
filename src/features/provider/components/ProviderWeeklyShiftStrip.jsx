import { addDays, isSameDay, startOfDay } from "date-fns";
import { Calendar, ChevronRight } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatLocalizedDate } from "@/lib/utils";

export default function ProviderWeeklyShiftStrip({ upcomingJobs = [], language }) {
  const { t } = useTranslation(["provider", "common"]);
  const today = startOfDay(new Date());

  // Generate 7 consecutive days starting from today
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  return (
    <Card className="border-border/70 shadow-xs">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-muted text-foreground">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {t("provider:dashboard.weeklyScheduleTitle")}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {t("provider:dashboard.subtitle")}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-xs h-8 gap-1" asChild>
            <Link to="/provider/availability">
              <span>{t("provider:dashboard.manageCalendar")}</span>
              <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </Button>
        </div>

        {/* 7-day strip */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1">
          {days.map((day, idx) => {
            const isCurrentDay = idx === 0;
            const dayJobs = upcomingJobs.filter((job) => {
              if (!job.preferredDate) return false;
              return isSameDay(new Date(job.preferredDate), day);
            });
            const hasShift = dayJobs.length > 0;

            return (
              <div
                key={day.toISOString()}
                className={`flex flex-col items-center justify-between p-2 rounded-xl border text-center transition-colors ${
                  isCurrentDay
                    ? "border-primary/40 bg-primary/5 text-primary"
                    : "border-border/50 bg-background text-foreground"
                }`}
                title={
                  hasShift
                    ? `${dayJobs.length} ${t("provider:dashboard.hasShift")}`
                    : t("provider:dashboard.noShiftsThisDay")
                }
              >
                <span
                  className={`text-[10px] sm:text-xs font-semibold ${
                    isCurrentDay ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {isCurrentDay
                    ? t("common:today", "Today")
                    : formatLocalizedDate(day, "EEE", language)}
                </span>

                <span className="text-sm sm:text-base font-extrabold my-0.5">
                  {formatLocalizedDate(day, "d", language)}
                </span>

                <div className="h-2 flex items-center justify-center">
                  {hasShift ? (
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-primary"
                      aria-label={t("provider:dashboard.hasShift")}
                    />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

ProviderWeeklyShiftStrip.propTypes = {
  upcomingJobs: PropTypes.array,
  language: PropTypes.string.isRequired,
};
