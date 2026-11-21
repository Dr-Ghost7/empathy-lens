# Empathy Lens — Browser Extension (Manifest V3)

A Chrome & Chromium extension that injects real-time accessibility and sensory simulation lenses directly into **any live website**.

Use it to audit websites in the wild (Google, Stripe, GitHub, or your target company's web app) under colorblindness, motor tremors, glare, and low visual acuity.

---

## Supported Lenses

1. **Color Vision Deficiencies (CVD):**
   - **Deuteranopia** (Green-blind, ~6% of men)
   - **Protanopia** (Red-blind, ~1% of men)
   - **Tritanopia** (Blue-yellow deficiency, rare)
   - **Achromatopsia** (Total monochromacy / rod vision)
2. **Vision Acuity & Situational:**
   - **Low Acuity / Cataracts** (Dynamic CSS blur)
   - **Bright Sun Glare** (100,000 lux outdoor daylight reflection and contrast compression)
   - **Tunnel Vision** (Cursor-tracking peripheral field loss)
3. **Motor & Mobility:**
   - **Hand Tremor** (Involuntary mathematical harmonic jitter applied to mouse cursor)
   - **Keyboard Only** (Mouse pointer event suppression with assistive toast)

---

## How to Install in Chrome / Edge / Brave (30 Seconds)

1. Open your browser and navigate to:
   ```text
   chrome://extensions
   ```
   *(or `edge://extensions` / `brave://extensions`)*
2. In the top right corner, **enable Developer mode**.
3. Click the **Load unpacked** button.
4. Select the `extension` folder inside this project directory:
   ```text
   empathy-lens/extension
   ```
5. Pin the **Empathy Lens** icon to your browser toolbar!

---

## How to Test on Any Live Site

1. Open any website in your browser (e.g. [stripe.com](https://stripe.com), [github.com](https://github.com), or your company's web app).
2. Click the **Empathy Lens** icon in your toolbar.
3. Select any lens (e.g. **Deuteranopia** or **Hand Tremor**).
4. Watch the entire webpage instantly transform in real-time.
5. Click **Reset** in the popup or on the floating on-screen pill at the bottom-right to return to normal.

---

## Architecture & Implementation

- **Manifest V3** compliant with zero external network dependencies.
- **SVG Color Matrix Filters:** Mathematically mapped matrix transforms projected onto the browser canvas.
- **Isomorphic CSS & Overlay Injector:** Applies transformations safely to the page DOM without breaking page responsiveness or scrolling.
- **Floating HUD:** An unobtrusive, lightweight status pill injected into the host page for quick resets.
