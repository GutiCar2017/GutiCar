'use strict';

/* ---------- Helpers ---------- */
function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return [...root.querySelectorAll(sel)]; }

function setStatus(msg) {
  const el = qs('#formStatus');
  if (!el) return;
  el.classList.remove('sr-only');
  el.textContent = msg;
}

function currentLang() {
  // Based on which language spans are visible
  if (!qsa('.he').some(el => el.classList.contains('hidden'))) return 'he';
  if (!qsa('.en').some(el => el.classList.contains('hidden'))) return 'en';
  if (!qsa('.ar').some(el => el.classList.contains('hidden'))) return 'ar';
  return 'ru';
}

function t(objOrStr) {
  if (objOrStr && typeof objOrStr === 'object') {
    const lang = currentLang();
    return objOrStr[lang] || objOrStr.he || objOrStr.en || objOrStr.ar || objOrStr.ru || '';
  }
  return objOrStr || '';
}

function escapeHTML(str) {
  // Good security practice even for “static” data
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/* ---------- Catalog (category page data) ---------- */
const CATALOG = {
  HandWash: {
    title: { he: 'שטיפה ידנית', en: 'Hand Wash', ar: 'غسيل يدوي', ru: 'Ручная мойка' },
    subtitle: { he: 'שטיפה עדינה ומדויקת לשמירה על הצבע', en: 'Gentle wash that protects your paint', ar: 'غسيل لطيف يحمي الطلاء', ru: 'Деликатная мойка для защиты ЛКП' },
    items: [
      {
        src: 'assets/Hand Wash/floor-mats.jpg',
        title: { he: 'שמפו מקצועי', en: 'Professional shampoo', ar: 'شامبو احترافي', ru: 'Проф. шампунь' },
        desc: { he: 'ניקוי עדין ללא שריטות', en: 'Careful cleaning without scratches', ar: 'تنظيف دقيق بدون خدوش', ru: 'Аккуратно, без царапин' },
        price: '₪10'
      }
    ]
  },

  CarAccessories: {
    title: { he:'אביזרי רכב', en:'Car Accessories', ar:'اكسسوارات السيارات', ru:'Автомобильные аксессуары' },
    subtitle: { he:'מבחר אביזרים לשדרוג הרכב', en:'Accessories to enhance your car', ar:'مجموعة لتحسين سيارتك', ru:'Аксессуары для вашего авто' },
    items: [
      {
        src: 'assets/Car Accessories/floor-mats.jpg',
        title: { he:'שטיחונים', en:'Floor Mats', ar:'فرش الأرضية', ru:'Коврики' },
        desc:  { he:'סט 4 חלקים, קל לניקוי', en:'4-piece set, easy to clean', ar:'مجموعة 4 قطع سهلة التنظيف', ru:'Набор из 4, легко мыть' },
        price: '₪120'
      },
      {
        src: 'assets/Car Accessories/phone-holder.jpg',
        title: { he:'מחזיק לטלפון', en:'Phone Holder', ar:'حامل هاتف', ru:'Держатель телефона' },
        desc:  { he:'מתכוונן ויציב', en:'Adjustable & stable', ar:'قابل للتعديل وثابت', ru:'Регулируемый и устойчивый' },
        price: '₪60'
      },
      {
        src: 'assets/Car Accessories/seat-cover.jpg',
        title: { he:'כיסויי מושבים', en:'Seat Covers', ar:'أغطية مقاعد', ru:'Чехлы на сиденья' },
        desc:  { he:'בד נושם, התקנה קלה', en:'Breathable, easy install', ar:'قماش قابل للتنفس، تركيب سهل', ru:'Дышащая ткань, лёгкая установка' },
        price: '₪220'
      }
    ]
  }
};

/* ---------- Routing (SPA-like) ---------- */
function showHome() {
  qs('[data-route="category"]')?.classList.remove('active');
  qs('[data-route="home"]')?.classList.add('active');
  if (window.AOS) setTimeout(() => AOS.refreshHard(), 30);
}

function renderCategory(slug) {
  const data = CATALOG[slug];
  if (!data) {
    location.hash = '#/home';
    return;
  }

  qs('[data-route="home"]')?.classList.remove('active');
  qs('[data-route="category"]')?.classList.add('active');

  const titleEl = qs('#catTitle');
  const subEl = qs('#catSubtitle');
  const grid = qs('#productGrid');

  if (titleEl) titleEl.textContent = t(data.title);
  if (subEl) subEl.textContent = t(data.subtitle);

  if (grid) {
    grid.innerHTML = (data.items || []).map(item => {
      const img = escapeHTML(item.src || '');
      const ttl = escapeHTML(t(item.title));
      const desc = escapeHTML(t(item.desc));
      const price = item.price ? `<div class="product-price">${escapeHTML(item.price)}</div>` : '';

      return `
        <div class="product-card">
          <img src="${img}" alt="${ttl}">
          <div class="product-body">
            <div class="product-title">${ttl}</div>
            <div class="product-desc">${desc}</div>
            ${price}
          </div>
        </div>
      `;
    }).join('');
  }

  if (window.AOS) setTimeout(() => AOS.refreshHard(), 30);
}

function route() {
  const h = (location.hash || '#/home').replace('#/', '');
  if (h.startsWith('category/')) {
    const slug = h.split('/')[1];
    renderCategory(slug);
  } else {
    showHome();
  }
}

/* ---------- Language switching ---------- */
function changeLanguage(lang) {
  // Hide all language blocks
  qsa('.en, .he, .ar, .ru').forEach(el => el.classList.add('hidden'));
  // Show chosen language
  qsa('.' + lang).forEach(el => el.classList.remove('hidden'));

  // Update <html> lang + dir
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'he' || lang === 'ar') ? 'rtl' : 'ltr';

  // Update aria-pressed + button styling
  qsa('.language-selector button').forEach(btn => {
    const isActive = btn.textContent.trim().toUpperCase() === lang.toUpperCase();
    btn.setAttribute('aria-pressed', String(isActive));
    btn.classList.toggle('bg-primary', isActive);
    btn.classList.toggle('text-white', isActive);
    btn.classList.toggle('bg-gray-200', !isActive);
    btn.classList.toggle('text-gray-800', !isActive);
  });

  // If currently on category route, re-render category to update titles/descriptions
  if ((location.hash || '').startsWith('#/category/')) route();
}

// Expose for inline onclick in HTML
window.changeLanguage = changeLanguage;

/* ---------- Mobile menu (accessible toggle) ---------- */
function setupMobileMenu() {
  const btn = qs('#mobile-menu-button');
  const menu = qs('#mobile-menu');
  if (!btn || !menu) return;

  // Ensure ARIA attrs exist even if HTML didn’t include them
  btn.setAttribute('aria-controls', 'mobile-menu');
  btn.setAttribute('aria-expanded', 'false');

  function closeMenu() {
    menu.classList.add('hidden');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', () => {
    const willOpen = menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', String(willOpen));
  });

  // Close on link click (better UX on mobile)
  qsa('a', menu).forEach(a => a.addEventListener('click', closeMenu));

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ---------- Contact form → WhatsApp deep link ---------- */
function setupContactForm() {
  const form = qs('#contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = (qs('#name')?.value || '').trim();
    const phone = (qs('#phone')?.value || '').trim();
    const email = (qs('#email')?.value || '').trim();
    const message = (qs('#message')?.value || '').trim();
    const consent = qs('#whatsappConsent')?.checked;
    if (!consent) {
      setStatus(currentLang() === 'he'
        ? 'כדי לשלוח הודעה יש לאשר שליחה דרך WhatsApp.'
        : 'To send a message, please confirm WhatsApp sending.');
      qs('#whatsappConsent')?.focus();
      return;
}


    if (!name || !message) {
      setStatus(currentLang() === 'he'
        ? 'נא למלא שם והודעה לפני שליחה.'
        : 'Please fill in Name and Message before sending.');
      return;
    }

    // Build message text (data → URL encoding → HTTPS request)
    const composed =
      `Name: ${name}\n` +
      (phone ? `Phone: ${phone}\n` : '') +
      (email ? `Email: ${email}\n` : '') +
      `Message:\n${message}`;

    const to = '972546667767'; // business WhatsApp number (no +)
    const url = `https://wa.me/${to}?text=${encodeURIComponent(composed)}`;

    setStatus(currentLang() === 'he'
      ? 'פותח WhatsApp לשליחת ההודעה…'
      : 'Opening WhatsApp to send your message…');

    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // AOS + icons
  if (window.AOS) {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
  }
  if (window.feather) feather.replace();

  // Default language (matches your UI)
  changeLanguage('he');

  setupMobileMenu();
  setupContactForm();

  route();
});

window.addEventListener('hashchange', route);
