import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Users,
  Briefcase,
  Clock,
  DollarSign,
  Star,
  CheckCircle2,
  Calendar,
  ArrowRight,
  TrendingUp,
  FileCheck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { getDashboardStats, getRecentBookings } from "@/api/admin";
import { formatPrice, formatLocalizedDate } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/shared/StatusBadge";
import DirectionalIcon from "@/components/shared/DirectionalIcon";

// Sample monthly trend data for visual richness
const REVENUE_DATA = [
  { month: "Jan", revenue: 14500, requests: 42 },
  { month: "Feb", revenue: 18200, requests: 56 },
  { month: "Mar", revenue: 23400, requests: 71 },
  { month: "Apr", revenue: 28900, requests: 88 },
  { month: "May", revenue: 35600, requests: 110 },
  { month: "Jun", revenue: 42800, requests: 135 },
];

export default function AdminDashboardPage() {
  const { t, i18n } = useTranslation(["admin", "common"]);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: getDashboardStats,
  });

  const { data: recentBookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["admin-recent-bookings"],
    queryFn: () => getRecentBookings({ limit: 6 }),
  });

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  const statItems = [
    {
      title: t("admin:dashboard.totalRevenue"),
      value: formatPrice(stats?.totalEarnings || 0, i18n.language),
      desc: t("admin:dashboard.revenueDesc"),
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      title: t("admin:dashboard.pendingApplications"),
      value: stats?.pendingApplications || 0,
      desc: t("admin:dashboard.applicationsDesc"),
      icon: FileCheck,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
      link: "/admin/applications",
    },
    {
      title: t("admin:dashboard.totalProviders"),
      value: stats?.totalServiceProviders || 0,
      desc: t("admin:dashboard.providersDesc"),
      icon: Briefcase,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: t("admin:dashboard.completedShifts"),
      value: `${stats?.completedServiceRequests || 0} / ${stats?.totalServiceRequests || 0}`,
      desc: `Avg. Client Rating: ${stats?.averageRating?.toFixed(1) || "4.9"} / 5`,
      icon: CheckCircle2,
      color: "text-teal-600",
      bg: "bg-teal-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("admin:dashboard.title")}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("admin:dashboard.subtitle")}
          </p>
        </div>

        {stats?.pendingApplications > 0 && (
          <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs">
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
                <span className="text-[11px] text-muted-foreground block mt-0.5">
                  {item.desc}
                </span>
              </div>

              {item.link && (
                <Link
                  to={item.link}
                  className="inline-flex items-center text-[11px] font-semibold text-primary hover:underline mt-2"
                >
                  {t("admin:applications.reviewButton")} <DirectionalIcon icon={ArrowRight} className="h-3 w-3 ms-1" />
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Trend */}
        <Card className="lg:col-span-2 border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">{t("admin:dashboard.revenueChartTitle")}</CardTitle>
                <CardDescription className="text-xs">
                  {t("admin:dashboard.revenueChartDesc")}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs text-emerald-600 bg-emerald-500/10 border-emerald-500/20">
                <TrendingUp className="h-3 w-3 me-1" /> +28% MoM
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isDark ? "#2dd4bf" : "#0d9488"} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={isDark ? "#2dd4bf" : "#0d9488"} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "rgba(255, 255, 255, 0.08)" : "#e5e7eb"}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    fontSize={11}
                    stroke={isDark ? "#94a3b8" : "#64748b"}
                  />
                  <YAxis
                    fontSize={11}
                    stroke={isDark ? "#94a3b8" : "#64748b"}
                  />
                  <Tooltip
                    formatter={(val) => [formatPrice(val, i18n.language), t("admin:dashboard.totalRevenue")]}
                    contentStyle={{
                      backgroundColor: isDark ? "#0f172a" : "#ffffff",
                      borderColor: isDark ? "rgba(255, 255, 255, 0.15)" : "#e2e8f0",
                      color: isDark ? "#f8fafc" : "#0f172a",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: isDark
                        ? "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
                        : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={isDark ? "#2dd4bf" : "#0d9488"}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Requests Status Bar Chart */}
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">{t("admin:dashboard.shiftFulfilmentTitle")}</CardTitle>
            <CardDescription className="text-xs">
              {t("admin:dashboard.shiftFulfilmentDesc")}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: t("common:actions.filter"), count: stats?.totalServiceRequests || 15 },
                    { name: t("common:status.completed"), count: stats?.completedServiceRequests || 12 },
                    { name: t("common:status.pending"), count: stats?.pendingApplications || 3 },
                  ]}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "rgba(255, 255, 255, 0.08)" : "#e5e7eb"}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    fontSize={11}
                    stroke={isDark ? "#94a3b8" : "#64748b"}
                  />
                  <YAxis
                    fontSize={11}
                    stroke={isDark ? "#94a3b8" : "#64748b"}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#0f172a" : "#ffffff",
                      borderColor: isDark ? "rgba(255, 255, 255, 0.15)" : "#e2e8f0",
                      color: isDark ? "#f8fafc" : "#0f172a",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: isDark
                        ? "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
                        : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill={isDark ? "#2dd4bf" : "#0f766e"}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Platform Bookings */}
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">{t("admin:dashboard.recentBookings")}</CardTitle>
            <CardDescription className="text-xs">
              {t("admin:payments.subtitle")}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="text-xs" asChild>
            <Link to="/admin/payments">{t("admin:dashboard.viewAllTransactions")}</Link>
          </Button>
        </CardHeader>

        <CardContent>
          {bookingsLoading ? (
            <div className="space-y-2 py-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              {t("common:empty.noResults")}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="py-2.5 font-semibold text-start">{t("admin:pricing.category")}</th>
                    <th className="py-2.5 font-semibold text-start">{t("admin:payments.client")}</th>
                    <th className="py-2.5 font-semibold text-start">{t("admin:payments.provider")}</th>
                    <th className="py-2.5 font-semibold text-start">{t("admin:payments.date")}</th>
                    <th className="py-2.5 font-semibold text-end">{t("admin:payments.amount")}</th>
                    <th className="py-2.5 font-semibold text-end">{t("admin:payments.status")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-semibold text-foreground">
                        {b.categoryName || "Healthcare Shift"}
                      </td>
                      <td className="py-3 text-muted-foreground">{b.userName}</td>
                      <td className="py-3 text-foreground font-medium">{b.providerName}</td>
                      <td className="py-3 text-muted-foreground">
                        {formatLocalizedDate(b.date, "PP", i18n.language)}
                      </td>
                      <td className="py-3 text-end font-bold text-foreground">
                        {formatPrice(b.amount, i18n.language)}
                      </td>
                      <td className="py-3 text-end">
                        <StatusBadge status={b.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
