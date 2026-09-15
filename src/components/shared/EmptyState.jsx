import { cn } from "@/lib/utils";

/**
 * EmptyState — shown when a list has no items
 *
 * @param {Object} props
 * @param {React.ElementType} [props.icon] — lucide icon component
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {React.ReactNode} [props.action] — optional CTA button
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-4",
        className
      )}
    >
      {Icon && (
        <Icon className="h-12 w-12 text-muted-foreground/40 mb-4" />
      )}
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
