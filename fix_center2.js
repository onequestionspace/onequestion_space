const fs = require('fs');

// Fix AuthLayout - constrain properly
let layout = fs.readFileSync('components/AuthLayout.tsx', 'utf8');
layout = layout.replace(
  'className="min-h-screen bg-background flex flex-col items-center justify-center px-5 py-8 relative overflow-hidden w-full"',
  'className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8 relative overflow-x-hidden w-screen"'
);
fs.writeFileSync('components/AuthLayout.tsx', layout);
console.log('✓ AuthLayout outer fixed');

// Fix SignUp - constrain Clerk rootBox via appearance
let signup = fs.readFileSync('app/sign-up/[[...sign-up]]/page.tsx', 'utf8');
signup = signup.replace(
  'rootBox: "!w-full",',
  'rootBox: "!w-full !max-w-full !overflow-hidden",'
);
fs.writeFileSync('app/sign-up/[[...sign-up]]/page.tsx', signup);
console.log('✓ SignUp rootBox fixed');

// Fix SignIn - same
let signin = fs.readFileSync('app/sign-in/[[...sign-in]]/page.tsx', 'utf8');
signin = signin.replace(
  'rootBox: "!w-full",',
  'rootBox: "!w-full !max-w-full !overflow-hidden",'
);
fs.writeFileSync('app/sign-in/[[...sign-in]]/page.tsx', signin);
console.log('✓ SignIn rootBox fixed');
