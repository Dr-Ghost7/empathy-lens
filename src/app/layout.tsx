import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LensProvider } from '@/context/LensContext';
import { SvgFilters } from '@/components/lenses/SvgFilters';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Empathy Lens | Web Accessibility & Vision Simulator',
  description:
    'Experience the web through visual, motor, and situational accessibility lenses. Audit live websites and test accessible patterns.',
  keywords: [
    'accessibility',
    'a11y',
    'wcag',
    'chrome-extension',
    'react',
    'nextjs',
    'inclusive-design',
  ],
  authors: [{ name: 'Dr-Ghost7', url: 'https://github.com/Dr-Ghost7' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
        <LensProvider>
          <SvgFilters />
          <Navbar />
          <main className="flex-1 pb-16">{children}</main>
          <Footer />
        </LensProvider>
      </body>
    </html>
  );
}
