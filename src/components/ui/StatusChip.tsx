import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';

export interface StatusChipProps {
  status: 'pending' | 'quoted' | 'approved' | 'rejected' | 'in_production' | 'completed' | 'counter_offered' | 'accepted' | 'declined';
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, label, size = 'sm', className }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'counter_offered':
        return {
          bg: 'bg-gold/15 text-gold border-gold/40',
          dot: 'bg-gold animate-pulse',
          icon: AlertTriangle,
          text: label || 'Counter-Offer Received',
          isGoldAction: true,
        };
      case 'approved':
      case 'accepted':
      case 'completed':
        return {
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400',
          icon: CheckCircle2,
          text: label || (status === 'completed' ? 'Completed' : 'Approved'),
          isGoldAction: false,
        };
      case 'in_production':
        return {
          bg: 'bg-cyan-viz/15 text-cyan-viz border-cyan-viz/30',
          dot: 'bg-cyan-viz animate-ping',
          icon: Clock,
          text: label || 'In Production',
          isGoldAction: false,
        };
      case 'quoted':
        return {
          bg: 'bg-gold/15 text-gold border-gold/40',
          dot: 'bg-gold',
          icon: ShieldCheck,
          text: label || 'Quote Ready',
          isGoldAction: true,
        };
      case 'pending':
        return {
          bg: 'bg-white/10 text-ink-secondary border-white/15',
          dot: 'bg-ink-secondary',
          icon: Clock,
          text: label || 'Pending Review',
          isGoldAction: false,
        };
      case 'rejected':
      case 'declined':
        return {
          bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          dot: 'bg-rose-400',
          icon: XCircle,
          text: label || 'Declined',
          isGoldAction: false,
        };
      default:
        return {
          bg: 'bg-elevated text-ink-secondary border-white/10',
          dot: 'bg-muted',
          icon: Clock,
          text: label || status,
          isGoldAction: false,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border backdrop-blur-md select-none',
        config.bg,
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dot)} aria-hidden="true" />
      <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" aria-hidden="true" />
      <span>{config.text}</span>
    </span>
  );
};
