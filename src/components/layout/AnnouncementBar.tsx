import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ESCROW_PROTECTION_LIMIT } from '@/lib/config';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="relative z-40 bg-elevated/70 border-b border-white/10 backdrop-blur-md px-4 py-1.5 text-xs text-ink-secondary flex items-center justify-center gap-3">
      <div className="flex items-center gap-1.5 text-gold font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-gold shrink-0" />
        <span>Trade Assurance Active:</span>
      </div>
      <span className="hidden sm:inline">
        Every purchase order protected up to <strong className="text-white font-semibold">{ESCROW_PROTECTION_LIMIT}</strong> via Tier-1 Escrow.
      </span>
      <Link
        to="/catalog"
        className="inline-flex items-center gap-1 text-white hover:text-gold font-semibold transition-colors ml-1"
      >
        <span>Explore Verified Network</span>
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
};
