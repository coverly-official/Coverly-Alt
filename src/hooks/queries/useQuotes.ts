import { useAsync } from '../useAsync';
import { quotesService } from '@/services/quotes';
import type { Quote } from '@/data/types';

export function useQuotes() {
  const query = useAsync<{ data: Quote[]; isFallback: boolean; error: Error | null }>(
    () => quotesService.getAll(),
    []
  );

  return {
    quotes: query.data?.data || [],
    isFallback: query.data?.isFallback ?? true,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    setData: query.setData,
  };
}
