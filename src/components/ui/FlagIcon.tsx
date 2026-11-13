import React from 'react';
import { cn } from '@/lib/utils';

export interface FlagIconProps {
  countryCode: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Clean inline vector flag depictions for the industrial manufacturing countries
export const FlagIcon: React.FC<FlagIconProps> = ({ countryCode, className, size = 'sm' }) => {
  const code = (countryCode || 'DE').toUpperCase();

  const sizeClasses = {
    sm: 'w-4 h-3',
    md: 'w-5 h-3.5',
    lg: 'w-6 h-4',
  }[size];

  // Render SVG flag graphics
  return (
    <span
      className={cn(
        'inline-block overflow-hidden rounded-[2px] shadow-sm border border-white/20 shrink-0',
        sizeClasses,
        className
      )}
      title={`Country: ${code}`}
      aria-label={`Flag of ${code}`}
    >
      {code === 'DE' ? (
        <svg viewBox="0 0 5 3" className="w-full h-full">
          <rect width="5" height="1" y="0" fill="#000000" />
          <rect width="5" height="1" y="1" fill="#dd0000" />
          <rect width="5" height="1" y="2" fill="#ffce00" />
        </svg>
      ) : code === 'JP' ? (
        <svg viewBox="0 0 5 3" className="w-full h-full">
          <rect width="5" height="3" fill="#ffffff" />
          <circle cx="2.5" cy="1.5" r="0.9" fill="#bc002d" />
        </svg>
      ) : code === 'TW' ? (
        <svg viewBox="0 0 5 3" className="w-full h-full">
          <rect width="5" height="3" fill="#fe0000" />
          <rect width="2.5" height="1.5" fill="#000095" />
          <circle cx="1.25" cy="0.75" r="0.45" fill="#ffffff" />
        </svg>
      ) : code === 'US' ? (
        <svg viewBox="0 0 5 3" className="w-full h-full">
          <rect width="5" height="3" fill="#b22234" />
          <line x1="0" y1="0.46" x2="5" y2="0.46" stroke="#ffffff" strokeWidth="0.23" />
          <line x1="0" y1="0.92" x2="5" y2="0.92" stroke="#ffffff" strokeWidth="0.23" />
          <line x1="0" y1="1.38" x2="5" y2="1.38" stroke="#ffffff" strokeWidth="0.23" />
          <line x1="0" y1="1.84" x2="5" y2="1.84" stroke="#ffffff" strokeWidth="0.23" />
          <line x1="0" y1="2.3" x2="5" y2="2.3" stroke="#ffffff" strokeWidth="0.23" />
          <line x1="0" y1="2.76" x2="5" y2="2.76" stroke="#ffffff" strokeWidth="0.23" />
          <rect width="2" height="1.6" fill="#3c3b6e" />
        </svg>
      ) : code === 'KR' ? (
        <svg viewBox="0 0 5 3" className="w-full h-full">
          <rect width="5" height="3" fill="#ffffff" />
          <circle cx="2.5" cy="1.5" r="0.75" fill="#cd2e3a" />
        </svg>
      ) : code === 'IT' ? (
        <svg viewBox="0 0 5 3" className="w-full h-full">
          <rect width="1.67" height="3" x="0" fill="#009246" />
          <rect width="1.67" height="3" x="1.67" fill="#ffffff" />
          <rect width="1.67" height="3" x="3.33" fill="#ce2b37" />
        </svg>
      ) : code === 'SE' ? (
        <svg viewBox="0 0 5 3" className="w-full h-full">
          <rect width="5" height="3" fill="#006aa7" />
          <rect width="0.8" height="3" x="1.5" fill="#fecc00" />
          <rect width="5" height="0.8" y="1.1" fill="#fecc00" />
        </svg>
      ) : (
        <svg viewBox="0 0 5 3" className="w-full h-full">
          <rect width="5" height="3" fill="#da251d" />
          <polygon points="2.5,0.7 2.8,1.6 3.7,1.6 3.0,2.1 3.3,2.9 2.5,2.4 1.7,2.9 2.0,2.1 1.3,1.6 2.2,1.6" fill="#ffff00" />
        </svg>
      )}
    </span>
  );
};
