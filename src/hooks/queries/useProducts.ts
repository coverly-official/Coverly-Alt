import { useAsync } from '../useAsync';
import { productsService, type ProductFilters, type GetProductsResult } from '@/services/products';

export function useProducts(filters?: ProductFilters) {
  const query = useAsync<GetProductsResult>(
    () => productsService.getAll(filters),
    [
      filters?.categoryId,
      filters?.categorySlug,
      filters?.searchQuery,
      filters?.goldVerifiedOnly,
      filters?.escrowOnly,
      filters?.sampleOnly,
      filters?.maxLeadTimeDays,
      filters?.minMoq,
      filters?.maxMoq,
      filters?.minPrice,
      filters?.maxPrice,
      filters?.countryCode,
      filters?.sortBy,
    ]
  );

  return {
    products: query.data?.data || [],
    total: query.data?.total || 0,
    isFallback: query.data?.isFallback ?? true,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
