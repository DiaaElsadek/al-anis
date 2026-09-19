import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

/**
 * Pagination — page navigation controls wrapping shadcn pagination with automatic RTL chevron flipping
 *
 * @param {Object} props
 * @param {number} [props.page]
 * @param {number} [props.currentPage]
 * @param {number} props.totalPages
 * @param {Function} props.onPageChange
 * @param {boolean} [props.hasNextPage]
 * @param {boolean} [props.hasPreviousPage]
 * @param {string} [props.className]
 */
export default function Pagination({
  page,
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
  className,
}) {
  const activePage = currentPage ?? page ?? 1;
  if (!totalPages || totalPages <= 1) return null;

  const hasPrev = hasPreviousPage ?? activePage > 1;
  const hasNext = hasNextPage ?? activePage < totalPages;

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, activePage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <ShadcnPagination className={className}>
      <PaginationContent className="py-4">
        <PaginationItem>
          <PaginationPrevious
            disabled={!hasPrev}
            onClick={() => hasPrev && onPageChange(activePage - 1)}
          />
        </PaginationItem>

        {pages[0] > 1 && (
          <>
            <PaginationItem>
              <PaginationLink
                isActive={activePage === 1}
                className="h-8 w-8 text-xs font-mono"
                onClick={() => onPageChange(1)}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {pages[0] > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {pages.map((pageNum) => (
          <PaginationItem key={pageNum}>
            <PaginationLink
              isActive={pageNum === activePage}
              className="h-8 w-8 text-xs font-mono"
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                isActive={activePage === totalPages}
                className="h-8 w-8 text-xs font-mono"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            disabled={!hasNext}
            onClick={() => hasNext && onPageChange(activePage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  );
}
