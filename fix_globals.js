const fs = require('fs');

const css = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #f59e0b;
  --primary-light: #fbbf24;
  --primary-dark: #d97706;
  --accent-red: #ef4444;
  --accent-yellow: #facc15;
  --muted: #27272a;
  --muted-foreground: #a1a1aa;
}

body {
  background-color: var(--background);
}

html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--background);
}
::-webkit-scrollbar-thumb {
  background: #f59e0b;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #fbbf24;
}

/* Gradient text — amber only */
.gradient-text {
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-alt {
  background: linear-gradient(135deg, #facc15 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Glass effect */
.glass {
  background: rgba(39, 39, 42, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(245, 158, 11, 0.15);
}

/* Glow effects — amber */
.glow-primary {
  box-shadow: 0 0 30px rgba(245, 158, 11, 0.4);
}
.shadow-glow {
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
}
.shadow-glow-lg {
  box-shadow: 0 0 40px rgba(245, 158, 11, 0.4);
}

/* Dot pattern — subtle amber */
.dot-pattern {
  background-image: radial-gradient(rgba(245, 158, 11, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
}

/* Button */
.btn-primary {
  background: #f59e0b;
  color: #000;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(245, 158, 11, 0.35);
}

/* Card hover */
.card-hover {
  transition: all 0.2s ease;
}
.card-hover:hover {
  transform: translateY(-3px);
  border-color: rgba(245, 158, 11, 0.3);
}

/* Section fade */
.section-fade {
  background: linear-gradient(to bottom, transparent, rgba(14, 10, 5, 0.8), transparent);
  height: 80px;
  margin: -40px 0;
  pointer-events: none;
}

/* Floating particle animation */
@keyframes float {
  0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.15; }
  25% { transform: translateY(-20px) translateX(10px) scale(1.1); opacity: 0.25; }
  50% { transform: translateY(-35px) translateX(-5px) scale(0.95); opacity: 0.2; }
  75% { transform: translateY(-15px) translateX(-15px) scale(1.05); opacity: 0.3; }
}
.animate-float {
  animation: float var(--duration, 12s) var(--delay, 0s) ease-in-out infinite;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.15; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.05); }
}
.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

/* Fix Clerk input autofill */
.cl-formFieldInput:-webkit-autofill,
.cl-formFieldInput:-webkit-autofill:hover,
.cl-formFieldInput:-webkit-autofill:focus,
.cl-formFieldInput:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 100px rgba(255,255,255,0.06) inset !important;
  -webkit-text-fill-color: #ffffff !important;
  caret-color: #ffffff !important;
  border-color: rgba(245,158,11,0.4) !important;
  transition: background-color 9999s ease-in-out 0s !important;
}
.cl-formFieldInput:focus {
  background-color: rgba(255,255,255,0.08) !important;
  color: #ffffff !important;
}
.cl-logoImage, .cl-logoBox img {
  border-radius: 12px !important;
}
.cl-logoBox {
  background: transparent !important;
}
.cl-card {
  background: transparent !important;
}

@layer base {
  :root {
    --background: oklch(0.10 0.01 60);
    --foreground: oklch(0.96 0.01 80);
    --card: oklch(0.14 0.01 60);
    --card-foreground: oklch(0.96 0.01 80);
    --popover: oklch(0.14 0.01 60);
    --popover-foreground: oklch(0.96 0.01 80);
    --primary: oklch(0.75 0.18 75);
    --primary-foreground: oklch(0.10 0.01 60);
    --secondary: oklch(0.20 0.01 60);
    --secondary-foreground: oklch(0.96 0.01 80);
    --muted: oklch(0.20 0.01 60);
    --muted-foreground: oklch(0.60 0.01 60);
    --accent: oklch(0.20 0.01 60);
    --accent-foreground: oklch(0.96 0.01 80);
    --destructive: oklch(0.577 0.245 27.325);
    --border: oklch(1 0 0 / 10%);
    --input: oklch(1 0 0 / 15%);
    --ring: oklch(0.75 0.18 75);
    --radius: 0.625rem;
  }
  .dark {
    --background: oklch(0.10 0.01 60);
    --foreground: oklch(0.96 0.01 80);
    --card: oklch(0.14 0.01 60);
    --card-foreground: oklch(0.96 0.01 80);
    --popover: oklch(0.14 0.01 60);
    --popover-foreground: oklch(0.96 0.01 80);
    --primary: oklch(0.75 0.18 75);
    --primary-foreground: oklch(0.10 0.01 60);
    --secondary: oklch(0.20 0.01 60);
    --secondary-foreground: oklch(0.96 0.01 80);
    --muted: oklch(0.20 0.01 60);
    --muted-foreground: oklch(0.60 0.01 60);
    --accent: oklch(0.20 0.01 60);
    --accent-foreground: oklch(0.96 0.01 80);
    --destructive: oklch(0.704 0.191 22.216);
    --border: oklch(1 0 0 / 10%);
    --input: oklch(1 0 0 / 15%);
    --ring: oklch(0.75 0.18 75);
  }
  * {
    border-color: var(--border);
  }
  body {
    background-color: var(--background);
    color: var(--foreground);
  }
  html {
    font-family: sans-serif;
  }
}
`;

fs.writeFileSync('app/globals.css', css);
console.log('globals.css rewritten — all purple gone');
