# Empathy Lens

> **Live Deployment:** [https://empathy-lens-pi.vercel.app/](https://empathy-lens-pi.vercel.app/)  
> **Status:** Work In Progress (WIP) — Minimalist web sandbox & Manifest V3 browser extension for live website testing.

An accessibility and sensory simulation tool available both as a **clean web simulator** and a **Chromium browser extension (Manifest V3)** that lets you test any live website in the wild under real-world visual, motor, and situational constraints.

---

## 🌟 The Browser Extension (`extension/`)

Test any live webpage (Google, Stripe, GitHub, or your target company's product) under accessibility constraints:

- **Color Vision Deficiencies (CVD):** Mathematically accurate SVG `feColorMatrix` filters for Deuteranopia, Protanopia, Tritanopia, and Achromatopsia.
- **Motor Impairments:** Multi-harmonic mathematical noise injection simulating involuntary hand tremors on mouse navigation.
- **Situational Constraints:** Direct sunlight glare overlay (100,000 lux outdoor wash) and keyboard-only mouse suppression mode.
- **Floating HUD:** Non-intrusive on-screen reset pill injected directly into the tab.

### How to Install in Chrome / Edge (30 Seconds)

1. Open `chrome://extensions` in your browser.
2. Toggle **Developer mode** on (top right).
3. Click **Load unpacked** and select the `extension` folder in this repository.
4. Pin the **Empathy Lens** icon to your toolbar and open any website!

---

## 🖥️ Web Simulator (Next.js 16)

A clean, distraction-free playground comparing flawed UI patterns against WCAG 2.2 compliant implementations across:
1. **The Sunshine Checkout:** Contrast washouts and missing `<label>` tags.
2. **Flight Seat Picker:** `<div>` buttons, stripped `outline: none`, and modal focus traps.
3. **Clinical Intake Form:** Validation relying solely on color without text or icons.
4. **Donation Widget:** Cramped 2px button spacing and microscopic hit targets under motor tremors.

---

## Tech Stack

- **Extension:** Manifest V3, Web Accessible SVG Filters, Content Script Injection, Storage API
- **Web App:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Standards:** WCAG 2.2 (Level A, AA, AAA), Microsoft Inclusive Design Toolkit

---

## Getting Started

### Local Development

```bash
git clone https://github.com/Dr-Ghost7/empathy-lens.git
cd empathy-lens
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the web simulator.

### Production Build

```bash
npm run build
npm run start
```

---

## License

MIT
