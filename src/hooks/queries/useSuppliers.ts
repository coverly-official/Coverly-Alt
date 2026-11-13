import { useAsync } from '../useAsync';
import { suppliersService, type GetSuppliersResult } from '@/services/suppliers';

export function useSuppliers() {
  const query = useAsync<GetSuppliersResult>(
    () => suppliersService.getAll(),
    []
  );

  return {
    suppliers: query.data?.data || [],
    isFallback: query.data?.isFallback ?? true,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
