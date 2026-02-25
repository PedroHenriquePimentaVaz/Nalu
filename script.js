/* script.js — Nalu Landing Page Interactions */

/* ─── Nav: Add scrolled class on scroll ───────────────────── */
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ─── Mobile Menu Toggle ───────────────────────────────────── */
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── Parallax Hero ────────────────────────────────────────── */
const heroParallax = document.getElementById('heroParallax');

if (heroParallax && window.innerWidth > 768) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const rate = scrolled * 0.35;
    heroParallax.style.transform = `translateY(${rate}px)`;
  }, { passive: true });
}

/* ─── Scroll Reveal ────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Number(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

// Observe all reveal elements
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = i * 80;
  revealObserver.observe(el);
});

// Also reveal glass-cards in sections
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        sectionObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
);

// Apply fade-in to glass-cards not already handled
document.querySelectorAll(
  '.music__featured, .music__single, .stat, .about__inner, .mailing__inner, .insta-item'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.7s ease ${i * 0.06}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s`;
  sectionObserver.observe(el);
});

/* ─── Mailing Form ─────────────────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('emailInput').value;
  if (!email) return;

  const form = document.getElementById('mailingForm');
  const success = document.getElementById('mailingSuccess');

  // Simulate submission
  const btn = form.querySelector('.mailing__btn');
  btn.textContent = '✓ Enviado!';
  btn.style.background = 'linear-gradient(135deg, #1DB954, #0d9e46)';

  setTimeout(() => {
    form.style.display = 'none';
    success.style.display = 'flex';
    success.style.flexDirection = 'column';
    success.style.alignItems = 'center';
    success.style.gap = '12px';
  }, 800);
}

/* ─── Button ripple effect ─────────────────────────────────── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.5s ease-out;
      pointer-events: none;
    `;

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

// Add ripple keyframe dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to { transform: scale(2.5); opacity: 0; }
  }
`;
document.head.appendChild(style);

/* ─── Cursor glow on hero (desktop only) ──────────────────── */
if (window.innerWidth > 900) {
  const hero = document.getElementById('hero');
  let glowDot;

  hero.addEventListener('mousemove', (e) => {
    if (!glowDot) {
      glowDot = document.createElement('div');
      glowDot.style.cssText = `
        position: fixed;
        pointer-events: none;
        width: 300px; height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(155,45,255,0.12) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        transition: left 0.1s ease, top 0.1s ease;
        z-index: 5;
      `;
      document.body.appendChild(glowDot);
    }
    glowDot.style.left = e.clientX + 'px';
    glowDot.style.top  = e.clientY + 'px';
    glowDot.style.display = 'block';
  });

  hero.addEventListener('mouseleave', () => {
    if (glowDot) glowDot.style.display = 'none';
  });
}

/* ─── Active nav link highlight ───────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? 'white'
            : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(section => activeObserver.observe(section));

/* ─── Smooth number counter for stats ─────────────────────── */
function animateCounter(el, target, suffix = '') {
  const duration = 1500;
  const start = performance.now();
  const initial = 0;

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(initial + (target - initial) * eased);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Observe stats section
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
