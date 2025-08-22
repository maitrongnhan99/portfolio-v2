import { useState, useEffect, useCallback } from "react";
import { useApiRequest } from "./use-api-request";
import { usePagination } from "./use-pagination";
import { useFilters } from "./use-filters";

interface KnowledgeFilters {
  search: string;
  category: string;
  sortBy: string;
}

interface KnowledgeChunk {
  _id: string;
  content: string;
  metadata: {
    category: string;
    priority: number;
    tags: string[];
    source: string;
    lastUpdated: string;
  };
  createdBy?: {
    name: string;
    email: string;
  };
  queryCount: number;
  version: number;
}

interface KnowledgeResponse {
  chunks: KnowledgeChunk[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

export const useKnowledgeData = () => {
  const [chunks, setChunks] = useState<KnowledgeChunk[]>([]);
  const [stats, setStats] = useState(null);
  const [totalItems, setTotalItems] = useState(0);

  const { filters, debouncedFilters, updateFilter, queryParams } = useFilters<KnowledgeFilters>({
    initialFilters: {
      search: "",
      category: "",
      sortBy: "createdAt",
    },
  });

  const { 
    currentPage, 
    totalPages, 
    hasNextPage, 
    hasPreviousPage, 
    nextPage, 
    previousPage,
    resetPage,
    pagination 
  } = usePagination({
    totalItems,
  });

  const { execute: fetchChunks, loading } = useApiRequest({
    onSuccess: (data: KnowledgeResponse) => {
      setChunks(data.chunks);
      setTotalItems(data.pagination.total);
    },
    errorMessage: "Failed to fetch knowledge chunks",
  });

  const { execute: fetchStats } = useApiRequest({
    onSuccess: setStats,
  });

  const loadData = useCallback(async () => {
    const params = new URLSearchParams({
      ...Object.fromEntries(queryParams),
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
    });

    await fetchChunks(`/api/admin/knowledge?${params}`);
  }, [fetchChunks, queryParams, pagination]);

  const loadStats = useCallback(async () => {
    await fetchStats("/api/admin/stats");
  }, [fetchStats]);

  const refresh = useCallback(async () => {
    await Promise.all([loadData(), loadStats()]);
  }, [loadData, loadStats]);

  // Load data when filters or pagination changes
  useEffect(() => {
    loadData();
  }, [debouncedFilters, pagination.page]);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    resetPage();
  }, [debouncedFilters.search, debouncedFilters.category, debouncedFilters.sortBy]);

  return {
    chunks,
    stats,
    loading,
    filters,
    updateFilter,
    pagination: {
      currentPage,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage,
    },
    refresh,
  };
};