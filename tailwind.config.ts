import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0208',
        foreground: '#ffffff',
        primary: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
        },
        gold: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
        },
        crimson: {
          DEFAULT: '#ef4444',
          light: '#f87171',
          dark: '#dc2626',
        },
        chalk: {
          DEFAULT: '#fafafa',
          warm: '#fef9f0',
          cool: '#f0eef8',
        },
        accent: {
          red: '#ef4444',
          yellow: '#facc15',
          pink: '#ec4899',
          white: '#f4f4f5',
          amber: '#f59e0b',
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
        'glow': '0 0 20px rgba(245, 158, 11, 0.4)',
        'glow-lg': '0 0 40px rgba(245, 158, 11, 0.5)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.4)',
        'glow-red-lg': '0 0 40px rgba(239, 68, 68, 0.5)',
        'glow-white': '0 0 20px rgba(250, 250, 250, 0.15)',
        'glow-multi': '0 0 20px rgba(245, 158, 11, 0.3), 0 0 40px rgba(239, 68, 68, 0.2), 0 0 60px rgba(250, 204, 21, 0.1)',
        'chalk': '0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        'gradient-fire': 'linear-gradient(135deg, #facc15 0%, #f59e0b 40%, #ef4444 100%)',
        'gradient-chalk': 'linear-gradient(135deg, #fafafa 0%, #f0eef8 100%)',
        'gradient-multi': 'linear-gradient(135deg, #facc15 0%, #f59e0b 33%, #ef4444 66%, #ec4899 100%)',
        'gradient-alt': 'linear-gradient(135deg, #facc15 0%, #f59e0b 50%, #ef4444 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        'gradient-crimson': 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
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
        'snap-in': 'snapIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'shimmer': 'shimmer 2.5s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
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
        snapIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(245,158,11,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(239,68,68,0.4), 0 0 60px rgba(245,158,11,0.2)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
