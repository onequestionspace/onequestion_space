const fs = require('fs');

fs.writeFileSync('tailwind.config.ts', `import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        foreground: '#ffffff',
        primary: {
          DEFAULT: '#a855f7',
          light: '#c084fc',
          dark: '#7c3aed',
        },
        accent: {
          red: '#ef4444',
          yellow: '#facc15',
          pink: '#ec4899',
        },
        muted: {
          DEFAULT: '#27272a',
          foreground: '#a1a1aa',
        },
        card: {
          DEFAULT: '#18181b',
          hover: '#27272a',
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(168, 85, 247, 0.4)',
        'glow-lg': '0 0 40px rgba(168, 85, 247, 0.5)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.4)',
        'glow-multi': '0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(236, 72, 153, 0.2)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        'gradient-multi': 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #ef4444 100%)',
        'gradient-alt': 'linear-gradient(135deg, #facc15 0%, #ec4899 50%, #a855f7 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 10s ease-in-out infinite',
        'rise': 'rise 12s ease-in infinite',
        'aurora-1': 'aurora1 8s ease-in-out infinite',
        'aurora-2': 'aurora2 10s ease-in-out infinite',
        'aurora-3': 'aurora3 12s ease-in-out infinite',
        'matrix': 'matrix 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-20px) translateX(10px)' },
          '50%': { transform: 'translateY(-10px) translateX(-10px)' },
          '75%': { transform: 'translateY(-30px) translateX(5px)' },
        },
        rise: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.3' },
          '100%': { transform: 'translateY(-110vh) scale(1.5)', opacity: '0' },
        },
        aurora1: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(80px, 40px) scale(1.2)' },
        },
        aurora2: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-60px, -30px) scale(1.1)' },
        },
        aurora3: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(40px, -50px) scale(1.3)' },
        },
        matrix: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
`);

console.log('✓ tailwind.config.ts rewritten cleanly');
