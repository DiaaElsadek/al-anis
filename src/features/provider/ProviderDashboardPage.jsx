import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, MapPin, Star, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { getProviderDashboard, updateAvailabilityStatus } from "@/api/provider";
import { respondToRequest } from "@/api/requests";
import DashboardSkeleton from "@/components/shared/DashboardSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import ProviderStatsGrid from "@/features/provider/components/ProviderStatsGrid";
import ProviderWeeklyShiftStrip from "@/features/provider/components/ProviderWeeklyShiftStrip";
import RecentRequestsList from "@/features/provider/components/RecentRequestsList";
import UpcomingJobsList from "@/features/provider/components/UpcomingJobsList";
import { useAuth } from "@/hooks/useAuth";
import { getInitials, getMediaUrl, handleMutationError } from "@/lib/utils";

export default function ProviderDashboardPage() {
  const { t, i18n } = useTranslation(["provider", "common"]);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["provider-dashboard"],
    queryFn: getProviderDashboard,
    refetchInterval: 15000,
  });

  // Toggle availability switch
  const availMutation = useMutation({
    mutationFn: (newVal) => updateAvailabilityStatus(newVal),
    onSuccess: (_, newVal) => {
      toast.success(
        newVal
          ? t("provider:dashboard.availableSubtext")
          : t("provider:dashboard.unavailableSubtext")
      );
      queryClient.invalidateQueries(["provider-dashboard"]);
    },
    onError: (error) => handleMutationError(error, t),
  });

  // Accept/Reject request mutation
  const respondMutation = useMutation({
    mutationFn: ({ requestId, status, reason }) => respondToRequest(requestId, { status, reason }),
    onSuccess: (_, vars) => {
      toast.success(vars.status === 1 ? "Shift request accepted!" : "Request declined.");
      queryClient.invalidateQueries(["provider-dashboard"]);
    },
    onError: (error) => handleMutationError(error, t),
  });

  if (isLoading) {
    return <DashboardSkeleton cards={4} />;
  }

  const stats = dashboard?.statistics || {};
  const isAvail = dashboard?.isAvailable ?? true;
  const recentRequests = dashboard?.recentRequests || [];
  const upcomingJobs = dashboard?.upcomingJobs || [];
  const displayName =
    dashboard?.fullName || user?.fullName || user?.name || t("common:roles.provider");
  const avatarUrl = dashboard?.profilePicture || user?.profilePicture || user?.profilePictureUrl;

  return (
    <div className="space-y-6">
      {/* Hero Command Banner with Availability Switch & Factual Identity */}
      <div className="rounded-2xl bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 rounded-2xl border border-white/20">
              <AvatarImage src={getMediaUrl(avatarUrl)} alt={displayName} />
              <AvatarFallback className="rounded-2xl bg-white/10 text-white font-bold text-lg">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">
                {t("provider:dashboard.title")}, {displayName}
              </h1>
              <div className="flex items-center flex-wrap gap-2 mt-1 text-xs text-teal-100/90">
                {stats.averageRating ? (
                  <span className="flex items-center gap-1 font-semibold text-amber-300">
                    <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                    {stats.averageRating.toFixed(1)}
                  </span>
                ) : null}
                {stats.completedJobs != null && stats.completedJobs > 0 ? (
                  <span className="text-teal-200/90">
                    {stats.averageRating ? "·" : ""} {stats.completedJobs}{" "}
                    {t("provider:dashboard.completedShifts").toLowerCase()}
                  </span>
                ) : null}
                {dashboard?.categories?.[0]?.name ? (
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-[11px] font-medium text-teal-100 border border-white/10">
                    {dashboard.categories[0].name}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Live Availability Toggle Switch */}
          <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-xl border border-white/15 shrink-0">
            <div className="text-end">
              <div className="flex items-center gap-1.5 justify-end">
                <span
                  className={`h-2 w-2 rounded-full transition-colors ${
                    isAvail ? "bg-emerald-400" : "bg-amber-300"
                  }`}
                  aria-hidden="true"
                />
                <span className="text-[11px] font-semibold text-teal-200/80">
                  {t("provider:dashboard.availabilityStatus")}
                </span>
              </div>
              <span
                className={`text-xs font-bold block ${
                  isAvail ? "text-emerald-300" : "text-amber-200"
                }`}
              >
                {isAvail ? t("provider:dashboard.available") : t("provider:dashboard.unavailable")}
              </span>
            </div>

            <Switch
              checked={isAvail}
              onCheckedChange={(checked) => availMutation.mutate(checked)}
              disabled={availMutation.isPending}
              className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-white/20 border-white/20"
              thumbClassName="bg-white shadow-xs"
              aria-label={t("provider:dashboard.availabilityStatus")}
            />
          </div>
        </div>

        {/* Status explanation & Quick Navigation Chips */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-teal-100/80">
          <p className="text-[11px]">
            {isAvail
              ? t("provider:dashboard.availableSubtext")
              : t("provider:dashboard.unavailableSubtext")}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-white hover:bg-white/15 px-2.5 gap-1"
              asChild
            >
              <Link to="/provider/availability">
                <Calendar className="h-3 w-3" />
                <span>{t("provider:dashboard.manageCalendar")}</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-white hover:bg-white/15 px-2.5 gap-1"
              asChild
            >
              <Link to="/provider/working-areas">
                <MapPin className="h-3 w-3" />
                <span>{t("provider:dashboard.workingAreas")}</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-white hover:bg-white/15 px-2.5 gap-1"
              asChild
            >
              <Link to="/provider/profile">
                <User className="h-3 w-3" />
                <span>{t("provider:dashboard.profile")}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Key Statistics Cards */}
      <ProviderStatsGrid stats={stats} />

      {/* 7-Day Situational Awareness Strip */}
      <ProviderWeeklyShiftStrip upcomingJobs={upcomingJobs} language={i18n.language} />

      {/* 2-Column Schedule & Urgent Requests Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentRequestsList
          recentRequests={recentRequests}
          onRespond={(vars) => respondMutation.mutate(vars)}
          isResponding={respondMutation.isPending}
          language={i18n.language}
        />

        <UpcomingJobsList upcomingJobs={upcomingJobs} language={i18n.language} />
      </div>
    </div>
  );
}
