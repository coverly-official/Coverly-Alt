import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'glass-strong' | 'glass-subtle' | 'solid';
  interactive?: boolean;
  glowOnHover?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'glass', interactive = false, glowOnHover = true, children, onMouseMove, ...props }, ref) => {
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (glowOnHover) {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
      if (onMouseMove) onMouseMove(e);
    };

    return (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        style={
          glowOnHover
            ? ({
                '--mx': `${mousePos.x}px`,
                '--my': `${mousePos.y}px`,
              } as React.CSSProperties)
            : undefined
        }
        className={cn(
          'relative rounded-card overflow-hidden transition-all duration-300',
          variant === 'glass' && 'glass-card',
          variant === 'glass-strong' && 'glass-strong',
          variant === 'glass-subtle' && 'glass-subtle',
          variant === 'solid' && 'glass-solid',
          interactive && 'glass-card-interactive cursor-pointer',
          className
        )}
        {...props}
      >
        {/* Specular inner rim reflection */}
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] border border-white/10 [mask-image:linear-gradient(135deg,#fff_0%,transparent_60%)]" />

        {/* Cursor-reactive radial gradient border highlight */}
        {glowOnHover && (
          <div
            className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-0 transition-opacity duration-300 hover:opacity-100"
            style={{
              background: `radial-gradient(400px circle at var(--mx, 0px) var(--my, 0px), rgba(247, 177, 23, 0.18), transparent 70%)`,
            }}
          />
        )}

        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
