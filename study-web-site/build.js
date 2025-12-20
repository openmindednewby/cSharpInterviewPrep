#!/usr/bin/env node
/**
 * Static site generator for the C# interview prep notes and practice questions.
 * - Reads Markdown from the root-level `notes` and `practice` folders
 * - Converts them into styled HTML cheat sheets under `study-site/dist`
 * - Creates an index page with fast navigation
 */

const fs = require('fs/promises');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const outputRoot = path.join(__dirname, 'dist');
const contentSources = [
  { key: 'notes', label: 'Notes', source: path.join(repoRoot, 'notes') },
  { key: 'practice', label: 'Practice', source: path.join(repoRoot, 'practice') }
];

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function formatInline(text) {
  return text
    .replace(/`([^`]+)`/g, (_, code) => `<code>${escapeHtml(code)}</code>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function buildToc(headings) {
  if (!headings.length) {
    return '<p class="muted">No headings found in this document.</p>';
  }
  const items = headings
    .map((h) => `<li class="level-${h.level}"><a href="#${h.id}">${h.text}</a></li>`)
    .join('');
  return `<ul class="toc-list">${items}</ul>`;
}

function renderMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  const headings = [];
  let inCode = false;
  let codeLines = [];
  let codeLanguage = '';
  let listType = null;
  let listBuffer = [];
  let paragraph = [];
  let blockquote = [];
  let inTable = false;
  let tableBuffer = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${formatInline(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listType) {
      html.push(`<${listType}>${listBuffer.join('')}</${listType}>`);
      listType = null;
      listBuffer = [];
    }
  };

  const flushBlockquote = () => {
    if (blockquote.length) {
      html.push(`<blockquote><p>${formatInline(blockquote.join(' '))}</p></blockquote>`);
      blockquote = [];
    }
  };

  const flushTable = () => {
    if (tableBuffer.length > 0) {
      const rows = tableBuffer.filter(row => !row.match(/^\|[\s:-]+\|/)); // Skip separator rows
      if (rows.length > 0) {
        const headerRow = rows[0];
        const bodyRows = rows.slice(1);

        const parseRow = (row, isHeader) => {
          const cells = row.split('|').slice(1, -1).map(cell => cell.trim());
          const tag = isHeader ? 'th' : 'td';
          return `<tr>${cells.map(cell => `<${tag}>${formatInline(cell)}</${tag}>`).join('')}</tr>`;
        };

        const thead = `<thead>${parseRow(headerRow, true)}</thead>`;
        const tbody = bodyRows.length > 0 ? `<tbody>${bodyRows.map(row => parseRow(row, false)).join('')}</tbody>` : '';

        html.push(`<table>${thead}${tbody}</table>`);
      }
      tableBuffer = [];
      inTable = false;
    }
  };

  for (const line of lines) {
    const fenceMatch = line.match(/^```(\w+)?/);
    if (fenceMatch) {
      if (!inCode) {
        flushParagraph();
        flushList();
        flushBlockquote();
        flushTable();
        inCode = true;
        codeLines = [];
        codeLanguage = fenceMatch[1] || 'csharp';
      } else {
        html.push(`<pre class="language-${codeLanguage}"><code class="language-${codeLanguage}">${escapeHtml(codeLines.join('\n'))}</code></pre>`);
        inCode = false;
        codeLines = [];
        codeLanguage = '';
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushBlockquote();
      flushTable();
      continue;
    }

    // Check for table rows (lines that start and end with |)
    const tableMatch = line.match(/^\|(.+)\|$/);
    if (tableMatch) {
      flushParagraph();
      flushList();
      flushBlockquote();
      inTable = true;
      tableBuffer.push(line.trim());
      continue;
    } else if (inTable) {
      // We were in a table but this line doesn't match, flush the table
      flushTable();
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      flushBlockquote();
      flushTable();
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = slugify(text);
      headings.push({ level, text, id });
      html.push(`<h${level} id="${id}">${formatInline(text)}</h${level}>`);
      continue;
    }

    const listMatch = line.match(/^\s*(\d+\.|[-*+])\s+(.*)/);
    if (listMatch) {
      flushParagraph();
      flushBlockquote();
      flushTable();
      const type = listMatch[1].endsWith('.') ? 'ol' : 'ul';
      if (listType && listType !== type) {
        flushList();
      }
      listType = listType || type;
      listBuffer.push(`<li>${formatInline(listMatch[2])}</li>`);
      continue;
    }

    const quoteMatch = line.match(/^>\s?(.*)/);
    if (quoteMatch) {
      flushParagraph();
      flushList();
      flushTable();
      blockquote.push(quoteMatch[1]);
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  flushBlockquote();
  flushTable();

  return { html: html.join('\n'), headings };
}

function titleFromFilename(filePath) {
  const base = path.basename(filePath, path.extname(filePath));
  return base
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function titleFromPath(filePath) {
  const baseName = path.basename(filePath, path.extname(filePath));
  if (baseName.toLowerCase() === 'index') {
    const parent = path.basename(path.dirname(filePath));
    return titleFromFilename(parent);
  }
  return titleFromFilename(filePath);
}

function formatGroupLabel(labelParts) {
  return labelParts
    .filter(Boolean)
    .map((part) => titleFromFilename(part))
    .join(' / ');
}

function buildTemplate({ title, navHtml, tocHtml, contentHtml, meta }) {
  const description = `Senior .NET study guide for ${title}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${description}" />
  <meta name="theme-color" content="#0f172a" />
  <title>${title} | C# Interview Prep Cheat Sheet</title>
  <link rel="manifest" href="${meta.assetBase}/manifest.webmanifest" />
  <script>
    (() => {
      const supported = ['dark2', 'light', 'dark'];
      const saved = sessionStorage.getItem('study-theme');
      const normalized = saved === 'midnight' ? 'dark2' : saved;
      const fallback = 'light';
      const initial = supported.includes(normalized) ? normalized : fallback;
      document.documentElement.dataset.theme = initial;
      window.__studyTheme = initial;
    })();
  </script>
  <link rel="stylesheet" href="${meta.assetBase}/styles.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <header class="site-header">
    <div>
      <p class="eyebrow">C# Interview Prep</p>
      <h1>Senior .NET Study Portal</h1>
      <p class="subtitle">Ultimate cheat sheets, patterns, and interview-ready scenarios in one place.</p>
    </div>
    <div class="header-actions">
      <div class="theme-switcher" aria-label="Theme selector">
        <label for="theme-select" class="theme-label">Theme</label>
        <select id="theme-select" class="theme-select">
          <option value="dark2">Dark 2</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div class="badge">Fast recall</div>
    </div>
  </header>
  <div class="layout">
    <nav class="sidebar">
      <div class="sidebar-section">
        <h2>Navigation</h2>
        <div class="search-hint">Use Ctrl/Cmd + F for quick lookup</div>
        <div class="sidebar-scroll">${navHtml}</div>
      </div>
    </nav>
    <main class="content">
      <article class="card">
        <div class="breadcrumbs">${meta.breadcrumbs}</div>
        <h2>${title}</h2>
        <div class="toc-label">Rapid overview</div>
        <div class="toc">${tocHtml}</div>
        ${contentHtml}
      </article>
    </main>
  </div>
  <footer class="footer">Built for disciplined study & interview drills.</footer>
  <script>
    (() => {
      const select = document.getElementById('theme-select');
      const supported = ['dark2', 'light', 'dark'];
      const saved = sessionStorage.getItem('study-theme');
      const normalized = saved === 'midnight' ? 'dark2' : saved;
      const fallback = 'light';
      const initial = supported.includes(normalized) ? normalized : (window.__studyTheme || fallback);
      document.documentElement.dataset.theme = initial;
      if (select) {
        select.value = initial;
        select.addEventListener('change', (event) => {
          const value = event.target.value;
          const next = supported.includes(value) ? value : fallback;
          document.documentElement.dataset.theme = next;
          sessionStorage.setItem('study-theme', next);
        });
      }
    })();
    (() => {
      const groups = document.querySelectorAll('.sidebar-group');
      if (!groups.length) return;
      const storageKey = 'study-open-groups';
      const saved = sessionStorage.getItem(storageKey);
      const openFromStorage = new Set(saved ? JSON.parse(saved) : []);

      const activeLink = document.querySelector('.nav-link.active');
      const activeGroup = activeLink?.closest('.sidebar-group');
      if (activeGroup?.dataset.group) {
        openFromStorage.add(activeGroup.dataset.group);
      }

      const syncStorage = () => {
        const openIds = Array.from(document.querySelectorAll('.sidebar-group.is-open'))
          .map((group) => group.dataset.group)
          .filter(Boolean);
        sessionStorage.setItem(storageKey, JSON.stringify(openIds));
      };

      const setExpanded = (group, expanded) => {
        const header = group.querySelector('.sidebar-group__header');
        const list = group.querySelector('.sidebar-group__items');
        group.classList.toggle('is-open', expanded);
        header?.setAttribute('aria-expanded', expanded);
        if (list) {
          list.hidden = !expanded;
        }
      };

      groups.forEach((group) => {
        const shouldOpen = openFromStorage.has(group.dataset.group);
        setExpanded(group, shouldOpen);
        const header = group.querySelector('.sidebar-group__header');
        header?.addEventListener('click', () => {
          const next = !group.classList.contains('is-open');
          setExpanded(group, next);
          syncStorage();
        });
      });
    })();
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        const swPath = '${meta.swPath}';
        navigator.serviceWorker.register(swPath).catch((err) => {
          console.error('Service worker registration failed', err);
        });
      });
    }
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-csharp.min.js"></script>
</body>
</html>`;
}

function navList(groups, basePrefix = '.', activeHref = '') {
  const sectionHtml = groups.map((group) => {
    const groupId = slugify(group.label);
    const items = group.items
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((file) => {
        const isActive = file.href === activeHref;
        const href = path.posix.join(basePrefix, file.href);
        return `<li><a class="nav-link${isActive ? ' active' : ''}" href="${href}">${file.title}</a></li>`;
      })
      .join('');
    const isOpen = group.items.some((item) => item.href === activeHref);
    return `<div class="sidebar-group${isOpen ? ' is-open' : ''}" data-group="${groupId}">
      <button class="sidebar-group__header" type="button" aria-expanded="${isOpen}">
        <span>${group.label}</span>
        <span class="chevron" aria-hidden="true"></span>
      </button>
      <ul class="sidebar-group__items"${isOpen ? '' : ' hidden'}>${items}</ul>
    </div>`;
  }).join('');
  return `<div class="nav-groups">${sectionHtml}</div>`;
}

function computeOutputPath(file) {
  const relativeDir = path.dirname(path.relative(repoRoot, file.sourcePath));
  const safeRel = relativeDir === '.' ? '' : relativeDir.replace(/\\/g, '/');
  const targetDir = path.join(outputRoot, relativeDir);
  const fileName = `${path.basename(file.sourcePath, '.md')}.html`;
  // Store hrefs relative to the output root so we can build page-relative links later
  const href = path.posix.join(safeRel || '.', fileName);
  return { targetDir, outFile: path.join(targetDir, fileName), href };
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function cleanOutput() {
  await fs.rm(outputRoot, { recursive: true, force: true });
  await ensureDir(outputRoot);
}

async function collectMarkdownFiles(baseDir, key) {
  const entries = await fs.readdir(baseDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(baseDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectMarkdownFiles(fullPath, key));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      files.push({
        key,
        sourcePath: fullPath,
        relative: path.relative(repoRoot, fullPath)
      });
    }
  }
  return files;
}

async function buildFile(file, navGroups) {
  const raw = await fs.readFile(file.sourcePath, 'utf-8');
  const { html, headings } = renderMarkdown(raw);
  const tocHtml = buildToc(headings);
  const title = file.title;
  const { targetDir, outFile } = file.output;
  await ensureDir(targetDir);

  const assetBase = path.relative(targetDir, path.join(outputRoot, 'assets')) || '.';
  const navBase = path.relative(targetDir, outputRoot) || '.';
  const swPath = path.posix.join(navBase, 'service-worker.js');
  const template = buildTemplate({
    title,
    navHtml: navList(navGroups, navBase, file.output.href),
    tocHtml,
    contentHtml: html,
    meta: {
      breadcrumbs: file.relative,
      assetBase,
      swPath,
    }
  });

  await fs.writeFile(outFile, template, 'utf-8');
}

async function buildIndex(navGroups) {
  const cards = navGroups.map((group) => {
    const links = group.items
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((item) => `<li><a href="${item.href}">${item.title}</a></li>`)
      .join('');
    return `<section class="card">
      <h2>${group.label}</h2>
      <p class="subtitle">Direct links to ${group.label.toLowerCase()} content.</p>
      <ul class="pill-list">${links}</ul>
    </section>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#0f172a" />
  <title>Study Portal | C# Interview Prep</title>
  <script>
    (() => {
      const supported = ['dark2', 'light', 'dark'];
      const saved = sessionStorage.getItem('study-theme');
      const normalized = saved === 'midnight' ? 'dark2' : saved;
      const fallback = 'light';
      const initial = supported.includes(normalized) ? normalized : fallback;
      document.documentElement.dataset.theme = initial;
      window.__studyTheme = initial;
    })();
  </script>
  <link rel="manifest" href="./assets/manifest.webmanifest" />
  <link rel="stylesheet" href="./assets/styles.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <header class="site-header">
    <div>
      <p class="eyebrow">C# Interview Prep</p>
      <h1>Senior .NET Study Portal</h1>
      <p class="subtitle">All notes & practice questions compiled into a deployable cheat sheet.</p>
    </div>
    <div class="header-actions">
      <div class="theme-switcher" aria-label="Theme selector">
        <label for="theme-select" class="theme-label">Theme</label>
        <select id="theme-select" class="theme-select">
          <option value="dark2">Dark 2</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div class="badge">Built from Markdown</div>
    </div>
  </header>
  <main class="content-grid">
    ${cards}
  </main>
  <footer class="footer">Generate with <code>npm run build</code>. Content lives in the root Markdown files.</footer>
  <script>
    (() => {
      const select = document.getElementById('theme-select');
      const supported = ['dark2', 'light', 'dark'];
      const saved = sessionStorage.getItem('study-theme');
      const normalized = saved === 'midnight' ? 'dark2' : saved;
      const fallback = 'light';
      const initial = supported.includes(normalized) ? normalized : (window.__studyTheme || fallback);
      document.documentElement.dataset.theme = initial;
      if (select) {
        select.value = initial;
        select.addEventListener('change', (event) => {
          const value = event.target.value;
          const next = supported.includes(value) ? value : fallback;
          document.documentElement.dataset.theme = next;
          sessionStorage.setItem('study-theme', next);
        });
      }
    })();
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').catch((err) => {
          console.error('Service worker registration failed', err);
        });
      });
    }
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-csharp.min.js"></script>
</body>
</html>`;

  const outPath = path.join(outputRoot, 'index.html');
  await fs.writeFile(outPath, html, 'utf-8');
}

async function copyAssets() {
  const source = path.join(__dirname, 'assets');
  const dest = path.join(outputRoot, 'assets');
  await ensureDir(dest);
  const files = await fs.readdir(source);
  for (const file of files) {
    if (file === 'service-worker.js') {
      continue;
    }
    await fs.copyFile(path.join(source, file), path.join(dest, file));
  }
  const swSource = path.join(source, 'service-worker.js');
  const swDest = path.join(outputRoot, 'service-worker.js');
  await fs.copyFile(swSource, swDest);
}

async function main() {
  await cleanOutput();

  const allFiles = [];
  for (const src of contentSources) {
    allFiles.push(...await collectMarkdownFiles(src.source, src.key));
  }

  const sourceByKey = new Map(contentSources.map((src) => [src.key, src]));
  const navGroupsMap = new Map();

  const filesWithOutputs = allFiles.map((file) => {
    const source = sourceByKey.get(file.key);
    const title = titleFromPath(file.sourcePath);
    const output = computeOutputPath(file);
    const relativeDir = path.dirname(path.relative(source.source, file.sourcePath));
    const labelParts = [source.label];
    if (relativeDir && relativeDir !== '.') {
      labelParts.push(...relativeDir.split(path.sep));
    }
    const groupLabel = formatGroupLabel(labelParts);
    if (!navGroupsMap.has(groupLabel)) {
      navGroupsMap.set(groupLabel, { label: groupLabel, items: [] });
    }
    navGroupsMap.get(groupLabel).items.push({ title, href: output.href });
    return { ...file, title, output };
  });

  const navGroups = Array.from(navGroupsMap.values())
    .map((group) => ({
      ...group,
      items: group.items.sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  for (const file of filesWithOutputs) {
    await buildFile(file, navGroups);
  }

  await copyAssets();
  await buildIndex(navGroups);
  console.log(`Built ${filesWithOutputs.length} pages into ${outputRoot}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
