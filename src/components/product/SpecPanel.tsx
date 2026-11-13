import React from 'react';
import type { Product } from '@/data/types';
import { SupplierBadge } from '@/components/ui/SupplierBadge';
import { FlagIcon } from '@/components/ui/FlagIcon';
import { VolumePricingMatrix } from './VolumePricingMatrix';
import { Truck, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SpecPanelProps {
  product: Product;
  selectedTierIndex: number;
  onSelectTier: (index: number) => void;
  selectedCustomizations: string[];
  onToggleCustomization: (custom: string) => void;
}

export const SpecPanel: React.FC<SpecPanelProps> = ({
  product,
  selectedTierIndex,
  onSelectTier,
  selectedCustomizations,
  onToggleCustomization,
}) => {
  return (
    <div className="space-y-6">
      {/* Title & Supplier Line */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight leading-tight mb-3">
          {product.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <SupplierBadge
            verified={product.supplier?.verified ?? false}
            tier={product.supplier?.tier}
            size="md"
          />
          <div className="flex items-center gap-1.5 text-ink-secondary">
            <FlagIcon countryCode={product.supplier?.country_code ?? 'DE'} size="sm" />
            <span className="font-semibold text-white">{product.supplier?.name}</span>
          </div>
          <span className="text-ink-tertiary">•</span>
          <span className="text-emerald-400 font-mono font-medium">
            {product.supplier?.on_time_pct}% on-time dispatch
          </span>
        </div>
      </div>

      {/* Volume Pricing Matrix */}
      <VolumePricingMatrix
        tiers={product.price_tiers}
        selectedTierIndex={selectedTierIndex}
        onSelectTier={(idx) => onSelectTier(idx)}
      />

      {/* Technical Specifications Table */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-ink-secondary block">
          Verified Technical Parameters
        </label>
        <div className="rounded-xl border border-white/10 overflow-hidden divide-y divide-white/10 bg-canvas/40 text-xs">
          {Object.entries(product.specs).map(([label, val]) => (
            <div key={label} className="flex items-center justify-between p-3">
              <span className="text-ink-secondary font-medium">{label}</span>
              <span className="font-mono text-white text-right tabular-nums">{val}</span>
            </div>
          ))}
          <div className="flex items-center justify-between p-3">
            <span className="text-ink-secondary font-medium">HS Tariff Code</span>
            <span className="font-mono text-gold font-bold">{product.hs_code}</span>
          </div>
          <div className="flex items-center justify-between p-3">
            <span className="text-ink-secondary font-medium">Port of Origin</span>
            <span className="text-white font-medium">{product.port_of_origin}</span>
          </div>
        </div>
      </div>

      {/* Customization Options (OEM/ODM Chips) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-ink-secondary block">
          Custom Manufacturing Options
        </label>
        <div className="flex flex-wrap gap-2">
          {product.customization.map((item) => {
            const isChecked = selectedCustomizations.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => onToggleCustomization(item)}
                className={cn(
                  'px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5',
                  isChecked
                    ? 'bg-gold/20 border-gold text-white shadow-sm'
                    : 'bg-elevated/60 border-white/15 text-ink-secondary hover:text-white hover:border-white/30'
                )}
              >
                <div
                  className={cn(
                    'w-3.5 h-3.5 rounded flex items-center justify-center border',
                    isChecked ? 'bg-gold border-gold text-canvas' : 'border-white/30'
                  )}
                >
                  {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Freight Timelines by Destination Port */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-ink-secondary flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-gold" />
          <span>Estimated Ocean Freight Timelines</span>
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-canvas/70 border border-white/10">
            <span className="text-white font-semibold block">Rotterdam / Hamburg</span>
            <span className="text-[11px] text-ink-secondary tabular-nums">4–7 days (Short Sea / Rail)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-canvas/70 border border-white/10">
            <span className="text-white font-semibold block">Long Beach / Oakland</span>
            <span className="text-[11px] text-ink-secondary tabular-nums">14–18 days (Transpacific)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
