import React, { useState, useEffect, useRef } from "react";
import shell from "./data/shell.json";
import programs from "./data/programs.json";
import prices from "./data/prices.json";
import assetMap from "../public/asset-map.json";
import "./intensive.css";
import "./team-class.css";
import {nextVariants} from "./next/variants.js";
const NewCourse = React.lazy(() => import("./next/NewCourse.jsx"));
const ReferenceCourse = React.lazy(() => import("./reference/ReferenceCourse.jsx"));

const courseSource = "https://topengineer.ru/education-centr/ts/single";
const priceSource =
  "https://docs.google.com/spreadsheets/d/1OXJCYJOVf4lFeD9aB64Fyh17PpONTn-8G2UBpMU-D5Y/edit?gid=0#gid=0";
const home = "/education-centr/";
const variants = [
  {
    id: 1,
    slug: "classic",
    name: "Классический курс",
    focus: "Быстро понять предложение",
    description:
      "Большой первый экран, результаты, уровни и программа. Знакомая последовательность от знакомства с курсом к записи.",
    pattern: "Первый экран, карточки услуг, аккордеон",
    title: ["Tekla Structures.", "С вашим преподавателем."],
    lead: "Индивидуальное обучение для инженеров: от первого знакомства с программой до сложных компонентов и разработки приложений.",
  },
  {
    id: 2,
    slug: "levels",
    name: "Сначала — ваш уровень",
    focus: "Найти подходящую программу",
    description:
      "Выбор опыта на первом экране. Новичок, опытный инженер и профессионал сразу переходят к подходящей программе.",
    pattern: "Карточки выбора, вкладки программы",
    title: ["Обучение начинается", "с вашего уровня."],
    lead: "Впервые открываете Tekla или работаете в ней каждый день? Выберите подготовку — и посмотрите темы ваших двух дней обучения.",
  },
  {
    id: 3,
    slug: "roadmap",
    name: "Два дня шаг за шагом",
    focus: "Увидеть последовательность занятий",
    description:
      "Маршрут связывает моделирование, компоненты и документацию. Подробные темы раскрываются внутри каждого дня.",
    pattern: "Этапы процесса, маршрут обучения",
    title: ["Два дня.", "Понятный путь в Tekla."],
    lead: "От создания модели и соединений — к чертежам, отчётам и проверке результата. Практика следует за показом преподавателя.",
  },
  {
    id: 4,
    slug: "price",
    name: "Стоимость без догадок",
    focus: "Посчитать бюджет обучения",
    description:
      "Калькулятор на первом экране показывает сумму на человека и за всю группу. Уровень подготовки не влияет на цену.",
    pattern: "Тарифный блок, калькулятор, таблица",
    title: ["Сначала —", "понятная стоимость."],
    lead: "Укажите число участников. Сразу увидите стоимость двухдневного курса для группы и цену на одного человека.",
  },
  {
    id: 5,
    slug: "practice",
    name: "Инженеры учат инженеров",
    focus: "Понять, как проходит обучение",
    description:
      "Заметный блок с показом преподавателя и практикой. Опыт специалистов и поддержка объясняют, кто поможет во время и после курса.",
    pattern: "Почему выбирают нас, крупные факты, процесс",
    title: ["Учитесь у тех,", "кто работает в Tekla."],
    lead: "Специалисты Topengineer с опытом работы в Tekla Structures не менее шести лет показывают инструменты и разбирают ваши вопросы.",
  },
  {
    id: 6,
    slug: "team",
    name: "Для вашей команды",
    focus: "Спланировать обучение сотрудников",
    description:
      "Сначала формат, задачи и размер группы. Руководитель оценивает общий бюджет и возможности помощи во внедрении.",
    pattern: "Услуги для команды, этапы, смета",
    title: ["Tekla Structures", "для вашей команды."],
    lead: "Обучите инженеров с учётом задач КМ и КМД. Онлайн, на нашей базе в Москве или у вас — формат и программу согласуем с компанией.",
  },
  {
    id: 7,
    slug: "tabs",
    name: "Всё в одном экране",
    focus: "Сразу открыть нужный раздел",
    description:
      "Обзор, программа, стоимость и условия находятся во вкладках. Для посетителя, который уже знает, что ищет.",
    pattern: "Вкладки карточки продукта",
    title: ["Всё о курсе.", "Без долгого поиска."],
    lead: "Выберите нужный раздел: уровень подготовки, темы двух дней, стоимость или организация обучения.",
  },
  {
    id: 8,
    slug: "guide",
    name: "Подробный гид по курсу",
    focus: "Изучить условия перед решением",
    description:
      "Спокойная статья с оглавлением сбоку. Удобно подробно читать, возвращаться к разделам и обсуждать курс с коллегами.",
    pattern: "Статья, боковое оглавление",
    title: ["Ваш гид по обучению", "Tekla Structures."],
    lead: "Что изучать, где заниматься, сколько стоит курс и как записаться: полная информация в последовательной статье.",
  },
  {
    id: 9,
    slug: "questions",
    name: "Ответы перед записью",
    focus: "Разобраться в условиях курса",
    description:
      "Вопросы посетителя формируют навигацию: подойдёт ли курс, где учиться, что изучать, сколько стоит и что будет после.",
    pattern: "Частые вопросы, раскрывающиеся разделы",
    title: ["Есть вопросы?", "Разберём по порядку."],
    lead: "Можно ли начать с нуля? Какой уровень выбрать? Сколько стоит обучение команды? Ответы помогут принять решение.",
  },
  {
    id: 10,
    slug: "cards",
    name: "Курс в крупных карточках",
    focus: "Легко читать с телефона",
    description:
      "Короткие смысловые блоки и крупные кнопки. Важное видно сразу, длинная программа раскрывается по запросу.",
    pattern: "Крупные карточки, краткие факты, раскрытие тем",
    title: ["Меньше поиска.", "Больше ясности."],
    lead: "Два дня, три уровня и ваш формат обучения. Всё главное — в коротких блоках, полная программа — рядом.",
  },
  {
    id: 11,
    slug: "intensive",
    name: "Практический интенсив",
    focus: "Увидеть преподавателя и практику",
    description: "Работающая страница по фотомакету №09: занятие в классе, три этапа практики, преподаватель и понятные цены. Полная программа и обращение открываются по кнопкам.",
    pattern: "Фотографический первый экран, этапы обучения, преподаватель, цены",
    title: ["Индивидуальный курс обучения", "Tekla Structures"],
    lead: "Преподаватель показывает, вы повторяете и разбираете вопросы.",
  },
  {
    id: 12,
    slug: "team-class",
    name: "Обучение команды в классе",
    focus: "Спланировать занятие и бюджет команды",
    description: "Работающая страница по фотомакету №11: преподаватель и ученики за ПК, четыре шага организации, бюджет пяти участников и выбор формата.",
    pattern: "Учебный класс, этапы организации, бюджет команды, форматы",
    title: ["Обучение", "вашей команды"],
    lead: "Индивидуальный курс обучения Tekla Structures для вашей команды.",
  },
  ...nextVariants,
  {id:23,slug:"site-style",name:"Курс в стиле нового сайта",focus:"Выбрать курс и рассчитать обучение",description:"Основная часть выбранного примера: описание курса, выбор программ, калькулятор, материалы и полная программа. Фирменные стили dev.topengineer.ru, общие шапка и подвал.",pattern:"Карточки курсов, таблица расчёта, материалы и программа",title:["Индивидуальное обучение","Tekla Structures"],lead:"Страница курса в фирменном оформлении Topengineer."},
];
const variantWord = (count) => count % 100 >= 11 && count % 100 <= 14 ? "вариантов" : count % 10 === 1 ? "вариант" : count % 10 >= 2 && count % 10 <= 4 ? "варианта" : "вариантов";
const variantCountText = variants.length + " " + variantWord(variants.length);
const levels = [
  {
    id: 1,
    name: "С нуля",
    full: "Базовый курс",
    experience: "Опыта нет или он минимальный",
    text: "Модель, инструменты, соединения, компоненты, чертежи и отчёты.",
    result:
      "После базового курса сможете самостоятельно работать в Tekla Structures.",
    modules: [
      "Модель и инструменты",
      "Сборки и компоненты",
      "Каталоги компонентов",
      "Чертежи",
      "Каталоги, отчёты и контроль",
    ],
  },
  {
    id: 2,
    name: "С опытом",
    full: "Для опытных пользователей",
    experience: "От полугода работы или после базового курса",
    text: "Настройки, параметрические профили, нумерация, сложные компоненты и собственные отчёты.",
    result:
      "Углубите работу с настройками, чертежами, компонентами и средой проектирования.",
    modules: [
      "Структура проекта и профили",
      "Нумерация, обмен и компоненты",
      "Продвинутая настройка чертежей",
      "Среда проектирования",
      "Редактор отчётов",
    ],
  },
  {
    id: 3,
    name: "Профессионал",
    full: "Для профессионалов",
    experience: "От четырёх лет работы или после двух предыдущих курсов",
    text: "Логика Tekla, многопользовательские модели, C#, приложения и интеграция с производством.",
    result: "Изучите темы для повышения квалификации до уровня разработчика.",
    modules: [
      "Логика работы Tekla",
      "Многопользовательская работа",
      "Разработка приложений на C#",
      "Инструменты C#",
      "Интеграция и производство",
    ],
  },
];
const photo = Object.entries(assetMap).find(([url]) =>
  url.endsWith("p7w4rmdtik8cs9ncnmm0bv3pwv8z8h0n.jpg"),
)?.[1];
const money = (n) => new Intl.NumberFormat("ru-RU").format(n) + " ₽";
const route = (v) =>
  home + "tekla-" + String(v.id).padStart(2, "0") + "-" + v.slug + "/";

// Preserve the captured shell. Append only the requested article links.
const headerDocument = new DOMParser().parseFromString(
  shell.header,
  "text/html",
);
headerDocument
  .querySelectorAll('header a[href="/education-centr/"]')
  .forEach((a) => {
    if (a.textContent.trim() !== "Учебный центр") return;
    const ul = a.parentElement.querySelector(":scope > ul");
    if (!ul) return;
    const courseGroup = document.createElement("li");
    courseGroup.className = "dropdown";
    const groupLink = document.createElement("a");
    groupLink.href = home + "#designs";
    const groupLabel = document.createElement("span");
    groupLabel.className = "pbmit-span-wrapper";
    groupLabel.textContent = "Tekla Structures — " + variantCountText;
    groupLink.append(groupLabel);
    const options = document.createElement("ul");
    options.className = "education-options";
    const nativeArrow = ul.querySelector("li.dropdown > .righticon");
    courseGroup.append(groupLink, options);
    if (nativeArrow) courseGroup.append(nativeArrow.cloneNode(true));
    variants.forEach((v) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = route(v);
      const span = document.createElement("span");
      span.className = "pbmit-span-wrapper";
      span.textContent =
        "Tekla — " + String(v.id).padStart(2, "0") + ". " + v.name;
      link.append(span);
      li.append(link);
      options.append(li);
    });
    ul.prepend(courseGroup);
  });
const header = headerDocument.body.innerHTML;
function Arrow() {
  return <i aria-hidden="true" className="pbmit-base-icon-next" />;
}
function Button({
  children = "Обсудить обучение",
  secondary = false,
  href = "#enroll",
}) {
  return (
    <a
      className={"course-button " + (secondary ? "secondary" : "")}
      href={href}
    >
      {children}
      <Arrow />
    </a>
  );
}
function Eyebrow({ children }) {
  return <p className="eyebrow">{children}</p>;
}
function Heading({ overline, title, text }) {
  return (
    <div className="section-heading">
      <Eyebrow>{overline}</Eyebrow>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
function Block({ children, id, className = "" }) {
  return (
    <section id={id} className={"course-section " + className}>
      <div className="course-container">{children}</div>
    </section>
  );
}
function Facts() {
  return (
    <div className="course-facts">
      {[
        ["2 дня", "16 часов обучения"],
        ["3 уровня", "От базового до профессионального"],
        ["Ваш график", "Время согласуем с вами"],
        ["RU / EN", "Русский или английский"],
      ].map(([big, small]) => (
        <div key={big}>
          <strong>{big}</strong>
          <span>{small}</span>
        </div>
      ))}
    </div>
  );
}
function Review({ variant }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="review-bar">
      <div className="course-container review-inner">
        <a href={home + "#designs"}>Все {variantCountText}</a>
        <span>
          {String(variant.id).padStart(2, "0")} / {variants.length} · {variant.name}
        </span>
        <button onClick={() => setOpen(!open)} aria-expanded={open}>
          Идея варианта
        </button>
        <select
          aria-label="Перейти к варианту дизайна"
          value={variant.id}
          onChange={(e) =>
            location.assign(route(variants[Number(e.target.value) - 1]))
          }
        >
          {variants.map((v) => (
            <option key={v.id} value={v.id}>
              {String(v.id).padStart(2, "0")}. {v.name}
            </option>
          ))}
        </select>
      </div>
      {open && (
        <div className="course-container review-note">
          <strong>{variant.focus}.</strong> {variant.description}
          <p>Элементы шаблона: {variant.pattern}.</p>
        </div>
      )}
    </div>
  );
}
function Hero({ variant, setLevel, priceSelection }) {
  const image = [1, 3, 5, 6].includes(variant.id);
  return (
    <section
      className={
        "course-hero hero-" + variant.id + (image ? " image-hero" : "")
      }
      style={image ? { backgroundImage: "url(" + photo + ")" } : undefined}
    >
      <div className="course-container">
        <nav className="course-breadcrumbs" aria-label="Хлебные крошки">
          <a href={home}>Учебный центр</a>
          <span>/</span>
          <span>Индивидуальный курс Tekla Structures</span>
        </nav>
        <div className="hero-composition">
          <div className="hero-copy">
            <Eyebrow>ИНДИВИДУАЛЬНЫЙ КУРС · TEKLA STRUCTURES</Eyebrow>
            <h1>
              {variant.title[0]}
              <br />
              <em>{variant.title[1]}</em>
            </h1>
            <p className="hero-lead">{variant.lead}</p>
            {![2, 4, 7, 9].includes(variant.id) && (
              <div className="hero-actions">
                <Button />
                <Button secondary href="#program">
                  Программа курса
                </Button>
              </div>
            )}
            {variant.id === 1 && (
              <p className="hero-price">
                40 000 ₽ <span>за одного участника · 2 дня</span>
              </p>
            )}
            {variant.id === 5 && (
              <div className="experience-stamp">
                <strong>6+</strong>
                <span>
                  лет опыта в Tekla
                  <br />у каждого преподавателя
                </span>
              </div>
            )}
          </div>
          {variant.id === 2 ? (
            <div className="hero-level-prompt">
              <Eyebrow>С ЧЕГО ВЫ НАЧИНАЕТЕ?</Eyebrow>
              {levels.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    setLevel(l.id);
                    document
                      .getElementById("program")
                      .scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <span>0{l.id}</span>
                  <div>
                    <strong>{l.name}</strong>
                    <small>{l.experience}</small>
                  </div>
                  <Arrow />
                </button>
              ))}
            </div>
          ) : variant.id === 4 ? (
            <Calculator compact selection={priceSelection} />
          ) : image ? (
            <div className="hero-side">
              <small>ИНДИВИДУАЛЬНЫЙ ФОРМАТ</small>
              <p>
                Ваш уровень.
                <br />
                Ваши задачи.
                <br />
                <strong>Ваша программа.</strong>
              </p>
              <span>Онлайн · Москва · у заказчика</span>
            </div>
          ) : null}
        </div>
        {![4, 7, 9, 10].includes(variant.id) && <Facts />}
      </div>
    </section>
  );
}
function Audience({ level, setLevel }) {
  return (
    <Block id="levels">
      <Heading
        overline="ВЫБЕРИТЕ ПОДГОТОВКУ"
        title="Курс на вашем уровне"
        text="Содержание зависит от вашего опыта. Стоимость не зависит от выбранной сложности."
      />
      <div className="level-cards">
        {levels.map((l) => (
          <button
            key={l.id}
            aria-pressed={level === l.id}
            className={"level-card " + (level === l.id ? "selected" : "")}
            onClick={() => {
              setLevel(l.id);
              document
                .getElementById("program")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="level-number">0{l.id}</span>
            <strong>{l.name}</strong>
            <span className="level-experience">{l.experience}</span>
            <span className="level-description">{l.text}</span>
            <span className="text-link">
              Посмотреть программу <Arrow />
            </span>
          </button>
        ))}
      </div>
    </Block>
  );
}

function Program({ level, setLevel, initialExpanded = false }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(initialExpanded);
  const [revision, setRevision] = useState(0);
  const selected = levels[level - 1];
  const days = programs[level - 1].days.map((day) => {
    const groups = {};
    day.forEach((t) => {
      const n = Number(t.split(".")[0]);
      (groups[n] ||= []).push(t);
    });
    return Object.entries(groups)
      .map(([n, topics]) => ({
        id: n,
        title: selected.modules[Number(n) - 1],
        topics: topics.filter((t) =>
          t.toLowerCase().includes(query.toLowerCase()),
        ),
      }))
      .filter((g) => g.topics.length);
  });
  return (
    <Block id="program" className="program-section">
      <Heading
        overline="ПРОГРАММА КУРСА"
        title="Два дня — от темы к практике"
        text="Темы можно изменить под задачи разработчиков КМ и КМД. Изменения заранее согласуем устно или письменно."
      />
      <div
        className="program-levels"
        role="tablist"
        aria-label="Уровень программы"
      >
        {levels.map((l) => (
          <button
            key={l.id}
            role="tab"
            id={"level-tab-" + l.id}
            aria-selected={level === l.id}
            aria-controls="program-panel"
            className={level === l.id ? "active" : ""}
            onClick={() => {
              setLevel(l.id);
              setQuery("");
            }}
          >
            0{l.id} · {l.full}
          </button>
        ))}
      </div>
      <div
        id="program-panel"
        role="tabpanel"
        aria-labelledby={"level-tab-" + level}
      >
        <div className="program-intro">
          <div>
            <h3>{selected.full}</h3>
            <p>
              {selected.experience}. {selected.result}
            </p>
          </div>
          <span>2 дня / 16 часов</span>
        </div>
        <div className="program-tools">
          <label>
            Найти тему
            <input
              type="search"
              placeholder="Например: чертежи, компоненты, C#"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <button
            className="text-link"
            onClick={() => {
              setExpanded(!expanded);
              setRevision(revision + 1);
            }}
          >
            {expanded ? "Свернуть темы" : "Раскрыть все темы"}
          </button>
        </div>
        {!days.flat().length ? (
          <p className="empty-result" role="status">
            Тем с таким названием не найдено. Попробуйте другой запрос.
          </p>
        ) : (
          <div className="program-days" key={level + "-" + revision}>
            {days.map((groups, i) => (
              <div className="program-day" key={i}>
                <div className="day-heading">
                  <span>0{i + 1}</span>
                  <div>
                    <h3>День {i === 0 ? "первый" : "второй"}</h3>
                    <p>
                      {level === 1
                        ? i === 0
                          ? "Модель, соединения и компоненты"
                          : "Чертежи, отчёты и проверка модели"
                        : level === 2
                          ? i === 0
                            ? "Настройки, компоненты и чертежи"
                            : "Среда и собственные отчёты"
                          : i === 0
                            ? "Логика Tekla и основы C#"
                            : "Приложения и интеграция"}
                    </p>
                  </div>
                </div>
                {groups.map((g, j) => (
                  <details
                    key={g.id}
                    open={expanded || !!query || (revision === 0 && j === 0)}
                  >
                    <summary>
                      <span>{String(g.id).padStart(2, "0")}</span>
                      <strong>{g.title}</strong>
                      <small>{g.topics.length} тем</small>
                      <i
                        className="pbmit-base-icon-down-open-big"
                        aria-hidden="true"
                      />
                    </summary>
                    <ul className="topic-list">
                      {g.topics.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            ))}
          </div>
        )}
        <p className="fine-print">
          Темы и последовательность согласуются с преподавателем.
        </p>
      </div>
    </Block>
  );
}
function Calculator({ compact = false, initialPeople = 1, selection }) {
  const [localPeople, setLocalPeople] = useState(initialPeople);
  const [localFormat, setLocalFormat] = useState("online");
  const { people, setPeople, format, setFormat } = selection || {
    people: localPeople,
    setPeople: setLocalPeople,
    format: localFormat,
    setFormat: setLocalFormat,
  };
  const price = prices.find((p) => p.people === Number(people));
  const priced = format !== "onsite" && price;
  return (
    <div className={"course-calculator " + (compact ? "compact-calc" : "")}>
      <Eyebrow>СТОИМОСТЬ ОБУЧЕНИЯ</Eyebrow>
      <h3>{compact ? "Рассчитайте курс" : "Сколько стоит ваш курс?"}</h3>
      <div className="calc-controls">
        <label>
          Количество участников
          <select
            aria-label="Количество участников"
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
          >
            {prices.map((p) => (
              <option key={p.people} value={p.people}>
                {p.people}{" "}
                {p.people === 1
                  ? "человек"
                  : p.people < 5
                    ? "человека"
                    : "человек"}
              </option>
            ))}
            <option value={21}>Больше 20 человек</option>
          </select>
        </label>
        <label>
          Формат обучения
          <select
            aria-label="Формат обучения"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="online">Онлайн</option>
            <option value="office">В офисе в Москве</option>
            <option value="onsite">На базе заказчика</option>
          </select>
        </label>
      </div>
      <div className="calc-result" aria-live="polite">
        {priced ? (
          <>
            <div>
              <span>За всю группу</span>
              <strong data-testid="total-price">{money(price.total)}</strong>
            </div>
            <div>
              <span>За одного человека</span>
              <strong data-testid="person-price">
                {money(price.perPerson)}
              </strong>
            </div>
          </>
        ) : (
          <div>
            <span>Стоимость и условия</span>
            <strong className="manager-price">Согласуем с менеджером</strong>
            <p>
              {format === "onsite"
                ? "Стоимость двухдневного выезда, транспорт и проживание согласуем отдельно."
                : "Для группы больше 20 человек запросите расчёт."}
            </p>
          </div>
        )}
      </div>
      <p className="calc-note">2 дня · 16 часов · любой уровень</p>
      <Button>{priced ? "Обсудить этот формат" : "Запросить расчёт"}</Button>
      <p className="fine-print">
        Клиентский прайс. Транспорт и проживание не включены. Итоговую стоимость
        согласуем с менеджером.
      </p>
    </div>
  );
}
function Pricing({ initialPeople = 1, selection }) {
  return (
    <Block id="price" className="pricing-section">
      <Heading
        overline="ПРОЗРАЧНЫЕ УСЛОВИЯ"
        title="Стоимость зависит от числа участников"
        text="Уровень сложности не меняет цену. Клиентский прайс на двухдневное обучение онлайн или в нашем офисе."
      />
      <div className="pricing-grid">
        <Calculator initialPeople={initialPeople} selection={selection} />
        <div className="price-explanation">
          <h3>Один курс — ваша группа</h3>
          <p>
            Индивидуальный формат рассчитан на одного инженера или группу.
            Больше участников — ниже цена на человека.
          </p>
          <div className="price-examples">
            {prices.slice(0, 3).map((p) => (
              <div key={p.people}>
                <span>
                  {p.people} {p.people === 1 ? "участник" : "участника"}
                </span>
                <strong>{money(p.total)}</strong>
                <small>{money(p.perPerson)} / человек</small>
              </div>
            ))}
          </div>
          <details>
            <summary>
              Посмотреть все цены <Arrow />
            </summary>
            <div className="price-table-wrap">
              <table>
                <caption>2 дня: онлайн или в офисе в Москве</caption>
                <thead>
                  <tr>
                    <th scope="col">Человек</th>
                    <th scope="col">За человека</th>
                    <th scope="col">Всего</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((p) => (
                    <tr key={p.people}>
                      <th scope="row">{p.people}</th>
                      <td>{money(p.perPerson)}</td>
                      <td>{money(p.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
          <p className="price-conditions">
            Наличный и безналичный расчёт.
            <br />
            Выезд на базу заказчика обсуждается отдельно.
          </p>
          <a
            className="source-link"
            href={priceSource}
            target="_blank"
            rel="noreferrer"
          >
            Открыть исходный прайс <Arrow />
          </a>
        </div>
      </div>
    </Block>
  );
}
function Results() {
  return (
    <Block id="result" className="results-section">
      <Heading
        overline="ЧЕМУ НАУЧИТЕСЬ"
        title="Знания, которые переходят в работу"
        text="Выбирайте глубину по своему опыту — от инструментов модели до собственных приложений."
      />
      <div className="result-grid">
        {[
          [
            "01",
            "Моделирование",
            "Модель, колонны, балки, пластины. Соединения, сборки и компоненты.",
            "Базовый курс",
          ],
          [
            "02",
            "Документация",
            "Чертежи общего вида, деталей и сборок. Клонирование, печать и экспорт.",
            "Базовый и опытный",
          ],
          [
            "03",
            "Настройки и автоматизация",
            "Параметрические профили, собственные отчёты, приложения на C# и интеграция.",
            "Опытный и профессиональный",
          ],
        ].map(([n, t, d, l]) => (
          <article key={n}>
            <span className="result-number">{n}</span>
            <h3>{t}</h3>
            <p>{d}</p>
            <span className="result-level">{l}</span>
          </article>
        ))}
      </div>
      <p className="result-note">
        После базового курса слушатель способен самостоятельно работать в Tekla
        Structures. Для дальнейшего роста предусмотрены два следующих уровня.
      </p>
    </Block>
  );
}
function Teaching() {
  return (
    <Block id="learning" className="teaching-section">
      <div className="teaching-grid">
        <div>
          <Eyebrow>КАК ПРОХОДИТ ОБУЧЕНИЕ</Eyebrow>
          <h2>
            Не только смотрите.
            <br />
            Повторяете сами.
          </h2>
          <p>
            Лектор демонстрирует возможности Tekla Structures. Участники
            повторяют его действия и обсуждают возникающие вопросы.
          </p>
          <div className="teacher-fact">
            <strong>6+</strong>
            <span>
              лет опыта в Tekla Structures
              <br />у специалистов Topengineer
            </span>
          </div>
        </div>
        <div className="learning-steps">
          {[
            [
              "01",
              "Преподаватель показывает",
              "Инструменты и приёмы демонстрируются по выбранной программе.",
            ],
            [
              "02",
              "Вы повторяете действия",
              "Закрепляете изученное во время занятия.",
            ],
            [
              "03",
              "Разбираете вопросы вместе",
              "Обсуждаете затруднения и особенности ваших задач.",
            ],
          ].map(([n, t, d]) => (
            <article key={n}>
              <span>{n}</span>
              <div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Block>
  );
}
function Logistics() {
  return (
    <Block id="format" className="logistics-section">
      <Heading
        overline="ОРГАНИЗАЦИЯ ОБУЧЕНИЯ"
        title="Учитесь там, где вам удобно"
        text="Место, дату и время согласуем при заказе."
      />
      <div className="format-grid">
        {[
          [
            "01",
            "Онлайн",
            "Удалённое обучение через интернет. Занимайтесь из вашего города.",
          ],
          [
            "02",
            "В Москве",
            "На базе Topengineer: Варшавское ш., 1с1-2, W-Plaza, офис В-410.",
          ],
          [
            "03",
            "На вашей базе",
            "В любом городе по месту расположения группы. Условия выезда согласуем отдельно.",
          ],
        ].map(([n, t, d]) => (
          <article key={n}>
            <span>{n}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </article>
        ))}
      </div>
      <div className="schedule-strip">
        {[
          [
            "2 дня, обычно выходные",
            "Суббота и воскресенье. Удобное время согласуется с заказчиком.",
          ],
          [
            "9:00–18:00 или 10:00–19:00",
            "Рекомендуемые графики с перерывом на обед.",
          ],
          ["Русский или English", "Два доступных языка обучения."],
        ].map(([t, d]) => (
          <div key={t}>
            <h3>{t}</h3>
            <p>{d}</p>
          </div>
        ))}
      </div>
    </Block>
  );
}
function Support() {
  return (
    <Block id="support" className="support-section">
      <div className="support-grid">
        <div>
          <Eyebrow>ПОСЛЕ КУРСА</Eyebrow>
          <h2>Обучение — начало дальнейшей работы</h2>
          <p>
            Дальнейшая техническая поддержка пользователей проходит на
            специализированном форуме.
          </p>
          <a
            className="text-link"
            href="https://topengineer.ru/forum"
            target="_blank"
            rel="noreferrer"
          >
            Перейти на форум <Arrow />
          </a>
        </div>
        <article>
          <h3>Помощь во внедрении</h3>
          <p>
            По дополнительному соглашению специалист может помочь внедрить Tekla
            Structures на предприятии на срок от недели до двух месяцев.
          </p>
          <small>Условия и стоимость обсуждаются отдельно.</small>
          <Button secondary>Обсудить внедрение</Button>
        </article>
      </div>
    </Block>
  );
}
const faq = [
  [
    "Можно ли пройти курс с нуля?",
    "Да. Базовый курс рассчитан на пользователей с минимальным опытом или без опыта работы в Tekla Structures.",
  ],
  [
    "Как выбрать уровень?",
    "Базовый — для начинающих. Для опытных — от полугода работы или после базового курса. Профессиональный — от четырёх лет работы или после двух предыдущих курсов. Менеджер поможет выбрать.",
  ],
  [
    "Можно ли изменить программу под КМ или КМД?",
    "Да. По желанию заказчика возможны изменения тем с учётом задач инженеров. Изменения согласуются письменно или устно.",
  ],
  [
    "Зависит ли стоимость от сложности?",
    "Нет. Стоимость зависит от числа обучаемых и не зависит от выбранного уровня сложности.",
  ],
  [
    "Где проводится обучение?",
    "Онлайн, на нашей базе в Москве или на базе заказчика в любом городе. Условия выезда согласуются отдельно.",
  ],
  [
    "Когда проходят занятия?",
    "Курс рассчитан на два дня, обычно субботу и воскресенье. Время согласуется с заказчиком. Рекомендуется 9:00–18:00 или 10:00–19:00 с обедом.",
  ],
  [
    "Что не включено в стоимость?",
    "Транспортные расходы и проживание. Окончательную стоимость курса согласуйте с менеджером.",
  ],
  [
    "Есть ли поддержка после курса?",
    "Да, на специализированном форуме. Помощь во внедрении на предприятии оформляется отдельным соглашением.",
  ],
];
function FAQ({ primary = false }) {
  return (
    <Block
      id="questions"
      className={"faq-section " + (primary ? "primary-faq" : "")}
    >
      <Heading
        overline="ВОПРОСЫ И ОТВЕТЫ"
        title="Чтобы выбрать курс уверенно"
      />
      <div className="faq-grid">
        {faq.map(([q, a], i) => (
          <details key={q} open={primary && i === 0}>
            <summary>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <strong>{q}</strong>
              <i className="pbmit-base-icon-down-open-big" aria-hidden="true" />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </Block>
  );
}
function Enroll({ courseLevel, setCourseLevel, priceSelection }) {
  const level = levels[courseLevel - 1].full;
  const setLevel = (name) =>
    setCourseLevel(levels.find((l) => l.full === name).id);
  const formats = {
    online: "Онлайн",
    office: "В Москве",
    onsite: "На базе заказчика",
  };
  const format = formats[priceSelection.format];
  const setFormat = (name) =>
    priceSelection.setFormat(
      Object.keys(formats).find((key) => formats[key] === name),
    );
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState("Безналичный расчёт");
  const body =
    "Здравствуйте! Хочу обсудить индивидуальный курс Tekla Structures.\nУровень: " +
    level +
    "\nФормат: " +
    format +
    "\nУчастников: " +
    (priceSelection.people === 21 ? "больше 20" : priceSelection.people) +
    "\nСтоимость по прайсу: " +
    (priceSelection.format === "onsite" || priceSelection.people === 21
      ? "по согласованию с менеджером"
      : money(prices.find((p) => p.people === priceSelection.people).total)) +
    "\nГород: " +
    (city || "уточню при обсуждении") +
    "\nДата: " +
    (date || "уточню при обсуждении") +
    "\nСпособ оплаты: " +
    payment +
    "\nЗадачи: " +
    (note || "обсудим с преподавателем");
  return (
    <Block id="enroll" className="enroll-section">
      <div className="enroll-grid">
        <div>
          <Eyebrow>СЛЕДУЮЩИЙ ШАГ</Eyebrow>
          <h2>Обсудим ваш курс?</h2>
          <p>
            Расскажите о подготовке, задачах и удобной дате. Специалисты помогут
            выбрать уровень и согласовать условия.
          </p>
          <a className="enroll-phone" href="tel:+74952150779">
            +7 (495) 215-07-79
          </a>
          <a href="mailto:info@topengineer.ru">info@topengineer.ru</a>
          <p className="contact-note">
            При заказе укажите город, желаемую дату и способ оплаты.
          </p>
        </div>
        <div className="enroll-card">
          <h3>Подготовьте обращение</h3>
          <div className="enroll-fields">
            <label>
              Уровень
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                {levels.map((l) => (
                  <option key={l.id}>{l.full}</option>
                ))}
              </select>
            </label>
            <label>
              Формат
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option>Онлайн</option>
                <option>В Москве</option>
                <option>На базе заказчика</option>
              </select>
            </label>
            <label>
              Участников
              <select
                value={priceSelection.people}
                onChange={(e) =>
                  priceSelection.setPeople(Number(e.target.value))
                }
              >
                {prices.map((p) => (
                  <option key={p.people} value={p.people}>
                    {p.people}
                  </option>
                ))}
                <option value={21}>Больше 20</option>
              </select>
            </label>
            <label>
              Ваш город
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Например, Москва"
              />
            </label>
            <label>
              Удобная дата
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label>
              Способ оплаты
              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
              >
                <option>Безналичный расчёт</option>
                <option>Наличный расчёт</option>
              </select>
            </label>
          </div>
          <label>
            Ваши задачи
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="С какими задачами хотите разобраться?"
            />
          </label>
          <Button
            href={
              "mailto:info@topengineer.ru?subject=" +
              encodeURIComponent("Индивидуальный курс Tekla Structures") +
              "&body=" +
              encodeURIComponent(body)
            }
          >
            Подготовить письмо
          </Button>
          <p className="fine-print">
            Откроется почтовое приложение с заполненным письмом. Отправку
            подтверждаете в нём.
          </p>
        </div>
      </div>
    </Block>
  );
}
function Roadmap() {
  return (
    <Block className="roadmap-section">
      <Heading
        overline="ВАШ МАРШРУТ"
        title="От модели — к документации"
        text="Путь базового курса: каждый этап опирается на предыдущий."
      />
      <div className="roadmap">
        {[
          [
            "ДЕНЬ 01",
            "Создать модель",
            "Среды, шаблоны, сетки, колонны, балки, пластины и инструменты изменения.",
          ],
          [
            "ДЕНЬ 01",
            "Собрать соединения",
            "Болты, сварка, сборки и параметрические компоненты.",
          ],
          [
            "ДЕНЬ 02",
            "Выпустить чертежи",
            "Детали и сборки, клонирование, редактор, печать и экспорт.",
          ],
          [
            "ДЕНЬ 02",
            "Проверить результат",
            "Отчёты, многопользовательская модель, конфликты и нумерация.",
          ],
        ].map(([day, t, d], i) => (
          <article key={t}>
            <div className="route-dot">0{i + 1}</div>
            <Eyebrow>{day}</Eyebrow>
            <h3>{t}</h3>
            <p>{d}</p>
          </article>
        ))}
      </div>
      <p className="fine-print">
        Для опытных и профессиональных пользователей маршрут другой — выберите
        уровень в полной программе ниже.
      </p>
    </Block>
  );
}
function QuickCards() {
  return (
    <Block className="quick-cards-section">
      <div className="quick-cards">
        {[
          [
            "ФОРМАТ",
            "2 дня",
            "С вашим преподавателем",
            "Смотрите демонстрацию, повторяете действия и обсуждаете вопросы.",
            "learning",
          ],
          [
            "ПОДГОТОВКА",
            "3 уровня",
            "Ваш опыт — отправная точка",
            "С нуля, с опытом и для профессионалов.",
            "program",
          ],
          [
            "СТОИМОСТЬ",
            "40 000 ₽",
            "За одного участника",
            "2 дня. Цена для группы — в калькуляторе.",
            "price",
          ],
          [
            "МЕСТО",
            "3 формата",
            "Из вашего города",
            "Онлайн, в Москве или на базе заказчика.",
            "format",
          ],
          [
            "ПРЕПОДАВАТЕЛИ",
            "6+ лет",
            "Практический опыт",
            "Специалисты Topengineer, работающие в Tekla.",
            "learning",
          ],
        ].map(([tag, big, t, d, id], i) => (
          <article key={tag} className={"quick-card quick-" + i}>
            <Eyebrow>{tag}</Eyebrow>
            <strong>{big}</strong>
            <h3>{t}</h3>
            <p>{d}</p>
            <a className="text-link" href={"#" + id}>
              Подробнее <Arrow />
            </a>
          </article>
        ))}
      </div>
    </Block>
  );
}
function Tabs({ level, setLevel, priceSelection }) {
  const [tab, setTab] = useState("overview");
  const tabs = [
    ["overview", "Обзор"],
    ["program", "Программа"],
    ["price", "Стоимость"],
    ["format", "Условия"],
  ];
  return (
    <>
      <div
        className="course-container course-tab-nav"
        role="tablist"
        aria-label="Разделы курса"
      >
        {tabs.map(([id, t]) => (
          <button
            role="tab"
            id={"course-tab-" + id}
            aria-selected={tab === id}
            aria-controls={"course-panel-" + id}
            key={id}
            onClick={() => setTab(id)}
          >
            {t}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={"course-panel-" + tab}
        aria-labelledby={"course-tab-" + tab}
      >
        {tab === "overview" && (
          <>
            <Results />
            <Teaching />
            <Support />
          </>
        )}
        {tab === "program" && <Program level={level} setLevel={setLevel} />}{" "}
        {tab === "price" && <Pricing selection={priceSelection} />}
        {tab === "format" && (
          <>
            <Logistics />
            <FAQ />
            <Support />
          </>
        )}
      </div>
    </>
  );
}
function Article({ level, setLevel, priceSelection }) {
  return (
    <div className="course-container article-layout">
      <aside className="article-toc">
        <Eyebrow>В ЭТОЙ СТАТЬЕ</Eyebrow>
        {[
          ["result", "О курсе и результате"],
          ["levels", "Как выбрать уровень"],
          ["program", "Программа по дням"],
          ["price", "Стоимость"],
          ["format", "Место и график"],
          ["learning", "Преподаватели"],
          ["support", "После обучения"],
          ["enroll", "Как записаться"],
        ].map(([id, t]) => (
          <a href={"#" + id} key={id}>
            {t}
          </a>
        ))}
        <Button />
      </aside>
      <div className="article-body">
        <Results />
        <Audience level={level} setLevel={setLevel} />
        <Program level={level} setLevel={setLevel} />
        <Pricing selection={priceSelection} />
        <Logistics />
        <Teaching />
        <Support />
        <FAQ />
      </div>
    </div>
  );
}
function QuestionLinks() {
  return (
    <div className="course-container question-links">
      {[
        ["levels", "Подойдёт ли мне курс?"],
        ["program", "Что я буду изучать?"],
        ["price", "Сколько стоит обучение?"],
        ["format", "Где и когда заниматься?"],
      ].map(([id, t], i) => (
        <a href={"#" + id} key={id}>
          <span>0{i + 1}</span>
          <strong>{t}</strong>
          <Arrow />
        </a>
      ))}
    </div>
  );
}
function IntensiveIcon({ name }) {
  return <i aria-hidden="true" className={"fa fa-" + name} />;
}
function IntensiveCourse() {
  const [level, setLevel] = useState(1);
  const [people, setPeople] = useState(1);
  const [format, setFormat] = useState("online");
  const [panel, setPanel] = useState(null);
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const priceSelection = { people, setPeople, format, setFormat };
  const asset = (name) => "/assets/intensive/" + name + ".jpg";
  const openPanel = (name, event, selectedLevel) => {
    if (event) { event.preventDefault(); openerRef.current = event.currentTarget; }
    if (selectedLevel) setLevel(selectedLevel);
    setPanel(name);
  };
  useEffect(() => {
    const order = (event) => { openerRef.current = event.detail?.opener; setPanel("enroll"); };
    window.addEventListener("tekla-intensive-enroll", order);
    return () => window.removeEventListener("tekla-intensive-enroll", order);
  }, []);
  useEffect(() => {
    if (!panel) return;
    const dialog = dialogRef.current;
    dialog.showModal();
    dialog.scrollTop = 0;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (openerRef.current?.isConnected) openerRef.current.focus();
    };
  }, [panel]);
  const action = (name, secondary = false) => <a className={"course-button intensive-action" + (secondary ? " secondary" : "")} href={"#" + name} onClick={(event) => openPanel(name, event)}>{name === "program" ? "Программа курса" : "Обсудить обучение"}<Arrow /></a>;
  const steps = [
    { name: "Демонстрация", image: "demonstration", text: "Преподаватель показывает на реальных примерах, как работать в Tekla Structures.", alt: "Преподаватель объясняет модель стального здания на экране" },
    { name: "Практика", image: "practice", text: "Участник повторяет на своём компьютере под руководством преподавателя.", alt: "Участники выполняют упражнение за компьютерами" },
    { name: "Вопросы", image: "discussion", text: "Разбираем возникающие вопросы и обсуждаем рабочие ситуации.", alt: "Преподаватель обсуждает вопросы с участниками занятия" },
  ];
  return <main className="course-site variant-11 intensive-page">
    <section className="intensive-hero" aria-labelledby="intensive-title">
      <img className="intensive-hero-photo" src={asset("hero")} alt="Преподаватель объясняет модель в Tekla Structures группе участников за компьютерами" fetchPriority="high" />
      <div className="course-container intensive-hero-inner">
        <nav className="intensive-breadcrumb" aria-label="Хлебные крошки"><a href="https://dev.topengineer.ru/">Главная</a><span>/</span><a href={home}>Учебный центр</a><span>/</span><span>Tekla Structures</span></nav>
        <div className="intensive-hero-copy">
          <h1 id="intensive-title">Индивидуальный<br />курс обучения<br />Tekla Structures</h1>
          <p className="intensive-duration">2 дня · 16 часов</p>
          <p className="intensive-format"><IntensiveIcon name="desktop" />Онлайн / Москва</p>
          <div className="intensive-levels"><IntensiveIcon name="bar-chart" /><div>{["Базовый — с нуля", "Для опытных — от 6 месяцев", "Для профессионалов — от 4 лет"].map((label, index) => <a key={label} href="#program" onClick={(event) => openPanel("program", event, index + 1)}>{label}</a>)}</div></div>
          <div className="intensive-hero-actions">{action("enroll")}{action("program", true)}</div>
          <p className="intensive-experience">Опыт преподавателей в Tekla — от 6 лет</p>
        </div>
        <small className="intensive-photo-note">Иллюстрация формата обучения</small>
      </div>
    </section>
    <section id="learning" className="intensive-learning" aria-labelledby="intensive-learning-title"><div className="course-container">
      <h2 id="intensive-learning-title">Как проходит обучение</h2>
      <div className="intensive-steps">{steps.map((step, index) => <article key={step.name}><div className="intensive-step-photo"><span className="intensive-step-number">0{index + 1}</span><img src={asset(step.image)} alt={step.alt} loading="lazy" />{index < 2 && <Arrow />}</div><h3>{step.name}</h3><p>{step.text}</p></article>)}</div>
    </div></section>
    <section className="intensive-mentor" aria-labelledby="intensive-mentor-title">
      <img src={asset("instructor")} alt="Преподаватель разбирает рабочие вопросы во время занятия" loading="lazy" />
      <div className="intensive-mentor-copy"><h2 id="intensive-mentor-title">От модели к рабочим чертежам</h2><p>Изучите ключевые инструменты и рабочие процессы Tekla Structures — от создания модели до получения чертежей и отчётов.</p><div className="intensive-topics">{[["cube", "Моделирование"], ["clone", "Соединения"], ["file-text-o", "Чертежи и отчёты"]].map(([icon, label]) => <a key={label} href="#program" onClick={(event) => openPanel("program", event, 1)}><IntensiveIcon name={icon} />{label}</a>)}</div></div>
    </section>
    <section id="price" className="intensive-pricing" aria-label="Стоимость обучения"><div className="course-container intensive-pricing-inner">
      {[1, 3, 5].map((count) => { const price = prices.find((entry) => entry.people === count); return <div className="intensive-price" key={count}><strong>{money(price.total)}</strong><p>За {count === 1 ? "одного участника" : count + " участников"} · онлайн или в Москве</p>{count === 5 && <b>{money(price.perPerson)} за человека</b>}</div>; })}
      <div className="intensive-price-actions"><p>Стоимость действует при онлайн-обучении или в офисе в Москве. Выезд к заказчику — по согласованию.</p>{action("enroll")}{action("program", true)}</div>
    </div></section>
    <nav className="intensive-variants" aria-label="Другие варианты дизайна"><a href={route(variants[9])}>Предыдущий вариант <Arrow /></a><a href={home + "#designs"}>Все {variantCountText} <Arrow /></a><a href={route(variants[11])}>Следующий вариант <Arrow /></a></nav>
    {panel && <dialog className="intensive-dialog" ref={dialogRef} aria-labelledby="intensive-panel-title" onCancel={(event) => { event.preventDefault(); setPanel(null); }} onClick={(event) => {
      if (event.target === event.currentTarget) setPanel(null);
      const link = event.target.closest("a[href='#enroll'], a[href='#program']");
      if (link) {
        event.preventDefault();
        setPanel(link.getAttribute("href").slice(1));
      }
    }}>
      <div className="intensive-dialog-toolbar"><h2 id="intensive-panel-title">{panel === "program" ? "Программа обучения" : panel === "conditions" ? "Условия обучения" : "Обсудить обучение"}</h2><button className="intensive-close" onClick={() => setPanel(null)} aria-label="Закрыть окно">Закрыть <IntensiveIcon name="times" /></button></div>
      <div className="intensive-dialog-body">
        {panel === "program" ? <><Program level={level} setLevel={setLevel} /><div className="intensive-panel-next"><button className="course-button" onClick={() => setPanel("enroll")}>Обсудить эту программу <Arrow /></button><button className="text-link" onClick={() => setPanel("conditions")}>Условия и форматы <Arrow /></button></div></> : panel === "conditions" ? <><Logistics /><Support /><FAQ /></> : <><Enroll courseLevel={level} setCourseLevel={setLevel} priceSelection={priceSelection} /><div className="intensive-panel-next"><button className="text-link" onClick={() => setPanel("program")}>Посмотреть программу <Arrow /></button><button className="text-link" onClick={() => setPanel("conditions")}>Условия и форматы <Arrow /></button></div></>}
        <div className="content-source">Информация: <a href={courseSource} target="_blank" rel="noreferrer">страница курса</a> · Цены: <a href={priceSource} target="_blank" rel="noreferrer">исходный прайс</a></div>
      </div>
    </dialog>}
  </main>;
}
function TeamClassCourse() {
  const [level, setLevel] = useState(1);
  const [people, setPeople] = useState(5);
  const [format, setFormat] = useState("online");
  const [panel, setPanel] = useState(null);
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const priceSelection = { people, setPeople, format, setFormat };
  const groupPrice = prices.find((entry) => entry.people === 5);
  const asset = (name) => "/assets/team-class/" + name + ".jpg";

  const openPanel = (name, event, selectedFormat) => {
    event?.preventDefault();
    if (event) openerRef.current = event.currentTarget;
    if (selectedFormat) setFormat(selectedFormat);
    setPanel(name);
  };

  useEffect(() => {
    const order = (event) => {
      openerRef.current = event.detail?.opener;
      setPanel("enroll");
    };
    window.addEventListener("tekla-intensive-enroll", order);
    return () => window.removeEventListener("tekla-intensive-enroll", order);
  }, []);

  useEffect(() => {
    if (!panel) return;
    const dialog = dialogRef.current;
    dialog.showModal();
    dialog.scrollTop = 0;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (openerRef.current?.isConnected) openerRef.current.focus();
    };
  }, [panel]);

  const action = (name, secondary = false) => (
    <a className={"course-button team-class-action" + (secondary ? " secondary" : "")}
      href={"#" + name} onClick={(event) => openPanel(name, event)}>
      {name === "program" ? "Программа курса" : "Обсудить обучение"}
      {!secondary && <Arrow />}
    </a>
  );
  const steps = [
    { name: "Задачи", text: "Обсуждаем задачи вашей команды и подбираем программу.", panel: "enroll" },
    { name: "Уровень", text: "Определяем уровень подготовки участников.", panel: "program" },
    { name: "Формат", text: "Согласовываем удобный формат: онлайн, в Москве или на базе заказчика.", panel: "conditions" },
    { name: "Даты", text: "Подбираем даты и подтверждаем обучение.", panel: "enroll" },
  ];
  const formats = [
    { id: "online", icon: "laptop", name: "Онлайн", text: "Полноценное обучение в удобном формате." },
    { id: "office", icon: "building-o", name: "В офисе в Москве", text: "В нашем учебном классе с индивидуальными рабочими местами." },
    { id: "onsite", icon: "users", name: "На базе заказчика — по согласованию", text: "Проводим обучение на территории вашей компании." },
  ];

  return (
    <main className="course-site variant-12 team-class-page">
      <div className="team-class-layout">
        <nav className="team-class-breadcrumb" aria-label="Хлебные крошки">
          <a href="https://dev.topengineer.ru/">Главная</a><span>/</span>
          <a href={home}>Учебный центр</a><span>/</span><span>Tekla Structures</span>
        </nav>
        <section className="team-class-hero" aria-labelledby="team-class-title">
          <img className="team-class-hero-photo" src={asset("hero")} fetchPriority="high"
            alt="Преподаватель помогает команде инженеров работать с моделью Tekla Structures за компьютерами" />
          <div className="team-class-hero-copy">
            <h1 id="team-class-title">Обучение<br />вашей команды</h1>
            <p className="team-class-subtitle">Индивидуальный курс обучения<br />Tekla Structures</p>
            <div className="team-class-facts">
              <span><IntensiveIcon name="calendar-o" />2 дня</span>
              <span><IntensiveIcon name="clock-o" />16 часов</span>
              <span><IntensiveIcon name="map-marker" />Онлайн / Москва</span>
            </div>
            <div className="team-class-actions">{action("enroll")}{action("program", true)}</div>
          </div>
          <small className="team-class-photo-note">Иллюстрация формата обучения</small>
        </section>

        <section className="team-class-organization" aria-labelledby="team-class-steps-title">
          <h2 id="team-class-steps-title">Как организуем обучение</h2>
          <div className="team-class-steps">
            {steps.map((step, index) => (
              <button key={step.name} className="team-class-step" onClick={(event) => openPanel(step.panel, event)}>
                <span className="team-class-step-number">{index + 1}</span>
                <span className="team-class-step-copy"><strong>{step.name}</strong><span>{step.text}</span></span>
                {index < 3 && <Arrow />}
              </button>
            ))}
          </div>
        </section>

        <section className="team-class-budget" aria-label="Практика и бюджет команды">
          <figure className="team-class-practice">
            <img src={asset("practice")} loading="lazy" alt="Преподаватель разбирает модель на компьютере вместе с двумя участниками курса" />
            <figcaption>Практика с преподавателем</figcaption>
          </figure>
          <div className="team-class-price">
            <h2>Пример для 5 участников</h2>
            <strong className="team-class-total">{money(groupPrice.total)}</strong>
            <p className="team-class-price-period">За группу · 2 дня</p>
            <p className="team-class-price-detail"><IntensiveIcon name="user-o" />{money(groupPrice.perPerson)} за человека</p>
            <p className="team-class-price-detail"><IntensiveIcon name="laptop" />Онлайн или в Москве</p>
            <div className="team-class-other-prices">
              {[1, 3].map((count) => <p key={count}>{count === 1 ? "1 участник" : "3 участника"} — {money(prices.find((entry) => entry.people === count).total)} за 2 дня</p>)}
            </div>
            <p className="team-class-price-note">Цены действуют при проведении онлайн или в офисе в Москве. Обучение на базе заказчика — по согласованию.</p>
          </div>
        </section>

        <section className="team-class-formats" aria-labelledby="team-class-formats-title">
          <h2 id="team-class-formats-title">Форматы проведения</h2>
          <div className="team-class-format-grid">
            {formats.map((entry) => (
              <button key={entry.id} className="team-class-format" onClick={(event) => openPanel("enroll", event, entry.id)}>
                <IntensiveIcon name={entry.icon} />
                <span><strong>{entry.name}</strong><span>{entry.text}</span></span>
              </button>
            ))}
          </div>
        </section>

        <section className="team-class-contact" aria-labelledby="team-class-contact-title">
          <div><h2 id="team-class-contact-title">Обсудим задачи вашей команды</h2><p>Подберём программу под ваши задачи и ответим на вопросы.</p></div>
          <div className="team-class-actions">{action("enroll")}{action("program", true)}</div>
        </section>
        <nav className="team-class-variants" aria-label="Другие варианты дизайна">
          <a href={route(variants[10])}>Предыдущий вариант <Arrow /></a>
          <a href={home + "#designs"}>Все {variantCountText} <Arrow /></a>
        </nav>
      </div>

      {panel && <dialog className="intensive-dialog" ref={dialogRef} aria-labelledby="team-class-panel-title"
        onCancel={(event) => { event.preventDefault(); setPanel(null); }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setPanel(null);
          const link = event.target.closest("a[href='#enroll'], a[href='#program']");
          if (link) { event.preventDefault(); setPanel(link.getAttribute("href").slice(1)); }
        }}>
        <div className="intensive-dialog-toolbar">
          <h2 id="team-class-panel-title">{panel === "program" ? "Программа обучения" : panel === "conditions" ? "Условия обучения" : "Обсудить обучение"}</h2>
          <button className="intensive-close" onClick={() => setPanel(null)} aria-label="Закрыть окно">Закрыть <IntensiveIcon name="times" /></button>
        </div>
        <div className="intensive-dialog-body">
          {panel === "program" ? <><Program level={level} setLevel={setLevel} /><div className="intensive-panel-next"><button className="course-button" onClick={() => setPanel("enroll")}>Обсудить эту программу <Arrow /></button><button className="text-link" onClick={() => setPanel("conditions")}>Условия и форматы <Arrow /></button></div></>
            : panel === "conditions" ? <><Logistics /><Support /><FAQ /></>
              : <><Enroll courseLevel={level} setCourseLevel={setLevel} priceSelection={priceSelection} /><div className="intensive-panel-next"><button className="text-link" onClick={() => setPanel("program")}>Посмотреть программу <Arrow /></button><button className="text-link" onClick={() => setPanel("conditions")}>Условия и форматы <Arrow /></button></div></>}
          <div className="content-source">Информация: <a href={courseSource} target="_blank" rel="noreferrer">страница курса</a> · Цены: <a href={priceSource} target="_blank" rel="noreferrer">исходный прайс</a></div>
        </div>
      </dialog>}
    </main>
  );
}
function Course({ variant }) {
  const [level, setLevel] = useState(1);
  const [people, setPeople] = useState(variant.id === 6 ? 5 : 1);
  const [format, setFormat] = useState("online");
  const priceSelection = { people, setPeople, format, setFormat };
  const props = { level, setLevel, priceSelection };
  const blocks = {
    results: <Results />,
    audience: <Audience {...props} />,
    program: <Program {...props} />,
    teaching: <Teaching />,
    price: <Pricing selection={priceSelection} />,
    format: <Logistics />,
    support: <Support />,
    faq: <FAQ primary={variant.id === 9} />,
    roadmap: <Roadmap />,
    cards: <QuickCards />,
    questions: <QuestionLinks />,
  };
  const order = {
    1: [
      "results",
      "audience",
      "program",
      "teaching",
      "price",
      "format",
      "support",
      "faq",
    ],
    2: ["program", "results", "price", "format", "teaching", "support", "faq"],
    3: [
      "roadmap",
      "program",
      "teaching",
      "audience",
      "price",
      "format",
      "support",
      "faq",
    ],
    4: [
      "price",
      "audience",
      "program",
      "results",
      "format",
      "teaching",
      "support",
      "faq",
    ],
    5: [
      "teaching",
      "results",
      "audience",
      "program",
      "support",
      "price",
      "format",
      "faq",
    ],
    6: [
      "format",
      "price",
      "support",
      "teaching",
      "audience",
      "program",
      "results",
      "faq",
    ],
    9: [
      "questions",
      "faq",
      "audience",
      "program",
      "price",
      "format",
      "teaching",
      "results",
      "support",
    ],
    10: [
      "cards",
      "program",
      "price",
      "format",
      "teaching",
      "results",
      "support",
      "faq",
    ],
  };
  return (
    <main className={"course-site variant-" + variant.id}>
      <Review variant={variant} />
      <Hero
        variant={variant}
        setLevel={setLevel}
        priceSelection={priceSelection}
      />
      {variant.id === 7 ? (
        <Tabs {...props} />
      ) : variant.id === 8 ? (
        <Article {...props} />
      ) : (
        order[variant.id].map((key) => (
          <React.Fragment key={key}>{blocks[key]}</React.Fragment>
        ))
      )}
      <Enroll
        courseLevel={level}
        setCourseLevel={setLevel}
        priceSelection={priceSelection}
      />
      <div className="course-container content-source">
        Информация о курсе:{" "}
        <a href={courseSource} target="_blank" rel="noreferrer">
          исходная страница
        </a>{" "}
        · Цены:{" "}
        <a href={priceSource} target="_blank" rel="noreferrer">
          клиентский прайс
        </a>
      </div>
      <nav
        className="course-container variant-navigator"
        aria-label="Другие варианты дизайна"
      >
        <a href={route(variants[(variants.findIndex((v) => v.id === variant.id) + variants.length - 1) % variants.length])}>Предыдущий вариант</a>
        <a href={home + "#designs"}>Все варианты</a>
        <a href={route(variants[(variants.findIndex((v) => v.id === variant.id) + 1) % variants.length])}>Следующий вариант</a>
      </nav>
    </main>
  );
}
function Gallery() {
  return (
    <section id="designs" className="course-site gallery-section">
      <div className="course-container">
        <Heading
          overline="ИНДИВИДУАЛЬНЫЙ КУРС TEKLA STRUCTURES"
          title={variantCountText + " страницы курса"}
          text="Одинаковые программа и цены. Разные способы помочь посетителю разобраться и выбрать обучение."
        />
        <div className="gallery-intro">
          <p>
            Откройте вариант, чтобы сравнить подачу курса. В верхней полосе
            страниц — переход между макетами и пояснение идеи. Новые варианты 13–22 реализованы после согласования отдельных макетов с критиком.
          </p>
          <span>Шапка и футер — из утверждённого сайта<br /><a className="text-link" href="/design-mockups/2026-10-19/">Рассмотреть 10 согласованных макетов <Arrow /></a></span>
        </div>
        <div className="variants-grid">
          {variants.map((v) => (
            <a
              className={"variant-preview preview-" + v.id}
              href={route(v)}
              key={v.id}
            >
              <div className="variant-cover">
                {([1, 3, 5, 6, 11, 12].includes(v.id) || v.id >= 13) && (
                  <img src={v.id === 23 ? "/assets/reference/classroom.png" : v.id >= 13 ? `/assets/mockups/${v.id}-${v.slug}.jpg` : v.id === 12 ? "/assets/team-class/hero.jpg" : v.id === 11 ? "/assets/intensive/hero.jpg" : photo} alt="" loading="lazy" />
                )}
                <span className="variant-id">
                  {String(v.id).padStart(2, "0")}
                </span>
                <div className="cover-words">
                  <small>TEKLA STRUCTURES</small>
                  <strong>{v.name}</strong>
                  <span>{v.focus}</span>
                </div>
                <Arrow />
              </div>
              <div className="variant-details">
                <h3>{v.name}</h3>
                <p>{v.description}</p>
                <span className="text-link">
                  Открыть страницу <Arrow />
                </span>
              </div>
            </a>
          ))}
        </div>
        <div className="gallery-recommend">
          <Eyebrow>С ЧЕГО НАЧАТЬ СРАВНЕНИЕ</Eyebrow>
          <h3>
            01 — общее впечатление. 02 — выбор программы. 04 — оценка бюджета.
          </h3>
          <p>
            Три разных приоритета посетителя. Остальные варианты раскрывают
            другие способы организации информации.
          </p>
        </div>
      </div>
    </section>
  );
}
function SiteShell({ children }) {
  const headerRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const el = headerRef.current;
    function click(e) {
      if (e.target.closest(".nav-menu-toggle")) {
        e.preventDefault();
        const opened = !document.body.classList.contains(
          "pbmit-mobile-menu-active",
        );
        document.body.classList.toggle("pbmit-mobile-menu-active", opened);
        el.querySelectorAll(".pbmit-navbar > div").forEach((panel) =>
          panel.classList.toggle("active", opened),
        );
        e.target
          .closest(".nav-menu-toggle")
          .setAttribute("aria-expanded", String(opened));
        return;
      }
      if (
        e.target.closest(
          ".closepanel,.pbmit-nav-menu-close,.pbmit-mobile-menu-bg",
        )
      ) {
        document.body.classList.remove("pbmit-mobile-menu-active");
        el.querySelectorAll(".pbmit-navbar > div").forEach((panel) =>
          panel.classList.remove("active"),
        );
        return;
      }
      const link = e.target.closest("a");
      if (link?.getAttribute("aria-label") === "Поиск по сайту") {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (e.target.closest(".pbmit-btn") && !link) {
        e.preventDefault();
        if (document.querySelector(".intensive-page, .team-class-page, .next-course, .reference-course")) {
          window.dispatchEvent(new CustomEvent("tekla-intensive-enroll", { detail: { opener: e.target.closest(".pbmit-btn") } }));
          return;
        }
        if (document.getElementById("enroll")) location.hash = "enroll";
        else location.assign(route(variants[0]) + "#enroll");
        return;
      }
      const icon = e.target.closest(".righticon");
      if (icon) {
        e.preventDefault();
        icon.parentElement.classList.toggle("local-menu-expanded");
        return;
      }
      if (
        link &&
        link.closest(".navigation") &&
        link.parentElement.querySelector(":scope > ul") &&
        window.innerWidth < 1200
      ) {
        e.preventDefault();
        link.parentElement.classList.toggle("local-menu-expanded");
      }
    }
    function key(e) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        document.body.classList.remove("pbmit-mobile-menu-active");
        el.querySelectorAll(".pbmit-navbar > div").forEach((panel) =>
          panel.classList.remove("active"),
        );
      }
    }
    el.addEventListener("click", click);
    window.addEventListener("keydown", key);
    return () => {
      el.removeEventListener("click", click);
      window.removeEventListener("keydown", key);
    };
  }, []);
  return (
    <>
      <div ref={headerRef} dangerouslySetInnerHTML={{ __html: header }} />
      {children}
      <div dangerouslySetInnerHTML={{ __html: shell.footer }} />
      {searchOpen && (
        <dialog open className="local-search">
          <div className="course-site">
            <button
              className="search-close"
              onClick={() => setSearchOpen(false)}
              aria-label="Закрыть поиск"
            >
              Закрыть
            </button>
            <h2>Поиск вариантов</h2>
            <label>
              Название или тема
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Например: программа, стоимость"
              />
            </label>
            <div className="search-results">
              {variants
                .filter((v) =>
                  (v.name + " " + v.focus + " " + v.description)
                    .toLowerCase()
                    .includes(search.toLowerCase()),
                )
                .map((v) => (
                  <a key={v.id} href={route(v)}>
                    {String(v.id).padStart(2, "0")}. {v.name}
                    <Arrow />
                  </a>
                ))}
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
export function App() {
  const match = location.pathname.match(/tekla-(\d{2})-/);
  const variant = match
    ? variants.find((v) => v.id === Number(match[1]))
    : null;
  useEffect(() => {
    document.title = variant
      ? "Tekla Structures — " + variant.name + " | Топинженер"
      : "Учебный центр — " + variantCountText + " курса Tekla | Топинженер";
    if (location.hash) {
      requestAnimationFrame(() => {
        document
          .getElementById(decodeURIComponent(location.hash.slice(1)))
          ?.scrollIntoView({ behavior: "instant" });
      });
    }
  }, [variant]);
  return (
    <SiteShell>
      {variant ? (
        variant.id === 23 ? <React.Suspense fallback={<main className="course-site nc-loading" role="status">Загрузка страницы курса…</main>}><ReferenceCourse variant={variant} Review={Review} allVariants={variants} route={route} home={home}/></React.Suspense> : variant.id >= 13 ? <React.Suspense fallback={<main className="course-site nc-loading" role="status">Загрузка страницы курса…</main>}><NewCourse variant={variant} levels={levels} prices={prices} allVariants={variants} route={route} home={home} components={{Program,Enroll,Pricing,Logistics,Support,FAQ,Review}} /></React.Suspense> : variant.id === 12 ? <TeamClassCourse /> : variant.id === 11 ? <IntensiveCourse /> : <Course variant={variant} />
      ) : (
        <>
          <div dangerouslySetInnerHTML={{ __html: shell.main }} />
          <Gallery />
        </>
      )}
    </SiteShell>
  );
}
