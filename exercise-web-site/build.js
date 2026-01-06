#!/usr/bin/env node
/**
 * Practice Q&A data generator for senior .NET study exercises.
 * - Reads Markdown from the root-level `practice` folder
 * - Extracts Q&A sections and code examples
 * - Generates data.js with practice questions and answers
 */

const fs = require('fs/promises');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const outputFile = path.join(__dirname, 'data.js');
const contentSources = [
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

function formatTopicLabel(rawTopic) {
  return rawTopic
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function getTopicInfo(sourcePath) {
  const sourceFile = path.relative(repoRoot, sourcePath).replace(/\\/g, '/');
  const fileName = path.basename(sourceFile, path.extname(sourceFile));
  const topicId = fileName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const topicLabel = formatTopicLabel(fileName || 'General');

  return {
    sourceFile,
    topicId: topicId || 'general',
    topicLabel
  };
}

function extractIndexOverview(markdown, sourcePath, options = {}) {
  const lines = markdown.split(/\r?\n/);
  const answer = [];
  let question = options.question || null;
  let paragraphLines = [];
  let listItems = [];
  let inCodeBlock = false;

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      answer.push({
        type: 'text',
        content: cleanMarkdown(paragraphLines.join(' '))
      });
      paragraphLines = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      answer.push({
        type: 'list',
        items: listItems.map((item) => cleanMarkdown(item))
      });
      listItems = [];
    }
  };

  for (const line of lines) {
    const codeFenceMatch = line.match(/^```/);
    if (codeFenceMatch) {
      flushParagraph();
      flushList();
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      continue;
    }

    if (line.match(/^---+$/)) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = line.match(/^#{1,6}\s+(.+)/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const headingText = cleanMarkdown(headingMatch[1]);
      if (!question) {
        question = headingText;
      } else {
        answer.push({ type: 'text', content: headingText });
      }
      continue;
    }

    const listMatch = line.match(/^\s*(?:[-*]|\d+\.)\s+(.+)/);
    if (listMatch) {
      flushParagraph();
      listItems.push(listMatch[1]);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    paragraphLines.push(line.trim());
  }

  flushParagraph();
  flushList();

  if (!question) {
    question = options.fallbackQuestion || 'Practice Index';
  }

  if (answer.length === 0) {
    return null;
  }

  const sourceFile = path.relative(repoRoot, sourcePath).replace(/\\/g, '/');

  return {
    question,
    answer,
    category: 'practice',
    topic: options.topic || 'Practice Index',
    topicId: options.topicId || 'practice-index',
    source: sourceFile,
    isIndex: true
  };
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
  let paragraphLines = [];
  let inList = false;
  let listItems = [];
  let inTable = false;
  let tableHeaders = [];
  let tableRows = [];

  const { sourceFile, topicId, topicLabel } = getTopicInfo(sourcePath);
  const category = 'practice';
  const topic = topicLabel;

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      currentAnswer.push({
        type: 'text',
        content: cleanMarkdown(paragraphLines.join(' '))
      });
      paragraphLines = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      currentAnswer.push({
        type: 'list',
        items: listItems.map((item) => cleanMarkdown(item))
      });
      listItems = [];
    }
    inList = false;
  };

  const flushTable = () => {
    if (inTable && tableHeaders.length > 0 && tableRows.length > 0) {
      currentAnswer.push({
        type: 'table',
        headers: tableHeaders,
        rows: tableRows
      });
    }
    inTable = false;
    tableHeaders = [];
    tableRows = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect code fence
    const codeFenceMatch = line.match(/^```(\w+)?/);
    if (codeFenceMatch) {
      if (!inCodeBlock) {
        flushParagraph();
        flushList();
        flushTable();
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
        if (currentQuestion && codeLines.length > 0) {
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
        flushParagraph();
        flushList();
        flushTable();
        cards.push({
          question: currentQuestion,
          answer: currentAnswer,
          category,
          topic,
          topicId,
          source: sourceFile
        });
      }

      currentQuestion = cleanMarkdown(questionMatch[1]);
      currentAnswer = [];
      paragraphLines = [];
      inList = false;
      listItems = [];
      inTable = false;
      tableHeaders = [];
      tableRows = [];
      continue;
    }

    // Match answer pattern: A: answer text
    const answerMatch = line.match(/^A:\s*(.+)/);
    if (answerMatch && currentQuestion) {
      flushParagraph();
      flushList();
      flushTable();
      paragraphLines.push(answerMatch[1]);
      continue;
    }

    // Continue answer if we have a question and the line is not empty
    if (currentQuestion) {
      if (!line.trim()) {
        flushParagraph();
        flushList();
        flushTable();
        continue;
      }

      const h3Match = line.match(/^###\s+(.+)/);
      const h4Match = line.match(/^####\s+(.+)/);
      if (h3Match || h4Match) {
        flushParagraph();
        flushList();
        flushTable();
        paragraphLines.push((h3Match || h4Match)[1]);
        continue;
      }

      const tableRowMatch = line.match(/^\s*\|(.+)\|\s*$/);
      if (tableRowMatch) {
        const cells = tableRowMatch[1].split('|').map(cell => cleanMarkdown(cell.trim()));

        if (!inTable) {
          flushParagraph();
          flushList();
          inTable = true;
          tableHeaders = cells;
          tableRows = [];
        } else if (line.match(/^\s*\|[\s:-]+\|/)) {
          continue;
        } else {
          tableRows.push(cells);
        }
        continue;
      } else if (inTable) {
        flushTable();
      }

      const listMatch = line.match(/^\s*(?:[-*]|\d+\.)\s+(.+)/);
      if (listMatch) {
        if (!inList) {
          flushParagraph();
          inList = true;
          listItems = [];
        }
        listItems.push(listMatch[1]);
        continue;
      } else if (inList && line.trim()) {
        listItems[listItems.length - 1] += ' ' + line.trim();
        continue;
      } else if (inList) {
        flushList();
      }

      if (!line.match(/^---+$/) && !line.match(/^##\s+/) && !line.startsWith('💡')) {
        paragraphLines.push(line);
      }
    }

    // Detect section headers for key concepts
    const headerMatch = line.match(/^##\s+(.+)/);
    if (headerMatch) {
      // Save any pending Q&A
      if (currentQuestion && currentAnswer.length > 0) {
        flushParagraph();
        flushList();
        flushTable();
        cards.push({
          question: currentQuestion,
          answer: currentAnswer,
          category,
          topic,
          topicId,
          source: sourceFile
        });
        currentQuestion = null;
        currentAnswer = [];
      }
    }
  }

  // Save final Q&A if exists
  if (currentQuestion && currentAnswer.length > 0) {
    flushParagraph();
    flushList();
    flushTable();
    cards.push({
      question: currentQuestion,
      answer: currentAnswer,
      category,
      topic,
      topicId,
      source: sourceFile
    });
  }

  return cards;
}

/**
 * Extract detailed sections (h2, h3, h4 headers with content)
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
  let inTable = false;
  let tableHeaders = [];
  let tableRows = [];
  let sectionLevel = null; // Track which level (h2, h3, h4) started the current section

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
    sectionLevel = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect h2, h3, or h4 headers
    const h2Match = line.match(/^##\s+(.+)/);
    const h3Match = line.match(/^###\s+(.+)/);
    const h4Match = line.match(/^####\s+(.+)/);

    if (h2Match || h3Match || h4Match) {
      // Determine the level and whether to start a new section
      const newLevel = h2Match ? 2 : (h3Match ? 3 : 4);
      const headerText = cleanMarkdown((h2Match || h3Match || h4Match)[1]);

      // If we have a current section and encounter a header at the same or higher level, save it
      if (currentSection && (sectionLevel === null || newLevel <= sectionLevel)) {
        saveSection();
      }

      // Start new section
      currentSection = headerText;
      sectionContent = [];
      sectionLevel = newLevel;
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

      // Handle tables
      const tableRowMatch = line.match(/^\s*\|(.+)\|\s*$/);
      if (tableRowMatch) {
        const cells = tableRowMatch[1].split('|').map(cell => cleanMarkdown(cell.trim()));

        if (!inTable) {
          // First row is headers
          inTable = true;
          tableHeaders = cells;
          tableRows = [];
        } else if (line.match(/^\s*\|[\s:-]+\|/)) {
          // Separator row (|---|---|), skip it
          continue;
        } else {
          // Data row
          tableRows.push(cells);
        }
        continue;
      } else if (inTable && line.trim() === '') {
        // End of table
        if (tableHeaders.length > 0 && tableRows.length > 0) {
          sectionContent.push({
            type: 'table',
            headers: tableHeaders,
            rows: tableRows
          });
        }
        inTable = false;
        tableHeaders = [];
        tableRows = [];
        continue;
      }

      // Handle lists (both bullet and numbered)
      const listMatch = line.match(/^\s*(?:[-*]|\d+\.)\s+(.+)/);
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
  console.log('📝 Generating practice Q&A data from practice folder...\n');

  const allFiles = [];
  for (const src of contentSources) {
    const files = await collectMarkdownFiles(src.source, src.key);
    allFiles.push(...files);
    console.log(`📁 Found ${files.length} markdown files in ${src.key}/`);
  }

  const allCards = [];
  let qaCount = 0;

  for (const file of allFiles) {
    const content = await fs.readFile(file.sourcePath, 'utf-8');

    // Extract Q&A pairs
    const qaCards = extractQA(content, file.sourcePath);
    qaCount += qaCards.length;
    allCards.push(...qaCards);

    const sourceFile = path.relative(repoRoot, file.sourcePath).replace(/\\/g, '/');
    if (sourceFile.toLowerCase() === 'practice/index.md') {
      const overviewCard = extractIndexOverview(content, file.sourcePath);
      if (overviewCard) {
        allCards.push(overviewCard);
      }
    }
  }

  // Add unique IDs
  allCards.forEach((card, index) => {
    card.id = `card-${index + 1}`;
  });

  // Generate JavaScript file
  const output = `// Auto-generated practice Q&A data from practice/ folder
// Generated on: ${new Date().toISOString()}
// Total cards: ${allCards.length} Q&A

window.PRACTICE_DATA = ${JSON.stringify(allCards, null, 2)};
`;

  await fs.writeFile(outputFile, output, 'utf-8');

  console.log(`\n✅ Generated ${allCards.length} practice questions:`);
  console.log(`   - ${qaCount} Q&A pairs`);
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
