import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { getProviderDashboard, updateAvailabilityStatus } from "@/api/provider";
import { respondToRequest } from "@/api/requests";
import DashboardSkeleton from "@/components/shared/DashboardSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import ProviderStatsGrid from "@/features/provider/components/ProviderStatsGrid";
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
      toast.success(newVal ? "You are now marked as AVAILABLE!" : "Availability set to OFF.");
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
    <div className="space-y-8">
      {/* Welcome Banner with Availability Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white shadow-md">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 rounded-2xl border-2 border-white/20">
            <AvatarImage src={getMediaUrl(avatarUrl)} alt={displayName} />
            <AvatarFallback className="rounded-2xl bg-white/10 text-white font-bold text-lg">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold">
                {t("provider:dashboard.title")}, {displayName}
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
              className={`text-xs font-bold ${isAvail ? "text-emerald-300" : "text-amber-200"}`}
            >
              {isAvail ? t("provider:dashboard.available") : t("provider:dashboard.unavailable")}
            </span>
          </div>

          <Switch
            checked={isAvail}
            onCheckedChange={(checked) => availMutation.mutate(checked)}
            disabled={availMutation.isPending}
            className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-white/20 border-white/20"
            aria-label={t("provider:dashboard.availabilityStatus")}
          />
        </div>
      </div>

      {/* 4 Key Statistics Cards */}
      <ProviderStatsGrid stats={stats} />

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
