const flashCardContainer = document.querySelector('.flash-card-container');
const cardQuestionEl = document.getElementById('cardQuestion');
const cardAnswerEl = document.getElementById('cardAnswer');
const cardMetaEl = document.getElementById('cardMeta');
const cardTypeBadgeEl = document.getElementById('cardTypeBadge');

const displayDuration = 10000; // time card stays visible (increased for code reading)
const transitionDuration = 600; // fade-out duration before switching
const bundledCards = Array.isArray(window.FLASH_CARD_DATA) ? window.FLASH_CARD_DATA : null;
let cycleTimer = null;
let flashCards = [];
let currentIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  loadFlashCards();
});

async function loadFlashCards() {
  try {
    const latestCards = await fetchLatestCards();
    const dataToUse = Array.isArray(latestCards) && latestCards.length > 0
      ? latestCards
      : bundledCards;

    if (!dataToUse || dataToUse.length === 0) {
      throw new Error('The flash card dataset is unavailable.');
    }

    initializeFlashCards(dataToUse);
  } catch (error) {
    console.error(error);

    cardQuestionEl.textContent = 'Flash cards could not be loaded.';
    cardAnswerEl.textContent = '';
    cardMetaEl.textContent = 'Please refresh to try again or run "npm run build" to generate cards.';
    cardTypeBadgeEl.textContent = '';

    clearTimeout(cycleTimer);
    cycleTimer = null;
    requestAnimationFrame(() => flashCardContainer.classList.add('visible'));
  }
}

async function fetchLatestCards() {
  try {
    const cacheBustingUrl = `flash-card-data.js?refresh=${Date.now()}`;
    const response = await fetch(cacheBustingUrl, { cache: 'no-store', credentials: 'same-origin' });

    if (!response.ok) {
      throw new Error(`Failed to fetch latest flash cards: ${response.status}`);
    }

    const datasetScript = await response.text();
    const extractedCards = extractCardsFromScript(datasetScript);

    if (Array.isArray(extractedCards) && extractedCards.length > 0) {
      window.FLASH_CARD_DATA = extractedCards;
      return extractedCards;
    }
  } catch (error) {
    console.warn('Falling back to bundled flash card dataset.', error);
  }

  return null;
}

function extractCardsFromScript(scriptText) {
  try {
    const sandboxWindow = {};
    const scriptRunner = new Function('window', `${scriptText}; return window.FLASH_CARD_DATA;`);
    return scriptRunner(sandboxWindow);
  } catch (error) {
    console.warn('Unable to parse flash card dataset script.', error);
    return null;
  }
}

function initializeFlashCards(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('The flash card collection is empty or malformed.');
  }

  flashCards = shuffle(data.slice());
  currentIndex = 0;
  setCardContent(flashCards[currentIndex]);
  requestAnimationFrame(() => flashCardContainer.classList.add('visible'));
  scheduleNextCard();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function setCardContent(card) {
  // Set question
  cardQuestionEl.textContent = card.question || '';

  // Set badge based on card type
  if (card.isConcept) {
    cardTypeBadgeEl.textContent = 'Concept';
    cardTypeBadgeEl.className = 'card-type-badge concept';
  } else {
    cardTypeBadgeEl.textContent = 'Q&A';
    cardTypeBadgeEl.className = 'card-type-badge qa';
  }

  // Build answer content (text + code)
  cardAnswerEl.innerHTML = '';

  if (Array.isArray(card.answer)) {
    card.answer.forEach(item => {
      if (item.type === 'text') {
        const p = document.createElement('p');
        p.className = 'answer-text';
        p.textContent = item.content;
        cardAnswerEl.appendChild(p);
      } else if (item.type === 'code') {
        const codeWrapper = document.createElement('div');
        codeWrapper.className = `code-wrapper ${item.codeType || 'neutral'}`;

        // Add indicator badge
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
      }
    });
  }

  // Set metadata
  const metaParts = [card.topic, card.category]
    .map((part) => (typeof part === 'string' ? part.trim() : ''))
    .filter(Boolean);
  cardMetaEl.textContent = metaParts.join(' • ');
}

function scheduleNextCard() {
  clearTimeout(cycleTimer);
  cycleTimer = setTimeout(() => {
    flashCardContainer.classList.remove('visible');
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % flashCards.length;
      if (currentIndex === 0) {
        flashCards = shuffle(flashCards.slice());
      }
      setCardContent(flashCards[currentIndex]);
      requestAnimationFrame(() => flashCardContainer.classList.add('visible'));
      scheduleNextCard();
    }, transitionDuration);
  }, displayDuration);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
