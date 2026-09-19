import { Activity, Calendar, CheckCircle2, MessageSquare } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientStatsGrid({ requests = [], chatsCount = 0, isLoading = false }) {
  const { t } = useTranslation(["client", "common"]);

  const activeCount = requests.filter(
    (r) =>
      r.status === 1 ||
      r.status === 2 ||
      r.statusName?.toLowerCase().includes("accept") ||
      r.statusName?.toLowerCase().includes("progress")
  ).length;

  const completedCount = requests.filter(
    (r) => r.status === 3 || r.statusName?.toLowerCase().includes("complete")
  ).length;

  const totalRequests = requests.length;

  const statCards = [
    {
      title: t("client:dashboard.stats.activeShifts"),
      value: activeCount,
      desc: t("client:dashboard.stats.activeShiftsDesc"),
      icon: Activity,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      link: "/app/requests",
    },
    {
      title: t("client:dashboard.stats.totalRequests"),
      value: totalRequests,
      desc: t("client:dashboard.stats.totalRequestsDesc"),
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      link: "/app/requests",
    },
    {
      title: t("client:dashboard.stats.completedShifts"),
      value: completedCount,
      desc: t("client:dashboard.stats.completedShiftsDesc"),
      icon: CheckCircle2,
      color: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-500/10",
      border: "border-teal-500/20",
      link: "/app/requests",
    },
    {
      title: t("client:dashboard.stats.conversations"),
      value: chatsCount,
      desc: t("client:dashboard.stats.conversationsDesc"),
      icon: MessageSquare,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      link: "/app/chats",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-5 border-border/70 shadow-xs">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-14 mt-4" />
            <Skeleton className="h-3 w-28 mt-2" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statCards.map((stat, idx) => (
        <Card
          key={idx}
          className="border-border/70 shadow-xs hover:shadow-md hover:border-border transition-all duration-200 group bg-card overflow-hidden"
        >
          <Link to={stat.link} className="block p-4 sm:p-5 h-full">
            <CardContent className="p-0 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground line-clamp-1">
                  {stat.title}
                </span>
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color} border ${stat.border}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight block">
                  {stat.value}
                </span>
                <span className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1 block">
                  {stat.desc}
                </span>
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}

ClientStatsGrid.propTypes = {
  requests: PropTypes.array,
  chatsCount: PropTypes.number,
  isLoading: PropTypes.bool,
};
