import React, { useEffect, useMemo, useState } from 'react';
import './family-a.css';

const cleanTopic = (text) => text.replace(/^\d+(?:\.\d+)*\.?\s*/, '');
const topicCount = (modules) => modules.reduce((sum, module) => sum + module.topics.length, 0);

function CourseFacts({ course }) {
  const Icon = course.Icon;
  return <div className="na-facts"><span><Icon name="calendar-o" /> 2 дня</span><span><Icon name="clock-o" /> 16 часов</span><span><Icon name="map-marker" /> Онлайн / Москва</span></div>;
}

function LevelSwitch({ course, label = 'Уровень подготовки' }) {
  return <fieldset className="na-levels"><legend>{label}</legend><div>{course.programs.map((program) => <button type="button" key={program.id} aria-pressed={course.level === program.id} onClick={() => course.setLevel(program.id)}>{program.id === 1 ? 'С нуля' : program.id === 2 ? '6+ месяцев' : '4+ года'}</button>)}</div></fieldset>;
}

function OpenButton({ course, panel = 'enroll', children, className = '', level }) {
  return <button type="button" className={`na-button ${panel === 'enroll' ? 'na-primary' : 'na-secondary'} ${className}`} onClick={(event) => course.open(panel, event, level)}>{children || (panel === 'enroll' ? 'Обсудить обучение' : 'Полная программа')}<course.Icon name="angle-right" /></button>;
}

function SourceTopics({ topics, className = '' }) {
  return <ul className={`na-topics ${className}`}>{topics.map((topic, index) => <li key={`${index}-${topic}`}>{topic}</li>)}</ul>;
}

function PriceSummary({ course, title = 'Ваш курс', editable = true }) {
  const Icon = course.Icon;
  return <section className="na-budget" aria-label="Параметры и стоимость курса">
    <h2>{title}</h2>
    <dl className="na-budget-facts"><div><dt><Icon name="signal" /> Подготовка</dt><dd>{course.program.name}</dd></div><div><dt><Icon name="clock-o" /> Длительность</dt><dd>2 дня · 16 часов</dd></div></dl>
    {editable && <div className="na-budget-controls"><label>Формат<select value={course.format} onChange={(event) => course.setFormat(event.target.value)}>{Object.entries(course.formats).map(([value, name]) => <option key={value} value={value}>{name}</option>)}</select></label><label>Участники<select value={course.people} onChange={(event) => course.setPeople(Number(event.target.value))}>{Array.from({ length: 20 }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count}</option>)}<option value="21">Более 20</option></select></label></div>}
    <div className="na-price" aria-live="polite">{course.price ? <><strong>{course.money(course.price.total)}</strong><span>за группу · 2 дня</span><p>{course.money(course.price.perPerson)} за человека</p></> : <><strong className="na-price-agree">По согласованию</strong><p>{course.format === 'onsite' ? 'Обучение на базе заказчика' : 'Для группы более 20 участников'}</p></>}</div>
    <OpenButton course={course} />
    <OpenButton course={course} panel="program" />
    <p className="na-note">Цена не зависит от уровня подготовки. Для онлайн и офиса в Москве действует единый прайс. Выезд к заказчику согласуем отдельно; транспорт и проживание преподавателя оплачиваются дополнительно.</p>
    <a className="na-phone" href="tel:+74952150779"><Icon name="phone" /> +7 (495) 215-07-79</a>
  </section>;
}

// Every source module belongs to one navigation task; source topics are never shortened or replaced.
function taskGroups(program) {
  const pro = program.id === 3;
  const groups = pro ? [
    { id: 'logic', title: 'Логика Tekla', icon: 'cubes', modules: [] },
    { id: 'code', title: 'Разработка на C#', icon: 'code', modules: [] },
    { id: 'integration', title: 'Интеграция', icon: 'exchange', modules: [] },
  ] : [
    { id: 'model', title: 'Модель', icon: 'cube', modules: [] },
    { id: 'connections', title: program.id === 2 ? 'Инструменты' : 'Соединения', icon: 'cubes', modules: [] },
    { id: 'documents', title: 'Чертежи и отчёты', icon: 'file-text-o', modules: [] },
  ];
  program.modules.forEach((module) => {
    const number = Number(module.number || module.topics[0]?.match(/^(\d+)/)?.[1]);
    let index;
    if (pro) index = number >= 5 ? 2 : number >= 3 ? 1 : 0;
    else if (program.id === 2) index = number >= 3 ? 2 : number === 2 ? 1 : 0;
    else index = number >= 4 ? 2 : number >= 2 ? 1 : 0;
    groups[index].modules.push(module);
  });
  return groups.filter((group) => group.modules.length > 0);
}

function Workspace({ course }) {
  const [task, setTask] = useState('connections');
  const groups = useMemo(() => taskGroups(course.program), [course.program]);
  const selected = groups.find((group) => group.id === task) || groups[0];
  const Icon = course.Icon;
  return <div className="na-workspace na-page">
    <header className="na-workspace-heading"><div><p className="na-kicker">Учебный центр / Tekla Structures</p><h1>Рабочая задача</h1><p className="na-subtitle">Индивидуальное обучение Tekla Structures</p></div><CourseFacts course={course} /></header>
    <div className="na-workspace-grid">
      <aside className="na-task-nav"><h2>Чему хотите научиться</h2><nav aria-label="Рабочие задачи">{groups.map((group) => <button key={group.id} type="button" aria-pressed={selected.id === group.id} onClick={() => setTask(group.id)}><Icon name={group.icon} /><span>{group.title}<small>{topicCount(group.modules)} тем</small></span><Icon name="angle-right" /></button>)}</nav><LevelSwitch course={course} /><p className="na-note">Выберите задачу, чтобы увидеть связанные разделы. При смене уровня программа обновится.</p><OpenButton course={course} panel="program">Все {course.program.count} тем уровня</OpenButton></aside>
      <section className="na-workspace-program" aria-label="Темы выбранной задачи"><p className="na-kicker">{course.program.name} · {topicCount(selected.modules)} тем по задаче</p><h2>{selected.title}</h2><p className="na-lead">Разделы исходной программы, связанные с выбранной задачей. Откройте раздел, чтобы посмотреть все его темы.</p><div className="na-module-list" key={`${course.level}-${selected.id}`}>{selected.modules.map((module, index) => <details className="na-module" key={`${module.day}-${module.id}`} open={index === 0}><summary><span><small>День {module.day}</small>{module.title}</span><span className="na-count">{module.topics.length} тем <Icon name="angle-down" /></span></summary><SourceTopics topics={module.topics} /></details>)}</div><OpenButton course={course} panel="program">Все {course.program.count} тем выбранного уровня</OpenButton></section>
      <PriceSummary course={course} />
    </div>
  </div>;
}

function CommonPrices({ course, editorial = false }) {
  return <section className={`na-common-prices ${editorial ? 'na-editorial-prices' : ''}`} aria-label="Общая стоимость всех уровней"><div><h2>{editorial ? 'Стоимость для вашей группы' : 'Общие условия для всех уровней'}</h2><p>Онлайн или Москва · 2 дня, 16 часов</p><small>Цена за группу. Выезд к заказчику — по согласованию.</small></div><div className="na-price-examples">{[1, 3, 5].map((people) => { const price = course.prices.find((item) => Number(item.people) === people); return <div key={people}><span>{people === 1 ? '1 участник' : people === 3 ? '3 участника' : '5 участников'}</span><strong>{price ? course.money(price.total) : 'По прайсу'}</strong>{people === 5 && price && <small>{course.money(price.perPerson)} за человека</small>}</div>; })}</div><div className="na-common-actions"><OpenButton course={course} /><OpenButton course={course} panel="price">Рассчитать свою группу</OpenButton><OpenButton course={course} panel="program" /></div></section>;
}

function Journal({ course }) {
  const groups = useMemo(() => taskGroups(course.program), [course.program]);
  return <div className="na-journal na-page"><div className="na-journal-mast"><span>Учебный центр / <b>Инженерный журнал</b></span><span>Tekla Structures</span></div><div className="na-journal-intro"><div><h1>От модели —<br />к рабочим<br />чертежам<span>.</span></h1><p className="na-journal-subtitle">Индивидуальное обучение Tekla Structures</p><p className="na-lead">Два дня, чтобы последовательно разобрать инструменты работы с моделью, соединениями и документацией.</p></div><figure><img src={course.assets.classroom} alt="Преподаватель объясняет работу с инженерной моделью ученикам за компьютером" /><figcaption>Иллюстрация формата обучения</figcaption></figure></div><div className="na-journal-level"><LevelSwitch course={course} /><span>{course.program.name} · {course.program.count} тем исходной программы</span><OpenButton course={course} panel="program" /></div><div className="na-journal-chapters" key={course.level}>{groups.map((group, index) => <article key={group.id}><span className="na-chapter-number">0{index + 1}</span><div><h2>{group.title}</h2><p>{group.modules.map((module) => module.title).join(' · ')}</p><ul>{group.modules.flatMap((module) => module.topics).slice(0, 5).map((topic) => <li key={topic}>{cleanTopic(topic)}</li>)}</ul><details><summary>Смотреть все {topicCount(group.modules)} тем <course.Icon name="angle-down" /></summary><SourceTopics topics={group.modules.flatMap((module) => module.topics)} /></details></div></article>)}</div><div className="na-journal-pull"><strong>2 дня / 16 часов</strong><p>С нуля · 6+ месяцев опыта · 4+ года практики.<br />Уровень выбирается по подготовке.<br />Стоимость от уровня не зависит.</p></div><CommonPrices course={course} editorial /></div>;
}

function ComparisonDay({ program, day }) {
  const topics = program.days[day - 1].flatMap((module) => module.topics);
  return <div className="na-comparison-cell"><span className="na-mobile-row-label">День {day}</span><ul className="na-comparison-preview">{topics.slice(0, 3).map((topic) => <li key={topic}>{topic}</li>)}</ul><details><summary>Все {topics.length} тем дня</summary><SourceTopics topics={topics} /></details></div>;
}

function CurriculumCompare({ course }) {
  return <div className="na-compare na-page"><header className="na-compare-heading"><div><p className="na-kicker">Учебный центр / Tekla Structures</p><h1>Выберите программу по опыту</h1><p className="na-subtitle">Сопоставьте содержание трёх уровней. Стоимость одинакова.</p></div><CourseFacts course={course} /></header><div className="na-comparison-grid" aria-label="Сравнение трёх программ"><div className="na-comparison-labels" aria-hidden="true"><div>Разделы программы</div><div>Подготовка</div><div>Основной акцент</div><div>День 1</div><div>День 2</div></div>{course.programs.map((program) => <section className={`na-comparison-column ${course.level === program.id ? 'na-current-level' : ''}`} key={program.id}><header><div><h2>{program.short || program.name}</h2><strong>{program.count} тем</strong></div><p>{program.experience}</p><button type="button" className={`na-button ${course.level === program.id ? 'na-primary' : 'na-secondary'}`} aria-pressed={course.level === program.id} onClick={() => course.setLevel(program.id)}>{course.level === program.id ? 'Выбран для обращения' : 'Выбрать уровень'}<course.Icon name="angle-right" /></button></header><div className="na-comparison-cell"><span className="na-mobile-row-label">Подготовка</span><p>{program.experience}</p></div><div className="na-comparison-cell"><span className="na-mobile-row-label">Основной акцент</span><p>{program.id === 1 ? 'Модель, соединения, компоненты и создание чертежей.' : program.id === 2 ? 'Настройки проекта, сложные инструменты, чертежи, среды и отчёты.' : 'Логика Tekla Structures, разработка на C# и интеграция с производством.'}</p><OpenButton course={course} panel="program" level={program.id}>Полная программа · {program.count} тем</OpenButton></div><ComparisonDay program={program} day={1} /><ComparisonDay program={program} day={2} /></section>)}</div><CommonPrices course={course} /></div>;
}

function PlannerDetail({ course, module, inline = false }) {
  return <section className={`na-planner-detail ${inline ? 'na-planner-inline' : 'na-planner-docked'}`} aria-label={`Подробности раздела ${module.title}`}><p className="na-kicker">День {module.day} / выбранный раздел</p><h2>{module.title}</h2><SourceTopics topics={module.topics} /><OpenButton course={course} panel="program">Полная программа · {course.program.count} тем</OpenButton></section>;
}

function TwoDayPlanner({ course }) {
  const initial = course.program.modules.find((module) => /компонент/i.test(module.title)) || course.program.modules[0];
  const [selectedId, setSelectedId] = useState(initial.id);
  useEffect(() => { setSelectedId((course.program.modules.find((module) => /компонент/i.test(module.title)) || course.program.modules[0]).id); }, [course.level]);
  const selected = course.program.modules.find((module) => module.id === selectedId) || course.program.modules[0];
  const Icon = course.Icon;
  return <div className="na-planner na-page"><header className="na-planner-heading"><div><h1>Два дня в работе</h1><p className="na-subtitle">Индивидуальное обучение Tekla Structures</p></div><div><LevelSwitch course={course} /><CourseFacts course={course} /></div></header><div className="na-planner-grid">{course.program.days.map((modules, dayIndex) => <section className="na-day-board" key={dayIndex}><header><Icon name="calendar-o" /><div><h2>День {dayIndex + 1}</h2><p>{modules.length} разделов · {topicCount(modules)} тем</p></div></header><div className="na-day-modules">{modules.map((module) => <div className={`na-plan-module ${selected.id === module.id ? 'na-selected-module' : ''}`} key={module.id}><button type="button" aria-expanded={selected.id === module.id} onClick={() => setSelectedId(module.id)}><span><b>{module.title}</b><small>{module.topics.length} тем{selected.id === module.id && ' · Выбрано'}</small></span><Icon name={selected.id === module.id ? 'check-circle' : 'angle-right'} /></button><ul>{module.topics.slice(0, 3).map((topic) => <li key={topic}>{cleanTopic(topic)}</li>)}</ul>{selected.id === module.id && <PlannerDetail course={course} module={module} inline />}</div>)}</div></section>)}<aside className="na-planner-dock"><PlannerDetail course={course} module={selected} /><PriceSummary course={course} title="Стоимость для вашей группы" /></aside></div></div>;
}

function TopicLibrary({ course }) {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState(0);
  const [day, setDay] = useState(0);
  const [limit, setLimit] = useState(12);
  const Icon = course.Icon;
  const topics = useMemo(() => course.programs.flatMap((program) => program.topics.map((text, index) => {
    const module = program.modules.find((item) => item.topics.includes(text));
    return { id: `${program.id}-${index}`, text, level: program.id, levelName: program.short || program.name, day: module?.day || 1, module: module?.title };
  })), [course.programs]);
  const normalize = (text) => text.toLocaleLowerCase('ru').replaceAll('ё', 'е').trim();
  const results = useMemo(() => topics.filter((topic) => (!level || topic.level === level) && (!day || topic.day === day) && normalize(topic.text).includes(normalize(query))), [topics, query, level, day]);
  const reset = () => { setQuery(''); setLevel(0); setDay(0); setLimit(12); };
  const chooseLevel = (value) => { setLevel(value); if (value) course.setLevel(value); setLimit(12); };
  return <div className="na-library na-page"><header><p className="na-kicker">Учебный центр / Tekla Structures</p><h1>Найдите нужную тему</h1><p className="na-subtitle">{topics.length} тем трёх программ индивидуального обучения Tekla Structures</p></header><form className="na-search" role="search" onSubmit={(event) => { event.preventDefault(); setLimit(12); }}><Icon name="search" /><label className="na-visually-hidden" htmlFor="na-topic-query">Название темы, инструмент или задача</label><input id="na-topic-query" type="search" value={query} placeholder="Название темы, инструмент или задача" onChange={(event) => { setQuery(event.target.value); setLimit(12); }} /><button className="na-button na-primary" type="submit">Найти</button></form><div className="na-library-filters"><fieldset><legend>Уровень подготовки</legend><div><button type="button" aria-pressed={level === 0} onClick={() => chooseLevel(0)}>Все уровни</button>{course.programs.map((program) => <button type="button" key={program.id} aria-pressed={level === program.id} onClick={() => chooseLevel(program.id)}>{program.id === 1 ? 'С нуля' : program.id === 2 ? 'От 6 месяцев' : 'От 4 лет'} · {program.count}</button>)}</div></fieldset><label>День обучения<select value={day} onChange={(event) => { setDay(Number(event.target.value)); setLimit(12); }}><option value="0">Любой день</option><option value="1">День 1</option><option value="2">День 2</option></select></label><button type="button" className="na-reset" onClick={reset}><Icon name="refresh" /> Сбросить</button></div><p className="na-results-count" role="status">Найдено {results.length} тем, показано {Math.min(limit, results.length)}</p><div className="na-library-grid"><section className="na-library-results" aria-label="Результаты поиска">{results.length ? <>{results.slice(0, limit).map((topic, index, shown) => <React.Fragment key={topic.id}>{(index === 0 || topic.level !== shown[index - 1].level || topic.day !== shown[index - 1].day) && <h2 className="na-result-group">{topic.levelName} / День {topic.day}</h2>}<details className="na-topic-result"><summary><span>{topic.text}</span><small>{topic.levelName} · День {topic.day}</small><Icon name="angle-down" /></summary><div><p>Тема исходной программы. {topic.module}.</p><p>{topic.levelName} · День {topic.day}</p><OpenButton course={course} panel="program" level={topic.level}>Открыть программу этого уровня</OpenButton></div></details></React.Fragment>)}{limit < results.length && <button className="na-more" type="button" onClick={() => setLimit((value) => value + 12)}>Показать следующие темы <Icon name="angle-down" /></button>}</> : <div className="na-empty"><Icon name="search" /><h2>Совпадений не найдено</h2><p>Попробуйте другую формулировку или сбросьте фильтры уровня и дня.</p><button type="button" className="na-button na-secondary" onClick={reset}>Сбросить поиск и фильтры</button></div>}</section><aside><PriceSummary course={course} title="О курсе" /></aside></div></div>;
}

export default function FamilyA({ course }) {
  switch (course.variant.id) {
    case 13: return <Workspace course={course} />;
    case 14: return <Journal course={course} />;
    case 15: return <CurriculumCompare course={course} />;
    case 16: return <TwoDayPlanner course={course} />;
    case 17: return <TopicLibrary course={course} />;
    default: return null;
  }
}
