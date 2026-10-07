import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from '@/components/ConvexClientProvider';
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://onequestion.space'),
  title: 'OneQuestion — Stop answering the same questions twice',
  description: 'Turn your knowledge into a personal AI page that answers questions about you, your work and your expertise — 24/7.',
  openGraph: {
    images: ['/logo.png'],
    title: 'OneQuestion',
    description: 'Your personal AI page for questions about you, your work and your expertise.',
    type: 'website',
    locale: 'en_US',
    siteName: 'One Question',
  },
  twitter: {
    images: ['/logo.png'],
    card: 'summary_large_image',
    title: 'OneQuestion',
    description: 'Your personal AI page for questions about you, your work and your expertise.',
  },
};

export const viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="bg-background"
    >
      <body className={`${inter.className} antialiased`}>
        <ClerkProvider
          appearance={{
            layout: {
              logoImageUrl: '/logo.png',
              logoLinkUrl: '/',
            },
            variables: {
              colorPrimary: '#09090B',
              colorBackground: '#FFFFFF',
              colorText: '#09090B',
              colorInputBackground: '#FFFFFF',
              colorInputText: '#09090B',
            },
          }}
        >
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
