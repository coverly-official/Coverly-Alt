import React from 'react';
import {
  ESCROW_PROTECTION_LIMIT,
  AVERAGE_RESPONSE_TIME,
  COUNTRIES_SERVED_COUNT,
  ON_TIME_DELIVERY_RATE,
} from '@/lib/config';
import { ShieldCheck, Clock, Globe2, Truck } from 'lucide-react';

export const TrustBar: React.FC = () => {
  return (
    <section className="relative w-full bg-elevated/60 backdrop-blur-xl border-y border-white/10 py-8 select-none overflow-hidden">
      {/* Top and bottom subtle rim highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-8 border-b border-white/10">
          {/* Metric 1 */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-canvas/70 border border-gold/30 flex items-center justify-center text-gold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-display tabular-nums text-white">
                {ESCROW_PROTECTION_LIMIT}
              </div>
              <div className="text-xs text-ink-secondary">Trade Escrow Protection</div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-canvas/70 border border-white/15 flex items-center justify-center text-cyan-viz shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-display tabular-nums text-white">
                &lt; {AVERAGE_RESPONSE_TIME}
              </div>
              <div className="text-xs text-ink-secondary">Average Quote Turnaround</div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-canvas/70 border border-white/15 flex items-center justify-center text-white shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-display tabular-nums text-white">
                {COUNTRIES_SERVED_COUNT}
              </div>
              <div className="text-xs text-ink-secondary">Sourcing Destinations</div>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-canvas/70 border border-white/15 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-display tabular-nums text-white">
                {ON_TIME_DELIVERY_RATE}
              </div>
              <div className="text-xs text-ink-secondary">On-Time Factory Dispatch</div>
            </div>
          </div>
        </div>

        {/* Monochrome Certification Logos Row */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-6 opacity-60 hover:opacity-100 transition-opacity duration-300">
          <span className="text-[11px] font-bold tracking-widest uppercase text-ink-tertiary">
            Audited & Compliant With:
          </span>

          <div className="flex flex-wrap items-center gap-8 sm:gap-12">
            {/* ISO 9001 Badge */}
            <div className="flex items-center gap-2 group cursor-default">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V13H5V8.3l7-3.89v8.58z" />
              </svg>
              <span className="text-xs font-mono font-bold text-white tracking-wider">ISO 9001:2015</span>
            </div>

            {/* ISO 13485 Medical */}
            <div className="flex items-center gap-2 group cursor-default">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="text-xs font-mono font-bold text-white tracking-wider">ISO 13485 MED</span>
            </div>

            {/* AS9100D Aerospace */}
            <div className="flex items-center gap-2 group cursor-default">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 22,22 12,17 2,22" fill="currentColor" />
              </svg>
              <span className="text-xs font-mono font-bold text-white tracking-wider">AS9100D AERO</span>
            </div>

            {/* CE Conformity */}
            <div className="flex items-center gap-1.5 group cursor-default">
              <span className="text-sm font-bold font-serif tracking-tighter text-white">C Є</span>
              <span className="text-xs font-mono text-white">CONFORMITÉ</span>
            </div>

            {/* RoHS Compliant */}
            <div className="flex items-center gap-1.5 group cursor-default">
              <span className="px-2 py-0.5 rounded border border-white text-[10px] font-mono font-bold text-white">
                RoHS
              </span>
              <span className="text-xs font-mono text-white">LEAD-FREE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
