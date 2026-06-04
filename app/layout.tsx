import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { LayoutWrapper } from '@/components/LayoutWrapper';

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
    <ClerkProvider>
      <html lang="en" className="bg-background">
        <body className={`${inter.className} antialiased`}>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
