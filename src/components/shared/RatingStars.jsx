import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * RatingStars — displays a star rating
 *
 * @param {Object} props
 * @param {number} props.rating — value 0-5
 * @param {number} [props.maxStars=5]
 * @param {string} [props.size="h-4 w-4"]
 * @param {boolean} [props.interactive=false] — if true, stars are clickable
 * @param {Function} [props.onChange] — callback when star is clicked (interactive mode)
 * @param {boolean} [props.showValue=false] — show numeric value next to stars
 */
export default function RatingStars({
  rating = 0,
  maxStars = 5,
  size = "h-4 w-4",
  interactive = false,
  onChange,
  showValue = false,
  className,
}) {
  const handleClick = (starIndex) => {
    if (interactive && onChange) {
      onChange(starIndex + 1);
    }
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxStars }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            size,
            interactive && "cursor-pointer transition-colors",
            i < Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-none text-muted-foreground/30"
          )}
          onClick={() => handleClick(i)}
        />
      ))}
      {showValue && (
        <span className="text-sm text-muted-foreground ms-1.5">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
