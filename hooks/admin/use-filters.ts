import { useState, useCallback, useMemo } from "react";

interface UseFiltersProps<T extends Record<string, any>> {
  initialFilters?: Partial<T>;
  debounceDelay?: number;
}

export const useFilters = <T extends Record<string, any>>({
  initialFilters = {} as Partial<T>,
  debounceDelay = 300,
}: UseFiltersProps<T> = {}) => {
  const [filters, setFilters] = useState<Partial<T>>(initialFilters);
  const [debouncedFilters, setDebouncedFilters] = useState<Partial<T>>(initialFilters);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout>();

  const updateFilter = useCallback(<K extends keyof T>(
    key: K,
    value: T[K] | undefined
  ) => {
    setFilters(prev => {
      if (value === undefined || value === "") {
        const { [key]: _, ...rest } = prev;
        return rest as Partial<T>;
      }
      return { ...prev, [key]: value };
    });

    // Debounce the filter update
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      setDebouncedFilters(prev => {
        if (value === undefined || value === "") {
          const { [key]: _, ...rest } = prev;
          return rest as Partial<T>;
        }
        return { ...prev, [key]: value };
      });
    }, debounceDelay);

    setDebounceTimeout(timeout);
  }, [debounceDelay, debounceTimeout]);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setDebouncedFilters(initialFilters);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
  }, [initialFilters, debounceTimeout]);

  const queryParams = useMemo(() => {
    return new URLSearchParams(
      Object.entries(debouncedFilters)
        .filter(([_, value]) => value !== undefined && value !== "")
        .map(([key, value]) => [key, String(value)])
    );
  }, [debouncedFilters]);

  return {
    filters,
    debouncedFilters,
    updateFilter,
    resetFilters,
    queryParams,
  };
};