import React from 'react';
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import type { ProductFilters } from '@/services/products';

export interface SortBarProps {
  total: number;
  sortBy?: ProductFilters['sortBy'];
  onSortChange: (sort: ProductFilters['sortBy']) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onOpenMobileFilters: () => void;
}

export const SortBar: React.FC<SortBarProps> = ({
  total,
  sortBy = 'best_match',
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenMobileFilters,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-white/10 select-none">
      <div className="flex items-center gap-3">
        {/* Mobile Filter Trigger Button */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-elevated/70 border border-white/15 text-xs font-semibold text-white hover:border-gold/50 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-gold" />
          <span>Filters</span>
        </button>

        <span className="text-xs text-ink-secondary">
          Showing <strong className="text-white tabular-nums font-bold">{total}</strong> verified industrial parts
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-ink-secondary hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as ProductFilters['sortBy'])}
            className="h-9 px-3 bg-canvas/80 text-white rounded-lg border border-white/15 text-xs focus:outline-none focus:ring-1 focus:ring-gold"
          >
            <option value="best_match">Best Match (Audited)</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="moq_asc">MOQ: Low to High</option>
            <option value="lead_time_asc">Fastest Lead Time</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-0.5 rounded-lg bg-canvas border border-white/10">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-md text-xs transition-colors ${
              viewMode === 'grid' ? 'bg-elevated text-gold' : 'text-ink-secondary hover:text-white'
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded-md text-xs transition-colors ${
              viewMode === 'list' ? 'bg-elevated text-gold' : 'text-ink-secondary hover:text-white'
            }`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
