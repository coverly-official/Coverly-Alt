import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, CheckCircle2, Factory } from 'lucide-react';
import { CommandSearch } from '@/components/layout/CommandSearch';
import { HeroCollage } from './HeroCollage';
import { useMagnetic } from '@/hooks/useMagnetic';
import { VERIFIED_MANUFACTURERS_COUNT } from '@/lib/config';

export const Hero: React.FC = () => {
  const buyerMagnetic = useMagnetic(8);
  const supplierMagnetic = useMagnetic(8);

  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
      {/* Blue-purple ambient backdrop blobs */}
      <div className="absolute top-1/4 left-1/10 w-[500px] h-[500px] rounded-full bg-[rgba(103,111,157,0.22)] blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/12 w-[460px] h-[460px] rounded-full bg-[rgba(124,92,255,0.14)] blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            {/* 1. Live platform status pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-card border border-white/15 backdrop-blur-xl shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success" />
              </span>
              <span className="text-xs font-semibold text-white tracking-wide">
                <span className="tabular-nums font-bold text-gold">{VERIFIED_MANUFACTURERS_COUNT}</span> Verified Manufacturers Online
              </span>
            </div>

            {/* 2. H1 Headline (under 9 words) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-white leading-[1.08]">
              Source direct from{' '}
              <span className="relative inline-block">
                verified
                {/* Subtle gold-tinted gradient underline */}
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-gold/40 via-gold to-gold/20 rounded-full" />
              </span>{' '}
              factories.
            </h1>

            {/* 3. Value Proposition (18px, max 55ch) */}
            <p className="text-base sm:text-lg text-ink-body max-w-[55ch] leading-relaxed">
              Bypass brokers and trading intermediaries. Connect directly with audited CNC, molding, and electronics manufacturing plants backed by institutional escrow.
            </p>

            {/* 4. Persistent Global Search Bar */}
            <div className="max-w-xl">
              <CommandSearch variant="hero" />
            </div>

            {/* 5. Dual CTAs side by side (Magnetic buttons) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <div
                ref={buyerMagnetic.ref}
                onMouseMove={buyerMagnetic.handleMouseMove}
                onMouseLeave={buyerMagnetic.handleMouseLeave}
                style={{
                  transform: `translate3d(${buyerMagnetic.position.x}px, ${buyerMagnetic.position.y}px, 0)`,
                  transition: 'transform 0.1s ease-out',
                }}
              >
                <Link to="/catalog" className="w-full sm:w-auto inline-block">
                  <button
                    type="button"
                    className="w-full sm:w-auto h-13 px-7 rounded-2xl bg-gold hover:bg-gold-hover text-canvas font-bold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-gold/20 hover:shadow-glass-hover transition-all duration-200"
                  >
                    <span>Source Products</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </Link>
              </div>

              <div
                ref={supplierMagnetic.ref}
                onMouseMove={supplierMagnetic.handleMouseMove}
                onMouseLeave={supplierMagnetic.handleMouseLeave}
                style={{
                  transform: `translate3d(${supplierMagnetic.position.x}px, ${supplierMagnetic.position.y}px, 0)`,
                  transition: 'transform 0.1s ease-out',
                }}
              >
                <Link to="/sign-up?role=seller" className="w-full sm:w-auto inline-block">
                  <button
                    type="button"
                    className="w-full sm:w-auto h-13 px-7 rounded-2xl glass-card border border-muted text-white font-semibold text-base hover:bg-elevated/80 hover:border-white/40 flex items-center justify-center gap-2.5 transition-all duration-200"
                  >
                    <Factory className="w-4 h-4 text-ink-secondary" />
                    <span>Become a Supplier</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* 6. Trust microcopy row */}
            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-secondary font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                <span>Escrow-protected payments</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                <span>On-site audited facilities</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                <span>Quotes in under 24 hours</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols) */}
          <div className="lg:col-span-5">
            <HeroCollage />
          </div>
        </div>
      </div>
    </section>
  );
};
