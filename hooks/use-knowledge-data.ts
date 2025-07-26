import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS, ITEMS_PER_PAGE } from "@/lib/admin/constants";
import { usePagination } from "./use-pagination";

interface KnowledgeChunk {
  _id: string;
  content: string;
  category: string;
  priority: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

interface KnowledgeStats {
  totalChunks: number;
  activeChunks: number;
  categoryCounts: Record<string, number>;
}

interface Filters {
  search: string;
  category: string;
  priority: string;
  isActive: string;
  sortBy?: string;
}

interface UseKnowledgeDataReturn {
  chunks: KnowledgeChunk[];
  stats: KnowledgeStats | null;
  loading: boolean;
  filters: Filters;
  updateFilter: (key: keyof Filters, value: string) => void;
  pagination: ReturnType<typeof usePagination>;
  refresh: () => Promise<void>;
  deleteChunk: (id: string) => Promise<void>;
}

function useKnowledgeData(): UseKnowledgeDataReturn {
  const [chunks, setChunks] = useState<KnowledgeChunk[]>([]);
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "all",
    priority: "all",
    isActive: "all",
    sortBy: "createdAt",
  });

  const { toast } = useToast();
  const pagination = usePagination({
    totalItems,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const fetchChunks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...Object.entries(filters).reduce((acc, [key, value]) => {
          if (value && value !== "all") {
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, string>),
      });

      const response = await fetch(`${API_ENDPOINTS.knowledge}?${params}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setChunks(data.chunks);
      setTotalItems(data.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch knowledge chunks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, toast]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.stats);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setStats(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch statistics",
        variant: "destructive",
      });
    }
  }, [toast]);

  const deleteChunk = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`${API_ENDPOINTS.knowledge}/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }

        toast({
          title: "Success",
          description: "Knowledge chunk deleted successfully",
        });

        await fetchChunks();
        await fetchStats();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete knowledge chunk",
          variant: "destructive",
        });
      }
    },
    [fetchChunks, fetchStats, toast]
  );

  const updateFilter = useCallback(
    (key: keyof Filters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      pagination.resetPage();
    },
    [pagination]
  );

  const refresh = useCallback(async () => {
    await Promise.all([fetchChunks(), fetchStats()]);
  }, [fetchChunks, fetchStats]);

  useEffect(() => {
    fetchChunks();
  }, [fetchChunks]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    chunks,
    stats,
    loading,
    filters,
    updateFilter,
    pagination,
    refresh,
    deleteChunk,
  };
}

export { useKnowledgeData };
export type { KnowledgeChunk, KnowledgeStats, Filters };