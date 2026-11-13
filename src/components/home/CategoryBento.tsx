import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Cpu, Layers, Radio, Box, ShieldCheck, Zap, Package, Eye } from 'lucide-react';
import { mockCategories } from '@/data/categories';
import { ProductVisual } from '@/components/ui/ProductVisual';
import { useTilt } from '@/hooks/useTilt';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/utils';

interface BentoTileProps {
  category: (typeof mockCategories)[0];
  spanClass: string;
  isFeatured?: boolean;
}

const BentoTile: React.FC<BentoTileProps> = ({ category, spanClass, isFeatured = false }) => {
  const { ref, tilt, handleMouseMove, handleMouseLeave } = useTilt(isFeatured ? 4 : 0);
  const reducedMotion = useReducedMotionSafe();

  const getIcon = () => {
    switch (category.icon_name) {
      case 'Cpu': return Cpu;
      case 'Layers': return Layers;
      case 'Radio': return Radio;
      case 'Zap': return Zap;
      case 'Box': return Box;
      case 'ShieldCheck': return ShieldCheck;
      case 'Eye': return Eye;
      default: return Package;
    }
  };

  const Icon = getIcon();

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform:
          isFeatured && !reducedMotion
            ? `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
            : 'none',
        transition: 'transform 0.15s ease-out',
      }}
      className={cn('group relative rounded-card overflow-hidden h-full min-h-[220px]', spanClass)}
    >
      <Link
        to={`/catalog?cat=${category.slug}`}
        className="block w-full h-full p-6 glass-card border border-white/10 hover:border-gold/50 flex flex-col justify-between transition-colors duration-300"
      >
        {/* Atmospheric background product visual */}
        <div className="absolute right-[-10%] bottom-[-15%] w-3/5 aspect-square opacity-20 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none scale-110">
          <ProductVisual
            categorySlug={category.slug}
            angleIndex={0}
            showStageLighting={false}
          />
        </div>

        {/* Top Header */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl bg-elevated/80 border border-white/15 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-canvas transition-colors duration-200">
            <Icon className="w-5 h-5" />
          </div>

          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-gold">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Bottom Glass Metadata Label with Sliding Gold Underline */}
        <div className="relative z-10 pt-8">
          <div className="relative inline-block">
            <h3 className="text-base sm:text-lg font-bold font-display text-white group-hover:text-gold transition-colors">
              {category.name}
            </h3>
            {/* Sliding gold underline on hover */}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold rounded-full transition-all duration-300 group-hover:w-full" />
          </div>

          <p className="text-xs text-ink-secondary mt-1.5 line-clamp-2 max-w-xs">
            {category.description}
          </p>

          <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-white/10 text-xs text-ink-secondary">
            <span className="tabular-nums font-semibold text-white">
              {category.supplier_count}+ Factories
            </span>
            <span>•</span>
            <span className="tabular-nums text-gold font-mono font-medium">
              From ${category.from_price.toFixed(2)}/unit
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export const CategoryBento: React.FC = () => {
  return (
    <section className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow + Section Header */}
        <div className="mb-12">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-gold mb-2">
            Engineered Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white">
            Industrial Sourcing by Sector
          </h2>
          <p className="text-sm sm:text-base text-ink-secondary mt-2 max-w-xl">
            Explore audited plants specialized in micron-level aerospace milling, high-density HDI electronics, cleanroom polymer molding, and robotics.
          </p>
        </div>

        {/* Bento Grid (Masonry 8-tile layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Tile 1: High-volume large bento tile (spans 2 cols, 2 rows on lg) */}
          <BentoTile
            category={mockCategories[0]}
            spanClass="lg:col-span-2 lg:row-span-2"
            isFeatured={true}
          />

          {/* Tile 2 */}
          <BentoTile
            category={mockCategories[1]}
            spanClass="lg:col-span-2"
            isFeatured={true}
          />

          {/* Tile 3 */}
          <BentoTile
            category={mockCategories[2]}
            spanClass="lg:col-span-2"
            isFeatured={false}
          />

          {/* Tile 4 */}
          <BentoTile
            category={mockCategories[3]}
            spanClass="lg:col-span-1"
            isFeatured={false}
          />

          {/* Tile 5 */}
          <BentoTile
            category={mockCategories[4]}
            spanClass="lg:col-span-1"
            isFeatured={false}
          />

          {/* Tile 6 */}
          <BentoTile
            category={mockCategories[5]}
            spanClass="lg:col-span-2"
            isFeatured={true}
          />

          {/* Tile 7 */}
          <BentoTile
            category={mockCategories[6]}
            spanClass="lg:col-span-2"
            isFeatured={false}
          />

          {/* Tile 8 */}
          <BentoTile
            category={mockCategories[7]}
            spanClass="lg:col-span-2"
            isFeatured={true}
          />
        </div>
      </div>
    </section>
  );
};
