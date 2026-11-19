'use client';

import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { useLenses } from '@/context/LensContext';
import { AlertCircle, MousePointer2 } from 'lucide-react';

interface LensContainerProps {
  children: ReactNode;
  className?: string;
  enforceMouseBlock?: boolean;
}

export function LensContainer({
  children,
  className = '',
  enforceMouseBlock = true,
}: LensContainerProps) {
  const {
    activeLenses,
    isLensActive,
    intensity,
    mouseBlockedNotice,
    triggerMouseBlockedNotice,
    cursorPos,
    jitterPos,
  } = useLenses();

  const containerRef = useRef<HTMLDivElement>(null);
  const [localMousePos, setLocalMousePos] = useState({ x: 200, y: 200 });

  // Determine CSS filter string
  const filters: string[] = [];

  if (isLensActive('deuteranopia')) {
    filters.push('url(#lens-deuteranopia)');
  }
  if (isLensActive('protanopia')) {
    filters.push('url(#lens-protanopia)');
  }
  if (isLensActive('tritanopia')) {
    filters.push('url(#lens-tritanopia)');
  }
  if (isLensActive('achromatopsia')) {
    filters.push('url(#lens-achromatopsia)');
  }
  if (isLensActive('blur')) {
    const blurPx = (4.5 * intensity).toFixed(1);
    filters.push(`blur(${blurPx}px)`);
  }
  if (isLensActive('sunlight')) {
    filters.push(`brightness(${1 + 0.35 * intensity})`);
    filters.push(`contrast(${Math.max(0.4, 0.7 - 0.2 * intensity)})`);
  }

  const filterStyle = filters.length > 0 ? filters.join(' ') : 'none';

  // Handle keyboard-only mouse interception
  const handlePointerDownCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    if (enforceMouseBlock && isLensActive('keyboard_only')) {
      if (e.pointerType === 'mouse' || e.pointerType === 'touch') {
        e.preventDefault();
        e.stopPropagation();
        triggerMouseBlockedNotice();
      }
    }
  };

  // Track local position for tunnel vision spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setLocalMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const isTunnelActive = isLensActive('tunnel');
  const isSunlightActive = isLensActive('sunlight');
  const isTremorActive = isLensActive('tremor');
  const isKeyboardOnlyActive = isLensActive('keyboard_only');
  const isDistractionActive = isLensActive('distraction');

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onPointerDownCapture={handlePointerDownCapture}
      className={`relative overflow-hidden transition-all duration-300 ${
        isTremorActive ? 'cursor-none' : ''
      } ${className}`}
    >
      {/* Target Content with Applied Filters */}
      <div
        style={{
          filter: filterStyle,
          transition: 'filter 0.25s ease-out',
        }}
        className="w-full h-full"
      >
        {children}
      </div>

      {/* Sunlight Glare & Surface Reflection Overlay */}
      {isSunlightActive && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(255,248,220,0.48) 35%, rgba(255,255,255,0.65) 100%)',
            mixBlendMode: 'screen',
          }}
        >
          {/* Simulated diagonal screen reflection glare */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                'radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.9) 0%, transparent 60%)',
            }}
          />
        </div>
      )}

      {/* Tunnel Vision Peripheral Loss Overlay */}
      {isTunnelActive && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 transition-all duration-75"
          style={{
            background: `radial-gradient(circle 120px at ${localMousePos.x}px ${localMousePos.y}px, transparent 0%, rgba(9, 9, 11, 0.75) 55%, rgba(9, 9, 11, 0.98) 100%)`,
          }}
        />
      )}

      {/* Simulated Tremor Pointer */}
      {isTremorActive && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-50 text-rose-500 transition-transform duration-75 ease-out"
          style={{
            left: `${jitterPos.x}px`,
            top: `${jitterPos.y}px`,
            transform: 'translate(-2px, -2px)',
          }}
        >
          <MousePointer2 className="w-5 h-5 fill-rose-500/20 stroke-rose-600 drop-shadow-md animate-pulse" />
          <span className="absolute -top-5 left-4 text-[10px] font-mono font-bold bg-rose-950/80 text-rose-200 px-1 rounded border border-rose-800">
            TREMOR
          </span>
        </div>
      )}

      {/* Cognitive Distraction / ADHD Simulation */}
      {isDistractionActive && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-25 overflow-hidden">
          <div className="absolute top-2 right-2 animate-bounce bg-amber-500 text-amber-950 text-xs font-bold px-2.5 py-1 rounded-full shadow-lg border border-amber-300">
            ⚡ 2 MINUTE FLASH SALE!
          </div>
          <div className="absolute bottom-4 left-4 animate-pulse bg-purple-600 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl opacity-90">
            💬 Customer support: "Can I assist you?"
          </div>
        </div>
      )}

      {/* Floating Notice when Mouse Click Attempted in Keyboard-Only Mode */}
      {mouseBlockedNotice && isKeyboardOnlyActive && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-zinc-900/95 text-amber-300 border border-amber-500/40 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-medium backdrop-blur-md animate-in fade-in slide-in-from-top duration-200">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Mouse suppressed</strong> in Keyboard-Only lens. Navigate using{' '}
            <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700 text-white">Tab</kbd>,{' '}
            <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700 text-white">Shift+Tab</kbd>, and{' '}
            <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700 text-white">Enter</kbd>.
          </span>
        </div>
      )}
    </div>
  );
}
