import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  Clock,
  DollarSign,
  Star,
  Calendar,
  MapPin,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  User,
  Power,
  MessageSquare,
} from "lucide-react";

import { getProviderDashboard, updateAvailabilityStatus } from "@/api/provider";
import { respondToRequest } from "@/api/requests";
import { createOrGetChat } from "@/api/chat";
import { getMediaUrl, formatPrice, getInitials, formatLocalizedDate } from "@/lib/utils";
import { ShiftTypeLabels } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/shared/StatusBadge";

export default function ProviderDashboardPage() {
  const { t, i18n } = useTranslation(["provider", "common"]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: dashboard, isLoading, refetch } = useQuery({
    queryKey: ["provider-dashboard"],
    queryFn: getProviderDashboard,
    refetchInterval: 15000,
  });

  // Toggle availability switch
  const availMutation = useMutation({
    mutationFn: (newVal) => updateAvailabilityStatus(newVal),
    onSuccess: (_, newVal) => {
      toast.success(
        newVal ? "You are now marked as AVAILABLE!" : "Availability set to OFF."
      );
      queryClient.invalidateQueries(["provider-dashboard"]);
    },
    onError: () => {
      toast.error("Failed to update availability status.");
    },
  });

  // Accept/Reject request mutation
  const respondMutation = useMutation({
    mutationFn: ({ requestId, status, reason }) =>
      respondToRequest(requestId, { status, reason }),
    onSuccess: (_, vars) => {
      toast.success(
        vars.status === 1 ? "Shift request accepted!" : "Request declined."
      );
      queryClient.invalidateQueries(["provider-dashboard"]);
    },
    onError: (error) => {
      toast.error("Action failed", {
        description: error?.response?.data?.message || "Please try again.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const stats = dashboard?.statistics || {};
  const isAvail = dashboard?.isAvailable ?? true;
  const recentRequests = dashboard?.recentRequests || [];
  const upcomingJobs = dashboard?.upcomingJobs || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner with Availability Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white shadow-md">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 rounded-2xl border-2 border-white/20">
            <AvatarImage src={getMediaUrl(dashboard?.profilePicture)} alt={dashboard?.fullName} />
            <AvatarFallback className="rounded-2xl bg-white/10 text-white font-bold text-lg">
              {getInitials(dashboard?.fullName || t("common:roles.provider"))}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold">
                {t("provider:dashboard.title")}, {dashboard?.fullName || t("common:roles.provider")}
              </h1>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-xs text-teal-100/75 mt-0.5">
              {dashboard?.categories?.[0]?.name || t("client:directory.verified")}
            </p>
          </div>
        </div>

        {/* Live Availability Toggle Switch */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15">
          <div className="text-end">
            <span className="block text-[11px] uppercase tracking-wider text-teal-200/80 font-bold">
              {t("provider:dashboard.availabilityStatus")}
            </span>
            <span
              className={`text-xs font-bold ${
                isAvail ? "text-emerald-300" : "text-amber-200"
              }`}
            >
              {isAvail ? t("provider:dashboard.available") : t("provider:dashboard.unavailable")}
            </span>
          </div>

          <Button
            size="sm"
            variant={isAvail ? "default" : "outline"}
            className={`h-9 px-3 rounded-lg text-xs font-semibold ${
              isAvail
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "border-white/30 text-white hover:bg-white/10"
            }`}
            onClick={() => availMutation.mutate(!isAvail)}
            disabled={availMutation.isPending}
          >
            <Power className="h-3.5 w-3.5 me-1.5" />
            {isAvail ? t("provider:dashboard.available") : t("provider:dashboard.unavailable")}
          </Button>
        </div>
      </div>

      {/* 4 Key Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Earnings */}
        <Card className="border-border/70 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{t("provider:dashboard.totalEarnings")}</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-foreground">
                {formatPrice(stats.totalEarnings || 0)}
              </span>
              <span className="text-[11px] text-muted-foreground block mt-0.5">
                {formatPrice(stats.currentMonthEarnings || 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Completed Shifts */}
        <Card className="border-border/70 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{t("provider:dashboard.completedShifts")}</span>
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-foreground">
                {stats.completedJobs || 0}
              </span>
              <span className="text-[11px] text-muted-foreground block mt-0.5">
                {stats.workedDays || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="border-border/70 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{t("provider:dashboard.pendingRequests")}</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-foreground">
                {stats.pendingRequests || 0}
              </span>
              <span className="text-[11px] text-amber-600 font-medium block mt-0.5">
                {stats.pendingRequests > 0 ? t("common:status.pending") : "-"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Client Rating */}
        <Card className="border-border/70 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{t("provider:dashboard.rating")}</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Star className="h-4 w-4 fill-current" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-foreground">
                {stats.averageRating ? stats.averageRating.toFixed(1) : "5.0"}
              </span>
              <span className="text-[11px] text-muted-foreground block mt-0.5">
                {stats.totalReviews || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2-Column Schedule & Urgent Requests Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incoming Shift Requests (Actionable) */}
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">{t("provider:dashboard.urgentRequests")}</CardTitle>
              <CardDescription className="text-xs">
                {t("provider:requests.subtitle")}
              </CardDescription>
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
                      <h4 className="text-xs font-bold text-foreground">
                        {r.clientName}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        {r.categoryName} •{" "}
                        <span className="font-semibold text-primary">
                          {r.shiftTypeName || ShiftTypeLabels[r.shiftType]}
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
                      {formatLocalizedDate(r.preferredDate, "dd/MM/yyyy", i18n.language)}
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
                          respondMutation.mutate({
                            requestId: r.id,
                            status: 4, // Rejected
                            reason: "Schedule unavailable",
                          })
                        }
                        disabled={respondMutation.isPending}
                      >
                        {t("provider:requests.rejectButton")}
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() =>
                          respondMutation.mutate({
                            requestId: r.id,
                            status: 1, // Accepted
                          })
                        }
                        disabled={respondMutation.isPending}
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

        {/* Upcoming Confirmed Jobs */}
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">{t("provider:dashboard.upcomingSchedule")}</CardTitle>
              <CardDescription className="text-xs">
                {t("provider:dashboard.subtitle")}
              </CardDescription>
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
                      <h4 className="text-xs font-bold text-foreground">
                        {job.clientName}
                      </h4>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {job.shiftTypeName || ShiftTypeLabels[job.shiftType]}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {formatLocalizedDate(job.preferredDate, "dd/MM/yyyy", i18n.language)}
                    </span>
                    <span className="truncate max-w-[180px]">
                      {job.address || job.governorate}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
