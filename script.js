/* Mihir ❤️ Preeti — Cinematic Anniversary Universe (HTML/CSS/JS only) */

/* ========= Utilities ========= */
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));

const screens = {
  gate: $('#gate'),
  intro: $('#intro'),
  universe: $('#universe'),
  story: $('#story'),
  quiz: $('#quiz'),
  hunt: $('#hunt'),
  letter: $('#letter'),
  future: $('#future'),
  finale: $('#finale')
};

function closeAllSections() {
  Object.values(screens).forEach(sec => sec.classList.remove('visible'));
  // Stop any modal within
  stopAllOverlays();
}

function openSelectedSection(id) {
  closeAllSections();
  const el = screens[id];
  if (!el) return;
  el.classList.add('visible');
  setSectionAudio(id);
  manageBackButtonVisibility(id);
}

/* ========= Audio (single channel with crossfade) ========= */
const audioEl = $('#audio-player');
let currentTrack = '';
let fadeInterval = null;
const tracks = {
  gate: 'assets/audio/password.mp3',
  intro: 'assets/audio/intro.mp3',
  universe: 'assets/audio/intro.mp3',
  story: 'assets/audio/story.mp3',
  quiz: 'assets/audio/quiz.mp3',
  hunt: 'assets/audio/hunt.mp3',
  letter: 'assets/audio/letter.mp3',
  future: 'assets/audio/future.mp3',
  finale: 'assets/audio/finale.mp3'
};

function fadeTo(src, duration = 900, targetVol = 0.9) {
  if (currentTrack === src) return;
  const startVol = audioEl.volume || 0;
  const startPlaying = !audioEl.paused;

  // Fade out
  clearInterval(fadeInterval);
  let t = 0;
  const dt = 30;
  const steps = Math.ceil(duration / dt);

  const out = setInterval(() => {
    t += 1;
    audioEl.volume = Math.max(0, startVol * (1 - t / steps));
    if (t >= steps) {
      clearInterval(out);
      // Switch
      audioEl.src = src;
      currentTrack = src;
      audioEl.loop = true;
      const play = () => audioEl.play().catch(() => {});
      // Fade in
      audioEl.volume = 0;
      play();
      let u = 0;
      fadeInterval = setInterval(() => {
        u += 1;
        audioEl.volume = Math.min(targetVol, (u / steps) * targetVol);
        if (u >= steps) clearInterval(fadeInterval);
      }, dt);
    }
  }, dt);
}

function setSectionAudio(sectionId) {
  const src =
    tracks[sectionId] ||
    tracks['universe']; // fallback
  fadeTo(src);
}

/* ========= Background Stars ========= */
const starCanvas = $('#bg-stars');
const starCtx = starCanvas.getContext('2d');
let W, H, stars = [];
function resizeCanvas() {
  W = starCanvas.width = window.innerWidth;
  H = starCanvas.height = window.innerHeight;
  fxCanvas.width = W;
  fxCanvas.height = H;
}
window.addEventListener('resize', () => {
  resizeCanvas();
  spawnStars();
});
function spawnStars() {
  const density = Math.min(220, Math.floor((W * H) / 12000));
  stars = Array.from({ length: density }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.3 + 0.2,
    a: Math.random() * Math.PI * 2,
    s: Math.random() * 0.5 + 0.2
  }));
}
function renderStars() {
  starCtx.clearRect(0, 0, W, H);
  for (const st of stars) {
    st.a += 0.015 * st.s;
    const tw = 0.7 + Math.sin(st.a) * 0.3;
    starCtx.beginPath();
    starCtx.fillStyle = `rgba(255, 220, 255, ${0.25 * tw})`;
    starCtx.arc(st.x, st.y, st.r * (0.9 + 0.2 * tw), 0, Math.PI * 2);
    starCtx.fill();
  }
  requestAnimationFrame(renderStars);
}

/* ========= FX Canvas (confetti, fireworks, trails) ========= */
const fxCanvas = $('#fx-canvas');
const fx = fxCanvas.getContext('2d');
let fxParticles = [];

function addParticlesBurst(x, y, colorFrom = '#ff7ac4', colorTo = '#b36bff', n = 24, power = 3) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = (Math.random() * 1.5 + 0.5) * power;
    fxParticles.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      life: 1,
      colorFrom, colorTo,
      size: Math.random() * 3 + 1,
      g: 0.04
    });
  }
}

function addConfettiBurst(x, y, n = 40) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = Math.random() * 4 + 1;
    const colors = ['#ffcc66', '#ff7ac4', '#b59bff', '#7effd4', '#78e7ff'];
    fxParticles.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 1.2,
      life: 1.2,
      colorFrom: colors[(Math.random() * colors.length) | 0],
      colorTo: '#ffffff',
      size: Math.random() * 3 + 2,
      g: 0.06,
      confetti: true,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2
    });
  }
}

function addFireworks(cx, cy, rings = 2) {
  for (let r = 1; r <= rings; r++) {
    const n = 50 + r * 30;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const sp = 1.5 * r + Math.random() * 1.2;
      const col = r % 2 ? '#ffd27a' : '#ff7ac4';
      fxParticles.push({
        x: cx, y: cy,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 1.1,
        colorFrom: col,
        colorTo: '#ffffff',
        size: 2 + Math.random() * 2,
        g: 0.04
      });
    }
  }
}

function renderFx() {
  fx.clearRect(0, 0, W, H);
  const next = [];
  for (const p of fxParticles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.g;
    p.life -= 0.015;
    if (p.confetti) p.rot += p.vr;

    if (p.life > 0) {
      const alpha = Math.max(0, p.life);
      const grad = fx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      grad.addColorStop(0, p.colorFrom + Math.floor(alpha * 255).toString(16));
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      fx.fillStyle = grad;
      fx.beginPath();
      fx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      fx.fill();

      if (p.confetti) {
        fx.save();
        fx.translate(p.x, p.y);
        fx.rotate(p.rot);
        fx.fillStyle = p.colorFrom;
        fx.fillRect(-p.size, -p.size * 0.5, p.size * 2, p.size);
        fx.restore();
      }

      next.push(p);
    }
  }
  fxParticles = next;
  requestAnimationFrame(renderFx);
}

/* ========= Custom Cursor + Trail + Magnetic ========= */
const cursorCore = $('#cursor-core');
const cursorRing = $('#cursor-ring');
let cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let target = { x: cursor.x, y: cursor.y };

window.addEventListener('mousemove', (e) => {
  target.x = e.clientX;
  target.y = e.clientY;
});
function animateCursor() {
  const k = 0.18;
  cursor.x += (target.x - cursor.x) * k;
  cursor.y += (target.y - cursor.y) * k;
  cursorCore.style.transform = `translate(${cursor.x - 5}px, ${cursor.y - 5}px)`;
  cursorRing.style.transform = `translate(${cursor.x - 18}px, ${cursor.y - 18}px)`;
  requestAnimationFrame(animateCursor);
}
// Ring growth on interactive elements
['a','button','.opt','.planet','.dream-toggle','.pass-input'].forEach(sel => {
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(sel)) {
      cursorRing.style.width = '48px';
      cursorRing.style.height = '48px';
      cursorRing.style.background = 'radial-gradient(22px 22px at 50% 50%, rgba(255,140,220,0.55), rgba(80,0,120,0.25))';
    }
  }, true);
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(sel)) {
      cursorRing.style.width = '36px';
      cursorRing.style.height = '36px';
      cursorRing.style.background = 'radial-gradient(20px 20px at 50% 50%, rgba(255,120,200,0.45), rgba(80,0,120,0.2))';
    }
  }, true);
});
// Magnetic buttons
function attachMagnetic(el) {
  const rs = el.getBoundingClientRect();
  const strength = 18;
  function onMove(e) {
    const x = e.clientX - (rs.left + rs.width / 2);
    const y = e.clientY - (rs.top + rs.height / 2);
    el.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
  }
  function reset() { el.style.transform = 'translate(0,0)'; }
  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', reset);
}
$$('.magnetic').forEach(attachMagnetic);

/* ========= Navigation and progression ========= */
const STATE = {
  unlockedOrder: 1, // starts with Our Story unlocked
  passwordOk: false
};

function updatePlanetsLock() {
  $$('.planet').forEach(p => {
    const order = Number(p.dataset.order || '99');
    p.dataset.locked = order <= STATE.unlockedOrder ? 'false' : 'true';
  });
}
function goUniverse() {
  openSelectedSection('universe');
  updatePlanetsLock();
}

/* Back button logic: shown inside panels, hidden on menu, but always works */
function manageBackButtonVisibility(sectionId) {
  $$('.nav-back').forEach(b => b.classList.add('hidden'));
  if (sectionId !== 'universe' && sectionId !== 'gate') {
    $$(`#${sectionId} .nav-back`).forEach(b => b.classList.remove('hidden'));
  }
}
document.addEventListener('click', (e) => {
  const back = e.target.closest('[data-back]');
  if (!back) return;
  // Return to universe
  goUniverse();
});

/* ========= Gate (password) ========= */
const PASS_VALUE = '2801';
const passInput = $('#pass');
const passMsg = $('#pass-msg');
$('#unlock').addEventListener('click', tryUnlock);
passInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') tryUnlock();
});

function tryUnlock() {
  const v = passInput.value.trim();
  if (v !== PASS_VALUE) {
    passMsg.textContent = 'Wrong password, Princess ❤️';
    passMsg.classList.remove('ok');
    passMsg.classList.add('err');
    passInput.classList.remove('ok');
    passInput.classList.add('shake');
    addParticlesBurst(window.innerWidth / 2, window.innerHeight / 2, '#ff6b8a', '#ff4fa3', 16, 2);
    setTimeout(() => passInput.classList.remove('shake'), 500);
    return;
  }
  // Correct
  STATE.passwordOk = true;
  passMsg.textContent = '';
  passMsg.classList.remove('err');
  passInput.classList.add('ok');
  addParticlesBurst(window.innerWidth / 2, window.innerHeight / 2, '#ff93d4', '#a070ff', 80, 4);

  // Transition to intro
  setTimeout(() => {
    openSelectedSection('intro');
    runIntroSequence();
  }, 550);
}

/* ========= Intro sequence ========= */
function runIntroSequence() {
  // Typewriter style reveals
  const lines = $$('#intro .tw-line');
  let base = 0;
  lines.forEach((ln) => {
    const delay = Number(ln.dataset.delay || base);
    setTimeout(() => ln.classList.add('show'), delay);
  });
}

$('#enter-universe').addEventListener('click', () => {
  // cinematic transition burst
  addParticlesBurst(window.innerWidth / 2, window.innerHeight / 2, '#ff7ac4', '#b36bff', 120, 4);
  goUniverse();
});

/* ========= Universe planet navigation ========= */
$$('.planet').forEach(p => {
  p.addEventListener('click', () => {
    const locked = p.dataset.locked === 'true';
    const section = p.dataset.section;
    if (locked) {
      addParticlesBurst(cursor.x, cursor.y, '#bfa6ff', '#ff9fd8', 14, 2);
      return;
    }
    openSelectedSection(section);
    // Section-specific init:
    if (section === 'story') {} // nothing extra on open
    if (section === 'quiz') { /* waits for start */ }
    if (section === 'hunt') { /* waits for start */ }
    if (section === 'letter') startLetterTyping();
    if (section === 'future') {} // toggles controlled by user
    if (section === 'finale') startFinaleSequence();
  });
});

/* ========= Story Completion ========= */
$('#story-complete').addEventListener('click', () => {
  // Unlock next
  STATE.unlockedOrder = Math.max(STATE.unlockedOrder, 2);
  addConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 80);
  goUniverse();
});

/* ========= Quiz ========= */
const quizHowto = $('#quiz-howto');
const quizCore = $('#quiz-core');
const quizProgress = $('#quiz-progress');
const quizCounter = $('#quiz-counter');
const quizFinish = $('#quiz-finish');
const quizResultText = $('#quiz-result-text');

$('#start-quiz').addEventListener('click', () => {
  quizHowto.classList.add('hidden');
  quizCore.classList.remove('hidden');
  startQuiz();
});

let quizIndex = 0;
let quizWrong = 0;

function startQuiz() {
  quizIndex = 0;
  quizWrong = 0;
  $$('.q-wrap', quizCore).forEach((el, i) => {
    el.classList.toggle('hidden', i !== 0);
    // Clear prior mark
    $$('.opt', el).forEach(b => b.classList.remove('correct','wrong'));
  });
  quizProgress.style.width = '0%';
  quizCounter.textContent = '0 / 3';
  quizFinish.classList.add('hidden');

  $$('.q-wrap .opt').forEach(btn => {
    btn.onclick = (e) => {
      const wrap = e.currentTarget.closest('.q-wrap');
      const correct = wrap.dataset.answer;
      const choice = e.currentTarget.dataset.val;
      const opts = $$('.opt', wrap);
      opts.forEach(o => o.disabled = true);

      if (choice === correct) {
        e.currentTarget.classList.add('correct');
        addParticlesBurst(cursor.x, cursor.y, '#7effd4', '#78e7ff', 32, 3);
      } else {
        e.currentTarget.classList.add('wrong');
        addParticlesBurst(cursor.x, cursor.y, '#ff6b8a', '#ff4fa3', 26, 3);
        quizWrong += 1;
      }
      setTimeout(nextQuestion, 550);
    };
  });
}

function nextQuestion() {
  const qs = $$('.q-wrap', quizCore);
  qs[quizIndex].classList.add('hidden');

  quizIndex += 1;
  const prog = Math.round((quizIndex / qs.length) * 100);
  quizProgress.style.width = prog + '%';
  quizCounter.textContent = `${Math.min(quizIndex, qs.length)} / ${qs.length}`;

  if (quizIndex >= qs.length) {
    // Secret Unlock: at least TWO wrong answers unlock the next
    const normalPass = (qs.length - quizWrong) >= 2; // pretend typical logic
    const secretPass = quizWrong >= 2; // hidden condition actually used
    quizFinish.classList.remove('hidden');
    quizResultText.textContent = normalPass ? 'You did great! Your heart knows the answers.' : 'Not perfect—but love isn’t about perfect answers, it’s about us.';

    // Regardless of visible message, unlock on secret condition:
    if (secretPass) {
      STATE.unlockedOrder = Math.max(STATE.unlockedOrder, 3);
    } else if (normalPass) {
      // If she does well, also unlock (keeps experience smooth)
      STATE.unlockedOrder = Math.max(STATE.unlockedOrder, 3);
    }
  } else {
    qs[quizIndex].classList.remove('hidden');
  }
}

$('#quiz-continue').addEventListener('click', () => {
  addConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 120);
  goUniverse();
});

/* ========= Anniversary Letter Hunt (floating letters) ========= */
const HUNT_TARGET = 'HAPPY 2ND ANNIVERSARY PREETUU ❤️';
const huntHowto = $('#hunt-howto');
const huntCore = $('#hunt-core');
const huntFinish = $('#hunt-finish');
const huntStage = $('#hunt-stage');
const huntTimerEl = $('#hunt-timer');
const huntCountEl = $('#hunt-count');
const huntTotalEl = $('#hunt-total');
const huntCollectedEl = $('#hunt-collected');
const huntMessageEl = $('#hunt-message');

let huntLetters = [];
let huntPicked = [];
let huntTimer = 0;
let huntTicker = null;

$('#start-hunt').addEventListener('click', () => {
  huntHowto.classList.add('hidden');
  huntCore.classList.remove('hidden');
  startHunt();
});

function startHunt() {
  // Reset
  huntStage.innerHTML = '';
  huntCollectedEl.textContent = '';
  huntPicked = [];
  huntLetters = HUNT_TARGET.split('');
  const totalLetters = huntLetters.filter(c => c !== ' ').length;
  huntTotalEl.textContent = totalLetters;
  huntCountEl.textContent = '0';
  huntTimer = 60;
  huntTimerEl.textContent = huntTimer.toString();

  // Spawn letters randomly floating
  const stageRect = huntStage.getBoundingClientRect();
  huntLetters.forEach((ch, idx) => {
    if (ch === ' ') return; // don't spawn spaces
    const el = document.createElement('div');
    el.className = 'letter';
    el.textContent = ch;
    const x = Math.random() * (stageRect.width - 50) + 10;
    const y = Math.random() * (stageRect.height - 50) + 10;
    el.style.left = x + 'px';
    el.style.top = y + 'px';

    // Gentle float animation via JS
    const dir = Math.random() < 0.5 ? -1 : 1;
    let t = Math.random() * Math.PI * 2;
    const sp = 0.02 + Math.random() * 0.03;
    const amp = 14 + Math.random() * 16;

    el._anim = function anim() {
      t += sp;
      const dx = Math.cos(t) * amp;
      const dy = Math.sin(t) * amp * 0.6 * dir;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el._raf = requestAnimationFrame(anim);
    };
    el._raf = requestAnimationFrame(el._anim);

    el.addEventListener('click', () => {
      cancelAnimationFrame(el._raf);
      el.remove();
      huntPicked.push(ch);
      huntCollectedEl.textContent = huntPicked.join('');
      huntCountEl.textContent = String(huntPicked.length);
      addParticlesBurst(cursor.x, cursor.y, '#ff7ac4', '#b36bff', 22, 3);
      checkHuntDone();
    });

    huntStage.appendChild(el);
  });

  // Timer
  clearInterval(huntTicker);
  huntTicker = setInterval(() => {
    huntTimer -= 1;
    huntTimerEl.textContent = huntTimer.toString();
    if (huntTimer <= 0) {
      clearInterval(huntTicker);
      // If not completed, gently help: auto-collect remaining
      autoCollectRemaining();
      checkHuntDone(true);
    }
  }, 1000);
}

function autoCollectRemaining() {
  const remain = $$('.letter', huntStage);
  remain.forEach((el) => {
    el.click();
  });
}

function checkHuntDone(fromAuto = false) {
  const remain = $$('.letter', huntStage).length;
  if (remain === 0) {
    clearInterval(huntTicker);
    // Completion animation
    addConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 160);
    setTimeout(() => {
      huntCore.classList.add('hidden');
      huntFinish.classList.remove('hidden');
      huntMessageEl.textContent = HUNT_TARGET;
      // Unlock next section
      STATE.unlockedOrder = Math.max(STATE.unlockedOrder, 4);
    }, 400);
  }
}

$('#hunt-continue').addEventListener('click', () => {
  goUniverse();
});

/* ========= Letter From Mihir typing ========= */
let letterStarted = false;
function startLetterTyping() {
  if (letterStarted) return;
  letterStarted = true;
  const paras = $$('#letter-typed p');
  let d = 0;
  paras.forEach(p => {
    setTimeout(() => p.classList.add('show'), d);
    d += 650;
  });
}
$('#letter-continue').addEventListener('click', () => {
  STATE.unlockedOrder = Math.max(STATE.unlockedOrder, 5);
  addParticlesBurst(window.innerWidth / 2, window.innerHeight / 2, '#ffd27a', '#ff9fd8', 80, 3);
  goUniverse();
});

/* ========= Future Together ========= */
$$('.dream-card').forEach(card => {
  const btn = $('.dream-toggle', card);
  const body = $('.dream-body', card);
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    // measure height
    if (!expanded) {
      body.style.height = 'auto';
      const h = body.clientHeight + 16;
      body.style.height = '0px';
      body.offsetHeight; // force reflow
      body.style.height = h + 'px';
      body.classList.add('open');
    } else {
      body.style.height = body.clientHeight + 'px';
      body.offsetHeight;
      body.style.height = '0px';
      body.classList.remove('open');
    }
    btn.setAttribute('aria-expanded', (!expanded).toString());
  });
});
$('#future-continue').addEventListener('click', () => {
  STATE.unlockedOrder = Math.max(STATE.unlockedOrder, 6);
  addParticlesBurst(window.innerWidth / 2, window.innerHeight / 2, '#b59bff', '#7effd4', 90, 3);
  goUniverse();
});

/* ========= Finale ========= */
function startFinaleSequence() {
  // Reveal lines one by one, then show photo, text
  const seq = $$('#finale .finale-seq .tw-line');
  let t = 0;
  seq.forEach((ln, i) => {
    setTimeout(() => ln.classList.add('show'), t);
    t += 1400;
  });
  // Could add additional staged reveals if desired
}
$('#finale-button').addEventListener('click', () => {
  $('#finale-sign').classList.remove('hidden');
  // Fireworks + confetti + hearts
  addFireworks(window.innerWidth * 0.3, window.innerHeight * 0.4, 3);
  addFireworks(window.innerWidth * 0.7, window.innerHeight * 0.35, 3);
  addConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.2, 180);
  // Floating hearts burst
  heartShower();
});

function heartShower(n = 36) {
  for (let i = 0; i < n; i++) {
    const x = Math.random() * window.innerWidth * 0.9 + window.innerWidth * 0.05;
    const y = Math.random() * window.innerHeight * 0.2 + window.innerHeight * 0.6;
    addParticlesBurst(x, y, '#ff7ac4', '#ff9fd8', 16, 2);
  }
}

/* ========= Overlay/Modal guards ========= */
function stopAllOverlays() {
  // Close quiz/hunt overlays if visible
  quizHowto?.classList.add('hidden');
  huntHowto?.classList.add('hidden');
  // Reset states that must reopen with user action
  quizFinish?.classList.add('hidden');
  huntFinish?.classList.add('hidden');
  quizCore?.classList.add('hidden');
  huntCore?.classList.add('hidden');
}

/* ========= Initialization ========= */
function init() {
  resizeCanvas();
  spawnStars();
  renderStars();
  renderFx();
  animateCursor();

  // Initial audio
  setSectionAudio('gate');
  updatePlanetsLock();

  // Accessibility: allow scrolling inside panels if content exceeds
  // but keep body non-scrolling for cinematic feel
  Object.values(screens).forEach(s => {
    s.addEventListener('wheel', () => {
      // nothing needed, panels are full-screen
    }, { passive: true });
  });
}

init();
