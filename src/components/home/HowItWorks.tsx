import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, ShieldCheck, MessageSquareQuote, Lock } from 'lucide-react';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

const steps = [
  {
    number: '01',
    title: 'Search or Upload Your BOM',
    description:
      'Search live factory capacity or drop a multi-line Excel / STEP bill of materials. Automated line parsing extracts material, tolerances, and target quantities.',
    icon: Search,
    detail: 'Instant CAD & spreadsheet parsing',
  },
  {
    number: '02',
    title: 'Compare Audited Suppliers',
    description:
      'Evaluate verifiable metrics: on-site TÜV/SGS audit reports, machine lists, on-time delivery percentages, and certified QA procedures before initiating contact.',
    icon: ShieldCheck,
    detail: 'Zero unverified trading brokers',
  },
  {
    number: '03',
    title: 'Negotiate Direct & Sample',
    description:
      'Chat with plant engineers without intermediaries. Request functional prototypes and sample batches to inspect tolerances and surface finishes.',
    icon: MessageSquareQuote,
    detail: 'Direct factory engineering channels',
  },
  {
    number: '04',
    title: 'Pay Through Escrow & Track',
    description:
      'Funds remain locked in institutional escrow until pre-shipment quality inspection sign-off. Milestone disbursements trigger only on approved deliveries.',
    icon: Lock,
    detail: '100% Capital protection guaranteed',
  },
];

export const HowItWorks: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionSafe();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  // Calculate path fill progress
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="py-24 md:py-32 relative overflow-hidden bg-canvas select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-gold mb-2">
            Procurement Lifecycle
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white">
            Engineered Sourcing in 4 Steps
          </h2>
          <p className="text-sm sm:text-base text-ink-secondary mt-2">
            From technical drawing upload to automated escrow disbursement at port delivery.
          </p>
        </div>

        {/* Desktop Connected Stepped Flow */}
        <div className="relative hidden lg:block pb-16">
          {/* Scroll-Driven Connecting SVG Spline Path */}
          <svg
            className="absolute top-1/2 left-0 w-full h-32 -translate-y-1/2 pointer-events-none z-0"
            viewBox="0 0 1200 160"
            fill="none"
          >
            {/* Background muted track */}
            <path
              d="M 100 40 C 350 140, 600 20, 850 140 C 950 180, 1050 80, 1100 40"
              stroke="#424769"
              strokeWidth="3"
              strokeDasharray="6 6"
              fill="none"
            />
            {/* Illuminated Gold Fill tied to scroll progress */}
            <motion.path
              d="M 100 40 C 350 140, 600 20, 850 140 C 950 180, 1050 80, 1100 40"
              stroke="#f7b117"
              strokeWidth="3.5"
              fill="none"
              style={{ pathLength: reducedMotion ? 1 : pathLength }}
            />
          </svg>

          {/* 4 Stepped Panels (Offset 36px diagonally lower each) */}
          <div className="grid grid-cols-4 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              // Diagonal step offset down the page
              const offsetTop = idx * 36;

              return (
                <div
                  key={step.number}
                  style={{ marginTop: `${offsetTop}px` }}
                  className="glass-card rounded-card p-6 border border-white/10 hover:border-gold/50 transition-all duration-300 flex flex-col justify-between min-h-[310px] group shadow-xl"
                >
                  <div>
                    {/* Step Number + Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-3xl font-display font-extrabold tabular-nums text-muted group-hover:text-gold transition-colors duration-300">
                        {step.number}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-elevated/70 border border-white/15 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-canvas transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-gold transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-ink-secondary leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-medium text-gold">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    <span>{step.detail}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="lg:hidden relative space-y-6 pl-8 border-l-2 border-gold/40 ml-2">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative glass-card rounded-card p-5 border border-white/10"
              >
                {/* Glowing step node on timeline */}
                <div className="absolute -left-[41px] top-6 w-5 h-5 rounded-full bg-canvas border-2 border-gold flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-gold" />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold font-display text-gold tabular-nums">
                    {step.number}
                  </span>
                  <Icon className="w-5 h-5 text-gold" />
                </div>

                <h3 className="text-base font-bold text-white mb-1">{step.title}</h3>
                <p className="text-xs text-ink-secondary leading-relaxed mb-3">
                  {step.description}
                </p>
                <span className="text-[11px] font-medium text-gold">{step.detail}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
