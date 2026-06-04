import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/lib/theme-context';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

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

export const viewport: Viewport = {
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
    <ClerkProvider>
      <ThemeProvider>
        <html lang="en" className="bg-background">
          <body className={`${inter.className} antialiased`}>
            <div className="flex flex-col min-h-screen mesh-background">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  );
}
