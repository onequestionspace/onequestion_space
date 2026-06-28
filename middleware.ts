import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
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
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)'],
};
