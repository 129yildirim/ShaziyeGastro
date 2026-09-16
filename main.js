// Header scroll state
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

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
      currentCategory = cat;
      visibleCount = PAGE_SIZE;
      renderTabs(cat);
      renderGrid(cat);
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
  renderGrid(currentCategory);
}

searchInput.addEventListener('input', () => {
  const query = searchInput.value;
  searchClearBtn.hidden = query.length === 0;
  if (query.trim().length === 0) {
    exitSearch();
    return;
  }
  tabsEl.hidden = true;
  renderSearchResults(query);
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
