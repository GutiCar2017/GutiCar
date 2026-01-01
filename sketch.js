(() => {
  const LANGS = ['en', 'he', 'ar', 'ru'];
  const RTL_LANGS = new Set(['he', 'ar']);
  const DEFAULT_LANG = 'he';
  const WHATSAPP_NUMBER_E164 = '972546667767';

  function setHtmlLangDir(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGS.has(lang) ? 'rtl' : 'ltr';
  }

  function showOnlyLang(lang) {
    document.querySelectorAll('.en, .he, .ar, .ru').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.' + lang).forEach(el => el.classList.remove('hidden'));
  }

  function updateLangButtons(lang) {
    document.querySelectorAll('.language-selector button').forEach(btn => {
      const isActive = btn.textContent.trim().toLowerCase() === lang;
      btn.setAttribute('aria-pressed', String(isActive));
      if (isActive) {
        btn.classList.remove('bg-gray-200', 'text-gray-800');
        btn.classList.add('bg-primary', 'text-white');
      } else {
        btn.classList.add('bg-gray-200', 'text-gray-800');
        btn.classList.remove('bg-primary', 'text-white');
      }
    });
  }

  function getCurrentLang() {
    const saved = localStorage.getItem('lang');
    if (saved && LANGS.includes(saved)) return saved;

    // fallback: infer from visible elements
    if (![...document.querySelectorAll('.he')].some(el => el.classList.contains('hidden'))) return 'he';
    if (![...document.querySelectorAll('.en')].some(el => el.classList.contains('hidden'))) return 'en';
    if (![...document.querySelectorAll('.ar')].some(el => el.classList.contains('hidden'))) return 'ar';
    return 'ru';
  }

  // Expose for inline onclick in HTML
  window.changeLanguage = function changeLanguage(lang) {
    if (!LANGS.includes(lang)) return;
    localStorage.setItem('lang', lang);
    setHtmlLangDir(lang);
    showOnlyLang(lang);
    updateLangButtons(lang);

    // Refresh animations/icons after DOM changes
    if (window.AOS) setTimeout(() => AOS.refreshHard(), 50);
    if (window.feather) feather.replace();

    // If user is on a category route, re-render it so text matches language
    if (location.hash.startsWith('#/category/')) route();
  };

  /* ====== SPA Router + Category rendering ====== */

  const CATALOG = {
    HandWash: {
      title:    { he: 'שטיפה ידנית', en: 'Hand Wash', ar: 'غسيل يدوي', ru: 'Ручная мойка' },
      subtitle: { he: 'שטיפה עדינה לשמירה על צבע וברק', en: 'Gentle wash to protect paint & shine', ar: 'غسيل لطيف لحماية الطلاء', ru: 'Бережная мойка для защиты ЛКП' },
      items: [
        {
          src: 'assets/Hand Wash/floor-mats.jpg',
          title: { he: 'סבונים ייעודיים', en: 'Special Soaps', ar: 'منظفات مخصصة', ru: 'Специальные шампуни' },
          desc:  { he: 'מותאם לסוג הלכלוך ולגימור', en: 'Matched to dirt type and finish', ar: 'مناسب لنوع الأوساخ', ru: 'Подбор под тип загрязнения' },
          price: '₪10'
        },
      ]
    },

    CarDetailing: {
      title:    { he: 'דיטיילינג', en: 'Car Detailing', ar: 'تفصيل السيارة', ru: 'Детейлинг' },
      subtitle: { he: 'ניקוי פנים וחוץ ברמת פרטים', en: 'Deep interior/exterior detailing', ar: 'تنظيف عميق', ru: 'Глубокая уборка' },
      items: []
    },

    HeadlightRestoration: {
      title:    { he: 'שחזור פנסים', en: 'Headlight Restoration', ar: 'ترميم المصابيح', ru: 'Восстановление фар' },
      subtitle: { he: 'שיפור נראות ובטיחות', en: 'Improve visibility & safety', ar: 'تحسين الرؤية', ru: 'Лучше видимость и безопасность' },
      items: []
    },

    SeatWash: {
      title:    { he: 'ניקוי מושבים', en: 'Seat Wash & Deep Clean', ar: 'تنظيف المقاعد', ru: 'Чистка сидений' },
      subtitle: { he: 'הסרת כתמים וריחות', en: 'Remove stains and odors', ar: 'إزالة البقع والروائح', ru: 'Удаление пятен и запахов' },
      items: []
    },

    PaintRestoration: {
      title:    { he: 'שחזור צבע', en: 'Paint Restoration', ar: 'ترميم الطلاء', ru: 'Восстановление краски' },
      subtitle: { he: 'החזרת ברק והסרת סימנים', en: 'Restore shine and remove marks', ar: 'استعادة اللمعان', ru: 'Возврат блеска' },
      items: []
    },

    CarAccessories: {
      title:    { he: 'אביזרי רכב', en: 'Car Accessories', ar: 'اكسسوارات السيارات', ru: 'Автомобильные аксессуары' },
      subtitle: { he: 'מבחר אביזרים לשדרוג הרכב', en: 'Accessories to enhance your car', ar: 'مجموعة لتحسين سيارتك', ru: 'Аксессуары для вашего авто' },
      items: [
        {
          src: 'assets/Car Accessories/floor-mats.jpg',
          title: { he: 'שטיחונים', en: 'Floor Mats', ar: 'فرش الأرضية', ru: 'Коврики' },
          desc:  { he: 'סט 4 חלקים, קל לניקוי', en: '4-piece set, easy to clean', ar: 'مجموعة 4 قطع سهلة التنظيف', ru: 'Набор из 4, легко мыть' },
          price: '₪120'
        },
        {
          src: 'assets/Car Accessories/phone-holder.jpg',
          title: { he: 'מחזיק לטלפון', en: 'Phone Holder', ar: 'حامل هاتف', ru: 'Держатель телефона' },
          desc:  { he: 'מתכוונן ויציב', en: 'Adjustable & stable', ar: 'قابل للتعديل وثابت', ru: 'Регулируемый и устойчивый' },
          price: '₪60'
        },
        {
          src: 'assets/Car Accessories/seat-cover.jpg',
          title: { he: 'כיסויי מושבים', en: 'Seat Covers', ar: 'أغطية مقاعد', ru: 'Чехлы на сиденья' },
          desc:  { he: 'בד נושם, התקנה קלה', en: 'Breathable, easy install', ar: 'قماش قابل للتنفس، تركيب سهل', ru: 'Дышащая ткань, лёгкая установка' },
          price: '₪220'
        }
      ]
    },
  };

  function t(obj) {
    const lang = getCurrentLang();
    if (!obj || typeof obj !== 'object') return String(obj || '');
    return obj[lang] || obj.he || obj.en || obj.ar || obj.ru || '';
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function renderCategory(slug) {
    const data = CATALOG[slug];
    if (!data) {
      location.hash = '#/home';
      return;
    }

    document.querySelector('[data-route="home"]')?.classList.remove('active');
    document.querySelector('[data-route="category"]')?.classList.add('active');

    document.getElementById('catTitle').textContent = t(data.title);
    document.getElementById('catSubtitle').textContent = t(data.subtitle);

    const grid = document.getElementById('productGrid');
    const items = Array.isArray(data.items) ? data.items : [];

    grid.innerHTML = items.map(item => {
      const img = escapeHtml(item.src || '');
      const title = escapeHtml(t(item.title));
      const desc = escapeHtml(t(item.desc));
      const price = escapeHtml(item.price || '');

      return `
        <div class="product-card">
          <img src="${img}" alt="${title}">
          <div class="product-body">
            <div class="product-title">${title}</div>
            ${desc ? `<div class="product-desc">${desc}</div>` : ''}
            ${price ? `<div class="product-price">${price}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');

    if (window.AOS) setTimeout(() => AOS.refreshHard(), 50);
  }

  function showHome() {
    document.querySelector('[data-route="category"]')?.classList.remove('active');
    document.querySelector('[data-route="home"]')?.classList.add('active');
    if (window.AOS) setTimeout(() => AOS.refreshHard(), 50);
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

  /* ====== Mobile menu accessibility ====== */
  function setupMobileMenu() {
    const btn = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      const isHidden = menu.classList.toggle('hidden');
      const expanded = !isHidden;
      btn.setAttribute('aria-expanded', String(expanded));
      btn.setAttribute('aria-label', expanded ? 'Close menu' : 'Open menu');
    });

    // close menu when a link is clicked
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (!menu.classList.contains('hidden')) {
          menu.classList.add('hidden');
          btn.setAttribute('aria-expanded', 'false');
          btn.setAttribute('aria-label', 'Open menu');
        }
      });
    });
  }

  /* ====== “Low cost” contact form: send to WhatsApp ====== */
  function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const status = document.getElementById('formStatus');

    function setStatus(msg) {
      if (!status) return;
      status.textContent = msg;
      status.classList.remove('sr-only');
      setTimeout(() => status.classList.add('sr-only'), 4000);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (form.name?.value || '').trim();
      const email = (form.email?.value || '').trim();
      const phone = (form.phone?.value || '').trim();
      const message = (form.message?.value || '').trim();

      if (!name || !message) {
        setStatus(t({
          he: 'נא למלא שם והודעה.',
          en: 'Please fill in name and message.',
          ar: 'يرجى إدخال الاسم والرسالة.',
          ru: 'Пожалуйста, заполните имя и сообщение.'
        }));
        return;
      }

      const lines = [
        `Name: ${name}`,
        email ? `Email: ${email}` : null,
        phone ? `Phone: ${phone}` : null,
        `Message: ${message}`,
      ].filter(Boolean);

      const text = encodeURIComponent(lines.join('\n'));
      const url = `https://wa.me/${WHATSAPP_NUMBER_E164}?text=${text}`;

      setStatus(t({
        he: 'פותח WhatsApp לשליחה…',
        en: 'Opening WhatsApp to send…',
        ar: 'جارٍ فتح واتساب للإرسال…',
        ru: 'Открываю WhatsApp для отправки…'
      }));

      window.open(url, '_blank', 'noopener,noreferrer');
      form.reset();
    });
  }

  /* ====== Init ====== */
  document.addEventListener('DOMContentLoaded', () => {
    // Apply saved/default language
    const lang = localStorage.getItem('lang') || DEFAULT_LANG;
    window.changeLanguage(LANGS.includes(lang) ? lang : DEFAULT_LANG);

    setupMobileMenu();
    setupContactForm();

    // AOS + icons
    if (window.AOS) {
      AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    }
    if (window.feather) feather.replace();

    route();
  });

  window.addEventListener('hashchange', route);
})();
