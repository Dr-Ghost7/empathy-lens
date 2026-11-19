'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LensId } from '@/types';

interface LensContextValue {
  activeLenses: LensId[];
  isLensActive: (id: LensId) => boolean;
  toggleLens: (id: LensId) => void;
  activateLens: (id: LensId) => void;
  deactivateLens: (id: LensId) => void;
  clearLenses: () => void;
  setLenses: (ids: LensId[]) => void;
  intensity: number;
  setIntensity: (val: number) => void;
  mouseBlockedNotice: boolean;
  triggerMouseBlockedNotice: () => void;
  cursorPos: { x: number; y: number };
  jitterPos: { x: number; y: number };
}

const LensContext = createContext<LensContextValue | null>(null);

export function LensProvider({ children }: { children: ReactNode }) {
  const [activeLenses, setActiveLenses] = useState<LensId[]>([]);
  const [intensity, setIntensity] = useState<number>(1.0);
  const [mouseBlockedNotice, setMouseBlockedNotice] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [jitterPos, setJitterPos] = useState({ x: -100, y: -100 });

  const isLensActive = (id: LensId) => activeLenses.includes(id);

  const toggleLens = (id: LensId) => {
    setActiveLenses((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const activateLens = (id: LensId) => {
    setActiveLenses((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const deactivateLens = (id: LensId) => {
    setActiveLenses((prev) => prev.filter((item) => item !== id));
  };

  const clearLenses = () => {
    setActiveLenses([]);
  };

  const setLenses = (ids: LensId[]) => {
    setActiveLenses(ids);
  };

  const triggerMouseBlockedNotice = () => {
    setMouseBlockedNotice(true);
    setTimeout(() => {
      setMouseBlockedNotice(false);
    }, 2800);
  };

  // Tremor / Jitter loop using requestAnimationFrame
  useEffect(() => {
    const isTremor = activeLenses.includes('tremor');
    if (!isTremor) return;

    let animId: number;
    let angle = 0;

    const updateJitter = () => {
      angle += 0.28;
      // Multi-frequency harmonic oscillation to simulate realistic involuntary tremor
      const amp = 14 * intensity;
      const noiseX =
        Math.sin(angle * 1.3) * amp +
        Math.sin(angle * 3.7) * (amp * 0.45) +
        (Math.random() - 0.5) * (amp * 0.5);
      const noiseY =
        Math.cos(angle * 1.1) * amp +
        Math.cos(angle * 2.9) * (amp * 0.45) +
        (Math.random() - 0.5) * (amp * 0.5);

      setJitterPos((prev) => ({
        x: cursorPos.x + noiseX,
        y: cursorPos.y + noiseY,
      }));

      animId = requestAnimationFrame(updateJitter);
    };

    animId = requestAnimationFrame(updateJitter);
    return () => cancelAnimationFrame(animId);
  }, [activeLenses, intensity, cursorPos]);

  // Track cursor position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <LensContext.Provider
      value={{
        activeLenses,
        isLensActive,
        toggleLens,
        activateLens,
        deactivateLens,
        clearLenses,
        setLenses,
        intensity,
        setIntensity,
        mouseBlockedNotice,
        triggerMouseBlockedNotice,
        cursorPos,
        jitterPos,
      }}
    >
      {children}
    </LensContext.Provider>
  );
}

export function useLenses() {
  const context = useContext(LensContext);
  if (!context) {
    throw new Error('useLenses must be used within a LensProvider');
  }
  return context;
}
