import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  FileText,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Play,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
} from "lucide-react";

import {
  getProviderRequests,
  respondToRequest,
  startRequest,
  completeRequest,
} from "@/api/requests";
import { createOrGetChat } from "@/api/chat";
import { useAuth } from "@/hooks/useAuth";
import { ShiftTypeLabels } from "@/lib/constants";
import { formatPrice, formatLocalizedDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import StatusBadge from "@/components/shared/StatusBadge";

export default function ProviderRequestsPage() {
  const { t, i18n } = useTranslation(["provider", "common"]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("all");
  const [rejectDialogReq, setRejectDialogReq] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const providerId = user?.id || user?.userId;

  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ["provider-requests", providerId],
    queryFn: () => getProviderRequests(providerId),
    enabled: !!providerId,
    refetchInterval: 15000,
  });

  // Respond to request (Accept or Reject)
  const respondMutation = useMutation({
    mutationFn: ({ requestId, status, reason }) =>
      respondToRequest(requestId, { status, reason }),
    onSuccess: (_, vars) => {
      toast.success(
        vars.status === 1 ? t("common:success") : t("provider:requests.rejectButton")
      );
      setRejectDialogReq(null);
      setRejectReason("");
      queryClient.invalidateQueries(["provider-requests"]);
    },
    onError: (error) => {
      toast.error(t("common:error"), {
        description: error?.response?.data?.message || "Could not update request.",
      });
    },
  });

  // Start shift mutation
  const startMutation = useMutation({
    mutationFn: (requestId) => startRequest(requestId),
    onSuccess: () => {
      toast.success(t("common:success"));
      queryClient.invalidateQueries(["provider-requests"]);
    },
    onError: (error) => {
      toast.error(t("common:error"), {
        description: error?.response?.data?.message || "Please check request status.",
      });
    },
  });

  // Complete shift mutation
  const completeMutation = useMutation({
    mutationFn: (requestId) => completeRequest(requestId),
    onSuccess: () => {
      toast.success(t("common:success"));
      queryClient.invalidateQueries(["provider-requests"]);
    },
    onError: (error) => {
      toast.error(t("common:error"), {
        description: error?.response?.data?.message || "Could not complete shift.",
      });
    },
  });

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: (serviceRequestId) => createOrGetChat(serviceRequestId),
    onSuccess: (chat) => {
      const chatId = chat?.id || chat?.data?.id;
      navigate(`/provider/chats?active=${chatId}`);
    },
    onError: () => {
      toast.error(t("common:error"));
    },
  });

  const filteredRequests = requests.filter((r) => {
    if (activeTab === "all") return true;
    const s = r.statusName?.toLowerCase() || "";
    if (activeTab === "pending") return s.includes("pending") || r.status === 0;
    if (activeTab === "active")
      return s.includes("accept") || s.includes("progress") || r.status === 1 || r.status === 2;
    if (activeTab === "completed") return s.includes("complete") || r.status === 3;
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("provider:requests.title")}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("provider:requests.subtitle")}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full sm:w-auto h-10 p-1 bg-muted/60">
          <TabsTrigger value="all" className="text-xs font-semibold">
            {t("provider:requests.tabs.all")} ({requests.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs font-semibold">
            {t("provider:requests.tabs.pending")}
          </TabsTrigger>
          <TabsTrigger value="active" className="text-xs font-semibold">
            {t("provider:requests.tabs.active")}
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs font-semibold">
            {t("provider:requests.tabs.completed")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-5 space-y-3">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-32 ms-auto" />
            </Card>
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={t("provider:requests.title")}
          description={t("provider:requests.subtitle")}
        />
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const shiftName =
              req.shiftTypeName || ShiftTypeLabels[req.shiftType] || "Shift";

            return (
              <Card
                key={req.id}
                className="border-border/70 shadow-sm bg-card overflow-hidden"
              >
                <div className="p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
                    <div>
                      <h3 className="font-bold text-sm text-foreground">
                        {req.categoryName}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {t("provider:requests.client")}: <strong className="text-foreground">{req.providerName || t("common:roles.client")}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-primary">
                        {req.totalPrice ? formatPrice(req.totalPrice) : "-"}
                      </span>
                      <StatusBadge status={req.status} label={req.statusName} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{formatLocalizedDate(req.preferredDate, "dd/MM/yyyy", i18n.language)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-teal-600" />
                      <span className="capitalize">{shiftName}</span>
                    </div>

                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="truncate">{req.address || req.governorate}</span>
                    </div>
                  </div>

                  {req.description && (
                    <p className="text-xs text-foreground/80 bg-muted/20 p-2.5 rounded-lg border border-border/40">
                      <strong>{t("common:description")}:</strong> {req.description}
                    </p>
                  )}

                  {/* Provider Action Buttons */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-border/40">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-semibold h-8"
                      onClick={() => chatMutation.mutate(req.id)}
                      disabled={chatMutation.isPending}
                    >
                      <MessageSquare className="h-3.5 w-3.5 me-1.5" />
                      {t("provider:requests.chatButton")}
                    </Button>

                    {/* Pending state: Accept or Reject */}
                    {(req.status === 0 || req.statusName?.toLowerCase().includes("pending")) && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs font-semibold h-8 text-destructive hover:bg-destructive/10"
                          onClick={() => setRejectDialogReq(req)}
                        >
                          <XCircle className="h-3.5 w-3.5 me-1.5" />
                          {t("provider:requests.rejectButton")}
                        </Button>

                        <Button
                          size="sm"
                          className="text-xs font-semibold h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() =>
                            respondMutation.mutate({
                              requestId: req.id,
                              status: 1, // Accepted
                            })
                          }
                          disabled={respondMutation.isPending}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 me-1.5" />
                          {t("provider:requests.acceptButton")}
                        </Button>
                      </>
                    )}

                    {/* Start shift button */}
                    {req.canStart && (
                      <Button
                        size="sm"
                        className="text-xs font-semibold h-8 bg-primary text-primary-foreground shadow-sm"
                        onClick={() => startMutation.mutate(req.id)}
                        disabled={startMutation.isPending}
                      >
                        <Play className="h-3.5 w-3.5 me-1.5" />
                        {t("provider:requests.startButton")}
                      </Button>
                    )}

                    {/* Complete shift button */}
                    {req.canComplete && (
                      <Button
                        size="sm"
                        className="text-xs font-semibold h-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                        onClick={() => completeMutation.mutate(req.id)}
                        disabled={completeMutation.isPending}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 me-1.5" />
                        {t("provider:requests.completeButton")}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Decline Reason Dialog */}
      {rejectDialogReq && (
        <Dialog
          open={!!rejectDialogReq}
          onOpenChange={(open) => !open && setRejectDialogReq(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("provider:requests.rejectModal.title")}</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {t("provider:requests.rejectModal.subtitle")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("provider:requests.rejectModal.reasonLabel")}</Label>
                <Textarea
                  placeholder={t("provider:requests.rejectModal.reasonPlaceholder")}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="text-xs resize-none"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setRejectDialogReq(null)}
                >
                  {t("common:cancel")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() =>
                    respondMutation.mutate({
                      requestId: rejectDialogReq.id,
                      status: 4, // Rejected
                      reason: rejectReason || "Schedule conflict",
                    })
                  }
                  disabled={respondMutation.isPending}
                >
                  {t("provider:requests.rejectModal.confirmButton")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
