import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  CreditCard,
  FileText,
  ExternalLink,
  MapPin,
  Calendar,
  AlertCircle,
  Search,
} from "lucide-react";

import {
  getServiceProviderApplications,
  getServiceProviderApplication,
  approveServiceProviderApplication,
  rejectServiceProviderApplication,
} from "@/api/admin";
import { formatPrice, formatLocalizedDate, getMediaUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/shared/Pagination";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";

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
  const { data: appData, isLoading } = useQuery({
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
    onError: (error) => {
      toast.error("Approval error", {
        description: error?.response?.data?.message || "Could not approve application.",
      });
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) =>
      rejectServiceProviderApplication(id, reason),
    onSuccess: () => {
      toast.success("Application rejected.");
      queryClient.invalidateQueries(["admin-applications"]);
      queryClient.invalidateQueries(["admin-dashboard-stats"]);
      setRejectModalOpen(false);
      setSelectedAppId(null);
      setRejectionReason("");
    },
    onError: (error) => {
      toast.error("Rejection error", {
        description: error?.response?.data?.message || "Could not reject application.",
      });
    },
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
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("admin:applications.subtitle")}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-3">
        {[
          { key: "all", label: t("admin:applications.tabs.all", { count: applications.length }) },
          { key: "pending", label: t("admin:applications.tabs.pending", { count: applications.filter(a => a.status === 0).length }) },
          { key: "approved", label: t("admin:applications.tabs.approved", { count: applications.filter(a => a.status === 1).length }) },
          { key: "rejected", label: t("admin:applications.tabs.rejected", { count: applications.filter(a => a.status === 2).length }) },
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
                    <th className="py-3 px-4 font-semibold text-start">{t("admin:applications.applicant")}</th>
                    <th className="py-3 px-4 font-semibold text-start">{t("auth:register.phoneNumber")}</th>
                    <th className="py-3 px-4 font-semibold text-start">{t("admin:applications.experience")}</th>
                    <th className="py-3 px-4 font-semibold text-start">{t("admin:applications.hourlyRate")}</th>
                    <th className="py-3 px-4 font-semibold text-start">{t("admin:applications.submitted")}</th>
                    <th className="py-3 px-4 font-semibold text-center">{t("admin:applications.status")}</th>
                    <th className="py-3 px-4 font-semibold text-end">{t("admin:applications.actions")}</th>
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
                        {formatPrice(app.hourlyRate, i18n.language)}
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
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Review & Audit Modal Dialog */}
      {selectedAppId && (
        <Dialog open={!!selectedAppId} onOpenChange={(open) => !open && setSelectedAppId(null)}>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>{t("admin:applications.drawerTitle")}</DialogTitle>
                {selectedApp && <StatusBadge status={selectedApp.status} />}
              </div>
              <DialogDescription className="text-xs">
                {t("admin:applications.drawerSubtitle")}
              </DialogDescription>
            </DialogHeader>

            {detailLoading || !selectedApp ? (
              <div className="space-y-3 py-6">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <div className="space-y-4 pt-2 text-xs">
                {/* Personal grid */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/25 border border-border/50">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">{t("auth:register.fullName")}</span>
                    <span className="font-bold text-foreground">
                      {selectedApp.firstName} {selectedApp.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">{t("admin:applications.nationalId")}</span>
                    <span className="font-mono font-bold text-foreground">
                      {selectedApp.nationalId || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">{t("auth:login.emailLabel")}</span>
                    <span className="text-foreground">{selectedApp.userEmail}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">{t("auth:register.phoneNumber")}</span>
                    <span className="text-foreground font-mono">{selectedApp.phoneNumber}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground block text-[11px]">{t("client:profile.address")}</span>
                    <span className="text-foreground">{selectedApp.address || "—"}</span>
                  </div>
                </div>

                {/* Professional summary */}
                <div className="space-y-1.5">
                  <span className="font-semibold text-foreground block">{t("auth:register.bio")}</span>
                  <p className="p-3 rounded-lg bg-muted/20 border border-border/40 text-foreground leading-relaxed">
                    {selectedApp.bio || "—"}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="font-semibold text-foreground block">{t("admin:applications.experience")}</span>
                  <p className="p-3 rounded-lg bg-muted/20 border border-border/40 text-foreground leading-relaxed">
                    {selectedApp.experience}
                  </p>
                </div>

                {/* Uploaded Verification Documents */}
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <span className="font-semibold text-foreground block">
                    {t("admin:applications.documentsTitle")}
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedApp.idDocumentPath ? (
                      <a
                        href={getMediaUrl(selectedApp.idDocumentPath)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 p-3 rounded-lg border border-border/70 hover:bg-muted/40 transition-colors text-primary font-semibold"
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>{t("admin:applications.idDocument")}</span>
                        <ExternalLink className="h-3 w-3 ms-auto opacity-70" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground italic">No ID uploaded</span>
                    )}

                    {selectedApp.certificatePath ? (
                      <a
                        href={getMediaUrl(selectedApp.certificatePath)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 p-3 rounded-lg border border-border/70 hover:bg-muted/40 transition-colors text-teal-700 dark:text-teal-400 font-semibold"
                      >
                        <FileText className="h-4 w-4" />
                        <span>{t("admin:applications.certificate")}</span>
                        <ExternalLink className="h-3 w-3 ms-auto opacity-70" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground italic">No certificate</span>
                    )}
                  </div>
                </div>

                {/* Audit Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t border-border/60">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedAppId(null)}
                  >
                    {t("common:actions.close")}
                  </Button>

                  {selectedApp.status === 0 && (
                    <>
                      <Button
                        variant="destructive"
                        onClick={() => setRejectModalOpen(true)}
                        disabled={approveMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 me-1.5" />
                        {t("admin:applications.rejectButton")}
                      </Button>

                      <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                        onClick={() => approveMutation.mutate(selectedApp.id)}
                        disabled={approveMutation.isPending}
                      >
                        <CheckCircle2 className="h-4 w-4 me-1.5" />
                        {approveMutation.isPending ? t("admin:applications.approving") : t("admin:applications.approveButton")}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Reason Dialog */}
      {rejectModalOpen && (
        <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("admin:applications.rejectModal.title")}</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {t("admin:applications.rejectModal.subtitle")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("admin:applications.rejectModal.reasonLabel")} *</Label>
                <Textarea
                  placeholder={t("admin:applications.rejectModal.reasonPlaceholder")}
                  rows={3}
                  className="text-xs resize-none"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
                  {t("common:actions.cancel")}
                </Button>
                <Button
                  variant="destructive"
                  disabled={!rejectionReason.trim() || rejectMutation.isPending}
                  onClick={() =>
                    rejectMutation.mutate({
                      id: selectedAppId,
                      reason: rejectionReason,
                    })
                  }
                >
                  {rejectMutation.isPending ? t("admin:applications.approving") : t("admin:applications.rejectModal.confirmButton")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
