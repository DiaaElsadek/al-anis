import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  FileCheck,
  ShieldAlert,
  LogOut,
} from "lucide-react";

import { getApplicationStatus } from "@/api/provider";
import { refreshToken as apiRefreshToken } from "@/api/account";
import { useAuth } from "@/hooks/useAuth";
import { formatLocalizedDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderPendingPage() {
  const { t, i18n } = useTranslation(["provider", "common"]);
  const navigate = useNavigate();
  const { logout, user, refreshToken, setAuth } = useAuth();

  const {
    data: appStatus,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["provider-app-status"],
    queryFn: getApplicationStatus,
    refetchInterval: 30000, // Poll every 30s
  });

  // Token refresh mutation when application is approved
  const refreshMutation = useMutation({
    mutationFn: async () => {
      if (!refreshToken) throw new Error("No refresh token found");
      const res = await apiRefreshToken(refreshToken);
      return res?.data || res;
    },
    onSuccess: (tokens) => {
      toast.success(t("common:success"));
      if (tokens?.accessToken) {
        setAuth({ ...user, role: "ServiceProvider", providerStatus: 1 }, tokens);
        navigate("/provider/dashboard", { replace: true });
      }
    },
    onError: (error) => {
      toast.error(t("common:error"), {
        description: "Please log out and sign back in to activate your provider access.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-4 text-center">
          <Skeleton className="h-16 w-16 rounded-2xl mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </Card>
      </div>
    );
  }

  // Status mapping: 0 = Pending, 1 = Approved, 2 = Rejected
  const status = appStatus?.status ?? 0;
  const isPending = status === 0;
  const isApproved = status === 1;
  const isRejected = status === 2;

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-border/80 shadow-xl bg-card text-center overflow-hidden">
        {/* Top decorative gradient banner */}
        <div
          className={`h-2.5 w-full ${
            isApproved
              ? "bg-emerald-500"
              : isRejected
              ? "bg-destructive"
              : "bg-amber-500"
          }`}
        />

        <CardHeader className="pt-8 pb-4">
          <div
            className={`h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
              isApproved
                ? "bg-emerald-500/10 text-emerald-600"
                : isRejected
                ? "bg-destructive/10 text-destructive"
                : "bg-amber-500/10 text-amber-600"
            }`}
          >
            {isApproved ? (
              <CheckCircle2 className="h-8 w-8" />
            ) : isRejected ? (
              <XCircle className="h-8 w-8" />
            ) : (
              <Clock className="h-8 w-8 animate-pulse" />
            )}
          </div>

          <CardTitle className="text-2xl font-bold">
            {isApproved
              ? t("common:status.approved")
              : isRejected
              ? t("provider:pending.rejectedNotice")
              : t("provider:pending.title")}
          </CardTitle>

          <CardDescription className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {isApproved
              ? t("provider:pending.step3Desc")
              : isRejected
              ? t("provider:pending.rejectedNotice")
              : t("provider:pending.subtitle")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 px-6 sm:px-8">
          {/* Details Box */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/60 text-start text-xs space-y-2">
            {appStatus?.applicationId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID</span>
                <span className="font-mono font-semibold text-foreground">
                  {appStatus.applicationId}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("provider:pending.status")}</span>
              <span
                className={`font-semibold capitalize ${
                  isApproved
                    ? "text-emerald-600"
                    : isRejected
                    ? "text-destructive"
                    : "text-amber-600"
                }`}
              >
                {appStatus?.statusText || (isApproved ? t("common:status.approved") : isRejected ? t("common:status.rejected") : t("common:status.pending"))}
              </span>
            </div>

            {appStatus?.reviewedAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("provider:pending.submittedAt")}</span>
                <span className="text-foreground">
                  {formatLocalizedDate(appStatus.reviewedAt, "dd/MM/yyyy", i18n.language)}
                </span>
              </div>
            )}

            {isRejected && appStatus?.rejectionReason && (
              <div className="pt-2 border-t border-border/40">
                <span className="font-semibold text-destructive block mb-0.5">
                  {t("provider:pending.rejectedReason")}
                </span>
                <p className="text-foreground/90 bg-destructive/5 p-2 rounded border border-destructive/20">
                  {appStatus.rejectionReason}
                </p>
              </div>
            )}
          </div>

          {/* Action guidance */}
          {isApproved && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-800 text-start space-y-1">
              <p className="font-semibold">{t("provider:pending.upgradeAccess")}</p>
            </div>
          )}

          {isPending && (
            <p className="text-[11px] text-muted-foreground">
              {t("provider:pending.step2Desc")}
            </p>
          )}
        </CardContent>

        <CardFooter className="pt-2 pb-6 px-6 sm:px-8 flex flex-col sm:flex-row gap-2.5 justify-center border-t border-border/40">
          {isApproved ? (
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              onClick={() => refreshMutation.mutate()}
              disabled={refreshMutation.isPending}
            >
              <CheckCircle2 className="h-4 w-4 me-2" />
              {refreshMutation.isPending ? t("common:loading") : t("provider:pending.upgradeAccess")}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto text-xs"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 me-1.5 ${isFetching ? "animate-spin" : ""}`}
              />
              {t("provider:pending.refreshButton")}
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="w-full sm:w-auto text-xs text-muted-foreground hover:text-foreground"
            onClick={logout}
          >
            <LogOut className="h-3.5 w-3.5 me-1.5" />
            {t("common:nav.logout")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
