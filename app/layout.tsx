import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from '@/components/ConvexClientProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'One Question - Your AI-Powered Q&A Page',
  description: 'Create your own AI-powered Q&A page. Upload knowledge once. Let AI answer forever.',
  openGraph: {
    title: 'One Question',
    description: 'Your knowledge. Your answers. Your space.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'One Question',
    description: 'Your knowledge. Your answers. Your space.',
  },
};

export const viewport = {
  themeColor: '#a855f7',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ layout: { logoImageUrl: '/logo.png', logoLinkUrl: '/' }, variables: { colorPrimary: '#a855f7', colorBackground: '#0a0a0a', colorText: '#ffffff', colorInputBackground: '#1a1a1a', colorInputText: '#ffffff' } }}>
      <html lang="en" className={cn("dark bg-background", inter.variable)}>
        <body className={`${inter.className} antialiased`}>
          <ConvexClientProvider>
            <div className="flex flex-col min-h-screen mesh-background">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
