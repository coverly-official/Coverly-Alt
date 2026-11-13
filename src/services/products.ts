import { insforge, isInsForgeConfigured } from '@/lib/insforge';
import type { Product } from '@/data/types';
import { populatedMockProducts, getProductWithRelations } from '@/data/products';
import { mockSuppliers } from '@/data/suppliers';
import { mockCategories } from '@/data/categories';

export interface ProductFilters {
  categoryId?: string;
  categorySlug?: string;
  searchQuery?: string;
  goldVerifiedOnly?: boolean;
  escrowOnly?: boolean;
  sampleOnly?: boolean;
  maxLeadTimeDays?: number;
  minMoq?: number;
  maxMoq?: number;
  minPrice?: number;
  maxPrice?: number;
  countryCode?: string;
  sortBy?: 'best_match' | 'price_asc' | 'price_desc' | 'moq_asc' | 'lead_time_asc';
}

export interface GetProductsResult {
  data: Product[];
  total: number;
  isFallback: boolean;
  error: Error | null;
}

export const productsService = {
  async getAll(filters?: ProductFilters): Promise<GetProductsResult> {
    if (!isInsForgeConfigured) {
      return this.filterMockData(filters);
    }

    try {
      let query = insforge.database.from('products').select();

      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      if (filters?.escrowOnly) {
        query = query.eq('escrow_eligible', true);
      }
      if (filters?.sampleOnly) {
        query = query.eq('sample_available', true);
      }

      const { data, error } = await query;

      if (error || !data || data.length === 0) {
        return this.filterMockData(filters);
      }

      // Attach relations
      const populated = (data as Product[]).map((p) => {
        const supplier = mockSuppliers.find((s) => s.id === p.supplier_id);
        const category = mockCategories.find((c) => c.id === p.category_id);
        return { ...p, supplier, category };
      });

      // Apply client-side filters for finer constraints
      const filtered = this.applyClientFilters(populated, filters);
      return { data: filtered, total: filtered.length, isFallback: false, error: null };
    } catch (err) {
      return this.filterMockData(filters);
    }
  },

  async getById(id: string): Promise<{ data: Product | null; isFallback: boolean; error: Error | null }> {
    if (!isInsForgeConfigured) {
      const found = populatedMockProducts.find((p) => p.id === id) || null;
      return { data: found, isFallback: true, error: null };
    }

    try {
      const { data, error } = await insforge.database
        .from('products')
        .select()
        .eq('id', id)
        .single();

      if (error || !data) {
        const found = populatedMockProducts.find((p) => p.id === id) || null;
        return { data: found, isFallback: true, error: error ? new Error(error.message) : null };
      }

      const populated = getProductWithRelations(data as Product);
      return { data: populated, isFallback: false, error: null };
    } catch (err) {
      const found = populatedMockProducts.find((p) => p.id === id) || null;
      return { data: found, isFallback: true, error: err as Error };
    }
  },

  filterMockData(filters?: ProductFilters): GetProductsResult {
    const filtered = this.applyClientFilters(populatedMockProducts, filters);
    return {
      data: filtered,
      total: filtered.length,
      isFallback: true,
      error: null,
    };
  },

  applyClientFilters(items: Product[], filters?: ProductFilters): Product[] {
    if (!filters) return items;

    let result = [...items];

    if (filters.categorySlug && filters.categorySlug !== 'all') {
      result = result.filter((p) => p.category?.slug === filters.categorySlug);
    }

    if (filters.categoryId) {
      result = result.filter((p) => p.category_id === filters.categoryId);
    }

    if (filters.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.supplier?.name.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }

    if (filters.goldVerifiedOnly) {
      result = result.filter((p) => p.supplier?.verified && (p.supplier?.tier === 'Diamond' || p.supplier?.tier === 'Gold'));
    }

    if (filters.escrowOnly) {
      result = result.filter((p) => p.escrow_eligible);
    }

    if (filters.sampleOnly) {
      result = result.filter((p) => p.sample_available);
    }

    if (filters.maxLeadTimeDays) {
      result = result.filter((p) => p.lead_time_days <= filters.maxLeadTimeDays!);
    }

    if (filters.minMoq !== undefined) {
      result = result.filter((p) => p.moq >= filters.minMoq!);
    }
    if (filters.maxMoq !== undefined) {
      result = result.filter((p) => p.moq <= filters.maxMoq!);
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      result = result.filter((p) => {
        const lowestTierPrice = p.price_tiers[p.price_tiers.length - 1]?.unit_price ?? 0;
        if (filters.minPrice !== undefined && lowestTierPrice < filters.minPrice) return false;
        if (filters.maxPrice !== undefined && lowestTierPrice > filters.maxPrice) return false;
        return true;
      });
    }

    if (filters.countryCode && filters.countryCode !== 'all') {
      result = result.filter((p) => p.supplier?.country_code === filters.countryCode);
    }

    // Sort order
    if (filters.sortBy === 'price_asc') {
      result.sort((a, b) => (a.price_tiers[0]?.unit_price || 0) - (b.price_tiers[0]?.unit_price || 0));
    } else if (filters.sortBy === 'price_desc') {
      result.sort((a, b) => (b.price_tiers[0]?.unit_price || 0) - (a.price_tiers[0]?.unit_price || 0));
    } else if (filters.sortBy === 'moq_asc') {
      result.sort((a, b) => a.moq - b.moq);
    } else if (filters.sortBy === 'lead_time_asc') {
      result.sort((a, b) => a.lead_time_days - b.lead_time_days);
    }

    return result;
  },
};
