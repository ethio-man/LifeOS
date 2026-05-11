import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/client/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0a0f',
          2: '#111118',
          3: '#1a1a24',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          2: 'rgba(255,255,255,0.12)',
        },
        text: {
          DEFAULT: '#e8e8f0',
          2: '#9090a8',
          3: '#5a5a72',
        },
        accent: {
          DEFAULT: '#6c63ff',
          2: '#8b84ff',
        },
        teal: '#00d4aa',
        amber: '#f5a623',
        rose: '#ff6b8a',
        green: '#4ade80',
        blue: '#60a5fa',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        r: '10px',
        r2: '16px',
      },
      animation: {
        'modal-in': 'modalIn 0.2s ease',
        'fade-in': 'fadeIn 0.15s ease',
        'slide-up': 'slideUp 0.25s ease',
      },
      keyframes: {
        modalIn: {
          from: { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          to: { opacity: '1', transform: 'none' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
