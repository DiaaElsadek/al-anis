import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const colorVariants = {
  amber: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  blue: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  purple: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
  green: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
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
 * @param {string} props.label — display text or status enum string
 * @param {"amber"|"blue"|"purple"|"green"|"red"|"gray"} props.color — color variant
 * @param {string} [props.className]
 */
export default function StatusBadge({ label, color = "gray", className }) {
  const { t, i18n } = useTranslation("common");

  const normalizedKey = typeof label === "string" ? keyMap[label.toLowerCase()] : null;
  const displayLabel =
    normalizedKey && i18n.exists(`status.${normalizedKey}`)
      ? t(`status.${normalizedKey}`)
      : label;

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium border",
        colorVariants[color] || colorVariants.gray,
        className
      )}
    >
      {displayLabel}
    </Badge>
  );
}
