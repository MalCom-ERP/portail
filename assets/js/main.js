/* ─────────────────────────────────────────────────────────────
   MALCOM VITRINE — JAVASCRIPT (IMPECCABLE EDITION)
   Smooth Reveals, Interactive Counters, 3D Tilt, Bento Spotlight,
   Tabs, FAQ Accordion, Realtime ROI Calculator, Modals, Lightbox
   ───────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
  initStatCounters();
  initTypewriter();
  initHeroTilt();
  initBentoGlow();
  initTabs();
  initFaq();
  initCalculator();
  initModals();
  initLightbox();
  initForms();
  initMobileMenu();
  initScrollNav();
});

/* ─────────── 0. TYPEWRITER HERO ─────────── */
function initTypewriter() {
  const h1 = document.querySelector('.typewriter-h1');
  if (!h1) return;

  const lines = h1.querySelectorAll('.tw-line');
  const cursor = h1.querySelector('.tw-cursor');
  if (!lines.length) return;

  // If text already populated, do smooth reveal without blank flash
  const startDelay = 500;
  const charSpeed = 45;
  const linePause = 350;

  function typeLine(lineEl, callback) {
    const text = lineEl.getAttribute('data-text') || lineEl.textContent || '';
    lineEl.textContent = '';
    let i = 0;

    function typeChar() {
      if (i < text.length) {
        lineEl.textContent += text.charAt(i);
        i++;
        setTimeout(typeChar, charSpeed);
      } else if (callback) {
        setTimeout(callback, linePause);
      }
    }
    typeChar();
  }

  function typeAllLines(index) {
    if (index >= lines.length) {
      if (cursor) cursor.classList.add('tw-done');
      return;
    }
    typeLine(lines[index], () => typeAllLines(index + 1));
  }

  // Only run typewriter if screen is wider than mobile to prevent jumping
  if (window.innerWidth > 768) {
    setTimeout(() => typeAllLines(0), startDelay);
  } else if (cursor) {
    cursor.style.display = 'none';
  }
}

/* ─────────── 1. SCROLL REVEALS & STAT COUNTERS ─────────── */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

function initStatCounters() {
  const statBoxes = document.querySelectorAll('.stat-box');
  if (!statBoxes.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const valEl = entry.target.querySelector('.stat-val');
        if (valEl && valEl.dataset.count) {
          const target = parseInt(valEl.dataset.count, 10);
          animateCount(valEl, target);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  statBoxes.forEach(box => observer.observe(box));

  function animateCount(el, target) {
    const duration = 1600;
    const start = 0;
    const startTime = performance.now();
    const originalText = el.textContent;

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(start + (target - start) * ease);

      if (originalText.startsWith('+')) {
        el.textContent = '+' + current;
      } else if (originalText.endsWith('%')) {
        el.textContent = current + '%';
      } else if (originalText.endsWith('min')) {
        el.textContent = current + ' min';
      } else {
        el.textContent = current;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = originalText;
      }
    }

    requestAnimationFrame(update);
  }
}

/* ─────────── 2. HERO 3D TILT ON MOUSE ─────────── */
function initHeroTilt() {
  const screen = document.getElementById('hero-tilt');
  if (!screen) return;

  const wrap = screen.closest('.hero-screen-wrap');
  if (!wrap) return;

  let ticking = false;

  wrap.addEventListener('mousemove', (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const rect = wrap.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        screen.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
        ticking = false;
      });
      ticking = true;
    }
  });

  wrap.addEventListener('mouseleave', () => {
    screen.style.transform = 'rotateX(2.5deg)';
    screen.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
  });

  wrap.addEventListener('mouseenter', () => {
    screen.style.transition = 'transform 0.1s ease-out';
  });
}

/* ─────────── 3. BENTO MOUSE-TRACKING SPOTLIGHT ─────────── */
function initBentoGlow() {
  const items = document.querySelectorAll('.bento-item');
  items.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty('--mouse-x', x + 'px');
      item.style.setProperty('--mouse-y', y + 'px');
    });
  });
}

/* ─────────── 4. MODULE TABS & VIEW SWITCHERS ─────────── */
function initTabs() {
  const btns = document.querySelectorAll('.tab-btn');
  const panes = document.querySelectorAll('.tab-pane');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      panes.forEach(p => {
        p.classList.remove('active');
        if (p.id === targetId) p.classList.add('active');
      });
    });
  });

  // Dual View Switcher (Multi-Boutiques Software vs 3D Network)
  document.querySelectorAll('.mvs-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const view = btn.getAttribute('data-view');
      const parent = btn.closest('.mod-dual-img');
      if (!parent) return;

      parent.querySelectorAll('.mvs-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      parent.querySelectorAll('.mvs-panel').forEach(p => p.classList.remove('active'));
      const target = parent.querySelector(`#mvs-${view}`);
      if (target) target.classList.add('active');
    });
  });
}

/* ─────────── 5. FAQ ACCORDION ─────────── */
function initFaq() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      items.forEach(other => {
        other.classList.remove('active');
        const a = other.querySelector('.faq-a');
        if (a) a.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 32 + 'px';
      }
    });
  });
}

/* ─────────── 6. INTERACTIVE ROI CALCULATOR WITH PRESETS & ANIMATIONS ─────────── */
function initCalculator() {
  const typeSelect = document.getElementById('calc-type');
  const salesRange = document.getElementById('calc-sales');
  const salesVal = document.getElementById('calc-sales-val');
  const resRev = document.getElementById('res-rev');
  const resHours = document.getElementById('res-hours');
  const resErrors = document.getElementById('res-errors');
  const resAnnual = document.getElementById('res-annual');
  const chips = document.querySelectorAll('.calc-chip');

  if (!typeSelect || !salesRange) return;

  const configs = {
    'quincaillerie': { basket: 35000, leak: 0.035, stockPct: 60, creditPct: 25, errorPct: 15 },
    'alimentation': { basket: 8000, leak: 0.04, stockPct: 50, creditPct: 35, errorPct: 15 },
    'boutique_mode': { basket: 18000, leak: 0.03, stockPct: 55, creditPct: 30, errorPct: 15 },
    'grossiste': { basket: 250000, leak: 0.02, stockPct: 40, creditPct: 45, errorPct: 15 },
    'pieces_auto': { basket: 45000, leak: 0.035, stockPct: 65, creditPct: 20, errorPct: 15 }
  };

  let currentMonthly = 1653750;
  let currentAnnual = 19845000;

  function update(animate = false) {
    const sales = parseInt(salesRange.value, 10);
    const sectorKey = typeSelect.value;
    const cfg = configs[sectorKey] || configs['quincaillerie'];

    if (salesVal) salesVal.textContent = sales + ' ventes / jour';

    const hours = Math.min(22, Math.max(8, Math.round(sales * 0.25 + 5)));
    const targetMonthly = Math.round(sales * cfg.basket * 30 * cfg.leak);
    const targetAnnual = targetMonthly * 12;

    if (resHours) resHours.textContent = hours + ' h / sem.';
    if (resErrors) resErrors.textContent = '99.8%';

    if (animate) {
      tweenNumber(resRev, currentMonthly, targetMonthly, ' FCFA');
      tweenNumber(resAnnual, currentAnnual, targetAnnual, ' FCFA');
    } else {
      if (resRev) resRev.textContent = fmt(targetMonthly) + ' FCFA';
      if (resAnnual) resAnnual.textContent = fmt(targetAnnual) + ' FCFA';
    }

    currentMonthly = targetMonthly;
    currentAnnual = targetAnnual;

    // Update progress bar breakdown if present
    const barStock = document.querySelector('.calc-bar-stock');
    const barCredit = document.querySelector('.calc-bar-credit');
    const barErrors = document.querySelector('.calc-bar-errors');
    if (barStock && barCredit && barErrors) {
      barStock.style.width = cfg.stockPct + '%';
      barCredit.style.width = cfg.creditPct + '%';
      barErrors.style.width = cfg.errorPct + '%';
    }
  }

  function tweenNumber(el, fromVal, toVal, suffix = '') {
    if (!el) return;
    const duration = 400;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(fromVal + (toVal - fromVal) * ease);
      el.textContent = fmt(val) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = fmt(toVal) + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  function fmt(n) {
    return new Intl.NumberFormat('fr-FR').format(n);
  }

  // Chip buttons interaction
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const val = chip.getAttribute('data-type');
      if (val && typeSelect) {
        typeSelect.value = val;
        update(true);
      }
    });
  });

  typeSelect.addEventListener('change', () => {
    const val = typeSelect.value;
    chips.forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-type') === val);
    });
    update(true);
  });

  salesRange.addEventListener('input', () => update(false));
  salesRange.addEventListener('change', () => update(true));

  update(false);
}

/* ─────────── 7. MODALS ─────────── */
function initModals() {
  const installModal = document.getElementById('modal-install');
  const demoModal = document.getElementById('modal-demo');

  document.querySelectorAll('.js-open-install').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (installModal) openM(installModal);
    });
  });

  document.querySelectorAll('.js-open-demo').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (demoModal) openM(demoModal);
    });
  });

  document.querySelectorAll('.js-close-modal, .modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const m = btn.closest('.modal-overlay');
      if (m) closeM(m);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', (e) => { if (e.target === m) closeM(m); });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => closeM(m));
      const lb = document.getElementById('lightbox');
      if (lb && lb.classList.contains('open')) {
        lb.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  function openM(el) {
    el.style.display = 'flex';
    requestAnimationFrame(() => el.classList.add('open'));
    document.body.style.overflow = 'hidden';
  }

  function closeM(el) {
    el.classList.remove('open');
    setTimeout(() => { el.style.display = 'none'; document.body.style.overflow = ''; }, 200);
  }
}

/* ─────────── 8. FULLSCREEN LIGHTBOX ─────────── */
function initLightbox() {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCap = document.getElementById('lightbox-cap');
  const lbClose = document.getElementById('lightbox-close');

  if (!lb || !lbImg) return;

  document.querySelectorAll('.js-zoomable').forEach(el => {
    el.addEventListener('click', (e) => {
      let targetImg = el;
      if (el.tagName.toLowerCase() !== 'img') {
        targetImg = el.querySelector('img');
      }
      if (!targetImg || !targetImg.src) return;

      lbImg.src = targetImg.src;
      const title = el.getAttribute('data-title') || targetImg.alt || el.getAttribute('title') || 'Aperçu MalCom Pro';
      if (lbCap) lbCap.textContent = title;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lbClose) {
    lbClose.addEventListener('click', () => {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  lb.addEventListener('click', (e) => {
    if (e.target === lb) {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ─────────── 9. DIRECT WHATSAPP LEAD DISPATCH ─────────── */
function initForms() {
  document.querySelectorAll('.js-quick-install-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const get = (n) => { const el = form.querySelector(`[name="${n}"]`); return el ? el.value.trim() : ''; };
      const name = get('client_name');
      const phone = get('client_phone');
      const shop = get('shop_type');
      const city = get('client_city') || 'Bamako';

      if (!name || !phone) {
        alert('Veuillez renseigner votre nom et votre numéro WhatsApp.');
        return;
      }

      const msg = `Bonjour AMD-Service,%0A%0AJe souhaite planifier l'installation du logiciel *MalCom* pour mon commerce :%0A- *Nom* : ${encodeURIComponent(name)}%0A- *WhatsApp* : ${encodeURIComponent(phone)}%0A- *Type de commerce* : ${encodeURIComponent(shop || 'Commerce général')}%0A- *Localisation* : ${encodeURIComponent(city)}%0A%0AMerci de me contacter pour convenir d'un rendez-vous.`;
      window.open(`https://wa.me/22382200766?text=${msg}`, '_blank');

      form.reset();
      const modal = form.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('open');
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  });
}

/* ─────────── 10. MOBILE MENU OVERLAY ─────────── */
function initMobileMenu() {
  const btn = document.querySelector('.mobile-toggle');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isVisible = links.classList.contains('mobile-open');
    if (isVisible) {
      links.classList.remove('mobile-open');
      links.style.display = 'none';
    } else {
      links.classList.add('mobile-open');
      links.style.display = 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '68px';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = 'rgba(13, 11, 26, 0.96)';
      links.style.backdropFilter = 'blur(20px)';
      links.style.padding = '24px 28px';
      links.style.borderBottom = '1px solid var(--border)';
      links.style.boxShadow = '0 25px 60px rgba(0,0,0,0.8)';
      links.style.gap = '18px';
      links.style.zIndex = '100';
    }
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        links.classList.remove('mobile-open');
        links.style.display = 'none';
      }
    });
  });
}

/* ─────────── 11. ACTIVE NAV ON SCROLL ─────────── */
function initScrollNav() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const top = sec.offsetTop - 130;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) current = id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  }, { passive: true });
}
