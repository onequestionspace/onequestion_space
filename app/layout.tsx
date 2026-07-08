import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from '@/components/ConvexClientProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://onequestion.space'),
  title: 'One Question - Your AI-Powered Q&A Page',
  description:
    'Create your own AI-powered Q&A page. Upload knowledge once. Let AI answer forever.',
  openGraph: {
    images: ['/logo.png'],
    title: 'One Question',
    description: 'Your knowledge. Your answers. Your space.',
    type: 'website',
    locale: 'en_US',
    siteName: 'One Question',
  },
  twitter: {
    images: ['/logo.png'],
    card: 'summary_large_image',
    title: 'One Question',
    description: 'Your knowledge. Your answers. Your space.',
  },
};

export const viewport = {
  themeColor: '#0A0A0A',
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
      className="dark bg-background"
    >
      <body className={`${inter.className} antialiased`}>
        <ClerkProvider
          appearance={{
            layout: {
              logoImageUrl: '/logo.png',
              logoLinkUrl: '/',
            },
            variables: {
              colorPrimary: '#F5A623',
              colorBackground: '#0A0A0A',
              colorText: '#ffffff',
              colorInputBackground: '#111113',
              colorInputText: '#ffffff',
            },
          }}
        >
          <ConvexClientProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
