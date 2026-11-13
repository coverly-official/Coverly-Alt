import React from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { SupplierBadge } from '@/components/ui/SupplierBadge';
import { FlagIcon } from '@/components/ui/FlagIcon';
import { PriceTiers } from '@/components/ui/PriceTiers';
import { ProductVisual } from '@/components/ui/ProductVisual';
import { Link } from 'react-router-dom';
import type { Product } from '@/data/types';
import { ArrowRight } from 'lucide-react';

export interface QuickViewDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestQuote: (product: Product) => void;
}

export const QuickViewDrawer: React.FC<QuickViewDrawerProps> = ({
  product,
  isOpen,
  onClose,
  onRequestQuote,
}) => {
  if (!product) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Engineering SKU Specification"
      description={`Part: ${product.id}`}
      width="lg"
    >
      <div className="space-y-6">
        {/* Product Visual Stage */}
        <ProductVisual
          categorySlug={product.category?.slug}
          angleIndex={0}
          aspectRatio="16/9"
          className="rounded-stage"
        />

        {/* Title and Supplier Line */}
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
            {product.title}
          </h3>
          <div className="flex items-center gap-2.5 mt-2.5">
            <SupplierBadge
              verified={product.supplier?.verified ?? false}
              tier={product.supplier?.tier}
            />
            <span className="text-xs text-ink-secondary flex items-center gap-1">
              <FlagIcon countryCode={product.supplier?.country_code ?? 'DE'} size="sm" />
              <span>{product.supplier?.name}</span>
            </span>
          </div>
        </div>

        {/* Volume Pricing Matrix */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-secondary mb-2">
            Volume Pricing Matrix (FOB)
          </label>
          <PriceTiers tiers={product.price_tiers} />
        </div>

        {/* Core Commercials Grid */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-canvas/70 border border-white/10 text-xs">
          <div>
            <span className="text-ink-tertiary text-[10px] uppercase block">Minimum Order (MOQ)</span>
            <span className="font-bold tabular-nums text-white">{product.moq} units</span>
          </div>
          <div>
            <span className="text-ink-tertiary text-[10px] uppercase block">Standard Lead Time</span>
            <span className="font-bold tabular-nums text-white">{product.lead_time_days} days dispatch</span>
          </div>
          <div>
            <span className="text-ink-tertiary text-[10px] uppercase block">Harmonized Tariff (HS Code)</span>
            <span className="font-mono text-gold">{product.hs_code}</span>
          </div>
          <div>
            <span className="text-ink-tertiary text-[10px] uppercase block">Port of Origin</span>
            <span className="font-medium text-white">{product.port_of_origin}</span>
          </div>
        </div>

        {/* Technical Specs Table */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-secondary mb-2">
            Verified Technical Parameters
          </label>
          <div className="rounded-xl border border-white/10 overflow-hidden divide-y divide-white/10 text-xs">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between p-2.5 bg-canvas/40">
                <span className="text-ink-secondary">{key}</span>
                <span className="font-mono font-medium text-white">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Packaging Information */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-secondary mb-2">
            Export Packaging & Dimensions
          </label>
          <div className="p-3 rounded-xl bg-canvas/70 border border-white/10 text-xs space-y-1 text-ink-secondary">
            <p>
              <strong className="text-white">Carton:</strong> {product.packaging.carton_dimensions}
            </p>
            <p>
              <strong className="text-white">Units / Carton:</strong> {product.packaging.units_per_carton} pcs
            </p>
            <p>
              <strong className="text-white">Gross Weight:</strong> {product.packaging.gross_weight_kg} kg
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-white/10 flex items-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              onClose();
              onRequestQuote(product);
            }}
            className="flex-1 font-bold"
          >
            Request Instant Quote
          </Button>

          <Link to={`/product/${product.id}`} onClick={onClose}>
            <Button variant="secondary" size="lg" className="gap-1.5 text-xs">
              <span>Full Dossier</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Drawer>
  );
};
