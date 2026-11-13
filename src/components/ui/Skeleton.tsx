import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rect' | 'circle' | 'text' | 'card';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rect',
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-elevated/60 border border-white/5',
        variant === 'circle' && 'rounded-full',
        variant === 'text' && 'h-4 rounded-md',
        variant === 'rect' && 'rounded-xl',
        variant === 'card' && 'rounded-card h-80',
        className
      )}
      {...props}
    >
      {/* 20 degree angled shimmer pass */}
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer"
        style={{
          background:
            'linear-gradient(110deg, transparent 20%, rgba(103, 111, 157, 0.28) 45%, rgba(255, 255, 255, 0.15) 50%, rgba(103, 111, 157, 0.28) 55%, transparent 80%)',
        }}
      />
    </div>
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="glass-card rounded-card p-4 space-y-3.5 border border-white/10">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="w-24 h-4" />
        <Skeleton variant="circle" className="w-5 h-5" />
      </div>
      <Skeleton className="w-full aspect-[4/3] rounded-stage" />
      <Skeleton variant="text" className="w-4/5 h-5" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton variant="text" className="w-28 h-5" />
        <Skeleton variant="text" className="w-20 h-4" />
      </div>
      <div className="pt-2 flex gap-2">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  );
};
