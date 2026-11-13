import { useAsync } from '../useAsync';
import { rfqsService } from '@/services/rfqs';
import type { Rfq } from '@/data/types';

export function useRfqs() {
  const query = useAsync<{ data: Rfq[]; isFallback: boolean; error: Error | null }>(
    () => rfqsService.getAll(),
    []
  );

  return {
    rfqs: query.data?.data || [],
    isFallback: query.data?.isFallback ?? true,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    setData: query.setData,
  };
}
