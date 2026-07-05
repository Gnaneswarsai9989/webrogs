/* =============================================
   WEBROGS – script.js
   3D Premium Gold Theme – Interactions & Effects
   ============================================= */

'use strict';



/* ── NAVBAR ── */
const nav = document.getElementById('nav');
let lastScroll = 0;

(function forceNavFixed() {
  if (!nav) return;
  nav.style.position = 'fixed';
  nav.style.top = '0';
  nav.style.left = '0';
  nav.style.right = '0';
  nav.style.zIndex = '9000';
})();

window.addEventListener('scroll', () => {
  const scroll = window.scrollY;
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
const menuBackdrop = document.getElementById('menuBackdrop');
const mobLinks = document.querySelectorAll('.mob-link');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  menuBackdrop?.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    menuBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── PARTICLES (Gold) ── */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = window.innerWidth > 768 ? 35 : 15;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const delay = Math.random() * 18;
    const dur = Math.random() * 16 + 12;
    // Randomize gold shades
    const hue = 38 + Math.random() * 16;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${x}%; bottom:-10px;
      animation-duration:${dur}s;
      animation-delay:-${delay}s;
      opacity:${Math.random() * 0.6 + 0.1};
      background: hsl(${hue},85%,${50 + Math.random()*20}%);
      box-shadow: 0 0 ${size * 3}px hsl(${hue},85%,60%);
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
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── COUNTER ANIMATION ── */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2200;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
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
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 88;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
      // Close mobile menu if open
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
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
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--gold-light)';
          link.style.setProperty('--d', '0s');
          link.querySelector('::after');
        } else {
          link.style.color = '';
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(s => sectionObserver.observe(s));

/* ── 3D TILT ON CARDS ── */
function addTilt(selector, intensity = 8) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) translateY(-6px) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

addTilt('.service-card', 7);
addTilt('.why-card', 5);
addTilt('.about-feature-card', 6);

/* ── MOUSE LIGHT ON WHY CARDS ── */
document.querySelectorAll('.why-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  });
});

/* ── PORTFOLIO CARD GLOW ── */
document.querySelectorAll('.portfolio-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', x + 'px');
    card.style.setProperty('--mouse-y', y + 'px');
  });
});

/* ── CONTACT FORM ── */
const form = document.getElementById('contactForm');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type=submit]');
  const orig = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;
  btn.style.background = 'linear-gradient(135deg, #6b5a00, #a08020)';
  setTimeout(() => {
    btn.textContent = '✓ Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #14532d, #22c55e)';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  }, 1500);
});

/* ── GOLD SCROLL PROGRESS BAR ── */
const progressBar = document.getElementById('progress-bar');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrollPct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrollPct + '%';
  });
}

/* ── 3D PARALLAX ON HERO ── */
const hero = document.querySelector('.hero');
if (hero) {
  let heroTicking = false;
  document.addEventListener('mousemove', (e) => {
    if (heroTicking) return;
    heroTicking = true;
    requestAnimationFrame(() => {
      const orbs = hero.querySelectorAll('.orb');
      const rect = hero.getBoundingClientRect();
      if (rect.bottom < 0) { heroTicking = false; return; }
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      orbs.forEach((orb, i) => {
        const depth = (i + 1) * 18;
        orb.style.transform = `translate3d(${cx * depth}px, ${cy * depth}px, 0)`;
      });
      heroTicking = false;
    });
  });
}

/* ── TECH ITEMS – 3D HOVER ── */
document.querySelectorAll('.tech-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    item.style.transform = `perspective(600px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateY(-8px) translateZ(10px)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

/* ── FLOATING 3D SHAPES ── */
function createFloatingShapes() {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    const shapes = [
      { cls: 'shape-3d shape-cube', top: '10%', right: '5%', delay: '0s', dur: '25s' },
      { cls: 'shape-3d shape-diamond', bottom: '15%', left: '3%', delay: '-8s', dur: '20s' },
    ];
    shapes.forEach(s => {
      const el = document.createElement('div');
      el.className = s.cls;
      el.style.cssText = `
        top:${s.top || 'auto'};
        bottom:${s.bottom || 'auto'};
        left:${s.left || 'auto'};
        right:${s.right || 'auto'};
        animation-delay:${s.delay};
        animation-duration:${s.dur};
        position:absolute;
        z-index:0;
      `;
      section.style.position = 'relative';
      section.style.overflow = 'hidden';
      section.appendChild(el);
    });
  });
}
createFloatingShapes();

/* ── LOGO 3D HOVER ── */
const logoEl = document.querySelector('.nav-logo');
if (logoEl) {
  logoEl.addEventListener('mouseenter', () => {
    logoEl.style.transform = 'perspective(300px) rotateY(-6deg)';
  });
  logoEl.addEventListener('mouseleave', () => {
    logoEl.style.transform = '';
  });
  logoEl.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
}

/* ── STAGGER CARD REVEAL ── */
document.querySelectorAll('.services-grid .service-card').forEach((card, i) => {
  card.style.setProperty('--d', `${i * 0.08}s`);
});
document.querySelectorAll('.why-grid .why-card').forEach((card, i) => {
  card.style.setProperty('--d', `${i * 0.08}s`);
});

/* ── MOBILE MENU LINK ANIMATION ── */
if (mobileMenu) {
  const links = mobileMenu.querySelectorAll('a');
  hamburger?.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
      links.forEach((link, i) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        setTimeout(() => {
          link.style.transition = `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s`;
          link.style.opacity = '1';
          link.style.transform = 'translateY(0)';
        }, 50);
      });
    } else {
      links.forEach(link => {
        link.style.opacity = '';
        link.style.transform = '';
        link.style.transition = '';
      });
    }
  });
}

/* ── INIT ── */
// Ensure body is visible (no flicker)
document.body.style.opacity = '1';
