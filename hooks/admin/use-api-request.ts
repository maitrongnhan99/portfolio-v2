import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseApiRequestOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export const useApiRequest = (options: UseApiRequestOptions = {}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (
    url: string,
    requestOptions?: RequestInit
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      if (options.successMessage) {
        toast({
          title: "Success",
          description: options.successMessage,
        });
      }

      options.onSuccess?.(data);
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      
      toast({
        title: "Error",
        description: options.errorMessage || error.message,
        variant: "destructive",
      });

      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast, options]);

  return { execute, loading, error };
};