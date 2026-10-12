(() => {
  const MENU_URL = '/content/menu.json';
  const menuEl = document.getElementById('menu');
  const chipsEl = document.getElementById('chips');
  const statusEl = document.getElementById('status');
  const searchEl = document.getElementById('search');

  let sections = []; // { label, note, items, el, chip }

  const tr = s => String(s || '').toLocaleLowerCase('tr-TR');
  const shortLabel = c => c.split(' (')[0].trim();
  const noteOf = c => (c.match(/\(([^)]+)\)/) || [])[1] || '';
  const formatPrice = p => {
    const v = String(p ?? '').trim();
    return /^[\d.,]+$/.test(v) ? v + '₺' : v;
  };
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  // Aramada eşleşen kısmı vurgular (güvenli: textContent ile)
  function highlight(node, text, q) {
    node.textContent = '';
    if (!q) { node.textContent = text; return; }
    const lower = tr(text);
    let i = 0, idx;
    while ((idx = lower.indexOf(q, i)) !== -1) {
      node.append(text.slice(i, idx));
      const m = el('mark', null, text.slice(idx, idx + q.length));
      node.append(m);
      i = idx + q.length;
    }
    node.append(text.slice(i));
  }

  function build(items) {
    const groups = new Map();
    items.filter(i => i.available !== false).forEach(i => {
      const key = i.category || 'DİĞER';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(i);
    });

    let n = 0;
    groups.forEach((list, cat) => {
      const label = shortLabel(cat);
      const id = 'kat-' + (++n);
      const sec = el('section', 'section');
      sec.id = id;

      const head = el('div', 'section-head');
      head.append(el('h2', null, label));
      const note = noteOf(cat);
      if (note) head.append(el('p', 'note', note));
      sec.append(head);

      const grid = el('div', 'items');
      sec.append(grid);
      menuEl.append(sec);

      const chip = el('button', 'chip', label);
      chip.type = 'button';
      chip.addEventListener('click', () => {
        searchEl.value = '';
        render('');
        sec.scrollIntoView({ behavior: 'smooth' });
      });
      chipsEl.append(chip);

      sections.push({ label, items: list, el: sec, grid, chip });
    });
  }

  function render(rawQuery) {
    const q = tr(rawQuery.trim());
    let total = 0;

    sections.forEach(s => {
      s.grid.textContent = '';
      const hits = s.items.filter(i =>
        !q || tr(i.name).includes(q) || tr(i.description).includes(q) || tr(s.label).includes(q));
      hits.forEach(i => {
        const row = el('article', 'item');
        const top = el('div', 'item-top');
        const h = el('h3');
        highlight(h, i.name || '', q);
        top.append(h, el('span', 'dots'), el('span', 'price', formatPrice(i.price)));
        row.append(top);
        if (i.description) {
          const p = el('p');
          highlight(p, i.description, q);
          row.append(p);
        }
        s.grid.append(row);
      });
      s.el.hidden = hits.length === 0;
      total += hits.length;
    });

    statusEl.textContent = total === 0 ? 'Aramanıza uygun ürün bulunamadı.' : '';
  }

  // Kaydırırken aktif kategoriyi vurgula
  function spy() {
    const y = window.scrollY + 160;
    let current = null;
    sections.forEach(s => { if (!s.el.hidden && s.el.offsetTop <= y) current = s; });
    sections.forEach(s => s.chip.classList.toggle('active', s === current));
    if (current) {
      const c = current.chip, r = chipsEl;
      r.scrollTo({ left: c.offsetLeft - r.clientWidth / 2 + c.clientWidth / 2, behavior: 'smooth' });
    }
  }

  async function init() {
    try {
      const res = await fetch(MENU_URL, { cache: 'no-cache' });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      build(data.items || []);
      render('');
      spy();
    } catch (e) {
      statusEl.textContent = 'Menü şu anda yüklenemedi. Lütfen daha sonra tekrar deneyin.';
    }
  }

  searchEl.addEventListener('input', () => render(searchEl.value));
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { spy(); ticking = false; });
  }, { passive: true });

  init();
})();
