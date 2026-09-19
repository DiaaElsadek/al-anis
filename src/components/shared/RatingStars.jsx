import { Star } from "lucide-react";
import { useState } from "react";

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
 * @param {string} [props.className]
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
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (starIndex) => {
    if (interactive && onChange) {
      onChange(starIndex + 1);
    }
  };

  const activeRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxStars }).map((_, i) => {
        const isFilled = i < Math.floor(activeRating);
        const starIcon = (
          <Star
            className={cn(
              size,
              "transition-colors",
              isFilled ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/30"
            )}
          />
        );

        if (interactive) {
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleClick(i)}
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 focus:outline-none transition-transform hover:scale-125"
            >
              {starIcon}
            </button>
          );
        }

        return <span key={i}>{starIcon}</span>;
      })}
      {showValue && (
        <span className="text-sm text-muted-foreground ms-1.5">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
