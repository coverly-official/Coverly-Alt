import { insforge, isInsForgeConfigured } from '@/lib/insforge';
import type { Quote } from '@/data/types';
import { getPopulatedQuotes } from '@/data/quotes';

let inMemoryQuotes: Quote[] = [...getPopulatedQuotes()];

export const quotesService = {
  async getAll(): Promise<{ data: Quote[]; isFallback: boolean; error: Error | null }> {
    if (!isInsForgeConfigured) {
      return { data: inMemoryQuotes, isFallback: true, error: null };
    }

    try {
      const { data, error } = await insforge.database
        .from('quotes')
        .select()
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return { data: inMemoryQuotes, isFallback: true, error: error ? new Error(error.message) : null };
      }

      return { data: data as Quote[], isFallback: false, error: null };
    } catch (err) {
      return { data: inMemoryQuotes, isFallback: true, error: err as Error };
    }
  },

  async updateStatus(
    id: string,
    status: Quote['status'],
    counterPrice?: number
  ): Promise<{ data: Quote | null; error: Error | null }> {
    const existingIndex = inMemoryQuotes.findIndex((q) => q.id === id);
    if (existingIndex !== -1) {
      inMemoryQuotes[existingIndex] = {
        ...inMemoryQuotes[existingIndex],
        status,
        counter_price: counterPrice ?? inMemoryQuotes[existingIndex].counter_price,
        counter_offer: status === 'counter_offered' ? true : inMemoryQuotes[existingIndex].counter_offer,
      };
    }

    if (!isInsForgeConfigured) {
      return { data: inMemoryQuotes[existingIndex] || null, error: null };
    }

    try {
      const payload: Partial<Quote> = { status };
      if (counterPrice !== undefined) {
        payload.counter_price = counterPrice;
        payload.counter_offer = true;
      }

      const { data, error } = await insforge.database
        .from('quotes')
        .update(payload)
        .eq('id', id);

      if (error) {
        return { data: inMemoryQuotes[existingIndex] || null, error: new Error(error.message) };
      }

      return { data: (data?.[0] as unknown as Quote) || inMemoryQuotes[existingIndex], error: null };
    } catch (err) {
      return { data: inMemoryQuotes[existingIndex] || null, error: err as Error };
    }
  },
};
