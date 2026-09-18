const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Header scroll state + scroll progress bar
const header = document.getElementById('siteHeader');
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + '%';
}, { passive: true });

// Mobile nav
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

/* ==========================================================
   Hero embers — a lightweight canvas particle drift, tying
   the "odun ateşi" (wood-fire) motif into the hero itself.
   ========================================================== */
(function heroEmbers() {
  const canvas = document.getElementById('emberCanvas');
  if (!canvas || prefersReducedMotion) return;
  const ctx = canvas.getContext('2d');
  const hero = canvas.closest('.hero');
  let w, h, particles, rafId;

  function resize() {
    w = canvas.width = hero.clientWidth;
    h = canvas.height = hero.clientHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * w,
      y: h + Math.random() * 60,
      r: 1 + Math.random() * 2.2,
      speed: 0.35 + Math.random() * 0.7,
      drift: (Math.random() - 0.5) * 0.6,
      flicker: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.5 ? '201,160,74' : '224,122,58'
    };
  }

  function init() {
    resize();
    const count = Math.max(18, Math.min(42, Math.floor(w / 28)));
    particles = Array.from({ length: count }, () => {
      const p = makeParticle();
      p.y = Math.random() * h; // stagger initial heights
      return p;
    });
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.y -= p.speed;
      p.x += p.drift + Math.sin(p.flicker) * 0.15;
      p.flicker += 0.05;
      if (p.y < -10) {
        Object.assign(p, makeParticle());
        p.y = h + 10;
      }
      const alpha = Math.min(1, (h - p.y) / h) * 0.8 * (0.5 + 0.5 * Math.sin(p.flicker));
      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.hue}, ${Math.max(0.08, alpha)})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    rafId = requestAnimationFrame(step);
  }

  init();
  step();
  window.addEventListener('resize', () => {
    cancelAnimationFrame(rafId);
    init();
    step();
  });
})();

/* Hero mosaic pattern parallax on mouse move */
(function heroParallax() {
  const hero = document.querySelector('.hero');
  const pattern = document.getElementById('heroPattern');
  if (!hero || !pattern || prefersReducedMotion) return;
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    pattern.style.transform = `translate(${nx * -14}px, ${ny * -14}px)`;
  });
  hero.addEventListener('mouseleave', () => {
    pattern.style.transform = 'translate(0, 0)';
  });
})();

/* Process steps: draw the connecting line once the track is in view */
(function processLine() {
  const track = document.getElementById('processTrack');
  if (!track) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        track.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  io.observe(track);
})();

/* Cursor spotlight on cards: atmosfer items, contact card, quote form */
(function spotlightCards() {
  document.querySelectorAll('.spotlight').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
})();

/* ==========================================================
   MENÜ VERİSİ
   ----------------------------------------------------------
   Bu, mutfaktan örnek bir seçki. Yeni ürün eklemek için
   aşağıdaki kategorilere yeni { name, desc, price } nesneleri
   eklemeniz yeterli — sekmeler ve liste otomatik güncellenir.
   ========================================================== */
const MENU = {
  "Mezeler & Başlangıçlar": [
    { name: "Humus", desc: "Nohut ezmesi, tahin, zeytinyağı, közlenmiş kırmızı biber.", price: "₺140" },
    { name: "Muhammara", desc: "Ceviz ve kırmızı biber ezmesi, nar ekşisi.", price: "₺160" },
    { name: "Oruk", desc: "İçli köftenin Hatay usulü fırınlanmış hali, bulgur ve kıyma iç harcı.", price: "₺190" },
    { name: "Sinsi Böreği", desc: "İnce yufka katmanları arasında kıymalı iç harç, yoğurtla servis.", price: "₺180" }
  ],
  "Kebaplar & Izgara": [
    { name: "Kağıt Kebabı", desc: "Kıyma, domates ve biber ile kağıtta fırınlanan Hatay'ın imza kebabı.", price: "₺380" },
    { name: "Humuslu Kebap", desc: "Izgara kebap dilimleri, sıcak humus üzerinde, tereyağıyla.", price: "₺400" },
    { name: "Tepsi Kebabı", desc: "Patlıcan ve biberle fırınlanan kıyma kebabı.", price: "₺360" },
    { name: "Şiş Tavuk", desc: "Marine edilmiş tavuk şiş, sumak soğanla.", price: "₺320" }
  ],
  "Çorbalar": [
    { name: "Yuvalama", desc: "Yoğurtlu çorba, bulgurla sarılmış küçük köfteler, nane ve tereyağı.", price: "₺120" },
    { name: "Mercimek Çorbası", desc: "Kırmızı mercimek, kimyon, limon.", price: "₺100" }
  ],
  "Tatlılar": [
    { name: "Künefe", desc: "Tel kadayıf arasında eritilmiş peynir, sıcak şerbetle, Hatay usulü.", price: "₺190" },
    { name: "Kaytaz Böreği", desc: "İnce yufka, ceviz iç harcı, hafif şerbetli Hatay tatlısı.", price: "₺170" },
    { name: "Ekmek Kadayıfı", desc: "Kaymak eşliğinde, hafif şerbetli geleneksel tatlı.", price: "₺160" }
  ],
  "İçecekler": [
    { name: "Antakya Usulü Limonata", desc: "Taze sıkılmış limon, nane.", price: "₺80" },
    { name: "Ayran", desc: "Soğuk, tuzlu yoğurt içeceği.", price: "₺50" },
    { name: "Türk Kahvesi", desc: "Közde pişirilmiş, geleneksel usul.", price: "₺70" }
  ]
};

const tabsEl = document.getElementById('menuTabs');
const gridEl = document.getElementById('menuGrid');
const searchInput = document.getElementById('menuSearch');
const searchClearBtn = document.getElementById('menuSearchClear');
const resultsInfoEl = document.getElementById('menuResultsInfo');
const categories = Object.keys(MENU);

/* Menü büyüdükçe (ör. 100+ ürün) sayfayı kullanışlı tutmak için:
   1) Kategori başına bir seferde sınırlı sayıda ürün gösterilir,
      "Daha Fazla Göster" ile devamı yüklenir.
   2) Üstteki arama kutusu tüm kategorilerde anında filtreler.
   Yeni ürün eklemek hâlâ sadece MENU nesnesine satır eklemek kadar basit. */
const PAGE_SIZE = 8;
let currentCategory = categories[0];
let visibleCount = PAGE_SIZE;

function normalize(str) {
  return str.toLocaleLowerCase('tr-TR');
}

function buildItemRow(item, categoryLabel) {
  const row = document.createElement('div');
  row.className = 'menu-item';
  row.innerHTML = `
    <div class="menu-item-text">
      ${categoryLabel ? `<span class="menu-item-cat">${categoryLabel}</span>` : ''}
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
    </div>
    <div class="menu-item-price">${item.price}</div>
  `;
  return row;
}

function crossfadeGrid(applyChange) {
  if (prefersReducedMotion) { applyChange(); return; }
  gridEl.classList.add('is-switching');
  setTimeout(() => {
    applyChange();
    gridEl.classList.remove('is-switching');
  }, 160);
}

function renderTabs(active) {
  tabsEl.innerHTML = '';
  categories.forEach((cat) => {
    const btn = document.createElement('button');
    btn.className = 'menu-tab';
    btn.type = 'button';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', cat === active ? 'true' : 'false');
    btn.innerHTML = `${cat} <span class="menu-tab-count">${MENU[cat].length}</span>`;
    btn.addEventListener('click', () => {
      if (cat === currentCategory) return;
      currentCategory = cat;
      visibleCount = PAGE_SIZE;
      renderTabs(cat);
      crossfadeGrid(() => renderGrid(cat));
    });
    tabsEl.appendChild(btn);
  });
}

function renderGrid(cat) {
  gridEl.innerHTML = '';
  const items = MENU[cat] || [];
  if (items.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'menu-empty';
    empty.textContent = 'Bu kategoriye yakında yeni lezzetler eklenecek.';
    gridEl.appendChild(empty);
    return;
  }

  items.slice(0, visibleCount).forEach((item) => {
    gridEl.appendChild(buildItemRow(item));
  });

  const remaining = items.length - visibleCount;
  if (remaining > 0) {
    const moreBtn = document.createElement('button');
    moreBtn.type = 'button';
    moreBtn.className = 'menu-load-more';
    moreBtn.textContent = `Daha Fazla Göster (${remaining})`;
    moreBtn.addEventListener('click', () => {
      visibleCount += PAGE_SIZE;
      renderGrid(cat);
    });
    gridEl.appendChild(moreBtn);
  }
}

function renderSearchResults(query) {
  const q = normalize(query.trim());
  const matches = [];
  categories.forEach((cat) => {
    MENU[cat].forEach((item) => {
      if (normalize(item.name).includes(q) || normalize(item.desc).includes(q)) {
        matches.push({ item, cat });
      }
    });
  });

  resultsInfoEl.hidden = false;
  resultsInfoEl.textContent = matches.length
    ? `"${query}" için ${matches.length} sonuç bulundu.`
    : `"${query}" için sonuç bulunamadı.`;

  gridEl.innerHTML = '';
  if (matches.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'menu-empty';
    empty.textContent = 'Aramanızla eşleşen bir lezzet bulunamadı. Farklı bir kelime deneyin.';
    gridEl.appendChild(empty);
    return;
  }
  matches.forEach(({ item, cat }) => gridEl.appendChild(buildItemRow(item, cat)));
}

function exitSearch() {
  resultsInfoEl.hidden = true;
  tabsEl.hidden = false;
  crossfadeGrid(() => renderGrid(currentCategory));
}

searchInput.addEventListener('input', () => {
  const query = searchInput.value;
  searchClearBtn.hidden = query.length === 0;
  if (query.trim().length === 0) {
    exitSearch();
    return;
  }
  tabsEl.hidden = true;
  crossfadeGrid(() => renderSearchResults(query));
});

searchClearBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchClearBtn.hidden = true;
  exitSearch();
  searchInput.focus();
});

if (categories.length) {
  renderTabs(currentCategory);
  renderGrid(currentCategory);
}

/* ==========================================================
   Rezervasyon formu -> WhatsApp yönlendirmesi
   ----------------------------------------------------------
   Şu an bağlı bir sunucu yok. Form gönderildiğinde, girilen
   bilgilerle birlikte WhatsApp'ı önceden doldurulmuş halde
   açar. Gerçek bir form altyapısı kurulduğunda bu kısmı
   değiştirin.
   ========================================================== */
const form = document.getElementById('quoteForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const ad = document.getElementById('adSoyad').value.trim();
  const tel = document.getElementById('telefon').value.trim();
  const tarih = document.getElementById('tarih').value;
  const kisi = document.getElementById('kisi').value;
  const mesaj = document.getElementById('mesaj').value.trim();

  if (!ad || !tel) {
    status.textContent = 'Lütfen ad soyad ve telefon bilgilerinizi girin.';
    status.classList.remove('ok');
    return;
  }

  const text = `Merhaba, Şaziye Gastro'dan rezervasyon yaptırmak istiyorum.%0A%0AAd Soyad: ${encodeURIComponent(ad)}%0ATelefon: ${encodeURIComponent(tel)}%0ATarih: ${encodeURIComponent(tarih || '-')}%0AKişi Sayısı: ${encodeURIComponent(kisi || '-')}%0AMesaj: ${encodeURIComponent(mesaj || '-')}`;
  window.open(`https://wa.me/905451234567?text=${text}`, '_blank');

  status.textContent = 'Talebiniz WhatsApp\'a yönlendiriliyor...';
  status.classList.add('ok');
  form.reset();
});
