/* =============================================
   WEBROGS – script.js
   Animations, Interactions & Effects
   ============================================= */

'use strict';

/* ── CURSOR ── */
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');

if (cursor && trail) {
  let trailX = 0, trailY = 0;
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Use transform (GPU composited — no layout reflow)
    cursor.style.transform = `translate3d(${mouseX - 6}px, ${mouseY - 6}px, 0)`;
  });

  // Smooth trail using rAF instead of setTimeout (no jank)
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    trail.style.transform = `translate3d(${trailX - 18}px, ${trailY - 18}px, 0)`;
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
}


/* ── NAVBAR ── */
const nav = document.getElementById('nav');
let lastScroll = 0;

// Force nav to always stay fixed — bypasses any browser/CSS quirks on mobile
(function forceNavFixed() {
  if (!nav) return;
  nav.style.position = 'fixed';
  nav.style.top = '0';
  nav.style.left = '0';
  nav.style.right = '0';
  nav.style.zIndex = '9999';
})();

window.addEventListener('scroll', () => {
  const scroll = window.scrollY;
  // Re-enforce fixed on every scroll (some mobile browsers reset it)
  nav.style.position = 'fixed';
  nav.style.top = '0';
  if (scroll > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  lastScroll = scroll;
});

/* ── HAMBURGER / MOBILE MENU ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobLinks = document.querySelectorAll('.mob-link');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── PARTICLES ── */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = window.innerWidth > 768 ? 30 : 12;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const delay = Math.random() * 15;
    const dur = Math.random() * 15 + 10;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${x}%; bottom:-10px;
      animation-duration:${dur}s;
      animation-delay:-${delay}s;
      opacity:${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(p);
  }
}
createParticles();

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── COUNTER ANIMATION ── */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

const counters = document.querySelectorAll('.num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── ACTIVE NAV LINK ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--blue-bright)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(s => sectionObserver.observe(s));

/* ── CONTACT FORM ── */
const form = document.getElementById('contactForm');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type=submit]');
  const orig = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ Message Sent!';
    btn.style.background = '#22c55e';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  }, 1500);
});

/* ── TILT EFFECT ON SERVICE CARDS ── */
document.querySelectorAll('.service-card, .pricing-card, .why-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── TYPING EFFECT for hero (optional) ── */
const heroWords = ['Websites', 'Apps', 'Solutions', 'Brands'];
let wIndex = 0, cIndex = 0, deleting = false;
const heroTypingEl = document.querySelector('.hero-title .line:last-child');

// Only run typing if the hero title element exists
if (heroTypingEl) {
  function typeEffect() {
    const word = heroWords[wIndex];
    if (!deleting) {
      cIndex++;
      heroTypingEl.textContent = word.substring(0, cIndex);
      if (cIndex === word.length) {
        deleting = true;
        setTimeout(typeEffect, 2000);
        return;
      }
    } else {
      cIndex--;
      heroTypingEl.textContent = word.substring(0, cIndex);
      if (cIndex === 0) {
        deleting = false;
        wIndex = (wIndex + 1) % heroWords.length;
      }
    }
    setTimeout(typeEffect, deleting ? 60 : 100);
  }
  // Start typing after 2.5s so initial animation completes
  setTimeout(typeEffect, 2500);
}

/* ── GLOWING BORDER ON HOVER (Portfolio) ── */
document.querySelectorAll('.portfolio-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', x + 'px');
    card.style.setProperty('--mouse-y', y + 'px');
  });
});

/* ── SCROLL PROGRESS BAR ── */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position:fixed; top:0; left:0; height:2px;
  background:linear-gradient(90deg,#1d4ed8,#60a5fa);
  z-index:9999; width:0%; transition:width 0.1s;
  box-shadow:0 0 8px rgba(37,99,235,0.8);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollPct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = scrollPct + '%';
});

/* ── INIT ── */
// No opacity manipulation on load — avoids flicker bug
