'use client';

import React, { useState } from 'react';
import { Heart, CheckCircle2, ShieldCheck, Sparkles, Loader2, AlertTriangle, WifiOff } from 'lucide-react';
import { useLenses } from '@/context/LensContext';

interface ScenarioProps {
  appliedFixes: Record<string, boolean>;
  onSuccess?: () => void;
}

const AMOUNTS = [10, 25, 50, 100];

export function TremorDonationScenario({ appliedFixes, onSuccess }: ScenarioProps) {
  const { isLensActive } = useLenses();
  const isSlowNetwork = isLensActive('slow_network');

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [coverFee, setCoverFee] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const hasGenerousTargets = appliedFixes['generous_targets'] ?? false;
  const hasClickableContainer = appliedFixes['clickable_label_container'] ?? false;
  const hasPersistentSelection = appliedFixes['persistent_selection'] ?? false;

  const fee = selectedAmount ? (selectedAmount * 0.03).toFixed(2) : '0.00';
  const total = selectedAmount
    ? (selectedAmount + (coverFee ? parseFloat(fee) : 0)).toFixed(2)
    : '0.00';

  const handleSelectAmount = (amt: number) => {
    setSelectedAmount(amt);
    if (amt !== 25) {
      setFeedback(`You selected $${amt}. The goal is to select the $25 tier!`);
    } else {
      setFeedback('Nice! $25 selected.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAmount) return;

    if (isSlowNetwork) {
      if (isSubmitting) {
        setClickCount((c) => c + 1);
        return;
      }

      setIsSubmitting(true);
      setClickCount(1);

      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        if (selectedAmount === 25 && coverFee) {
          onSuccess?.();
        }
      }, 2500);
      return;
    }

    setSubmitted(true);
    if (selectedAmount === 25 && coverFee) {
      onSuccess?.();
    }
  };

  const totalCharged = (parseFloat(total) * (clickCount > 1 ? clickCount : 1)).toFixed(2);

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden font-sans relative">
      {/* 2G Slow Network Progress Bar */}
      {isSubmitting && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800 overflow-hidden z-30">
          <div className="h-full bg-amber-500 animate-pulse w-3/4 transition-all duration-1000" />
        </div>
      )}

      {/* Non-Profit Header */}
      <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <Heart className="w-4 h-4 fill-rose-500/30" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Community Food Bank</h3>
            <p className="text-[11px] text-slate-400">Emergency Winter Campaign</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {isSlowNetwork && (
            <span className="text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-800/60">
              <WifiOff className="w-3 h-3" /> 2G Latency
            </span>
          )}
          <span className="text-[10px] font-mono bg-rose-950/40 text-rose-300 px-2 py-0.5 rounded border border-rose-800/40">
            501(c)(3)
          </span>
        </div>
      </div>

      <div className="p-6">
        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Thank You for Donating ${total}!</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                Your gift provides warm meals to local families.
              </p>
            </div>

            {/* Duplicate submission warning under slow 2G network */}
            {clickCount > 1 && !hasGenerousTargets && (
              <div className="bg-amber-950/50 border border-amber-800/60 p-3.5 rounded-xl text-left space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Duplicate Donations Attempted ({clickCount}x Clicks)</span>
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  Because the button did not disable during the 2.5s network lag, you clicked <strong>{clickCount} times</strong>. Total attempted charge:{' '}
                  <strong>${totalCharged}</strong>.
                </p>
                <div className="text-[10px] text-amber-400/90 font-medium pt-1 border-t border-amber-800/40">
                  💡 <strong>WCAG 4.1.3:</strong> Interfaces must provide immediate disabled feedback to prevent multiple transaction submissions on high-latency mobile networks.
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setSubmitted(false);
                setIsSubmitting(false);
                setSelectedAmount(null);
                setCoverFee(false);
                setFeedback(null);
                setClickCount(0);
              }}
              className="text-xs text-emerald-400 font-semibold hover:underline mt-2 cursor-pointer block mx-auto"
            >
              Reset Donation Demo
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">
                  Select Donation Tier: <strong className="text-emerald-400 font-mono">(Goal: $25)</strong>
                </span>
                {selectedAmount && (
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Selected: ${selectedAmount}
                  </span>
                )}
              </div>

              {hasGenerousTargets ? (
                <div className="grid grid-cols-2 gap-3">
                  {AMOUNTS.map((amt) => {
                    const isSelected = selectedAmount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleSelectAmount(amt)}
                        className={`h-13 rounded-xl font-bold text-sm transition-all flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400'
                            : 'bg-slate-800 text-white border-2 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        ${amt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex gap-0.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  {AMOUNTS.map((amt) => {
                    const isSelected = selectedAmount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleSelectAmount(amt)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded transition-all cursor-pointer ${
                          isSelected && hasPersistentSelection
                            ? 'bg-emerald-600 text-white font-bold'
                            : isSelected
                            ? 'bg-slate-700 text-white'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        ${amt}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {feedback && (
              <p className="text-[11px] text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-800/40 font-medium">
                {feedback}
              </p>
            )}

            {/* Checkbox Fee Coverage */}
            <div>
              {hasClickableContainer ? (
                <label className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-slate-700 bg-slate-800/60 cursor-pointer min-h-[52px] hover:border-slate-500 transition-all">
                  <input
                    type="checkbox"
                    checked={coverFee}
                    onChange={(e) => setCoverFee(e.target.checked)}
                    className="w-5 h-5 rounded text-emerald-500 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white block">
                      Cover the 3% transaction fee (+${fee})
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Ensures 100% of your ${selectedAmount || 25} gift goes directly to food distribution.
                    </span>
                  </div>
                </label>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={coverFee}
                    onChange={(e) => setCoverFee(e.target.checked)}
                    className="w-3 h-3 text-slate-400"
                  />
                  <span className="text-[11px] text-slate-400 select-none">
                    Add 3% fee to cover processing
                  </span>
                </div>
              )}
            </div>

            {/* Subway in-flight stall warning */}
            {isSubmitting && !hasGenerousTargets && clickCount > 1 && (
              <div className="text-[11px] text-amber-300 bg-amber-950/60 p-2 rounded-lg border border-amber-800/40 animate-pulse font-medium">
                ⚠️ Connection stalled... You clicked {clickCount} times!
              </div>
            )}

            {/* Donation Summary & Submit */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Charged:</span>
                <span className="font-bold font-mono text-base text-emerald-400">
                  ${total}
                </span>
              </div>

              <button
                type="submit"
                disabled={!selectedAmount || (hasGenerousTargets && isSubmitting)}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  selectedAmount
                    ? hasGenerousTargets
                      ? isSubmitting
                        ? 'bg-slate-700 text-slate-400 cursor-wait'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md cursor-pointer'
                      : isSubmitting
                      ? 'bg-emerald-500 text-slate-950 cursor-pointer' // Flawed: still looks active!
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md cursor-pointer'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>
                      {hasGenerousTargets
                        ? `Processing Gift of $${total}...`
                        : `Complete Gift of $${total}`}
                    </span>
                  </>
                ) : (
                  <span>Complete Gift of ${total}</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          SSL Secure Payment
        </span>
        <span>WCAG 2.5.5 Test Bed</span>
      </div>
    </div>
  );
}
