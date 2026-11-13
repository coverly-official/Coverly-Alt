import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react';

export interface KPICardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  isActionRequired?: boolean;
  actionNote?: string;
  icon: React.ReactNode;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  change,
  isPositive = true,
  isActionRequired = false,
  actionNote,
  icon,
}) => {
  return (
    <GlassCard
      variant={isActionRequired ? 'glass-strong' : 'glass'}
      className={cn(
        'p-5 border transition-all duration-200 select-none shadow-md',
        isActionRequired ? 'border-gold shadow-gold-rim' : 'border-white/10'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-ink-secondary tracking-wide uppercase">
          {label}
        </span>
        <div
          className={cn(
            'w-8 h-8 rounded-xl flex items-center justify-center',
            isActionRequired ? 'bg-gold/20 text-gold' : 'bg-elevated/70 text-cyan-viz'
          )}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span
          className={cn(
            'text-2xl sm:text-3xl font-bold font-display tabular-nums tracking-tight',
            isActionRequired ? 'text-gold' : 'text-white'
          )}
        >
          {value}
        </span>

        {change && (
          <span
            className={cn(
              'text-xs font-semibold flex items-center gap-0.5 tabular-nums',
              isPositive ? 'text-emerald-400' : 'text-ink-secondary'
            )}
          >
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>{change}</span>
          </span>
        )}
      </div>

      {actionNote && (
        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-gold font-bold">
          <AlertCircle className="w-3 h-3" />
          <span>{actionNote}</span>
        </div>
      )}
    </GlassCard>
  );
};
