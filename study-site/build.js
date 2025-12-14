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
  let listType = null;
  let listBuffer = [];
  let paragraph = [];
  let blockquote = [];

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

  for (const line of lines) {
    if (inCode) {
      if (line.trim().startsWith('```')) {
        html.push(`<pre class="hljs"><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
        inCode = false;
        codeLines = [];
      } else {
        codeLines.push(line);
      }
      continue;
    }

    const fenceMatch = line.match(/^```/);
    if (fenceMatch) {
      flushParagraph();
      flushList();
      flushBlockquote();
      inCode = true;
      codeLines = [];
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushBlockquote();
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      flushBlockquote();
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
      blockquote.push(quoteMatch[1]);
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  flushBlockquote();

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

function buildTemplate({ title, navHtml, tocHtml, contentHtml, meta }) {
  const description = `Senior .NET study guide for ${title}`;
  return `<!DOCTYPE html>
<html lang="en" data-theme="midnight">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${description}" />
  <title>${title} | C# Interview Prep Cheat Sheet</title>
  <link rel="stylesheet" href="${meta.assetBase}/styles.css" />
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
          <option value="midnight">Current</option>
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
        ${navHtml}
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
      const supported = ['midnight', 'light', 'dark'];
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const saved = localStorage.getItem('study-theme');
      const fallback = prefersDark ? 'dark' : 'midnight';
      const initial = supported.includes(saved) ? saved : fallback;
      document.documentElement.dataset.theme = initial;
      if (select) {
        select.value = initial;
        select.addEventListener('change', (event) => {
          const value = event.target.value;
          const next = supported.includes(value) ? value : fallback;
          document.documentElement.dataset.theme = next;
          localStorage.setItem('study-theme', next);
        });
      }
    })();
  </script>
</body>
</html>`;
}

function navList(groups, basePrefix = '.') {
  const sectionHtml = groups.map((group) => {
    const items = group.items
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((file) => `<li><a href="${path.posix.join(basePrefix, file.href)}">${file.title}</a></li>`)
      .join('');
    return `<div class="sidebar-group">
      <h3>${group.label}</h3>
      <ul>${items}</ul>
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
  const template = buildTemplate({
    title,
    navHtml: navList(navGroups, navBase),
    tocHtml,
    contentHtml: html,
    meta: {
      breadcrumbs: file.relative,
      assetBase,
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
<html lang="en" data-theme="midnight">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Study Portal | C# Interview Prep</title>
  <link rel="stylesheet" href="./assets/styles.css" />
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
          <option value="midnight">Current</option>
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
      const supported = ['midnight', 'light', 'dark'];
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const saved = localStorage.getItem('study-theme');
      const fallback = prefersDark ? 'dark' : 'midnight';
      const initial = supported.includes(saved) ? saved : fallback;
      document.documentElement.dataset.theme = initial;
      if (select) {
        select.value = initial;
        select.addEventListener('change', (event) => {
          const value = event.target.value;
          const next = supported.includes(value) ? value : fallback;
          document.documentElement.dataset.theme = next;
          localStorage.setItem('study-theme', next);
        });
      }
    })();
  </script>
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
    await fs.copyFile(path.join(source, file), path.join(dest, file));
  }
}

async function main() {
  await cleanOutput();

  const allFiles = [];
  for (const src of contentSources) {
    allFiles.push(...await collectMarkdownFiles(src.source, src.key));
  }

  const navGroups = contentSources.map((group) => ({
    label: group.label,
    items: [],
  }));

  const filesWithOutputs = allFiles.map((file) => {
    const title = titleFromFilename(file.sourcePath);
    const output = computeOutputPath(file);
    const group = navGroups.find((g) => g.label.toLowerCase() === file.key.toLowerCase());
    if (group) {
      group.items.push({ title, href: output.href });
    }
    return { ...file, title, output };
  });

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
