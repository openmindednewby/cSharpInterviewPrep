# Study Site Generator

> Static site pipeline that turns the `notes` and `practice` Markdown folders into a deployable HTML study portal for senior .NET developers.

## What it does
- Keeps the source of truth in Markdown while producing production-ready HTML under `study-site/dist`.
- Builds navigation that groups **Notes** and **Practice** content with anchored headings.
- Adds a polished dark theme, code highlighting, and automatic table of contents for every page.

## How to use
1. Install dependencies (from the `study-site` folder):
   ```bash
   npm install
   ```
2. Build the site:
   ```bash
   npm run build
   ```

   - Output lands in `study-site/dist`. Content mirrors the Markdown tree and is ready to drop into static hosting.

## Structure
- `build.js` – Node-based generator that discovers Markdown files, injects navigation, and renders HTML.
- `assets/styles.css` – Theme, layout, and component styling for the cheat sheet.
- `dist/` – Generated HTML and assets (created by the build step).

## Deployment tips
- Serve `study-site/dist` with any static host (GitHub Pages, Azure Static Web Apps, Netlify, Vercel, or S3 + CDN).
- Re-run `npm run build` whenever the Markdown changes to refresh the site.
