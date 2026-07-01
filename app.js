/* =============================================
   AIYAN PORTFOLIO — APP.JS
   ============================================= */

(function () {
  'use strict';

  // ---- THEME TOGGLE ----
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeBeam = document.getElementById('theme-beam');

  // Load saved theme — suppress transition on initial paint
  html.classList.add('no-transition');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  setTheme(savedTheme);
  // Re-enable transitions after the first frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      html.classList.remove('no-transition');
    });
  });


  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '☀' : '☽';
    localStorage.setItem('portfolio-theme', theme);
  }

  function triggerThemeTransition(targetTheme) {
    // Respect reduced motion — instant swap
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !document.startViewTransition
    ) {
      setTheme(targetTheme);
      return;
    }

    // Set circle origin to toggle button center
    const rect = themeToggle.getBoundingClientRect();
    const x = Math.round(rect.left + rect.width / 2);
    const y = Math.round(rect.top  + rect.height / 2);
    html.style.setProperty('--theme-origin-x', x + 'px');
    html.style.setProperty('--theme-origin-y', y + 'px');

    // Native View Transitions API — same as tristanhendricks.vercel.app
    const transition = document.startViewTransition(() => {
      setTheme(targetTheme);
    });

    // Clean up CSS vars after animation completes
    transition.finished.then(() => {
      html.style.removeProperty('--theme-origin-x');
      html.style.removeProperty('--theme-origin-y');
    }).catch(() => {});
  }

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    triggerThemeTransition(current === 'dark' ? 'light' : 'dark');
  });

  // ---- NAVIGATION ----
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  function showSection(sectionId) {
    // Hide all sections
    sections.forEach(s => {
      s.classList.remove('active-section');
    });

    // Remove active from all nav links
    navLinks.forEach(link => {
      link.classList.remove('active');
    });

    // Show target section
    const target = document.getElementById(sectionId);
    if (target) {
      target.classList.add('active-section');
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Activate nav link
    const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Update URL hash without scroll
    history.pushState(null, '', `#${sectionId}`);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('data-section');
      showSection(section);
    });
  });

  // Handle inline links (e.g. href="#art" or href="#contact")
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const href = anchor.getAttribute('href').slice(1); // remove '#'
    const validSections = ['home', 'art', 'projects', 'about'];
    
    if (validSections.includes(href)) {
      e.preventDefault();
      showSection(href);
    } else {
      const targetEl = document.getElementById(href);
      if (targetEl) {
        const parentSection = targetEl.closest('.section');
        if (parentSection) {
          e.preventDefault();
          showSection(parentSection.getAttribute('id'));
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    }
  });

  // Handle initial hash
  const initialHash = window.location.hash.slice(1);
  if (initialHash) {
    if (['home', 'art', 'projects', 'about'].includes(initialHash)) {
      showSection(initialHash);
    } else {
      const targetEl = document.getElementById(initialHash);
      if (targetEl) {
        const parentSection = targetEl.closest('.section');
        if (parentSection) {
          showSection(parentSection.getAttribute('id'));
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    }
  }

  // ---- LIVE CLOCK ----
  const clockEl = document.getElementById('live-clock');
  const dateEl = document.getElementById('live-date');

  const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    clockEl.textContent = `${hours}:${minutes} ${ampm}`;
    dateEl.textContent = `${MONTH_NAMES[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  }

  updateClock();
  setInterval(updateClock, 1000);

  // ---- AGE COUNTER ----
  const ageEl = document.getElementById('age-counter');

  // Set your birthdate here (YYYY, MM-1, DD) — MM is 0-indexed
  const BIRTH_DATE = new Date(2005, 0, 15); // Jan 15, 2005 — update this!

  function updateAge() {
    if (!ageEl) return;
    const now = new Date();
    const diffMs = now - BIRTH_DATE;
    const years = diffMs / (1000 * 60 * 60 * 24 * 365.25);
    ageEl.textContent = years.toFixed(10);
  }

  updateAge();
  setInterval(updateAge, 100); // update frequently for decimal effect

  // ---- PROJECT CARD HOVER EFFECTS ----
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Could open project link - just a placeholder for now
      }
    });
  });

  // ---- ART CARD HOVER EFFECTS ----
  const artCards = document.querySelectorAll('.art-card');
  artCards.forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
      }
    });
  });

  // ---- KEYBOARD NAVIGATION ----
  document.addEventListener('keydown', (e) => {
    // Press 1/2/3/4 to navigate sections
    const sectionMap = {
      '1': 'home',
      '2': 'art',
      '3': 'projects',
      '4': 'about',
    };
    if (sectionMap[e.key] && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const active = document.activeElement;
      const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');
      if (!isInput) {
        showSection(sectionMap[e.key]);
      }
    }
    // Press 'T' to toggle theme
    if ((e.key === 't' || e.key === 'T') && !e.ctrlKey && !e.metaKey) {
      const active = document.activeElement;
      const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');
      if (!isInput) {
        const current = html.getAttribute('data-theme');
        triggerThemeTransition(current === 'dark' ? 'light' : 'dark');
      }
    }
  });

  // ---- INTERSECTION OBSERVER for beam parallax ----
  let ticking = false;
  const beam1 = document.querySelector('.beam-1');
  const beam2 = document.querySelector('.beam-2');

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (beam1) beam1.style.transform = `rotate(-25deg) translateY(${scrollY * 0.05}px)`;
        if (beam2) beam2.style.transform = `rotate(-15deg) translateY(${scrollY * 0.03}px)`;
        ticking = false;
      });
      ticking = true;
    }
  });

})();
