import { clsx } from "clsx";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

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
  const isArabic =
    (lng || (typeof document !== "undefined" ? document.documentElement.lang : "en")) === "ar";
  return format(d, formatStr, { locale: isArabic ? ar : enUS });
}

/**
 * Return appropriate localized category name from bilingual backend entity
 */
export function getLocalizedCategoryName(category, lng) {
  if (!category) return "";
  const isArabic =
    (lng || (typeof document !== "undefined" ? document.documentElement.lang : "en")) === "ar";
  if (isArabic) {
    return category.name || category.nameEn || "";
  }
  return category.nameEn || category.name || "";
}

/**
 * Return appropriate localized category description from bilingual backend entity
 */
export function getLocalizedCategoryDescription(category, lng) {
  if (!category) return "";
  const isArabic =
    (lng || (typeof document !== "undefined" ? document.documentElement.lang : "en")) === "ar";
  if (isArabic) {
    return category.descriptionAr || category.description || "";
  }
  return category.description || category.descriptionAr || "";
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
  const baseUrl = (import.meta.env.VITE_BASE_URL || "https://elanis.runasp.net").replace(
    /\/+$/,
    ""
  );
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Shared mutation error handler (D1) — extracts message from API envelope
 * and displays a toast. Use as the default `onError` for every useMutation.
 *
 * @param {Error} error — Axios or envelope error
 * @param {Function} t — i18next t function
 * @param {string} [fallbackKey="common:error"] — translation key for the toast title
 * @param {Object} [toastOpts] — extra sonner options (e.g. { id: "unique-id" })
 */
export function handleMutationError(error, t, fallbackKey = "common:error.title", toastOpts = {}) {
  const actualKey = fallbackKey === "common:error" ? "common:error.title" : fallbackKey;
  const rawTitle = typeof t === "function" ? t(actualKey, { defaultValue: "Error" }) : "Error";
  const title = typeof rawTitle === "string" ? rawTitle : "Error";
  const msg =
    error?.response?.data?.message ||
    (Array.isArray(error?.response?.data?.errors)
      ? error.response.data.errors.join(", ")
      : typeof error?.response?.data?.errors === "object" && error?.response?.data?.errors !== null
        ? Object.values(error.response.data.errors).flat().join(", ")
        : null) ||
    error?.message ||
    title;
  toast.error(title, { description: msg, ...toastOpts });
}

/**
 * Filter a list of service requests by tab name (D4).
 * Works for both client and provider request pages.
 *
 * @param {Array} requests
 * @param {string} tab — "all" | "pending" | "accepted" | "inprogress" | "completed" | "rejected" | "cancelled"
 * @returns {Array} filtered requests
 */
export function filterRequestsByTab(requests = [], tab = "all") {
  if (tab === "all") return requests;
  return requests.filter((r) => {
    const s = r.statusName?.toLowerCase() || "";
    switch (tab) {
      case "pending":
        return r.status === 0 || s.includes("pending");
      case "accepted":
        return r.status === 1 || s.includes("accepted");
      case "inprogress":
        return r.status === 2 || s.includes("progress");
      case "completed":
        return r.status === 3 || s.includes("completed");
      case "rejected":
        return r.status === 4 || s.includes("rejected");
      case "cancelled":
        return r.status === 5 || s.includes("cancelled");
      default:
        return true;
    }
  });
}

/**
 * Get an i18n-aware shift label (D8).
 * Falls back to ShiftTypeLabels[shift] if no translation found.
 *
 * @param {number|string} shift — shift type enum value
 * @param {Function} t — i18next t function
 * @param {string} [backendName] — optional backend-provided name to prefer
 */
export function getShiftLabel(shift, t, backendName) {
  if (backendName) return backendName;
  const keys = { 0: "morning", 1: "evening", 2: "night" };
  const key = keys[Number(shift)];
  if (key && t) {
    const translated = t(`common:shifts.${key}`);
    if (translated !== `common:shifts.${key}`) return translated;
  }
  // Fallback to English labels
  const labels = { 0: "Morning", 1: "Evening", 2: "Night" };
  return labels[Number(shift)] || "Shift";
}

/**
 * Safely decodes a JSON Web Token payload without external dependencies
 *
 * @param {string} token - Raw JWT string
 * @returns {Object|null} Decoded JSON claims or null if invalid
 */
export function parseJwt(token) {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
