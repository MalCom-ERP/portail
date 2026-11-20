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
  initDynamicDownloads();
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

  const syncActiveHeights = () => {
    items.forEach(item => {
      const answer = item.querySelector('.faq-a');
      if (!answer) return;
      if (item.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 32 + 'px';
      } else {
        answer.style.maxHeight = null;
      }
    });
  };

  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;

    btn.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      items.forEach(other => {
        other.classList.remove('active');
        const ob = other.querySelector('.faq-q');
        if (ob) ob.setAttribute('aria-expanded', 'false');
        const a = other.querySelector('.faq-a');
        if (a) a.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 32 + 'px';
      }
    });
  });

  syncActiveHeights();
  window.addEventListener('resize', syncActiveHeights, { passive: true });
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
      refreshLatestDownloads();
    });
  });

  // Switch between Standalone and Cloud editions inside the Demo/Download modal
  document.querySelectorAll('.js-dl-edition-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const edition = btn.getAttribute('data-edition');
      document.querySelectorAll('.js-dl-edition-btn').forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.style.background = isActive ? 'var(--brand)' : 'transparent';
        b.style.color = isActive ? '#fff' : 'var(--text-muted)';
      });
      const standalonePanel = document.getElementById('dl-panel-standalone');
      const cloudPanel = document.getElementById('dl-panel-cloud');
      if (standalonePanel && cloudPanel) {
        standalonePanel.style.display = edition === 'standalone' ? 'block' : 'none';
        cloudPanel.style.display = edition === 'cloud' ? 'block' : 'none';
      }
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

/* ─────────── 8. RESPONSIVE NAVIGATION & POPOVER MENU ─────────── */
function initMobileMenu() {
  const nav = document.querySelector('.nav');
  const inner = document.querySelector('.nav-inner');
  const btn = document.querySelector('.mobile-toggle');
  const menu = document.getElementById('site-menu') || document.querySelector('.nav-links');
  if (!nav || !inner || !btn || !menu) return;

  // MANDATORY: Feature detect 'popover' on HTMLElement.prototype before loading polyfill.
  if (!Object.hasOwn(HTMLElement.prototype, 'popover')) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@oddbird/popover-polyfill@latest/dist/popover.min.js';
    script.async = true;
    document.head.appendChild(script);
  }

  let lastCollapsedWidth = 0;

  const isMenuOpen = () => {
    try {
      return menu.matches(':popover-open') || menu.classList.contains(':popover-open') || menu.classList.contains('mobile-open');
    } catch (_) {
      return menu.classList.contains(':popover-open') || menu.classList.contains('mobile-open');
    }
  };

  const closeMenu = () => {
    if (typeof menu.hidePopover === 'function' && menu.hasAttribute('popover')) {
      try { menu.hidePopover(); } catch (_) { /* ignore */ }
    }
    menu.classList.remove('mobile-open');
    btn.setAttribute('aria-expanded', 'false');
  };

  const syncLayout = () => {
    const currentWidth = inner.clientWidth;
    const currentlyWide = nav.classList.contains('is-wide');
    if (!currentlyWide && currentWidth <= lastCollapsedWidth && lastCollapsedWidth > 0) {
      return;
    }

    const wasOpen = !currentlyWide && isMenuOpen();

    nav.classList.add('is-measuring');
    nav.classList.add('is-wide');
    menu.removeAttribute('popover');

    const fitsInline = inner.scrollWidth <= inner.clientWidth + 1 && window.innerWidth > 960;

    if (fitsInline) {
      nav.classList.add('is-wide');
      menu.removeAttribute('popover');
      menu.classList.remove('mobile-open');
      btn.setAttribute('aria-expanded', 'false');
      lastCollapsedWidth = 0;
    } else {
      nav.classList.remove('is-wide');
      menu.setAttribute('popover', 'auto');
      lastCollapsedWidth = currentWidth;
      if (wasOpen) {
        if (typeof menu.showPopover === 'function') {
          try { menu.showPopover(); } catch (_) { menu.classList.add('mobile-open'); }
        } else {
          menu.classList.add('mobile-open');
        }
        btn.setAttribute('aria-expanded', 'true');
      }
    }

    requestAnimationFrame(() => nav.classList.remove('is-measuring'));
  };

  menu.addEventListener('toggle', (e) => {
    const open = e.newState === 'open';
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Fallback toggle if browser does not yet have native popover or polyfill loaded
  btn.addEventListener('click', () => {
    if (!Object.hasOwn(HTMLElement.prototype, 'popover') && typeof menu.showPopover !== 'function') {
      const open = menu.classList.toggle('mobile-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (!nav.classList.contains('is-wide')) {
        closeMenu();
      }
    });
  });

  if (typeof ResizeObserver === 'function') {
    const ro = new ResizeObserver(() => syncLayout());
    ro.observe(inner);
    ro.observe(menu);
  } else {
    window.addEventListener('resize', syncLayout, { passive: true });
  }

  syncLayout();
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
      const isCurrent = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', isCurrent);
      if (isCurrent) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }, { passive: true });
}

/* ─────────── 10. DYNAMIC SERVER DOWNLOADS ─────────── */
const UPDATES_API_BASE = 'https://admin.malcom-lgc.com/api/app-updates';
const DOWNLOAD_EDITIONS = ['pro', 'cloud'];
const DOWNLOAD_PLATFORMS = ['windows', 'macos-arm64', 'macos-intel'];
const CATALOG_REFRESH_TTL_MS = 15000;

let activeCatalogPromise = null;
let lastCatalogFetchAt = 0;
let lastCatalogSucceeded = false;

function initDynamicDownloads() {
  document.querySelectorAll('a.dl-option[data-dl-edition]').forEach(el => {
    el.addEventListener('click', (e) => {
      if (el.dataset.unavailable === 'true') {
        e.preventDefault();
      }
    });
  });

  refreshLatestDownloads(true);
}

function compareSemver(a, b) {
  const splitVer = (v) => {
    const clean = String(v || '').trim().replace(/^v/i, '');
    const dashIdx = clean.indexOf('-');
    if (dashIdx === -1) return { core: clean, pre: '' };
    return { core: clean.slice(0, dashIdx), pre: clean.slice(dashIdx + 1) };
  };

  const va = splitVer(a);
  const vb = splitVer(b);
  const pa = va.core.split('.').map(n => parseInt(n, 10) || 0);
  const pb = vb.core.split('.').map(n => parseInt(n, 10) || 0);
  const maxLen = Math.max(pa.length, pb.length);

  for (let i = 0; i < maxLen; i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na !== nb) return na > nb ? 1 : -1;
  }

  if (!va.pre && !vb.pre) return 0;
  if (!va.pre) return 1;
  if (!vb.pre) return -1;

  const preA = va.pre.split('.');
  const preB = vb.pre.split('.');
  const maxPre = Math.max(preA.length, preB.length);
  for (let i = 0; i < maxPre; i++) {
    const ta = preA[i];
    const tb = preB[i];
    if (ta === undefined) return -1;
    if (tb === undefined) return 1;
    const isNumA = /^\d+$/.test(ta);
    const isNumB = /^\d+$/.test(tb);
    if (isNumA && isNumB) {
      const diff = Number(ta) - Number(tb);
      if (diff !== 0) return diff > 0 ? 1 : -1;
    } else if (ta !== tb) {
      return ta > tb ? 1 : -1;
    }
  }
  return 0;
}

function formatFileSize(bytes) {
  const num = Number(bytes);
  if (!Number.isFinite(num) || num <= 0) return '';
  if (num >= 1024 * 1024) {
    return (num / (1024 * 1024)).toFixed(1).replace('.', ',') + ' Mo';
  }
  if (num >= 1024) {
    return Math.round(num / 1024) + ' Ko';
  }
  return Math.round(num) + ' o';
}

async function fetchCatalogViaCheckFallback() {
  const queries = [];
  DOWNLOAD_EDITIONS.forEach(edition => {
    DOWNLOAD_PLATFORMS.forEach(platform => {
      queries.push({ edition, platform });
    });
  });

  const results = await Promise.all(
    queries.map(async ({ edition, platform }) => {
      try {
        const url = `${UPDATES_API_BASE}/check?current_version=0.0.0&edition=${encodeURIComponent(edition)}&platform=${encodeURIComponent(platform)}`;
        const resp = await fetch(url, {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });
        if (!resp.ok) return { edition, platform, ok: false, data: null };
        const data = await resp.json();
        return { edition, platform, ok: true, data };
      } catch (_) {
        return { edition, platform, ok: false, data: null };
      }
    })
  );

  const anySucceeded = results.some(r => r.ok && r.data && typeof r.data === 'object');
  if (!anySucceeded) {
    throw new Error('Impossible de joindre /api/app-updates/check');
  }

  let downloadsDirFound = false;
  let globalLatest = null;
  const editions = {};

  DOWNLOAD_EDITIONS.forEach(edition => {
    editions[edition] = { latest_version: null, platforms: {} };
  });

  results.forEach(({ edition, platform, ok, data }) => {
    if (ok && data && data.downloads_dir_found === true) {
      downloadsDirFound = true;
    }

    const available = !!(
      ok &&
      data &&
      data.filename &&
      data.latest_version &&
      data.latest_version !== '0.0.0'
    );

    if (available) {
      const filename = String(data.filename);
      const encoded = encodeURIComponent(filename);
      const ext = filename.includes('.')
        ? filename.split('.').pop().toLowerCase()
        : (platform === 'windows' ? 'exe' : 'dmg');

      editions[edition].platforms[platform] = {
        available: true,
        version: data.latest_version,
        edition,
        platform,
        filename,
        extension: ext,
        file_size: data.file_size || 0,
        updated_at: data.updated_at || null,
        relative_url: '/downloads/' + encoded,
        direct_url: data.direct_url || ('https://malcom-lgc.com/downloads/' + encoded),
        download_url: data.download_url || null,
        latest_redirect_url: `${UPDATES_API_BASE}/latest-download/${edition}/${platform}`,
      };

      if (!editions[edition].latest_version || compareSemver(data.latest_version, editions[edition].latest_version) > 0) {
        editions[edition].latest_version = data.latest_version;
      }
      if (!globalLatest || compareSemver(data.latest_version, globalLatest) > 0) {
        globalLatest = data.latest_version;
      }
    } else {
      editions[edition].platforms[platform] = {
        available: false,
        version: null,
        edition,
        platform,
        filename: null,
        extension: null,
        file_size: 0,
        updated_at: null,
        relative_url: null,
        direct_url: null,
        download_url: null,
        latest_redirect_url: `${UPDATES_API_BASE}/latest-download/${edition}/${platform}`,
      };
    }
  });

  return {
    downloads_dir_found: downloadsDirFound,
    latest_version: globalLatest,
    checked_at: new Date().toISOString(),
    editions,
  };
}

async function fetchLatestCatalog() {
  if (typeof fetch !== 'function') {
    throw new Error('fetch API unavailable');
  }

  try {
    const resp = await fetch(`${UPDATES_API_BASE}/latest`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data && typeof data === 'object' && data.editions) {
        return data;
      }
    }
  } catch (_) {
    // Fallback to /check if /latest is unreachable or not yet deployed
  }

  return fetchCatalogViaCheckFallback();
}

function refreshLatestDownloads(force = false) {
  if (activeCatalogPromise) {
    return activeCatalogPromise;
  }

  if (!force && lastCatalogSucceeded && (Date.now() - lastCatalogFetchAt) < CATALOG_REFRESH_TTL_MS) {
    return Promise.resolve(null);
  }

  activeCatalogPromise = (async () => {
    try {
      const catalog = await fetchLatestCatalog();
      applyDownloadCatalog(catalog);
      lastCatalogSucceeded = true;
      lastCatalogFetchAt = Date.now();
      return catalog;
    } catch (err) {
      lastCatalogSucceeded = false;
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('[MalCom Vitrine] Mise à jour dynamique des liens ignorée :', err && err.message ? err.message : err);
      }
      return null;
    } finally {
      activeCatalogPromise = null;
    }
  })();

  return activeCatalogPromise;
}

function applyDownloadCatalog(catalog) {
  if (!catalog || typeof catalog !== 'object') return;

  const host = (typeof window !== 'undefined' && window.location && window.location.hostname)
    ? window.location.hostname
    : '';
  const isVitrineHost = host === 'malcom-lgc.com' || host === 'www.malcom-lgc.com';

  if (catalog.latest_version) {
    document.querySelectorAll('.js-latest-version').forEach(el => {
      el.textContent = 'v' + catalog.latest_version;
    });
    document.querySelectorAll('.js-topbar-version').forEach(el => {
      el.textContent = 'Version ' + catalog.latest_version + ' Pro';
    });
    document.querySelectorAll('.js-dl-wa-help').forEach(el => {
      el.setAttribute(
        'href',
        'https://wa.me/22382200766?text=' + encodeURIComponent(`Bonjour AMD-Service, j'ai telecharge MalCom v${catalog.latest_version} et je souhaite une assistance`)
      );
    });
  }

  document.querySelectorAll('a.dl-option[data-dl-edition][data-dl-platform]').forEach(el => {
    const edition = el.getAttribute('data-dl-edition');
    const platform = el.getAttribute('data-dl-platform');
    const editionData = catalog.editions && catalog.editions[edition];
    const item = editionData && editionData.platforms ? editionData.platforms[platform] : null;
    const descEl = el.querySelector('.js-dl-desc');
    const btnLabelEl = el.querySelector('.js-dl-btn-label');
    const osLabel = (descEl && descEl.getAttribute('data-os-label')) || '';
    const prefixBase = platform === 'windows' ? 'Installateur' : 'Package';

    if (item && item.available && item.filename) {
      const resolvedUrl = isVitrineHost
        ? (item.relative_url || ('/downloads/' + encodeURIComponent(item.filename)))
        : (item.direct_url || item.download_url || el.getAttribute('href'));

      if (resolvedUrl) {
        el.setAttribute('href', resolvedUrl);
      }

      if (isVitrineHost) {
        el.setAttribute('download', item.filename);
      } else {
        el.removeAttribute('download');
      }

      const rawExt = item.extension || (item.filename.includes('.') ? item.filename.split('.').pop() : (platform === 'windows' ? 'exe' : 'dmg'));
      const ext = String(rawExt).toLowerCase().replace(/^\./, '');

      if (btnLabelEl) {
        btnLabelEl.textContent = 'Télécharger .' + ext;
      }

      if (descEl) {
        const sizeLabel = formatFileSize(item.file_size);
        const verPart = item.version ? 'v' + item.version : 'dernière version';
        const metaText = '(' + verPart + (sizeLabel ? ' • ' + sizeLabel : '') + ')';
        descEl.textContent = prefixBase + ' .' + ext + ' • ' + (osLabel ? osLabel + ' ' : '') + metaText;
      }

      el.classList.remove('dl-option--unavailable');
      el.removeAttribute('aria-disabled');
      el.dataset.unavailable = 'false';
    } else if (catalog.downloads_dir_found === true && item && item.available === false) {
      el.classList.add('dl-option--unavailable');
      el.setAttribute('aria-disabled', 'true');
      el.dataset.unavailable = 'true';

      if (btnLabelEl) {
        btnLabelEl.textContent = 'Indisponible';
      }

      if (descEl) {
        const fallbackExt = platform === 'windows' ? 'exe' : 'dmg';
        descEl.textContent = prefixBase + ' .' + fallbackExt + ' • ' + (osLabel ? osLabel + ' ' : '') + '(non disponible actuellement)';
      }
    }
  });
}
