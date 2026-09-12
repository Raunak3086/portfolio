/**
 * Deep Raunak — Portfolio Script
 * Handles animations, navigation, and interactive elements
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initSmoothScroll();
  initNavbar();
  initMobileMenu();
  initStatCounters();
  initParallax();
  initActiveNavLink();
  initEmailHandler();
});

/* ===== 1. SCROLL REVEAL ===== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
}

/* ===== 2. SMOOTH SCROLLING ===== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;

      try {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      } catch { /* invalid selector */ }
    });
  });
}

/* ===== 3. NAVBAR SCROLL STATE ===== */
function initNavbar() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;

  const onScroll = () => {
    const scrollY = window.scrollY;

    // Add/remove scrolled class
    header.classList.toggle('scrolled', scrollY > 50);

    // Hide/show on scroll direction (optional subtle effect)
    if (scrollY > lastScroll && scrollY > 200) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    header.style.transition = 'transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease';
    lastScroll = scrollY;
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ===== 4. MOBILE MENU ===== */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const backdrop = document.querySelector('.mobile-backdrop');
  const body = document.body;

  if (!hamburger || !mobileMenu) return;

  const open = () => {
    hamburger.classList.add('active');
    mobileMenu.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    body.classList.add('menu-open');
  };

  const close = () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    body.classList.remove('menu-open');
  };

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.contains('active') ? close() : open();
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on backdrop click
  if (backdrop) {
    backdrop.addEventListener('click', close);
  }

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      close();
    }
  });
}

/* ===== 5. STAT COUNTER ANIMATION ===== */
function initStatCounters() {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  const animate = (el) => {
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';

    const raw = el.textContent.trim();
    // Handle "Top 3%" or text-only values
    const match = raw.match(/^([^\d]*)([\d]+(?:\.[\d]+)?)(.*)$/);
    if (!match) return;

    const prefix = match[1] || '';
    const target = parseFloat(match[2]);
    const suffix = match[3] || '';
    const isDecimal = match[2].includes('.');
    const decimals = isDecimal ? (match[2].split('.')[1] || '').length : 0;
    const duration = 2000;
    let start = null;

    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      const current = target * ease;

      el.textContent = `${prefix}${isDecimal ? current.toFixed(decimals) : Math.floor(current)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = raw; // ensure exact final value
      }
    };

    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    stats.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach(el => observer.observe(el));
}

/* ===== 6. PARALLAX EFFECT ===== */
function initParallax() {
  const bgText = document.querySelector('.hero-bg-text');
  if (!bgText) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY * 0.25;
        bgText.style.transform = `translate(-50%, calc(-50% + ${y}px))`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ===== 7. ACTIVE NAV LINK HIGHLIGHTING ===== */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s));
}

/* ===== 8. EMAIL & MAILTO HANDLER ===== */
function initEmailHandler() {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  const emailAddress = 'deepraunak6@gmail.com';

  emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // 1. Copy email to clipboard
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(emailAddress).catch(() => {});
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = emailAddress;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try { document.execCommand('copy'); } catch {}
        document.body.removeChild(textarea);
      }

      // 2. Show toast feedback
      showToast(`Copied ${emailAddress} to clipboard!`);

      // 3. Open Gmail compose window directly
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}`;
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    });
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
