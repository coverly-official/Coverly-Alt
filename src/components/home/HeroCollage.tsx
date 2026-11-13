import React from 'react';
import { motion } from 'framer-motion';
import { useTilt } from '@/hooks/useTilt';
import { ProductVisual } from '@/components/ui/ProductVisual';
import { FlagIcon } from '@/components/ui/FlagIcon';
import { StatusChip } from '@/components/ui/StatusChip';
import { ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

export const HeroCollage: React.FC = () => {
  const { ref, tilt, handleMouseMove, handleMouseLeave } = useTilt(4);
  const reducedMotion = useReducedMotionSafe();

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[4/3] sm:aspect-square max-w-[540px] mx-auto flex items-center justify-center select-none"
      style={{
        transform: reducedMotion
          ? 'none'
          : `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
    >
      {/* SVG Animated Connector Spline Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
        viewBox="0 0 500 500"
        fill="none"
      >
        <motion.path
          d="M 120 180 C 180 220, 240 260, 310 220"
          stroke="#676f9d"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
        <motion.path
          d="M 280 250 C 230 320, 190 340, 160 380"
          stroke="#f7b117"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.6 }}
        />
      </svg>

      {/* Ambient background rim backlight glow */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-muted/30 to-gold/20 blur-3xl -z-10 pointer-events-none" />

      {/* Layer 1: Back - 3D Industrial Stage Cutout with Rim Light */}
      <motion.div
        animate={reducedMotion ? {} : { y: [-6, 6, -6] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-4 right-4 sm:right-6 w-3/4 max-w-[340px] z-10"
      >
        <div className="glass-card rounded-card p-3 shadow-2xl border border-white/20">
          <ProductVisual
            categorySlug="precision-machining"
            angleIndex={1}
            aspectRatio="4/3"
            showStageLighting={true}
          />
          <div className="p-2.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-white tracking-tight">Ti-6Al-4V Hydraulic Manifold</p>
              <p className="text-[10px] text-ink-secondary">Bore tolerance: ±0.003 mm</p>
            </div>
            <span className="text-xs font-mono font-bold text-gold">$118.00</span>
          </div>
        </div>
      </motion.div>

      {/* Layer 2: Middle - Verified Supplier Scorecard */}
      <motion.div
        animate={reducedMotion ? {} : { y: [8, -8, 8] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="absolute top-28 sm:top-36 left-0 sm:left-2 w-[72%] max-w-[300px] z-20"
      >
        <div className="glass-strong rounded-card p-4 shadow-2xl border border-white/25">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-elevated to-canvas border border-gold/40 flex items-center justify-center font-bold text-xs text-gold">
              KP
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">Kronos Precision</span>
                <ShieldCheck className="w-3.5 h-3.5 text-gold shrink-0" />
              </div>
              <div className="flex items-center gap-1 text-[10px] text-ink-secondary">
                <FlagIcon countryCode="DE" size="sm" />
                <span>Stuttgart, Germany</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] bg-canvas/60 p-2 rounded-xl border border-white/10 mb-2">
            <div>
              <span className="text-[9px] text-ink-tertiary uppercase block">On-Time Rate</span>
              <span className="font-bold tabular-nums text-emerald-400">99.6%</span>
            </div>
            <div>
              <span className="text-[9px] text-ink-tertiary uppercase block">Avg Response</span>
              <span className="font-bold tabular-nums text-white">1.4 hrs</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-ink-secondary">AS9100D & ISO 13485</span>
            <div className="flex items-center gap-0.5 text-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 fill-gold" />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Layer 3: Front - Live RFQ Negotiation Card */}
      <motion.div
        animate={reducedMotion ? {} : { y: [-5, 7, -5] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-[78%] max-w-[320px] z-30"
      >
        <div className="glass-card rounded-card p-4 shadow-2xl border border-gold/40 bg-elevated/90 backdrop-blur-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono tracking-wider uppercase text-ink-secondary">
              Live RFQ #2026-081
            </span>
            <StatusChip status="counter_offered" size="sm" label="Counter-Offer" />
          </div>

          <div className="space-y-1 mb-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-secondary">Batch Volume:</span>
              <span className="font-bold text-white tabular-nums">250 units</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-secondary">Target Quote:</span>
              <span className="text-ink-secondary line-through tabular-nums">$142.50</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
              <span className="text-gold font-semibold">Factory Offer:</span>
              <span className="text-sm font-bold text-gold tabular-nums">$136.00 / pc</span>
            </div>
          </div>

          {/* Simulated live typing indicator */}
          <div className="flex items-center justify-between pt-1 text-[11px] text-ink-secondary">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-ping" />
              <span className="text-[10px]">Lead Engineer online</span>
            </div>
            <span className="text-[10px] text-gold font-medium flex items-center gap-1">
              Review Quote <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
