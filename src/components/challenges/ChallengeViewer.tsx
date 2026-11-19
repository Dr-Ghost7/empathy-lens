'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Challenge } from '@/types';
import { useLenses } from '@/context/LensContext';
import { LensContainer } from '@/components/lenses/LensContainer';
import { SunshineCheckoutScenario } from '@/components/challenges/SunshineCheckoutScenario';
import { KeyboardSeatPickerScenario } from '@/components/challenges/KeyboardSeatPickerScenario';
import { ColorblindFormScenario } from '@/components/challenges/ColorblindFormScenario';
import { TremorDonationScenario } from '@/components/challenges/TremorDonationScenario';
import {
  ShieldAlert,
  Wrench,
  Eye,
  CheckCircle2,
  ExternalLink,
  Code2,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface ChallengeViewerProps {
  challenge: Challenge;
}

export function ChallengeViewer({ challenge }: ChallengeViewerProps) {
  const { activeLenses, isLensActive, activateLens, deactivateLens, toggleLens } = useLenses();

  // Fix toggles state: starts with all FALSE (flawed state)
  const [appliedFixes, setAppliedFixes] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    challenge.fixToggles.forEach((t) => {
      initial[t.id] = false;
    });
    return initial;
  });

  const [activeTab, setActiveTab] = useState<'simulate' | 'audit' | 'fix'>('simulate');
  const [successCelebrated, setSuccessCelebrated] = useState(false);

  // Automatically ensure default lens is active when loading challenge
  useEffect(() => {
    activateLens(challenge.defaultLens);
  }, [challenge.defaultLens]);

  // Check if all fixes applied
  const totalFixes = challenge.fixToggles.length;
  const activeFixCount = Object.values(appliedFixes).filter(Boolean).length;
  const isFullyFixed = activeFixCount === totalFixes;

  // Trigger celebration when fully fixed or scenario succeeded
  const handleSuccess = () => {
    if (!successCelebrated) {
      setSuccessCelebrated(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const toggleFix = (fixId: string) => {
    setAppliedFixes((prev) => {
      const updated = { ...prev, [fixId]: !prev[fixId] };
      const allActive = Object.values(updated).every(Boolean);
      if (allActive) {
        handleSuccess();
      }
      return updated;
    });
  };

  const resetAllFixes = () => {
    const reset: Record<string, boolean> = {};
    challenge.fixToggles.forEach((t) => {
      reset[t.id] = false;
    });
    setAppliedFixes(reset);
    setSuccessCelebrated(false);
  };

  const applyAllFixes = () => {
    const all: Record<string, boolean> = {};
    challenge.fixToggles.forEach((t) => {
      all[t.id] = true;
    });
    setAppliedFixes(all);
    handleSuccess();
  };

  return (
    <div className="space-y-6">
      {/* Challenge Hero Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
              {challenge.category} Challenge
            </span>
            <span className="text-xs text-zinc-400 font-medium bg-zinc-800 px-2.5 py-1 rounded-full">
              Difficulty: {challenge.difficulty}
            </span>
            <span className="text-xs text-zinc-400 font-medium bg-zinc-800 px-2.5 py-1 rounded-full">
              Est: {challenge.estTime}
            </span>
          </div>

          {/* Quick Lens Toggle for this challenge */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium">Simulation Lens:</span>
            <button
              onClick={() => toggleLens(challenge.defaultLens)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isLensActive(challenge.defaultLens)
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isLensActive(challenge.defaultLens) ? 'Lens Active' : 'Lens Off (Normal)'}</span>
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {challenge.title}
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
            {challenge.scenario}
          </p>
        </div>

        {/* Objective & Status banner */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-zinc-800/80 text-xs">
          <div className="md:col-span-2 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800 text-zinc-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Objective:</strong>
              {challenge.objective}
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
              isFullyFixed
                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
            }`}
          >
            <div>
              <span className="block text-[11px] text-zinc-500 uppercase font-semibold">
                Accessibility State
              </span>
              <span className="font-bold text-sm text-white">
                {activeFixCount} of {totalFixes} Fixes Applied
              </span>
            </div>
            {isFullyFixed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <span className="text-[11px] font-mono text-amber-400 font-semibold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                Flawed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulate')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'simulate'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>1. Simulate & Test</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>2. Audit & Violations ({challenge.violations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('fix')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'fix'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>3. Fix Studio & Code Diff</span>
          </button>
        </div>

        {/* Global Fix Actions */}
        <div className="hidden sm:flex items-center gap-2">
          {activeFixCount > 0 && (
            <button
              onClick={resetAllFixes}
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset to Flawed
            </button>
          )}
          {!isFullyFixed && (
            <button
              onClick={applyAllFixes}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-700 font-semibold cursor-pointer transition-colors"
            >
              Apply All Fixes
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: SIMULATE & EXPERIENCE */}
      {activeTab === 'simulate' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Interactive Stage with Lens */}
          <div className="lg:col-span-8 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-inner relative flex flex-col items-center justify-center min-h-[520px]">
            <LensContainer className="w-full flex items-center justify-center py-4">
              {challenge.id === 'sunshine-checkout' && (
                <SunshineCheckoutScenario
                  appliedFixes={appliedFixes}
                  onSuccess={handleSuccess}
                />
              )}
              {challenge.id === 'keyboard-seat-picker' && (
                <KeyboardSeatPickerScenario
                  appliedFixes={appliedFixes}
                  onSuccess={handleSuccess}
                />
              )}
              {challenge.id === 'colorblind-form' && (
                <ColorblindFormScenario
                  appliedFixes={appliedFixes}
                  onSuccess={handleSuccess}
                />
              )}
              {challenge.id === 'tremor-donation' && (
                <TremorDonationScenario
                  appliedFixes={appliedFixes}
                  onSuccess={handleSuccess}
                />
              )}
            </LensContainer>
          </div>

          {/* Quick Fix Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                  Live Fix Toggles
                </h3>
                <span className="text-[11px] text-zinc-400 font-mono">
                  {activeFixCount}/{totalFixes} applied
                </span>
              </div>

              <div className="space-y-3">
                {challenge.fixToggles.map((fix) => {
                  const active = appliedFixes[fix.id];
                  return (
                    <div
                      key={fix.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        active
                          ? 'bg-emerald-950/20 border-emerald-500/50'
                          : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white leading-tight">
                          {fix.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleFix(fix.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            active ? 'bg-emerald-500' : 'bg-zinc-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              active ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                        {fix.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setActiveTab('fix')}
                className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Inspect Semantic Code Diffs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Key takeaways card */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-2.5 text-xs">
              <h4 className="font-bold text-zinc-200">Key Takeaway</h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                {challenge.learningTakeaways[0]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT & VIOLATIONS */}
      {activeTab === 'audit' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Accessibility Diagnostics Report
              </h3>
              <p className="text-xs text-zinc-400">
                Evaluation against W3C WCAG 2.2 Level A, AA, and AAA specifications.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-rose-950/60 text-rose-300 border border-rose-800/60 px-3 py-1 rounded-full font-bold">
                {challenge.violations.length} Critical/Serious Violations
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {challenge.violations.map((violation) => (
              <div
                key={violation.id}
                className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-md space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                        violation.impact === 'critical'
                          ? 'bg-rose-950 text-rose-300 border-rose-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      {violation.impact}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {violation.rule}
                    </span>
                    <span className="text-xs font-semibold text-zinc-400">
                      (Level {violation.level})
                    </span>
                  </div>

                  <a
                    href={violation.wcagUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors hover:underline"
                  >
                    <span>Read W3C Spec</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{violation.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                    {violation.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-zinc-800/80 text-xs">
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 font-mono text-[11px] text-rose-300 overflow-x-auto">
                    <span className="text-zinc-500 block mb-1 font-sans font-semibold">
                      Violating DOM Pattern:
                    </span>
                    {violation.element}
                  </div>
                  <div className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/30 text-[11px] text-emerald-200">
                    <span className="text-emerald-400 block mb-1 font-semibold">
                      Required Remediation:
                    </span>
                    {violation.howToFix}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FIX STUDIO & CODE DIFF */}
      {activeTab === 'fix' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Semantic Code Remediation Studio
              </h3>
              <p className="text-xs text-zinc-400">
                Compare flawed markup against accessible, production-ready TSX implementations.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('simulate')}
              className="text-xs bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 rounded-xl font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Back to Interactive Simulation</span>
            </button>
          </div>

          <div className="space-y-6">
            {challenge.fixToggles.map((fix) => {
              const active = appliedFixes[fix.id];
              return (
                <div
                  key={fix.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                    <div>
                      <h4 className="text-sm font-bold text-white">{fix.label}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">{fix.description}</p>
                    </div>

                    <button
                      onClick={() => toggleFix(fix.id)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        active
                          ? 'bg-emerald-500 text-zinc-950 shadow-md'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {active ? '✓ Applied in Demo' : 'Enable Fix'}
                    </button>
                  </div>

                  {/* Code Diff Container */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Flawed Code */}
                    <div className="bg-zinc-950 rounded-xl border border-rose-900/40 p-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-rose-400 pb-2 border-b border-rose-950">
                        <span>❌ FLAWED IMPLEMENTATION</span>
                        <span>Anti-Pattern</span>
                      </div>
                      <pre className="text-xs font-mono text-rose-200/90 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                        {fix.codeDiff.flawed}
                      </pre>
                    </div>

                    {/* Fixed Accessible Code */}
                    <div className="bg-zinc-950 rounded-xl border border-emerald-900/40 p-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 pb-2 border-b border-emerald-950">
                        <span>✓ ACCESSIBLE SOLUTION</span>
                        <span>WCAG 2.2 Compliant</span>
                      </div>
                      <pre className="text-xs font-mono text-emerald-200/90 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                        {fix.codeDiff.fixed}
                      </pre>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
