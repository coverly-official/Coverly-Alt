import React from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck, Shield } from 'lucide-react';

export interface SupplierBadgeProps {
  verified: boolean;
  tier?: 'Diamond' | 'Gold' | 'Verified';
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const SupplierBadge: React.FC<SupplierBadgeProps> = ({
  verified,
  tier = 'Verified',
  showLabel = true,
  size = 'sm',
  className,
}) => {
  if (!verified) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 font-medium rounded-full bg-white/5 border border-white/10 text-ink-tertiary select-none',
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
          className
        )}
        title="Unverified Supplier"
      >
        <Shield className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        {showLabel && <span>Registered</span>}
      </span>
    );
  }

  // Verified Supplier — Gold badge strictly reserved
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-bold rounded-full bg-gold/15 border border-gold/40 text-gold shadow-sm backdrop-blur-md select-none',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        className
      )}
      title={`${tier} Verified Manufacturer`}
    >
      <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-gold" aria-hidden="true" />
      {showLabel && (
        <span className="tracking-tight">
          {tier === 'Diamond' ? 'Diamond Verified' : 'Gold Verified'}
        </span>
      )}
    </span>
  );
};
