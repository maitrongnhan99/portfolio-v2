import { useState, useCallback, useMemo } from "react";

interface UsePaginationProps {
  initialPage?: number;
  itemsPerPage?: number;
  totalItems?: number;
}

export const usePagination = ({
  initialPage = 1,
  itemsPerPage = 10,
  totalItems = 0,
}: UsePaginationProps = {}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(
    () => Math.ceil(totalItems / itemsPerPage),
    [totalItems, itemsPerPage]
  );

  const hasNextPage = useMemo(
    () => currentPage < totalPages,
    [currentPage, totalPages]
  );

  const hasPreviousPage = useMemo(
    () => currentPage > 1,
    [currentPage]
  );

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPreviousPage]);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
    resetPage,
    pagination: {
      page: currentPage,
      limit: itemsPerPage,
    },
  };
};