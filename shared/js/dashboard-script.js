const LESSONS_FILE = 'lessons.json';
const QUICK_LINKS_FILE = '../quick-links.json';
const pageKey = location.pathname
  .split('/')
  .filter(Boolean)
  .slice(0, -1)
  .join('_')
  .replace(/[^\w-]+/g, '_') || 'docs';
const legacyDashboardKeys = {
  'python-zero2hero': {
    visited: 'hoc_python_visited',
    theme: 'py_dashboard_theme'
  }
};
const legacyDashboardKey = legacyDashboardKeys[pageKey] || {};
const VISITED_KEY = legacyDashboardKey.visited || `${pageKey}_visited`;
const THEME_KEY = legacyDashboardKey.theme || `${pageKey}_theme`;

let allLessons = [];
let allTypes = [];
let currentCat = 'all';
let sortMode = 'order';
const collapsedTypes = new Set();

function getSeries(data) {
  return data.series || {
    title: data.title || 'Bộ tài liệu mẫu',
    description: data.description || 'Sử dụng cấu trúc này để tạo tài liệu học tập mới.',
    mark: data.mark || 'DOC',
    logo: data.logo || data.logoUrl || data.image || '',
    accent: data.accent || '',
    tip: data.tip || ''
  };
}

function applySeriesBrand(series) {
  if (series.accent) {
    document.documentElement.style.setProperty('--accent', series.accent);
    document.documentElement.style.setProperty('--accent2', series.accent);
  }

  const logoHost = document.getElementById('seriesLogo');
  if (!logoHost) return;

  const logo = series.logo || series.logoUrl || series.image || '';
  if (logo) {
    const label = series.logoAlt || `${series.title || 'Course'} logo`;
    logoHost.innerHTML = `<img class="course-logo" src="${logo}" alt="${label}" />`;
    return;
  }

  const mark = document.getElementById('seriesMark');
  if (mark) mark.textContent = series.mark || 'DOC';
}

function applySeriesTip(series) {
  const tipBox = document.getElementById('seriesTip');
  if (!tipBox) return;

  const tip = series.tip || {};
  const title = typeof tip === 'string' ? 'MẸO HỌC TẬP' : (tip.title || 'MẸO HỌC TẬP');
  const content = typeof tip === 'string' ? tip : (tip.content || '');
  const html = typeof tip === 'object' ? tip.html : '';

  if (!content && !html) {
    tipBox.closest('.widget')?.setAttribute('hidden', '');
    return;
  }

  tipBox.innerHTML = `<strong>${title}</strong>${html || content}`;
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  updateThemeIcon(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  setTheme(current === 'dark' ? 'light' : 'dark');
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  btn.innerHTML = theme === 'light'
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="18.36" x2="5.64" y2="19.78"/><line x1="18.36" y1="4.22" x2="19.78" y2="5.64"/></svg>';
}

function getVisited() {
  try { return JSON.parse(localStorage.getItem(VISITED_KEY) || '[]'); } catch { return []; }
}

function markVisited(file) {
  const visited = getVisited();
  if (!visited.includes(file)) {
    visited.push(file);
    localStorage.setItem(VISITED_KEY, JSON.stringify(visited));
  }
}

function openQuickNav() {
  const overlay = document.getElementById('quickNavOverlay');
  overlay.removeAttribute('hidden');
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeQuickNav(event) {
  if (event && event.target !== document.getElementById('quickNavOverlay')) return;
  const overlay = document.getElementById('quickNavOverlay');
  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

function renderQuickLinks(links) {
  const grid = document.getElementById('quickNavGrid');
  grid.innerHTML = '';
  links.forEach(item => {
    const isReady = item.status === 'ready' && item.url;
    const card = document.createElement(isReady ? 'a' : 'div');
    card.className = 'quick-link-card' + (!isReady ? ' is-coming' : '');
    card.style.setProperty('--quick-accent', item.accent || 'var(--accent)');
    if (isReady) card.href = item.url;
    card.innerHTML = `
      <span class="quick-link-dot"></span>
      <span class="quick-link-body">
        <strong>${item.title}</strong>
        <small>${item.description || ''}</small>
      </span>
      <span class="quick-link-status">${isReady ? 'Khám phá' : 'Sắp có'}</span>`;
    grid.appendChild(card);
  });
}

function loadQuickLinks() {
  fetch(QUICK_LINKS_FILE)
    .then(response => response.json())
    .then(data => {
      document.getElementById('quickNavTitle').textContent = data.title || 'Lộ trình học tập';
      document.getElementById('quickNavDesc').textContent = data.description || '';
      renderQuickLinks(data.links || []);
    })
    .catch(() => {
      document.getElementById('quickNavDesc').textContent = 'Không tải được cấu trúc dữ liệu.';
    });
}

function buildCard(lesson, types, visited) {
  const isAvailable = lesson.status === 'published' && Boolean(lesson.file);
  const isDone = isAvailable && visited.includes(lesson.file);
  const typeDef = types.find(type => type.id === lesson.type) || {};
  const color = typeDef.color || '#546278';
  const el = document.createElement(isAvailable ? 'a' : 'div');
  el.className = 'lesson-card' + (isDone ? ' is-done' : '');
  el.setAttribute('data-status', isAvailable ? 'published' : 'coming');
  el.setAttribute('data-cat', lesson.type);
  el.setAttribute('data-search', `${lesson.title} ${lesson.description || ''} ${(lesson.tags || []).join(' ')}`.toLowerCase());
  el.style.setProperty('--card-color', color);
  if (isAvailable) {
    el.href = lesson.file;
    el.addEventListener('click', () => markVisited(lesson.file));
  }

  const metaHtml = isAvailable
    ? `<div class="card-meta">
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> <strong>${lesson.sections || 0}</strong> mục</span>
        ${isDone ? '<span class="badge-done">✓ Đã hoàn thành</span>' : ''}
       </div>`
    : `<div class="card-meta">
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> <strong>${lesson.sections || 0}</strong> mục</span>
        <span class="badge-coming">Sắp ra mắt</span>
       </div>`;

  el.innerHTML = `
    <div class="card-num">${lesson.id}</div>
    <div class="card-body">
      <span class="card-type-tag" style="color:${color}">
        <span class="dot" style="background:${color}"></span>${typeDef.title || lesson.type}
      </span>
      <div class="card-title">${lesson.title}</div>
      <div class="card-desc">${lesson.description || ''}</div>
      ${metaHtml}
    </div>
    <div class="card-right"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg></div>`;
  return el;
}

function buildTypeHeader(typeDef, count) {
  const header = document.createElement('div');
  header.className = 'type-header';
  header.setAttribute('data-cat', typeDef.id);
  header.innerHTML = `
    <span class="type-icon">${typeDef.icon || '•'}</span>
    <span class="type-name" style="color:${typeDef.color || '#38bdf8'}">${typeDef.title || typeDef.id}</span>
    <div class="type-actions">
      <span class="type-count">${count} bài học</span>
      <button class="toggle-btn" onclick="toggleType('${typeDef.id}',event)">Ẩn</button>
    </div>
    <span class="type-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></span>`;
  return header;
}

function renderAll(lessons, types) {
  allLessons = lessons;
  allTypes = types;
  const tabNav = document.getElementById('tabNav');
  tabNav.innerHTML = '<button class="tab-btn active" onclick="filterCat(\'all\',this)">Tất cả bài viết</button>';
  types.forEach(type => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    btn.setAttribute('data-cat', type.id);
    btn.innerHTML = `<span class="tab-dot" style="background:${type.color}"></span>${type.title}`;
    btn.onclick = function() { filterCat(type.id, this); };
    tabNav.appendChild(btn);
  });

  const sidebar = document.getElementById('sidebarCats');
  sidebar.innerHTML = '';
  const allBtn = document.createElement('button');
  allBtn.className = 'filter-btn active';
  allBtn.style.setProperty('--f-color', 'var(--accent)');
  allBtn.onclick = () => filterCat('all', allBtn);
  allBtn.innerHTML = `<span class="f-dot" style="background:var(--accent)"></span><span class="f-label">Tất cả bài học</span><span class="filter-count">${lessons.length}</span>`;
  sidebar.appendChild(allBtn);

  types.forEach(type => {
    const count = lessons.filter(lesson => lesson.type === type.id).length;
    if (!count) return;
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.setAttribute('data-cat', type.id);
    btn.style.setProperty('--f-color', type.color);
    btn.onclick = function() { filterCat(type.id, this); };
    btn.innerHTML = `<span class="f-dot" style="background:${type.color}"></span><span class="f-label">${type.title}</span><span class="filter-count">${count}</span>`;
    sidebar.appendChild(btn);
  });

  rebuildGrid(lessons, types, getVisited());
  document.getElementById('loading').style.display = 'none';
  document.getElementById('lessonGrid').style.display = 'flex';
}

function rebuildGrid(lessons, types, visited) {
  const grid = document.getElementById('lessonGrid');
  grid.innerHTML = '';
  if (sortMode === 'order') {
    grid.className = 'lessons-list mode-order';
    [...lessons].sort((a, b) => a.id.localeCompare(b.id)).forEach(lesson => grid.appendChild(buildCard(lesson, types, visited)));
  } else {
    grid.className = 'lessons-list mode-type';
    const grouped = {};
    lessons.forEach(lesson => { (grouped[lesson.type] ||= []).push(lesson); });
    types.forEach(type => {
      if (!grouped[type.id] || !grouped[type.id].length) return;
      grid.appendChild(buildTypeHeader(type, grouped[type.id].length));
      const group = document.createElement('div');
      group.className = 'type-group';
      group.setAttribute('data-cat', type.id);
      grouped[type.id].sort((a, b) => a.id.localeCompare(b.id)).forEach(lesson => group.appendChild(buildCard(lesson, types, visited)));
      grid.appendChild(group);
    });
  }
}

function setSortMode(mode, btn) {
  sortMode = mode;
  document.querySelectorAll('.sort-pill').forEach(button => button.classList.remove('active'));
  btn.classList.add('active');
  currentCat = 'all';
  document.querySelectorAll('.tab-btn, .filter-btn').forEach(button => button.classList.remove('active'));
  document.querySelector('.tab-btn').classList.add('active');
  document.querySelector('.filter-btn').classList.add('active');
  rebuildGrid(allLessons, allTypes, getVisited());
  applyFilters();
}

function filterCat(cat, btn) {
  currentCat = cat;
  document.querySelectorAll('.tab-btn, .filter-btn').forEach(button => button.classList.remove('active'));
  document.querySelectorAll(`.tab-btn[data-cat="${cat}"], .filter-btn[data-cat="${cat}"]`).forEach(button => button.classList.add('active'));
  if (cat === 'all') {
    document.querySelector('.tab-btn:not([data-cat])').classList.add('active');
    document.querySelector('.filter-btn:not([data-cat])').classList.add('active');
  }
  applyFilters();
}

function doSearch(query) {
  applyFilters(query);
}

function toggleType(typeId, event) {
  event.stopPropagation();
  const btn = event.target;
  const header = btn.closest('.type-header');
  if (collapsedTypes.has(typeId)) {
    collapsedTypes.delete(typeId);
    btn.textContent = 'Ẩn';
    if (header) header.classList.remove('collapsed');
  } else {
    collapsedTypes.add(typeId);
    btn.textContent = 'Hiện';
    if (header) header.classList.add('collapsed');
  }
  applyFilters();
}

function applyFilters(query = document.getElementById('searchInput').value) {
  const q = query.toLowerCase().trim();
  let matched = 0;
  document.querySelectorAll('.lesson-card').forEach(card => {
    const cat = card.getAttribute('data-cat');
    const catMatch = currentCat === 'all' || cat === currentCat;
    const searchMatch = !q || (card.getAttribute('data-search') || '').includes(q);
    const collapsed = sortMode === 'type' && collapsedTypes.has(cat);
    const show = catMatch && searchMatch && !collapsed;
    card.style.display = show ? '' : 'none';
    if (catMatch && searchMatch) matched++;
  });
  document.querySelectorAll('.type-header').forEach(header => {
    const cat = header.getAttribute('data-cat');
    header.style.display = (currentCat === 'all' || cat === currentCat) ? '' : 'none';
  });
  document.querySelectorAll('.type-group').forEach(group => {
    const cat = group.getAttribute('data-cat');
    group.style.display = (currentCat === 'all' || cat === currentCat) && !collapsedTypes.has(cat) ? 'grid' : 'none';
  });
  document.getElementById('visibleCount').textContent = matched;
  document.getElementById('emptyMsg').style.display = (matched === 0 && (q || currentCat !== 'all')) ? 'flex' : 'none';
}

document.addEventListener('keydown', event => {
  if (event.key === '/' && document.activeElement.tagName !== 'INPUT') {
    event.preventDefault();
    document.getElementById('searchInput').focus();
  }
  if (event.key === 'Escape') closeQuickNav();
});

fetch(LESSONS_FILE)
  .then(response => response.json())
  .then(data => {
    const series = getSeries(data);
    allLessons = data.lessons || [];
    allTypes = data.types || [];
    document.title = series.title || document.title;
    document.getElementById('seriesTitle').innerHTML = series.titleHtml || series.title || 'Bộ tài liệu mẫu';
    document.getElementById('seriesDesc').textContent = series.description || '';
    applySeriesBrand(series);
    applySeriesTip(series);
    updateThemeIcon(document.documentElement.getAttribute('data-theme') || 'dark');
    loadQuickLinks();
    renderAll(allLessons, allTypes);
    applyFilters();
  })
  .catch(error => {
    document.getElementById('loading').innerHTML = 'Không thể tải dữ liệu cấu trúc <code>lessons.json</code>.';
    console.error(error);
  });
