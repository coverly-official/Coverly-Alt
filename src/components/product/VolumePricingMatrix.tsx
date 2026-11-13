import React from 'react';
import { formatCurrency, cn } from '@/lib/utils';
import type { PriceTier } from '@/data/types';
import { Check } from 'lucide-react';

export interface VolumePricingMatrixProps {
  tiers: PriceTier[];
  selectedTierIndex: number;
  onSelectTier: (index: number, tier: PriceTier) => void;
}

export const VolumePricingMatrix: React.FC<VolumePricingMatrixProps> = ({
  tiers,
  selectedTierIndex,
  onSelectTier,
}) => {
  return (
    <div className="space-y-2 select-none">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
          Tiered Volume Pricing (FOB Factory)
        </label>
        <span className="text-[11px] text-ink-tertiary">Select tier to update RFQ</span>
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden divide-y divide-white/10 bg-canvas/60">
        {tiers.map((tier, idx) => {
          const isSelected = selectedTierIndex === idx;
          const qtyText = tier.max_qty
            ? `${tier.min_qty.toLocaleString()} – ${tier.max_qty.toLocaleString()} units`
            : `${tier.min_qty.toLocaleString()}+ units`;

          return (
            <div
              key={idx}
              onClick={() => onSelectTier(idx, tier)}
              className={cn(
                'flex items-center justify-between p-3.5 cursor-pointer transition-all duration-200',
                isSelected
                  ? 'bg-gold/15 border-l-4 border-l-gold text-white font-semibold'
                  : 'hover:bg-white/5 text-ink-body border-l-4 border-l-transparent'
              )}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border flex items-center justify-center text-[10px]',
                    isSelected ? 'border-gold bg-gold text-canvas' : 'border-white/20'
                  )}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span className="text-xs">{qtyText}</span>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold tabular-nums text-white">
                  {formatCurrency(tier.unit_price)}
                </span>
                <span className="text-[10px] text-ink-secondary ml-1">/ unit</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
