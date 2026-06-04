'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

/**
 * LayoutWrapper
 * Conditionally renders Navbar and Footer based on the current route
 */
export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Pages where we want to hide the global Footer to avoid redundancy
  const hideFooterOn = ['/privacy', '/terms', '/blog', '/sign-in', '/sign-up'];
  
  // Pages where we want to hide the global Navbar
  const hideNavbarOn = ['/sign-in', '/sign-up'];

  // Check if current path is a public Q&A page (e.g., /[username])
  // This is a bit tricky with Next.js App Router as we don't know all usernames
  // But we know which paths are NOT usernames
  const isFixedPath = [
    '/', '/privacy', '/terms', '/blog', '/pricing', '/waitlist', 
    '/dashboard', '/dashboard/knowledge', '/dashboard/analytics', 
    '/dashboard/billing', '/dashboard/settings', '/sign-in', '/sign-up'
  ].includes(pathname) || pathname.startsWith('/dashboard/') || pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

  const isPublicQAPage = !isFixedPath && pathname !== '/';
  const shouldHideFooter = hideFooterOn.includes(pathname) || isPublicQAPage || pathname.startsWith('/dashboard');
  const shouldHideNavbar = hideNavbarOn.includes(pathname) || pathname.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen mesh-background">
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}
