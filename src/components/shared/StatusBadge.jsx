import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import {
  PaymentStatusLabels,
  ServiceProviderApplicationStatusLabels,
  ServiceProviderStatusLabels,
  ServiceRequestStatusLabels,
  statusColorMap,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const colorVariants = {
  amber:
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  blue: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  purple:
    "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
  green:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  red: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  gray: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800",
};

const keyMap = {
  pending: "pending",
  accepted: "accepted",
  "in progress": "inProgress",
  inprogress: "inProgress",
  completed: "completed",
  rejected: "rejected",
  cancelled: "cancelled",
  active: "active",
  suspended: "suspended",
  approved: "approved",
  paid: "paid",
  "in escrow": "escrowed",
  escrowed: "escrowed",
  failed: "failed",
  refunded: "refunded",
};

/**
 * StatusBadge — color-coded badge for any status enum with automatic localization
 *
 * @param {Object} props
 * @param {number|string} [props.status] — numeric enum value or status string
 * @param {string} [props.label] — optional explicit display text or status enum string
 * @param {"amber"|"blue"|"purple"|"green"|"red"|"gray"} [props.color] — color variant override
 * @param {"request"|"application"|"provider"|"payment"} [props.type="request"] — domain entity type
 * @param {string} [props.className]
 */
export default function StatusBadge({ status, label, color, type = "request", className }) {
  const { t, i18n } = useTranslation("common");

  // Determine fallback label from numeric status if label wasn't provided
  let rawLabel = label;
  if (!rawLabel && status !== undefined && status !== null) {
    if (typeof status === "number") {
      if (type === "application") {
        rawLabel = ServiceProviderApplicationStatusLabels[status] || String(status);
      } else if (type === "provider") {
        rawLabel = ServiceProviderStatusLabels[status] || String(status);
      } else if (type === "payment") {
        rawLabel = PaymentStatusLabels[status] || String(status);
      } else {
        rawLabel = ServiceRequestStatusLabels[status] || String(status);
      }
    } else {
      rawLabel = String(status);
    }
  }

  // Resolve color
  const resolvedColor =
    color ||
    (status !== undefined && status !== null ? statusColorMap[status] : null) ||
    (rawLabel ? statusColorMap[String(rawLabel).toLowerCase()] : null) ||
    "gray";

  const normalizedKey = typeof rawLabel === "string" ? keyMap[rawLabel.toLowerCase()] : null;
  const displayLabel =
    normalizedKey && i18n.exists(`status.${normalizedKey}`)
      ? t(`status.${normalizedKey}`)
      : rawLabel || "";

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium border",
        colorVariants[resolvedColor] || colorVariants.gray,
        className
      )}
    >
      {displayLabel}
    </Badge>
  );
}
