const fs = require('fs');

let onboarding = fs.readFileSync('app/onboarding/page.tsx', 'utf8');

// Wrap the default export in Suspense
onboarding = onboarding.replace(
  "import { useState, useEffect } from 'react';",
  "import { useState, useEffect, Suspense } from 'react';"
);

// Rename the main component and wrap it
onboarding = onboarding.replace(
  'export default function OnboardingPage()',
  'function OnboardingContent()'
);

// Add Suspense wrapper at the end
onboarding = onboarding + `
export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-pulse text-zinc-500">Loading...</div></div>}>
      <OnboardingContent />
    </Suspense>
  );
}
`;

fs.writeFileSync('app/onboarding/page.tsx', onboarding);
console.log('✅ Onboarding — wrapped in Suspense');
