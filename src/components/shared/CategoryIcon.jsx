import {
  Stethoscope,
  HeartHandshake,
  Baby,
  Activity,
  GraduationCap,
  Sparkles,
  HeartPulse,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Mapping of emoji / icon string tokens to Lucide components
const ICON_MAP = {
  // Stethoscope / Nursing
  "🩺": Stethoscope,
  stethoscope: Stethoscope,
  nursing: Stethoscope,
  medical: Stethoscope,

  // Elderly care / Companionship
  "👵": HeartHandshake,
  "👴": HeartHandshake,
  elderly: HeartHandshake,
  companion: HeartHandshake,
  companionship: HeartHandshake,

  // Baby / Childcare
  "👶": Baby,
  baby: Baby,
  child: Baby,
  childcare: Baby,
  babysitting: Baby,
  infant: Baby,

  // Physiotherapy / Rehabilitation
  "🏃‍♂️": Activity,
  "🏃": Activity,
  activity: Activity,
  physio: Activity,
  physiotherapy: Activity,
  rehab: Activity,
  rehabilitation: Activity,

  // Tutoring / Academic
  "📚": GraduationCap,
  graduationcap: GraduationCap,
  book: GraduationCap,
  tutoring: GraduationCap,
  education: GraduationCap,
  academic: GraduationCap,

  // Housekeeping / Domestic
  "🧹": Sparkles,
  sparkles: Sparkles,
  cleaning: Sparkles,
  housekeeping: Sparkles,
  domestic: Sparkles,

  // General fallbacks
  "🌟": Sparkles,
  star: Sparkles,
  health: HeartPulse,
};

/**
 * Resolves an icon identifier (string, emoji, or component) to a Lucide icon component
 */
export function resolveCategoryIcon(icon, name = "") {
  if (typeof icon === "function" || (typeof icon === "object" && icon !== null && icon.$$typeof)) {
    return icon;
  }

  const iconKey = typeof icon === "string" ? icon.trim().toLowerCase() : "";
  if (iconKey && ICON_MAP[iconKey]) {
    return ICON_MAP[iconKey];
  }

  // Check direct emoji without lowercase modification
  if (typeof icon === "string" && ICON_MAP[icon.trim()]) {
    return ICON_MAP[icon.trim()];
  }

  // Fallback by inspecting the category name
  const lowerName = (name || "").toLowerCase();
  if (lowerName.includes("nurs") || lowerName.includes("تمريض") || lowerName.includes("صح")) {
    return Stethoscope;
  }
  if (lowerName.includes("elder") || lowerName.includes("مسن") || lowerName.includes("كبر")) {
    return HeartHandshake;
  }
  if (
    lowerName.includes("child") ||
    lowerName.includes("baby") ||
    lowerName.includes("طفل") ||
    lowerName.includes("أطفال")
  ) {
    return Baby;
  }
  if (
    lowerName.includes("physio") ||
    lowerName.includes("علاج طبيعي") ||
    lowerName.includes("تأهيل")
  ) {
    return Activity;
  }
  if (lowerName.includes("tutor") || lowerName.includes("درس") || lowerName.includes("تعليم")) {
    return GraduationCap;
  }
  if (lowerName.includes("clean") || lowerName.includes("تدبير") || lowerName.includes("منزل")) {
    return Sparkles;
  }

  return Stethoscope;
}

/**
 * CategoryIcon component:
 * Replaces any emoji or string icon representation with a clean, responsive Lucide icon.
 *
 * @param {Object} props
 * @param {string|React.ComponentType} [props.icon] - Emoji string (e.g. '🩺'), icon name (e.g. 'Stethoscope'), or Lucide component
 * @param {string} [props.name] - Optional category name for keyword-based heuristic fallback
 * @param {string} [props.className] - CSS classes
 */
export default function CategoryIcon({ icon, name, className, ...props }) {
  const IconComponent = resolveCategoryIcon(icon, name);
  return <IconComponent className={cn("shrink-0", className)} {...props} />;
}
