import React from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export interface ErrorPanelProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorPanel: React.FC<ErrorPanelProps> = ({
  title = 'Service Unavailable',
  message = 'Failed to load live data from backend. You may retry or continue using local demo mode.',
  onRetry,
  className,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        'glass-card rounded-card p-6 border border-status-error/30 bg-status-error/5 text-center flex flex-col items-center max-w-md mx-auto my-6',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-status-error/15 border border-status-error/30 flex items-center justify-center text-status-error mb-3.5">
        <AlertOctagon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-white mb-1.5">{title}</h4>
      <p className="text-xs text-ink-secondary mb-4 leading-relaxed max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="gap-2">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Request</span>
        </Button>
      )}
    </div>
  );
};
