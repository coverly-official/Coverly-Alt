import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ShieldCheck, Quote as QuoteIcon } from 'lucide-react';

const testimonials = [
  {
    quote:
      'We transferred our 5-axis hydraulic manifold sourcing from traditional broker channels to Meridian Trade. We cut turnaround from 6 weeks to 14 days and saved 22% while securing full TÜV inspection sign-offs.',
    author: 'Markus Lindholm',
    role: 'VP of Global Supply Chain',
    company: 'AeroDynamics Sweden AB',
    badge: 'Verified Buyer',
    orderVolume: '$420,000 sourced',
  },
  {
    quote:
      'The ability to drop an engineering BOM with 45 individual part drawings and receive competitive factory quotes backed by milestone escrow has fundamentally transformed our EV prototyping cadence.',
    author: 'Elena Rodriguez',
    role: 'Principal Hardware Engineer',
    company: 'NextMobility Tech Inc.',
    badge: 'Verified Buyer',
    orderVolume: '$1.2M sourced',
  },
  {
    quote:
      'Direct communication with factory floor tooling masters in Stuttgart and Yokohama eliminated endless back-and-forth email chains. The CMM dimensional reports matched our CAD tolerances flawlessly.',
    author: 'David Chen',
    role: 'Director of Manufacturing Ops',
    company: 'Precision Medical Devices',
    badge: 'Verified Buyer',
    orderVolume: '$680,000 sourced',
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 md:py-28 relative bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-gold mb-2">
            Institutional Proof
          </div>
          <h2 className="text-3xl font-bold font-display tracking-tight text-white">
            Trusted by Enterprise Engineering Teams
          </h2>
        </div>

        {/* 3 Glass Quote Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <GlassCard
              key={i}
              className="p-7 border border-white/10 flex flex-col justify-between hover:border-gold/40 transition-colors"
            >
              <div>
                <QuoteIcon className="w-6 h-6 text-gold/60 mb-4" />
                <p className="text-xs sm:text-sm text-ink-body leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{t.author}</h4>
                  <p className="text-[11px] text-ink-secondary">{t.role}</p>
                  <p className="text-[10px] text-gold font-medium mt-0.5">{t.company}</p>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 text-[10px] font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{t.badge}</span>
                  </span>
                  <div className="text-[10px] text-ink-tertiary mt-1 tabular-nums font-mono">
                    {t.orderVolume}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};
