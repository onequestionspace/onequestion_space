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
        background: '#ffffff',
        foreground: '#09090B',
        primary: {
          DEFAULT: '#09090B',
          light: '#27272A',
          dark: '#000000',
        },
        muted: {
          DEFAULT: '#F4F4F5',
          foreground: '#71717A',
        },
        card: {
          DEFAULT: '#FFFFFF',
          hover: '#FAFAFA',
        },
        border: '#E4E4E7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['4.5rem', { lineHeight: '1.04', letterSpacing: '-0.03em', fontWeight: '900' }],
        'display-2': ['3.5rem', { lineHeight: '1.08', letterSpacing: '-0.02em', fontWeight: '900' }],
        'display-3': ['2.5rem', { lineHeight: '1.12', letterSpacing: '-0.02em', fontWeight: '800' }],
      },
      boxShadow: {
        'soft': 'none',
        'elevated': 'none',
        'premium': 'none',
        'card': 'none',
        'card-hover': 'none',
        'amber-glow': 'none',
        'amber-glow-lg': 'none',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'slide-up': 'slideUp 0.3s ease-out',
        'float': 'float 20s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'gradient': 'gradientShift 3s ease infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'counter': 'counter 2s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-12px) rotate(0.5deg)' },
          '66%': { transform: 'translateY(6px) rotate(-0.5deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
