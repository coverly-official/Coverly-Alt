import React, { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps {
  min: number;
  max: number;
  value: [number, number];
  step?: number;
  onChange: (value: [number, number]) => void;
  formatValue?: (val: number) => string;
  label?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  step = 1,
  onChange,
  formatValue = (v) => v.toString(),
  label,
  className,
}) => {
  const [minVal, maxVal] = value;
  const rangeRef = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (val: number) => Math.round(((val - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    if (rangeRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(maxVal);
      rangeRef.current.style.left = `${minPercent}%`;
      rangeRef.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, getPercent]);

  return (
    <div className={cn('w-full space-y-2 select-none', className)}>
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-ink-secondary">{label}</span>
          <span className="tabular-nums font-bold text-white">
            {formatValue(minVal)} – {formatValue(maxVal)}
          </span>
        </div>
      )}

      <div className="relative flex items-center h-6">
        {/* Track background */}
        <div className="absolute w-full h-1.5 rounded-full bg-elevated border border-white/10" />

        {/* Selected highlighted active range track */}
        <div
          ref={rangeRef}
          className="absolute h-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(247,177,23,0.4)]"
        />

        {/* Hidden dual range inputs for keyboard & drag handling */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={(e) => {
            const nextMin = Math.min(Number(e.target.value), maxVal - step);
            onChange([nextMin, maxVal]);
          }}
          className="thumb thumb--left pointer-events-none absolute w-full h-0 z-20 appearance-none bg-transparent"
          aria-label={`${label || 'Minimum value'}`}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={(e) => {
            const nextMax = Math.max(Number(e.target.value), minVal + step);
            onChange([minVal, nextMax]);
          }}
          className="thumb thumb--right pointer-events-none absolute w-full h-0 z-20 appearance-none bg-transparent"
          aria-label={`${label || 'Maximum value'}`}
        />
      </div>

      <style>{`
        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          pointer-events: all;
          width: 18px;
          height: 18px;
          background-color: #f7b117;
          border-radius: 50%;
          border: 2px solid #2d3250;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .thumb::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .thumb::-webkit-slider-thumb:active {
          transform: scale(1.25);
          outline: 2px solid #f7b117;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};
