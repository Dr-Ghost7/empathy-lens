// Empathy Lens — Popup Controller
document.addEventListener('DOMContentLoaded', () => {
  let activeTabId = null;
  let currentLens = null;
  let currentIntensity = 1.0;

  const statusBar = document.getElementById('status-bar');
  const statusText = document.getElementById('status-text');
  const lensCards = document.querySelectorAll('.lens-card');
  const intensityButtons = document.querySelectorAll('.btn-intensity');
  const btnResetTop = document.getElementById('btn-reset-top');
  const btnResetMain = document.getElementById('btn-reset-main');

  const LENS_LABELS = {
    deuteranopia: 'Deuteranopia (Green-Blind)',
    protanopia: 'Protanopia (Red-Blind)',
    tritanopia: 'Tritanopia (Blue-Blind)',
    achromatopsia: 'Achromatopsia (Monochrome)',
    blur: 'Low Acuity / Cataracts',
    sunlight: 'Bright Sun Glare',
    tunnel: 'Tunnel Vision',
    tremor: 'Hand Tremor',
    keyboard_only: 'Keyboard Only',
    slow_network: 'Subway 2G (Throttled)',
    distraction: 'Cognitive Overload (ADHD)',
  };

  // Update popup visual state
  function updateUI() {
    lensCards.forEach((card) => {
      const lens = card.getAttribute('data-lens');
      if (lens === currentLens) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    intensityButtons.forEach((btn) => {
      const val = parseFloat(btn.getAttribute('data-intensity'));
      if (Math.abs(val - currentIntensity) < 0.05) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (currentLens) {
      statusBar.classList.add('active');
      statusText.textContent = `Active: ${LENS_LABELS[currentLens] || currentLens}`;
    } else {
      statusBar.classList.remove('active');
      statusText.textContent = 'Standard Vision (No lens active)';
    }
  }

  // Send message to active tab content script
  function sendToTab(message, callback) {
    if (!activeTabId) return;
    chrome.tabs.sendMessage(activeTabId, message, (response) => {
      if (chrome.runtime.lastError) {
        // Tab might not allow content scripts (e.g. chrome://, chrome web store)
        statusText.textContent = 'Cannot run on browser system pages.';
        return;
      }
      if (callback) callback(response);
    });
  }

  // Get active tab and retrieve current state
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      activeTabId = tabs[0].id;
      sendToTab({ action: 'GET_STATE' }, (res) => {
        if (res) {
          currentLens = res.lens;
          currentIntensity = res.intensity || 1.0;
          updateUI();
        }
      });
    }
  });

  // Handle lens selection
  lensCards.forEach((card) => {
    card.addEventListener('click', () => {
      const lens = card.getAttribute('data-lens');
      if (currentLens === lens) {
        // Toggle off
        currentLens = null;
        sendToTab({ action: 'CLEAR_LENS' }, () => updateUI());
      } else {
        // Activate selected lens
        currentLens = lens;
        sendToTab({ action: 'SET_LENS', lens, intensity: currentIntensity }, () => updateUI());
      }
      updateUI();
    });
  });

  // Handle intensity selection
  intensityButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentIntensity = parseFloat(btn.getAttribute('data-intensity'));
      updateUI();
      if (currentLens) {
        sendToTab({ action: 'SET_LENS', lens: currentLens, intensity: currentIntensity });
      }
    });
  });

  // Reset actions
  const handleReset = () => {
    currentLens = null;
    sendToTab({ action: 'CLEAR_LENS' }, () => updateUI());
    updateUI();
  };

  btnResetTop.addEventListener('click', handleReset);
  btnResetMain.addEventListener('click', handleReset);
});
