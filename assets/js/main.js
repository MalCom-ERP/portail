/* ─────────────────────────────────────────────────────────────
   MALCOM VITRINE V3 — JAVASCRIPT
   Scroll reveals, 3D tilt, mouse glow, tabs, FAQ, calculator,
   modals, lightbox, forms, mobile menu
   ───────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
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

  // Wait for the reveal animation to complete before typing
  const startDelay = 800;
  const charSpeed = 55;
  const linePause = 400;

  function typeLine(lineEl, callback) {
    const text = lineEl.getAttribute('data-text') || '';
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
      // Typing done — fade out cursor
      if (cursor) cursor.classList.add('tw-done');
      return;
    }
    typeLine(lines[index], () => typeAllLines(index + 1));
  }

  setTimeout(() => typeAllLines(0), startDelay);
}

/* ─────────── 1. SCROLL REVEAL ANIMATIONS ─────────── */
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
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ─────────── 2. HERO 3D TILT ON MOUSE ─────────── */
function initHeroTilt() {
  const screen = document.getElementById('hero-tilt');
  if (!screen) return;

  const wrap = screen.closest('.hero-screen-wrap');
  if (!wrap) return;

  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    screen.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
  });

  wrap.addEventListener('mouseleave', () => {
    screen.style.transform = 'rotateX(2deg)';
    screen.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
  });

  wrap.addEventListener('mouseenter', () => {
    screen.style.transition = 'transform 0.08s ease-out';
  });
}

/* ─────────── 3. BENTO MOUSE-TRACKING GLOW ─────────── */
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

/* ─────────── 4. MODULE TABS ─────────── */
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
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
      }
    });
  });
}

/* ─────────── 6. ROI CALCULATOR ─────────── */
function initCalculator() {
  const typeSelect = document.getElementById('calc-type');
  const salesRange = document.getElementById('calc-sales');
  const salesVal = document.getElementById('calc-sales-val');
  const resRev = document.getElementById('res-rev');
  const resHours = document.getElementById('res-hours');
  const resErrors = document.getElementById('res-errors');
  const resAnnual = document.getElementById('res-annual');

  if (!typeSelect || !salesRange) return;

  const configs = {
    'quincaillerie': { basket: 35000, leak: 0.035 },
    'alimentation': { basket: 8000, leak: 0.04 },
    'boutique_mode': { basket: 18000, leak: 0.03 },
    'grossiste': { basket: 250000, leak: 0.02 },
    'pieces_auto': { basket: 45000, leak: 0.035 }
  };

  function update() {
    const sales = parseInt(salesRange.value, 10);
    const cfg = configs[typeSelect.value] || configs['quincaillerie'];

    if (salesVal) salesVal.textContent = sales + ' ventes / jour';

    const hours = Math.min(22, Math.max(8, Math.round(sales * 0.25 + 5)));
    const monthly = Math.round(sales * cfg.basket * 30 * cfg.leak);
    const annual = monthly * 12;

    if (resHours) resHours.textContent = hours + ' h / sem.';
    if (resRev) resRev.textContent = fmt(monthly) + ' FCFA';
    if (resErrors) resErrors.textContent = '99.8%';
    if (resAnnual) resAnnual.textContent = fmt(annual) + ' FCFA';
  }

  function fmt(n) { return new Intl.NumberFormat('fr-FR').format(n); }

  salesRange.addEventListener('input', update);
  typeSelect.addEventListener('change', update);
  update();
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

/* ─────────── 8. LIGHTBOX ─────────── */
function initLightbox() {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCap = document.getElementById('lightbox-cap');
  const lbClose = document.getElementById('lightbox-close');

  if (!lb || !lbImg) return;

  document.querySelectorAll('.js-zoomable').forEach(img => {
    img.addEventListener('click', () => {
      lbImg.src = img.src;
      if (lbCap) lbCap.textContent = img.alt || 'Apercu MalCom';
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

/* ─────────── 9. FORM HANDLER ─────────── */
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
        alert('Veuillez renseigner votre nom et votre numero de telephone.');
        return;
      }

      const msg = `Bonjour AMD-Service,%0A%0AJe souhaite demander l'installation du logiciel *MalCom* pour mon commerce :%0A- *Nom* : ${encodeURIComponent(name)}%0A- *Telephone* : ${encodeURIComponent(phone)}%0A- *Type d'activite* : ${encodeURIComponent(shop || 'Commerce general')}%0A- *Localisation* : ${encodeURIComponent(city)}%0A%0AMerci de me recontacter pour planifier l'installation.`;
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

/* ─────────── 10. MOBILE MENU ─────────── */
function initMobileMenu() {
  const btn = document.querySelector('.mobile-toggle');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const vis = links.style.display === 'flex';
    if (vis) {
      links.style.display = 'none';
    } else {
      links.style.display = 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '60px';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = 'var(--bg-card)';
      links.style.padding = '20px 28px';
      links.style.borderBottom = '1px solid var(--border)';
      links.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)';
      links.style.gap = '16px';
      links.style.zIndex = '100';
    }
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 768) links.style.display = 'none';
    });
  });
}

/* ─────────── 11. SCROLL ACTIVE NAV ─────────── */
function initScrollNav() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollY > top && scrollY <= top + height) current = id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  });
}
