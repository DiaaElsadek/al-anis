import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
          <Table className="text-xs text-start">
            <TableHeader>
              <TableRow className="border-b border-border text-muted-foreground">
                <TableHead className="py-2.5 font-semibold text-start">
                  {t("admin:pricing.category")}
                </TableHead>
                <TableHead className="py-2.5 font-semibold text-start">
                  {t("admin:payments.client")}
                </TableHead>
                <TableHead className="py-2.5 font-semibold text-start">
                  {t("admin:payments.provider")}
                </TableHead>
                <TableHead className="py-2.5 font-semibold text-start">
                  {t("admin:payments.date")}
                </TableHead>
                <TableHead className="py-2.5 font-semibold text-end">
                  {t("admin:payments.amount")}
                </TableHead>
                <TableHead className="py-2.5 font-semibold text-end">
                  {t("admin:payments.status")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/50">
              {recentBookings.map((b) => (
                <TableRow key={b.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="py-3 font-semibold text-foreground">
                    {b.categoryName || "Healthcare Shift"}
                  </TableCell>
                  <TableCell className="py-3 text-muted-foreground">{b.userName}</TableCell>
                  <TableCell className="py-3 text-foreground font-medium">
                    {b.providerName}
                  </TableCell>
                  <TableCell className="py-3 text-muted-foreground">
                    {formatLocalizedDate(b.date, "PP", language)}
                  </TableCell>
                  <TableCell className="py-3 text-end font-bold text-foreground">
                    {formatPrice(b.amount, "EGP", language)}
                  </TableCell>
                  <TableCell className="py-3 text-end">
                    <StatusBadge status={b.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
