import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#2d3250',
        elevated: '#424769',
        muted: '#676f9d',
        ink: {
          DEFAULT: '#ffffff',
          primary: 'rgba(255, 255, 255, 1)',
          body: 'rgba(255, 255, 255, 0.88)',
          secondary: 'rgba(255, 255, 255, 0.65)',
          tertiary: 'rgba(255, 255, 255, 0.45)',
        },
        gold: {
          DEFAULT: '#f7b117',
          hover: '#e5a210',
          glow: 'rgba(247, 177, 23, 0.55)',
        },
        cyan: {
          viz: '#7dd3fc',
        },
        slate: {
          viz: '#94a3b8',
        },
        status: {
          success: '#4ade80',
          error: '#f87171',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Inter Tight', 'sans-serif'],
        sans: ['var(--font-body)', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '22px',
        stage: '16px',
        input: '14px',
        pill: '9999px',
      },
      boxShadow: {
        'glass-hover': '0 20px 40px -20px rgba(247, 177, 23, 0.25)',
        'elevated-glow': '0 12px 32px -8px rgba(0, 0, 0, 0.45)',
        'gold-rim': '0 0 0 1px rgba(247, 177, 23, 0.55)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.2s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
