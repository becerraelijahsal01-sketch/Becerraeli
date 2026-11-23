/**
 * LIGHTSWITCH.JS // Submersible Searchlight & Bioluminescence Control
 * Designed for Elijah Becerra's Deep Sea Portfolio (10C F26)
 */

(function initLightswitch() {
  const STORAGE_KEY = 'deep_sea_light_mode';
  const SEARCHLIGHT_CLASS = 'searchlight-mode';

  // Create or select searchlight spotlight element
  let spotlight = document.querySelector('.searchlight-spotlight');
  if (!spotlight) {
    spotlight = document.createElement('div');
    spotlight.className = 'searchlight-spotlight';
    document.body.appendChild(spotlight);
  }

  // Mouse tracking for the submersible searchlight
  window.addEventListener('mousemove', (e) => {
    if (document.body.classList.contains(SEARCHLIGHT_CLASS)) {
      spotlight.style.left = `${e.clientX}px`;
      spotlight.style.top = `${e.clientY}px`;
    }
  });

  // Apply state to DOM & Buttons
  function applyMode(isSearchlight) {
    const btn = document.getElementById('lightswitch-btn');
    if (isSearchlight) {
      document.body.classList.add(SEARCHLIGHT_CLASS);
      if (btn) {
        btn.innerHTML = `<span class="light-icon">🔦</span> Floodlight ON`;
        btn.setAttribute('title', 'Switch to Bioluminescent Abyss Mode');
        btn.setAttribute('aria-label', 'Switch to Bioluminescent Abyss Mode');
      }
    } else {
      document.body.classList.remove(SEARCHLIGHT_CLASS);
      if (btn) {
        btn.innerHTML = `<span class="light-icon">⚡</span> Biolum Mode`;
        btn.setAttribute('title', 'Switch to Submersible Searchlight Mode');
        btn.setAttribute('aria-label', 'Switch to Submersible Searchlight Mode');
      }
    }
  }

  // Toggle Function
  window.toggleDeepSeaLight = function() {
    const isCurrentSearchlight = document.body.classList.contains(SEARCHLIGHT_CLASS);
    const nextState = !isCurrentSearchlight;
    applyMode(nextState);
    try {
      localStorage.setItem(STORAGE_KEY, nextState ? 'searchlight' : 'biolum');
    } catch (e) {
      console.warn('LocalStorage unavailable for lightswitch');
    }
  };

  // Setup DOM on load
  document.addEventListener('DOMContentLoaded', () => {
    let savedMode = null;
    try {
      savedMode = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}

    // Default is Bioluminescent Abyss (false), unless previously saved as 'searchlight'
    applyMode(savedMode === 'searchlight');

    const btn = document.getElementById('lightswitch-btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.toggleDeepSeaLight();
      });
    }

    // Keyboard shortcut: Press 'L' to toggle light
    window.addEventListener('keydown', (e) => {
      // Don't trigger if user is typing in form inputs
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'l' || e.key === 'L') {
        window.toggleDeepSeaLight();
      }
    });
  });
})();
