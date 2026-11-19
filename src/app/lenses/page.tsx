'use client';

import React, { useState } from 'react';
import { LENS_LIST } from '@/lib/lenses';
import { useLenses } from '@/context/LensContext';
import { LensCategory, LensId } from '@/types';
import {
  Eye,
  Sliders,
  Sparkles,
  ExternalLink,
  Layers,
  HelpCircle,
} from 'lucide-react';

export default function LensesPage() {
  const { activeLenses, toggleLens } = useLenses();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered =
    selectedCategory === 'all'
      ? LENS_LIST
      : LENS_LIST.filter((l) => l.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
              Impairment Catalog
            </span>
            <span className="text-xs text-zinc-400 font-mono">11 Supported Conditions</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-zinc-800/80 p-1 rounded-xl text-xs">
            {['all', 'visual', 'motor', 'situational', 'cognitive'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-zinc-700 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            The Sensory & Situational Lens Matrix
          </h1>
          <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
            Every lens simulates either a permanent anatomical variation, a temporary injury, or a
            situational environmental barrier. Below are the underlying mathematical models, global
            prevalence metrics, and governing WCAG 2.2 specifications for each.
          </p>
        </div>
      </div>

      {/* Grid of Lenses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((lens) => {
          const isActive = activeLenses.includes(lens.id);
          return (
            <div
              key={lens.id}
              className={`bg-zinc-900 border rounded-2xl p-6 flex flex-col justify-between shadow-lg transition-all ${
                isActive
                  ? 'border-emerald-500/70 bg-zinc-900/90 ring-1 ring-emerald-500/30 shadow-emerald-950/20'
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {lens.category} • {lens.impairmentType}
                  </span>

                  <button
                    onClick={() => toggleLens(lens.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700'
                    }`}
                  >
                    {isActive ? '✓ Lens Active' : 'Toggle Lens'}
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{lens.name}</h3>
                  <p className="text-xs text-emerald-400 font-medium mt-0.5">{lens.tagline}</p>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">{lens.description}</p>

                <div className="pt-3 border-t border-zinc-800/80 space-y-2 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="text-zinc-500 text-[11px]">Prevalence:</span>
                    <span className="text-zinc-300 font-mono text-[11px] font-semibold text-right">
                      {lens.prevalence}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-zinc-500 text-[11px] block">Key WCAG Criteria:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {lens.wcagCriteria.map((c) => (
                        <span
                          key={c.id}
                          className="bg-zinc-950 text-zinc-300 border border-zinc-800 px-2 py-0.5 rounded text-[10px] font-mono"
                        >
                          {c.id} {c.name} ({c.level})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-500 font-mono">
                Engine: {lens.technicalMechanism}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
