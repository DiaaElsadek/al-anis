import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatLocalizedDate } from "@/lib/utils";

export default function RecentBookingsList({ recentBookings, bookingsLoading, language }) {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold">
            {t("admin:dashboard.recentBookings")}
          </CardTitle>
          <CardDescription className="text-xs">{t("admin:payments.subtitle")}</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="text-xs" asChild>
          <Link to="/admin/payments">{t("admin:dashboard.viewAllTransactions")}</Link>
        </Button>
      </CardHeader>

      <CardContent>
        {bookingsLoading ? (
          <div className="space-y-2 py-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground">
            {t("common:empty.noResults")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2.5 font-semibold text-start">{t("admin:pricing.category")}</th>
                  <th className="py-2.5 font-semibold text-start">{t("admin:payments.client")}</th>
                  <th className="py-2.5 font-semibold text-start">
                    {t("admin:payments.provider")}
                  </th>
                  <th className="py-2.5 font-semibold text-start">{t("admin:payments.date")}</th>
                  <th className="py-2.5 font-semibold text-end">{t("admin:payments.amount")}</th>
                  <th className="py-2.5 font-semibold text-end">{t("admin:payments.status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-semibold text-foreground">
                      {b.categoryName || "Healthcare Shift"}
                    </td>
                    <td className="py-3 text-muted-foreground">{b.userName}</td>
                    <td className="py-3 text-foreground font-medium">{b.providerName}</td>
                    <td className="py-3 text-muted-foreground">
                      {formatLocalizedDate(b.date, "PP", language)}
                    </td>
                    <td className="py-3 text-end font-bold text-foreground">
                      {formatPrice(b.amount, "EGP", language)}
                    </td>
                    <td className="py-3 text-end">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

RecentBookingsList.propTypes = {
  recentBookings: PropTypes.array.isRequired,
  bookingsLoading: PropTypes.bool,
  language: PropTypes.string.isRequired,
};
