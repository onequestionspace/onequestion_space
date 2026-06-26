const fs = require('fs');
let c = fs.readFileSync('tailwind.config.ts', 'utf8');

c = c.replace(
  `        primary: {
          DEFAULT: '#a855f7',
          light: '#c084fc',
          dark: '#7c3aed',
        },`,
  `        primary: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
        },
        purple: {
          DEFAULT: '#a855f7',
          light: '#c084fc',
          dark: '#7c3aed',
        },`
);

c = c.replace(
  `        'glow': '0 0 20px rgba(168, 85, 247, 0.4)',
        'glow-lg': '0 0 40px rgba(168, 85, 247, 0.5)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.4)',
        'glow-multi': '0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(236, 72, 153, 0.2)',`,
  `        'glow': '0 0 20px rgba(245, 158, 11, 0.4)',
        'glow-lg': '0 0 40px rgba(245, 158, 11, 0.5)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.4)',
        'glow-multi': '0 0 20px rgba(245, 158, 11, 0.3), 0 0 40px rgba(251, 191, 36, 0.2)',`
);

c = c.replace(
  `        'gradient-primary': 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        'gradient-multi': 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #ef4444 100%)',
        'gradient-alt': 'linear-gradient(135deg, #facc15 0%, #ec4899 50%, #a855f7 100%)',`,
  `        'gradient-primary': 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        'gradient-multi': 'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)',
        'gradient-alt': 'linear-gradient(135deg, #facc15 0%, #f59e0b 50%, #ef4444 100%)',`
);

// Add snap animation + grain
c = c.replace(
  `        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',`,
  `        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'snap-in': 'snapIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',`
);

c = c.replace(
  `        matrix: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },`,
  `        matrix: {
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
        },`
);

fs.writeFileSync('tailwind.config.ts', c);
console.log('done');
