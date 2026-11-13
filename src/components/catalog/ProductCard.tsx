import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/data/types';
import { SupplierBadge } from '@/components/ui/SupplierBadge';
import { FlagIcon } from '@/components/ui/FlagIcon';
import { ProductVisual } from '@/components/ui/ProductVisual';
import { PriceTiers } from '@/components/ui/PriceTiers';
import { Eye, Layers, Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onRequestQuote: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  isCompared?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onRequestQuote,
  onToggleCompare,
  isCompared = false,
}) => {
  // Angle index for scrubbable 3 angles (0, 1, 2)
  const [angleIndex, setAngleIndex] = useState(0);

  // Map mouse horizontal position over visual stage to angle 0, 1, or 2
  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    if (ratio < 0.33) {
      setAngleIndex(0);
    } else if (ratio < 0.66) {
      setAngleIndex(1);
    } else {
      setAngleIndex(2);
    }
  };

  const handleStageMouseLeave = () => {
    setAngleIndex(0);
  };

  return (
    <div className="group relative rounded-card glass-card p-4 border border-white/10 hover:border-gold/50 flex flex-col justify-between transition-all duration-200 select-none shadow-lg">
      <div>
        {/* 1. Top Bar: Supplier verification badge + Country flag + Reply rate */}
        <div className="flex items-center justify-between pb-3 text-xs">
          <div className="flex items-center gap-1.5 truncate">
            <SupplierBadge
              verified={product.supplier?.verified ?? false}
              tier={product.supplier?.tier}
              size="sm"
            />
            <span className="flex items-center gap-1 text-ink-secondary truncate">
              <FlagIcon countryCode={product.supplier?.country_code ?? 'DE'} size="sm" />
              <span className="truncate max-w-[110px]">{product.supplier?.name}</span>
            </span>
          </div>

          <span className="text-[11px] font-mono tabular-nums text-emerald-400 shrink-0 ml-2">
            {product.supplier?.response_rate ?? 98}% reply
          </span>
        </div>

        {/* 2. Visual Stage (4:3, hover-scrub through 3 angles) */}
        <div
          onMouseMove={handleStageMouseMove}
          onMouseLeave={handleStageMouseLeave}
          className="relative overflow-hidden rounded-stage cursor-crosshair group/stage mb-3"
        >
          <ProductVisual
            categorySlug={product.category?.slug}
            angleIndex={angleIndex}
            aspectRatio="4/3"
            showStageLighting={true}
          />

          {/* Quick View Button overlay on hover */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-xl glass-strong text-[11px] font-semibold text-white flex items-center gap-1.5 opacity-0 group-hover/stage:opacity-100 hover:text-gold transition-all duration-200 shadow-md"
            aria-label={`Quick view specifications for ${product.title}`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          {/* Angle dot indicators at bottom of stage */}
          <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1.5 pointer-events-none">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={cn(
                  'h-1 rounded-full transition-all duration-200',
                  angleIndex === i ? 'w-4 bg-gold' : 'w-1.5 bg-white/30'
                )}
              />
            ))}
          </div>
        </div>

        {/* 3. Core Commercials (Strict 4 data points) */}
        <div className="space-y-2">
          {/* 1) Title (2-line clamp) */}
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="text-sm font-bold text-white line-clamp-2 hover:text-gold transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* 2) Tiered price preview (tabular-nums) */}
          <div className="pt-0.5">
            <PriceTiers tiers={product.price_tiers} compact />
          </div>

          {/* 3) & 4) MOQ pill and Lead time / Tier */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="px-2 py-0.5 rounded-lg bg-canvas/80 border border-white/10 text-ink-secondary tabular-nums text-[11px] font-medium">
              Min. order: <strong className="text-white">{product.moq}</strong> pcs
            </span>

            <span className="text-[11px] text-ink-secondary tabular-nums flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted shrink-0" />
              <span>{product.lead_time_days}d dispatch</span>
            </span>
          </div>
        </div>
      </div>

      {/* 4. Action Footer: Request Quote (ghost gold to solid gold on card hover) + Compare SKU */}
      <div className="pt-4 mt-3 border-t border-white/10 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onRequestQuote(product)}
          className={cn(
            'flex-1 h-10 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center select-none',
            'border border-gold/60 text-gold bg-transparent',
            'group-hover:bg-gold group-hover:text-canvas group-hover:shadow-md'
          )}
        >
          Request Quote
        </button>

        <button
          type="button"
          onClick={() => onToggleCompare(product)}
          className={cn(
            'h-10 w-10 rounded-xl border flex items-center justify-center transition-colors',
            isCompared
              ? 'bg-gold/20 border-gold text-gold'
              : 'bg-elevated/70 border-white/10 text-ink-secondary hover:text-white hover:border-white/30'
          )}
          title={isCompared ? 'Remove from Compare Tray' : 'Add to Compare Tray (max 4)'}
          aria-label={`Compare ${product.title}`}
        >
          {isCompared ? <Check className="w-4 h-4 text-gold" /> : <Layers className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
