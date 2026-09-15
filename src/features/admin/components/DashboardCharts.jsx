import { TrendingUp } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
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

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

// Monthly trend data for visual dashboard richness
const REVENUE_DATA = [
  { month: "Jan", revenue: 14500, requests: 42 },
  { month: "Feb", revenue: 18200, requests: 56 },
  { month: "Mar", revenue: 23400, requests: 71 },
  { month: "Apr", revenue: 28900, requests: 88 },
  { month: "May", revenue: 35600, requests: 110 },
  { month: "Jun", revenue: 42800, requests: 135 },
];

export default function DashboardCharts({ isDark, stats, language }) {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Growth Trend */}
      <Card className="lg:col-span-2 border-border/70 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">
                {t("admin:dashboard.revenueChartTitle")}
              </CardTitle>
              <CardDescription className="text-xs">
                {t("admin:dashboard.revenueChartDesc")}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="text-xs text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
            >
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
                    <stop
                      offset="5%"
                      stopColor={isDark ? "#2dd4bf" : "#0d9488"}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor={isDark ? "#2dd4bf" : "#0d9488"}
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "rgba(255, 255, 255, 0.08)" : "#e5e7eb"}
                  vertical={false}
                />
                <XAxis dataKey="month" fontSize={11} stroke={isDark ? "#94a3b8" : "#64748b"} />
                <YAxis fontSize={11} stroke={isDark ? "#94a3b8" : "#64748b"} />
                <Tooltip
                  formatter={(val) => [
                    formatPrice(val, "EGP", language),
                    t("admin:dashboard.totalRevenue"),
                  ]}
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
          <CardTitle className="text-base font-bold">
            {t("admin:dashboard.shiftFulfilmentTitle")}
          </CardTitle>
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
                  {
                    name: t("common:status.completed"),
                    count: stats?.completedServiceRequests || 12,
                  },
                  { name: t("common:status.pending"), count: stats?.pendingApplications || 3 },
                ]}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "rgba(255, 255, 255, 0.08)" : "#e5e7eb"}
                  vertical={false}
                />
                <XAxis dataKey="name" fontSize={11} stroke={isDark ? "#94a3b8" : "#64748b"} />
                <YAxis fontSize={11} stroke={isDark ? "#94a3b8" : "#64748b"} />
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
                <Bar dataKey="count" fill={isDark ? "#2dd4bf" : "#0f766e"} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

DashboardCharts.propTypes = {
  isDark: PropTypes.bool.isRequired,
  stats: PropTypes.object,
  language: PropTypes.string.isRequired,
};
