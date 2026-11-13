import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { SupplierBadge } from '@/components/ui/SupplierBadge';
import { FlagIcon } from '@/components/ui/FlagIcon';
import { ProductVisual } from '@/components/ui/ProductVisual';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/data/types';
import { Check, X } from 'lucide-react';

export interface CompareModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
  onRequestQuote: (product: Product) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  products,
  isOpen,
  onClose,
  onRemove,
  onRequestQuote,
}) => {
  if (products.length === 0) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Engineering SKU Specification Comparison"
      description="Side-by-side technical evaluation across verified suppliers."
      maxWidth="4xl"
    >
      <div className="overflow-x-auto pb-4">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-3 w-40 text-ink-secondary font-semibold">SKU Specification</th>
              {products.map((p) => (
                <th key={p.id} className="p-3 min-w-[200px] align-top">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-bold text-white line-clamp-1">{p.title}</span>
                    <button
                      type="button"
                      onClick={() => onRemove(p.id)}
                      className="text-ink-secondary hover:text-status-error p-0.5"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <ProductVisual
                    categorySlug={p.category?.slug}
                    angleIndex={0}
                    aspectRatio="16/9"
                    className="w-full rounded-lg mb-2"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onRequestQuote(p)}
                    className="w-full text-xs h-8"
                  >
                    Request Quote
                  </Button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {/* Supplier */}
            <tr>
              <td className="p-3 text-ink-secondary font-medium">Manufacturer</td>
              {products.map((p) => (
                <td key={p.id} className="p-3">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <FlagIcon countryCode={p.supplier?.country_code ?? 'DE'} size="sm" />
                    <span>{p.supplier?.name}</span>
                  </div>
                  <div className="mt-1">
                    <SupplierBadge verified={p.supplier?.verified ?? false} tier={p.supplier?.tier} size="sm" />
                  </div>
                </td>
              ))}
            </tr>

            {/* Base Unit Price */}
            <tr>
              <td className="p-3 text-ink-secondary font-medium">Lowest Tier Price</td>
              {products.map((p) => {
                const lowest = p.price_tiers[p.price_tiers.length - 1]?.unit_price ?? 0;
                return (
                  <td key={p.id} className="p-3 font-mono font-bold text-gold text-sm tabular-nums">
                    {formatCurrency(lowest)} / unit
                  </td>
                );
              })}
            </tr>

            {/* Minimum Order Qty */}
            <tr>
              <td className="p-3 text-ink-secondary font-medium">Minimum Order (MOQ)</td>
              {products.map((p) => (
                <td key={p.id} className="p-3 tabular-nums font-semibold text-white">
                  {p.moq.toLocaleString()} pcs
                </td>
              ))}
            </tr>

            {/* Lead Time */}
            <tr>
              <td className="p-3 text-ink-secondary font-medium">Lead Time</td>
              {products.map((p) => (
                <td key={p.id} className="p-3 tabular-nums text-white">
                  {p.lead_time_days} days
                </td>
              ))}
            </tr>

            {/* HS Code */}
            <tr>
              <td className="p-3 text-ink-secondary font-medium">Tariff (HS Code)</td>
              {products.map((p) => (
                <td key={p.id} className="p-3 font-mono text-ink-secondary">
                  {p.hs_code}
                </td>
              ))}
            </tr>

            {/* Port of Origin */}
            <tr>
              <td className="p-3 text-ink-secondary font-medium">Port of Origin</td>
              {products.map((p) => (
                <td key={p.id} className="p-3 text-white">
                  {p.port_of_origin}
                </td>
              ))}
            </tr>

            {/* Escrow Eligible */}
            <tr>
              <td className="p-3 text-ink-secondary font-medium">Trade Escrow</td>
              {products.map((p) => (
                <td key={p.id} className="p-3">
                  {p.escrow_eligible ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Eligible
                    </span>
                  ) : (
                    <span className="text-ink-tertiary">Direct Settlement</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  );
};
