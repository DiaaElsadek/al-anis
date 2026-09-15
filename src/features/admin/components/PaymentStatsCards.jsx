import { DollarSign, CreditCard, TrendingUp, ShieldCheck } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";

export default function PaymentStatsCards({
  statsLoading,
  paymentsLoading,
  totalRevenue,
  rawPaymentsLength,
  completedShifts,
  avgTransaction,
  language,
}) {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="shadow-xs border-border/80">
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("admin:payments.totalVolume")}
            </p>
            <h3 className="text-2xl font-bold mt-1 text-foreground">
              {statsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                formatPrice(totalRevenue, "EGP", language)
              )}
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
                rawPaymentsLength || completedShifts || 0
              )}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {t("admin:dashboard.completedShifts")}
            </p>
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
              {formatPrice(avgTransaction || 450, "EGP", language)}
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
  );
}

PaymentStatsCards.propTypes = {
  statsLoading: PropTypes.bool,
  paymentsLoading: PropTypes.bool,
  totalRevenue: PropTypes.number.isRequired,
  rawPaymentsLength: PropTypes.number.isRequired,
  completedShifts: PropTypes.number,
  avgTransaction: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired,
};
