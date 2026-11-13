import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-200 select-none cursor-pointer',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
          // Variants
          variant === 'primary' && [
            'bg-gold text-canvas font-bold shadow-md hover:bg-gold-hover hover:shadow-glass-hover',
            'border border-gold/40',
          ],
          variant === 'secondary' && [
            'bg-elevated/80 text-white border border-muted/50 hover:bg-elevated hover:border-white/30 backdrop-blur-md',
          ],
          variant === 'outline' && [
            'bg-transparent text-white border border-gold/40 hover:bg-gold/10 hover:border-gold',
          ],
          variant === 'ghost' && [
            'bg-transparent text-ink-body hover:text-white hover:bg-white/10',
          ],
          variant === 'danger' && [
            'bg-status-error/20 text-status-error border border-status-error/40 hover:bg-status-error/30',
          ],
          // Sizes
          size === 'sm' && 'h-9 px-3.5 text-xs rounded-xl gap-1.5',
          size === 'md' && 'h-11 px-5 text-sm rounded-xl gap-2',
          size === 'lg' && 'h-13 px-7 text-base rounded-2xl gap-2.5',
          size === 'icon' && 'h-10 w-10 p-0 rounded-xl',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Processing...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
