import { useAsync } from '../useAsync';
import { categoriesService, type GetCategoriesResult } from '@/services/categories';

export function useCategories() {
  const query = useAsync<GetCategoriesResult>(
    () => categoriesService.getAll(),
    []
  );

  return {
    categories: query.data?.data || [],
    isFallback: query.data?.isFallback ?? true,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
