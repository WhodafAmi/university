// Removed old imperative DOMContentLoaded boot that directly showed page content:
// removed function showPage(pageId) {}
// removed document.addEventListener('DOMContentLoaded', ...) {}

const components = {
  header: 'components/header.html',
  footer: 'components/footer.html',
};

const pages = {
  page1: 'pages/about.html',
  page2: 'pages/resume.html',
  page3: 'pages/report.html',
};

async function fetchText(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return await res.text();
}

async function loadComponent(targetSelector, path) {
  const html = await fetchText(path);
  document.querySelector(targetSelector).innerHTML = html;
}

async function loadPage(pageId) {
  const pagePath = pages[pageId];
  if (!pagePath) return;
  const html = await fetchText(pagePath);
  const main = document.getElementById('main-root');
  main.innerHTML = html;
  // Ensure the loaded page section is visible:
  // - Remove .active from any .page inside main-root's parent (if present)
  // - Add .active to the first .page element of the newly loaded fragment
  const allPages = document.querySelectorAll('.page');
  allPages.forEach(p => p.classList.remove('active'));
  const newPage = main.querySelector('.page');
  if (newPage) newPage.classList.add('active');
  // Reattach page navigation handlers if present in header
  attachNavHandlers();
  // Scroll to top after loading
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function attachNavHandlers() {
  // Replace any links with data-page attribute to use SPA loading
  const links = document.querySelectorAll('[data-page]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      if (page) loadPage(page);
    });
  });
}

// Initialize app: load header, footer, then default page
async function init() {
  try {
    await loadComponent('#header-root', components.header);
    await loadComponent('#footer-root', components.footer);
    // Attach handlers to header links
    attachNavHandlers();
    // Load default page
    await loadPage('page1');
  } catch (err) {
    console.error('App init error:', err);
    document.getElementById('main-root').innerHTML = '<p>Помилка завантаження сторінки.</p>';
  }
}

document.addEventListener('DOMContentLoaded', init);

