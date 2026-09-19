import { useQuery } from "@tanstack/react-query";
import { Briefcase, Clock, DollarSign, CheckCircle2, FileCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { getDashboardStats, getRecentBookings } from "@/api/admin";
import DashboardSkeleton from "@/components/shared/DashboardSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RecentBookingsList from "@/features/admin/components/RecentBookingsList";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { t, i18n } = useTranslation(["admin", "common"]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: getDashboardStats,
  });

  const { data: recentBookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["admin-recent-bookings"],
    queryFn: () => getRecentBookings({ limit: 10 }),
  });

  if (statsLoading) {
    return <DashboardSkeleton cards={4} />;
  }

  const statItems = [
    {
      title: t("admin:dashboard.totalRevenue"),
      value: formatPrice(stats?.totalEarnings || 0, "EGP", i18n.language),
      desc: t("admin:dashboard.revenueDesc"),
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      link: "/admin/payments",
      linkLabel: t("admin:dashboard.viewAllTransactions"),
    },
    {
      title: t("admin:dashboard.pendingApplications"),
      value: stats?.pendingApplications || 0,
      desc: t("admin:dashboard.applicationsDesc"),
      icon: FileCheck,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
      link: "/admin/applications",
      linkLabel: t("admin:applications.reviewButton"),
    },
    {
      title: t("admin:dashboard.totalProviders"),
      value: stats?.totalServiceProviders || 0,
      desc: t("admin:dashboard.providersDesc"),
      icon: Briefcase,
      color: "text-primary",
      bg: "bg-primary/10",
      link: "/admin/users",
      linkLabel: t("admin:users.title"),
    },
    {
      title: t("admin:dashboard.completedShifts"),
      value: `${stats?.completedServiceRequests || 0} / ${stats?.totalServiceRequests || 0}`,
      desc: t("admin:dashboard.completedShiftsDesc"),
      icon: CheckCircle2,
      color: "text-teal-600",
      bg: "bg-teal-500/10",
      link: "/admin/payments",
      linkLabel: t("admin:dashboard.viewAllTransactions"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("admin:dashboard.title")}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{t("admin:dashboard.subtitle")}</p>
        </div>

        {stats?.pendingApplications > 0 && (
          <Button
            asChild
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs"
          >
            <Link to="/admin/applications">
              <Clock className="h-4 w-4 me-1.5" />
              {t("admin:applications.tabs.pending", { count: stats.pendingApplications })}
            </Link>
          </Button>
        )}
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, i) => (
          <Card key={i} className="border-border/70 shadow-sm relative overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{item.title}</span>
                <div className={`p-2 rounded-xl ${item.bg} ${item.color}`}>
                  <item.icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-3">
                <span className="text-2xl font-extrabold text-foreground">{item.value}</span>
                <span className="text-[11px] text-muted-foreground block mt-0.5">{item.desc}</span>
              </div>

              {item.link && (
                <Link
                  to={item.link}
                  className="inline-flex items-center text-[11px] font-semibold text-primary hover:underline mt-2"
                >
                  {item.linkLabel || t("admin:applications.reviewButton")}
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Platform Bookings */}
      <RecentBookingsList
        recentBookings={recentBookings}
        bookingsLoading={bookingsLoading}
        language={i18n.language}
      />
    </div>
  );
}
