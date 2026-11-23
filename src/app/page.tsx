'use client';

import React, { useState } from 'react';
import { useLenses } from '@/context/LensContext';
import { LensContainer } from '@/components/lenses/LensContainer';
import { SunshineCheckoutScenario } from '@/components/challenges/SunshineCheckoutScenario';
import { KeyboardSeatPickerScenario } from '@/components/challenges/KeyboardSeatPickerScenario';
import { ColorblindFormScenario } from '@/components/challenges/ColorblindFormScenario';
import { TremorDonationScenario } from '@/components/challenges/TremorDonationScenario';
import { LensId } from '@/types';
import {
  Eye,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Code2,
} from 'lucide-react';

function ChromeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" y1="8" x2="12" y2="8" />
      <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
      <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
    </svg>
  );
}

interface PresetOption {
  id: 'checkout' | 'keyboard' | 'colorblind' | 'tremor' | 'subway';
  label: string;
  defaultLens: LensId;
  scenarioTitle: string;
  summary: string;
  wcagRule: string;
  codeFlawed: string;
  codeFixed: string;
}

const PRESETS: PresetOption[] = [
  {
    id: 'checkout',
    label: '1. Checkout & Glare',
    defaultLens: 'sunlight',
    scenarioTitle: 'The Sunshine Checkout (Contrast & Labels)',
    summary:
      'Under 100,000 lux outdoor sunlight, low-contrast placeholder text (#94a3b8) and tiny 16px checkboxes become completely unreadable.',
    wcagRule: 'WCAG 1.4.3 Contrast (Minimum) & 3.3.2 Labels or Instructions',
    codeFlawed: `<input placeholder="Address" className="border-slate-200 text-slate-400 placeholder:text-slate-300" />
<div className="flex items-center gap-1">
  <input type="checkbox" className="w-3.5 h-3.5" />
  <span>I agree to terms</span>
</div>`,
    codeFixed: `<label htmlFor="address" className="block text-xs font-bold text-slate-900 mb-1">
  Street Address *
</label>
<input id="address" className="border-2 border-slate-700 text-slate-900 font-medium" />

<!-- 48px Touch Target Card -->
<label className="flex items-center gap-3 p-3 rounded-xl border border-slate-300 min-h-[48px] cursor-pointer">
  <input type="checkbox" className="w-5 h-5 text-emerald-600" />
  <span className="text-xs font-semibold text-slate-900">I agree to terms</span>
</label>`,
  },
  {
    id: 'keyboard',
    label: '2. Seat Picker',
    defaultLens: 'keyboard_only',
    scenarioTitle: 'Flight Seat Picker (Keyboard & Focus)',
    summary:
      'Coded using <div> tags with outline: none. Keyboard users (Tab / Enter) cannot reach or focus the seats.',
    wcagRule: 'WCAG 2.1.1 Keyboard & 2.4.7 Focus Visible',
    codeFlawed: `<!-- Un-focusable <div> with stripped focus outline -->
<div onClick={selectSeat} className="seat outline-none">
  14B
</div>`,
    codeFixed: `<!-- Semantic <button> with prominent focus ring -->
<button 
  type="button" 
  onClick={selectSeat} 
  aria-label="Seat 14B, $140, Available"
  className="seat cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
>
  14B
</button>`,
  },
  {
    id: 'colorblind',
    label: '3. Clinical Intake',
    defaultLens: 'deuteranopia',
    scenarioTitle: 'Clinical Registration (Colorblind Error States)',
    summary:
      'Errors are indicated only by a red border without text or icons. Under Deuteranopia, red and green borders look identical.',
    wcagRule: 'WCAG 1.4.1 Use of Color & 3.3.1 Error Identification',
    codeFlawed: `<!-- Red border only: indistinguishable under deuteranopia -->
<input className={hasError ? "border-rose-500" : "border-emerald-500"} />`,
    codeFixed: `<!-- Combined color, icon, descriptive text, and aria association -->
<div className="relative">
  <input aria-invalid={hasError} aria-describedby="email-error" className="..." />
  {hasError ? <AlertCircle className="w-4 h-4 text-rose-500" /> : <CheckCircle className="..." />}
</div>
<p id="email-error" className="text-xs text-rose-600 font-semibold mt-1">
  Please enter a valid work email containing '@'
</p>`,
  },
  {
    id: 'tremor',
    label: '4. Donation Widget',
    defaultLens: 'tremor',
    scenarioTitle: 'Fundraiser Donation (Motor Tremor & Target Size)',
    summary:
      'Donation buttons have only 2px gap and tiny hit targets. Involuntary hand tremor causes mis-clicks on adjacent amounts.',
    wcagRule: 'WCAG 2.5.5 / 2.5.8 Target Size',
    codeFlawed: `<!-- Cramped 2px gap pills -->
<div className="flex gap-0.5">
  <button className="px-2 py-1 text-xs">$10</button>
  <button className="px-2 py-1 text-xs">$25</button>
</div>`,
    codeFixed: `<!-- 48px height tiles with 12px grid gap -->
<div className="grid grid-cols-2 gap-3">
  <button className="h-12 rounded-xl border-2 font-bold">$10</button>
  <button className="h-12 rounded-xl border-2 font-bold">$25</button>
</div>`,
  },
  {
    id: 'subway',
    label: '5. Subway 2G & Stalls',
    defaultLens: 'slow_network',
    scenarioTitle: 'Subway 2G Network Latency (Duplicate Submissions & Stalls)',
    summary:
      'On high-latency 2G subway connections (2,500ms RTT), buttons without disabled loading states allow frantic duplicate clicks that cause multiple charges!',
    wcagRule: 'WCAG 2.2.1 Timing Adjustable & 4.1.3 Status Messages',
    codeFlawed: `<!-- Flawed: Button does not disable on click, allowing duplicate taps during lag -->
<button onClick={handleSubmit}>
  Confirm & Pay $38.50
</button>`,
    codeFixed: `<!-- Accessible Fix: Immediately disables and shows loading feedback -->
<button disabled={isSubmitting} aria-busy={isSubmitting} className="cursor-wait">
  {isSubmitting ? "Processing Payment..." : "Confirm & Pay $38.50"}
</button>`,
  },
];

export default function HomePage() {
  const { setLenses } = useLenses();
  const [selectedPreset, setSelectedPreset] = useState<PresetOption>(PRESETS[0]);
  const [activeLens, setActiveLens] = useState<LensId>(PRESETS[0].defaultLens);
  const [isFixed, setIsFixed] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Apply lens
  const handleLensChange = (lens: LensId | 'none') => {
    if (lens === 'none') {
      setActiveLens('deuteranopia');
      setLenses([]);
    } else {
      setActiveLens(lens);
      setLenses([lens]);
    }
  };

  const handlePresetChange = (preset: PresetOption) => {
    setSelectedPreset(preset);
    setActiveLens(preset.defaultLens);
    setLenses([preset.defaultLens]);
    setIsFixed(false);
  };

  const appliedFixes: Record<string, boolean> = {
    high_contrast: isFixed,
    semantic_labels: isFixed,
    target_size: isFixed,
    semantic_buttons: isFixed,
    visible_focus: isFixed,
    modal_focus_trap: isFixed,
    status_icons: isFixed,
    error_text: isFixed,
    aria_validation: isFixed,
    generous_targets: isFixed,
    clickable_label_container: isFixed,
    persistent_selection: isFixed,
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <Eye className="w-3.5 h-3.5" />
          <span>Sensory & Usability Simulation Lab</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          See, feel, and fix web accessibility barriers.
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
          Experience how low contrast, color vision deficiencies, tremors, and keyboard constraints
          affect users in real life. Test simulated UI components below, or audit any live website with
          our Chrome extension.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href="#simulator"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Try Interactive Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <a
            href="#extension"
            className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs border border-zinc-700 transition-colors flex items-center gap-2"
          >
            <ChromeIcon className="w-3.5 h-3.5 text-zinc-400" />
            <span>Get Chrome Extension</span>
          </a>
        </div>
      </section>

      {/* Simulator Section */}
      <section id="simulator" className="space-y-6 scroll-mt-24">
        {/* Scenario Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {PRESETS.map((p) => {
              const active = p.id === selectedPreset.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePresetChange(p)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Implementation Switch: Flawed vs Fixed */}
          <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => setIsFixed(false)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                !isFixed ? 'bg-rose-950/70 text-rose-300 font-bold border border-rose-800/50' : 'text-zinc-400'
              }`}
            >
              Flawed UX
            </button>
            <button
              onClick={() => setIsFixed(true)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                isFixed ? 'bg-emerald-950/70 text-emerald-300 font-bold border border-emerald-800/50' : 'text-zinc-400'
              }`}
            >
              Accessible Fix ✓
            </button>
          </div>
        </div>

        {/* Lens Controller Bar */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-medium">Active Lens:</span>
            <select
              value={activeLens}
              onChange={(e) => handleLensChange(e.target.value as LensId)}
              className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
              <option value="protanopia">Protanopia (Red-Blind)</option>
              <option value="tritanopia">Tritanopia (Blue-Blind)</option>
              <option value="achromatopsia">Achromatopsia (Monochrome)</option>
              <option value="sunlight">Bright Sun Glare (100k lux)</option>
              <option value="tremor">Hand Tremor (Motor Jitter)</option>
              <option value="blur">Low Acuity / Cataracts</option>
              <option value="tunnel">Tunnel Vision</option>
              <option value="keyboard_only">Keyboard Only</option>
              <option value="slow_network">Subway 2G / Throttled Latency</option>
              <option value="distraction">Cognitive Overload / ADHD</option>
            </select>
          </div>

          <div className="flex items-center gap-3 text-zinc-400">
            <span className="text-[11px]">
              Status:{' '}
              <strong className={isFixed ? 'text-emerald-400' : 'text-rose-400'}>
                {isFixed ? 'WCAG 2.2 Compliant' : 'Intentionally Flawed'}
              </strong>
            </span>
            <button
              onClick={() => setIsFixed(!isFixed)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer hover:underline"
            >
              {isFixed ? 'Switch to Flawed' : 'Apply Accessible Fix'}
            </button>
          </div>
        </div>

        {/* Clean Interactive Canvas */}
        <div className="bg-zinc-950 border border-zinc-800/80 rounded-3xl p-8 sm:p-14 shadow-xl flex items-center justify-center min-h-[480px]">
          <LensContainer className="w-full flex items-center justify-center">
            {(selectedPreset.id === 'checkout' || selectedPreset.id === 'subway') && (
              <SunshineCheckoutScenario appliedFixes={appliedFixes} />
            )}
            {selectedPreset.id === 'keyboard' && (
              <KeyboardSeatPickerScenario appliedFixes={appliedFixes} />
            )}
            {selectedPreset.id === 'colorblind' && (
              <ColorblindFormScenario appliedFixes={appliedFixes} />
            )}
            {selectedPreset.id === 'tremor' && (
              <TremorDonationScenario appliedFixes={appliedFixes} />
            )}
          </LensContainer>
        </div>

        {/* Expandable Explanation Drawer */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full p-4 px-6 flex items-center justify-between text-left text-xs hover:bg-zinc-800/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-zinc-300 font-semibold">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>Technical Breakdown & Code Difference</span>
              <span className="text-[11px] text-zinc-500 font-mono">({selectedPreset.wcagRule})</span>
            </div>
            {showExplanation ? (
              <ChevronUp className="w-4 h-4 text-zinc-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {showExplanation && (
            <div className="p-6 pt-2 border-t border-zinc-800/80 space-y-4 text-xs">
              <p className="text-zinc-400 leading-relaxed">{selectedPreset.summary}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Flawed Code */}
                <div className="bg-zinc-950 p-4 rounded-xl border border-rose-900/40 space-y-2">
                  <div className="text-[10px] font-mono text-rose-400 font-bold uppercase">
                    ❌ Anti-Pattern (Fails Audit)
                  </div>
                  <pre className="text-rose-200/90 font-mono text-[11px] whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {selectedPreset.codeFlawed}
                  </pre>
                </div>

                {/* Fixed Accessible Code */}
                <div className="bg-zinc-950 p-4 rounded-xl border border-emerald-900/40 space-y-2">
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                    ✓ Accessible Remediation (WCAG 2.2)
                  </div>
                  <pre className="text-emerald-200/90 font-mono text-[11px] whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {selectedPreset.codeFixed}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Chrome Extension Showcase */}
      <section id="extension" className="space-y-8 scroll-mt-24 pt-8 border-t border-zinc-800/80">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <ChromeIcon className="w-4 h-4" />
            <span>Browser Extension (Manifest V3)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Audit Any Website in the Wild
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Want to test your company&apos;s checkout, Stripe, GitHub, or any external website? The
            Empathy Lens extension injects these exact sensory and motor filters directly into any live
            browser tab.
          </p>
        </div>

        {/* 3 Step Setup Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl space-y-2">
            <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-300 font-mono font-bold flex items-center justify-center text-[11px]">
              1
            </span>
            <h3 className="font-bold text-white text-sm">Clone or Download</h3>
            <p className="text-zinc-400 leading-relaxed">
              The extension source is packaged in the{' '}
              <code className="text-emerald-400 font-mono bg-zinc-950 px-1.5 py-0.5 rounded">
                extension/
              </code>{' '}
              folder of this repository.
            </p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl space-y-2">
            <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-300 font-mono font-bold flex items-center justify-center text-[11px]">
              2
            </span>
            <h3 className="font-bold text-white text-sm">Load in Chrome / Edge</h3>
            <p className="text-zinc-400 leading-relaxed">
              Open <code className="text-zinc-300 font-mono">chrome://extensions</code>, toggle{' '}
              <strong>Developer mode</strong> on, and click <strong>Load unpacked</strong>. Select the{' '}
              <code className="text-emerald-400 font-mono">extension</code> folder.
            </p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl space-y-2">
            <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-300 font-mono font-bold flex items-center justify-center text-[11px]">
              3
            </span>
            <h3 className="font-bold text-white text-sm">Test Any Live Page</h3>
            <p className="text-zinc-400 leading-relaxed">
              Click the toolbar icon on any website to simulate colorblindness, motor tremors, or sun
              glare in real time.
            </p>
          </div>
        </div>

        {/* Quick link to repo */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-white text-sm">Source Code & Unpacked Extension</h4>
            <p className="text-xs text-zinc-400">
              Complete Manifest V3 code, SVG filter matrices, and content scripts ready to run.
            </p>
          </div>
          <a
            href="https://github.com/Dr-Ghost7/empathy-lens"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs border border-zinc-700 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <span>View extension/ on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>
        </div>
      </section>
    </div>
  );
}
