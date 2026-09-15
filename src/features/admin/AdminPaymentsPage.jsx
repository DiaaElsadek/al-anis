import { useState, useMemo } from "react";
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
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";

export default function AdminPaymentsPage() {
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
    toast.success("Transaction ID copied to clipboard");
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
      toast.info("No transaction data available to export");
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
    toast.success("Payments CSV exported successfully");
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
            Payments & Escrow Ledger
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Monitor escrow payments, transaction audit logs, and platform shift earnings.
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
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={handleExportCsv}
            className="h-9 gap-1.5 shadow-sm"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs border-border/80">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Escrow Volume
              </p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">
                {statsLoading ? <Skeleton className="h-8 w-24" /> : formatPrice(totalRevenue)}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Gross platform transaction value</p>
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
                Total Transactions
              </p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">
                {paymentsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  rawPayments.length || stats?.completedServiceRequests || 0
                )}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Recorded shift payments</p>
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
                Avg. Shift Value
              </p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">
                {formatPrice(avgTransaction || 450)}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Average paid per booked shift</p>
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
                Escrow Security
              </p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">100% Safe</h3>
              <p className="text-xs text-muted-foreground mt-1">Payout released upon shift completion</p>
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transaction ID, client, or provider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>

            <div className="flex items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] h-10">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="All Statuses" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed / Paid</SelectItem>
                  <SelectItem value="pending">Pending Escrow</SelectItem>
                  <SelectItem value="failed">Failed / Refunded</SelectItem>
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
              <CardTitle className="text-lg font-bold">Transaction History</CardTitle>
              <CardDescription>
                Showing {filteredPayments.length} of {rawPayments.length} platform transactions
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
                title="No Transactions Found"
                description={
                  searchQuery || statusFilter !== "all"
                    ? "No transactions match your search filters. Try adjusting your query."
                    : "No shift payments or escrow transactions have been processed yet."
                }
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
                      Clear Filters
                    </Button>
                  ) : null
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider font-semibold border-b">
                  <tr>
                    <th className="px-5 py-3.5">Transaction ID</th>
                    <th className="px-5 py-3.5">Client</th>
                    <th className="px-5 py-3.5">Service Provider</th>
                    <th className="px-5 py-3.5">Payment Method</th>
                    <th className="px-5 py-3.5">Date & Time</th>
                    <th className="px-5 py-3.5 text-right">Amount</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredPayments.map((payment, idx) => {
                    const txId = payment?.id || payment?.transactionId || `TX-${1000 + idx}`;
                    const dateStr = payment?.createdAt || payment?.paymentDate || payment?.date;
                    const amount = Number(payment?.amount) || 0;
                    const statusStr = (payment?.status || payment?.paymentStatus || "Completed").toString();
                    const isSuccess =
                      statusStr.toLowerCase().includes("complet") ||
                      statusStr.toLowerCase().includes("succeed") ||
                      statusStr === "1" ||
                      statusStr.toLowerCase() === "paid";

                    return (
                      <tr key={payment?.id || idx} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-4 font-mono text-xs text-foreground">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold truncate max-w-[140px]">{txId}</span>
                            <button
                              onClick={() => handleCopyId(txId)}
                              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                              title="Copy ID"
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
                            {payment?.clientName || payment?.userName || "Verified Client"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {payment?.clientEmail || payment?.userEmail || "client@alanis.app"}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-medium text-foreground">
                            {payment?.providerName || payment?.serviceProviderName || "Verified Provider"}
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
                          <span className="text-[11px] text-muted-foreground block">Escrow Protected</span>
                        </td>

                        <td className="px-5 py-4 text-xs text-muted-foreground">
                          {dateStr ? (
                            <>
                              <div>{format(new Date(dateStr), "dd MMM yyyy")}</div>
                              <div className="text-[11px]">{format(new Date(dateStr), "hh:mm a")}</div>
                            </>
                          ) : (
                            "Recent"
                          )}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <span className="font-bold text-base text-foreground">
                            {formatPrice(amount)}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center">
                          {isSuccess ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Completed
                            </Badge>
                          ) : statusStr.toLowerCase().includes("pend") ? (
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1">
                              <Clock className="h-3 w-3" />
                              In Escrow
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {statusStr}
                            </Badge>
                          )}
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
