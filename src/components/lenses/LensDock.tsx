'use client';

import React, { useState } from 'react';
import { useLenses } from '@/context/LensContext';
import { LENSES, LENS_LIST } from '@/lib/lenses';
import { LensId } from '@/types';
import {
  Eye,
  Sun,
  Hand,
  Keyboard,
  Sliders,
  X,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Layers,
} from 'lucide-react';

const CATEGORY_ICONS = {
  visual: Eye,
  situational: Sun,
  motor: Hand,
  cognitive: Sparkles,
};

export function LensDock() {
  const {
    activeLenses,
    toggleLens,
    clearLenses,
    intensity,
    setIntensity,
  } = useLenses();

  const [expanded, setExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredLenses =
    selectedCategory === 'all'
      ? LENS_LIST
      : LENS_LIST.filter((l) => l.category === selectedCategory);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-45 max-w-4xl w-[94vw] sm:w-auto">
      {/* Expanded Matrix Drawer */}
      {expanded && (
        <div className="mb-2 p-4 bg-zinc-900/95 border border-zinc-700/80 rounded-2xl shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Lens Matrix & Combinator
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                ({activeLenses.length} active)
              </span>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1 bg-zinc-800/80 p-0.5 rounded-lg text-xs">
              {['all', 'visual', 'motor', 'situational'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                    selectedCategory === cat
                      ? 'bg-zinc-700 text-white font-medium shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Lens Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3 max-h-[42vh] overflow-y-auto pr-1">
            {filteredLenses.map((lens) => {
              const active = activeLenses.includes(lens.id);
              return (
                <button
                  key={lens.id}
                  onClick={() => toggleLens(lens.id)}
                  className={`flex flex-col text-left p-2.5 rounded-xl border transition-all ${
                    active
                      ? 'bg-emerald-950/40 border-emerald-500/70 text-emerald-200 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-semibold truncate">{lens.name}</span>
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        active ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'
                      }`}
                    />
                  </div>
                  <span className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                    {lens.tagline}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Intensity & Controls */}
          <div className="mt-3 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
                <Sliders className="w-3.5 h-3.5 text-zinc-500" />
                Lens Intensity:
              </span>
              <div className="flex items-center gap-2">
                {[0.6, 1.0, 1.4].map((val, idx) => (
                  <button
                    key={val}
                    onClick={() => setIntensity(val)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      intensity === val
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {idx === 0 ? 'Mild' : idx === 1 ? 'Standard' : 'Severe'}
                  </button>
                ))}
              </div>
            </div>

            {activeLenses.length > 0 && (
              <button
                onClick={clearLenses}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Reset all filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Persistent Dock Bar */}
      <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-700/80 p-1.5 px-3 rounded-full shadow-2xl backdrop-blur-xl text-xs">
        {/* Dock Label */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-zinc-700/60 font-semibold text-zinc-200">
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Active Lenses:</span>
          {activeLenses.length === 0 ? (
            <span className="text-zinc-500 font-normal text-[11px]">None (Standard Vision)</span>
          ) : (
            <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono font-bold text-[11px]">
              {activeLenses.length}
            </span>
          )}
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['deuteranopia', 'sunlight', 'blur', 'tremor', 'keyboard_only'] as LensId[]).map(
            (id) => {
              const active = activeLenses.includes(id);
              const lens = LENSES[id];
              return (
                <button
                  key={id}
                  onClick={() => toggleLens(id)}
                  title={lens.name}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full whitespace-nowrap transition-all text-[11px] font-medium ${
                    active
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/60 border border-transparent'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      active ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'
                    }`}
                  />
                  {id === 'deuteranopia'
                    ? 'Deuteranopia'
                    : id === 'sunlight'
                    ? 'Sun Glare'
                    : id === 'blur'
                    ? 'Low Acuity'
                    : id === 'tremor'
                    ? 'Hand Tremor'
                    : 'Keyboard Only'}
                </button>
              );
            }
          )}
        </div>

        {/* More / Expand Toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-1 p-1 rounded-full bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
          aria-label={expanded ? 'Collapse lens matrix' : 'Expand lens matrix'}
        >
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
