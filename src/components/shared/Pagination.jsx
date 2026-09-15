import { ChevronLeft, ChevronRight } from "lucide-react";

import DirectionalIcon from "@/components/shared/DirectionalIcon";
import { Button } from "@/components/ui/button";

/**
 * Pagination — page navigation controls with automatic RTL chevron flipping
 */
export default function Pagination({
  page,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
}) {
  if (totalPages <= 1) return null;

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 py-4">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={!hasPreviousPage}
        onClick={() => onPageChange(page - 1)}
      >
        <DirectionalIcon icon={ChevronLeft} className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((pageNum) => (
        <Button
          key={pageNum}
          variant={pageNum === page ? "default" : "outline"}
          size="icon"
          className="h-8 w-8 text-xs font-mono"
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
      >
        <DirectionalIcon icon={ChevronRight} className="h-4 w-4" />
      </Button>
    </div>
  );
}
