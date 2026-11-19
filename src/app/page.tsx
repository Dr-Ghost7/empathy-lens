'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CHALLENGES, CHALLENGE_LIST } from '@/lib/challenges';
import { ChallengeId } from '@/types';
import { ChallengeViewer } from '@/components/challenges/ChallengeViewer';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Terminal,
  Compass,
  CheckCircle2,
  Eye,
  Sun,
  Keyboard,
  Hand,
} from 'lucide-react';

export default function HomePage() {
  const [selectedChallengeId, setSelectedChallengeId] = useState<ChallengeId>('sunshine-checkout');

  const selectedChallenge = CHALLENGES[selectedChallengeId];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Hero Banner */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-4 pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Frontend Accessibility Lab</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Experience the web through their eyes, hands, and screens.
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          Try completing common tasks on deliberately flawed web pages while wearing sensory,
          motor, and situational lenses. Discover the friction, inspect the code, and repair the flaws.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#challenge-arena"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Start Challenge Arena</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <Link
            href="/playground"
            className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700 transition-colors flex items-center gap-2"
          >
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            <span>Open Multi-Lens Sandbox</span>
          </Link>
        </div>
      </section>

      {/* Challenge Selection Carousel / Tabs */}
      <section id="challenge-arena" className="space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Interactive Challenge Arena
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Select a scenario to load its simulated environment, diagnostic audit, and fix studio.
            </p>
          </div>
        </div>

        {/* Challenge Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CHALLENGE_LIST.map((c) => {
            const isSelected = c.id === selectedChallengeId;
            const Icon =
              c.category === 'situational'
                ? Sun
                : c.category === 'visual'
                ? Eye
                : c.id === 'keyboard-seat-picker'
                ? Keyboard
                : Hand;

            return (
              <button
                key={c.id}
                onClick={() => setSelectedChallengeId(c.id)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 border-emerald-500 ring-1 ring-emerald-500/40 shadow-lg shadow-emerald-950/20'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                      {c.difficulty}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-white">{c.title}</h3>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                      {c.flawSummary}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500">{c.violations.length} WCAG Flaws</span>
                  <span
                    className={`font-semibold ${
                      isSelected ? 'text-emerald-400' : 'text-zinc-400'
                    }`}
                  >
                    {isSelected ? 'Active Now' : 'Load Level →'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Challenge Active View */}
        <div className="pt-2">
          <ChallengeViewer key={selectedChallenge.id} challenge={selectedChallenge} />
        </div>
      </section>

      {/* Educational Stats Section */}
      <section className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8 sm:p-10 space-y-6">
        <div className="max-w-2xl space-y-2">
          <h3 className="text-lg font-bold text-white">Why Empathy Matters in Frontend Code</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Accessibility isn’t a favor or an afterthought; it is fundamental web craftsmanship.
            When you build with semantic elements, visible focus indicators, and sufficient contrast,
            you build resilient software that works for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-zinc-800/80 text-xs">
          <div className="space-y-1">
            <span className="text-2xl font-black font-mono text-emerald-400">1.3 Billion</span>
            <p className="font-semibold text-white">People Globally</p>
            <p className="text-zinc-400 text-[11px]">
              Live with significant disability (16% of the global human population per WHO).
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-2xl font-black font-mono text-amber-400">96.8%</span>
            <p className="font-semibold text-white">Top 1,000,000 Websites</p>
            <p className="text-zinc-400 text-[11px]">
              Contain detectable WCAG failures, with low-contrast text remaining the #1 barrier
              (WebAIM 2024).
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-2xl font-black font-mono text-cyan-400">100%</span>
            <p className="font-semibold text-white">Client-Side Simulation</p>
            <p className="text-zinc-400 text-[11px]">
              Built with native Next.js, SVG color matrix transforms, and zero tracking scripts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
