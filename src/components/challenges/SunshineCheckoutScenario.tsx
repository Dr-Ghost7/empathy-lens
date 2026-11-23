'use client';

import React, { useState } from 'react';
import { Check, ShieldCheck, ShoppingBag, Loader2, AlertTriangle, WifiOff } from 'lucide-react';
import { useLenses } from '@/context/LensContext';

interface ScenarioProps {
  appliedFixes: Record<string, boolean>;
  onSuccess?: () => void;
}

export function SunshineCheckoutScenario({ appliedFixes, onSuccess }: ScenarioProps) {
  const { isLensActive } = useLenses();
  const isSlowNetwork = isLensActive('slow_network');

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [duplicateCharges, setDuplicateCharges] = useState(0);

  const hasHighContrast = appliedFixes['high_contrast'] ?? false;
  const hasSemanticLabels = appliedFixes['semantic_labels'] ?? false;
  const hasTargetSize = appliedFixes['target_size'] ?? false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    if (isSlowNetwork) {
      if (isSubmitting) {
        // Flawed mode allows duplicate taps during the 2.5s network stall
        setClickCount((c) => c + 1);
        return;
      }

      setIsSubmitting(true);
      setClickCount(1);

      // Simulate 2.5s subway 2G round-trip transit
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        onSuccess?.();
      }, 2500);
      return;
    }

    setSubmitted(true);
    onSuccess?.();
  };

  const totalCharged = (38.5 * (clickCount > 1 ? clickCount : 1)).toFixed(2);

  return (
    <div className="w-full max-w-md mx-auto bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 overflow-hidden font-sans relative">
      {/* 2G Slow Network Progress Bar */}
      {isSubmitting && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-200 overflow-hidden z-30">
          <div className="h-full bg-amber-500 animate-pulse w-3/4 transition-all duration-1000" />
        </div>
      )}

      {/* Top Header */}
      <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-sm tracking-tight text-slate-900">
            FreshMarket Express
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {isSlowNetwork && (
            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
              <WifiOff className="w-3 h-3" /> 2G Subway Tunnel
            </span>
          )}
          <span className="text-xs font-semibold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded">
            Order #8492
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-5 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Express Delivery</h3>
            <p className="text-xs text-slate-500">Total: $38.50 (3 items)</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Estimated: 25 mins
          </span>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Order Placed Successfully!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto mt-1">
                Your grocery delivery is en route to {street || 'your delivery address'}.
              </p>
            </div>

            {/* Slow Network Duplicate Submission Warning */}
            {clickCount > 1 && !hasHighContrast && (
              <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl text-left space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Duplicate Charges Detected ({clickCount}x Orders)</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Because the button lacked a disabled loading state, you tapped <strong>{clickCount} times</strong> during the 2.5s subway latency stall. Total charged:{' '}
                  <strong>${totalCharged}</strong> instead of $38.50.
                </p>
                <div className="text-[10px] text-amber-900 font-semibold pt-1 border-t border-amber-200">
                  💡 <strong>WCAG 4.1.3 & 2.2.1:</strong> Always disable buttons immediately upon submit and announce loading state to prevent multi-charge bugs on slow networks.
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setSubmitted(false);
                setIsSubmitting(false);
                setClickCount(0);
              }}
              className="text-xs text-emerald-700 font-semibold hover:underline cursor-pointer block mx-auto"
            >
              Reset Checkout Demo
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Street Address Field */}
            <div>
              {hasSemanticLabels ? (
                <label
                  htmlFor="street"
                  className="block text-xs font-bold text-slate-900 mb-1"
                >
                  Street Address <span className="text-rose-600">*</span>
                </label>
              ) : null}
              <input
                id="street"
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Street address (e.g. 742 Evergreen Terrace)"
                required
                className={`w-full px-3.5 py-2.5 rounded-lg text-xs transition-all ${
                  hasHighContrast
                    ? 'border-2 border-slate-700 bg-white text-slate-900 placeholder:text-slate-600 font-medium focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border border-slate-200 bg-slate-50/50 text-slate-400 placeholder:text-slate-300 focus:outline-none'
                }`}
              />
            </div>

            {/* City & Zip Code Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                {hasSemanticLabels && (
                  <label htmlFor="city" className="block text-xs font-bold text-slate-900 mb-1">
                    City <span className="text-rose-600">*</span>
                  </label>
                )}
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  required
                  className={`w-full px-3.5 py-2.5 rounded-lg text-xs transition-all ${
                    hasHighContrast
                      ? 'border-2 border-slate-700 bg-white text-slate-900 placeholder:text-slate-600 font-medium focus:border-emerald-600'
                      : 'border border-slate-200 bg-slate-50/50 text-slate-400 placeholder:text-slate-300 focus:outline-none'
                  }`}
                />
              </div>

              <div>
                {hasSemanticLabels && (
                  <label htmlFor="zip" className="block text-xs font-bold text-slate-900 mb-1">
                    ZIP Code <span className="text-rose-600">*</span>
                  </label>
                )}
                <input
                  id="zip"
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="ZIP Code"
                  required
                  className={`w-full px-3.5 py-2.5 rounded-lg text-xs transition-all ${
                    hasHighContrast
                      ? 'border-2 border-slate-700 bg-white text-slate-900 placeholder:text-slate-600 font-medium focus:border-emerald-600'
                      : 'border border-slate-200 bg-slate-50/50 text-slate-400 placeholder:text-slate-300 focus:outline-none'
                  }`}
                />
              </div>
            </div>

            {/* Terms and Agreement Checkbox */}
            <div className="pt-1">
              {hasTargetSize ? (
                <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-400 bg-slate-50/90 cursor-pointer min-h-[48px] hover:border-slate-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-400 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-900 select-none">
                    I agree to the contactless delivery terms and age verification
                  </span>
                </label>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-3.5 h-3.5 border-slate-300 text-slate-400"
                  />
                  <span className="text-[11px] text-slate-400">
                    I agree to delivery terms
                  </span>
                </div>
              )}
            </div>

            {/* Subway 2G in-flight indicator */}
            {isSubmitting && !hasHighContrast && clickCount > 1 && (
              <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 animate-pulse font-medium">
                ⚠️ Connection stalled... You clicked {clickCount} times!
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!agreed || (hasHighContrast && isSubmitting)}
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                agreed
                  ? hasHighContrast
                    ? isSubmitting
                      ? 'bg-slate-400 text-white cursor-wait'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-[0.99] cursor-pointer'
                    : isSubmitting
                    ? 'bg-emerald-400 text-white cursor-pointer' // Flawed: still looks active!
                    : 'bg-emerald-400 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {hasHighContrast ? 'Processing Payment (Please wait)...' : 'Confirm & Pay $38.50'}
                  </span>
                </>
              ) : (
                <span>Confirm & Pay $38.50</span>
              )}
            </button>
          </form>
        )}
      </div>

      <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Encrypted 256-bit checkout
        </span>
        <span>WCAG Test Bed</span>
      </div>
    </div>
  );
}
