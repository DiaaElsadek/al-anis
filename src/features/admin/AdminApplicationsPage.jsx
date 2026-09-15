import { useState } from "react";
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
import { formatPrice, getMediaUrl } from "@/lib/utils";
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
        <h1 className="text-2xl font-bold text-foreground">Service Provider Applications</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Audit national IDs, professional credentials, and approve or reject provider onboarding.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-3">
        {[
          { key: "all", label: "All Submissions" },
          { key: "pending", label: "Pending Audit" },
          { key: "approved", label: "Approved" },
          { key: "rejected", label: "Rejected" },
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
                title="No applications found"
                description="New provider registrations will show up here for compliance review."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground">
                    <th className="py-3 px-4 font-semibold">Applicant</th>
                    <th className="py-3 px-4 font-semibold">Contact</th>
                    <th className="py-3 px-4 font-semibold">Experience</th>
                    <th className="py-3 px-4 font-semibold">Base Rate</th>
                    <th className="py-3 px-4 font-semibold">Submitted</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                    <th className="py-3 px-4 font-semibold text-end">Action</th>
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
                        <div className="text-[11px]">{app.phoneNumber}</div>
                      </td>
                      <td className="py-3.5 px-4 text-foreground/90 max-w-[180px] truncate">
                        {app.experience}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-primary">
                        {formatPrice(app.hourlyRate)}/hr
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {new Date(app.createdAt).toLocaleDateString()}
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
                          Review Audit
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
                <DialogTitle>Provider Compliance Audit</DialogTitle>
                {selectedApp && <StatusBadge status={selectedApp.status} />}
              </div>
              <DialogDescription className="text-xs">
                Review submitted National ID, verified credentials, and experience.
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
                    <span className="text-muted-foreground block text-[11px]">Full Name</span>
                    <span className="font-bold text-foreground">
                      {selectedApp.firstName} {selectedApp.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">National ID</span>
                    <span className="font-mono font-bold text-foreground">
                      {selectedApp.nationalId || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Email</span>
                    <span className="text-foreground">{selectedApp.userEmail}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Phone</span>
                    <span className="text-foreground">{selectedApp.phoneNumber}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground block text-[11px]">Address</span>
                    <span className="text-foreground">{selectedApp.address || "N/A"}</span>
                  </div>
                </div>

                {/* Professional summary */}
                <div className="space-y-1.5">
                  <span className="font-semibold text-foreground block">Professional Bio</span>
                  <p className="p-3 rounded-lg bg-muted/20 border border-border/40 text-foreground leading-relaxed">
                    {selectedApp.bio || "No bio provided."}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="font-semibold text-foreground block">Experience Summary</span>
                  <p className="p-3 rounded-lg bg-muted/20 border border-border/40 text-foreground leading-relaxed">
                    {selectedApp.experience}
                  </p>
                </div>

                {/* Uploaded Verification Documents */}
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <span className="font-semibold text-foreground block">
                    Verification Documents (Audit Files)
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
                        <span>View National ID</span>
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
                        className="flex items-center gap-2 p-3 rounded-lg border border-border/70 hover:bg-muted/40 transition-colors text-teal-700 font-semibold"
                      >
                        <FileText className="h-4 w-4" />
                        <span>View Certificate</span>
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
                    Close
                  </Button>

                  {selectedApp.status === 0 && (
                    <>
                      <Button
                        variant="destructive"
                        onClick={() => setRejectModalOpen(true)}
                        disabled={approveMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 me-1.5" />
                        Reject Application
                      </Button>

                      <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                        onClick={() => approveMutation.mutate(selectedApp.id)}
                        disabled={approveMutation.isPending}
                      >
                        <CheckCircle2 className="h-4 w-4 me-1.5" />
                        {approveMutation.isPending ? "Approving..." : "Approve & Activate"}
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
              <DialogTitle>Reject Provider Application</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                Explain what credentials or documents were missing or invalid.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Rejection Feedback *</Label>
                <Textarea
                  placeholder="e.g. National ID photo is blurry / need valid nursing certificate..."
                  rows={3}
                  className="text-xs resize-none"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
                  Cancel
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
                  {rejectMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
