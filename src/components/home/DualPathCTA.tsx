import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, FileSpreadsheet, Lock, Banknote, BarChart3, Globe } from 'lucide-react';

export const DualPathCTA: React.FC = () => {
  return (
    <section className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel 1: For Buyers */}
          <GlassCard
            variant="glass-strong"
            className="p-8 sm:p-10 border border-white/15 flex flex-col justify-between"
          >
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider mb-4">
                Enterprise Procurement
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mb-3">
                For Industrial Buyers
              </h3>
              <p className="text-sm text-ink-secondary leading-relaxed mb-6">
                Streamline direct supplier audits, lock quotes with institutional escrow, and eliminate broker margins on custom component batches.
              </p>

              {/* 3 Benefit Bullets */}
              <div className="space-y-3.5 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-canvas/70 border border-gold/30 flex items-center justify-center text-gold shrink-0 mt-0.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Full Capital Protection</h4>
                    <p className="text-xs text-ink-secondary">Milestone releases only upon receiving CMM & material lab test approval.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-canvas/70 border border-gold/30 flex items-center justify-center text-gold shrink-0 mt-0.5">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Automated BOM Sourcing</h4>
                    <p className="text-xs text-ink-secondary">Upload multi-line Excel / STEP assemblies to receive matched quotes in 24 hours.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-canvas/70 border border-gold/30 flex items-center justify-center text-gold shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Audited On-Site Standards</h4>
                    <p className="text-xs text-ink-secondary">Zero middlemen. Connect directly with factory plant managers and engineers.</p>
                  </div>
                </div>
              </div>
            </div>

            <Link to="/catalog">
              <Button variant="primary" size="lg" className="w-full font-bold">
                Post an RFQ
              </Button>
            </Link>
          </GlassCard>

          {/* Panel 2: For Suppliers */}
          <GlassCard
            variant="glass"
            className="p-8 sm:p-10 border border-white/15 flex flex-col justify-between"
          >
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-elevated border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-4">
                Factory Owners
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mb-3">
                For Direct Manufacturers
              </h3>
              <p className="text-sm text-ink-secondary leading-relaxed mb-6">
                Receive high-volume RFQs with verified purchasing budgets from Fortune 500 aerospace, automotive, and medical OEMs.
              </p>

              {/* 3 Benefit Bullets */}
              <div className="space-y-3.5 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-canvas/70 border border-white/20 flex items-center justify-center text-cyan-viz shrink-0 mt-0.5">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Guaranteed Escrow Disbursements</h4>
                    <p className="text-xs text-ink-secondary">Buyer funds pre-deposited before you start cutting metal or cutting molds.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-canvas/70 border border-white/20 flex items-center justify-center text-cyan-viz shrink-0 mt-0.5">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Direct European & US Buyers</h4>
                    <p className="text-xs text-ink-secondary">Expand export capacity with pre-qualified industrial procurement teams.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-canvas/70 border border-white/20 flex items-center justify-center text-cyan-viz shrink-0 mt-0.5">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Streamlined Quote Counter-Offers</h4>
                    <p className="text-xs text-ink-secondary">Integrated interactive negotiation portal with real-time feedback loops.</p>
                  </div>
                </div>
              </div>
            </div>

            <Link to="/sign-up?role=seller">
              <Button variant="secondary" size="lg" className="w-full font-semibold border-muted/60">
                Apply to Sell
              </Button>
            </Link>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};
