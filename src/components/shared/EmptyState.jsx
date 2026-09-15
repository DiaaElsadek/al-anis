import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * EmptyState — shown when a list has no items or when queries fail
 *
 * @param {Object} props
 * @param {React.ElementType} [props.icon] — lucide icon component
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {React.ReactNode} [props.action] — optional custom CTA node
 * @param {string} [props.actionLabel] — optional CTA button text
 * @param {Function} [props.onAction] — optional CTA button click handler
 * @param {string} [props.actionVariant] — optional button variant (default: "outline")
 * @param {string} [props.className]
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
  actionVariant = "outline",
  className,
}) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center text-center py-16 px-4", className)}
    >
      {Icon && <Icon className="h-12 w-12 text-muted-foreground/40 mb-4" />}
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>}
      {action ||
        (actionLabel && onAction && (
          <Button variant={actionVariant} onClick={onAction}>
            {actionLabel}
          </Button>
        ))}
    </div>
  );
}
