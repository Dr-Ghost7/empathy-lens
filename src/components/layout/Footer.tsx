'use client';

import React from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Empathy Lens</span>
            </div>
            <p className="text-zinc-400 max-w-md text-xs leading-relaxed">
              An open-source sensory and accessibility simulation lab built to give frontend teams
              firsthand experience with real-world disabilities and situational constraints. Designed
              around WCAG 2.2 standards and the Microsoft Inclusive Design toolkit.
            </p>
          </div>

          <div>
            <h4 className="text-zinc-200 font-semibold mb-3">Standards & References</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.w3.org/WAI/standards-guidelines/wcag/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-200 transition-colors"
                >
                  W3C WCAG 2.2 Guidelines
                </a>
              </li>
              <li>
                <a
                  href="https://www.microsoft.com/design/inclusive/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-200 transition-colors"
                >
                  Microsoft Inclusive Design
                </a>
              </li>
              <li>
                <a
                  href="https://www.w3.org/WAI/ARIA/apg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-200 transition-colors"
                >
                  ARIA Authoring Practices (APG)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-zinc-200 font-semibold mb-3">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-zinc-200 transition-colors">
                  Challenge Arena
                </Link>
              </li>
              <li>
                <Link href="/playground" className="hover:text-zinc-200 transition-colors">
                  Interactive Sandbox
                </Link>
              </li>
              <li>
                <Link href="/lenses" className="hover:text-zinc-200 transition-colors">
                  Full Lens Matrix
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-zinc-200 transition-colors">
                  Methodology & Science
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
          <p>© 2026 Empathy Lens. Built with Next.js, React & Tailwind CSS.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for inclusive, human-centered frontend engineering</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
