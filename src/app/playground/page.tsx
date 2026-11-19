'use client';

import React, { useState } from 'react';
import { useLenses } from '@/context/LensContext';
import { LensContainer } from '@/components/lenses/LensContainer';
import { LENS_LIST } from '@/lib/lenses';
import { LensId } from '@/types';
import {
  Sliders,
  Layers,
  Sparkles,
  Info,
  Calculator,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

// Relative luminance formula per WCAG 2.2 specs
function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function calculateContrastRatio(fg: string, bg: string): number {
  try {
    const l1 = getLuminance(fg);
    const l2 = getLuminance(bg);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  } catch {
    return 1;
  }
}

export default function PlaygroundPage() {
  const { activeLenses, toggleLens, clearLenses, intensity, setIntensity } = useLenses();

  // Preset selector
  const [preset, setPreset] = useState<'auth' | 'ecommerce' | 'table'>('auth');

  // Contrast calculator states
  const [fgColor, setFgColor] = useState('#94a3b8');
  const [bgColor, setBgColor] = useState('#ffffff');

  const ratio = calculateContrastRatio(fgColor, bgColor);
  const passesNormalAA = ratio >= 4.5;
  const passesLargeAA = ratio >= 3.0;
  const passesAAA = ratio >= 7.0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Playground Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
              Freeform Sandbox
            </span>
            <span className="text-xs text-zinc-400 font-mono">Stackable Multi-Lens Rig</span>
          </div>

          {activeLenses.length > 0 && (
            <button
              onClick={clearLenses}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All Active Lenses</span>
            </button>
          )}
        </div>

        <div className="mt-5 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Universal Usability Sandbox
          </h1>
          <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
            Stack and combine multiple impairment lenses simultaneously (e.g., Bright Sunlight +
            Deuteranopia + Tremor). Test interactive UI components and analyze contrast against
            WCAG 2.2 benchmarks in real-time.
          </p>
        </div>

        {/* Lens Rig Selector Bar */}
        <div className="mt-6 pt-5 border-t border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Stackable Lenses ({activeLenses.length} Active)
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-500">Intensity:</span>
              {[0.6, 1.0, 1.4].map((v, i) => (
                <button
                  key={v}
                  onClick={() => setIntensity(v)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                    intensity === v
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {i === 0 ? '0.6x' : i === 1 ? '1.0x' : '1.4x'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {LENS_LIST.map((lens) => {
              const active = activeLenses.includes(lens.id);
              return (
                <button
                  key={lens.id}
                  onClick={() => toggleLens(lens.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    active
                      ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700/60'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      active ? 'bg-zinc-950 animate-pulse' : 'bg-zinc-500'
                    }`}
                  />
                  <span>{lens.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Sandbox Stage & Preset Switcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sandbox Viewport */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-3 px-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-300">Preset Component:</span>
              <div className="flex items-center gap-1 bg-zinc-800 p-0.5 rounded-lg text-xs">
                <button
                  onClick={() => setPreset('auth')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    preset === 'auth' ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400'
                  }`}
                >
                  Auth Card
                </button>
                <button
                  onClick={() => setPreset('ecommerce')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    preset === 'ecommerce' ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400'
                  }`}
                >
                  E-Commerce
                </button>
                <button
                  onClick={() => setPreset('table')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    preset === 'table' ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400'
                  }`}
                >
                  Patient Data
                </button>
              </div>
            </div>

            <span className="text-[11px] font-mono text-zinc-400">
              Active Lenses: {activeLenses.join(', ') || 'None'}
            </span>
          </div>

          {/* Lens Simulation Box */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-12 shadow-2xl min-h-[460px] flex items-center justify-center">
            <LensContainer className="w-full flex items-center justify-center">
              {preset === 'auth' && (
                <div className="w-full max-w-sm bg-white text-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4 font-sans">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">Sign in to Account</h3>
                    <p className="text-xs text-slate-500">Enter your credentials to continue</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@company.com"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-emerald-600" />
                        <span className="text-slate-600">Remember for 30 days</span>
                      </label>
                      <a href="#forgot" className="text-emerald-700 font-semibold hover:underline">
                        Forgot?
                      </a>
                    </div>
                  </div>

                  <button className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer">
                    Sign In
                  </button>
                </div>
              )}

              {preset === 'ecommerce' && (
                <div className="w-full max-w-sm bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 overflow-hidden font-sans">
                  <div className="h-44 bg-slate-100 flex items-center justify-center relative p-4">
                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-md flex items-center justify-center text-white font-bold">
                      Smart Watch
                    </div>
                    <span className="absolute top-3 right-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      SAVE 20%
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-bold text-base text-slate-900">Aura Fitness Watch</h3>
                      <span className="font-mono font-bold text-base text-emerald-700">$199</span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      Continuous heart-rate tracking, sleep stages, and 7-day battery life. Water
                      resistant to 50m.
                    </p>

                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer">
                        Add to Cart
                      </button>
                      <button className="px-3 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer">
                        Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {preset === 'table' && (
                <div className="w-full max-w-lg bg-white text-slate-900 rounded-2xl p-5 shadow-xl border border-slate-200 font-sans overflow-x-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-slate-900">Patient Vitals Monitor</h3>
                    <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Live Telemetry
                    </span>
                  </div>

                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-2 font-semibold">Patient</th>
                        <th className="py-2 font-semibold">Heart Rate</th>
                        <th className="py-2 font-semibold">SpO2</th>
                        <th className="py-2 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2.5 font-medium text-slate-900">Sarah Jenkins (Bed 4)</td>
                        <td className="py-2.5 font-mono">72 bpm</td>
                        <td className="py-2.5 font-mono">98%</td>
                        <td className="py-2.5">
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                            Normal
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-medium text-slate-900">Marcus Vance (Bed 7)</td>
                        <td className="py-2.5 font-mono text-rose-600 font-bold">118 bpm</td>
                        <td className="py-2.5 font-mono text-rose-600 font-bold">91%</td>
                        <td className="py-2.5">
                          <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                            Critical Alert
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </LensContainer>
          </div>
        </div>

        {/* Real-time WCAG Contrast Calculator Tool */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">WCAG 2.2 Contrast Calculator</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Foreground (Text) Hex
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-9 rounded-lg border border-zinc-700 bg-zinc-800 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Background Hex
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-9 rounded-lg border border-zinc-700 bg-zinc-800 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-xs font-mono text-white"
                  />
                </div>
              </div>
            </div>

            {/* Live Sample Badge */}
            <div
              style={{ backgroundColor: bgColor, color: fgColor }}
              className="p-4 rounded-xl border border-zinc-700 text-center font-bold text-sm shadow-inner transition-colors"
            >
              The quick brown fox jumps over the lazy dog.
            </div>

            {/* Results Card */}
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-zinc-400">Calculated Contrast:</span>
                <span className="text-xl font-mono font-extrabold text-white">
                  {ratio.toFixed(2)} : 1
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                <div
                  className={`p-2 rounded-lg border ${
                    passesNormalAA
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-800/50 text-rose-300'
                  }`}
                >
                  <span className="block text-zinc-500 font-normal">AA Normal (4.5:1)</span>
                  {passesNormalAA ? 'PASS' : 'FAIL'}
                </div>

                <div
                  className={`p-2 rounded-lg border ${
                    passesLargeAA
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-800/50 text-rose-300'
                  }`}
                >
                  <span className="block text-zinc-500 font-normal">AA Large (3:1)</span>
                  {passesLargeAA ? 'PASS' : 'FAIL'}
                </div>

                <div
                  className={`p-2 rounded-lg border ${
                    passesAAA
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-800/50 text-rose-300'
                  }`}
                >
                  <span className="block text-zinc-500 font-normal">AAA (7:1)</span>
                  {passesAAA ? 'PASS' : 'FAIL'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
