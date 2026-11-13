import React from 'react';

export const NoiseOverlay: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] mix-blend-overlay noise-layer select-none"
    />
  );
};
