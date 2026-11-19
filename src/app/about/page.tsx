import React from 'react';
import { Eye, Shield, Users, Sparkles, BookOpen, ExternalLink, Code } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Intro Header */}
      <div className="space-y-4">
        <span className="text-xs uppercase font-mono tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold inline-block">
          Philosophy & Engineering
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Designing for Humans at the Margins
        </h1>
        <p className="text-base text-zinc-300 leading-relaxed">
          Accessibility guidelines often get reduced to compliance checklists. But compliance is a
          byproduct of understanding friction. <strong>Empathy Lens</strong> was engineered to bridge
          the gap between abstract WCAG rules and the visceral frustration users experience when
          interfaces fail them.
        </p>
      </div>

      {/* The Persona Spectrum */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
          <Users className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">
            The Microsoft Inclusive Design "Persona Spectrum"
          </h2>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          Most product teams assume accessibility only serves a narrow minority with permanent
          disabilities. In reality, human abilities are dynamic and context-dependent. Designing for
          permanent constraints inherently solves temporary and situational barriers for everyone:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
            <span className="text-rose-400 font-mono font-bold uppercase text-[11px]">
              Permanent
            </span>
            <h3 className="font-bold text-white text-sm">One Arm / Congenital</h3>
            <p className="text-zinc-400">
              Users with a limb difference or chronic motor limitation rely on keyboard or switch
              navigation.
            </p>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
            <span className="text-amber-400 font-mono font-bold uppercase text-[11px]">
              Temporary
            </span>
            <h3 className="font-bold text-white text-sm">Sprained Wrist</h3>
            <p className="text-zinc-400">
              An injured dominant hand or dilated pupils from an eye exam creates an identical short-term
              barrier.
            </p>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
            <span className="text-emerald-400 font-mono font-bold uppercase text-[11px]">
              Situational
            </span>
            <h3 className="font-bold text-white text-sm">Holding a Baby / Sun Glare</h3>
            <p className="text-zinc-400">
              Holding groceries while texting in noon daylight mimics low-contrast and one-handed
              motor limits.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Implementation */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
          <Code className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Under the Hood: How the Lenses Work</h2>
        </div>

        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <div className="space-y-1.5">
            <h3 className="font-bold text-white text-sm">1. Color Vision Deficiencies (CVD)</h3>
            <p>
              Simulated using SVG <code className="text-emerald-400 font-mono">feColorMatrix</code>{' '}
              transformations based on Machado, Oliveira, and Fernandes (2009). The color matrices
              remap the 3D RGB color space to simulate missing or shifted cone photoreceptors (L-cone for
              protanopia, M-cone for deuteranopia, S-cone for tritanopia).
            </p>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-zinc-800">
            <h3 className="font-bold text-white text-sm">2. Motor Tremor & Target Size Simulation</h3>
            <p>
              Motor tremors are driven by a continuous <code className="text-emerald-400 font-mono">requestAnimationFrame</code>{' '}
              loop injecting multi-frequency sine wave harmonic noise into mouse coordinates. This simulates
              an involuntary 4–8 Hz physiological resting or intention tremor, proving why 44x44px target
              sizes (WCAG 2.5.5) and generous button gaps are essential.
            </p>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-zinc-800">
            <h3 className="font-bold text-white text-sm">3. Ambient Sunlight & Reflection Glare</h3>
            <p>
              Direct outdoor daylight reaches 100,000 lux. We combine high-ambient CSS screen blend modes
              with luminance compression to demonstrate why light slate text (#94a3b8) on white backgrounds
              fails completely in practical conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
