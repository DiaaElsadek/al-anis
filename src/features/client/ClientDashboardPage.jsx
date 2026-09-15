import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { getActiveCategories } from "@/api/category";
import { getMyChats } from "@/api/chat";
import { getUserRequests } from "@/api/requests";
import { getUserProfile } from "@/api/user";
import DashboardSkeleton from "@/components/shared/DashboardSkeleton";
import EmptyState from "@/components/shared/EmptyState";
import ActiveCareTracker from "@/features/client/components/ActiveCareTracker";
import ClientSpecialtiesGrid from "@/features/client/components/ClientSpecialtiesGrid";
import ClientStatsGrid from "@/features/client/components/ClientStatsGrid";
import ClientTrustCard from "@/features/client/components/ClientTrustCard";
import ClientWelcomeBanner from "@/features/client/components/ClientWelcomeBanner";
import RecentClientRequests from "@/features/client/components/RecentClientRequests";
import { useAuth } from "@/hooks/useAuth";
import { useChatNavigation } from "@/hooks/useChatNavigation";

export default function ClientDashboardPage() {
  const { t } = useTranslation(["client", "common"]);
  const { user } = useAuth();
  const { startChat, isStartingChat } = useChatNavigation();

  // 1. Fetch user profile from API (supplements auth context)
  const {
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000,
  });

  // 2. Fetch user's booking requests
  const {
    data: requests = [],
    isLoading: requestsLoading,
    isError: requestsError,
    refetch: refetchRequests,
  } = useQuery({
    queryKey: ["user-requests"],
    queryFn: getUserRequests,
    refetchInterval: 15000,
  });

  // 3. Fetch active chat conversations
  const { data: chats = [], refetch: refetchChats } = useQuery({
    queryKey: ["my-chats"],
    queryFn: getMyChats,
    refetchInterval: 10000,
  });

  // 4. Fetch active categories for fast booking shortcuts
  const { data: categories = [] } = useQuery({
    queryKey: ["active-categories"],
    queryFn: getActiveCategories,
    staleTime: 10 * 60 * 1000,
  });

  // Find the primary ongoing or accepted request for active care tracker
  const activeRequest = useMemo(() => {
    if (!Array.isArray(requests)) return null;
    return (
      requests.find(
        (r) =>
          r.status === 2 || // In Progress
          r.statusName?.toLowerCase().includes("progress")
      ) ||
      requests.find(
        (r) =>
          r.status === 1 || // Accepted
          r.statusName?.toLowerCase().includes("accept")
      ) ||
      null
    );
  }, [requests]);

  const isLoading = (profileLoading && !user) || requestsLoading;
  const isError = profileError && requestsError && !user;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title={t("common:error")}
        description={t("common:empty.tryAdjusting")}
        actionLabel={t("common:actions.retry")}
        onAction={() => {
          refetchProfile();
          refetchRequests();
          refetchChats();
        }}
      />
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Personalized Hero Greeting Banner */}
      <ClientWelcomeBanner user={user} profile={profileData} />

      {/* 2. Responsive 4-card KPI Metric Grid */}
      <ClientStatsGrid requests={requests} chatsCount={chats.length} isLoading={requestsLoading} />

      {/* 3. Live Active Care Spotlight */}
      <ActiveCareTracker
        activeRequest={activeRequest}
        onStartChat={startChat}
        isStartingChat={isStartingChat}
      />

      {/* 4. Recent Shift Bookings Section */}
      <RecentClientRequests
        requests={requests}
        onStartChat={startChat}
        isStartingChat={isStartingChat}
      />

      {/* 5. Book by Specialty Shortcuts Grid */}
      <ClientSpecialtiesGrid categories={categories} />

      {/* 6. Guarantee & Safety Card */}
      <ClientTrustCard />
    </div>
  );
}
