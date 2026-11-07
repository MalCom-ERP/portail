/* ─────────────────────────────────────────────────────────────
   MALCOM PRO — JAVASCRIPT HAUTE PERFORMANCE
   Smooth Reveals, Tabs, FAQ Accordion, Realtime ROI Calculator,
   Modals, Fullscreen Lightbox, WhatsApp Lead Generation
   ───────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
  initTabs();
  initFaq();
  initCalculator();
  initModals();
  initLightbox();
  initForms();
  initMobileMenu();
  initScrollNav();
});

/* ─────────── 1. SCROLL REVEALS ─────────── */
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

/* ─────────── 2. INTERACTIVE MODULE TABS ─────────── */
function initTabs() {
  const btns = document.querySelectorAll('.tab-btn');
  const panes = document.querySelectorAll('.tab-pane');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      if (!target) return;

      btns.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePane = document.getElementById('tab-' + target);
      if (activePane) activePane.classList.add('active');
    });
  });

  // Dual view switcher for multi-boutique
  document.querySelectorAll('.mvs-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.mod-dual-img');
      if (!parent) return;

      parent.querySelectorAll('.mvs-btn').forEach(b => b.classList.remove('active'));
      parent.querySelectorAll('.mvs-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const view = btn.dataset.view;
      const targetPanel = parent.querySelector('#mvs-' + view);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

/* ─────────── 3. FAQ ACCORDION ─────────── */
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

/* ─────────── 4. INTERACTIVE ROI CALCULATOR ─────────── */
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

    const barStock = document.querySelector('.calc-bar-stock');
    const barCredit = document.querySelector('.calc-bar-credit');
    const barErrors = document.querySelector('.calc-bar-errors');
    if (barStock && barCredit && barErrors) {
      barStock.textContent = cfg.stockPct + '% Stock';
      barCredit.textContent = cfg.creditPct + '% Crédits';
      barErrors.textContent = cfg.errorPct + '% Erreurs';
    }
  }

  function tweenNumber(el, fromVal, toVal, suffix = '') {
    if (!el) return;
    const duration = 350;
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

/* ─────────── 5. MODALS (INSTALL & DEMO) ─────────── */
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

/* ─────────── 6. FULLSCREEN LIGHTBOX ─────────── */
function initLightbox() {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCap = document.getElementById('lightbox-cap');
  const lbClose = document.getElementById('lightbox-close');

  if (!lb || !lbImg) return;

  document.querySelectorAll('.js-zoomable').forEach(el => {
    el.addEventListener('click', () => {
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

/* ─────────── 7. DIRECT WHATSAPP LEAD DISPATCH ─────────── */
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

/* ─────────── 8. MOBILE MENU ─────────── */
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
      links.style.top = '72px';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = 'rgba(10, 13, 24, 0.98)';
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

/* ─────────── 9. ACTIVE NAV ON SCROLL ─────────── */
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
