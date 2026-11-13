import { useAsync } from '../useAsync';
import { productsService } from '@/services/products';
import type { Product } from '@/data/types';

export function useProduct(id: string | undefined) {
  const query = useAsync<{ data: Product | null; isFallback: boolean; error: Error | null }>(
    async () => {
      if (!id) return { data: null, isFallback: true, error: null };
      return productsService.getById(id);
    },
    [id]
  );

  return {
    product: query.data?.data || null,
    isFallback: query.data?.isFallback ?? true,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
