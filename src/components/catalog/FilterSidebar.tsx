import React from 'react';
import { AccordionItem } from '@/components/ui/Accordion';
import { Slider } from '@/components/ui/Slider';
import { ShieldCheck, RotateCcw } from 'lucide-react';
import type { ProductFilters } from '@/services/products';

export interface FilterSidebarProps {
  filters: ProductFilters;
  onChange: (updated: ProductFilters) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  const moqRange: [number, number] = [
    filters.minMoq ?? 0,
    filters.maxMoq ?? 10000,
  ];

  return (
    <div className="w-full lg:w-[280px] shrink-0 space-y-4 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="text-xs font-bold uppercase tracking-wider text-white">
          Sourcing Filters
        </span>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-ink-secondary hover:text-gold flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Verification and Compliance */}
      <AccordionItem title="Verification & Audits" defaultOpen={true}>
        <div className="space-y-2.5 text-xs">
          <label className="flex items-center gap-2 cursor-pointer hover:text-white text-ink-body">
            <input
              type="checkbox"
              checked={Boolean(filters.goldVerifiedOnly)}
              onChange={(e) => onChange({ ...filters, goldVerifiedOnly: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 bg-canvas text-gold focus:ring-gold"
            />
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>Gold / Diamond Verified</span>
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-white text-ink-body">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-white/20 bg-canvas text-gold focus:ring-gold"
            />
            <span>ISO 9001 Certified Factory</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-white text-ink-body">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-white/20 bg-canvas text-gold focus:ring-gold"
            />
            <span>CE & RoHS Compliant</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-white text-ink-body">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-white/20 bg-canvas text-gold focus:ring-gold"
            />
            <span>OEM / ODM Custom Capable</span>
          </label>
        </div>
      </AccordionItem>

      {/* 2. Commercial Terms */}
      <AccordionItem title="Commercial Terms" defaultOpen={true}>
        <div className="space-y-4 text-xs">
          {/* Dual-Handle MOQ Slider */}
          <Slider
            min={0}
            max={10000}
            step={100}
            value={moqRange}
            onChange={(val) => onChange({ ...filters, minMoq: val[0], maxMoq: val[1] })}
            label="MOQ Bracket (units)"
            formatValue={(v) => (v === 0 ? 'Any' : v.toLocaleString())}
          />

          {/* Unit Price Bracket Inputs */}
          <div>
            <label className="block text-[11px] font-medium text-ink-secondary mb-1.5">
              Unit Price Limit (USD)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min $"
                value={filters.minPrice ?? ''}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    minPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full h-9 px-2.5 bg-canvas/80 rounded-lg border border-white/15 text-xs text-white tabular-nums placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <span className="text-ink-secondary text-xs">–</span>
              <input
                type="number"
                placeholder="Max $"
                value={filters.maxPrice ?? ''}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full h-9 px-2.5 bg-canvas/80 rounded-lg border border-white/15 text-xs text-white tabular-nums placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>

          {/* Trade Assurance & Sample Toggles */}
          <div className="pt-2 space-y-2 border-t border-white/10">
            <label className="flex items-center justify-between cursor-pointer text-ink-body hover:text-white">
              <span>Trade Escrow Eligible</span>
              <input
                type="checkbox"
                checked={Boolean(filters.escrowOnly)}
                onChange={(e) => onChange({ ...filters, escrowOnly: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-canvas text-gold focus:ring-gold"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer text-ink-body hover:text-white">
              <span>Instant Sample Available</span>
              <input
                type="checkbox"
                checked={Boolean(filters.sampleOnly)}
                onChange={(e) => onChange({ ...filters, sampleOnly: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-canvas text-gold focus:ring-gold"
              />
            </label>
          </div>
        </div>
      </AccordionItem>

      {/* 3. Logistics */}
      <AccordionItem title="Logistics & Dispatch" defaultOpen={true}>
        <div className="space-y-3.5 text-xs">
          {/* Lead time radio group */}
          <div>
            <label className="block text-[11px] font-medium text-ink-secondary mb-2">
              Dispatch Lead Time
            </label>
            <div className="space-y-2">
              {[
                { label: 'Any lead time', val: undefined },
                { label: 'Ships in < 7 days', val: 7 },
                { label: 'Ships in < 14 days', val: 14 },
                { label: 'Ships in < 30 days', val: 30 },
              ].map((opt, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 cursor-pointer hover:text-white text-ink-body"
                >
                  <input
                    type="radio"
                    name="leadTimeRadio"
                    checked={filters.maxLeadTimeDays === opt.val}
                    onChange={() => onChange({ ...filters, maxLeadTimeDays: opt.val })}
                    className="w-3.5 h-3.5 text-gold bg-canvas border-white/20 focus:ring-gold"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Port of Origin / Country Select */}
          <div className="pt-2 border-t border-white/10">
            <label className="block text-[11px] font-medium text-ink-secondary mb-1.5">
              Manufacturing Country
            </label>
            <select
              value={filters.countryCode || 'all'}
              onChange={(e) =>
                onChange({
                  ...filters,
                  countryCode: e.target.value === 'all' ? undefined : e.target.value,
                })
              }
              className="w-full h-9 px-2.5 bg-canvas/80 text-white rounded-lg border border-white/15 text-xs focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="all">All Global Locations</option>
              <option value="DE">Germany (Stuttgart / Hamburg)</option>
              <option value="JP">Japan (Yokohama / Tokyo)</option>
              <option value="TW">Taiwan (Hsinchu / Kaohsiung)</option>
              <option value="US">United States (Ohio / NY)</option>
              <option value="KR">South Korea (Incheon / Busan)</option>
              <option value="IT">Italy (Genoa / Milan)</option>
              <option value="SE">Sweden (Stockholm / Uppsala)</option>
              <option value="VN">Vietnam (Ho Chi Minh City)</option>
            </select>
          </div>
        </div>
      </AccordionItem>
    </div>
  );
};
