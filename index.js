// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
}); 
// Toggle mobile menu
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
}); 
// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Observe project cards
document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Observe steps
document.querySelectorAll('.step').forEach((step, index) => {
    step.style.opacity = '0';
    step.style.transform = 'translateY(30px)';
    step.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(step);
});

// Counter animation for hero stats
const animateCounter = (element, target, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
};

// Trigger counter animation when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.stat-number').forEach(stat => {
                const target = parseInt(stat.textContent);
                animateCounter(stat, target);
            });
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// Add hover effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 8px 20px rgba(10, 21, 21, 0.3)';
    });
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'var(--shadow)';
    });
});

// Project card interactions
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Add active class to navigation links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active link styling
const style = document.createElement('style');
style.textContent = `
    .nav-links a.active {
        color: var(--primary-color);
        position: relative;
    }
    
    .nav-links a.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--primary-color);
        animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
        from {
            width: 0;
            left: 0;
        }
        to {
            width: 100%;
            left: 0;
        }
    }
`;
document.head.appendChild(style);

// Handle disabled button clicks
document.querySelectorAll('.btn-disabled').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Button disabled');
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        const rect = this.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple effect styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Console welcome message
console.log('%c🌉 Bienvenue sur SkillBridge!', 'color: #0a1515; font-size: 20px; font-weight: bold;');
console.log('%cConnectez-vous avec des étudiants passionnés', 'color: #0a1515; font-size: 14px;');

// Theme & accent runtime with RGB(10, 21, 21) default color
(function () {
  const root = document.documentElement;
  const themeToggleId = 'themeToggle';
  const accentPickerId = 'accentPicker';
  const storageKey = 'skillbridge_theme';
  const accentKey = 'skillbridge_accent';
  
  // Default color: RGB(10, 21, 21) = #0a1515
  const DEFAULT_ACCENT = '#001138'; // RGB(10,21,21)

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
      '--primary-dark': '#051010',
      '--secondary-color': '#0a2626',
      '--accent-color': '#0d3f3f',
      '--success-color': '#10b981',
      '--warning-color': '#f59e0b',
      '--border-color': '#e5e7eb',
      '--shadow': `0 4px 15px rgba(10, 21, 21, 0.08)`,
      '--shadow-lg': `0 15px 40px rgba(10, 21, 21, 0.15)`,
      '--bg-gradient-1': `linear-gradient(135deg, ${DEFAULT_ACCENT} 0%, #0d3f3f 100%)`,
      '--bg-gradient-2': `linear-gradient(180deg, rgba(10,21,21,0.05) 0%, rgba(13,63,63,0.05) 100%)`,
      '--navbar-bg': 'linear-gradient(90deg, rgba(10, 21, 21, 0.08) 0%, rgba(13, 63, 63, 0.06) 100%)',
      '--navbar-backdrop': 'blur(12px)'
    },
    dark: {
      '--bg-white': '#0f1419',
      '--bg-light': '#16213e',
      '--text-dark': '#e6eef8',
      '--text-light': '#a0aec0',
      '--primary-color': '#0a9999',
      '--primary-dark': '#066b6b',
      '--secondary-color': '#0db8d4',
      '--accent-color': '#0ea5e9',
      '--success-color': '#10b981',
      '--warning-color': '#fbbf24',
      '--border-color': '#2d3748',
      '--shadow': `0 4px 15px rgba(10, 153, 153, 0.12)`,
      '--shadow-lg': `0 15px 40px rgba(10, 153, 153, 0.2)`,
      '--bg-gradient-1': `linear-gradient(135deg, #1a4d4d 0%, #0f2a2a 100%)`,
      '--bg-gradient-2': `linear-gradient(180deg, rgba(10,153,153,0.08) 0%, rgba(13,184,212,0.08) 100%)`,
      '--navbar-bg': 'linear-gradient(90deg, rgba(10, 21, 31, 0.92) 0%, rgba(13, 40, 50, 0.92) 100%)',
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

    .btn, .feature-card, .step, .nav-links a {
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
      border-bottom: 1px solid rgba(10, 153, 153, 0.12);
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

    /* Smooth gradient animations */
    @keyframes gradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .hero {
      background-size: 200% 200%;
      animation: gradientShift 8s ease infinite;
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
    const lighter = shadeColor(hex, 15);
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
      picker.value = DEFAULT_ACCENT;
      
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

  // Animate hero gradient
  (function animateHeroGradient() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    let t = 0;
    setInterval(() => {
      t += 0.0035;
      const x = Math.sin(t) * 50;
      const y = Math.cos(t) * 50;
      hero.style.backgroundImage = `radial-gradient(circle at ${50 + x}% ${50 + y}%, rgba(255,255,255,0.03), transparent 10%), var(--bg-gradient-1)`;
    }, 40);
  })();

})();

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('SkillBridge loaded successfully');
});
