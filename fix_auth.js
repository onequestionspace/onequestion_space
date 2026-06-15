const fs = require('fs');

// Fix 1: SignUp page - add signInUrl to point to our page
let signup = fs.readFileSync('app/sign-up/[[...sign-up]]/page.tsx', 'utf8');
signup = signup.replace(
  '<SignUp\n          forceRedirectUrl={username ? \'/onboarding?username=\' + username : \'/onboarding\'}\n          signInForceRedirectUrl="/dashboard"\n          appearance={clerkAppearance}\n        />',
  '<SignUp\n          forceRedirectUrl={username ? \'/onboarding?username=\' + username : \'/onboarding\'}\n          signInForceRedirectUrl="/dashboard"\n          signInUrl="/sign-in"\n          appearance={clerkAppearance}\n        />'
);
fs.writeFileSync('app/sign-up/[[...sign-up]]/page.tsx', signup);
console.log('✓ SignUp: signInUrl fixed');

// Fix 2: SignIn page - add signUpUrl to point to our page
let signin = fs.readFileSync('app/sign-in/[[...sign-in]]/page.tsx', 'utf8');
signin = signin.replace(
  '<SignIn\n          forceRedirectUrl="/dashboard"\n          signUpForceRedirectUrl="/dashboard"\n          appearance={clerkAppearance}\n        />',
  '<SignIn\n          forceRedirectUrl="/dashboard"\n          signUpForceRedirectUrl="/dashboard"\n          signUpUrl="/sign-up"\n          appearance={clerkAppearance}\n        />'
);
fs.writeFileSync('app/sign-in/[[...sign-in]]/page.tsx', signin);
console.log('✓ SignIn: signUpUrl fixed');

// Fix 3: AuthLayout - ensure card and content are properly centered
let layout = fs.readFileSync('components/AuthLayout.tsx', 'utf8');
layout = layout.replace(
  'className="w-full max-w-md space-y-6 relative z-10"',
  'className="w-full max-w-md space-y-6 relative z-10 mx-auto"'
);
// Also center the inner card content
layout = layout.replace(
  'className="relative rounded-3xl p-8 border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden"',
  'className="relative rounded-3xl p-8 border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden w-full"'
);
fs.writeFileSync('components/AuthLayout.tsx', layout);
console.log('✓ AuthLayout: centering fixed');

console.log('\nAll fixes applied.');
