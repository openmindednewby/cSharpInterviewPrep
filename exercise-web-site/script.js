const cardQuestionEl = document.getElementById('cardQuestion');
const cardAnswerEl = document.getElementById('cardAnswer');
const cardMetaEl = document.getElementById('cardMeta');
const cardTypeBadgeEl = document.getElementById('cardTypeBadge');
const topicListEl = document.getElementById('topicList');
const cardPanelEl = document.querySelector('.card-panel');
const answerFooterEl = document.getElementById('answerFooter');
const answerCheckEl = document.getElementById('answerCheck');
const answerInputEl = document.getElementById('answerInput');
const toggleAnswerSectionBtn = document.getElementById('toggleAnswerSectionBtn');
const toggleQuestionBtn = document.getElementById('toggleQuestionBtn');
const toggleCodeInputBtn = document.getElementById('toggleCodeInputBtn');
const answerCodeBlockEl = document.getElementById('answerCodeBlock');
const answerCodeInputEl = document.getElementById('answerCodeInput');
const answerCodePreviewBlockEl = document.getElementById('answerCodePreviewBlock');
const answerCodePreviewEl = document.getElementById('answerCodePreview');
const toggleCodePreviewBtn = document.getElementById('toggleCodePreviewBtn');
const checkResultEl = document.getElementById('checkResult');
const checkAnswerBtn = document.getElementById('checkAnswerBtn');
const revealAnswerBtn = document.getElementById('revealAnswerBtn');
const randomQuestionBtn = document.getElementById('randomQuestionBtn');
const randomTopicQuestionBtn = document.getElementById('randomTopicQuestionBtn');
const themeSelectEl = document.getElementById('themeSelect');

const bundledCards = Array.isArray(window.PRACTICE_DATA) ? window.PRACTICE_DATA : null;
let allCards = [];
let cardsByTopic = new Map();
let currentCard = null;
let questionButtonsById = new Map();

const stopWords = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'when', 'where',
  'then', 'than', 'also', 'just', 'your', 'you', 'use', 'using', 'used', 'over',
  'are', 'was', 'were', 'is', 'be', 'been', 'being', 'has', 'have', 'had', 'not',
  'can', 'will', 'should', 'would', 'could', 'it', 'its', 'of', 'to', 'in', 'on',
  'by', 'or', 'as', 'at', 'if', 'an', 'a'
]);

document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  loadPracticeCards();
  wireActions();
});

function initializeTheme() {
  const supported = ['dark', 'light'];
  const saved = sessionStorage.getItem('practice-theme');
  const fallback = 'dark';
  const initial = supported.includes(saved) ? saved : (window.__practiceTheme || fallback);
  document.documentElement.dataset.theme = initial;

  if (!themeSelectEl) {
    return;
  }

  themeSelectEl.value = initial;
  themeSelectEl.addEventListener('change', (event) => {
    const next = supported.includes(event.target.value) ? event.target.value : fallback;
    document.documentElement.dataset.theme = next;
    sessionStorage.setItem('practice-theme', next);
  });
}

function wireActions() {
  checkAnswerBtn.addEventListener('click', handleCheckAnswer);
  revealAnswerBtn.addEventListener('click', handleRevealAnswer);
  if (toggleCodeInputBtn && answerCodeBlockEl) {
    toggleCodeInputBtn.addEventListener('click', toggleCodeInput);
  }
  if (toggleQuestionBtn) {
    toggleQuestionBtn.addEventListener('click', toggleQuestionVisibility);
  }
  if (answerCodeInputEl && answerCodePreviewEl) {
    answerCodeInputEl.addEventListener('input', updateAnswerCodePreview);
  }
  if (toggleCodePreviewBtn && answerCodePreviewBlockEl) {
    toggleCodePreviewBtn.addEventListener('click', toggleCodePreview);
  }
  if (toggleAnswerSectionBtn && answerCheckEl) {
    toggleAnswerSectionBtn.addEventListener('click', toggleAnswerSection);
  }
  window.addEventListener('resize', updateScrollableLayout);
  randomQuestionBtn.addEventListener('click', () => {
    const next = pickRandomCard(allCards, currentCard?.id);
    if (next) {
      setCardContent(next);
    }
  });
  randomTopicQuestionBtn.addEventListener('click', () => {
    if (!currentCard) {
      showCheckResult('Select a question first to pick within a topic.', 'warning');
      return;
    }
    const topicGroup = cardsByTopic.get(currentCard.topicId || currentCard.topic);
    const topicCards = topicGroup?.cards;
    if (!topicCards || topicCards.length === 0) {
      showCheckResult('No other questions found for this topic.', 'warning');
      return;
    }
    const next = pickRandomCard(topicCards, currentCard.id);
    if (next) {
      setCardContent(next);
    }
  });
}

async function loadPracticeCards() {
  try {
    const latestCards = await fetchLatestCards();
    const dataToUse = Array.isArray(latestCards) && latestCards.length > 0
      ? latestCards
      : bundledCards;

    if (!dataToUse || dataToUse.length === 0) {
      throw new Error('The practice Q&A dataset is unavailable.');
    }

    initializePracticeCards(dataToUse);
  } catch (error) {
    console.error(error);
    cardQuestionEl.textContent = 'Practice questions could not be loaded.';
    cardAnswerEl.textContent = '';
    cardMetaEl.textContent = 'Please refresh to try again or run "npm run build" to generate data.';
    cardTypeBadgeEl.textContent = '';
  }
}

async function fetchLatestCards() {
  try {
    const cacheBustingUrl = `data.js?refresh=${Date.now()}`;
    const response = await fetch(cacheBustingUrl, { cache: 'no-store', credentials: 'same-origin' });

    if (!response.ok) {
      throw new Error(`Failed to fetch latest practice data: ${response.status}`);
    }

    const datasetScript = await response.text();
    const extractedCards = extractCardsFromScript(datasetScript);

    if (Array.isArray(extractedCards) && extractedCards.length > 0) {
      window.PRACTICE_DATA = extractedCards;
      return extractedCards;
    }
  } catch (error) {
    console.warn('Falling back to bundled practice dataset.', error);
  }

  return null;
}

function extractCardsFromScript(scriptText) {
  try {
    const sandboxWindow = {};
    const scriptRunner = new Function('window', `${scriptText}; return window.PRACTICE_DATA;`);
    return scriptRunner(sandboxWindow);
  } catch (error) {
    console.warn('Unable to parse practice dataset script.', error);
    return null;
  }
}

function initializePracticeCards(data) {
  allCards = data.slice();
  cardsByTopic = buildTopicMap(allCards);
  buildSidebar(cardsByTopic);

  const initialCard = pickRandomCard(allCards);
  if (initialCard) {
    setCardContent(initialCard);
  }
}

function buildTopicMap(cards) {
  const topics = new Map();
  cards.forEach((card) => {
    const topicKey = card.topicId || card.topic || 'General';
    const topicLabel = card.topic || 'General';
    if (!topics.has(topicKey)) {
      topics.set(topicKey, { label: topicLabel, cards: [] });
    }
    topics.get(topicKey).cards.push(card);
  });

  return topics;
}

function buildSidebar(topics) {
  topicListEl.innerHTML = '';
  questionButtonsById.clear();

  const sortedTopics = Array.from(topics.entries()).sort((a, b) => {
    return a[1].label.localeCompare(b[1].label);
  });

  sortedTopics.forEach(([topicKey, topicData]) => {
    const details = document.createElement('details');
    details.className = 'topic-group';

    const summary = document.createElement('summary');
    summary.textContent = `${topicData.label} (${topicData.cards.length})`;
    details.appendChild(summary);

    const list = document.createElement('div');
    list.className = 'topic-questions';

    topicData.cards.forEach((card) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'question-link';
      button.textContent = card.question;
      button.dataset.cardId = card.id;
      button.addEventListener('click', () => {
        setCardContent(card);
      });

      questionButtonsById.set(card.id, button);
      list.appendChild(button);
    });

    details.appendChild(list);
    topicListEl.appendChild(details);

    if (topicKey === (currentCard?.topicId || currentCard?.topic)) {
      details.open = true;
    }
  });
}

function setCardContent(card) {
  currentCard = card;
  cardQuestionEl.textContent = card.question || '';
  cardMetaEl.textContent = card.topic ? `${card.topic} • Practice` : 'Practice';
  cardTypeBadgeEl.textContent = 'Practice';
  cardTypeBadgeEl.className = 'card-type-badge practice';

  renderAnswer(card);
  hideAnswer();
  clearCheckResult();
  answerInputEl.value = '';
  resetQuestionVisibility();
  resetAnswerCodeSection();
  resetAnswerSection();
  updateScrollableLayout();
  highlightCurrentQuestion(card.id);
}

function renderAnswer(card) {
  cardAnswerEl.innerHTML = '';

  if (Array.isArray(card.answer)) {
    card.answer.forEach((item) => {
      if (item.type === 'text') {
        const p = document.createElement('p');
        p.className = 'answer-text';
        p.textContent = item.content;
        cardAnswerEl.appendChild(p);
      } else if (item.type === 'list') {
        const ul = document.createElement('ul');
        ul.className = 'answer-list';
        item.items.forEach((listItem) => {
          const li = document.createElement('li');
          li.textContent = listItem;
          ul.appendChild(li);
        });
        cardAnswerEl.appendChild(ul);
      } else if (item.type === 'table') {
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'table-wrapper';

        const table = document.createElement('table');
        table.className = 'answer-table';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        item.headers.forEach((header) => {
          const th = document.createElement('th');
          th.textContent = header;
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        item.rows.forEach((row) => {
          const tr = document.createElement('tr');
          row.forEach((cell) => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        tableWrapper.appendChild(table);
        cardAnswerEl.appendChild(tableWrapper);
      } else if (item.type === 'code') {
        const codeWrapper = document.createElement('div');
        codeWrapper.className = `code-wrapper ${item.codeType || 'neutral'}`;

        if (item.codeType === 'good') {
          const badge = document.createElement('div');
          badge.className = 'code-badge good';
          badge.textContent = '✅ Good Practice';
          codeWrapper.appendChild(badge);
        } else if (item.codeType === 'bad') {
          const badge = document.createElement('div');
          badge.className = 'code-badge bad';
          badge.textContent = '❌ Bad Practice';
          codeWrapper.appendChild(badge);
        }

        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.className = `language-${item.language || 'csharp'}`;
        code.textContent = item.code;
        pre.appendChild(code);
        codeWrapper.appendChild(pre);
        cardAnswerEl.appendChild(codeWrapper);

        if (typeof Prism !== 'undefined') {
          Prism.highlightElement(code);
        }
      }
    });
  }
}

function hideAnswer() {
  cardAnswerEl.classList.add('is-hidden');
  revealAnswerBtn.textContent = 'Reveal Answer';
}

function handleRevealAnswer() {
  cardAnswerEl.classList.remove('is-hidden');
  revealAnswerBtn.textContent = 'Answer Revealed';
  updateScrollableLayout();
}

function handleCheckAnswer() {
  if (!currentCard) {
    showCheckResult('Select a question to check your answer.', 'warning');
    return;
  }

  const userInput = answerInputEl.value.trim();
  if (!userInput) {
    showCheckResult('Type your answer before checking.', 'warning');
    return;
  }

  const expectedText = extractAnswerText(currentCard);
  if (!expectedText) {
    showCheckResult('This question has no text answer to compare.', 'warning');
    return;
  }

  const expectedTokens = tokenize(expectedText);
  const userTokens = tokenize(userInput);

  if (expectedTokens.length === 0) {
    showCheckResult('No comparable text found in the reference answer.', 'warning');
    return;
  }

  const expectedSet = new Set(expectedTokens);
  const userSet = new Set(userTokens);
  let matchCount = 0;
  expectedSet.forEach((token) => {
    if (userSet.has(token)) {
      matchCount += 1;
    }
  });

  const ratio = matchCount / expectedSet.size;
  const percent = Math.round(ratio * 100);
  let tone = 'neutral';
  let message = 'Keep refining your answer.';

  if (ratio >= 0.7) {
    tone = 'good';
    message = 'Strong coverage of key points.';
  } else if (ratio >= 0.4) {
    tone = 'okay';
    message = 'Decent coverage. Add more specifics.';
  }

  showCheckResult(`Match ${percent}% (${matchCount}/${expectedSet.size} key terms). ${message}`, tone);
}

function extractAnswerText(card) {
  if (!Array.isArray(card.answer)) {
    return '';
  }

  return card.answer
    .filter((item) => item.type === 'text' || item.type === 'list' || item.type === 'table')
    .map((item) => {
      if (item.type === 'text') {
        return item.content;
      }
      if (item.type === 'list') {
        return item.items.join(' ');
      }
      if (item.type === 'table') {
        return [...item.headers, ...item.rows.flat()].join(' ');
      }
      return '';
    })
    .join(' ');
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function pickRandomCard(cards, excludeId) {
  if (!Array.isArray(cards) || cards.length === 0) {
    return null;
  }
  if (cards.length === 1) {
    return cards[0];
  }

  let candidate = null;
  let guard = 0;
  do {
    candidate = cards[Math.floor(Math.random() * cards.length)];
    guard += 1;
  } while (candidate.id === excludeId && guard < 10);

  return candidate;
}

function highlightCurrentQuestion(cardId) {
  questionButtonsById.forEach((button) => {
    if (button.dataset.cardId === cardId) {
      button.classList.add('active');
      button.setAttribute('aria-current', 'true');
      const topicGroup = button.closest('details');
      if (topicGroup) {
        topicGroup.open = true;
      }
    } else {
      button.classList.remove('active');
      button.removeAttribute('aria-current');
    }
  });
}

function showCheckResult(message, tone) {
  checkResultEl.textContent = message;
  checkResultEl.dataset.tone = tone || 'neutral';
}

function clearCheckResult() {
  checkResultEl.textContent = '';
  checkResultEl.dataset.tone = 'neutral';
}

function updateScrollableLayout() {
  if (!cardPanelEl || !answerFooterEl) {
    return;
  }

  cardPanelEl.classList.remove('scroll-lock');
  cardPanelEl.style.removeProperty('--panel-max-height');

  const naturalHeight = cardPanelEl.scrollHeight;
  const containerHeight = cardPanelEl.parentElement?.clientHeight || window.innerHeight;
  const maxHeight = Math.round(containerHeight);

  if (naturalHeight > maxHeight) {
    cardPanelEl.classList.add('scroll-lock');
    cardPanelEl.style.setProperty('--panel-max-height', `${maxHeight}px`);
  }
}

function toggleCodeInput() {
  if (!answerCodeBlockEl || !toggleCodeInputBtn) {
    return;
  }

  const isHidden = answerCodeBlockEl.classList.toggle('is-hidden');
  toggleCodeInputBtn.textContent = isHidden ? 'Add C# Code' : 'Hide C# Code';
  toggleCodeInputBtn.setAttribute('aria-pressed', String(!isHidden));

  if (!isHidden && answerCodeInputEl) {
    answerCodeInputEl.focus();
  }

  updateScrollableLayout();
}

function toggleQuestionVisibility() {
  if (!cardQuestionEl || !toggleQuestionBtn) {
    return;
  }

  const isHidden = cardQuestionEl.classList.toggle('is-hidden');
  toggleQuestionBtn.textContent = isHidden ? 'Show Question' : 'Hide Question';
  toggleQuestionBtn.setAttribute('aria-pressed', String(!isHidden));
  updateScrollableLayout();
}

function toggleCodePreview() {
  if (!answerCodePreviewBlockEl || !toggleCodePreviewBtn) {
    return;
  }

  const isHidden = answerCodePreviewBlockEl.classList.toggle('is-hidden');
  toggleCodePreviewBtn.textContent = isHidden ? 'Show Preview' : 'Hide Preview';
  toggleCodePreviewBtn.setAttribute('aria-pressed', String(!isHidden));
  updateScrollableLayout();
}

function updateAnswerCodePreview() {
  if (!answerCodePreviewEl || !answerCodeInputEl) {
    return;
  }

  answerCodePreviewEl.textContent = answerCodeInputEl.value;

  if (typeof Prism !== 'undefined') {
    Prism.highlightElement(answerCodePreviewEl);
  }
}

function resetAnswerCodeSection() {
  if (answerCodeInputEl) {
    answerCodeInputEl.value = '';
  }
  if (answerCodePreviewEl) {
    answerCodePreviewEl.textContent = '';
  }
  if (answerCodePreviewBlockEl) {
    answerCodePreviewBlockEl.classList.remove('is-hidden');
  }
  if (answerCodeBlockEl) {
    answerCodeBlockEl.classList.add('is-hidden');
  }
  if (toggleCodeInputBtn) {
    toggleCodeInputBtn.textContent = 'Add C# Code';
    toggleCodeInputBtn.setAttribute('aria-pressed', 'false');
  }
  if (toggleCodePreviewBtn) {
    toggleCodePreviewBtn.textContent = 'Hide Preview';
    toggleCodePreviewBtn.setAttribute('aria-pressed', 'false');
  }
}

function toggleAnswerSection() {
  if (!answerCheckEl || !toggleAnswerSectionBtn) {
    return;
  }

  const isCollapsed = answerCheckEl.classList.toggle('is-collapsed');
  toggleAnswerSectionBtn.setAttribute('aria-expanded', String(!isCollapsed));
  toggleAnswerSectionBtn.setAttribute(
    'aria-label',
    isCollapsed ? 'Expand answer section' : 'Collapse answer section'
  );

  updateScrollableLayout();
}

function resetQuestionVisibility() {
  if (!cardQuestionEl || !toggleQuestionBtn) {
    return;
  }

  cardQuestionEl.classList.remove('is-hidden');
  toggleQuestionBtn.textContent = 'Hide Question';
  toggleQuestionBtn.setAttribute('aria-pressed', 'false');
}

function resetAnswerSection() {
  if (!answerCheckEl || !toggleAnswerSectionBtn) {
    return;
  }

  answerCheckEl.classList.remove('is-collapsed');
  toggleAnswerSectionBtn.setAttribute('aria-expanded', 'true');
  toggleAnswerSectionBtn.setAttribute('aria-label', 'Collapse answer section');
}
