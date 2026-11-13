import { insforge, isInsForgeConfigured } from '@/lib/insforge';
import type { Category } from '@/data/types';
import { mockCategories } from '@/data/categories';

export interface GetCategoriesResult {
  data: Category[];
  isFallback: boolean;
  error: Error | null;
}

export const categoriesService = {
  async getAll(): Promise<GetCategoriesResult> {
    if (!isInsForgeConfigured) {
      return { data: mockCategories, isFallback: true, error: null };
    }

    try {
      const { data, error } = await insforge.database
        .from('categories')
        .select()
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return { data: mockCategories, isFallback: true, error: error ? new Error(error.message) : null };
      }

      return { data: data as Category[], isFallback: false, error: null };
    } catch (err) {
      return { data: mockCategories, isFallback: true, error: err as Error };
    }
  },

  async getBySlug(slug: string): Promise<{ data: Category | null; isFallback: boolean; error: Error | null }> {
    const all = await this.getAll();
    const found = all.data.find((c) => c.slug === slug) || null;
    return { data: found, isFallback: all.isFallback, error: all.error };
  },
};
