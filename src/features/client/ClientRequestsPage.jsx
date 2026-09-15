import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  FileText,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  MessageSquare,
  Star,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import { getUserRequests } from "@/api/requests";
import { createCheckout } from "@/api/payments";
import { createOrGetChat } from "@/api/chat";
import { ShiftTypeLabels } from "@/lib/constants";
import { getMediaUrl, getInitials, formatPrice, formatLocalizedDate } from "@/lib/utils";
import DirectionalIcon from "@/components/shared/DirectionalIcon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import StatusBadge from "@/components/shared/StatusBadge";
import ReviewModal from "./ReviewModal";

export default function ClientRequestsPage() {
  const { t, i18n } = useTranslation(["client", "common"]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [reviewingRequest, setReviewingRequest] = useState(null);

  // Fetch client's requests
  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ["user-requests"],
    queryFn: getUserRequests,
    refetchInterval: 15000,
  });

  // Payment Checkout Mutation
  const checkoutMutation = useMutation({
    mutationFn: (serviceRequestId) => createCheckout({ serviceRequestId }),
    onSuccess: (result) => {
      const checkoutUrl = result?.checkoutUrl || result?.data?.checkoutUrl;
      if (checkoutUrl) {
        toast.info(t("common:loading"));
        window.location.href = checkoutUrl;
      } else {
        toast.success(t("common:success"));
        refetch();
      }
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        t("common:error");
      toast.error(t("common:error"), { description: msg });
    },
  });

  // Chat initiation
  const chatMutation = useMutation({
    mutationFn: (serviceRequestId) => createOrGetChat(serviceRequestId),
    onSuccess: (chat) => {
      const chatId = chat?.id || chat?.data?.id;
      navigate(`/app/chats?active=${chatId}`);
    },
    onError: (error) => {
      toast.error(t("common:error"), {
        description: error?.response?.data?.message || "Failed to open chat.",
      });
    },
  });

  // Filter requests by tab
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("client:requests.title")}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("client:requests.subtitle")}
          </p>
        </div>

        <Button asChild className="font-semibold shadow-sm shadow-primary/20">
          <Link to="/app/providers">
            <span>{t("client:requests.findProvidersButton")}</span>
            <DirectionalIcon className="h-4 w-4 ms-2" />
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full sm:w-auto h-10 p-1 bg-muted/60">
          <TabsTrigger value="all" className="text-xs font-semibold">
            {t("client:requests.tabs.all")} ({requests.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs font-semibold">
            {t("client:requests.tabs.pending")}
          </TabsTrigger>
          <TabsTrigger value="active" className="text-xs font-semibold">
            {t("client:requests.tabs.active")}
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs font-semibold">
            {t("client:requests.tabs.completed")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Requests List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={t("client:requests.emptyTitle")}
          description={t("client:requests.emptyDesc")}
          actionLabel={t("client:requests.findProvidersButton")}
          onAction={() => navigate("/app/providers")}
        />
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const shiftLabel =
              req.shiftTypeName || ShiftTypeLabels[req.shiftType] || "Shift";

            return (
              <Card
                key={req.id}
                className="border-border/70 shadow-sm hover:border-border transition-colors bg-card overflow-hidden"
              >
                <div className="p-5 space-y-4">
                  {/* Top info row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-xl border">
                        <AvatarImage src={getMediaUrl(req.providerAvatar)} alt={req.providerName} />
                        <AvatarFallback className="rounded-xl font-bold text-xs bg-primary/10 text-primary">
                          {getInitials(req.providerName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-sm text-foreground">
                          {req.categoryName}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {t("client:requests.providerLabel")} <strong className="text-foreground">{req.providerName}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-primary">
                        {req.totalPrice ? formatPrice(req.totalPrice) : "-"}
                      </span>
                      <StatusBadge status={req.status} label={req.statusName} />
                    </div>
                  </div>

                  {/* Shift details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{formatLocalizedDate(req.preferredDate, "dd/MM/yyyy", i18n.language)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-teal-600" />
                      <span className="capitalize">{shiftLabel}</span>
                    </div>

                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="truncate">{req.address || req.governorate}</span>
                    </div>
                  </div>

                  {/* Description note */}
                  {req.description && (
                    <p className="text-xs text-foreground/80 bg-muted/20 p-2.5 rounded-lg border border-border/40">
                      {req.description}
                    </p>
                  )}

                  {/* Action buttons bar */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                    {/* Chat button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-semibold h-8"
                      onClick={() => chatMutation.mutate(req.id)}
                      disabled={chatMutation.isPending}
                    >
                      <MessageSquare className="h-3.5 w-3.5 me-1.5" />
                      {t("client:requests.chatButton")}
                    </Button>

                    {/* Pay Checkout Button (when canPay === true) */}
                    {req.canPay && (
                      <Button
                        size="sm"
                        className="text-xs font-semibold h-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                        onClick={() => checkoutMutation.mutate(req.id)}
                        disabled={checkoutMutation.isPending}
                      >
                        <CreditCard className="h-3.5 w-3.5 me-1.5" />
                        {checkoutMutation.isPending ? t("common:loading") : t("client:requests.payButton")}
                      </Button>
                    )}

                    {/* Review Button (when completed) */}
                    {(req.status === 3 || req.statusName?.toLowerCase() === "completed") && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs font-semibold h-8 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20"
                        onClick={() => setReviewingRequest(req)}
                      >
                        <Star className="h-3.5 w-3.5 me-1.5 fill-current" />
                        {t("client:requests.reviewButton")}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Review Modal Dialog */}
      {reviewingRequest && (
        <ReviewModal
          open={!!reviewingRequest}
          onOpenChange={(open) => !open && setReviewingRequest(null)}
          serviceRequestId={reviewingRequest.id}
          providerName={reviewingRequest.providerName}
        />
      )}
    </div>
  );
}
