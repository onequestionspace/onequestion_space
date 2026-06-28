const fs = require('fs');

// 1. Create middleware.ts
const middleware = `import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/ask(.*)',
  '/api/og-preview(.*)',
  '/api/check-username(.*)',
  '/api/explore(.*)',
  '/blog(.*)',
  '/pricing(.*)',
  '/contact(.*)',
  '/features(.*)',
  '/privacy(.*)',
  '/terms(.*)',
  '/waitlist(.*)',
  '/founding(.*)',
  '/early(.*)',
  '/:username',
]);

const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);
const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Not signed in trying to access dashboard
  if (!userId && isDashboardRoute(req)) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Allow public routes
  if (isPublicRoute(req)) return NextResponse.next();

  // Protect everything else
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)'],
};
`;

fs.writeFileSync('middleware.ts', middleware);
console.log('middleware.ts created');

// 2. Fix Hero — claim button should go to /sign-up not /dashboard
let hero = fs.readFileSync('components/Hero.tsx', 'utf8');
hero = hero.replace(
  `  const handleClaim = () => {
    const u = username.trim().toLowerCase();
    window.location.href = isSignedIn ? '/dashboard?username=' + u : '/sign-up?username=' + u;
  };`,
  `  const handleClaim = () => {
    const u = username.trim().toLowerCase();
    if (isSignedIn) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/sign-up?username=' + u;
    }
  };`
);
fs.writeFileSync('components/Hero.tsx', hero);
console.log('Hero fixed');

// 3. Fix sign-up page to redirect to /onboarding after sign-up
const signUpPath = 'app/sign-up/[[...sign-up]]/page.tsx';
let signup = fs.readFileSync(signUpPath, 'utf8');

// Add afterSignUpUrl to SignUp component
if (!signup.includes('afterSignUpUrl')) {
  signup = signup.replace(
    '<SignUp',
    '<SignUp afterSignUpUrl="/onboarding" afterSignInUrl="/dashboard"'
  );
  fs.writeFileSync(signUpPath, signup);
  console.log('sign-up page fixed');
} else {
  console.log('sign-up already has afterSignUpUrl');
}

// 4. Fix sign-in page to redirect to /dashboard
const signInPath = 'app/sign-in/[[...sign-in]]/page.tsx';
let signin = fs.readFileSync(signInPath, 'utf8');
if (!signin.includes('afterSignInUrl')) {
  signin = signin.replace(
    '<SignIn',
    '<SignIn afterSignInUrl="/dashboard"'
  );
  fs.writeFileSync(signInPath, signin);
  console.log('sign-in page fixed');
}

// 5. Fix DashboardLayout hamburger menu — add Settings and Studio
let dl = fs.readFileSync('components/DashboardLayout.tsx', 'utf8');

// Check if Settings already in navItems
if (!dl.includes("'/dashboard/settings'")) {
  dl = dl.replace(
    `const navItems = [`,
    `const navItems = [`
  );
  // Find the navItems array and add missing items
  dl = dl.replace(
    `  { label: 'Space Studio ✦', href: '/dashboard/studio', icon: Layers },`,
    `  { label: 'Space Studio', href: '/dashboard/studio', icon: Layers },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },`
  );
}

fs.writeFileSync('components/DashboardLayout.tsx', dl);
console.log('DashboardLayout fixed');

