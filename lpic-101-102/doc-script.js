// Tính năng thêm nút Copy vào các khối mã code
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
      localStorage.setItem('hoc_git_toc_collapsed', isCollapsed ? '1' : '0');
    } catch (e) {}
  };

  let isTocCollapsed = false;
  try {
    isTocCollapsed = localStorage.getItem('hoc_git_toc_collapsed') === '1';
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

// Map danh sách các bài học động dựa vào thuộc tính `data-lesson-id`
const lessonLinkMap = {
  '01': '01-cau-lenh-co-ban-quan-ly-file-thu-muc.html',
  '02': '02-cach-tao-repository-git.html',
  '03': '03-cau-hinh-thong-tin-cho-repository.html',
  '04': '04-thuc-hanh-git-add-commit-status-diff-log.html',
  '05': '05-cau-hinh-gitignore-de-bo-qua-cac-file-khong-can-giam-sat.html'
};

document.querySelectorAll('[data-lesson-id]').forEach(anchor => {
  const id = anchor.dataset.lessonId;
  if (id && lessonLinkMap[id]) anchor.href = lessonLinkMap[id];
});

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
  const visited = JSON.parse(localStorage.getItem('hoc_git_visited') || '[]');
  const currentFile = location.pathname.split('/').pop();
  if (currentFile && !visited.includes(currentFile)) {
    visited.push(currentFile);
    localStorage.setItem('hoc_git_visited', JSON.stringify(visited));
  }
} catch (e) {
  console.warn('Không thể truy cập LocalStorage:', e);
}
