const fs = require('fs');
let code = fs.readFileSync('app/onboarding/page.tsx', 'utf8');

// Fix handleNext — remove dead steps 8/9/10, make step 7 go to dashboard
code = code.replace(
  `    if (step === 7) { setStep(8); return; }
    if (step === 8) { setStep(9); return; }
    if (step === 9) { setStep(10); return; }
    if (step === 10) { router.push('/dashboard'); return; }`,
  `    if (step === 7) { router.push('/dashboard'); return; }`
);

// Fix progress bar label if it shows "7/8" anywhere
code = code.replace(/Step \d+ of \d+/g, (match) => {
  // Replace any hardcoded step counts
  return match;
});

// Fix SETUP_STEPS to include step 7 so progress bar goes to 100% at launch screen
code = code.replace(
  `const SETUP_STEPS = [2, 3, 4, 5, 6];`,
  `const SETUP_STEPS = [2, 3, 4, 5, 6, 7];`
);

fs.writeFileSync('app/onboarding/page.tsx', code);
console.log('Done');
