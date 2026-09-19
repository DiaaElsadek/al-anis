import { useState, useCallback, useMemo } from "react";

import { PAGINATION_DEFAULT_PAGE_SIZE } from "@/lib/constants";

/**
 * Pagination state hook
 */
export function usePagination(defaultPageSize = PAGINATION_DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = useMemo(() => Math.ceil(totalCount / pageSize) || 1, [totalCount, pageSize]);

  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const nextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const previousPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToPage = useCallback(
    (pageNumber) => {
      setPage(Math.max(1, Math.min(pageNumber, totalPages)));
    },
    [totalPages]
  );

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return {
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    setPage,
    setPageSize,
    setTotalCount,
    nextPage,
    previousPage,
    goToPage,
    resetPage,
  };
}
