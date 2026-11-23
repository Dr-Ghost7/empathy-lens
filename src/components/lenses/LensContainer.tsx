'use client';

import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { useLenses } from '@/context/LensContext';
import {
  AlertCircle,
  MousePointer2,
  WifiOff,
  Loader2,
  BellRing,
  Sparkles,
  SignalZero,
  AlertTriangle,
} from 'lucide-react';

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
    isLensActive,
    intensity,
    mouseBlockedNotice,
    triggerMouseBlockedNotice,
    jitterPos,
  } = useLenses();

  const containerRef = useRef<HTMLDivElement>(null);
  const [localMousePos, setLocalMousePos] = useState({ x: 200, y: 200 });

  // Subway 2G Latency & Stall States
  const [isBuffering, setIsBuffering] = useState(false);
  const [rageClicks, setRageClicks] = useState(0);
  const [tunnelDrop, setTunnelDrop] = useState(false);
  const isReplayingRef = useRef(false);

  // Tremor Missed Click Ripple State
  const [missedClick, setMissedClick] = useState<{ x: number; y: number } | null>(null);

  // Periodic Subway Tunnel Signal Drop (every 14s for 1.8s)
  useEffect(() => {
    if (!isLensActive('slow_network')) {
      setTunnelDrop(false);
      return;
    }

    const interval = setInterval(() => {
      setTunnelDrop(true);
      setTimeout(() => {
        setTunnelDrop(false);
      }, 1800);
    }, 14000);

    return () => clearInterval(interval);
  }, [isLensActive]);

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
    // Increased blur so small text is truly illegible
    const blurPx = (6.0 * intensity).toFixed(1);
    filters.push(`blur(${blurPx}px)`);
  }
  if (isLensActive('sunlight')) {
    // Intense daylight washout
    filters.push(`brightness(${1.25 + 0.35 * intensity})`);
    filters.push(`contrast(${Math.max(0.28, 0.45 - 0.15 * intensity)})`);
  }

  const filterStyle = filters.length > 0 ? filters.join(' ') : 'none';

  // Handle pointer down capture
  const handlePointerDownCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    // 1. Keyboard-Only Lens: Block mouse completely
    if (enforceMouseBlock && isLensActive('keyboard_only')) {
      if (e.pointerType === 'mouse' || e.pointerType === 'touch') {
        e.preventDefault();
        e.stopPropagation();
        triggerMouseBlockedNotice();
        return;
      }
    }
  };

  // Intercept clicks to physically enforce Slow Network & Tremor barriers
  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReplayingRef.current) {
      isReplayingRef.current = false;
      return;
    }

    const target = e.target as HTMLElement;
    // Allow clicking on reset buttons
    if (target.closest('.empathy-allow-click, button[type="button"].reset-btn')) return;

    // 1. Subway 2G Latency Simulation: Physical 2-second click delay
    if (isLensActive('slow_network')) {
      e.preventDefault();
      e.stopPropagation();

      setRageClicks((prev) => prev + 1);
      setIsBuffering(true);

      const savedTarget = target;
      const clientX = e.clientX;
      const clientY = e.clientY;

      setTimeout(() => {
        isReplayingRef.current = true;
        setIsBuffering(false);
        setRageClicks(0);

        // Replay click on the original element after network transit
        const replayedClick = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          clientX,
          clientY,
        });
        savedTarget.dispatchEvent(replayedClick);
      }, 2100 * intensity);
      return;
    }

    // 2. Hand Tremor Simulation: Physically offset clicks by ±18px
    if (isLensActive('tremor')) {
      const offsetX = (Math.random() - 0.5) * 36 * intensity;
      const offsetY = (Math.random() - 0.5) * 36 * intensity;
      const jitteredX = e.clientX + offsetX;
      const jitteredY = e.clientY + offsetY;

      const elementAtJitterPoint = document.elementFromPoint(jitteredX, jitteredY);

      // If the jitter caused the user to miss the intended target
      if (
        elementAtJitterPoint &&
        elementAtJitterPoint !== target &&
        !target.contains(elementAtJitterPoint)
      ) {
        e.preventDefault();
        e.stopPropagation();

        // Trigger visual missed click indicator
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setMissedClick({
            x: jitteredX - rect.left,
            y: jitteredY - rect.top,
          });
          setTimeout(() => setMissedClick(null), 1200);
        }
        return;
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
  const isSlowNetworkActive = isLensActive('slow_network');
  const isDistractionActive = isLensActive('distraction');

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onPointerDownCapture={handlePointerDownCapture}
      onClickCapture={handleClickCapture}
      className={`relative overflow-hidden transition-all duration-300 ${
        isTremorActive ? 'cursor-none' : ''
      } ${isBuffering ? 'cursor-wait' : ''} ${className}`}
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
              'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 248, 210, 0.65) 40%, rgba(255, 255, 255, 0.8) 100%)',
            mixBlendMode: 'screen',
          }}
        >
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(ellipse at 75% 25%, rgba(255,255,255,0.95) 0%, transparent 60%)',
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
            background: `radial-gradient(circle 95px at ${localMousePos.x}px ${localMousePos.y}px, transparent 0%, rgba(9, 9, 11, 0.85) 50%, rgba(3, 3, 5, 0.98) 100%)`,
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

      {/* Tremor Missed Click Ripple Indicator */}
      {missedClick && (
        <div
          className="pointer-events-none absolute z-50 transform -translate-x-1/2 -translate-y-1/2 animate-in fade-in zoom-in duration-150"
          style={{ left: `${missedClick.x}px`, top: `${missedClick.y}px` }}
        >
          <div className="w-8 h-8 rounded-full border-2 border-rose-500 bg-rose-500/20 animate-ping" />
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-700 px-1.5 py-0.5 rounded shadow-lg">
            ✕ Missed (Tremor offset)
          </span>
        </div>
      )}

      {/* Subway 2G Network Latency Header Banner & Crawl Bar */}
      {isSlowNetworkActive && (
        <>
          {/* Crawling Network Loading Bar */}
          {isBuffering && (
            <div className="absolute top-0 left-0 right-0 h-2 bg-amber-950 overflow-hidden z-40">
              <div className="h-full bg-amber-500 animate-pulse w-3/4 transition-all duration-1000" />
            </div>
          )}

          {/* Top Subway Status Badge */}
          <div className="absolute top-3 left-3 z-35 flex items-center gap-2 bg-amber-950/95 border border-amber-500/60 text-amber-300 text-xs px-3.5 py-2 rounded-xl shadow-xl backdrop-blur-md">
            <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>
              <strong>Subway 2G:</strong> 2,400ms Request Transit
            </span>

            {isBuffering && (
              <span className="flex items-center gap-1.5 font-mono text-[11px] bg-amber-900/80 px-2 py-0.5 rounded-lg text-amber-200 ml-1 border border-amber-700/60 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" /> Buffering click...
              </span>
            )}
          </div>

          {/* Rage Click Alert Badge when User Clicks Multiple Times */}
          {rageClicks > 1 && isBuffering && (
            <div className="absolute top-14 left-3 z-35 bg-rose-950/95 text-rose-200 border border-rose-700 px-3.5 py-1.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-1.5 animate-bounce">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{rageClicks} duplicate clicks queued! (Stall in progress)</span>
            </div>
          )}

          {/* Periodic Subway Tunnel Signal Deadzone Drop */}
          {tunnelDrop && (
            <div className="absolute inset-0 z-45 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 space-y-3 animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 animate-pulse">
                <SignalZero className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Subway Tunnel Deadzone</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Signal dropped in subway tube. Re-establishing connection to cell tower...
              </p>
            </div>
          )}
        </>
      )}

      {/* Cognitive Distraction / ADHD Sensory Overload Simulation */}
      {isDistractionActive && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-25 overflow-hidden">
          <div className="absolute top-3 right-3 animate-bounce bg-amber-500 text-amber-950 text-[11px] font-bold px-3 py-1 rounded-full shadow-xl border border-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FLASH OFFER: 01:59 remaining!</span>
          </div>

          <div className="absolute bottom-4 left-4 animate-pulse bg-purple-700 text-white text-xs px-3.5 py-2 rounded-xl shadow-2xl flex items-center gap-2 border border-purple-400/30">
            <BellRing className="w-3.5 h-3.5 text-purple-200" />
            <span>New ping: &quot;Hey, do you have that report ready?&quot;</span>
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
