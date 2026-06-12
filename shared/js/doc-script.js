// Tính năng thêm nút Copy vào các khối mã code
const storagePrefix = location.pathname
  .split('/')
  .filter(Boolean)
  .slice(0, -1)
  .join('_')
  .replace(/[^\w-]+/g, '_') || 'docs';
const tocStorageKey = `${storagePrefix}_toc_collapsed`;
const visitedStorageKey = `${storagePrefix}_visited`;
const topnavLeft = document.querySelector('.topnav-left');
const aside = document.querySelector('aside');

if (topnavLeft && aside) {
  const tocToggle = document.createElement('button');
  tocToggle.type = 'button';
  tocToggle.className = 'toc-toggle';
  topnavLeft.insertBefore(tocToggle, topnavLeft.firstChild);

  const setTocState = isCollapsed => {
    document.body.classList.toggle('toc-collapsed', isCollapsed);
    tocToggle.textContent = isCollapsed ? '☰ Mục lục' : '× Ẩn mục lục';
    tocToggle.setAttribute('aria-expanded', String(!isCollapsed));
    try {
      localStorage.setItem(tocStorageKey, isCollapsed ? '1' : '0');
    } catch (e) {}
  };

  let isTocCollapsed = false;
  try {
    isTocCollapsed = localStorage.getItem(tocStorageKey) === '1';
  } catch (e) {}

  setTocState(isTocCollapsed);
  tocToggle.addEventListener('click', () => {
    setTocState(!document.body.classList.contains('toc-collapsed'));
  });
}

document.querySelectorAll('pre').forEach(pre => {
  const wrap = document.createElement('div');
  wrap.className = 'pre-wrap';
  pre.parentNode.insertBefore(wrap, pre);
  wrap.appendChild(pre);

  const btn = document.createElement('button');
  btn.className = 'copy-btn';
  btn.textContent = 'Copy';
  btn.setAttribute('aria-label', 'Copy code snippet');
  
  btn.onclick = () => {
    navigator.clipboard.writeText(pre.innerText.trim()).then(() => {
      btn.textContent = '✓ Đã copy';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    }).catch(err => {
      console.error('Không thể sao chép văn bản: ', err);
    });
  };
  wrap.appendChild(btn);
});

// Scroll Spy: Tự động kích hoạt trạng thái danh mục bên Sidebar khi cuộn đến vùng tương ứng
const links = document.querySelectorAll('aside a[href^="#"]');
const sections = [...links]
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if (sections.length > 0) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => link.classList.remove('active'));
        const active = [...links].find(link => link.getAttribute('href') === '#' + entry.target.id);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px' });

  sections.forEach(section => observer.observe(section));
}

// Tự động tạo breadcrumb và nút Bài trước / Bài sau từ lessons.json
const currentFile = location.pathname.split('/').pop();
const topnavRight = document.querySelector('[data-lesson-nav]') || document.querySelector('.topnav-right');
const breadcrumb = document.querySelector('.topnav-breadcrumb');
const lessonAnchors = document.querySelectorAll('[data-lesson-id]');

if ((topnavRight || breadcrumb || lessonAnchors.length > 0) && currentFile) {
  fetch('lessons.json')
    .then(response => response.ok ? response.json() : Promise.reject(response))
    .then(data => {
      const publishedLessons = (data.lessons || [])
        .filter(lesson => lesson.id && lesson.file && lesson.status === 'published');
      const currentIndex = publishedLessons.findIndex(lesson => lesson.file === currentFile);
      const currentLesson = publishedLessons[currentIndex];

      const lessonLinkMap = Object.fromEntries(
        publishedLessons.map(lesson => [lesson.id, lesson.file])
      );

      lessonAnchors.forEach(anchor => {
        const id = anchor.dataset.lessonId;
        if (id && lessonLinkMap[id]) anchor.href = lessonLinkMap[id];
      });

      if (!currentLesson) return;

      if (breadcrumb) {
        breadcrumb.innerHTML = `<span>/</span> Bài ${currentLesson.id}`;
      }

      if (topnavRight) {
        const previousLesson = publishedLessons[currentIndex - 1];
        const nextLesson = publishedLessons[currentIndex + 1];

        topnavRight.innerHTML = '';

        if (previousLesson) {
          const previousLink = document.createElement('a');
          previousLink.className = 'nav-pill';
          previousLink.href = previousLesson.file;
          previousLink.textContent = '← Bài trước';
          topnavRight.appendChild(previousLink);
        } else {
          const previousDisabled = document.createElement('span');
          previousDisabled.className = 'nav-pill disabled';
          previousDisabled.textContent = '← Bài trước';
          topnavRight.appendChild(previousDisabled);
        }

        if (nextLesson) {
          const nextLink = document.createElement('a');
          nextLink.className = 'nav-pill';
          nextLink.href = nextLesson.file;
          nextLink.textContent = 'Bài sau →';
          topnavRight.appendChild(nextLink);
        } else {
          const nextDisabled = document.createElement('span');
          nextDisabled.className = 'nav-pill disabled';
          nextDisabled.textContent = 'Bài sau →';
          topnavRight.appendChild(nextDisabled);
        }
      }
    })
    .catch(error => {
      console.warn('Không thể tải lessons.json để tạo liên kết bài học:', error);
    });
}

// Thanh tiến trình đọc (Reading Progress) được tối ưu bằng requestAnimationFrame hiệu năng cao
const bar = document.getElementById('readProgress');
if (bar) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const doc = document.documentElement;
        const totalHeight = doc.scrollHeight - doc.clientHeight;
        const pct = totalHeight > 0 ? (doc.scrollTop / totalHeight) * 100 : 0;
        bar.style.width = Math.min(pct, 100) + '%';
        ticking = false;
      });
      ticking = true;
    }
  });
}

// Lưu trạng thái bài học đã đọc vào LocalStorage
try {
  const visited = JSON.parse(localStorage.getItem(visitedStorageKey) || '[]');
  if (currentFile && !visited.includes(currentFile)) {
    visited.push(currentFile);
    localStorage.setItem(visitedStorageKey, JSON.stringify(visited));
  }
} catch (e) {
  console.warn('Không thể truy cập LocalStorage:', e);
}
