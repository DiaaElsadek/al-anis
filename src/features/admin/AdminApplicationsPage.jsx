import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileCheck, Eye } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  getServiceProviderApplications,
  getServiceProviderApplication,
  approveServiceProviderApplication,
  rejectServiceProviderApplication,
} from "@/api/admin";
import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ApplicationDetailDialog from "@/features/admin/components/ApplicationDetailDialog";
import ApplicationRejectDialog from "@/features/admin/components/ApplicationRejectDialog";
import { formatLocalizedDate, formatPrice, handleMutationError } from "@/lib/utils";

export default function AdminApplicationsPage() {
  const { t, i18n } = useTranslation(["admin", "common", "auth"]);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [activeTab, setActiveTab] = useState("all");
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Applications list
  const {
    data: appData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin-applications", page],
    queryFn: () => getServiceProviderApplications({ page, pageSize }),
    keepPreviousData: true,
  });

  const applications = appData?.items || [];
  const totalPages = appData?.totalPages || 1;

  // Single application detail for review dialog
  const { data: selectedApp, isLoading: detailLoading } = useQuery({
    queryKey: ["admin-application-detail", selectedAppId],
    queryFn: () => getServiceProviderApplication(selectedAppId),
    enabled: !!selectedAppId,
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (id) => approveServiceProviderApplication(id),
    onSuccess: () => {
      toast.success("Application approved!", {
        description: "Provider credentials verified and elevated.",
      });
      queryClient.invalidateQueries(["admin-applications"]);
      queryClient.invalidateQueries(["admin-dashboard-stats"]);
      setSelectedAppId(null);
    },
    onError: (error) => handleMutationError(error, t, "common:error"),
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => rejectServiceProviderApplication(id, reason),
    onSuccess: () => {
      toast.success("Application rejected.");
      queryClient.invalidateQueries(["admin-applications"]);
      queryClient.invalidateQueries(["admin-dashboard-stats"]);
      setRejectModalOpen(false);
      setSelectedAppId(null);
      setRejectionReason("");
    },
    onError: (error) => handleMutationError(error, t, "common:error"),
  });

  const filteredApps = applications.filter((app) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return app.status === 0;
    if (activeTab === "approved") return app.status === 1;
    if (activeTab === "rejected") return app.status === 2;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("admin:applications.title")}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{t("admin:applications.subtitle")}</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-3">
        {[
          { key: "all", label: t("admin:applications.tabs.all", { count: applications.length }) },
          {
            key: "pending",
            label: t("admin:applications.tabs.pending", {
              count: applications.filter((a) => a.status === 0).length,
            }),
          },
          {
            key: "approved",
            label: t("admin:applications.tabs.approved", {
              count: applications.filter((a) => a.status === 1).length,
            }),
          },
          {
            key: "rejected",
            label: t("admin:applications.tabs.rejected", {
              count: applications.filter((a) => a.status === 2).length,
            }),
          },
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "outline"}
            size="sm"
            className="text-xs h-8 rounded-full"
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Applications Table */}
      <Card className="border-border/70 shadow-sm bg-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : isError ? (
            <div className="py-16 text-center">
              <EmptyState
                icon={FileCheck}
                title={t("common:error")}
                description={t("common:empty.tryAdjusting")}
                actionLabel={t("common:actions.retry")}
                onAction={() => refetch()}
              />
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="py-16 text-center">
              <EmptyState
                icon={FileCheck}
                title={t("common:empty.noResults")}
                description={t("common:empty.tryAdjusting")}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground">
                    <th className="py-3 px-4 font-semibold text-start">
                      {t("admin:applications.applicant")}
                    </th>
                    <th className="py-3 px-4 font-semibold text-start">
                      {t("auth:register.phoneNumber")}
                    </th>
                    <th className="py-3 px-4 font-semibold text-start">
                      {t("admin:applications.experience")}
                    </th>
                    <th className="py-3 px-4 font-semibold text-start">
                      {t("admin:applications.hourlyRate")}
                    </th>
                    <th className="py-3 px-4 font-semibold text-start">
                      {t("admin:applications.submitted")}
                    </th>
                    <th className="py-3 px-4 font-semibold text-center">
                      {t("admin:applications.status")}
                    </th>
                    <th className="py-3 px-4 font-semibold text-end">
                      {t("admin:applications.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-muted/25 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground">
                        {app.firstName} {app.lastName}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        <div>{app.userEmail}</div>
                        <div className="text-[11px] font-mono">{app.phoneNumber}</div>
                      </td>
                      <td className="py-3.5 px-4 text-foreground/90 max-w-[180px] truncate">
                        {app.experience}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-primary">
                        {formatPrice(app.hourlyRate, "EGP", i18n.language)}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {formatLocalizedDate(app.createdAt, "PP", i18n.language)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="py-3.5 px-4 text-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs font-medium"
                          onClick={() => setSelectedAppId(app.id)}
                        >
                          <Eye className="h-3.5 w-3.5 me-1" />
                          {t("admin:applications.reviewButton")}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* Review & Audit Modal Dialog */}
      <ApplicationDetailDialog
        selectedAppId={selectedAppId}
        selectedApp={selectedApp}
        detailLoading={detailLoading}
        onClose={() => setSelectedAppId(null)}
        onOpenReject={() => setRejectModalOpen(true)}
        onApprove={(id) => approveMutation.mutate(id)}
        isApproving={approveMutation.isPending}
      />

      {/* Reject Reason Dialog */}
      <ApplicationRejectDialog
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        onConfirm={() =>
          rejectMutation.mutate({
            id: selectedAppId,
            reason: rejectionReason,
          })
        }
        isRejecting={rejectMutation.isPending}
      />
    </div>
  );
}
