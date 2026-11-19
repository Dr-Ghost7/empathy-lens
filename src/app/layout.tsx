import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LensProvider } from '@/context/LensContext';
import { SvgFilters } from '@/components/lenses/SvgFilters';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LensDock } from '@/components/lenses/LensDock';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Empathy Lens | Interactive Web Accessibility & Usability Simulator',
  description:
    'Experience the web through visual, motor, and situational lenses. Diagnose real-world accessibility failures and repair them with WCAG 2.2 compliant code.',
  keywords: [
    'accessibility',
    'a11y',
    'wcag',
    'react',
    'nextjs',
    'colorblindness',
    'simulator',
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
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
        <LensProvider>
          <SvgFilters />
          <Navbar />
          <main className="flex-1 pb-28">{children}</main>
          <Footer />
          <LensDock />
        </LensProvider>
      </body>
    </html>
  );
}
