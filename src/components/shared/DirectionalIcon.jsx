import { cn } from "@/lib/utils";

/**
 * DirectionalIcon — wraps a Lucide icon and flips horizontally in RTL mode
 *
 * @param {Object} props
 * @param {React.ComponentType} props.icon — Lucide icon component
 * @param {string} [props.className] — additional classes
 */
export default function DirectionalIcon({ icon: Icon, className, ...props }) {
  if (!Icon) return null;
  return (
    <Icon
      className={cn("rtl:-scale-x-100 transition-transform", className)}
      {...props}
    />
  );
}
