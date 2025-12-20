#!/usr/bin/env node
/**
 * Flash card data generator for C# interview prep.
 * - Reads Markdown from the root-level `notes` and `practice` folders
 * - Extracts Q&A sections, code examples (good/bad), and key concepts
 * - Generates flash-card-data.js with questions, answers, and code snippets
 */

const fs = require('fs/promises');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const outputFile = path.join(__dirname, 'flash-card-data.js');
const contentSources = [
  { key: 'notes', source: path.join(repoRoot, 'notes') },
  { key: 'practice', source: path.join(repoRoot, 'practice') }
];

/**
 * Clean markdown formatting from text
 */
function cleanMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')  // Remove bold **text**
    .replace(/\*(.+?)\*/g, '$1')      // Remove italic *text*
    .replace(/`(.+?)`/g, '$1')        // Remove inline code `text`
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links [text](url)
    .trim();
}

/**
 * Extract Q&A pairs from markdown sections
 */
function extractQA(markdown, sourcePath) {
  const cards = [];
  const lines = markdown.split(/\r?\n/);
  let currentQuestion = null;
  let currentAnswer = [];
  let inCodeBlock = false;
  let codeLanguage = '';
  let codeLines = [];
  let codeType = null; // 'good' or 'bad'

  const sourceFile = path.relative(repoRoot, sourcePath).replace(/\\/g, '/');
  const category = sourceFile.split('/')[0]; // 'notes' or 'practice'
  const topic = sourceFile.split('/')[1] || 'General';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect code fence
    const codeFenceMatch = line.match(/^```(\w+)?/);
    if (codeFenceMatch) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = codeFenceMatch[1] || '';
        codeLines = [];

        // Check previous lines for good/bad indicators
        for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
          const prevLine = lines[j].trim().toLowerCase();
          if (prevLine.includes('❌') || prevLine.includes('bad example')) {
            codeType = 'bad';
            break;
          } else if (prevLine.includes('✅') || prevLine.includes('good example')) {
            codeType = 'good';
            break;
          }
        }
      } else {
        // End of code block
        if (currentAnswer.length > 0 && codeLines.length > 0) {
          currentAnswer.push({
            type: 'code',
            language: codeLanguage || 'csharp',
            code: codeLines.join('\n'),
            codeType: codeType || 'neutral'
          });
        }
        inCodeBlock = false;
        codeLines = [];
        codeType = null;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Match Q&A pattern: **Q: question text**
    const questionMatch = line.match(/^\*\*Q:\s*(.+?)\*\*$/);
    if (questionMatch) {
      // Save previous Q&A if exists
      if (currentQuestion && currentAnswer.length > 0) {
        cards.push({
          question: currentQuestion,
          answer: currentAnswer,
          category,
          topic,
          source: sourceFile
        });
      }

      currentQuestion = cleanMarkdown(questionMatch[1]);
      currentAnswer = [];
      continue;
    }

    // Match answer pattern: A: answer text
    const answerMatch = line.match(/^A:\s*(.+)/);
    if (answerMatch && currentQuestion) {
      currentAnswer.push({
        type: 'text',
        content: cleanMarkdown(answerMatch[1])
      });
      continue;
    }

    // Continue answer if we have a question and the line is not empty
    if (currentQuestion && line.trim() && !line.match(/^#+\s/) && !line.match(/^---+$/)) {
      // Skip certain lines
      if (line.startsWith('##') || line.startsWith('###') || line.startsWith('💡')) {
        continue;
      }

      // If the line looks like continuation of answer
      if (currentAnswer.length > 0) {
        const lastItem = currentAnswer[currentAnswer.length - 1];
        if (lastItem.type === 'text') {
          lastItem.content += ' ' + cleanMarkdown(line);
        }
      }
    }

    // Detect section headers for key concepts
    const headerMatch = line.match(/^##\s+(.+)/);
    if (headerMatch) {
      // Save any pending Q&A
      if (currentQuestion && currentAnswer.length > 0) {
        cards.push({
          question: currentQuestion,
          answer: currentAnswer,
          category,
          topic,
          source: sourceFile
        });
        currentQuestion = null;
        currentAnswer = [];
      }
    }
  }

  // Save final Q&A if exists
  if (currentQuestion && currentAnswer.length > 0) {
    cards.push({
      question: currentQuestion,
      answer: currentAnswer,
      category,
      topic,
      source: sourceFile
    });
  }

  return cards;
}

/**
 * Extract detailed sections (h3 headers with content)
 */
function extractSections(markdown, sourcePath) {
  const sections = [];
  const lines = markdown.split(/\r?\n/);
  let currentSection = null;
  let sectionContent = [];
  let inCodeBlock = false;
  let codeLanguage = '';
  let codeLines = [];
  let inList = false;
  let listItems = [];

  const sourceFile = path.relative(repoRoot, sourcePath).replace(/\\/g, '/');
  const category = sourceFile.split('/')[0];
  const topic = sourceFile.split('/')[1] || 'General';

  const saveSection = () => {
    if (currentSection && sectionContent.length > 0) {
      sections.push({
        question: currentSection,
        answer: sectionContent,
        category,
        topic,
        source: sourceFile,
        isSection: true
      });
    }
    currentSection = null;
    sectionContent = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect h3 headers (###)
    const h3Match = line.match(/^###\s+(.+)/);
    if (h3Match) {
      // Save previous section
      saveSection();

      // Start new section
      currentSection = cleanMarkdown(h3Match[1]);
      sectionContent = [];
      inList = false;
      continue;
    }

    // If we have a current section, collect content
    if (currentSection) {
      // Handle code blocks
      const codeFenceMatch = line.match(/^```(\w+)?/);
      if (codeFenceMatch) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = codeFenceMatch[1] || 'csharp';
          codeLines = [];
        } else {
          // End of code block
          if (codeLines.length > 0) {
            sectionContent.push({
              type: 'code',
              language: codeLanguage,
              code: codeLines.join('\n'),
              codeType: 'neutral'
            });
          }
          inCodeBlock = false;
          codeLines = [];
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      // Handle lists
      const listMatch = line.match(/^\s*[-*]\s+(.+)/);
      if (listMatch) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        listItems.push(cleanMarkdown(listMatch[1]));
        continue;
      } else if (inList && line.trim() === '') {
        // End of list
        if (listItems.length > 0) {
          sectionContent.push({
            type: 'list',
            items: [...listItems]
          });
        }
        inList = false;
        listItems = [];
        continue;
      } else if (inList && line.trim()) {
        // Continuation of list item
        if (listItems.length > 0) {
          listItems[listItems.length - 1] += ' ' + cleanMarkdown(line);
        }
        continue;
      }

      // Handle regular text paragraphs
      if (line.trim() && !line.startsWith('#') && !line.match(/^---+$/)) {
        // Skip if it's a separator or another header type
        if (!line.startsWith('##') && !line.startsWith('**Q:')) {
          sectionContent.push({
            type: 'text',
            content: cleanMarkdown(line)
          });
        }
      }

      // Stop section at horizontal rule (but NOT at h2 headers, as h3 can be inside h2)
      if (line.match(/^---+$/)) {
        saveSection();
      }
    }
  }

  // Save final section
  saveSection();

  return sections;
}

/**
 * Extract key concepts and examples from markdown
 */
function extractConcepts(markdown, sourcePath) {
  const concepts = [];
  const lines = markdown.split(/\r?\n/);
  let inCodeBlock = false;
  let codeLanguage = '';
  let codeLines = [];
  let codeType = null;
  let conceptTitle = null;
  let conceptDescription = [];

  const sourceFile = path.relative(repoRoot, sourcePath).replace(/\\/g, '/');
  const category = sourceFile.split('/')[0];
  const topic = sourceFile.split('/')[1] || 'General';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code fence detection
    const codeFenceMatch = line.match(/^```(\w+)?/);
    if (codeFenceMatch) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = codeFenceMatch[1] || 'csharp';
        codeLines = [];

        // Look for good/bad indicators
        for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
          const prevLine = lines[j].trim();
          if (prevLine.includes('❌') || prevLine.toLowerCase().includes('bad example')) {
            codeType = 'bad';
            break;
          } else if (prevLine.includes('✅') || prevLine.toLowerCase().includes('good example')) {
            codeType = 'good';
            break;
          }
        }
      } else {
        // End of code block - create a concept card
        if (codeType && codeLines.length > 0) {
          const title = conceptTitle || `${codeType === 'good' ? 'Good' : 'Bad'} Practice Example`;
          concepts.push({
            question: title,
            answer: [
              {
                type: 'code',
                language: codeLanguage,
                code: codeLines.join('\n'),
                codeType
              }
            ],
            category,
            topic,
            source: sourceFile,
            isConcept: true
          });
        }
        inCodeBlock = false;
        codeLines = [];
        codeType = null;
        conceptTitle = null;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Capture section headers as potential concept titles
    const headerMatch = line.match(/^##\s+(.+)/);
    if (headerMatch) {
      conceptTitle = cleanMarkdown(headerMatch[1]);
    }
  }

  return concepts;
}

/**
 * Recursively collect markdown files
 */
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

/**
 * Main build function
 */
async function main() {
  console.log('🎴 Generating flash card data from notes and practice...\n');

  const allFiles = [];
  for (const src of contentSources) {
    const files = await collectMarkdownFiles(src.source, src.key);
    allFiles.push(...files);
    console.log(`📁 Found ${files.length} markdown files in ${src.key}/`);
  }

  const allCards = [];
  let qaCount = 0;
  let conceptCount = 0;
  let sectionCount = 0;

  for (const file of allFiles) {
    const content = await fs.readFile(file.sourcePath, 'utf-8');

    // Extract Q&A pairs
    const qaCards = extractQA(content, file.sourcePath);
    qaCount += qaCards.length;
    allCards.push(...qaCards);

    // Extract detailed sections (h3 headers with content)
    const sectionCards = extractSections(content, file.sourcePath);
    sectionCount += sectionCards.length;
    allCards.push(...sectionCards);

    // Extract concept cards with code examples
    const conceptCards = extractConcepts(content, file.sourcePath);
    conceptCount += conceptCards.length;
    allCards.push(...conceptCards);
  }

  // Add unique IDs
  allCards.forEach((card, index) => {
    card.id = `card-${index + 1}`;
  });

  // Generate JavaScript file
  const output = `// Auto-generated flash card data from notes/ and practice/ folders
// Generated on: ${new Date().toISOString()}
// Total cards: ${allCards.length} (${qaCount} Q&A, ${sectionCount} sections, ${conceptCount} concepts)

window.FLASH_CARD_DATA = ${JSON.stringify(allCards, null, 2)};
`;

  await fs.writeFile(outputFile, output, 'utf-8');

  console.log(`\n✅ Generated ${allCards.length} flash cards:`);
  console.log(`   - ${qaCount} Q&A pairs`);
  console.log(`   - ${sectionCount} detailed sections`);
  console.log(`   - ${conceptCount} concept/code examples`);
  console.log(`\n📝 Output: ${path.relative(repoRoot, outputFile)}`);

  // Generate summary by category
  const byCategory = {};
  allCards.forEach(card => {
    byCategory[card.category] = (byCategory[card.category] || 0) + 1;
  });

  console.log('\n📊 Cards by category:');
  Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .forEach(([cat, count]) => {
      console.log(`   - ${cat}: ${count} cards`);
    });
}

main().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
