# 🚀 Build Guide - C# Interview Prep

This document explains how to build both the **Study Site** and **Flash Cards** from your study materials.

## Quick Start

### Build Everything (Recommended)

```powershell
# Run from repository root
.\build-all.ps1
```

This PowerShell script builds:
1. ✅ **Study Site** - Full documentation with navigation (`study-site/dist/`)
2. ✅ **Flash Cards** - Auto-rotating Q&A with code examples (`flash-card-web-site/flash-card-data.js`)

---

## Individual Builds

### Study Site

Generates a complete static documentation site from `notes/` and `practice/` folders.

```bash
cd study-site
node build.js

# Output: study-site/dist/
# Contains: HTML pages with navigation, search, and themed UI
```

**To view:**
```bash
cd study-site/dist
npx serve .
# Open http://localhost:3000
```

### Flash Cards

Extracts Q&A pairs and code examples to create auto-rotating flash cards.

```bash
cd flash-card-web-site
npm run build
# or
node build.js

# Output: flash-card-web-site/flash-card-data.js
# Contains: JSON array of flash cards with questions, answers, and code
```

**To view:**
```bash
cd flash-card-web-site
npm run serve
# or
npx serve .
# Open http://localhost:3000
```

---

## What Gets Extracted?

### From Markdown Files (`notes/` and `practice/`)

#### 1. Q&A Pairs
The build script extracts questions and answers:

```markdown
**Q: What is the Single Responsibility Principle?**

A: A class should have one and only one reason to change.
```

Becomes a flash card:
- **Question**: "What is the Single Responsibility Principle?"
- **Answer**: "A class should have one and only one reason to change."
- **Category**: notes
- **Topic**: SOLID

#### 2. Code Examples (Good vs Bad)

```markdown
### ❌ Bad example:
\`\`\`csharp
public class TradeManager
{
    public void ValidateOrder(Order order) { /* ... */ }
    public void ExecuteOrder(Order order) { /* ... */ }
    public void LogOrder(Order order) { /* ... */ }
}
\`\`\`

### ✅ Good example:
\`\`\`csharp
public class OrderValidator
{
    public bool Validate(Order order) => order.Amount > 0;
}
\`\`\`
```

Becomes flash cards with:
- **Bad Practice** indicator (red border, ❌ badge)
- **Good Practice** indicator (green border, ✅ badge)
- Syntax-highlighted code
- Category and topic metadata

---

## Build Output

### Study Site Structure

```
study-site/dist/
├── index.html                  # Landing page
├── notes/
│   ├── SOLID/
│   │   ├── index.html
│   │   ├── S-Single-Responsibility-Principle-SRP.html
│   │   └── ...
│   ├── Design-Patterns/
│   └── ...
├── practice/
│   └── ...
├── assets/
│   ├── styles.css
│   └── manifest.webmanifest
└── service-worker.js
```

### Flash Cards Data

```javascript
window.FLASH_CARD_DATA = [
  {
    "id": "card-1",
    "question": "Why are SOLID principles important for senior engineers?",
    "answer": [
      {
        "type": "text",
        "content": "They're heuristics for keeping codebases maintainable..."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/index.md"
  },
  {
    "id": "card-2",
    "question": "Bad Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TradeManager...",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/S-Single-Responsibility-Principle-SRP.md",
    "isConcept": true
  }
  // ... 574 cards total
]
```

---

## Build Statistics (Current)

**Study Site:**
- 62 markdown files processed
- Converts to themed HTML with:
  - Collapsible navigation
  - Table of contents per page
  - Theme switcher (Light/Dark/Midnight)
  - Service worker for offline access

**Flash Cards:**
- 574 flash cards generated
  - 512 Q&A pairs
  - 62 code examples (good/bad practices)
- 290KB JavaScript file
- Auto-rotation every 10 seconds
- Fade transitions
- Categorized by topic

---

## Requirements

- **Node.js** (v14 or higher)
- **PowerShell** (for build-all script, or use bash equivalent)

## Troubleshooting

### Build script not found
```bash
# Ensure you're in the correct directory
pwd
# Should show: .../cSharpInterviewPrep

# Check build scripts exist
ls study-site/build.js
ls flash-card-web-site/build.js
```

### No flash cards generated
```bash
# Check markdown files exist
ls notes/
ls practice/

# Verify Q&A format in markdown:
# Must use: **Q: question** and A: answer
```

### Changes not reflected
```bash
# Rebuild after editing notes/practice
cd flash-card-web-site
npm run build

# Or rebuild everything
.\build-all.ps1
```

---

## Deployment

### Study Site
```bash
# Deploy study-site/dist/ to:
# - Netlify, Vercel, GitHub Pages
# - Any static hosting service

# Example: Netlify
netlify deploy --dir=study-site/dist --prod
```

### Flash Cards
```bash
# Deploy entire flash-card-web-site/ folder to:
# - Netlify, Vercel, GitHub Pages
# - Any static hosting service

# Example: GitHub Pages
# Copy flash-card-web-site/* to gh-pages branch
```

---

## Adding New Content

1. **Add markdown files** to `notes/` or `practice/`
2. **Use Q&A format**:
   ```markdown
   **Q: Your question here?**

   A: Your answer here.
   ```

3. **Add code examples** with indicators:
   ```markdown
   ### ❌ Bad example:
   \`\`\`csharp
   // bad code
   \`\`\`

   ### ✅ Good example:
   \`\`\`csharp
   // good code
   \`\`\`
   ```

4. **Rebuild**:
   ```bash
   .\build-all.ps1
   ```

5. **Test locally**:
   ```bash
   # Study site
   cd study-site/dist && npx serve .

   # Flash cards
   cd flash-card-web-site && npx serve .
   ```

---

## Scripts Reference

| Script | Purpose | Output |
|--------|---------|--------|
| `build-all.ps1` | Build both sites | Study site HTML + Flash cards JSON |
| `study-site/build.js` | Generate study site | `study-site/dist/` |
| `flash-card-web-site/build.js` | Generate flash cards | `flash-card-data.js` |

## NPM Commands

```bash
# Flash Cards
cd flash-card-web-site
npm run build     # Generate flash cards
npm run serve     # Serve locally
npm start         # Build + serve
```

---

## File Watching (Optional)

For development, you can use a file watcher to auto-rebuild on changes:

```bash
# Install nodemon globally
npm install -g nodemon

# Watch notes and practice folders
nodemon --watch ../notes --watch ../practice --exec "node build.js"
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build Sites
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Build Study Site
        run: |
          cd study-site
          node build.js
      - name: Build Flash Cards
        run: |
          cd flash-card-web-site
          node build.js
      - name: Deploy
        # Add your deployment step here
```

---

## License

MIT - See LICENSE file for details
