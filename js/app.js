'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rub = (n) => new Intl.NumberFormat('ru-RU').format(Math.round(n)).replace(/\u00a0/g, ' ') + ' ₽';
const API_URL = './api/leads';

/* ---------- Компоненты ---------- */
const NAV = [['/', 'Главная'], ['/services', 'Услуги'], ['/projects', 'Проекты'], ['/about', 'О компании'], ['/prices', 'Цены'], ['/calculator', 'Калькулятор'], ['/reviews', 'Отзывы'], ['/contacts', 'Контакты']];
const logo = `<a class="logo" href="#/" aria-label="Основа — на главную"><svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#17181a"/><path d="M6 24V12l10-6 10 6v12h-6v-8h-8v8z" fill="#d9a521"/></svg>Основа</a>`;
const btn = (label, action, cls = 'btn-gold', extra = '') => `<button class="btn ${cls}" type="button" data-action="${action}" ${extra}>${label}</button>`;

const Header = () => `<div class="wrap bar">${logo}<button class="burger" aria-label="Открыть меню" aria-expanded="false" data-action="menu"><span></span><span></span><span></span></button>
<nav class="nav" id="nav" aria-label="Основная навигация">${NAV.map(([h, l]) => `<a href="#${h}" data-nav="${h}">${l}</a>`).join('')}</nav>
${btn('Получить консультацию', 'modal', 'btn-gold hdr-cta')}</div>`;

const Footer = () => `<div class="wrap"><div class="fgrid"><div>${logo.replace('<a', '<a style="color:#fff"')}<p style="margin-top:14px;max-width:34ch">Строим дома, ремонтируем и реконструируем объекты под ключ. Фиксированная смета и гарантия 5 лет.</p></div>
<div><h3>Навигация</h3>${NAV.slice(0, 7).map(([h, l]) => `<a href="#${h}">${l}</a>`).join('')}</div>
<div><h3>Услуги</h3>${SERVICES.map((s) => `<a href="#/services/${s.id}">${s.title}</a>`).join('')}</div>
<div><h3>Контакты</h3><a href="tel:+74952154830">${COMPANY.phone}</a><a href="mailto:${COMPANY.email}">${COMPANY.email}</a><p>${COMPANY.address}</p>${COMPANY.socials.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join('')}</div></div>
<div class="copy"><span>© ${new Date().getFullYear()} ООО «Основа». Все права защищены.</span><a href="#/privacy" style="display:inline">Политика конфиденциальности</a></div></div>`;

const ServiceCard = (s) => `<article class="card rv"><a class="im" href="#/services/${s.id}" tabindex="-1" aria-hidden="true"><img src="${s.img}" alt="" loading="lazy"></a><div class="bd"><h3>${s.title}</h3><p>${s.short}</p><div class="ft"><span class="price">от ${rub(s.from)}/${s.unit}</span><a class="btn btn-line" href="#/services/${s.id}" aria-label="Подробнее: ${s.title}">Подробнее</a></div></div></article>`;
const ProjectCard = (p) => `<article class="card rv"><a class="im" href="#/projects/${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="Проект: ${p.title}" loading="lazy"></a><div class="bd"><span class="tag">${CAT_LABEL[p.cat]}</span><h3><a href="#/projects/${p.id}">${p.title}</a></h3><div class="meta"><span>${p.city}</span><span>${p.area} м²</span><span>${p.term} мес.</span></div><div class="ft"><span class="price">${rub(p.cost)}</span><a class="btn btn-line" href="#/projects/${p.id}">Открыть</a></div></div></article>`;
const ReviewCard = (r) => `<article class="rev"><div class="who"><img src="${face(r.name[0])}" alt="${r.name}" width="52" height="52"><div><b>${r.name}</b><div class="meta">${r.city}</div></div></div><div class="stars" role="img" aria-label="Оценка ${r.rate} из 5">${'★'.repeat(r.rate)}${'☆'.repeat(5 - r.rate)}</div><p>${r.text}</p><span class="tag">${r.project}</span></article>`;
const Slider = () => `<div class="slider" id="slider" tabindex="0" aria-label="Отзывы клиентов">${REVIEWS.map(ReviewCard).join('')}</div>`;
const Cta = (t = 'Обсудим ваш проект?') => `<div class="cta rv"><div><h2 style="margin:0 0 8px">${t}</h2><p>Перезвоним в течение 15 минут в рабочее время и подготовим предварительную смету.</p></div>${btn('Получить консультацию', 'modal')}</div>`;
const Head = (t, lead, extra = '') => `<div class="head"><div><h2>${t}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}</div>${extra}</div>`;
const PageHead = (...a) => Head(...a).replace('<h2>', '<h1>').replace('</h2>', '</h1>'); // заголовок страницы = h1
const Crumbs = (t) => `<p class="meta" style="margin-bottom:16px"><a href="#/">Главная</a><span>/</span><span>${t}</span></p>`;

const Why = () => `<section class="alt"><div class="wrap">${Head('Почему «Основа»', 'Шесть обязательств, которые мы записываем в договор. За их нарушение отвечаем мы, а не вы.')}<div class="grid3">${ADVANTAGES.map((x, i) => `<article class="why-card rv"><span class="why-n">0${i + 1}</span><b class="why-big">${x.big}</b><h3>${x.title}</h3><p>${x.text}</p></article>`).join('')}</div></div></section>`;
const Process = () => `<section><div class="wrap">${Head('Как мы работаем', 'Шесть шагов от заявки до ключей. На каждом вы знаете, что происходит, сколько это стоит и когда закончится.')}<div class="tl" role="list"><span class="tl-line" aria-hidden="true"></span>${PROCESS.map((s, i) => `<div class="tl-i" role="listitem"><i class="tl-dot">${i + 1}</i><div class="tl-b"><h3>${s.title}</h3><p>${s.text}</p><span class="tag">${s.term}</span></div></div>`).join('')}</div></div></section>`;
const Compare = () => `<section><div class="wrap">${Head('Чем мы отличаемся от обычного подрядчика', 'Сравните условия до того, как подписывать любой договор.')}<div class="tw"><table class="vs"><thead><tr><th><span class="sr">Критерий</span></th><th>«Основа»</th><th>Обычный подрядчик</th></tr></thead><tbody>${COMPARE.map(([k, b, c]) => `<tr><th scope="row">${k}</th><td><span class="ok-i" aria-hidden="true">✓</span>${b}</td><td><span class="no-i" aria-hidden="true">✕</span>${c}</td></tr>`).join('')}</tbody></table></div></div></section>`;
const Faq = () => `<section><div class="wrap">${Head('Частые вопросы')}<div class="faq-list">${FAQ.map(([q, x]) => `<details class="faq rv"><summary>${q}</summary><div class="faq-a"><p>${x}</p></div></details>`).join('')}</div></div></section>`;

/* ---------- Страницы ---------- */
const Pages = {
  home: () => `<section class="hero"><div class="wrap"><div class="hero-grid"><div><h1>Строим дома, в которых хочется жить</h1><p class="lead">Полный цикл от проекта до ключей. Фиксированная смета в договоре, фотоотчёт каждую неделю и гарантия 5 лет.</p><div class="btns">${btn('Получить консультацию', 'modal')}<a class="btn btn-line" href="#/calculator">Рассчитать стоимость</a></div><ul class="proof"><li>Цена из договора не растёт</li><li>Независимый технадзор</li><li>Гарантия 5 лет</li></ul></div><div class="hero-img"><img src="${art(2)}" alt="Современный двухэтажный дом, построенный компанией «Основа»"></div></div>
<div class="stats"><div><b data-count="12" data-suf="+">12+</b><span>лет опыта</span></div><div><b data-count="350" data-suf="+">350+</b><span>реализованных проектов</span></div><div><b data-count="48">48</b><span>специалистов</span></div><div><b data-count="98" data-suf="%">98%</b><span>клиентов рекомендуют нас</span></div></div></div></section>
${Why()}
${Process()}
<section class="alt"><div class="wrap">${Head('Что мы делаем', 'Шесть направлений, которые закрывают весь цикл строительства.', '<a class="btn btn-line" href="#/services">Все услуги</a>')}<div class="grid3">${SERVICES.map(ServiceCard).join('')}</div></div></section>
<section><div class="wrap">${Head('Рассчитайте стоимость', 'Выберите параметры, и мы покажем ориентир по бюджету.')}${Calc()}</div></section>
<section class="alt"><div class="wrap">${Head('Объекты, которые мы сдали', 'Реальные сроки и стоимость каждого проекта.', '<a class="btn btn-line" href="#/projects">Все проекты</a>')}<div class="grid3">${PROJECTS.slice(0, 3).map(ProjectCard).join('')}</div></div></section>
${Compare()}
<section class="alt"><div class="wrap">${Head('Отзывы клиентов', '', '<div class="arrows"><button class="chip" data-action="prev" aria-label="Назад">‹</button><button class="chip" data-action="next" aria-label="Вперёд">›</button></div>')}${Slider()}</div></section>
${Faq()}
<section class="alt"><div class="wrap">${Cta()}</div></section>`,

  services: () => `<section><div class="wrap">${Crumbs('Услуги')}${PageHead('Услуги', 'Работаем по договору с фиксированной ценой и поэтапной оплатой.')}<div class="grid3">${SERVICES.map(ServiceCard).join('')}</div></div></section>`,

  service: (id) => {
    const s = SERVICES.find((x) => x.id === id); if (!s) return Pages.nf();
    return `<section><div class="wrap">${Crumbs(s.title)}<div class="two"><div><h1 style="font-size:clamp(34px,5vw,56px);margin-bottom:20px">${s.title}</h1><p class="lead">${s.text}</p><h2 style="font-size:26px;margin:36px 0 8px">Что входит</h2><ol class="steps">${s.items.map((i) => `<li>${i}</li>`).join('')}</ol></div><div><img src="${s.img}" alt="${s.title}" style="border-radius:8px;margin-bottom:20px"><div class="panel"><p class="meta">Стоимость</p><p class="price" style="font-size:28px">от ${rub(s.from)}/${s.unit}</p><p style="color:var(--mut);margin:8px 0 20px;font-size:15px">Точную цену назовём после выезда специалиста.</p>${btn('Заказать услугу', 'modal', 'btn-gold', `data-service="${s.id}"`)}</div></div></div></div></section>`;
  },

  projects: () => `<section><div class="wrap">${Crumbs('Проекты')}${PageHead('Наши проекты', 'Объекты, которые мы сдали в срок и по смете.')}<div class="filters" role="group" aria-label="Фильтр проектов">${Object.entries(CATS).map(([k, v]) => `<button class="chip ${k === 'all' ? 'on' : ''}" data-filter="${k}" aria-pressed="${k === 'all'}">${v}</button>`).join('')}</div><div class="grid3" id="plist">${PROJECTS.map(ProjectCard).join('')}</div></div></section>`,

  project: (id) => {
    const p = PROJECTS.find((x) => x.id === id); if (!p) return Pages.nf();
    return `<section><div class="wrap">${Crumbs(p.title)}<span class="tag">${CAT_LABEL[p.cat]}</span><h1 style="font-size:clamp(32px,5vw,54px);margin:12px 0 28px">${p.title}</h1>
<div class="gal"><div><img src="${p.gallery[0]}" alt="${p.title}, общий вид"></div><div><img src="${p.gallery[1]}" alt="${p.title}, фасад"><img src="${p.gallery[2]}" alt="${p.title}, вид сбоку"></div></div>
<div class="spec"><div><b>${p.city}</b><span>Город</span></div><div><b>${p.area} м²</b><span>Площадь</span></div><div><b>${p.term} мес.</b><span>Срок</span></div><div><b>${rub(p.cost)}</b><span>Стоимость</span></div></div>
<div class="two"><div><h2 style="font-size:28px">О проекте</h2><p class="lead">${p.text}</p><h2 style="font-size:28px;margin-top:40px">Этапы работы</h2><ol class="steps">${STAGES.map((s) => `<li>${s}</li>`).join('')}</ol></div><div><h2 style="font-size:28px">Материалы</h2><ul style="padding-left:20px;margin-bottom:28px">${p.mat.map((m) => `<li>${m}</li>`).join('')}</ul>${btn('Хочу такой проект', 'modal', 'btn-gold', `data-service="${p.cat === 'house' ? 'doma' : p.cat === 'repair' ? 'remont' : p.cat === 'commercial' ? 'kommercheskoe' : 'rekonstrukciya'}" data-note="Хочу проект, как «${p.title}»"`)}</div></div>
<h2 style="font-size:28px;margin:48px 0 20px">До и после</h2><div class="cmp" data-cmp><img src="${p.after}" alt="После: готовый объект"><img class="cmp-b" src="${p.before}" alt="До: стройплощадка"><span class="cmp-t">До</span><span class="cmp-t cmp-a">После</span><i class="cmp-h" aria-hidden="true"></i><input class="cmp-in" type="range" min="0" max="100" value="50" aria-label="Сравнение до и после"></div></div></section>`;
  },

  about: () => `<section><div class="wrap">${Crumbs('О компании')}<div class="two"><div><h1 style="font-size:clamp(34px,5vw,56px);margin-bottom:20px">Мы строим так, как строили бы для себя</h1><p class="lead">«Основа» работает с 2013 года. Мы начинали с ремонта квартир, а сегодня строим дома и коммерческие здания в Москве и области. В команде 48 инженеров, прорабов и отделочников. Подрядчиков мы не меняем годами.</p><p class="lead" style="margin-top:16px">Мы убеждены, что клиент должен видеть стройку. Поэтому фотоотчёт приходит раз в неделю, а смета и акты доступны в личном кабинете.</p></div><img src="${art(3)}" alt="Объект компании «Основа»" style="border-radius:8px"></div></div></section>
<section class="alt"><div class="wrap">${Head('Принципы работы')}<div class="grid3">${[['Фиксированная смета', 'Цена из договора не растёт. Если мы ошиблись в расчёте, разницу платим мы.'], ['Технадзор на каждом этапе', 'Независимый инженер проверяет скрытые работы до того, как их закроют отделкой.'], ['Гарантия 5 лет', 'Устраняем дефекты бесплатно и выезжаем на объект в течение трёх рабочих дней.']].map(([t, d]) => `<div class="panel rv"><h3 style="margin-bottom:8px">${t}</h3><p style="color:var(--mut)">${d}</p></div>`).join('')}</div></div></section><section><div class="wrap">${Cta()}</div></section>`,

  prices: () => `<section><div class="wrap">${Crumbs('Цены')}${PageHead('Цены', 'Ориентировочная стоимость работ. Итоговая цена зависит от проекта и участка.')}<div class="tw"><table><thead><tr><th>Услуга</th><th>Стоимость</th><th>Срок</th></tr></thead><tbody>${PRICES.map(([a, b, c]) => `<tr><td>${a}</td><td class="price">${b}</td><td>${c}</td></tr>`).join('')}</tbody></table></div><div style="margin-top:40px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn-gold" href="#/calculator">Рассчитать в калькуляторе</a>${btn('Получить консультацию', 'modal', 'btn-line')}</div></div></section>`,

  calculator: () => `<section><div class="wrap">${Crumbs('Калькулятор')}${PageHead('Калькулятор стоимости', 'Результат пересчитывается при каждом изменении параметров.')}${Calc()}</div></section>`,

  reviews: () => `<section><div class="wrap">${Crumbs('Отзывы')}${PageHead('Отзывы клиентов', 'Читайте, что говорят о нас заказчики.', '<div class="arrows"><button class="chip" data-action="prev" aria-label="Назад">‹</button><button class="chip" data-action="next" aria-label="Вперёд">›</button></div>')}${Slider()}<div style="margin-top:56px">${Cta('Хотите так же?')}</div></div></section>`,

  contacts: () => `<section><div class="wrap">${Crumbs('Контакты')}${PageHead('Контакты')}<div class="two"><div><dl style="display:grid;gap:18px;margin-bottom:28px"><div><dt class="meta">Адрес</dt><dd>${COMPANY.address}</dd></div><div><dt class="meta">Телефон</dt><dd><a href="tel:+74952154830">${COMPANY.phone}</a></dd></div><div><dt class="meta">Email</dt><dd><a href="mailto:${COMPANY.email}">${COMPANY.email}</a></dd></div><div><dt class="meta">График работы</dt><dd>${COMPANY.hours}</dd></div><div><dt class="meta">Соцсети</dt><dd>${COMPANY.socials.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener" style="margin-right:14px;border-bottom:2px solid var(--gold)">${n}</a>`).join('')}</dd></div></dl><iframe class="map" title="Карта: офис компании «Основа»" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=37.665,55.768,37.692,55.781&marker=55.7745,37.6788"></iframe><a class="btn btn-dark" style="margin-top:16px" target="_blank" rel="noopener" href="https://yandex.ru/maps/?rtext=~55.7745,37.6788&rtt=auto">Построить маршрут</a></div><div class="panel"><h2 style="font-size:26px">Напишите нам</h2>${LeadForm('contact')}</div></div></div></section>`,

  privacy: () => `<section><div class="wrap prose">${Crumbs('Политика конфиденциальности')}<h1 style="font-size:clamp(32px,5vw,48px)">Политика конфиденциальности</h1><h2>1. Какие данные мы собираем</h2><p>Имя, телефон, адрес электронной почты и текст обращения, которые вы указываете в формах на сайте.</p><h2>2. Для чего мы их используем</h2><p>Чтобы связаться с вами, подготовить расчёт стоимости и ответить на вопросы. Данные не передаются третьим лицам без вашего согласия, кроме случаев, предусмотренных законом.</p><h2>3. Хранение и защита</h2><p>Заявки хранятся на серверах на территории РФ в течение срока, необходимого для обработки обращения, и не более трёх лет.</p><h2>4. Ваши права</h2><p>Вы можете запросить уточнение, блокировку или удаление своих данных, написав на ${COMPANY.email}. Ответим в течение 10 рабочих дней.</p></div></section>`,

  nf: () => `<section class="nf"><div class="wrap"><h1>404</h1><h2>Такой страницы нет</h2><p class="lead" style="margin:0 auto 28px">Возможно, ссылка устарела. Перейдите на главную или посмотрите наши проекты.</p><a class="btn btn-gold" href="#/">На главную</a> <a class="btn btn-line" href="#/projects">Проекты</a></div></section>`
};

/* ---------- Калькулятор ---------- */
function Calc() {
  const radios = (name, o, def) => `<div class="opts">${Object.entries(o).map(([k, v]) => `<label><input type="radio" name="${name}" value="${k}" ${k === def ? 'checked' : ''}><span>${v[0]}</span></label>`).join('')}</div>`;
  return `<form class="calc" id="calc" novalidate><div class="panel"><fieldset class="field"><legend>Тип объекта</legend>${radios('obj', CALC.obj, 'house')}</fieldset>
<div class="field"><label for="area">Площадь, м²</label><input class="in" id="area" name="area" type="number" min="20" max="5000" value="150" inputmode="numeric"><span class="err" id="area-err"></span></div>
<fieldset class="field"><legend>Материал стен</legend>${radios('mat', CALC.mat, 'aerated')}</fieldset><fieldset class="field"><legend>Тип отделки</legend>${radios('fin', CALC.fin, 'base')}</fieldset>
<fieldset class="field" style="margin:0"><legend>Дополнительные услуги</legend><div class="opts">${Object.entries(CALC.ext).map(([k, v]) => `<label><input type="checkbox" name="ext" value="${k}"><span>${v[0]}</span></label>`).join('')}</div></fieldset></div>
<div class="sum" aria-live="polite"><p>Примерная стоимость:</p><div class="big" id="total">—</div><small>Точная стоимость рассчитывается после консультации специалиста.</small>${btn('Получить точный расчёт', 'modal', 'btn-gold', 'data-calc="1" style="width:100%"')}</div></form>`;
}
function calcTotal(f) {
  const area = Number(f.area.value);
  if (!(area >= 20 && area <= 5000)) return null;
  const v = (n) => f.querySelector(`[name=${n}]:checked`).value;
  const ext = $$('[name=ext]:checked', f).reduce((s, e) => s + CALC.ext[e.value][1], 0);
  return area * (CALC.mat[v('mat')][1] * CALC.obj[v('obj')][1] + CALC.fin[v('fin')][1] + ext);
}
function updateCalc(f) {
  const t = calcTotal(f), err = $('#area-err', f);
  f.area.classList.toggle('bad', t === null); err.textContent = t === null ? 'Введите площадь от 20 до 5000 м²' : '';
  Fx.total($('#total', f), t);
  f.dataset.summary = t === null ? '' : `Расчёт: ${$('[name=obj]:checked + span', f).textContent}, ${f.area.value} м², ${$('[name=mat]:checked + span', f).textContent}, отделка «${$('[name=fin]:checked + span', f).textContent}». Ориентир: ${rub(t)}`;
}

/* ---------- Форма заявки ---------- */
function LeadForm(id) {
  return `<form data-lead novalidate id="f-${id}"><div class="fail" role="alert" hidden>Отправка заявок пока не подключена на GitHub Pages. Для приёма заявок нужен сервер или внешний сервис форм.</div>
<div class="field"><label for="${id}-name">Имя</label><input class="in" id="${id}-name" name="name" autocomplete="name" required><span class="err"></span></div>
<div class="field"><label for="${id}-phone">Телефон</label><input class="in" id="${id}-phone" name="phone" type="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required><span class="err"></span></div>
<div class="field"><label for="${id}-email">Email</label><input class="in" id="${id}-email" name="email" type="email" autocomplete="email" required><span class="err"></span></div>
<div class="field"><label for="${id}-svc">Тип услуги</label><select class="in" id="${id}-svc" name="service">${SERVICES.map((s) => `<option value="${s.id}">${s.title}</option>`).join('')}</select></div>
<div class="field"><label for="${id}-msg">Комментарий</label><textarea class="in" id="${id}-msg" name="message" rows="3"></textarea></div>
<label class="chk"><input type="checkbox" name="agree" required><span>Я согласен на обработку персональных данных (<a href="#/privacy" style="text-decoration:underline">политика</a>)</span></label><span class="err" data-agree></span>
<button class="btn btn-gold" type="submit" style="width:100%;margin-top:14px">Отправить заявку</button></form>`;
}
const RULES = {
  name: (v) => v.trim().length >= 2 ? '' : 'Укажите имя, минимум 2 символа',
  phone: (v) => v.replace(/\D/g, '').length >= 10 && v.replace(/\D/g, '').length <= 12 ? '' : 'Введите телефон полностью, например +7 495 215-48-30',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Введите email в формате name@mail.ru'
};
function validate(f) {
  let ok = true;
  Object.entries(RULES).forEach(([n, rule]) => {
    const el = f.elements[n], m = rule(el.value);
    el.classList.toggle('bad', !!m); el.setAttribute('aria-invalid', !!m); el.nextElementSibling.textContent = m; if (m) ok = false;
  });
  const ag = f.elements.agree.checked; $('[data-agree]', f).textContent = ag ? '' : 'Нужно согласие на обработку данных'; if (!ag) ok = false;
  return ok;
}
async function submitLead(f) {
  const data = Object.fromEntries(new FormData(f)); delete data.agree;
  if (location.protocol === 'file:') throw new Error('Для отправки заявок требуется сервер');
  const res = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (res.status === 404 || res.status === 405) throw new Error('Форма не подключена к серверу');
  if (!res.ok) throw new Error('HTTP ' + res.status);
}
const successHtml = `<div class="ok" role="status"><i>✓</i><h2 style="font-size:28px">Спасибо! Заявка отправлена.</h2><p class="lead" style="margin:0 auto">Наш специалист свяжется с вами в ближайшее время.</p></div>`;

/* ---------- Модальное окно ---------- */
let lastFocus = null;
function openModal(opts = {}) {
  lastFocus = document.activeElement;
  $('#modal-root').innerHTML = `<div class="modal" data-close><div class="dlg" role="dialog" aria-modal="true" aria-labelledby="mt"><button class="x" data-close aria-label="Закрыть">×</button><h2 id="mt" style="font-size:28px">Получить консультацию</h2><p style="color:var(--mut);margin-bottom:20px">Оставьте контакты, и мы перезвоним в течение 15 минут в рабочее время.</p>${LeadForm('m')}</div></div>`;
  const f = $('#f-m'); if (opts.service) f.service.value = opts.service;
  f.message.value = [opts.note, opts.summary].filter(Boolean).join('\n');
  document.body.style.overflow = 'hidden'; f.name.focus(); Fx.modal();
}
function closeModal() { $('#modal-root').innerHTML = ''; document.body.style.overflow = ''; lastFocus && lastFocus.focus(); }

/* ---------- Роутер ---------- */
function route() {
  const h = location.hash; if (h && !h.startsWith('#/') && $('#app').children.length) return; // якорь «К содержимому»
  const path = (h.startsWith('#/') ? h.slice(1) : '/').replace(/\/$/, '') || '/', [, a, b] = path.split('/');
  const map = { '': () => Pages.home(), services: () => b ? Pages.service(b) : Pages.services(), projects: () => b ? Pages.project(b) : Pages.projects(), about: Pages.about, prices: Pages.prices, calculator: Pages.calculator, reviews: Pages.reviews, contacts: Pages.contacts, privacy: Pages.privacy };
  const page = (map[a || ''] || Pages.nf)();
  $('#app').innerHTML = page;
  const nf = page.includes('class="nf"');
  document.title = nf ? '404 — страница не найдена | Основа' : `${({ '': 'Строительство домов и ремонт под ключ', services: 'Услуги', projects: 'Проекты', about: 'О компании', prices: 'Цены', calculator: 'Калькулятор стоимости', reviews: 'Отзывы', contacts: 'Контакты', privacy: 'Политика конфиденциальности' })[a || ''] || 'Основа'} | Основа`;
  $$('[data-nav]').forEach((l) => { const h = l.dataset.nav; l.classList.toggle('active', h === '/' ? path === '/' : path.startsWith(h)); });
  $('#nav').classList.remove('open'); $('.burger').setAttribute('aria-expanded', 'false');
  window.scrollTo(0, 0);
  const c = $('#calc'); if (c) updateCalc(c);
  Fx.page();
}

/* ---------- События ---------- */
document.addEventListener('click', (e) => {
  const t = e.target;
  if (t.closest('[data-close]') && (t.matches('.modal') || t.closest('.x'))) return closeModal();
  const a = t.closest('[data-action]');
  if (a) {
    const k = a.dataset.action;
    if (k === 'modal') openModal({ service: a.dataset.service, note: a.dataset.note, summary: a.dataset.calc ? $('#calc')?.dataset.summary : '' });
    if (k === 'menu') { const o = $('#nav').classList.toggle('open'); a.setAttribute('aria-expanded', o); }
    if (k === 'prev' || k === 'next') $('#slider').scrollBy({ left: (k === 'next' ? 1 : -1) * 404, behavior: 'smooth' });
  }
  const c = t.closest('[data-filter]');
  if (c) {
    $$('[data-filter]').forEach((x) => { x.classList.toggle('on', x === c); x.setAttribute('aria-pressed', x === c); });
    const list = c.dataset.filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.cat === c.dataset.filter);
    $('#plist').innerHTML = list.map(ProjectCard).join('').replaceAll('rv', 'rv done');
  }
});
document.addEventListener('input', (e) => { const cm = e.target.closest('[data-cmp]'); if (cm) cm.style.setProperty('--pos', e.target.value + '%'); const f = e.target.closest('#calc'); if (f) updateCalc(f); const l = e.target.closest('[data-lead]'); if (l && e.target.classList.contains('bad')) validate(l); });
document.addEventListener('submit', async (e) => {
  e.preventDefault(); const f = e.target;
  if (f.id === 'calc' || !f.matches('[data-lead]') || !validate(f)) return;
  const b = $('button[type=submit]', f), fail = $('.fail', f);
  fail.hidden = true; b.disabled = true; b.textContent = 'Отправляем…';
  try { await submitLead(f); f.outerHTML = successHtml; }
  catch { fail.hidden = false; b.disabled = false; b.textContent = 'Отправить заявку'; }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('.modal')) closeModal(); });
window.addEventListener('scroll', () => $('#header').classList.toggle('scrolled', scrollY > 8), { passive: true });
window.addEventListener('hashchange', route);

$('#header').innerHTML = Header(); $('#footer').innerHTML = Footer(); route();
