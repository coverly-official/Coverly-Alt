import React from 'react';
import { cn } from '@/lib/utils';

export interface ProductVisualProps {
  productId?: string;
  categorySlug?: string;
  angleIndex?: number; // 0, 1, or 2 for scrubbable angles
  className?: string;
  aspectRatio?: '4/3' | '1/1' | '16/9';
  showStageLighting?: boolean;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  categorySlug = 'precision-machining',
  angleIndex = 0,
  className,
  aspectRatio = '4/3',
  showStageLighting = true,
}) => {
  const normAngle = Math.max(0, Math.min(2, angleIndex));

  // Visual geometric variations per angle
  const rotations = [-14, 0, 18];
  const scale = [0.94, 1.0, 0.96];
  const rot = rotations[normAngle];
  const scl = scale[normAngle];

  // Colors based on category
  const getCategoryTheme = () => {
    switch (categorySlug) {
      case 'electronics-pcba':
        return { primary: '#4ade80', secondary: '#7dd3fc', accent: '#f7b117', glow: 'rgba(74, 222, 128, 0.25)' };
      case 'optical-sensors':
        return { primary: '#7dd3fc', secondary: '#a78bfa', accent: '#f7b117', glow: 'rgba(125, 211, 252, 0.3)' };
      case 'industrial-automation':
        return { primary: '#f7b117', secondary: '#fb923c', accent: '#7dd3fc', glow: 'rgba(247, 177, 23, 0.3)' };
      case 'injection-molding':
      case 'sustainable-packaging':
        return { primary: '#34d399', secondary: '#38bdf8', accent: '#f7b117', glow: 'rgba(52, 211, 153, 0.25)' };
      default:
        return { primary: '#94a3b8', secondary: '#64748b', accent: '#f7b117', glow: 'rgba(148, 163, 184, 0.25)' };
    }
  };

  const theme = getCategoryTheme();

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-stage bg-gradient-to-b from-elevated/70 to-canvas border border-white/10 flex items-center justify-center select-none',
        aspectRatio === '4/3' && 'aspect-[4/3]',
        aspectRatio === '1/1' && 'aspect-square',
        aspectRatio === '16/9' && 'aspect-video',
        className
      )}
      aria-hidden="true"
    >
      {/* Studio Stage Lighting and Rim Light Gradients */}
      {showStageLighting && (
        <>
          {/* Overhead rim light spot */}
          <div
            className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-1/2 rounded-full blur-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, ${theme.glow} 50%, transparent 80%)`,
            }}
          />
          {/* Base shadow reflection pedestal */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-black/50 blur-lg rounded-full" />
          {/* Isometric grid lines subtle stage */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_60%,transparent_100%)] pointer-events-none" />
        </>
      )}

      {/* SVG Industrial Stage Model */}
      <svg
        className="w-4/5 h-4/5 max-w-[260px] max-h-[260px] drop-shadow-[0_16px_24px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(600px) rotateY(${rot}deg) scale(${scl})`,
        }}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad-metal-${categorySlug}-${normAngle}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="35%" stopColor={theme.secondary} />
            <stop offset="70%" stopColor="#2d3250" />
            <stop offset="100%" stopColor="#1e2238" />
          </linearGradient>

          <linearGradient id={`grad-rim-${categorySlug}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f7b117" stopOpacity="0.8" />
            <stop offset="50%" stopColor={theme.primary} stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
          </linearGradient>

          <filter id={`shadow-${normAngle}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Central Complex Industrial Geometry based on Category */}
        {categorySlug === 'electronics-pcba' ? (
          <g filter={`url(#shadow-${normAngle})`}>
            {/* PCB substrate */}
            <rect x="35" y="45" width="130" height="110" rx="6" fill="#1b382b" stroke={theme.primary} strokeWidth="1.5" />
            {/* BGA chip */}
            <rect x="65" y="70" width="45" height="45" rx="3" fill="#2d3250" stroke="#f7b117" strokeWidth="1" />
            <circle cx="87.5" cy="92.5" r="8" fill="#1e2238" stroke="rgba(255,255,255,0.3)" />
            {/* Traces */}
            <path d="M45 60 H65 M45 75 H65 M45 90 H65 M110 75 H155 M110 90 H155 M110 105 H155 M87 115 V140" stroke={theme.accent} strokeWidth="1.5" strokeDasharray="3 2" />
            {/* SMT capacitors */}
            <rect x="120" y="55" width="14" height="8" rx="1" fill="#cbd5e1" />
            <rect x="120" y="125" width="14" height="8" rx="1" fill="#cbd5e1" />
            <rect x="45" y="120" width="18" height="10" rx="1" fill="#64748b" />
          </g>
        ) : categorySlug === 'optical-sensors' ? (
          <g filter={`url(#shadow-${normAngle})`}>
            {/* Cylindrical optical barrel */}
            <rect x="60" y="40" width="80" height="120" rx="14" fill={`url(#grad-metal-${categorySlug}-${normAngle})`} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            {/* Lens element rings */}
            <ellipse cx="100" cy="55" rx="32" ry="14" fill="#0f172a" stroke="#7dd3fc" strokeWidth="2" />
            <ellipse cx="100" cy="55" rx="22" ry="9" fill="url(#grad-rim-optical)" stroke="#f7b117" strokeWidth="1.5" opacity="0.8" />
            {/* Knurled grip texture bands */}
            <path d="M60 85 H140 M60 90 H140 M60 95 H140 M60 100 H140 M60 105 H140" stroke="#424769" strokeWidth="2" strokeDasharray="4 3" />
            <circle cx="100" cy="135" r="4" fill="#4ade80" />
          </g>
        ) : categorySlug === 'industrial-automation' ? (
          <g filter={`url(#shadow-${normAngle})`}>
            {/* Gearhead / servo housing */}
            <circle cx="100" cy="100" r="58" fill={`url(#grad-metal-${categorySlug}-${normAngle})`} stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            <circle cx="100" cy="100" r="44" fill="#1e2238" stroke="#f7b117" strokeWidth="1.5" />
            {/* Hollow shaft center */}
            <circle cx="100" cy="100" r="22" fill="#0a0d1a" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            {/* Bolt circle */}
            <circle cx="100" cy="65" r="3.5" fill="#f7b117" />
            <circle cx="135" cy="100" r="3.5" fill="#f7b117" />
            <circle cx="100" cy="135" r="3.5" fill="#f7b117" />
            <circle cx="65" cy="100" r="3.5" fill="#f7b117" />
            <circle cx="125" cy="75" r="3" fill="#cbd5e1" />
            <circle cx="125" cy="125" r="3" fill="#cbd5e1" />
            <circle cx="75" cy="125" r="3" fill="#cbd5e1" />
            <circle cx="75" cy="75" r="3" fill="#cbd5e1" />
          </g>
        ) : (
          <g filter={`url(#shadow-${normAngle})`}>
            {/* Monolithic CNC Billet / Manifold */}
            <polygon points="50,60 100,32 150,60 150,135 100,165 50,135" fill={`url(#grad-metal-${categorySlug}-${normAngle})`} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
            {/* Facet chamfers */}
            <polyline points="100,32 100,165" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <polyline points="50,60 100,88 150,60" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            {/* Precision machined hydraulic bores */}
            <ellipse cx="75" cy="105" rx="14" ry="10" fill="#1e2238" stroke="#f7b117" strokeWidth="1.5" />
            <ellipse cx="125" cy="105" rx="14" ry="10" fill="#1e2238" stroke="#7dd3fc" strokeWidth="1.5" />
            <ellipse cx="100" cy="60" rx="12" ry="8" fill="#1e2238" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            {/* CMM verification crosshair */}
            <circle cx="100" cy="125" r="5" stroke="#f7b117" strokeWidth="1" strokeDasharray="2 2" />
          </g>
        )}
      </svg>

      {/* Angle index indicator badge in corner */}
      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-canvas/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-ink-secondary">
        ANG {normAngle + 1}/3
      </div>
    </div>
  );
};
