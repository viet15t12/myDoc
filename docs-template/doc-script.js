const VISITED_KEY = 'docs_template_visited';
const LESSONS_FILE = 'lessons.json';
const QUICK_LINKS_FILE = 'quick-links.json';
let allLessons = [];
let allTypes = [];
let currentCat = 'all';
let sortMode = 'order';
const collapsedTypes = new Set();

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('docs_dashboard_theme', theme);
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
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="18.36" x2="5.64" y2="19.78"/><line x1="18.36" y1="4.22" x2="19.78" y2="5.64"/></svg>';
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
  overlay.hidden = false;
  overlay.classList.add('is-open');
}

function closeQuickNav(event) {
  if (event && event.target !== event.currentTarget) return;
  const overlay = document.getElementById('quickNavOverlay');
  overlay.hidden = true;
  overlay.classList.remove('is-open');
}

function buildQuickNav(links) {
  const grid = document.getElementById('quickNavGrid');
  const desc = document.getElementById('quickNavDesc');
  if (!Array.isArray(links) || !links.length) {
    desc.textContent = 'Không có liên kết nhanh.';
    grid.innerHTML = '';
    return;
  }

  desc.textContent = 'Các liên kết nhanh đến phần học và tài liệu quan trọng.';
  grid.innerHTML = '';

  links.forEach(link => {
    const card = document.createElement('a');
    card.href = link.url || '#';
    card.className = 'quick-link-card';
    card.target = link.target || '_self';
    if (link.status === 'coming') card.classList.add('is-coming');

    card.innerHTML = `
      <strong>${link.title}</strong>
      <small>${link.description || ''}</small>
      <span class="quick-link-status">${link.status === 'coming' ? 'Sắp có' : 'Mở'}</span>
    `;

    grid.appendChild(card);
  });
}

function buildCard(lesson, types, visited) {
  const isAvailable = Boolean(lesson.file);
  const isDone = isAvailable && visited.includes(lesson.file);
  const typeDef = types.find(type => type.id === lesson.type) || {};
  const color = typeDef.color || '#546278';

  const el = document.createElement(isAvailable ? 'a' : 'div');
  el.className = 'lesson-card' + (isDone ? ' is-done' : '');
  el.setAttribute('data-cat', lesson.type);
  el.setAttribute('data-search', `${lesson.title} ${lesson.description || ''} ${(lesson.tags || []).join(' ')}`.toLowerCase());
  el.href = lesson.file || '#';
  if (isAvailable) {
    el.addEventListener('click', () => markVisited(lesson.file));
  }

  el.innerHTML = `
    <div class="card-num">${lesson.id}</div>
    <div>
      <div class="card-title">${lesson.title}</div>
      <div class="card-desc">${lesson.description || ''}</div>
      <div class="card-meta">
        <span>📄 <strong>${lesson.sections || 0}</strong> mục</span>
        ${isDone ? '<span class="badge-done">✓ Đã học</span>' : isAvailable ? '' : '<span class="badge-coming">Sắp có</span>'}
      </div>
    </div>
    <div class="card-right">›</div>
  `;

  return el;
}

function buildTypeHeader(typeDef, count) {
  const header = document.createElement('div');
  header.className = 'type-header';
  header.style.color = typeDef.color || '#38bdf8';
  header.innerHTML = `
    <span class="type-icon">${typeDef.icon || '•'}</span>
    <span class="type-name">${typeDef.title || typeDef.id}</span>
    <span class="type-count">${count}</span>
    <button class="toggle-btn" onclick="toggleType('${typeDef.id}', event)">Ẩn</button>
    <span class="type-chevron">›</span>
  `;
  return header;
}

function renderAll(lessons, types) {
  allLessons = lessons;
  allTypes = types;

  const tabNav = document.getElementById('tabNav');
  tabNav.innerHTML = '';
  types.forEach(type => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    btn.textContent = type.title;
    btn.onclick = function() { filterCat(type.id, this); };
    tabNav.appendChild(btn);
  });

  const sidebar = document.getElementById('sidebarCats');
  sidebar.innerHTML = '';
  const allBtn = document.createElement('button');
  allBtn.className = 'filter-btn active';
  allBtn.textContent = `Tất cả bài học (${lessons.length})`;
  allBtn.onclick = () => filterCat('all', allBtn);
  sidebar.appendChild(allBtn);

  types.forEach(type => {
    const count = lessons.filter(lesson => lesson.type === type.id).length;
    if (!count) return;
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.textContent = `${type.title} (${count})`;
    btn.onclick = () => filterCat(type.id, btn);
    sidebar.appendChild(btn);
  });

  document.getElementById('loading').style.display = 'none';
  document.getElementById('lessonGrid').style.display = 'flex';
  rebuildGrid(lessons, types, getVisited());
}

function rebuildGrid(lessons, types, visited) {
  const grid = document.getElementById('lessonGrid');
  grid.innerHTML = '';
  let visible = 0;

  const filtered = lessons.filter(lesson => currentCat === 'all' || lesson.type === currentCat);

  if (sortMode === 'order') {
    filtered.sort((a, b) => a.id.localeCompare(b.id));
    filtered.forEach(lesson => { grid.appendChild(buildCard(lesson, types, visited)); visible += 1; });
  } else {
    const grouped = {};
    filtered.forEach(lesson => { grouped[lesson.type] = grouped[lesson.type] || []; grouped[lesson.type].push(lesson); });
    types.forEach(type => {
      const group = grouped[type.id] || [];
      if (!group.length) return;
      const header = buildTypeHeader(type, group.length);
      grid.appendChild(header);
      group.sort((a, b) => a.id.localeCompare(b.id)).forEach(lesson => { grid.appendChild(buildCard(lesson, types, visited)); visible += 1; });
    });
  }

  document.getElementById('visibleCount').textContent = visible;
  document.getElementById('emptyMsg').style.display = visible ? 'none' : 'block';
}

function setSortMode(mode, button) {
  sortMode = mode;
  document.querySelectorAll('.sort-pill').forEach(btn => btn.classList.toggle('active', btn === button));
  rebuildGrid(allLessons, allTypes, getVisited());
}

function filterCat(category, button) {
  currentCat = category;
  document.querySelectorAll('.tab-btn, .filter-btn').forEach(btn => btn.classList.remove('active'));
  if (button) button.classList.add('active');
  rebuildGrid(allLessons, allTypes, getVisited());
}

function doSearch(query) {
  const normalized = (query || '').trim().toLowerCase();
  if (!normalized) {
    rebuildGrid(allLessons, allTypes, getVisited());
    return;
  }
  const matched = allLessons.filter(lesson => (`${lesson.title} ${lesson.description || ''} ${(lesson.tags || []).join(' ')}`).toLowerCase().includes(normalized));
  rebuildGrid(matched, allTypes, getVisited());
}

function toggleType(typeId, event) {
  const header = event.currentTarget.closest('.type-header');
  if (!header) return;
  const expanded = !header.classList.toggle('collapsed');
  const group = document.querySelector(`.lesson-card[data-cat='${typeId}']`);
  header.querySelector('.type-chevron').textContent = expanded ? '›' : '˅';
}

async function loadJson(file) {
  const response = await fetch(file);
  if (!response.ok) throw new Error(`Không tải được ${file}`);
  return response.json();
}

async function init() {
  try {
    const data = await loadJson(LESSONS_FILE);
    const quickLinks = await loadJson(QUICK_LINKS_FILE).catch(() => []);

    document.getElementById('seriesTitle').innerHTML = data.title || 'Bộ tài liệu mẫu';
    document.getElementById('seriesDesc').textContent = data.description || 'Sử dụng cấu trúc này để tạo tài liệu học tập mới.';
    buildQuickNav(quickLinks);
    renderAll(data.lessons || [], data.types || []);
  } catch (error) {
    document.getElementById('loading').textContent = 'Không thể tải dữ liệu bài học.';
    console.error(error);
  }
}

window.addEventListener('load', init);
