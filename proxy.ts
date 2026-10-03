import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/onboarding',
  '/api/explore(.*)',
  '/api/stream(.*)',
  '/api/check-username(.*)',
  '/api/og(.*)',
  '/api/waitlist(.*)',
  '/api/well-known(.*)',
  '/api/paystack(.*)',
  '/blog(.*)',
  '/founding(.*)',
  '/early(.*)',
  '/pricing(.*)',
  '/features(.*)',
  '/contact(.*)',
  '/privacy(.*)',
  '/terms(.*)',
  '/waitlist(.*)',
  '/:username',
]);

const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Protect dashboard
  if (isDashboardRoute(req) && !userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Redirect signed-in users away from auth pages
  if (userId && (
    req.nextUrl.pathname.startsWith('/sign-in') ||
    req.nextUrl.pathname.startsWith('/sign-up')
  )) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
