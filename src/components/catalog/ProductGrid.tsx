import React from 'react';
import type { Product } from '@/data/types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { FlagIcon } from '@/components/ui/FlagIcon';
import { SupplierBadge } from '@/components/ui/SupplierBadge';
import { PriceTiers } from '@/components/ui/PriceTiers';
import { ProductVisual } from '@/components/ui/ProductVisual';
import { Link } from 'react-router-dom';

export interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  onQuickView: (product: Product) => void;
  onRequestQuote: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  comparedIds: string[];
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  viewMode,
  onQuickView,
  onRequestQuote,
  onToggleCompare,
  comparedIds,
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No Industrial SKUs Matched Your Criteria"
        description="Try adjusting your MOQ range, lead time filters, or submit a custom RFQ directly to our audited factory database."
        actionText="Reset Filters & Explore"
        onAction={onResetFilters}
      />
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((p) => {
          return (
            <div
              key={p.id}
              className="glass-card rounded-2xl p-4 border border-white/10 hover:border-gold/50 transition-colors flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 select-none"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-canvas">
                  <ProductVisual
                    categorySlug={p.category?.slug}
                    angleIndex={0}
                    aspectRatio="4/3"
                    className="w-full h-full"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <SupplierBadge verified={p.supplier?.verified ?? false} tier={p.supplier?.tier} size="sm" />
                    <span className="text-xs text-ink-secondary flex items-center gap-1">
                      <FlagIcon countryCode={p.supplier?.country_code ?? 'DE'} size="sm" />
                      <span>{p.supplier?.name}</span>
                    </span>
                  </div>
                  <Link to={`/product/${p.id}`}>
                    <h3 className="text-sm font-bold text-white hover:text-gold transition-colors truncate">
                      {p.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-ink-secondary mt-0.5 line-clamp-1">
                    HS: {p.hs_code} • Port: {p.port_of_origin} • Dispatch: {p.lead_time_days} days
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-white/10">
                <div className="text-right">
                  <PriceTiers tiers={p.price_tiers} compact />
                  <span className="text-[11px] text-ink-secondary">MOQ: {p.moq} pcs</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onQuickView(p)}
                    className="h-9 px-3 rounded-xl bg-elevated/70 border border-white/15 text-xs text-ink-body hover:text-white"
                  >
                    Quick View
                  </button>
                  <button
                    type="button"
                    onClick={() => onRequestQuote(p)}
                    className="h-9 px-4 rounded-xl bg-gold hover:bg-gold-hover text-canvas font-bold text-xs"
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onQuickView={onQuickView}
          onRequestQuote={onRequestQuote}
          onToggleCompare={onToggleCompare}
          isCompared={comparedIds.includes(p.id)}
        />
      ))}
    </div>
  );
};
