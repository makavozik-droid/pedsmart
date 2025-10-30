/* ======================= FLASHCARDS (ЗДА у дітей) ======================= */
const fcAnemia = [
  { front: "Визначення ЗДА", back: "Стан дефіциту заліза → порушення утворення Hb та еритроцитів." },
  { front: "Причина до 2 років", back: "Недостатнє споживання заліза (пізнє прикормлення, надмір коров’ячого молока)." },
  { front: "Клінічні ознаки", back: "Блідість, слабкість, втома, тахікардія, pica, койлоніхія." },
  { front: "Лабораторні критерії", back: "↓Hb, ↓Ht, ↓MCV, ↓MCH; ↓феритин (чутливий), ↑ЗЗЗС, ↓Fe сироватки." },
  { front: "Дозування заліза", back: "3–5 мг/кг/добу елементарного заліза + 2–3 міс. після нормалізації Hb." }
];

function renderFlashcards(containerId, cards) {
  const mount = document.getElementById(containerId);
  if (!mount) return;

  let current = 0;
  let flipped = false;

  // HTML картки
  mount.innerHTML = `
    <div class="fc">
      <div class="card fc__card" tabindex="0" aria-live="polite">
        <h3 class="card__title fc__title"></h3>
        <p class="card__text fc__text"></p>
      </div>

      <div class="fc__controls" style="margin-top:12px;display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
        <button type="button" class="fc__btn" data-action="flip">Перевернути</button>
        <button type="button" class="fc__btn" data-nav="-1">← Попередня</button>
        <button type="button" class="fc__btn" data-nav="1">Наступна →</button>
      </div>

      <p class="fc__counter" style="margin-top:6px;color:#6b7280;text-align:center"></p>
    </div>
  `;

  const fcWrap = mount.querySelector('.fc');
  const title  = mount.querySelector(".fc__title");
  const text   = mount.querySelector(".fc__text");
  const card   = mount.querySelector(".fc__card");
  const flip   = mount.querySelector('[data-action="flip"]');
  const ctr    = mount.querySelector(".fc__counter");

  // ---- ЄДИНА панель тем (внизу) ----
  const themebar = document.createElement('div');
  themebar.className = 'fc__themebar';
  themebar.innerHTML = `
    <button type="button" class="fc__chip" data-theme="pink">💕 Рожева</button>
    <button type="button" class="fc__chip" data-theme="mint">🌿 М’ятна</button>
    <button type="button" class="fc__chip" data-theme="lavender">💜 Лавандова</button>
  `;
  fcWrap.insertAdjacentElement('afterend', themebar);

  const applyTheme = (theme) => {
    fcWrap.classList.remove('fc--pink','fc--mint','fc--lavender');
    fcWrap.classList.add(`fc--${theme}`);
    localStorage.setItem('fcTheme', theme);
    themebar.querySelectorAll('.fc__chip').forEach(b => {
      b.classList.toggle('is-active', b.dataset.theme === theme);
    });
  };

  themebar.addEventListener('click', (e) => {
    const btn = e.target.closest('.fc__chip');
    if (!btn) return;
    applyTheme(btn.dataset.theme);
  });

  // тема за замовчуванням / збережена
  applyTheme(localStorage.getItem('fcTheme') || 'lavender');

  // ---- логіка картки ----
  const paint = () => {
    const c = cards[current];
    title.textContent = c.front;
    text.textContent  = flipped ? c.back : "";
    ctr.textContent   = `${current + 1} / ${cards.length} (Пробіл — перевернути)`;
    card.classList.toggle("is-flipped", flipped);
  };

  const go = (delta) => {
    current = (current + delta + cards.length) % cards.length;
    flipped = false;
    paint();
  };

  flip.addEventListener("click", () => { flipped = !flipped; paint(); });
  mount.querySelectorAll('.fc__btn[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => go(Number(btn.dataset.nav)));
  });
  card.addEventListener("click", () => { flipped = !flipped; paint(); });

  window.addEventListener("keydown", (e) => {
    if (!mount.contains(document.activeElement)) return;
    if (e.code === "Space" || e.code === "Enter") { e.preventDefault(); flipped = !flipped; paint(); }
    if (e.code === "ArrowRight") go(1);
    if (e.code === "ArrowLeft")  go(-1);
  });

  paint();
}
function renderFlashcardsOld(containerId, cards) {
  const mount = document.getElementById(containerId);
  if (!mount) return;

  flip.addEventListener("click", () => { flipped = !flipped; paint(); });
  mount.querySelectorAll('.fc__btn[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => go(Number(btn.dataset.nav)));
  });
  card.addEventListener("click", () => { flipped = !flipped; paint(); });

  window.addEventListener("keydown", (e) => {
    if (!mount.contains(document.activeElement)) return;
    if (e.code === "Space" || e.code === "Enter") { e.preventDefault(); flipped = !flipped; paint(); }
    if (e.code === "ArrowRight") go(1);
    if (e.code === "ArrowLeft")  go(-1);
  });

  paint();
}
function renderFlashcardsOld(containerId, cards) {
  const mount = document.getElementById(containerId);
  if (!mount) return;

  // Кнопки
  mount.querySelector('[data-action="flip"]').addEventListener("click", () => {
    flipped = !flipped; paint();
  });
  mount.querySelectorAll('.fc__btn[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => go(Number(btn.dataset.nav)));
  });

  // Клік по картці — теж flip
  card.addEventListener("click", () => { flipped = !flipped; paint(); });

  // Клавіатура (поки фокус всередині блоку mount)
  window.addEventListener("keydown", (e) => {
    if (!mount.contains(document.activeElement)) return;
    if (e.code === "Space" || e.code === "Enter") { e.preventDefault(); flipped = !flipped; paint(); }
    if (e.code === "ArrowRight") go(1);
    if (e.code === "ArrowLeft")  go(-1);
  });

  paint();
}

/* ========================= QUIZ (ЗДА у дітей) ========================= */
const quizAnemia = {
  title: "ЗДА у дітей",
  questions: [
    { q: "Найбільш чутливий показник?",
      options: ["Гемоглобін (Hb)","MCV","Феритин сироватки","Залізо сироватки"], correct: 2 },
    { q: "Морфологія ЗДА?",
      options: ["Макроцитарна, нормохромна","Мікроцитарна, гіпохромна","Нормоцитарна, нормохромна","Мікроцитарна, нормохромна"], correct: 1 },
    { q: "Скільки триває терапія після нормалізації Hb?",
      options: ["2 тижні","1 місяць","2–3 місяці","6 місяців"], correct: 2 },
    { q: "Який симптом не типовий для ЗДА?",
      options: ["Койлоніхія","Блідість шкіри","Слабкість","Жовтяниця"], correct: 3 },
    { q: "Добова доза елементарного заліза у дітей?",
      options: ["0.5–1 мг/кг/добу","1–2 мг/кг/добу","3–5 мг/кг/добу","7–10 мг/кг/добу"], correct: 2 },
  ]
};

function renderQuiz(containerId, quiz) {
  const mount = document.getElementById(containerId);
  if (!mount) return;

  let html = `<form class="quiz"><div class="quiz__list">`;
  quiz.questions.forEach((q, i) => {
    html += `
      <article class="card quiz__item">
        <h3 class="card__title">${i + 1}. ${q.q}</h3>
        <div class="quiz__options">
          ${q.options.map((opt, idx) => `
            <label class="quiz__opt">
              <input type="radio" name="q${i}" value="${idx}">
              <span>${opt}</span>
            </label>`).join("")}
        </div>
      </article>`;
  });
  html += `
    </div>
    <div class="quiz__actions">
      <button type="submit" class="btn btn--primary">Перевірити</button>
      <button type="button" class="btn btn--ghost" id="quiz-reset">Скинути</button>
    </div>
    <p class="quiz__score" aria-live="polite"></p>
  </form>`;

  mount.innerHTML = html;

  const form    = mount.querySelector("form.quiz");
  const scoreEl = form.querySelector(".quiz__score");
  const resetBtn= form.querySelector("#quiz-reset");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let correct = 0;
    form.querySelectorAll(".quiz__opt").forEach(el => el.classList.remove("is-correct","is-wrong"));

    quiz.questions.forEach((q, i) => {
      const chosen   = form.querySelector(`input[name="q${i}"]:checked`);
      const chosenIx = chosen ? Number(chosen.value) : -1;
      const rightOpt = form.querySelector(`input[name="q${i}"][value="${q.correct}"]`)?.closest(".quiz__opt");
      rightOpt?.classList.add("is-correct");

      if (chosenIx === q.correct) correct++;
      else if (chosen) chosen.closest(".quiz__opt")?.classList.add("is-wrong");
    });

    scoreEl.textContent = `Ваш результат: ${correct} / ${quiz.questions.length}`;
    scoreEl.classList.add("quiz__score--visible");
    scoreEl.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  resetBtn.addEventListener("click", () => {
    form.reset();
    form.querySelectorAll(".quiz__opt").forEach(el => el.classList.remove("is-correct","is-wrong"));
    scoreEl.textContent = "";
    scoreEl.classList.remove("quiz__score--visible");
  });
}

/* === Панель тем для флешкарток (ін’єкція + логіка) === */
function attachFlashcardThemebar(mount) {
  // mount — контейнер .fc, який створює renderFlashcards
  const fcRoot = mount.closest('.fc') || mount;
  if (!fcRoot || !fcRoot.parentElement) return;

  // 1) Прибрати всі існуючі панелі поряд із цією карткою
  fcRoot.parentElement.querySelectorAll(':scope > .fc__themebar').forEach(el => el.remove());

  // 2) Створити нову панель і вставити ПІСЛЯ картки (внизу)
  const themebar = document.createElement('div');
  themebar.className = 'fc__themebar';
  themebar.innerHTML = `
    <button type="button" class="fc__chip" data-theme="pink">💕 Рожева</button>
    <button type="button" class="fc__chip" data-theme="mint">🌿 М’ятна</button>
    <button type="button" class="fc__chip" data-theme="lavender">💜 Лавандова</button>
  `;
  fcRoot.insertAdjacentElement('afterend', themebar);

  // 3) Застосування теми
  const apply = (theme) => {
    fcRoot.classList.remove('fc--pink','fc--mint','fc--lavender');
    fcRoot.classList.add(`fc--${theme}`);
    localStorage.setItem('fcTheme', theme);
    themebar.querySelectorAll('.fc__chip').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.theme === theme);
    });
  };

  // 4) Клік по чіпах
  themebar.addEventListener('click', (e) => {
    const btn = e.target.closest('.fc__chip');
    if (!btn) return;
    apply(btn.dataset.theme);
  });

  // 5) Стартова тема
  apply(localStorage.getItem('fcTheme') || 'lavender');
}

/* ===================== INIT (DOMContentLoaded) ===================== */
document.addEventListener("DOMContentLoaded", () => {
  // флешкартки (якщо є контейнер)
  const fcMount = document.getElementById("fc-anemia");
  if (fcMount) {
    renderFlashcards("fc-anemia", fcAnemia);
  }

  // тести (якщо є контейнер)
  if (document.getElementById("quiz-anemia")) {
    renderQuiz("quiz-anemia", quizAnemia);
  }

  // (інші твої ініціалізації: карусель і т.д.)
});

/* --- Карусель на головній: автоплей, пауза при наведенні, клік по картці --- */
(function initCarousel() {
  const track = document.getElementById('carousel');
  if (!track) return;

  const cards = Array.from(track.children);
  if (cards.length < 2) return;

  let index = 0;
  let paused = false;

  // функція прокрутки до картки з індексом i
  const stepTo = (i) => {
    const card = cards[i];
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
  };

  // --- кнопки, клавіші та свайп ---
  const prev = document.getElementById('car-prev');
  const next = document.getElementById('car-next');

  // доступність: керування з клавіатури
  track.setAttribute('tabindex', '0');

  if (prev) prev.addEventListener('click', () => {
    paused = true;
    index = (index - 1 + cards.length) % cards.length;
    stepTo(index);
  });
  if (next) next.addEventListener('click', () => {
    paused = true;
    index = (index + 1) % cards.length;
    stepTo(index);
  });

  // клавіатура ← →
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      paused = true; index = (index + 1) % cards.length; stepTo(index);
    }
    if (e.key === 'ArrowLeft') {
      paused = true; index = (index - 1 + cards.length) % cards.length; stepTo(index);
    }
  });

  // свайп на тач-пристроях
  let startX = 0;
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      paused = true;
      if (dx < 0) { index = (index + 1) % cards.length; }
      else        { index = (index - 1 + cards.length) % cards.length; }
      stepTo(index);
    }
  }, { passive: true });

  // автоплей з паузою на hover
  const timer = setInterval(() => {
    if (paused) return;
    index = (index + 1) % cards.length;
    stepTo(index);
  }, 4200);

  track.addEventListener('mouseenter', () => { paused = true; });
  track.addEventListener('mouseleave', () => { paused = false; });

  // клік по картці — переходимо за data-link (якщо не клікнули по <a>)
  track.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    if (e.target.closest('a')) return;
    const url = card.dataset.link;
    if (url && url !== '#') window.location.href = url;
  });

  // перший кадр
  stepTo(index);
})();
