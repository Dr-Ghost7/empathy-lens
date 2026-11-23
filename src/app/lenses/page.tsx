'use client';

import React, { useState } from 'react';
import { LENS_LIST } from '@/lib/lenses';
import { useLenses } from '@/context/LensContext';
import { LensId } from '@/types';
import {
  Eye,
  Sliders,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  MousePointer2,
  Sun,
  Keyboard,
  Zap,
  WifiOff,
  BellRing,
} from 'lucide-react';

export default function LensesPage() {
  const { activeLenses, toggleLens } = useLenses();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered =
    selectedCategory === 'all'
      ? LENS_LIST
      : LENS_LIST.filter((l) => l.category === selectedCategory);

  return (
    <div className="relative min-h-screen overflow-hidden py-12 px-6">
      {/* Dynamic Ambient Background Elements (Glow Orbs + Grid Mesh) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Soft glowing ambient orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/12 blur-[130px] animate-pulse" />
        <div className="absolute top-1/4 -right-32 w-[28rem] h-[28rem] rounded-full bg-cyan-500/10 blur-[150px]" />
        <div className="absolute bottom-10 left-1/3 w-[32rem] h-[32rem] rounded-full bg-indigo-500/8 blur-[160px]" />

        {/* Subtle geometric dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            maskImage:
              'radial-gradient(ellipse at 50% 30%, black 40%, transparent 85%)',
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Sensory Guide</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Understand how different users perceive the web.
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Accessibility isn&apos;t just abstract rules—it is how real people see, navigate, and
            react to interfaces. Explore each condition below with live visual comparisons and
            actionable engineering rules.
          </p>

          {/* Clean Category Filter Tabs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Lenses' },
              { id: 'visual', label: 'Color & Vision' },
              { id: 'motor', label: 'Motor & Movement' },
              { id: 'situational', label: 'Situational & Network' },
              { id: 'cognitive', label: 'Cognitive & ADHD' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Spacious 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((lens) => {
            const isActive = activeLenses.includes(lens.id);

            return (
              <div
                key={lens.id}
                className={`relative bg-zinc-900/80 border rounded-3xl p-7 flex flex-col justify-between shadow-xl backdrop-blur-sm transition-all duration-300 ${
                  isActive
                    ? 'border-emerald-500/80 bg-zinc-900/95 ring-2 ring-emerald-500/20 shadow-emerald-950/20'
                    : 'border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div className="space-y-6">
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60 font-semibold">
                      {lens.category} • {lens.impairmentType}
                    </span>

                    <button
                      onClick={() => toggleLens(lens.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 border border-zinc-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? 'bg-zinc-950 animate-pulse' : 'bg-emerald-400'
                        }`}
                      />
                      <span>{isActive ? 'Lens Active' : 'Test Filter'}</span>
                    </button>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">{lens.name}</h2>
                    <p className="text-xs text-emerald-400 font-medium mt-1">{lens.tagline}</p>
                  </div>

                  {/* Interactive Visual Demonstration Box */}
                  <div className="bg-zinc-950/80 rounded-2xl p-4 border border-zinc-800/80 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                      <span>VISUAL PREVIEW</span>
                      <span>{isActive ? 'FILTER ACTIVE' : 'STANDARD'}</span>
                    </div>

                    {/* Color Swatch for CVD Lenses */}
                    {(lens.id === 'deuteranopia' ||
                      lens.id === 'protanopia' ||
                      lens.id === 'tritanopia' ||
                      lens.id === 'achromatopsia') && (
                      <div
                        style={{
                          filter:
                            lens.id === 'deuteranopia'
                              ? 'url(#lens-deuteranopia)'
                              : lens.id === 'protanopia'
                              ? 'url(#lens-protanopia)'
                              : lens.id === 'tritanopia'
                              ? 'url(#lens-tritanopia)'
                              : 'grayscale(100%)',
                        }}
                        className="grid grid-cols-4 gap-2 pt-1 transition-all duration-300"
                      >
                        <div className="bg-emerald-500 rounded-xl p-2.5 text-center text-[11px] font-bold text-slate-950 shadow-sm">
                          Green
                          <span className="block text-[9px] font-normal opacity-75">Success</span>
                        </div>
                        <div className="bg-rose-500 rounded-xl p-2.5 text-center text-[11px] font-bold text-white shadow-sm">
                          Red
                          <span className="block text-[9px] font-normal opacity-75">Error</span>
                        </div>
                        <div className="bg-amber-400 rounded-xl p-2.5 text-center text-[11px] font-bold text-slate-950 shadow-sm">
                          Amber
                          <span className="block text-[9px] font-normal opacity-75">Warning</span>
                        </div>
                        <div className="bg-sky-500 rounded-xl p-2.5 text-center text-[11px] font-bold text-white shadow-sm">
                          Blue
                          <span className="block text-[9px] font-normal opacity-75">Info</span>
                        </div>
                      </div>
                    )}

                    {/* Visual preview for Blur */}
                    {lens.id === 'blur' && (
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="flex-1 bg-zinc-900 p-2.5 rounded-xl border border-zinc-800 text-center">
                          <span className="text-[11px] font-bold text-white block">20/20 Vision</span>
                          <span className="text-[10px] text-zinc-400">Crisp, sharp text</span>
                        </div>
                        <div
                          style={{ filter: 'blur(3.5px)' }}
                          className="flex-1 bg-zinc-900 p-2.5 rounded-xl border border-zinc-800 text-center"
                        >
                          <span className="text-[11px] font-bold text-white block">Low Acuity</span>
                          <span className="text-[10px] text-zinc-400">Blurred boundaries</span>
                        </div>
                      </div>
                    )}

                    {/* Visual preview for Sunlight Glare */}
                    {lens.id === 'sunlight' && (
                      <div className="relative rounded-xl overflow-hidden border border-zinc-800 p-3 bg-zinc-900 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">
                          Light Slate Text (#94a3b8)
                        </span>
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,248,220,0.4) 50%, rgba(255,255,255,0.6) 100%)',
                            mixBlendMode: 'screen',
                          }}
                        />
                        <span className="text-[10px] bg-rose-950 text-rose-300 font-bold px-2 py-0.5 rounded border border-rose-800/50">
                          Contrast Washed Out
                        </span>
                      </div>
                    )}

                    {/* Visual preview for Tremor */}
                    {lens.id === 'tremor' && (
                      <div className="flex items-center justify-between gap-3 pt-1 bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-4 h-4 rounded-full border-2 border-dashed border-rose-400 animate-spin" />
                          <span className="text-zinc-300">±15px Pointer Jitter Range</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                          Requires 44px+ Hit Target
                        </span>
                      </div>
                    )}

                    {/* Visual preview for Keyboard Only */}
                    {lens.id === 'keyboard_only' && (
                      <div className="flex items-center justify-between gap-3 pt-1 bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
                        <span className="text-xs text-zinc-300 flex items-center gap-1.5">
                          <Keyboard className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Press Tab to Focus</span>
                        </span>
                        <button className="px-3 py-1 rounded-lg text-[11px] font-bold bg-zinc-800 text-white ring-2 ring-emerald-400 ring-offset-2 ring-offset-zinc-950 focus:outline-none">
                          Focus Ring Active
                        </button>
                      </div>
                    )}

                    {/* Visual preview for Tunnel Vision */}
                    {lens.id === 'tunnel' && (
                      <div className="relative h-12 rounded-xl bg-zinc-900 overflow-hidden flex items-center justify-center border border-zinc-800">
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              'radial-gradient(circle 32px at 50% 50%, transparent 0%, rgba(9,9,11,0.85) 65%, rgba(0,0,0,0.98) 100%)',
                          }}
                        />
                        <span className="text-[11px] font-bold text-white z-10">Central 20° Field</span>
                      </div>
                    )}

                    {/* Visual preview for Slow Network (Subway 2G) */}
                    {lens.id === 'slow_network' && (
                      <div className="flex items-center justify-between gap-3 pt-1 bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
                        <div className="flex items-center gap-2 text-xs">
                          <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
                          <span className="text-zinc-300">2,400ms Subway RTT</span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                          Throttled Packets
                        </span>
                      </div>
                    )}

                    {/* Visual preview for Cognitive Distraction / ADHD */}
                    {lens.id === 'distraction' && (
                      <div className="flex items-center justify-between gap-3 pt-1 bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
                        <div className="flex items-center gap-2 text-xs">
                          <BellRing className="w-4 h-4 text-purple-400 animate-pulse" />
                          <span className="text-zinc-300">Sensory & Flash Interruptions</span>
                        </div>
                        <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                          Divided Attention
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 3 Human-Friendly Insights */}
                  <div className="space-y-3 text-xs leading-relaxed">
                    <div className="flex items-start gap-2.5">
                      <span className="text-emerald-400 font-bold shrink-0 mt-0.5">👁️</span>
                      <div>
                        <strong className="text-zinc-200 font-semibold block">The Friction:</strong>
                        <span className="text-zinc-400 text-[11.5px]">{lens.description}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="text-cyan-400 font-bold shrink-0 mt-0.5">👥</span>
                      <div>
                        <strong className="text-zinc-200 font-semibold block">Who is Impacted:</strong>
                        <span className="text-zinc-400 text-[11.5px] font-mono">{lens.prevalence}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="text-amber-400 font-bold shrink-0 mt-0.5">💡</span>
                      <div>
                        <strong className="text-zinc-200 font-semibold block">The Engineering Rule:</strong>
                        <span className="text-zinc-300 text-[11.5px]">
                          {lens.id === 'deuteranopia' || lens.id === 'protanopia' || lens.id === 'tritanopia'
                            ? 'Never rely on color alone to convey state. Always combine color with text and icons.'
                            : lens.id === 'tremor'
                            ? 'Ensure all interactive targets are at least 44x44px with generous spacing (WCAG 2.5.5).'
                            : lens.id === 'keyboard_only'
                            ? 'Never use outline: none without providing an equal or superior :focus-visible ring.'
                            : lens.id === 'sunlight'
                            ? 'Use at least 4.5:1 text contrast and avoid faint gray borders for input fields.'
                            : 'Ensure clear visual hierarchy, large typography, and persistent status labels.'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Criterion Tag */}
                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {lens.wcagCriteria.map((c) => `${c.id} ${c.name}`).join(' • ')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
