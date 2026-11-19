# Empathy Lens

> **Status:** Work In Progress (WIP) — Core simulation engine, lens matrix, and 4 interactive scenarios implemented.

An interactive accessibility sandbox and testing lab designed to simulate real-world physical, visual, motor, and situational constraints on web interfaces.

Experience deliberately flawed interfaces firsthand, audit the failure against WCAG 2.2 criteria, and toggle accessible fixes to see the difference in real-time.

---

## Features

- **Sensory & Environmental Lenses:**
  - **Color Vision Deficiencies (CVD):** Scientifically mapped SVG `feColorMatrix` filters for Deuteranopia (green-blind), Protanopia (red-blind), Tritanopia (blue-yellow), and Achromatopsia (monochromacy).
  - **Visual Acuity & Field Loss:** Dynamic CSS backdrop blur (cataracts / low acuity) and radial vignette tracking (tunnel vision / glaucoma).
  - **Motor Tremor Simulator:** Multi-harmonic mathematical noise injection via `requestAnimationFrame` simulating hand tremors and ataxia.
  - **Situational Constraints:** High-ambient screen washout simulating outdoor mobile usage in 100,000 lux noon sunlight, and keyboard-only mouse suppression mode.
- **Guided Challenge Arena:**
  - **The Sunshine Checkout:** Contrast washouts, missing `<label>` tags, and 16px touch targets.
  - **The Keyboard-Only Airline Seat Picker:** <div> buttons, stripped `outline: none`, and un-trapped dialogs.
  - **The Colorblind Error Maze:** Form validation relying exclusively on color without icons or text.
  - **The Tremor Donation Widget:** Tightly packed 2px buttons and unclickable checkbox labels.
- **Freeform Sandbox / Multi-Lens Rig:**
  - Stack multiple lenses simultaneously on common UI presets (auth cards, e-commerce, telemetry tables).
  - Built-in real-time WCAG 2.2 contrast ratio calculator with AA / AAA pass-fail badges.
- **Fix Studio & Audit Breakdown:**
  - Direct side-by-side code diffs demonstrating flawed markup vs accessible TSX solutions.

---

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [lucide-react](https://lucide.dev/)
- **Effects:** canvas-confetti, SVG color matrix filters

---

## Getting Started

### Prerequisites

Node.js 18+ (tested on Node v20 / v22) and npm.

### Installation

```bash
git clone https://github.com/Dr-Ghost7/empathy-lens.git
cd empathy-lens
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## Roadmap

- [x] Next.js App Router scaffold & responsive dark-mode shell
- [x] Mathematical SVG filters for CVD and CSS glare / tunnel vision
- [x] Motor tremor coordinate jitter engine
- [x] 4 real-world interactive challenge modules with toggleable fix states
- [x] Live WCAG contrast ratio analyzer tool
- [ ] Sandpack live in-browser TSX code editor
- [ ] Sound synthesizer for screen-reader speech visualization
- [ ] Additional cognitive load challenges (motion sensitivity & auto-advancing carousels)

---

## License

MIT
