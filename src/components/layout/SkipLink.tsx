import React from 'react';

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[10000] px-4 py-2 rounded-xl bg-gold text-canvas font-bold text-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
    >
      Skip to main content
    </a>
  );
};
