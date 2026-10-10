const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Header scroll state + scroll progress bar
const header = document.getElementById('siteHeader');
const scrollProgress = document.getElementById('scrollProgress');
let scrollTicking = false;
function updateOnScroll() {
  header.classList.toggle('scrolled', window.scrollY > 40);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + '%';
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(updateOnScroll);
    scrollTicking = true;
  }
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

/* Cursor spotlight on cards: contact card, reservation form */
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
   Signature plates: pick a row -> the arch photo swaps
   ========================================================== */
(function signaturePlates() {
  const rows = document.querySelectorAll('.sig-row');
  const img = document.getElementById('sigImg');
  const float = document.getElementById('sigFloat');
  if (!rows.length || !img) return;
  let current = rows[0];
  let swapTimer;

  function show(row) {
    if (row === current) return;
    current = row;
    rows.forEach((r) => r.classList.toggle('is-active', r === row));
    clearTimeout(swapTimer);
    img.classList.add('is-swapping');
    swapTimer = setTimeout(() => {
      img.onload = () => img.classList.remove('is-swapping');
      img.src = row.dataset.img;
      img.alt = row.dataset.alt;
      if (float) float.textContent = row.dataset.title;
      setTimeout(() => img.classList.remove('is-swapping'), 600); // safety net
    }, 180);
  }

  const canHover = window.matchMedia('(hover: hover)').matches;
  rows.forEach((row) => {
    row.addEventListener('click', () => show(row));
    row.addEventListener('focus', () => show(row));
    if (canHover) row.addEventListener('mouseenter', () => show(row));
  });
})();

/* ==========================================================
   Venue rail: arrow buttons + mouse drag to scroll
   ========================================================== */
(function venueRail() {
  const rail = document.getElementById('rail');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!rail) return;

  function step() {
    const card = rail.querySelector('.rail-card');
    return card ? card.getBoundingClientRect().width + 24 : 320;
  }
  const behavior = prefersReducedMotion ? 'auto' : 'smooth';
  if (prev) prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior }));
  if (next) next.addEventListener('click', () => rail.scrollBy({ left: step(), behavior }));

  let down = false, startX = 0, startLeft = 0;
  rail.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return; // touch scrolls natively
    down = true;
    startX = e.clientX;
    startLeft = rail.scrollLeft;
    rail.classList.add('is-dragging');
  });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    rail.scrollLeft = startLeft - (e.clientX - startX);
  });
  window.addEventListener('pointerup', () => {
    if (!down) return;
    down = false;
    rail.classList.remove('is-dragging');
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
"MEZELER": [
{ "name": "HUMUS", "desc": "Tahin, nohut ve sızma zeytinyağının ipeksi uyumu.", "price": "180₺" },
{ "name": "MUHAMMARA", "desc": "Bolceviz, tahin, biber salçası ve baharatın lezzet harmanı.", "price": "240₺" },
{ "name": "MÜTEBBEL", "desc": "Közlenmiş patlıcan, süzme yoğurt, sarımsak, dere otu ve tahinin eşsiz uyumu.", "price": "220₺" },
{ "name": "HAVUÇ TARATOR", "desc": "Hafifçe sotelenmiş taze havuçlar, süzme yoğurt, ve sarımsak.", "price": "160₺" },
{ "name": "CEVİZLİ ZEYTİN KAVURMA", "desc": "Antakya halhalı zeytini, bol ceviz, domates sosu ve sızma zeytinyağı.", "price": "350₺" },
{ "name": "BABAGANNUŞ KÖZLENMİŞ PATLICAN", "desc": "Köz biber, köz patlıcan, taze sarımsak, sızma zeytinyağı ve nar ekşisi.", "price": "200₺" },
{ "name": "ZEYTİNYAĞLI YAPRAK SARMA", "desc": "İncecik asma yaprağına sarılmış, bol baharatlı zeytinyağlı sarma. (6 adettir)", "price": "225₺" },
{ "name": "ZEYTİNYAĞLI BİBER DOLMASI", "desc": "Taze baharatlı pirinç harcıyla doldurulmuş biber dolması. (2 adettir)", "price": "250₺" },
{ "name": "ANTAKYA USULÜ KISIR", "desc": "Bol yeşillik, taze nane, nar ekşisi ve esmer bulgurla geleneksel dokunuş.", "price": "200₺" },
{ "name": "YORGİ", "desc": "Süzme yoğurt yatağında, özel baharatlı karamelize soğanlar.", "price": "260₺" },
{ "name": "TAVUKLU KEREVİZLİ YOĞURT SALATASI", "desc": "Rendelenmiş taze kereviz, tiftiklenmiş tavuk göğsü ve ceviz içi.", "price": "300₺" },
{ "name": "HATAY TUZLU YOĞURT", "desc": "Yoğurdun kaynatılarak özüne ulaşması ile elde edilen yoğun lezzet.", "price": "150₺" },
{ "name": "EV YAPIMI TURŞU 1 KG", "desc": "Mevsim sebzelerinden hazırlanan çıtır ve iştah açıcı karışık turşu.", "price": "300₺" },
{ "name": "VİŞNELİ YAPRAK SARMA", "desc": "Ekşi vişne dokunuşuyla klasik yaprak sarmaya farklı bir yorum. (8 adettir)", "price": "375₺" }
],
"BAŞLANGIÇ & ÇORBALAR": [
{ "name": "KÖZ BİBER ÇORBASI", "desc": "Közlenmiş kırmızı biberlerle yapılan bize özel imza lezzet.", "price": "225₺" },
{ "name": "KELLE PAÇA ÇORBASI", "desc": "Geleneksel usulle hazırlanan, bol sarımsaklı ve sirkeli şifa çorbası.", "price": "250₺" },
{ "name": "ANTEP USULÜ KURU BİBER DOLMASI", "desc": "Ekşili ve baharatlı pirinç harcıyla doldurulmuş kuru biber dolması.", "price": "160₺" },
{ "name": "ANTEP USULÜ KURU PATLICAN DOLMASI", "desc": "Zeytinyağlı, bol baharatlı ve nar ekşili geleneksel kuru patlıcan dolması.", "price": "180₺" }
],
"ARA SICAKLAR": [
{ "name": "İÇLİ KÖFTE (KIZARTMA)", "desc": "Dışı çıtır çıtır, içi sulu ve lezzetli geleneksel kızarmış içli köfte. (1 adet)", "price": "120₺" },
{ "name": "COMBO TABAĞI", "desc": "Çıtır atıştırmalıklar, sigara böreği, patates kızartması ve özel soslar. (2 kişiliktir)", "price": "400₺" },
{ "name": "PATATES KIZARTMASI", "desc": "Altın sarısı çıtır patatesler.", "price": "120₺" },
{ "name": "EV YAPIMI SİGARA BÖREĞİ", "desc": "Çıtır yufka içerisinde eriyen sıcak Hatay peyniri. (6 adettir)", "price": "120₺" },
{ "name": "BİBERLİ EKMEK", "desc": "Antakya'nın geleneksel baharatlı salça ve çökelekle harçlı meşhur lezzeti.", "price": "245₺" },
{ "name": "FELLAH KÖFTESİ", "desc": "Sarımsaklı domates sosu ve taze maydanoz eşliğinde geleneksel bulgur köftesi.", "price": "220₺" }
],
"SALATALAR": [
{ "name": "MEVSİM SALATASI", "desc": "Mevsim yeşillikleri, havuç, mor lahana, zeytinyağı ve limon sosu.", "price": "250₺" },
{ "name": "TABLACI SALATASI", "desc": "İncecik kıyılmış domates, biber, soğan, bol sumak ve nar ekşisi.", "price": "180₺" },
{ "name": "ÇOBAN SALATASI", "desc": "Küp doğranmış domates, salatalık, biber, taze soğan ve zeytinyağı.", "price": "220₺" },
{ "name": "TAVUKLU IZGARA SALATA", "desc": "Akdeniz yeşillikleri üzerinde ızgara tavuk dilimleri ve özel sos.", "price": "400₺" },
{ "name": "TON BALIKLI SALATA", "desc": "Mısır, zeytin dilimleri, kırmızı soğan ve ton balığının nefis uyumu.", "price": "350₺" },
{ "name": "GURME 3 PEYNİRLİ SALATA", "desc": "Üç peynirli, kuru domates ve zeytinyağı.", "price": "350₺" }
],
"BISTRO KLASİKLERİ": [
{ "name": "SHAZİYE BURGER", "desc": "Ev yapımı özel burger köftesi, karamelize soğan, eritilmiş peynir ile.", "price": "550₺" },
{ "name": "TAVUK VİYANA ŞNİTZEL", "desc": "İncecik açılmış Tavuk bonfile ve patatesin uyumu.", "price": "600₺" },
{ "name": "KREMALI TAVUKLU SPAGETTİ", "desc": "krema tavuk ve spagettinin uyumu.", "price": "375₺" }
],
"ANA YEMEKLER (Ana yemek porsiyonlarımızın çiğ tartımları minimum 200 gr dır.)": [
{ "name": "HATAY KAĞIT KEBABI", "desc": "Yağlı kağıt üzerinde, fırında kendi suyuyla pişen özel zırh kebabı.", "price": "550₺" },
{ "name": "HATAY TEPSİ KEBABI", "desc": "Özel baharatlı zırh kıyması, fırınlanmış domates ve biber ile. (2 kişilik)", "price": "1100₺" },
{ "name": "HALEP KEBABI", "desc": "Kebap arası köz patlıcan ve kaşarın oluşturduğu eşsiz lezzet.", "price": "750₺" },
{ "name": "ADANA KEBAP SERVİS", "desc": "Zırhtan çekilmiş el kıyması, közlenmiş biber, domates ve sumaklı soğan eşliğinde.", "price": "600₺" },
{ "name": "SHAZIYE SERVİS KÖFTE", "desc": "Izgara köfteler, közlenmiş sebzeler ve lavaş eşliğinde.", "price": "400₺" },
{ "name": "KUZU SAC KAVURMA", "desc": "Sac üzerinde taze biber, domates ve sarımsakla sotelenmiş yumuşacık kuzu eti.", "price": "750₺" },
{ "name": "TAVUK SAC KAVURMA", "desc": "Baharatlar ve taze sebzelerle sacda harmanlanmış lezzetli tavuk parçaları.", "price": "400₺" },
{ "name": "KUZU LOKUM DÖKÜM", "desc": "Döküm tavada mühürlenmiş, ağızda dağılan yumuşacık kuzu bonfile dilimleri.", "price": "900₺" },
{ "name": "KUZU PİRZOLA", "desc": "Taze biberiye ile marine edilmiş, ızgarada pişmiş 3 parça kuzu pirzola.", "price": "950₺" },
{ "name": "TAVUK ŞİŞ", "desc": "Özel marinasyonlu, şişe dizilmiş sulu tavuk but parçaları.", "price": "350₺" },
{ "name": "KUZU BUT İNCİK", "desc": "Düşük ısıda uzun süre pişirilerek hazırlanan , yumuşak dokulu ve yoğun aromalı kuzu incik.", "price": "650₺" }
],
"DÜRÜMLERİMİZ": [
{ "name": "TAVUK DÖNER DÜRÜM", "desc": "Özel soslu tavuk döner, patates ve turşu eşliğinde.", "price": "245₺" },
{ "name": "ADANA KEBAP DÜRÜM", "desc": "Sıcak lavaş içerisinde Adana kebap, sumaklı soğan ile.", "price": "345₺" },
{ "name": "NOHUT DÜRÜM", "desc": "Antep'in meşhur baharatlı, ezilmiş sıcak nohut dürümü.", "price": "250₺" },
{ "name": "TAVUK ŞİŞ DÜRÜM", "desc": "Izgara tavuk şiş parçaları, köz sebzeler ve yeşillik ile.", "price": "250₺" },
{ "name": "SHAZIYE GURME", "desc": "Ekmekle bütünleşmiş özel baharatlı et harcı ile pişen destansı lezzet.", "price": "450₺" },
{ "name": "KAVURMA DÜRÜM", "desc": "Ağır ateşte pişmiş kavrulmuş etin lavaşla muhteşem buluşması.", "price": "400₺" },
{ "name": "KAHVALTI DÜRÜMÜ", "desc": "Peynir, domates, zeytin ezmesi ve taze otlarla hafif bir alternatif.", "price": "200₺" },
{ "name": "EKSTRA KAŞAR", "desc": "", "price": "45₺" }
],
"YANCILAR & EKSTRALAR": [
{ "name": "PİRİNÇ PİLAVI", "desc": "", "price": "150₺" },
{ "name": "BULGUR PİLAVI", "desc": "", "price": "100₺" },
{ "name": "EKSTRA LAVAŞ", "desc": "", "price": "25₺" }
],
"TATLILAR": [
{ "name": "KÜNEFE", "desc": "", "price": "250₺" },
{ "name": "ÇITIR KABAK", "desc": "", "price": "250₺" }
],
"İÇECEKLER": [
{ "name": "HARDALİYE", "desc": "", "price": "380₺" },
{ "name": "HİBİSKUS", "desc": "", "price": "180₺" },
{ "name": "LİMON ŞERBETİ", "desc": "", "price": "180₺" },
{ "name": "AÇIK AYRAN", "desc": "", "price": "120₺" },
{ "name": "ŞALGAM", "desc": "", "price": "65₺" },
{ "name": "SODA", "desc": "", "price": "65₺" },
{ "name": "SU", "desc": "", "price": "35₺" },
{ "name": "TÜRK KAHVESİ", "desc": "", "price": "135₺" },
{ "name": "ÇAY", "desc": "", "price": "45₺" },
{ "name": "GAZLI İÇECEKLER", "desc": "", "price": "85₺" },
{ "name": "MEYVE SUYU / ICE TEA", "desc": "", "price": "75₺" }
]
};

const tabsCarouselEl = document.getElementById('menuTabsCarousel');
const tabsEl = document.getElementById('menuTabs');
const tabPrevBtn = document.getElementById('menuTabPrev');
const tabNextBtn = document.getElementById('menuTabNext');
const categoryNoteEl = document.getElementById('menuCategoryNote');
const gridEl = document.getElementById('menuGrid');
const searchInput = document.getElementById('menuSearch');
const searchClearBtn = document.getElementById('menuSearchClear');
const resultsInfoEl = document.getElementById('menuResultsInfo');
const categories = Object.keys(MENU);
const categoryCount = categories.length;

/* Menü büyüdükçe (ör. 100+ ürün) sayfayı kullanışlı tutmak için:
   1) Kategori başına bir seferde sınırlı sayıda ürün gösterilir,
      "Daha Fazla Göster" ile devamı yüklenir.
   2) Üstteki arama kutusu tüm kategorilerde anında filtreler.
   3) Kategori sekmeleri bir karusel: her zaman 3 tanesi görünür
      (önceki / seçili / sonraki), oklarla ya da sağa-sola kaydırarak
      gezinilir. Yeni ürün eklemek hâlâ sadece MENU nesnesine satır
      eklemek kadar basit. */
const PAGE_SIZE = 8;
let activeIndex = 0;
let visibleCount = PAGE_SIZE;

function normalize(str) {
  return str.toLocaleLowerCase('tr-TR');
}

// "ANA YEMEKLER (min. 200gr...)" -> kısa sekme etiketi "ANA YEMEKLER"
function shortLabel(cat) {
  return cat.split(' (')[0];
}
// Parantez içindeki notu ayıklar, varsa aktif kategori altında gösterilir
function categoryNote(cat) {
  const m = cat.match(/\(([^)]+)\)/);
  return m ? m[1] : '';
}

/* GEÇİCİ GÖRSELLER
   ----------------------------------------------------------
   Her ürüne henüz kendi fotoğrafı atanmadığı için, deneme
   amaçlı olarak elimizdeki mevcut görsellerden biri rastgele
   ama sabit (isme göre) şekilde seçiliyor. İlerledikçe her
   { name, desc, price } nesnesine bir "img": "assets/..." alanı
   eklenerek gerçek ürün fotoğrafı verilebilir — o alan varsa
   otomatik olarak onu kullanır. */
const PLACEHOLDER_IMAGES = [
  'assets/menuitem1.jpg',
  'assets/menuitem2.jpg',
  'assets/menuitem3.jpg',
  'assets/menuitem4.jpg',
  'assets/menuitem5.jpg'
];
function placeholderImageFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return PLACEHOLDER_IMAGES[hash % PLACEHOLDER_IMAGES.length];
}

function buildItemRow(item, categoryLabel) {
  const row = document.createElement('div');
  row.className = 'menu-item';
  const imgSrc = item.img || placeholderImageFor(item.name);
  row.innerHTML = `
    <img class="menu-item-img" src="${imgSrc}" alt="${item.name}" loading="lazy" width="72" height="72">
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

function updateCategoryNote() {
  const note = categoryNote(categories[activeIndex]);
  if (note) {
    categoryNoteEl.textContent = note;
    categoryNoteEl.hidden = false;
  } else {
    categoryNoteEl.hidden = true;
  }
}

function renderTabs(direction) {
  tabsEl.innerHTML = '';
  const prevI = (activeIndex - 1 + categoryCount) % categoryCount;
  const nextI = (activeIndex + 1) % categoryCount;
  const slots = categoryCount > 2
    ? [{ i: prevI, role: 'prev' }, { i: activeIndex, role: 'active' }, { i: nextI, role: 'next' }]
    : [{ i: activeIndex, role: 'active' }];

  slots.forEach(({ i, role }) => {
    const cat = categories[i];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `menu-tab menu-tab--${role}`;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', role === 'active' ? 'true' : 'false');
    btn.innerHTML = role === 'active'
      ? `${shortLabel(cat)} <span class="menu-tab-count">${MENU[cat].length}</span>`
      : shortLabel(cat);
    if (role !== 'active') {
      btn.addEventListener('click', () => goToCategory(i));
    }
    tabsEl.appendChild(btn);
  });

  updateCategoryNote();

  if (direction && !prefersReducedMotion) {
    tabsEl.classList.remove('slide-left', 'slide-right');
    void tabsEl.offsetWidth; // reflow, so the animation can restart
    tabsEl.classList.add(direction === 'next' ? 'slide-left' : 'slide-right');
  }
}

function goToCategory(index, forcedDirection) {
  const target = ((index % categoryCount) + categoryCount) % categoryCount;
  if (target === activeIndex) return;
  const direction = forcedDirection || (((target - activeIndex + categoryCount) % categoryCount) === 1 ? 'next' : 'prev');
  activeIndex = target;
  visibleCount = PAGE_SIZE;
  renderTabs(direction);
  crossfadeGrid(() => renderGrid(categories[activeIndex]));
}

tabPrevBtn.addEventListener('click', () => goToCategory(activeIndex - 1, 'prev'));
tabNextBtn.addEventListener('click', () => goToCategory(activeIndex + 1, 'next'));
if (categoryCount <= 1) { tabPrevBtn.hidden = true; tabNextBtn.hidden = true; }

/* Swipe left/right on the tab strip or the grid itself to change category */
(function swipeCategories() {
  let startX = 0, startY = 0, tracking = false;
  function onStart(x, y) { startX = x; startY = y; tracking = true; }
  function onEnd(x, y) {
    if (!tracking) return;
    tracking = false;
    const dx = x - startX;
    const dy = y - startY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) goToCategory(activeIndex + 1, 'next');
      else goToCategory(activeIndex - 1, 'prev');
    }
  }
  [tabsCarouselEl, gridEl].forEach((el) => {
    el.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    el.addEventListener('touchend', (e) => onEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY), { passive: true });
  });
})();

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
  tabsCarouselEl.hidden = false;
  categoryNoteEl.hidden = !categoryNote(categories[activeIndex]);
  crossfadeGrid(() => renderGrid(categories[activeIndex]));
}

searchInput.addEventListener('input', () => {
  const query = searchInput.value;
  searchClearBtn.hidden = query.length === 0;
  if (query.trim().length === 0) {
    exitSearch();
    return;
  }
  tabsCarouselEl.hidden = true;
  categoryNoteEl.hidden = true;
  crossfadeGrid(() => renderSearchResults(query));
});

searchClearBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchClearBtn.hidden = true;
  exitSearch();
  searchInput.focus();
});

if (categories.length) {
  renderTabs();
  renderGrid(categories[activeIndex]);
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
  const saat = document.getElementById('saat').value;
  const kisi = document.getElementById('kisi').value;
  const mesaj = document.getElementById('mesaj').value.trim();

  if (!ad || !tel) {
    status.textContent = 'Lütfen ad soyad ve telefon bilgilerinizi girin.';
    status.classList.remove('ok');
    return;
  }

  const text = `Merhaba, Şaziye Gastro'dan rezervasyon yaptırmak istiyorum.%0A%0AAd Soyad: ${encodeURIComponent(ad)}%0ATelefon: ${encodeURIComponent(tel)}%0ATarih: ${encodeURIComponent(tarih || '-')}%0ASaat: ${encodeURIComponent(saat || '-')}%0AKişi Sayısı: ${encodeURIComponent(kisi || '-')}%0AMesaj: ${encodeURIComponent(mesaj || '-')}`;
  window.open(`https://wa.me/905451234567?text=${text}`, '_blank');

  status.textContent = 'Talebiniz WhatsApp\'a yönlendiriliyor...';
  status.classList.add('ok');
  form.reset();
});
