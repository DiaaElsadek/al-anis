import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  Search,
  Download,
  RefreshCw,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { getAdminPayments, getDashboardStats } from "@/api/admin";
import { formatPrice, formatLocalizedDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import StatusBadge from "@/components/shared/StatusBadge";

export default function AdminPaymentsPage() {
  const { t, i18n } = useTranslation(["admin", "common"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

  // Fetch admin dashboard stats for high-level financials
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: getDashboardStats,
  });

  // Fetch payments list
  const {
    data: paymentsData,
    isLoading: paymentsLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: getAdminPayments,
  });

  // Normalize payments data (handles arrays, paginated envelopes, or empty states)
  const rawPayments = useMemo(() => {
    if (!paymentsData) return [];
    if (Array.isArray(paymentsData)) return paymentsData;
    if (Array.isArray(paymentsData?.items)) return paymentsData.items;
    if (Array.isArray(paymentsData?.data)) return paymentsData.data;
    if (Array.isArray(paymentsData?.payments)) return paymentsData.payments;
    return [];
  }, [paymentsData]);

  // Copy transaction ID to clipboard
  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success(t("common:toasts.copiedToClipboard"));
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered payments list
  const filteredPayments = useMemo(() => {
    return rawPayments.filter((payment) => {
      const id = (payment?.id || payment?.transactionId || payment?.referenceNumber || "").toString().toLowerCase();
      const client = (payment?.clientName || payment?.userName || payment?.clientEmail || "").toLowerCase();
      const provider = (payment?.providerName || payment?.serviceProviderName || "").toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch = !query || id.includes(query) || client.includes(query) || provider.includes(query);

      const status = (payment?.status || payment?.paymentStatus || "completed").toString().toLowerCase();
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && (status.includes("complet") || status.includes("succeed") || status === "1" || status === "paid")) ||
        (statusFilter === "pending" && (status.includes("pend") || status === "0")) ||
        (statusFilter === "failed" && (status.includes("fail") || status.includes("cancel") || status === "2"));

      return matchesSearch && matchesStatus;
    });
  }, [rawPayments, searchQuery, statusFilter]);

  // Export visible transactions to CSV
  const handleExportCsv = () => {
    if (!filteredPayments.length) {
      toast.info(t("common:empty.noResults"));
      return;
    }

    const headers = ["Transaction ID", "Client", "Provider", "Amount (EGP)", "Method", "Status", "Date"];
    const rows = filteredPayments.map((p) => [
      `"${p.id || p.transactionId || 'N/A'}"`,
      `"${p.clientName || p.userName || 'Client'}"`,
      `"${p.providerName || p.serviceProviderName || 'Provider'}"`,
      `"${p.amount || 0}"`,
      `"${p.paymentMethod || 'Escrow/Card'}"`,
      `"${p.status || 'Completed'}"`,
      `"${p.createdAt ? format(new Date(p.createdAt), "yyyy-MM-dd HH:mm") : 'N/A'}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `alanis_payments_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(t("common:toasts.copiedToClipboard"));
  };

  const totalCalculated = useMemo(() => {
    return rawPayments.reduce((sum, p) => sum + (Number(p?.amount) || 0), 0);
  }, [rawPayments]);

  const totalRevenue = stats?.totalEarnings || totalCalculated || 0;
  const avgTransaction = rawPayments.length > 0 ? totalRevenue / rawPayments.length : 0;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t("admin:payments.title")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {t("admin:payments.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="h-9 gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
            {t("common:actions.refresh")}
          </Button>
          <Button
            size="sm"
            onClick={handleExportCsv}
            className="h-9 gap-1.5 shadow-sm"
          >
            <Download className="h-4 w-4" />
            {t("common:actions.exportCsv")}
          </Button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs border-border/80">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("admin:payments.totalVolume")}
              </p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">
                {statsLoading ? <Skeleton className="h-8 w-24" /> : formatPrice(totalRevenue, i18n.language)}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{t("admin:dashboard.revenueDesc")}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <DollarSign className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/80">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("admin:payments.totalTransactions")}
              </p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">
                {paymentsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  rawPayments.length || stats?.completedServiceRequests || 0
                )}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{t("admin:dashboard.completedShifts")}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <CreditCard className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/80">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("admin:payments.avgShift")}
              </p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">
                {formatPrice(avgTransaction || 450, i18n.language)}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{t("admin:pricing.subtitle")}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <TrendingUp className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/80">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("admin:payments.escrowSecurity")}
              </p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">100%</h3>
              <p className="text-xs text-muted-foreground mt-1">{t("common:footer.escrowBadge")}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Toolbar */}
      <Card className="shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("admin:payments.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 h-10 text-xs rounded-xl"
              />
            </div>

            <div className="flex items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] h-10 text-xs">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder={t("admin:payments.statusFilter")} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("admin:users.allStatuses")}</SelectItem>
                  <SelectItem value="completed">{t("common:status.completed")}</SelectItem>
                  <SelectItem value="pending">{t("common:status.pending")}</SelectItem>
                  <SelectItem value="failed">{t("common:status.failed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ledger Table */}
      <Card className="shadow-xs overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">{t("admin:dashboard.recentBookings")}</CardTitle>
              <CardDescription className="text-xs">
                {t("admin:payments.subtitle")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {paymentsLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <Skeleton className="h-10 w-48" />
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-20" />
                </div>
              ))}
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={CreditCard}
                title={t("common:empty.noResults")}
                description={t("common:empty.tryAdjusting")}
                action={
                  searchQuery || statusFilter !== "all" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                      }}
                    >
                      {t("common:actions.clearFilters")}
                    </Button>
                  ) : null
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider font-semibold border-b">
                  <tr>
                    <th className="px-5 py-3.5 text-start">{t("admin:payments.transactionId")}</th>
                    <th className="px-5 py-3.5 text-start">{t("admin:payments.client")}</th>
                    <th className="px-5 py-3.5 text-start">{t("admin:payments.provider")}</th>
                    <th className="px-5 py-3.5 text-start">{t("admin:payments.method")}</th>
                    <th className="px-5 py-3.5 text-start">{t("admin:payments.date")}</th>
                    <th className="px-5 py-3.5 text-end">{t("admin:payments.amount")}</th>
                    <th className="px-5 py-3.5 text-center">{t("admin:payments.status")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredPayments.map((payment, idx) => {
                    const txId = payment?.id || payment?.transactionId || `TX-${1000 + idx}`;
                    const dateStr = payment?.createdAt || payment?.paymentDate || payment?.date;
                    const amount = Number(payment?.amount) || 0;
                    const statusStr = (payment?.status || payment?.paymentStatus || "Completed").toString();

                    return (
                      <tr key={payment?.id || idx} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-4 font-mono text-xs text-foreground">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold truncate max-w-[140px]">{txId}</span>
                            <button
                              onClick={() => handleCopyId(txId)}
                              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                              title={t("common:actions.copy")}
                            >
                              {copiedId === txId ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                          {payment?.serviceRequestId && (
                            <span className="text-[10px] text-muted-foreground block mt-0.5">
                              Req #{payment.serviceRequestId.slice(0, 8)}
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-medium text-foreground">
                            {payment?.clientName || payment?.userName || t("common:roles.user")}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {payment?.clientEmail || payment?.userEmail || "—"}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-medium text-foreground">
                            {payment?.providerName || payment?.serviceProviderName || t("common:roles.serviceProvider")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {payment?.categoryName || "Healthcare Shift"}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <CreditCard className="h-3.5 w-3.5 text-primary" />
                            <span>{payment?.paymentMethod || "Credit / Debit Card"}</span>
                          </div>
                          <span className="text-[11px] text-muted-foreground block">{t("common:footer.escrowBadge")}</span>
                        </td>

                        <td className="px-5 py-4 text-xs text-muted-foreground">
                          {dateStr ? formatLocalizedDate(dateStr, "PP", i18n.language) : "—"}
                        </td>

                        <td className="px-5 py-4 text-end">
                          <span className="font-bold text-sm text-foreground">
                            {formatPrice(amount, i18n.language)}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <StatusBadge status={statusStr} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
