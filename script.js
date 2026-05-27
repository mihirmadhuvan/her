/* ============================================================
   ANNIVERSARY INTERACTIVE EXPERIENCE - script.js
   ============================================================ */

'use strict';

// ===== STATE =====
const state = {
  quizCompleted: false,
  huntCompleted: false,
  puzzleCompleted: false,
  achievements: [],
  currentScreen: 'intro',
  easterEggsFound: 0
};

// ===== QUIZ DATA (CUSTOMIZE THESE!) =====
const quizQuestions = [
  {
    q: "What was the first thing we ever talked about?",
    options: ["Something random", "A common interest", "A joke you told", "A question you asked"],
    correct: 1
  },
  {
    q: "What's my favourite thing about you?",
    options: ["Your smile", "Your laugh", "Your kindness", "All of the above ❤️"],
    correct: 3
  },
  {
    q: "Which describes our first date best?",
    options: ["Nervous but perfect", "Awkward and funny", "Romantic and magical", "All of the above"],
    correct: 2
  },
  {
    q: "What song reminds me of you?",
    options: ["A love song", "Something you hum", "Our song", "A song you love"],
    correct: 2
  },
  {
    q: "What's my love language?",
    options: ["Words of affirmation", "Quality time", "Acts of service", "Physical touch"],
    correct: 1
  },
  {
    q: "How many times a day do I think about you?",
    options: ["A few times", "Many times", "Constantly", "Every single second"],
    correct: 3
  },
  {
    q: "What's my favourite memory with you?",
    options: ["Our first meeting", "When you laughed uncontrollably", "A quiet peaceful moment", "All of them"],
    correct: 3
  },
  {
    q: "How long will I love you?",
    options: ["For a while", "For a long time", "Forever", "Beyond forever"],
    correct: 3
  }
];

let quizIndex = 0, quizScore = 0;

// ===== LETTER TEXT =====
const letterContent = `I have been trying to find the right words
for what feels like forever.

The truth is, you changed everything.

Not in a dramatic, movie-way. But in the quiet,
everyday way that matters most.

You made ordinary moments feel extraordinary.
You made me feel seen, understood, chosen.

I don't know what I did to deserve someone like you —
but I am grateful every single day.

Every laugh we've shared, every silent understanding,
every time you reached for my hand...

Those are the moments I will carry with me always.

Two years with you is the greatest story
I've ever been a part of.

And I can't wait to keep writing it — with you.`;

// ===== PUZZLE DATA =====
let puzzleState = [];
let puzzleMoves = 0;
const puzzleEmojis = ['💖', '🌹', '⭐', '💫', '🌙', '💝', '✨', '🦋'];
const puzzleSize = 3;

// ===== HUNT STATE =====
let huntScore = 0, huntTimer = 30, huntInterval = null, huntHeartInterval = null, huntActive = false;

// ===== SLIDESHOW =====
let slideIndex = 0, slideInterval = null;

// ============================================================
//   CURSOR
// ============================================================
const cursor = document.getElementById('cursor');
const cursorGlow = document.getElementById('cursor-glow');

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  }, 80);
});

// ============================================================
//   FLOATING PARTICLES CANVAS
// ============================================================
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticle() {
  const types = ['star', 'heart', 'circle'];
  return {
    type: types[Math.floor(Math.random() * types.length)],
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 3 + 1,
    vx: (Math.random() - 0.5) * 0.4,
    vy: Math.random() * -0.5 - 0.1,
    opacity: Math.random() * 0.5 + 0.1,
    color: ['#f0c060', '#ff6eb4', '#b06cff', '#ffffff'][Math.floor(Math.random() * 4)],
    life: 1
  };
}

for (let i = 0; i < 80; i++) particles.push(createParticle());

function drawParticle(p) {
  ctx.save();
  ctx.globalAlpha = p.opacity * p.life;
  ctx.fillStyle = p.color;
  if (p.type === 'heart') {
    ctx.font = `${p.size * 4}px serif`;
    ctx.fillText('♥', p.x, p.y);
  } else if (p.type === 'star') {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const r = i % 2 === 0 ? p.size * 2 : p.size;
      ctx.lineTo(p.x + Math.cos(angle) * r, p.y + Math.sin(angle) * r);
    }
    ctx.closePath(); ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.y < -20 || p.x < -20 || p.x > canvas.width + 20) {
      Object.assign(p, createParticle());
      p.y = canvas.height + 10;
    }
    drawParticle(p);
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ============================================================
//   INTRO SCREEN
// ============================================================
const introText = "I made something special for you...";
const enterBtn = document.getElementById('enter-btn');
let charIndex = 0;

function typeWriter() {
  const el = document.getElementById('typewriter-text');
  if (charIndex < introText.length) {
    el.textContent += introText[charIndex++];
    setTimeout(typeWriter, 80);
  } else {
    setTimeout(() => {
      enterBtn.classList.remove('hidden');
      enterBtn.classList.add('visible');
    }, 600);
  }
}

// Intro stars
function createIntroStars() {
  const container = document.getElementById('intro-stars');
  for (let i = 0; i < 150; i++) {
    const s = document.createElement('div');
    const size = Math.random() * 2 + 1;
    s.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      background:#fff;
      border-radius:50%;
      animation: twinkle ${2 + Math.random()*3}s ease-in-out infinite;
      animation-delay:${Math.random()*3}s;
      opacity:${0.2 + Math.random()*0.6};
    `;
    container.appendChild(s);
  }
}

setTimeout(() => { createIntroStars(); typeWriter(); }, 300);

enterBtn.addEventListener('click', () => {
  unlockAchievement("Entered Our Universe", "The journey begins ❤️");
  transitionTo('menu');
});

// ============================================================
//   SCREEN TRANSITIONS
// ============================================================
function transitionTo(screenId) {
  const current = document.querySelector('.screen.active');
  const next = document.getElementById('screen-' + screenId);
  if (!next) return;
  if (current) {
    current.style.opacity = '0';
    setTimeout(() => {
      current.classList.remove('active');
      current.style.opacity = '';
    }, 400);
  }
  setTimeout(() => {
    next.classList.add('active', 'screen-fade-in', 'scrollable');
    state.currentScreen = screenId;
    onScreenEnter(screenId);
  }, 400);
}

function onScreenEnter(id) {
  if (id === 'story') initStory();
  if (id === 'letters') initLetter();
  if (id === 'future') initFuture();
  if (id === 'quiz-game') initQuizGame();
  if (id === 'puzzle') initPuzzle();
  if (id === 'finale') initFinale();
  if (id === 'vault') updateVault();
  if (id === 'quiz') updateChallenges();
  if (id === 'menu') updateMenu();
}

// Back buttons
document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => transitionTo(btn.dataset.back));
});

// Menu cards
document.querySelectorAll('.menu-card').forEach(card => {
  card.addEventListener('click', () => {
    const target = card.dataset.screen;
    transitionTo(target);
  });
});

// ============================================================
//   ACHIEVEMENT SYSTEM
// ============================================================
function unlockAchievement(title, desc) {
  if (state.achievements.includes(title)) return;
  state.achievements.push(title);
  const toast = document.getElementById('achievement-toast');
  document.getElementById('achievement-desc').textContent = desc;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ============================================================
//   OUR STORY TIMELINE
// ============================================================
function initStory() {
  const items = document.querySelectorAll('.timeline-item');
  items.forEach((item, i) => {
    setTimeout(() => item.classList.add('visible'), i * 150);
  });
  document.querySelectorAll('.timeline-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      if (card.classList.contains('flipped')) {
        unlockAchievement("Memory Unlocked", "A beautiful memory revealed ❤️");
      }
    });
  });
}

// ============================================================
//   MEMORY VAULT
// ============================================================
function updateVault() {
  const boxes = document.querySelectorAll('.vault-box');
  boxes.forEach(box => {
    const req = box.dataset.requires;
    if (req === 'none') {
      box.classList.remove('locked');
    } else if (req === 'quiz' && state.quizCompleted) {
      box.classList.remove('locked');
      box.querySelector('.box-status').textContent = '🔓 Unlocked';
    } else if (req === 'all' && state.quizCompleted && state.huntCompleted && state.puzzleCompleted) {
      box.classList.remove('locked');
      box.querySelector('.box-status').textContent = '🔓 Unlocked';
    }

    if (!box.classList.contains('locked') && !box.classList.contains('open')) {
      box.addEventListener('click', () => {
        const content = box.querySelector('.box-content');
        content.classList.toggle('hidden');
        box.classList.toggle('open');
        if (!content.classList.contains('hidden')) {
          unlockAchievement("Vault Opened", "A secret memory unlocked 💙");
        }
      }, { once: false });
    }
  });
}

// ============================================================
//   CHALLENGES UPDATE
// ============================================================
function updateChallenges() {
  if (state.quizCompleted) {
    document.getElementById('challenge-quiz-card').classList.add('completed');
    document.getElementById('quiz-badge').textContent = '✅';
    document.getElementById('start-quiz-btn').textContent = 'Play Again';
  }
  if (state.huntCompleted) {
    document.getElementById('challenge-hunt-card').classList.add('completed');
    document.getElementById('hunt-badge').textContent = '✅';
    document.getElementById('start-hunt-btn').textContent = 'Play Again';
  }
  if (state.puzzleCompleted) {
    document.getElementById('challenge-puzzle-card').classList.add('completed');
    document.getElementById('puzzle-badge').textContent = '✅';
    document.getElementById('start-puzzle-btn').textContent = 'Play Again';
  }
}

document.getElementById('start-quiz-btn').addEventListener('click', () => transitionTo('quiz-game'));
document.getElementById('start-hunt-btn').addEventListener('click', () => transitionTo('hunt'));
document.getElementById('start-puzzle-btn').addEventListener('click', () => transitionTo('puzzle'));

// ============================================================
//   MENU UPDATE
// ============================================================
function updateMenu() {
  if (state.quizCompleted) document.getElementById('dot-quiz').classList.add('complete');
  if (state.huntCompleted) document.getElementById('dot-hunt').classList.add('complete');
  if (state.puzzleCompleted) document.getElementById('dot-puzzle').classList.add('complete');
  if (state.quizCompleted && state.huntCompleted && state.puzzleCompleted) {
    document.getElementById('finale-btn').classList.remove('hidden');
  }
}

document.getElementById('finale-btn').addEventListener('click', () => transitionTo('finale'));

// ============================================================
//   LOVE QUIZ GAME
// ============================================================
function initQuizGame() {
  quizIndex = 0; quizScore = 0;
  document.getElementById('quiz-result').classList.add('hidden');
  document.getElementById('quiz-question-container').classList.remove('hidden');
  renderQuestion();
}

function renderQuestion() {
  const fill = document.getElementById('quiz-progress-fill');
  fill.style.width = ((quizIndex / quizQuestions.length) * 100) + '%';
  document.getElementById('quiz-score').textContent = quizScore;

  if (quizIndex >= quizQuestions.length) { showQuizResult(); return; }

  const q = quizQuestions[quizIndex];
  document.getElementById('quiz-question-text').textContent = q.q;
  const optionsEl = document.getElementById('quiz-options');
  optionsEl.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleAnswer(i, btn));
    optionsEl.appendChild(btn);
  });
}

function handleAnswer(chosen, btn) {
  const q = quizQuestions[quizIndex];
  const allOpts = document.querySelectorAll('.quiz-option');
  allOpts.forEach(o => o.classList.add('disabled'));

  if (chosen === q.correct) {
    btn.classList.add('correct');
    quizScore++;
    spawnFloatingHeart(btn);
  } else {
    btn.classList.add('wrong');
    allOpts[q.correct].classList.add('correct');
  }
  quizIndex++;
  setTimeout(renderQuestion, 1200);
}

function showQuizResult() {
  document.getElementById('quiz-question-container').classList.add('hidden');
  const result = document.getElementById('quiz-result');
  result.classList.remove('hidden');
  const pct = quizScore / quizQuestions.length;
  let title = pct >= 0.8 ? "Perfect Love Score! 💖" : pct >= 0.5 ? "You Know Me Well! 💕" : "Keep Learning About Us! 💝";
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-score').textContent = `${quizScore}/${quizQuestions.length} correct`;
  document.getElementById('quiz-progress-fill').style.width = '100%';
  launchConfetti();
  state.quizCompleted = true;
  unlockAchievement("Quiz Master", "You completed the Love Quiz! 💘");
  updateMenu();
}

document.getElementById('quiz-done-btn').addEventListener('click', () => {
  updateVault();
  transitionTo('quiz');
});

function spawnFloatingHeart(el) {
  const rect = el.getBoundingClientRect();
  const h = document.createElement('div');
  h.textContent = '❤️';
  h.style.cssText = `position:fixed;left:${rect.left+rect.width/2}px;top:${rect.top}px;font-size:1.5rem;pointer-events:none;z-index:1000;animation:heartRise 1s ease forwards;`;
  document.body.appendChild(h);
  const style = document.createElement('style');
  style.textContent = `@keyframes heartRise{0%{opacity:1;transform:translateY(0) scale(1);}100%{opacity:0;transform:translateY(-60px) scale(1.5);}}`;
  document.head.appendChild(style);
  setTimeout(() => h.remove(), 1000);
}

// ============================================================
//   HEART HUNT
// ============================================================
document.getElementById('hunt-start-btn').addEventListener('click', startHuntGame);
document.getElementById('hunt-retry-btn').addEventListener('click', () => {
  document.getElementById('hunt-end-overlay').classList.add('hidden');
  startHuntGame();
});

function startHuntGame() {
  huntScore = 0; huntTimer = 30; huntActive = true;
  document.getElementById('hunt-score').textContent = '0';
  document.getElementById('hunt-timer').textContent = '30';
  document.getElementById('hunt-start-overlay').classList.add('hidden');
  document.getElementById('hunt-end-overlay').classList.add('hidden');
  document.getElementById('hunt-arena').innerHTML = '';

  huntInterval = setInterval(() => {
    huntTimer--;
    document.getElementById('hunt-timer').textContent = huntTimer;
    if (huntTimer <= 0) endHunt(false);
  }, 1000);

  huntHeartInterval = setInterval(spawnHeart, 600);
  for (let i = 0; i < 5; i++) spawnHeart();
}

function spawnHeart() {
  if (!huntActive) return;
  const arena = document.getElementById('hunt-arena');
  const h = document.createElement('div');
  h.className = 'hunt-heart';
  h.textContent = ['❤️','💕','💖','💝','💗'][Math.floor(Math.random()*5)];
  h.style.left = (5 + Math.random() * 85) + '%';
  h.style.animationDuration = (3 + Math.random() * 4) + 's';
  h.style.animationDelay = (Math.random() * 1) + 's';
  h.addEventListener('click', () => {
    if (!huntActive) return;
    // Pop effect
    const pop = document.createElement('div');
    pop.className = 'heart-pop';
    pop.textContent = '💥';
    pop.style.left = h.style.left;
    pop.style.top = h.getBoundingClientRect().top + 'px';
    arena.appendChild(pop);
    setTimeout(() => pop.remove(), 500);
    h.remove();
    huntScore++;
    document.getElementById('hunt-score').textContent = huntScore;
    if (huntScore >= 15) endHunt(true);
  });
  arena.appendChild(h);
  setTimeout(() => { if (h.parentNode) h.remove(); }, 8000);
}

function endHunt(won) {
  huntActive = false;
  clearInterval(huntInterval);
  clearInterval(huntHeartInterval);
  document.getElementById('hunt-arena').innerHTML = '';

  const overlay = document.getElementById('hunt-end-overlay');
  overlay.classList.remove('hidden');

  if (won) {
    document.getElementById('hunt-end-title').textContent = '🎉 You Won!';
    document.getElementById('hunt-end-desc').textContent = `You caught all 15 hearts! ❤️ Reward unlocked!`;
    state.huntCompleted = true;
    unlockAchievement("Heart Catcher", "All 15 hearts caught! 💝");
    launchConfetti();
    updateMenu();
    setTimeout(() => transitionTo('quiz'), 2500);
  } else {
    document.getElementById('hunt-end-title').textContent = '⏰ Time\'s Up!';
    document.getElementById('hunt-end-desc').textContent = `You caught ${huntScore}/15 hearts. Try again!`;
  }
}

// ============================================================
//   SLIDING PUZZLE
// ============================================================
function initPuzzle() {
  puzzleMoves = 0;
  document.getElementById('puzzle-moves').textContent = '0';
  document.getElementById('puzzle-complete').classList.add('hidden');
  resetPuzzle();
  renderPuzzle();
}

function resetPuzzle() {
  const n = puzzleSize * puzzleSize;
  puzzleState = Array.from({length: n - 1}, (_, i) => i + 1);
  puzzleState.push(0); // 0 = empty
  shufflePuzzle();
}

function shufflePuzzle() {
  for (let i = 0; i < 200; i++) {
    const emptyIdx = puzzleState.indexOf(0);
    const moves = getPossibleMoves(emptyIdx);
    const move = moves[Math.floor(Math.random() * moves.length)];
    [puzzleState[emptyIdx], puzzleState[move]] = [puzzleState[move], puzzleState[emptyIdx]];
  }
}

function getPossibleMoves(emptyIdx) {
  const moves = [];
  const row = Math.floor(emptyIdx / puzzleSize), col = emptyIdx % puzzleSize;
  if (row > 0) moves.push(emptyIdx - puzzleSize);
  if (row < puzzleSize - 1) moves.push(emptyIdx + puzzleSize);
  if (col > 0) moves.push(emptyIdx - 1);
  if (col < puzzleSize - 1) moves.push(emptyIdx + 1);
  return moves;
}

function renderPuzzle() {
  const board = document.getElementById('puzzle-board');
  board.innerHTML = '';
  puzzleState.forEach((val, idx) => {
    const tile = document.createElement('div');
    tile.className = 'puzzle-tile' + (val === 0 ? ' empty' : '');
    tile.textContent = val === 0 ? '' : puzzleEmojis[val - 1];
    if (val !== 0 && val === idx + 1) tile.classList.add('correct');
    tile.addEventListener('click', () => moveTile(idx));
    board.appendChild(tile);
  });
}

function moveTile(idx) {
  const emptyIdx = puzzleState.indexOf(0);
  const moves = getPossibleMoves(emptyIdx);
  if (!moves.includes(idx)) return;
  [puzzleState[emptyIdx], puzzleState[idx]] = [puzzleState[idx], puzzleState[emptyIdx]];
  puzzleMoves++;
  document.getElementById('puzzle-moves').textContent = puzzleMoves;
  renderPuzzle();
  checkPuzzleSolved();
}

function checkPuzzleSolved() {
  const solved = puzzleState.every((val, i) =>
    i === puzzleSize * puzzleSize - 1 ? val === 0 : val === i + 1
  );
  if (solved) {
    setTimeout(() => {
      document.getElementById('puzzle-complete').classList.remove('hidden');
      launchConfetti();
      state.puzzleCompleted = true;
      unlockAchievement("Puzzle Solver", "The puzzle is complete! 🧩");
      updateMenu();
    }, 300);
  }
}

document.getElementById('puzzle-shuffle').addEventListener('click', () => {
  shufflePuzzle();
  puzzleMoves = 0;
  document.getElementById('puzzle-moves').textContent = '0';
  document.getElementById('puzzle-complete').classList.add('hidden');
  renderPuzzle();
});

document.getElementById('puzzle-done-btn').addEventListener('click', () => {
  updateVault();
  transitionTo('quiz');
});

// ============================================================
//   SECRET LETTER
// ============================================================
function initLetter() {
  const el = document.getElementById('letter-text');
  const sig = document.getElementById('letter-sig');
  el.textContent = '';
  sig.classList.add('hidden');
  let i = 0;
  const chars = letterContent.split('');

  function typeLetter() {
    if (i < chars.length) {
      if (chars[i] === '\n') el.innerHTML += '<br/>';
      else el.textContent += chars[i];
      i++;
      setTimeout(typeLetter, chars[i-1] === '\n' ? 200 : 28);
    } else {
      sig.classList.remove('hidden');
      unlockAchievement("Love Letter Read", "The words of the heart 💌");
    }
  }
  setTimeout(typeLetter, 400);
}

// ============================================================
//   FUTURE TOGETHER
// ============================================================
function initFuture() {
  const cards = document.querySelectorAll('.future-card');
  cards.forEach((card, i) => {
    setTimeout(() => card.classList.add('visible'), i * 150);
  });
}

// ============================================================
//   GRAND FINALE
// ============================================================
function initFinale() {
  createFinalStarField();
  runFinaleCinematic();
  startFireworks();
}

function createFinalStarField() {
  const field = document.getElementById('finale-star-field');
  for (let i = 0; i < 200; i++) {
    const s = document.createElement('div');
    s.className = 'finale-star';
    const size = Math.random() * 3 + 1;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      animation-duration:${2+Math.random()*3}s;
      animation-delay:${Math.random()*4}s;
      opacity:0;
    `;
    field.appendChild(s);
    setTimeout(() => { s.style.opacity = '0.2'; }, 100 + Math.random() * 3000);
  }
}

function runFinaleCinematic() {
  const linesContainer = document.getElementById('finale-lines');
  const lines = [
    "You solved every challenge...",
    "You found every heart...",
    "You read every word...",
    "Which means you've unlocked the final surprise ❤️"
  ];

  lines.forEach((text, i) => {
    const div = document.createElement('div');
    div.className = 'finale-line';
    div.textContent = text;
    linesContainer.appendChild(div);
  });

  const divs = linesContainer.querySelectorAll('.finale-line');
  divs.forEach((div, i) => {
    setTimeout(() => div.classList.add('reveal'), 1500 + i * 2000);
  });

  setTimeout(() => {
    linesContainer.style.opacity = '0';
    linesContainer.style.transition = 'opacity 1s ease';
    const gift = document.getElementById('finale-gift');
    gift.classList.remove('hidden');
    gift.style.opacity = '0';
    gift.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
    gift.style.transform = 'scale(0.5)';
    setTimeout(() => {
      gift.style.opacity = '1';
      gift.style.transform = 'scale(1)';
    }, 100);
  }, 1500 + lines.length * 2000 + 1500);
}

document.getElementById('finale-gift').addEventListener('click', () => {
  document.getElementById('finale-cinematic').style.opacity = '0';
  document.getElementById('finale-cinematic').style.transition = 'opacity 1s ease';

  setTimeout(() => {
    document.getElementById('finale-cinematic').style.display = 'none';
    const reveal = document.getElementById('finale-reveal-text');
    reveal.classList.remove('hidden');
    reveal.style.opacity = '0';
    reveal.style.transition = 'opacity 1.5s ease';
    setTimeout(() => { reveal.style.opacity = '1'; }, 100);
    launchConfetti(200);
    startSlideshow();
    unlockAchievement("Grand Finale!", "You unlocked the ultimate surprise! 🎉");
  }, 1000);
});

function startSlideshow() {
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('slideshow-dots');
  dotsContainer.innerHTML = '';
  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'slide-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(d);
  });

  slideInterval = setInterval(() => {
    slideIndex = (slideIndex + 1) % slides.length;
    goToSlide(slideIndex);
  }, 3500);
}

function goToSlide(i) {
  document.querySelectorAll('.slide').forEach((s, idx) => {
    s.classList.toggle('active', idx === i);
  });
  document.querySelectorAll('.slide-dot').forEach((d, idx) => {
    d.classList.toggle('active', idx === i);
  });
  slideIndex = i;
}

// ============================================================
//   FIREWORKS
// ============================================================
const fwCanvas = document.getElementById('fireworks-canvas');
const fwCtx = fwCanvas.getContext('2d');
let fireworkParticles = [];

function resizeFwCanvas() {
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;
}
resizeFwCanvas();
window.addEventListener('resize', resizeFwCanvas);

function launchFirework() {
  const startX = (0.2 + Math.random() * 0.6) * fwCanvas.width;
  const startY = (0.2 + Math.random() * 0.4) * fwCanvas.height;
  const colors = ['#f0c060', '#ff6eb4', '#b06cff', '#ff4040', '#40ff80', '#40c0ff', '#fffacd'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * Math.PI * 2;
    const speed = 2 + Math.random() * 5;
    fireworkParticles.push({
      x: startX, y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color, life: 1, gravity: 0.08, size: 1.5 + Math.random() * 2
    });
  }
}

let fireworkActive = false;
function startFireworks() {
  fireworkActive = true;
  resizeFwCanvas();
  animateFireworks();
  const launchLoop = setInterval(() => {
    if (!fireworkActive) { clearInterval(launchLoop); return; }
    launchFirework();
  }, 700);
}

function animateFireworks() {
  if (!fireworkActive) return;
  fwCtx.fillStyle = 'rgba(0,0,0,0.12)';
  fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);

  fireworkParticles = fireworkParticles.filter(p => p.life > 0);
  fireworkParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= 0.99;
    p.life -= 0.016;
    fwCtx.save();
    fwCtx.globalAlpha = Math.max(0, p.life);
    fwCtx.fillStyle = p.color;
    fwCtx.shadowBlur = 6;
    fwCtx.shadowColor = p.color;
    fwCtx.beginPath();
    fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    fwCtx.fill();
    fwCtx.restore();
  });
  requestAnimationFrame(animateFireworks);
}

// ============================================================
//   CONFETTI
// ============================================================
function launchConfetti(count = 80) {
  const container = document.getElementById('confetti-container');
  const colors = ['#f0c060', '#ff6eb4', '#b06cff', '#ff4040', '#40ff80', '#ffaaff', '#aaffff'];
  const shapes = ['circle', 'square', 'heart'];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const size = 8 + Math.random() * 8;
    const left = Math.random() * 100;
    const duration = 2 + Math.random() * 2;
    const delay = Math.random() * 0.5;

    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${left}%;
      top: -20px;
      width: ${size}px;
      height: ${size}px;
      background: ${shape !== 'heart' ? color : 'transparent'};
      color: ${color};
      font-size: ${size * 1.5}px;
      border-radius: ${shape === 'circle' ? '50%' : '2px'};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
    if (shape === 'heart') piece.textContent = '♥';
    container.appendChild(piece);
    setTimeout(() => piece.remove(), (duration + delay + 0.5) * 1000);
  }
}

// ============================================================
//   EASTER EGGS
// ============================================================
function createEasterEggs() {
  const messages = [
    "You found a star ⭐ (+1 love)",
    "Secret discovered 💫",
    "Hidden message: You're amazing! 💖",
    "Easter egg found! 🥚✨",
    "You're so curious 🌟 That's one of my favourite things about you"
  ];
  const positions = [
    {top: '5%', left: '8%'},
    {top: '15%', right: '6%'},
    {bottom: '20%', left: '5%'},
    {bottom: '10%', right: '8%'},
    {top: '45%', left: '3%'}
  ];

  positions.forEach((pos, i) => {
    const star = document.createElement('div');
    star.className = 'easter-star';
    star.textContent = '✦';
    Object.assign(star.style, pos);
    star.addEventListener('click', () => {
      state.easterEggsFound++;
      unlockAchievement("Easter Egg Found!", messages[i % messages.length]);
      star.style.animation = 'none';
      star.style.opacity = '0.6';
      star.style.color = 'var(--gold)';
    });
    document.body.appendChild(star);
  });
}
createEasterEggs();

// Konami-style secret: type "love"
let secretBuffer = '';
document.addEventListener('keydown', e => {
  secretBuffer = (secretBuffer + e.key).slice(-4);
  if (secretBuffer === 'love') {
    unlockAchievement("Love Spelt!", "You typed 'love' 💖 You ARE love.");
    launchConfetti(50);
    secretBuffer = '';
  }
});

// ============================================================
//   MOUSE GLOW EFFECT
// ============================================================
document.addEventListener('mousemove', e => {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;
    left:${e.clientX}px; top:${e.clientY}px;
    width:6px; height:6px;
    background: radial-gradient(circle, rgba(240,192,96,0.3), transparent);
    border-radius:50%;
    pointer-events:none;
    z-index:9997;
    transform:translate(-50%,-50%);
    animation: mouseTrail 0.8s ease forwards;
  `;
  document.body.appendChild(glow);
  setTimeout(() => glow.remove(), 800);
});

// Mouse trail CSS
const trailStyle = document.createElement('style');
trailStyle.textContent = `
@keyframes mouseTrail {
  0% { opacity: 0.6; transform: translate(-50%,-50%) scale(1); }
  100% { opacity: 0; transform: translate(-50%,-50%) scale(3); }
}
`;
document.head.appendChild(trailStyle);

// ============================================================
//   TOUCH SUPPORT (MOBILE)
// ============================================================
document.addEventListener('touchstart', e => {
  cursor.style.display = 'none';
  cursorGlow.style.display = 'none';
}, { passive: true });

// ============================================================
//   INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.future-card, .timeline-item').forEach(el => observer.observe(el));

// ============================================================
//   INITIALISE
// ============================================================
// Ensure intro is active
setTimeout(() => {
  document.getElementById('screen-intro').classList.add('active');
}, 100);
