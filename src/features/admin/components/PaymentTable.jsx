import { CreditCard, Copy, Check, AlertCircle } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import EmptyState from "@/components/shared/EmptyState";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatLocalizedDate } from "@/lib/utils";

export default function PaymentTable({
  paymentsLoading,
  paymentsError,
  onRetry,
  filteredPayments,
  searchQuery,
  statusFilter,
  onClearFilters,
  onCopyId,
  copiedId,
  language,
}) {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <Card className="shadow-xs overflow-hidden">
      <CardHeader className="p-5 pb-3 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">
              {t("admin:dashboard.recentBookings")}
            </CardTitle>
            <CardDescription className="text-xs">{t("admin:payments.subtitle")}</CardDescription>
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
        ) : paymentsError ? (
          <div className="py-12">
            <EmptyState
              icon={AlertCircle}
              title={t("common:error")}
              description={t("common:empty.tryAdjusting")}
              actionLabel={t("common:actions.retry")}
              onAction={onRetry}
            />
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={CreditCard}
              title={t("common:empty.noResults")}
              description={t("common:empty.tryAdjusting")}
              action={
                searchQuery || statusFilter !== "all" ? (
                  <Button variant="outline" size="sm" onClick={onClearFilters}>
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
                  const statusStr = (
                    payment?.status ||
                    payment?.paymentStatus ||
                    "Completed"
                  ).toString();

                  return (
                    <tr key={payment?.id || idx} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-foreground">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold truncate max-w-[140px]">{txId}</span>
                          <button
                            onClick={() => onCopyId(txId)}
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
                          {payment?.providerName ||
                            payment?.serviceProviderName ||
                            t("common:roles.serviceProvider")}
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
                        <span className="text-[11px] text-muted-foreground block">
                          {t("common:footer.escrowBadge")}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {dateStr ? formatLocalizedDate(dateStr, "PP", language) : "—"}
                      </td>

                      <td className="px-5 py-4 text-end">
                        <span className="font-bold text-sm text-foreground">
                          {formatPrice(amount, "EGP", language)}
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
  );
}

PaymentTable.propTypes = {
  paymentsLoading: PropTypes.bool,
  paymentsError: PropTypes.bool,
  onRetry: PropTypes.func,
  filteredPayments: PropTypes.array.isRequired,
  searchQuery: PropTypes.string.isRequired,
  statusFilter: PropTypes.string.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  onCopyId: PropTypes.func.isRequired,
  copiedId: PropTypes.string,
  language: PropTypes.string.isRequired,
};
