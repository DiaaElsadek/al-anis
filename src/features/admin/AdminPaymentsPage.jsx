import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search, Download, RefreshCw, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { getAdminPayments, getDashboardStats } from "@/api/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaymentStatsCards from "@/features/admin/components/PaymentStatsCards";
import PaymentTable from "@/features/admin/components/PaymentTable";

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
    isError: paymentsError,
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
      const id = (payment?.id || payment?.transactionId || payment?.referenceNumber || "")
        .toString()
        .toLowerCase();
      const client = (
        payment?.clientName ||
        payment?.userName ||
        payment?.clientEmail ||
        ""
      ).toLowerCase();
      const provider = (payment?.providerName || payment?.serviceProviderName || "").toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query || id.includes(query) || client.includes(query) || provider.includes(query);

      const status = (payment?.status || payment?.paymentStatus || "completed")
        .toString()
        .toLowerCase();
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" &&
          (status.includes("complet") ||
            status.includes("succeed") ||
            status === "1" ||
            status === "paid")) ||
        (statusFilter === "pending" && (status.includes("pend") || status === "0")) ||
        (statusFilter === "failed" &&
          (status.includes("fail") || status.includes("cancel") || status === "2"));

      return matchesSearch && matchesStatus;
    });
  }, [rawPayments, searchQuery, statusFilter]);

  // Export visible transactions to CSV
  const handleExportCsv = () => {
    if (!filteredPayments.length) {
      toast.info(t("common:empty.noResults"));
      return;
    }

    const headers = [
      "Transaction ID",
      "Client",
      "Provider",
      "Amount (EGP)",
      "Method",
      "Status",
      "Date",
    ];
    const rows = filteredPayments.map((p) => [
      `"${p.id || p.transactionId || "N/A"}"`,
      `"${p.clientName || p.userName || "Client"}"`,
      `"${p.providerName || p.serviceProviderName || "Provider"}"`,
      `"${p.amount || 0}"`,
      `"${p.paymentMethod || "Escrow/Card"}"`,
      `"${p.status || "Completed"}"`,
      `"${p.createdAt ? format(new Date(p.createdAt), "yyyy-MM-dd HH:mm") : "N/A"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
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
          <Button size="sm" onClick={handleExportCsv} className="h-9 gap-1.5 shadow-sm">
            <Download className="h-4 w-4" />
            {t("common:actions.exportCsv")}
          </Button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <PaymentStatsCards
        statsLoading={statsLoading}
        paymentsLoading={paymentsLoading}
        totalRevenue={totalRevenue}
        rawPaymentsLength={rawPayments.length}
        completedShifts={stats?.completedServiceRequests}
        avgTransaction={avgTransaction}
        language={i18n.language}
      />

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
      <PaymentTable
        paymentsLoading={paymentsLoading}
        paymentsError={paymentsError}
        onRetry={() => refetch()}
        filteredPayments={filteredPayments}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onClearFilters={() => {
          setSearchQuery("");
          setStatusFilter("all");
        }}
        onCopyId={handleCopyId}
        copiedId={copiedId}
        language={i18n.language}
      />
    </div>
  );
}
