/* home.js: navbar behavior, theme toggle, menu (mobile) */
document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const exploreBtn = document.querySelector(".cta-btn");

  // MOBILE MENU open/close
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }

  // CTA -> projets
  if (exploreBtn) {
    exploreBtn.addEventListener("click", () => {
      window.location.href = "../projects/projects.html";
    });
  }

  // Nav active link highlight (keeps single active)
  document.querySelectorAll(".nav-links a").forEach(a => {
    a.addEventListener("click", (e) => {
      document.querySelectorAll(".nav-links a").forEach(x => x.classList.remove("active"));
      a.classList.add("active");
      // if mobile, close menu after click
      if (navLinks && navLinks.classList.contains("show")) navLinks.classList.remove("show");
    });
  });
});

// Theme & accent runtime with RGB(10, 21, 21) default color
(function () {
  const root = document.documentElement;
  const themeToggleId = 'themeToggle';
  const accentPickerId = 'accentPicker';
  const storageKey = 'skillbridge_theme';
  const accentKey = 'skillbridge_accent';
  
  // Default color: RGB(10, 21, 21) = #0a1515
  const DEFAULT_ACCENT = '#6366f1';

  // set CSS variable immediately so stylesheet fallbacks use it
  try { document.documentElement.style.setProperty('--primary-color', DEFAULT_ACCENT); } catch(e){/* ignore */}

  // Enhanced palettes with modern gradients and shadows
  const palettes = {
    light: {
      '--bg-white': '#ffffff',
      '--bg-light': '#f7f7fb',
      '--text-dark': '#0f172a',
      '--text-light': '#6b7280',
      '--primary-color': DEFAULT_ACCENT,
      '--primary-dark': '#4f46e5',
      '--secondary-color': '#8b5cf6',
      '--accent-color': '#ec4899',
      '--success-color': '#10b981',
      '--warning-color': '#f59e0b',
      '--border-color': '#e5e7eb',
      '--shadow': `0 4px 15px rgba(10, 21, 21, 0.08)`,
      '--shadow-lg': `0 15px 40px rgba(10, 21, 21, 0.15)`,
      '--bg-gradient-1': `linear-gradient(135deg, ${DEFAULT_ACCENT} 0%, #4f46e5 100%)`,
      '--bg-gradient-2': `linear-gradient(180deg, rgba(99,102,241,0.05) 0%, rgba(79,70,229,0.05) 100%)`,
      '--navbar-bg': 'linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(247, 247, 251, 0.95) 100%)',
      '--navbar-backdrop': 'blur(12px)'
    },
    dark: {
      '--bg-white': '#0f1419',
      '--bg-light': '#16213e',
      '--text-dark': '#e6eef8',
      '--text-light': '#a0aec0',
      '--primary-color': '#6366f1',
      '--primary-dark': '#4f46e5',
      '--secondary-color': '#8b5cf6',
      '--accent-color': '#ec4899',
      '--success-color': '#10b981',
      '--warning-color': '#fbbf24',
      '--border-color': '#2d3748',
      '--shadow': `0 4px 15px rgba(99, 102, 241, 0.12)`,
      '--shadow-lg': `0 15px 40px rgba(99, 102, 241, 0.2)`,
      '--bg-gradient-1': `linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)`,
      '--bg-gradient-2': `linear-gradient(180deg, rgba(99,102,241,0.08) 0%, rgba(79,70,229,0.08) 100%)`,
      '--navbar-bg': 'linear-gradient(90deg, rgba(15, 20, 25, 0.92) 0%, rgba(22, 33, 62, 0.92) 100%)',
      '--navbar-backdrop': 'blur(16px)'
    }
  };

  // Inject enhanced theme switcher and color picker styles
  const themeStyles = `
    .nav-controls {
      display: flex;
      align-items: center;
      gap: 14px;
      z-index: 1000;
    }

    #themeToggle {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      border: 2px solid var(--border-color);
      background: rgba(255, 255, 255, 0.1);
      color: var(--primary-color);
      font-size: 20px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow);
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(10px);
    }

    #themeToggle::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.1) 100%);
      opacity: 0;
      transition: opacity 0.3s;
    }

    #themeToggle:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-color);
      background: rgba(255, 255, 255, 0.15);
    }

    #themeToggle:hover::before {
      opacity: 1;
    }

    #themeToggle:active {
      transform: translateY(0);
    }

    #accentPicker {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      border: 2px solid var(--border-color);
      cursor: pointer;
      box-shadow: var(--shadow);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      padding: 2px;
      background: var(--bg-light);
    }

    #accentPicker:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-color);
    }

    #accentPicker:active {
      transform: translateY(0);
    }

    /* Theme transition for entire page */
    * {
      transition: background-color 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                  color 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                  border-color 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                  box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn, .nav-links a {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Enhanced navbar with gradient background and blur */
    .navbar {
      transition: background-color 0.35s, box-shadow 0.35s, backdrop-filter 0.35s;
      background: var(--navbar-bg) !important;
      backdrop-filter: var(--navbar-backdrop);
      -webkit-backdrop-filter: var(--navbar-backdrop);
      border-bottom: 1px solid rgba(10, 21, 21, 0.08);
    }

    
    .navbar.navbar-scrolled {
      background: var(--navbar-bg) !important;
      box-shadow: 0 8px 30px rgba(10, 21, 21, 0.12) !important;
      backdrop-filter: var(--navbar-backdrop);
      -webkit-backdrop-filter: var(--navbar-backdrop);
    }

    [data-theme="dark"] .navbar {
      border-bottom: 1px solid rgba(99, 102, 241, 0.12);
    }

    /* Theme indicator badge */
    .theme-indicator {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 18px;
      background: var(--primary-color);
      color: white;
      border-radius: 50px;
      font-size: 12px;
      font-weight: 600;
      opacity: 0;
      transform: translateY(10px);
      pointer-events: none;
      transition: opacity 0.3s, transform 0.3s;
      z-index: 10000;
      box-shadow: var(--shadow-lg);
      text-transform: capitalize;
    }

    .theme-indicator.show {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = themeStyles;
  document.head.appendChild(styleEl);

  function applyPalette(name) {
    const pal = palettes[name] || palettes.light;
    Object.entries(pal).forEach(([k, v]) => root.style.setProperty(k, v));
    document.documentElement.setAttribute('data-theme', name);
    
    // Update theme toggle button
    const tbtn = document.getElementById(themeToggleId);
    if (tbtn) {
      tbtn.textContent = name === 'dark' ? '☀️' : '🌙';
      tbtn.setAttribute('aria-pressed', name === 'dark' ? 'true' : 'false');
      tbtn.title = name === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre';
    }

    // Show indicator
    showThemeIndicator(name === 'dark' ? 'Mode sombre 🌙' : 'Mode clair ☀️');
  }

  function setAccent(hex) {
    const darker = shadeColor(hex, -18);
    root.style.setProperty('--primary-color', hex);
    root.style.setProperty('--primary-dark', darker);
    root.style.setProperty('--bg-gradient-1', `linear-gradient(135deg, ${hex} 0%, ${darker} 100%)`);
    root.style.setProperty('--bg-gradient-2', `linear-gradient(180deg, ${hex}0d 0%, ${darker}0d 100%)`);
    showThemeIndicator(`Accent: ${hex.toUpperCase()}`);
  }

  function shadeColor(hex, percent) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    const t = percent < 0 ? 0 : 255;
    const p = Math.abs(percent) / 100;
    const R = Math.round((t - r) * p) + r;
    const G = Math.round((t - g) * p) + g;
    const B = Math.round((t - b) * p) + b;
    return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
  }

  function toHex(colorStr) {
    colorStr = colorStr.trim();
    if (colorStr.startsWith('#')) return colorStr;
    const m = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (m) {
      const r = parseInt(m[1]).toString(16).padStart(2, '0');
      const g = parseInt(m[2]).toString(16).padStart(2, '0');
      const b = parseInt(m[3]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
    return DEFAULT_ACCENT;
  }

  function showThemeIndicator(text) {
    let indicator = document.querySelector('.theme-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'theme-indicator';
      document.body.appendChild(indicator);
    }
    indicator.textContent = text;
    indicator.classList.add('show');
    setTimeout(() => indicator.classList.remove('show'), 2000);
  }

  // Initialize from storage with new default
  const savedTheme = localStorage.getItem(storageKey) || 'light';
  const savedAccent = localStorage.getItem(accentKey) || DEFAULT_ACCENT;
  applyPalette(savedTheme);
  setAccent(savedAccent);

  // Wire up controls
  document.addEventListener('DOMContentLoaded', () => {
    const tbtn = document.getElementById(themeToggleId);
    const picker = document.getElementById(accentPickerId);

    if (tbtn) {
      tbtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyPalette(next);
        localStorage.setItem(storageKey, next);
      });
    }

    if (picker) {
      picker.value = savedAccent;
      
      picker.addEventListener('input', (e) => {
        const v = e.target.value;
        setAccent(v);
        localStorage.setItem(accentKey, v);
      });
    }

    // Add keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + T)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        tbtn && tbtn.click();
      }
    });
  });
})();
