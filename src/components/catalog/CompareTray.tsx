import React, { useState } from 'react';
import type { Product } from '@/data/types';
import { ProductVisual } from '@/components/ui/ProductVisual';
import { Button } from '@/components/ui/Button';
import { CompareModal } from './CompareModal';
import { X, Layers, ArrowRight } from 'lucide-react';

export interface CompareTrayProps {
  products: Product[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onRequestQuote: (product: Product) => void;
}

export const CompareTray: React.FC<CompareTrayProps> = ({
  products,
  onRemove,
  onClear,
  onRequestQuote,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (products.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-4 inset-x-0 z-40 max-w-4xl mx-auto px-4 select-none">
        <div className="glass-strong rounded-2xl p-3 border border-gold/40 shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                Compare Tray ({products.length}/4)
              </span>
              <span className="text-[10px] text-ink-secondary hidden sm:inline">
                Evaluate tolerances, MOQs, & FOB rates
              </span>
            </div>
          </div>

          {/* Thumbnails row */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {products.map((p) => (
              <div
                key={p.id}
                className="relative group w-12 h-10 rounded-lg overflow-hidden border border-white/20 shrink-0 bg-canvas"
              >
                <ProductVisual
                  categorySlug={p.category?.slug}
                  angleIndex={0}
                  aspectRatio="1/1"
                  showStageLighting={false}
                  className="w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => onRemove(p.id)}
                  className="absolute inset-0 bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove SKU"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClear}
              className="text-[11px] text-ink-secondary hover:text-white px-2 py-1 transition-colors hidden sm:inline"
            >
              Clear
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setModalOpen(true)}
              className="font-bold text-xs gap-1.5 h-9 px-4"
            >
              <span>Compare ({products.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <CompareModal
        products={products}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onRemove={onRemove}
        onRequestQuote={onRequestQuote}
      />
    </>
  );
};
