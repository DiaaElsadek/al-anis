import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a price value to a readable string
 */
export function formatPrice(amount, currency = "EGP") {
  return `${amount.toLocaleString()} ${currency}`;
}

/**
 * Get initials from a full name
 */
export function getInitials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncate text to a max length
 */
export function truncate(str, maxLength = 100) {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}
