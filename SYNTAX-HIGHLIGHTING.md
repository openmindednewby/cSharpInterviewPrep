# Syntax Highlighting Documentation

Both the **Study Site** and **Flash Card Site** now feature Visual Studio-style syntax highlighting for C# code using Prism.js.

## Features

### Visual Studio Dark Theme Colors
- **Keywords** (`public`, `class`, `if`, `return`): Blue `#569cd6`
- **Types/Classes** (`Order`, `List<T>`, `IEnumerable`): Cyan `#4ec9b0`
- **Strings**: Brown `#ce9178`
- **Numbers**: Light green `#b5cea8`
- **Comments**: Green `#6a9955` (italic)
- **Functions/Methods**: Yellow `#dcdcaa`
- **Properties/Variables**: Light blue `#9cdcfe`
- **Operators/Punctuation**: Gray `#d4d4d4`

### Visual Studio Light Theme Colors
When using the light theme (study-site only):
- **Keywords**: Blue `#0000ff`
- **Types/Classes**: Teal `#267f99`
- **Strings**: Red `#a31515`
- **Comments**: Green `#008000`
- **Functions**: Brown `#795e26`

## Implementation

### Flash Card Web Site

**Files Modified:**
- [index.html](flash-card-web-site/index.html) - Added Prism.js CDN links
- [script.js](flash-card-web-site/script.js) - Added `Prism.highlightElement()` call
- [styles.css](flash-card-web-site/styles.css) - Added VS theme colors

**CDN Resources:**
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-csharp.min.js"></script>
```

### Study Site

**Files Modified:**
- [build.js](study-site/build.js) - Modified code fence rendering to use Prism classes
- [assets/styles.css](study-site/assets/styles.css) - Added VS theme colors

**Code Block Generation:**
```html
<pre class="language-csharp"><code class="language-csharp">
  // Your C# code here
</code></pre>
```

## Supported Languages

While the primary focus is C#, Prism.js supports many languages. To add more:

1. Load the language component:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
   ```

2. Use in markdown:
   ````markdown
   ```javascript
   const foo = 'bar';
   ```
   ````

## Token Types Highlighted

The following C# syntax elements are highlighted:

| Token | Description | Example |
|-------|-------------|---------|
| `.token.keyword` | Language keywords | `public`, `class`, `if`, `using` |
| `.token.class-name` | Type names | `Order`, `IEnumerable<T>` |
| `.token.string` | String literals | `"Hello World"` |
| `.token.number` | Numeric literals | `42`, `3.14m` |
| `.token.comment` | Code comments | `// comment`, `/* block */` |
| `.token.function` | Method names | `GetOrders()`, `ToString()` |
| `.token.property` | Properties | `order.Id`, `user.Name` |
| `.token.operator` | Operators | `=`, `+`, `=>` |
| `.token.boolean` | Boolean values | `true`, `false`, `null` |
| `.token.annotation` | Attributes | `[HttpGet]`, `[Required]` |
| `.token.namespace` | Namespaces | `System.Linq` |

## How It Works

### Automatic Highlighting (Study Site)

When the study site is built:
1. Markdown code fences are detected: ` ```csharp `
2. HTML is generated with proper Prism classes
3. Prism.js automatically highlights on page load

### Manual Highlighting (Flash Cards)

When flash cards are displayed:
1. Code blocks are created dynamically
2. `Prism.highlightElement(code)` is called explicitly
3. Syntax highlighting is applied immediately

## Testing

To see syntax highlighting in action:

1. **Build both sites:**
   ```bash
   ./build-all.sh
   ```

2. **View Study Site:**
   ```bash
   cd study-site/dist && npx serve .
   ```
   Open any page with code examples (e.g., SOLID principles)

3. **View Flash Cards:**
   ```bash
   cd flash-card-web-site && npx serve .
   ```
   Watch for code example cards with syntax highlighting

## Performance

- **Prism.js size**: ~2KB (core) + ~1KB (C# language)
- **Loaded from CDN**: Cached by browser
- **No build-time processing**: Highlighting happens client-side
- **Lazy loading**: Could be implemented if needed

## Customization

To change colors, edit the `.token.*` classes in:
- `flash-card-web-site/styles.css`
- `study-site/assets/styles.css`

Example - change keyword color to red:
```css
.token.keyword {
  color: #ff0000; /* Red instead of blue */
}
```

## Troubleshooting

### Code not highlighted?

1. Check browser console for errors
2. Verify Prism.js CDN loaded:
   ```javascript
   console.log(typeof Prism); // Should output "object"
   ```
3. Verify code has correct classes:
   ```html
   <code class="language-csharp">...</code>
   ```

### Wrong colors?

1. Check CSS specificity - custom styles might be overriding
2. Verify theme is loaded (dark/light)
3. Clear browser cache

### Code blocks not detected in markdown?

1. Ensure proper fence syntax: ` ```csharp `
2. Check for trailing spaces after fence
3. Rebuild after markdown changes

## Resources

- [Prism.js Documentation](https://prismjs.com/)
- [Prism C# Support](https://prismjs.com/languages/csharp/)
- [Visual Studio Color Theme](https://code.visualstudio.com/docs/getstarted/themes)

## Future Enhancements

Potential improvements:
- [ ] Line numbers for code blocks
- [ ] Copy-to-clipboard button
- [ ] Diff highlighting (additions/deletions)
- [ ] Code folding for long examples
- [ ] Theme-aware color adjustments
