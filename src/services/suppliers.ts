import { insforge, isInsForgeConfigured } from '@/lib/insforge';
import type { Supplier } from '@/data/types';
import { mockSuppliers } from '@/data/suppliers';

export interface GetSuppliersResult {
  data: Supplier[];
  isFallback: boolean;
  error: Error | null;
}

export const suppliersService = {
  async getAll(): Promise<GetSuppliersResult> {
    if (!isInsForgeConfigured) {
      return { data: mockSuppliers, isFallback: true, error: null };
    }

    try {
      const { data, error } = await insforge.database
        .from('suppliers')
        .select()
        .order('response_rate', { ascending: false });

      if (error || !data || data.length === 0) {
        return { data: mockSuppliers, isFallback: true, error: error ? new Error(error.message) : null };
      }

      return { data: data as Supplier[], isFallback: false, error: null };
    } catch (err) {
      return { data: mockSuppliers, isFallback: true, error: err as Error };
    }
  },

  async getById(id: string): Promise<{ data: Supplier | null; isFallback: boolean; error: Error | null }> {
    if (!isInsForgeConfigured) {
      const found = mockSuppliers.find((s) => s.id === id) || null;
      return { data: found, isFallback: true, error: null };
    }

    try {
      const { data, error } = await insforge.database
        .from('suppliers')
        .select()
        .eq('id', id)
        .single();

      if (error || !data) {
        const found = mockSuppliers.find((s) => s.id === id) || null;
        return { data: found, isFallback: true, error: error ? new Error(error.message) : null };
      }

      return { data: data as Supplier, isFallback: false, error: null };
    } catch (err) {
      const found = mockSuppliers.find((s) => s.id === id) || null;
      return { data: found, isFallback: true, error: err as Error };
    }
  },
};
