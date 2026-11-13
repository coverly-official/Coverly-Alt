import React from 'react';
import { SearchX, FilePlus2 } from 'lucide-react';
import { Button } from './Button';
import { GlassCard } from './GlassCard';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Matching Industrial SKUs Found',
  description = 'Try broadening your filter criteria or submit a custom Request for Quotation (RFQ) directly to our verified manufacturer network.',
  actionText = 'Post an RFQ Instead',
  onAction,
  className,
}) => {
  return (
    <GlassCard
      className={cn(
        'p-10 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8 border border-white/10',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-elevated/80 border border-muted/30 flex items-center justify-center text-muted mb-4">
        <SearchX className="w-7 h-7 text-ink-secondary" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-ink-secondary max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {onAction && (
        <Button variant="primary" size="md" onClick={onAction} className="gap-2">
          <FilePlus2 className="w-4 h-4" />
          <span>{actionText}</span>
        </Button>
      )}
    </GlassCard>
  );
};
