import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/layout';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Beelia.ai - AI Marketplace',
  description: 'Discover, purchase, and use AI-powered tools',
  keywords: ['AI', 'marketplace', 'tools', 'machine learning'],
  authors: [{ name: 'Beelia Team' }],
  openGraph: {
    title: 'Beelia.ai - AI Marketplace',
    description: 'Discover, purchase, and use AI-powered tools',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
