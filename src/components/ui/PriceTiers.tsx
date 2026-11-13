import React from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import type { PriceTier } from '@/data/types';

export interface PriceTiersProps {
  tiers: PriceTier[];
  selectedTierIndex?: number;
  onSelectTier?: (tier: PriceTier, index: number) => void;
  interactive?: boolean;
  compact?: boolean;
  className?: string;
}

export const PriceTiers: React.FC<PriceTiersProps> = ({
  tiers,
  selectedTierIndex,
  onSelectTier,
  interactive = false,
  compact = false,
  className,
}) => {
  if (!tiers || tiers.length === 0) return null;

  if (compact) {
    const lowest = tiers[tiers.length - 1]?.unit_price ?? 0;
    const highest = tiers[0]?.unit_price ?? 0;
    const isRange = lowest !== highest;

    return (
      <div className={cn('tabular-nums font-semibold text-white', className)}>
        {isRange ? (
          <span>
            {formatCurrency(lowest)} – {formatCurrency(highest)}
            <span className="text-xs text-ink-secondary font-normal ml-1">/ unit</span>
          </span>
        ) : (
          <span>
            {formatCurrency(lowest)}
            <span className="text-xs text-ink-secondary font-normal ml-1">/ unit</span>
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('w-full grid grid-cols-3 gap-2', className)}>
      {tiers.map((tier, idx) => {
        const isSelected = selectedTierIndex === idx;
        const qtyLabel = tier.max_qty
          ? `${tier.min_qty}–${tier.max_qty}`
          : `${tier.min_qty}+`;

        return (
          <div
            key={idx}
            onClick={() => interactive && onSelectTier && onSelectTier(tier, idx)}
            className={cn(
              'p-2.5 rounded-xl border text-center transition-all duration-200 select-none',
              interactive ? 'cursor-pointer hover:border-gold/50 hover:bg-white/5' : '',
              isSelected
                ? 'bg-gold/15 border-l-4 border-gold shadow-sm text-white'
                : 'bg-canvas/50 border-white/10 text-ink-body'
            )}
          >
            <div className="text-[11px] uppercase tracking-wider text-ink-secondary font-medium mb-1">
              {qtyLabel} pcs
            </div>
            <div className="text-sm md:text-base font-bold tabular-nums text-white">
              {formatCurrency(tier.unit_price)}
            </div>
            <div className="text-[10px] text-ink-tertiary">/ unit</div>
          </div>
        );
      })}
    </div>
  );
};
