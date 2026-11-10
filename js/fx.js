
'use strict';
/* Анимации. Motion: появление блоков, полоса прогресса, модальное окно, FAQ.
   anime.js: заголовок, счётчики, таймлайн, пересчёт стоимости.
   Если библиотеки не загрузились или включено «уменьшить движение», сайт работает без анимаций. */
const Fx = (() => {
  const M = window.Motion, A = window.anime;
  const on = !!(M && A && !matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (on) document.documentElement.classList.add('fx');
  const fmt = (n) => new Intl.NumberFormat('ru-RU').format(Math.round(n)).replace(/[\u00a0\u202f]/g, ' ');
  const target = (x) => (x && x.target) || x; // разные версии Motion передают элемент по-разному
  const finish = (el) => { el.classList.add('done'); el.style.opacity = ''; el.style.transform = ''; };

  function reveal() {
    const els = [...document.querySelectorAll('.rv:not(.done)')];
    if (!on) return els.forEach((e) => e.classList.add('done'));
    try {
      M.inView(els, (x) => {
        const el = target(x); if (el.classList.contains('done')) return;
        const i = [...el.parentElement.children].filter((c) => c.classList.contains('rv')).indexOf(el);
        M.animate(el, { opacity: [0, 1], y: [24, 0] }, { duration: .6, delay: Math.min(i, 5) * .08, ease: [.22, 1, .36, 1] }).then(() => finish(el));
      }, { amount: .15 });
    } catch (e) { els.forEach(finish); }
    setTimeout(() => els.forEach((e) => { if (!e.classList.contains('done') && e.getBoundingClientRect().top < innerHeight) finish(e); }), 2500);
  }
  function hero() {
    const h = document.querySelector('.hero h1'); if (!on || !h) return;
    h.innerHTML = h.textContent.trim().split(/\s+/).map((w) => `<span class="w"><span>${w}</span></span>`).join(' ');
    A({ targets: '.hero h1 .w > span', translateY: ['110%', '0%'], duration: 900, delay: A.stagger(70), easing: 'easeOutExpo' });
    A({ targets: '.hero-img img', scale: [1.12, 1], duration: 1600, easing: 'easeOutCubic' });
  }
  function counters() {
    document.querySelectorAll('[data-count]').forEach((el) => {
      const n = +el.dataset.count, s = el.dataset.suf || '', set = (v) => { el.textContent = fmt(v) + s; };
      if (!on) return set(n);
      set(0);
      M.inView(el, () => { const o = { v: 0 }; A({ targets: o, v: n, duration: 1800, easing: 'easeOutExpo', update: () => set(o.v) }); });
    });
  }
  function timeline() {
    const t = document.querySelector('.tl'); if (!on || !t) return;
    M.inView(t, () => {
      A({ targets: '.tl-line', scaleY: [0, 1], duration: 1600, easing: 'easeInOutQuad' });
      A({ targets: '.tl-dot', scale: [0, 1], duration: 500, delay: A.stagger(260), easing: 'easeOutBack' });
    }, { amount: .3 });
  }
  function faq() {
    document.querySelectorAll('.faq').forEach((d) => d.addEventListener('toggle', () => {
      if (on && d.open) M.animate(d.querySelector('.faq-a'), { opacity: [0, 1], y: [-6, 0] }, { duration: .3 });
    }));
  }
  function progress() {
    if (!on || document.getElementById('progress')) return;
    const b = Object.assign(document.createElement('div'), { id: 'progress', className: 'progress' });
    document.body.append(b);
    try { M.scroll(M.animate(b, { scaleX: [0, 1] }, { ease: 'linear' })); } catch (e) { b.remove(); }
  }
  return {
    page() {
      progress();
      if (on) { const a = document.getElementById('app'); M.animate(a, { opacity: [0, 1], y: [10, 0] }, { duration: .35 }).then(() => { a.style.opacity = ''; a.style.transform = ''; }); }
      reveal(); hero(); counters(); timeline(); faq();
    },
    modal() {
      if (!on) return;
      M.animate('.modal', { opacity: [0, 1] }, { duration: .2 });
      M.animate('.dlg', { opacity: [0, 1], y: [24, 0], scale: [.97, 1] }, { duration: .35, ease: [.22, 1, .36, 1] });
    },
    total(el, v) {
      if (el._a) el._a.pause();
      if (v === null) { el.textContent = '—'; el._v = 0; return; }
      const set = (n) => { el.textContent = fmt(n) + ' ₽'; };
      if (!on) { set(v); el._v = v; return; }
      const o = { v: el._v || 0 }; el._v = v;
      el._a = A({ targets: o, v, duration: 600, easing: 'easeOutQuad', update: () => set(o.v) });
    }
  };
})();
