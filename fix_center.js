const fs = require('fs');

let layout = fs.readFileSync('components/AuthLayout.tsx', 'utf8');

// Fix the outer container - add px-4 and ensure proper centering
layout = layout.replace(
  'className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden"',
  'className="min-h-screen bg-background flex flex-col items-center justify-center px-5 py-8 relative overflow-hidden w-full"'
);

// Fix the inner content wrapper - explicit centering
layout = layout.replace(
  'className="w-full max-w-md space-y-6 relative z-10 mx-auto"',
  'className="w-full max-w-md space-y-6 relative z-10 mx-auto self-center"'
);

fs.writeFileSync('components/AuthLayout.tsx', layout);
console.log('✓ Centering fixed');
