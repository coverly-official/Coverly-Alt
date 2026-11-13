import { insforge, isInsForgeConfigured } from '@/lib/insforge';
import type { Rfq } from '@/data/types';
import { getPopulatedRfqs } from '@/data/quotes';
import { populatedMockProducts } from '@/data/products';

let inMemoryRfqs: Rfq[] = [...getPopulatedRfqs()];

export interface CreateRfqInput {
  buyer_id?: string;
  product_id: string;
  target_qty: number;
  target_unit_price: number;
  destination_port: string;
  notes: string;
  attachment_urls: string[];
  attachment_keys: string[];
  is_sample?: boolean;
}

export const rfqsService = {
  async getAll(): Promise<{ data: Rfq[]; isFallback: boolean; error: Error | null }> {
    if (!isInsForgeConfigured) {
      return { data: inMemoryRfqs, isFallback: true, error: null };
    }

    try {
      const { data, error } = await insforge.database
        .from('rfqs')
        .select()
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return { data: inMemoryRfqs, isFallback: true, error: error ? new Error(error.message) : null };
      }

      // Populate relations
      const populated = (data as Rfq[]).map((rfq) => {
        const product = populatedMockProducts.find((p) => p.id === rfq.product_id);
        return {
          ...rfq,
          product,
          supplier: product?.supplier,
        };
      });

      return { data: populated, isFallback: false, error: null };
    } catch (err) {
      return { data: inMemoryRfqs, isFallback: true, error: err as Error };
    }
  },

  async create(input: CreateRfqInput): Promise<{ data: Rfq | null; error: Error | null }> {
    const newId = `rfq-${Date.now().toString().slice(-6)}`;
    const product = populatedMockProducts.find((p) => p.id === input.product_id);

    const newRfq: Rfq = {
      id: newId,
      buyer_id: input.buyer_id || 'buyer-demo-01',
      product_id: input.product_id,
      target_qty: input.target_qty,
      target_unit_price: input.target_unit_price,
      destination_port: input.destination_port,
      notes: input.notes,
      attachment_urls: input.attachment_urls,
      attachment_keys: input.attachment_keys,
      status: 'pending',
      is_sample: Boolean(input.is_sample),
      created_at: new Date().toISOString(),
      product,
      supplier: product?.supplier,
    };

    if (!isInsForgeConfigured) {
      inMemoryRfqs = [newRfq, ...inMemoryRfqs];
      return { data: newRfq, error: null };
    }

    try {
      // InsForge SDK requirement: Database inserts take an array
      const { data, error } = await insforge.database
        .from('rfqs')
        .insert([{
          id: newId,
          buyer_id: input.buyer_id || '00000000-0000-0000-0000-000000000001',
          product_id: input.product_id,
          target_qty: input.target_qty,
          target_unit_price: input.target_unit_price,
          destination_port: input.destination_port,
          notes: input.notes,
          attachment_urls: input.attachment_urls,
          attachment_keys: input.attachment_keys,
          status: 'pending',
          is_sample: Boolean(input.is_sample),
        }]);

      if (error) {
        // Fall back to in-memory so user experience remains seamless
        inMemoryRfqs = [newRfq, ...inMemoryRfqs];
        return { data: newRfq, error: new Error(error.message) };
      }

      inMemoryRfqs = [newRfq, ...inMemoryRfqs];
      return { data: (data?.[0] as unknown as Rfq) || newRfq, error: null };
    } catch (err) {
      inMemoryRfqs = [newRfq, ...inMemoryRfqs];
      return { data: newRfq, error: err as Error };
    }
  },
};
