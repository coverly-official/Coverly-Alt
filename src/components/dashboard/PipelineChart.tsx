import React from 'react';
import { motion } from 'framer-motion';

export interface PipelineChartProps {
  title?: string;
  subtitle?: string;
}

export const PipelineChart: React.FC<PipelineChartProps> = ({
  title = 'Sourcing Volume & Escrow Settlements',
  subtitle = 'Monthly procurement spend in thousands USD',
}) => {
  // Monthly data points
  const points = [
    { month: 'Oct', value: 85, target: 70 },
    { month: 'Nov', value: 120, target: 100 },
    { month: 'Dec', value: 165, target: 140 },
    { month: 'Jan', value: 140, target: 130 },
    { month: 'Feb', value: 210, target: 180 },
    { month: 'Mar', value: 285, target: 240 },
  ];

  const maxVal = 320;
  const svgWidth = 600;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 30;

  // Compute coordinates
  const stepX = (svgWidth - paddingX * 2) / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = paddingX + i * stepX;
    const y = svgHeight - paddingY - (p.value / maxVal) * (svgHeight - paddingY * 2);
    return { x, y, ...p };
  });

  const pathD = coords.reduce((acc, c, i) => {
    return i === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`;
  }, '');

  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${svgHeight - paddingY} L ${coords[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div className="rounded-card bg-canvas border border-white/10 p-6 select-none shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
          <p className="text-xs text-ink-secondary">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-cyan-viz font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-viz" />
            <span>Actual Spend</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-muted" />
            <span>Escrow Forecast</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-48 overflow-visible"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Gridlines in #676f9d at 20% opacity */}
          {[0, 100, 200, 300].map((v) => {
            const y = svgHeight - paddingY - (v / maxVal) * (svgHeight - paddingY * 2);
            return (
              <g key={v}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#676f9d"
                  strokeOpacity="0.2"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  fill="#676f9d"
                  fontSize="10"
                  className="tabular-nums font-mono"
                >
                  ${v}k
                </text>
              </g>
            );
          })}

          {/* Filled Area Gradient */}
          <path d={areaD} fill="url(#areaGradient)" />

          {/* Line Path */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#7dd3fc"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          {/* Points + Month labels */}
          {coords.map((c, i) => (
            <g key={i}>
              <circle
                cx={c.x}
                cy={c.y}
                r="4.5"
                fill="#2d3250"
                stroke="#7dd3fc"
                strokeWidth="2"
              />
              <text
                x={c.x}
                y={svgHeight - 10}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="11"
                className="font-medium"
              >
                {c.month}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
