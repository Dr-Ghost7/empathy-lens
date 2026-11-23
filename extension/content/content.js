// Empathy Lens — Injected Content Script for Live Web Testing
(() => {
  let activeLens = null;
  let activeIntensity = 1.0;
  let hudElement = null;
  let sunlightElement = null;
  let tunnelElement = null;
  let tremorElement = null;
  let distractionElement = null;
  let slowNetworkBanner = null;
  let slowNetworkLoadingBar = null;
  let inFlightTimeout = null;
  let slowNetworkClickCount = 0;
  let tremorAnimId = null;
  let mousePos = { x: -100, y: -100 };
  let jitterPos = { x: -100, y: -100 };
  let toastTimeout = null;

  const LENS_NAMES = {
    deuteranopia: 'Deuteranopia (Green-Blind)',
    protanopia: 'Protanopia (Red-Blind)',
    tritanopia: 'Tritanopia (Blue-Blind)',
    achromatopsia: 'Achromatopsia (Monochrome)',
    blur: 'Low Acuity / Cataracts',
    tunnel: 'Tunnel Vision (Glaucoma)',
    sunlight: 'Bright Sun Glare (100k lux)',
    tremor: 'Hand Tremor / Motor Jitter',
    keyboard_only: 'Keyboard Only (Pointer Suppressed)',
    slow_network: 'Subway 2G (Throttled)',
    distraction: 'Cognitive Overload (ADHD)',
  };

  // Ensure SVG filters are injected into the page DOM
  function ensureSvgFilters() {
    if (document.getElementById('empathy-lens-svg-filters')) return;

    fetch(chrome.runtime.getURL('filters.svg'))
      .then((res) => res.text())
      .then((svgText) => {
        const div = document.createElement('div');
        div.id = 'empathy-lens-svg-filters';
        div.style.cssText =
          'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;';
        div.innerHTML = svgText;
        document.documentElement.appendChild(div);
      })
      .catch((err) => {
        console.warn('Empathy Lens: Could not load SVG filters:', err);
      });
  }

  // Create or update the floating HUD pill
  function updateHud(lensId) {
    if (!lensId) {
      if (hudElement) {
        hudElement.remove();
        hudElement = null;
      }
      return;
    }

    if (!hudElement) {
      hudElement = document.createElement('div');
      hudElement.id = 'empathy-lens-hud';
      document.body.appendChild(hudElement);
    }

    const friendlyName = LENS_NAMES[lensId] || lensId;

    hudElement.innerHTML = `
      <div class="empathy-dot"></div>
      <span><strong>Lens:</strong> ${friendlyName}</span>
      <button class="empathy-btn-close" id="empathy-hud-reset">Reset</button>
    `;

    const resetBtn = hudElement.querySelector('#empathy-hud-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearAllLenses();
      });
    }
  }

  // Show floating warning toast (e.g. for Keyboard Only)
  function showToast(message) {
    let toast = document.getElementById('empathy-lens-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'empathy-lens-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      if (toast) toast.remove();
    }, 2400);
  }

  // Mouse event interceptor for Keyboard-Only mode and Slow Network simulation
  function handlePointerDownBlock(e) {
    if (activeLens === 'keyboard_only') {
      if (e.pointerType === 'mouse' || e.pointerType === 'touch' || !e.pointerType) {
        // Allow clicks on the Empathy Lens HUD itself
        if (hudElement && hudElement.contains(e.target)) return;

        e.preventDefault();
        e.stopPropagation();
        showToast('Mouse navigation suppressed: Use Tab, Shift+Tab, and Enter.');
      }
    }

    if (activeLens === 'slow_network') {
      const interactive = e.target.closest(
        'button, a, input[type="submit"], input[type="checkbox"], [role="button"]'
      );
      if (interactive) {
        slowNetworkClickCount++;
        if (slowNetworkClickCount > 1) {
          showToast(
            `⚠️ Subway 2G: ${slowNetworkClickCount} duplicate taps during network stall!`
          );
        }
        if (!slowNetworkLoadingBar) {
          slowNetworkLoadingBar = document.createElement('div');
          slowNetworkLoadingBar.id = 'empathy-lens-loading-crawl';
          document.body.appendChild(slowNetworkLoadingBar);
        }
        if (inFlightTimeout) clearTimeout(inFlightTimeout);
        inFlightTimeout = setTimeout(() => {
          slowNetworkClickCount = 0;
          if (slowNetworkLoadingBar) {
            slowNetworkLoadingBar.remove();
            slowNetworkLoadingBar = null;
          }
        }, 2400);
      }
    }
  }

  // Mouse tracking for Tunnel Vision
  function handleMouseMove(e) {
    mousePos = { x: e.clientX, y: e.clientY };

    if (activeLens === 'tunnel' && tunnelElement) {
      const radius = Math.max(80, 130 / activeIntensity);
      tunnelElement.style.background = `radial-gradient(circle ${radius}px at ${e.clientX}px ${e.clientY}px, transparent 0%, rgba(9, 9, 11, 0.75) 55%, rgba(5, 5, 8, 0.98) 100%)`;
    }
  }

  // Tremor loop with multi-harmonic oscillation
  function startTremorLoop() {
    let angle = 0;
    const cursorSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23f43f5e" stroke="%23ffffff" stroke-width="1.5"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>`;

    if (!tremorElement) {
      tremorElement = document.createElement('img');
      tremorElement.id = 'empathy-lens-tremor-cursor';
      tremorElement.src = cursorSvg;
      document.body.appendChild(tremorElement);
    }

    document.documentElement.style.setProperty('cursor', 'none', 'important');

    const updateTremor = () => {
      angle += 0.32;
      const amp = 14 * activeIntensity;
      const noiseX =
        Math.sin(angle * 1.3) * amp +
        Math.sin(angle * 3.7) * (amp * 0.45) +
        (Math.random() - 0.5) * (amp * 0.5);
      const noiseY =
        Math.cos(angle * 1.1) * amp +
        Math.cos(angle * 2.9) * (amp * 0.45) +
        (Math.random() - 0.5) * (amp * 0.5);

      jitterPos = {
        x: mousePos.x + noiseX,
        y: mousePos.y + noiseY,
      };

      if (tremorElement) {
        tremorElement.style.left = `${jitterPos.x}px`;
        tremorElement.style.top = `${jitterPos.y}px`;
      }

      tremorAnimId = requestAnimationFrame(updateTremor);
    };

    tremorAnimId = requestAnimationFrame(updateTremor);
  }

  function stopTremorLoop() {
    if (tremorAnimId) {
      cancelAnimationFrame(tremorAnimId);
      tremorAnimId = null;
    }
    if (tremorElement) {
      tremorElement.remove();
      tremorElement = null;
    }
    document.documentElement.style.removeProperty('cursor');
  }

  // Clear all overlays and filters
  function clearAllLenses() {
    activeLens = null;
    document.documentElement.style.removeProperty('filter');
    document.documentElement.style.removeProperty('transition');

    if (sunlightElement) {
      sunlightElement.remove();
      sunlightElement = null;
    }
    if (tunnelElement) {
      tunnelElement.remove();
      tunnelElement = null;
    }
    if (distractionElement) {
      distractionElement.remove();
      distractionElement = null;
    }
    if (slowNetworkBanner) {
      slowNetworkBanner.remove();
      slowNetworkBanner = null;
    }
    if (slowNetworkLoadingBar) {
      slowNetworkLoadingBar.remove();
      slowNetworkLoadingBar = null;
    }
    if (inFlightTimeout) clearTimeout(inFlightTimeout);
    slowNetworkClickCount = 0;

    stopTremorLoop();
    updateHud(null);

    // Save state
    try {
      chrome.storage.local.set({ empathyLensState: { lens: null, intensity: 1.0 } });
    } catch (_) {}
  }

  // Apply specified lens
  function applyLens(lensId, intensity = 1.0) {
    clearAllLenses();
    if (!lensId) return;

    activeLens = lensId;
    activeIntensity = intensity;
    ensureSvgFilters();

    // Visual Filter Lenses
    if (lensId === 'deuteranopia') {
      document.documentElement.style.setProperty(
        'filter',
        'url(#empathy-lens-deuteranopia)',
        'important'
      );
    } else if (lensId === 'protanopia') {
      document.documentElement.style.setProperty(
        'filter',
        'url(#empathy-lens-protanopia)',
        'important'
      );
    } else if (lensId === 'tritanopia') {
      document.documentElement.style.setProperty(
        'filter',
        'url(#empathy-lens-tritanopia)',
        'important'
      );
    } else if (lensId === 'achromatopsia') {
      document.documentElement.style.setProperty('filter', 'grayscale(100%)', 'important');
    } else if (lensId === 'blur') {
      const px = (4.5 * intensity).toFixed(1);
      document.documentElement.style.setProperty('filter', `blur(${px}px)`, 'important');
    } else if (lensId === 'sunlight') {
      document.documentElement.style.setProperty(
        'filter',
        `brightness(${1 + 0.3 * intensity}) contrast(${Math.max(0.4, 0.7 - 0.2 * intensity)})`,
        'important'
      );

      if (!sunlightElement) {
        sunlightElement = document.createElement('div');
        sunlightElement.id = 'empathy-lens-sunlight-overlay';
        document.body.appendChild(sunlightElement);
      }
    } else if (lensId === 'tunnel') {
      if (!tunnelElement) {
        tunnelElement = document.createElement('div');
        tunnelElement.id = 'empathy-lens-tunnel-overlay';
        document.body.appendChild(tunnelElement);
      }
      handleMouseMove({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
    } else if (lensId === 'tremor') {
      startTremorLoop();
    } else if (lensId === 'keyboard_only') {
      showToast('Keyboard Only Active: Tab through the page. Mouse clicks are blocked.');
    } else if (lensId === 'slow_network') {
      showToast('📶 Subway 2G Active: Simulated 2,400ms high latency.');
      if (!slowNetworkBanner) {
        slowNetworkBanner = document.createElement('div');
        slowNetworkBanner.id = 'empathy-lens-network-bar';
        slowNetworkBanner.textContent = '📶 Subway 2G Tunnel Simulation • 2,400ms Packet Transit Lag';
        document.body.appendChild(slowNetworkBanner);
      }
    } else if (lensId === 'distraction') {
      if (!distractionElement) {
        distractionElement = document.createElement('div');
        distractionElement.id = 'empathy-lens-distraction-box';
        distractionElement.innerHTML = `
          <div class="empathy-distraction-item">⚡ FLASH OFFER: 01:59 left!</div>
          <div class="empathy-distraction-ping">🔔 New ping: "Do you have a second?"</div>
        `;
        document.body.appendChild(distractionElement);
      }
    }

    updateHud(lensId);

    // Save state
    try {
      chrome.storage.local.set({ empathyLensState: { lens: lensId, intensity } });
    } catch (_) {}
  }

  // Register listeners
  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  window.addEventListener('pointerdown', handlePointerDownBlock, { capture: true });
  window.addEventListener('click', handlePointerDownBlock, { capture: true });

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'SET_LENS') {
      applyLens(request.lens, request.intensity || 1.0);
      sendResponse({ success: true, lens: request.lens });
    } else if (request.action === 'CLEAR_LENS') {
      clearAllLenses();
      sendResponse({ success: true, lens: null });
    } else if (request.action === 'GET_STATE') {
      sendResponse({ lens: activeLens, intensity: activeIntensity });
    }
    return true;
  });

  // Restore stored state on initial page load if saved
  try {
    chrome.storage.local.get(['empathyLensState'], (result) => {
      if (result && result.empathyLensState && result.empathyLensState.lens) {
        applyLens(result.empathyLensState.lens, result.empathyLensState.intensity);
      }
    });
  } catch (_) {}
})();
