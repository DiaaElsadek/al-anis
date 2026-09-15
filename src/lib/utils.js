import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a price value to a readable string using Latin digits
 */
export function formatPrice(amount, currency = "EGP", locale) {
  const isArabic = typeof document !== "undefined" && document.documentElement.lang === "ar";
  const activeLocale = locale || (isArabic ? "ar-EG" : "en-US");
  try {
    return new Intl.NumberFormat(activeLocale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
      numberingSystem: "latn",
    }).format(amount || 0);
  } catch {
    return `${(amount || 0).toLocaleString()} ${isArabic ? "ج.م" : "EGP"}`;
  }
}

/**
 * Format date using active locale (Arabic or English)
 */
export function formatLocalizedDate(date, formatStr = "dd MMM yyyy", lng) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  const isArabic = (lng || (typeof document !== "undefined" ? document.documentElement.lang : "en")) === "ar";
  return format(d, formatStr, { locale: isArabic ? ar : enUS });
}

/**
 * Return appropriate localized category name from bilingual backend entity
 */
export function getLocalizedCategoryName(category, lng) {
  if (!category) return "";
  const isArabic = (lng || (typeof document !== "undefined" ? document.documentElement.lang : "en")) === "ar";
  if (isArabic) {
    return category.name || category.nameEn || "";
  }
  return category.nameEn || category.name || "";
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

/**
 * Convert relative media/file paths from backend into absolute URLs
 */
export function getMediaUrl(path) {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }
  const baseUrl = (
    import.meta.env.VITE_BASE_URL || "https://elanis.runasp.net"
  ).replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
