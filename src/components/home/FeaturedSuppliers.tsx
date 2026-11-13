import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { mockSuppliers } from '@/data/suppliers';
import { SupplierBadge } from '@/components/ui/SupplierBadge';
import { FlagIcon } from '@/components/ui/FlagIcon';
import { GlassCard } from '@/components/ui/GlassCard';

export const FeaturedSuppliers: React.FC = () => {
  const featured = mockSuppliers.slice(0, 4);

  return (
    <section className="py-20 md:py-28 relative bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-gold mb-2">
              Audited Manufacturing Partners
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white">
              Tier-1 Verified Factories
            </h2>
            <p className="text-sm sm:text-base text-ink-secondary mt-2 max-w-xl">
              Inspected on-site with verified machine tooling capacity, financial stability, and zero broker markup.
            </p>
          </div>

          <Link
            to="/catalog?filter=suppliers"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-white transition-colors"
          >
            <span>View All 4,200+ Verified Plants</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Supplier Dossier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((supplier) => (
            <GlassCard
              key={supplier.id}
              interactive
              className="p-6 border border-white/10 hover:border-gold/50 flex flex-col justify-between"
            >
              <div>
                {/* Header: Logo Glyph + Verified Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-elevated to-canvas border border-gold/30 flex items-center justify-center font-bold font-display text-sm text-gold shadow-md">
                    {supplier.logo_initials}
                  </div>
                  <SupplierBadge verified={supplier.verified} tier={supplier.tier} size="sm" />
                </div>

                {/* Name & Country */}
                <h3 className="text-base font-bold text-white tracking-tight mb-1 line-clamp-1">
                  {supplier.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-ink-secondary mb-3">
                  <FlagIcon countryCode={supplier.country_code} size="sm" />
                  <span>{supplier.country_name}</span>
                  <span>•</span>
                  <span>{supplier.years_on_platform} yrs on platform</span>
                </div>

                {/* Tagline snippet */}
                <p className="text-xs text-ink-secondary line-clamp-2 mb-4 leading-relaxed">
                  {supplier.tagline}
                </p>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-2 gap-2 bg-canvas/70 p-3 rounded-xl border border-white/10 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-ink-tertiary uppercase block">On-Time</span>
                    <span className="font-bold tabular-nums text-emerald-400">
                      {supplier.on_time_pct}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-tertiary uppercase block">Avg Reply</span>
                    <span className="font-bold tabular-nums text-white">
                      {supplier.response_hours} hrs
                    </span>
                  </div>
                </div>

                {/* Certification Chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {supplier.certifications.slice(0, 3).map((cert) => (
                    <span
                      key={cert}
                      className="px-2 py-0.5 rounded-md bg-elevated/70 border border-white/10 text-[10px] font-mono text-ink-secondary"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action: Ghost link */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-ink-tertiary">
                  Area: {(supplier.factory_area_sqm / 1000).toFixed(0)}k m²
                </span>
                <Link
                  to={`/catalog?supplier=${supplier.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:text-white transition-colors"
                >
                  <span>View Factory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};
