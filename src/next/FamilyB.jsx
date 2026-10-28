import React, { useId, useRef, useState } from "react";
import "./family-b.css";

const formatCopy = {
  online: "Обучение онлайн. Даты и удобное время согласуем с вами.",
  office: "Занятия в нашем офисе в Москве, с индивидуальным рабочим местом.",
  onsite: "Обучение на территории вашей компании — по согласованию. Проезд и проживание преподавателя оплачиваются отдельно.",
};

function Action({ course, children, panel = "enroll", quiet = false, className = "", ...props }) {
  const Icon = course.Icon;
  return <button type="button" className={`nb-action ${quiet ? "nb-action-quiet" : ""} ${className}`} onClick={event => course.open(panel, event)} {...props}>{children}<Icon name="chevron-right" /></button>;
}

function LevelSelect({ course, label = "Уровень подготовки", className = "" }) {
  const id = useId();
  return <label htmlFor={id} className={`nb-select ${className}`}><span>{label}</span><select id={id} value={course.level} onChange={event => course.setLevel(Number(event.target.value))}>{course.programs.map(program => <option key={program.id} value={program.id}>{program.name} {program.experience ? `— ${program.experience}` : ""}</option>)}</select></label>;
}

function PeopleSelect({ course, label = "Участников", className = "" }) {
  const id = useId();
  return <label htmlFor={id} className={`nb-select ${className}`}><span>{label}</span><select id={id} value={course.people} onChange={event => course.setPeople(Number(event.target.value))}>{course.prices.map(price => <option key={price.people} value={price.people}>{price.people}</option>)}<option value={21}>Более 20 — по согласованию</option></select></label>;
}

function Facts({ course }) {
  const Icon = course.Icon;
  return <div className="nb-facts"><span><Icon name="calendar-o" />2 дня</span><span><Icon name="clock-o" />16 часов</span><span><Icon name="map-marker" />Онлайн или в Москве</span></div>;
}

function Price({ course, className = "" }) {
  return <div className={`nb-price ${className}`} aria-live="polite" aria-atomic="true">{course.price ? <><strong>{course.money(course.price.total)}</strong><span>за {course.people === 1 ? "1 участника" : "группу"} · 2 дня / 16 часов</span>{course.people > 1 && <small>{course.money(course.price.perPerson)} на человека</small>}</> : <><strong className="nb-price-agreement">По согласованию</strong><span>{course.format === "onsite" ? "Обучение на базе заказчика" : "Для группы более 20 участников"}</span>{course.format === "onsite" && <small>Проезд и проживание оплачиваются отдельно</small>}</>}</div>;
}

function Topics({ topics, className = "" }) {
  return <ul className={`nb-topic-list ${className}`}>{topics.map((topic, index) => <li key={`${index}-${topic}`}>{topic}</li>)}</ul>;
}

function MiniPrices({ course }) {
  return <div className="nb-mini-prices">{[1, 3, 5].map(people => {
    const price = course.prices.find(item => item.people === people);
    return price && <div key={people}><strong>{people} {people === 1 ? "участник" : people === 3 ? "участника" : "участников"} — {course.money(price.total)}</strong><span>за группу · 2 дня / 16 часов</span></div>;
  })}</div>;
}

function Composer({ course }) {
  const [step, setStep] = useState(0);
  const question = useRef(null);
  const Icon = course.Icon;
  const steps = ["Уровень", "Формат", "Участники", "Проверка"];
  const overviewModules = course.program.modules.filter((module, index, modules) => modules.findIndex(item => item.number === module.number) === index);
  const questions = ["С каким опытом вы начинаете?", "Где вам удобно учиться?", "Сколько человек будет учиться?", "Проверьте параметры курса"];
  const go = next => {
    setStep(next);
    requestAnimationFrame(() => question.current?.focus({ preventScroll: true }));
  };
  return <div className="nb-page nb-composer" data-testid="course-composer">
    <header className="nb-composer-heading"><h1>Индивидуальное обучение Tekla Structures</h1><Facts course={course} /></header>
    <div className="nb-composer-grid">
      <div className="nb-composer-work">
        <nav className="nb-progress" aria-label="Шаги выбора курса">{steps.map((title, index) => <button type="button" key={title} aria-current={step === index ? "step" : undefined} className={`${step === index ? "is-current" : ""} ${step > index ? "is-complete" : ""}`} onClick={() => go(index)}><span className="nb-progress-dot" aria-hidden="true">{step > index && <Icon name="check" />}</span><span>{title}</span></button>)}</nav>
        <section className="nb-question" aria-labelledby="nb-composer-question">
          <h2 id="nb-composer-question" ref={question} tabIndex={-1}>{questions[step]}</h2>
          <p className="nb-question-intro">{step === 0 ? "Выберите подготовку — программа будет соответствовать вашему опыту." : step === 1 ? "Выбор формата уточняет организацию и стоимость обучения." : step === 2 ? "Стоимость курса не зависит от уровня подготовки." : "Следующий шаг откроет форму обращения к менеджеру. Заявка автоматически не отправляется."}</p>
          {step === 0 && <fieldset className="nb-choice-list"><legend className="nb-sr-only">Уровень подготовки</legend>{course.programs.map(program => <label key={program.id} className={`nb-choice ${course.level === program.id ? "is-selected" : ""}`}><input type="radio" name="nb-composer-level" value={program.id} checked={course.level === program.id} onChange={() => course.setLevel(program.id)} /><span className="nb-choice-title"><strong>{program.name}{program.experience ? ` — ${program.experience}` : ""}</strong><span>{program.text}</span></span><Icon name={program.id === 1 ? "file-text-o" : program.id === 2 ? "bar-chart" : "cogs"} /><span className="nb-choice-result">{program.result}</span></label>)}</fieldset>}
          {step === 1 && <fieldset className="nb-choice-list"><legend className="nb-sr-only">Формат обучения</legend>{Object.entries(course.formats).map(([value, label]) => <label key={value} className={`nb-choice nb-format-choice ${course.format === value ? "is-selected" : ""}`}><input type="radio" name="nb-composer-format" value={value} checked={course.format === value} onChange={() => course.setFormat(value)} /><span className="nb-choice-title"><strong>{label}</strong><span>{formatCopy[value]}</span></span><Icon name={value === "online" ? "desktop" : value === "office" ? "building-o" : "users"} /></label>)}</fieldset>}
          {step === 2 && <div className="nb-participant-question"><Icon name="users" /><PeopleSelect course={course} label="Количество участников" /><p>Выберите любое число от 1 до 20. Для большей группы стоимость согласуем отдельно.</p><button type="button" className="nb-text-button" onClick={event => course.open("price", event)}>Посмотреть полный прайс</button></div>}
          {step === 3 && <div className="nb-review"><dl><div><dt>Программа</dt><dd>{course.program.name} · {course.program.count} тем</dd></div><div><dt>Продолжительность</dt><dd>2 дня · 16 часов</dd></div><div><dt>Формат</dt><dd>{course.formats[course.format]}</dd></div><div><dt>Участники</dt><dd>{course.people === 21 ? "Более 20" : course.people}</dd></div></dl><p>{formatCopy[course.format]}</p><p>Дату начала курса и детали обсудим с менеджером. В форме можно проверить и изменить все параметры.</p></div>}
          <div className="nb-composer-actions"><button type="button" className="nb-text-button" onClick={event => course.open("program", event)}><Icon name="file-text-o" />Посмотреть полную программу</button><div>{step > 0 && <button type="button" className="nb-back" onClick={() => go(step - 1)}><Icon name="chevron-left" />Назад</button>}{step < 3 ? <button type="button" className="nb-action" onClick={() => go(step + 1)}>Продолжить<Icon name="chevron-right" /></button> : <Action course={course}>Обсудить обучение</Action>}</div></div>
        </section>
      </div>
      <aside className="nb-composer-summary" aria-label="Ваш курс"><h2>Ваш курс</h2><dl>{[{ label: "Уровень", value: course.program.name, icon: "graduation-cap", target: 0 }, { label: "Формат", value: course.formats[course.format], icon: "desktop", target: 1 }, { label: "Участники", value: course.people === 21 ? "Более 20" : String(course.people), icon: "users", target: 2 }].map(item => <div key={item.label}><Icon name={item.icon} /><dt>{item.label}<strong>{item.value}</strong></dt><dd><button type="button" className="nb-text-button" aria-label={`Изменить: ${item.label.toLowerCase()}`} onClick={() => go(item.target)}>Изменить</button></dd></div>)}</dl><p>Стоимость</p><Price course={course} /><p className="nb-summary-note"><Icon name="info-circle" />Уровень не влияет на стоимость.</p><button type="button" className="nb-text-button" onClick={event => course.open("price", event)}><Icon name="file-text-o" />Прайс на 1–20 участников</button><button type="button" className="nb-summary-enquire nb-text-button" onClick={event => course.open("enroll", event)}>Обсудить текущий выбор</button></aside>
    </div>
    <section className="nb-composer-bottom" aria-label="Содержание и организация"><div><h2>Что входит в программу</h2><div className="nb-composer-topics">{overviewModules.map(module => <span key={module.number}><Icon name="file-text-o" />{module.title}</span>)}</div></div><div><h2>Как проходит обучение</h2><p>Индивидуальный курс. Онлайн или в офисе в Москве. На базе заказчика — по согласованию.</p></div></section><div className="nb-composer-footnote"><Icon name="info-circle" />Вся программа доступна на любом шаге</div>
  </div>;
}

const stageDefinitions = [
  { id: "model", name: "Модель", icon: "cube", match: /модел|сред|сетк|колонн|балк|профил|ориентац|сохранен|примитив|геометр|объект|плоскост|привязк/i },
  { id: "connections", name: "Соединения", icon: "cubes", match: /компонент|болт|сварк|метиз|соединен|наклон/i },
  { id: "documentation", name: "Чертежи и отчёты", icon: "file-text-o", match: /чертеж|чертёж|отч[её]т|нумерац|ведомост|размер|метк/i },
];

function ProjectExplorer({ course }) {
  const [stage, setStage] = useState("model");
  const Icon = course.Icon;
  const current = stageDefinitions.find(item => item.id === stage);
  const matched = course.program.topics.filter(topic => current.match.test(topic));
  const visual = stage === "documentation" && course.assets.drawing ? course.assets.drawing : stage === "connections" && course.assets.modelOverview ? course.assets.modelOverview : course.assets.model;
  const caption = stage === "documentation" ? course.assets.drawing ? "Пример инженерного чертежа" : "Модель как исходная база для документации" : stage === "connections" ? "Пример инженерной модели: элементы и соединения" : "Пример инженерной модели";
  return <div className="nb-page nb-project" data-testid="project-explorer">
    <header className="nb-project-heading"><div><p className="nb-kicker">Индивидуальное обучение Tekla Structures</p><h1>От модели к документации</h1><p className="nb-project-facts">2 дня · 16 часов · 3 уровня подготовки</p></div><div className="nb-project-controls"><LevelSelect course={course} label="Уровень" /><PeopleSelect course={course} /><Action course={course} panel="program" quiet>Полная программа</Action></div></header>
    <div className="nb-project-viewer"><nav className="nb-project-stages" aria-label="Этапы инженерной работы">{stageDefinitions.map((item, index) => <button type="button" className={stage === item.id ? "is-selected" : ""} aria-pressed={stage === item.id} aria-controls="nb-stage-content" key={item.id} onClick={() => setStage(item.id)}><small>0{index + 1}</small><span><Icon name={item.icon} />{item.name}<Icon name="chevron-right" /></span></button>)}</nav><figure className="nb-project-image"><img src={visual} alt={caption} /><figcaption><span>Этап: <strong>{current.name}</strong></span><span>{caption}</span></figcaption></figure></div>
    <section className="nb-project-tray" id="nb-stage-content" aria-label={`Темы этапа ${current.name}`}><div className="nb-project-tray-title"><h2>Что изучаем<br />на этом этапе</h2><p>{course.program.name}. Темы из исходной программы.</p><button type="button" className="nb-text-button" onClick={event => course.open("program", event)}>Все {course.program.count} тем программы</button></div><div className="nb-project-topics" aria-live="polite"><h3 className="nb-sr-only">{current.name}</h3>{matched.length ? <Topics topics={matched.slice(0, 8)} /> : <p>В выбранной программе нет отдельно выделенных тем этого этапа. Посмотрите полную программу своего уровня.</p>}<p className="nb-project-topic-count">{matched.length > 8 ? `Показано 8 из ${matched.length} связанных тем. Полный перечень — в программе.` : `${matched.length} ${matched.length === 1 ? "связанная тема" : "связанных тем"}. Все темы доступны в полной программе.`}</p></div><aside className="nb-project-price"><Price course={course} /><p>{course.formats[course.format]}</p><Action course={course}>Обсудить обучение</Action></aside><div className="nb-project-note">На базе заказчика — по согласованию. Цена не зависит от уровня. <button type="button" className="nb-text-button" onClick={event => course.open("price", event)}>Прайс на 1–20 участников</button><button type="button" className="nb-text-button" onClick={event => course.open("conditions", event)}>Условия обучения</button></div></section>
  </div>;
}

function ReadingModes({ course }) {
  const [detailed, setDetailed] = useState(false);
  const Icon = course.Icon;
  const preview = course.program.modules.map(module => module.topics[0]).filter(Boolean).slice(0, 4);
  return <div className={`nb-page nb-reading ${detailed ? "is-detailed" : "is-brief"}`} data-testid="reading-modes">
    <header className="nb-reading-heading"><div><p className="nb-kicker">Индивидуальное обучение Tekla Structures</p><h1>Вся информация.<br />В удобной глубине.</h1></div><div className="nb-depth-control"><span id="nb-depth-label">Глубина чтения</span><div role="group" aria-labelledby="nb-depth-label"><button type="button" aria-pressed={!detailed} className={!detailed ? "is-selected" : ""} onClick={() => setDetailed(false)}>Коротко</button><button type="button" aria-pressed={detailed} className={detailed ? "is-selected" : ""} onClick={() => setDetailed(true)}>Подробно</button></div><p aria-live="polite">{detailed ? "Подробный режим во всех разделах" : "Меняет объём информации во всех разделах"}</p></div><Action course={course} panel="program" quiet>Полная программа курса</Action></header>
    <section className="nb-reading-band nb-reading-audience" aria-labelledby="nb-audience-heading"><div className="nb-band-heading"><span>Для кого</span><h2 id="nb-audience-heading">Три уровня</h2></div><div className="nb-reading-levels">{course.programs.map(program => <div key={program.id}><h3>{program.name}{program.experience ? ` — ${program.experience}` : ""}</h3>{detailed && <><p>{program.text}</p><p>{program.result}</p><span className="nb-level-count">{program.count} исходных тем · 2 дня</span></>}</div>)}</div><div className="nb-band-aside"><LevelSelect course={course} label="Ваша программа" /><p>Выберите свой уровень подготовки.</p>{detailed && <p>Начать можно с нуля. Для опытного уровня нужен опыт от 6 месяцев, для профессионального — от 4 лет.</p>}</div></section>
    <section className="nb-reading-band nb-reading-content" aria-labelledby="nb-content-heading"><div className="nb-band-heading"><span>Содержание</span><h2 id="nb-content-heading">От модели<br />к чертежам</h2>{detailed && <p>Для профессионалов — логика Tekla, приложения на C# и интеграция.</p>}</div><div>{detailed ? <div className="nb-reading-modules">{course.program.days.map((day, dayIndex) => <section key={dayIndex}><h3>День {dayIndex + 1}</h3>{day.map(module => <div className="nb-reading-module" key={module.id}><h4>{module.title}</h4><Topics topics={module.topics} /></div>)}</section>)}</div> : <Topics className="nb-reading-preview" topics={preview} />}</div><div className="nb-band-aside"><strong>Все 145 тем трёх программ</strong><button type="button" className="nb-text-button" onClick={event => course.open("program", event)}>Открыть темы выбранного уровня<Icon name="chevron-right" /></button>{detailed && <p>Сейчас показаны все {course.program.count} тем уровня «{course.program.name}». Исходная нумерация сохранена.</p>}</div></section>
    <section className="nb-reading-band nb-reading-logistics" aria-labelledby="nb-logistics-heading"><div className="nb-band-heading"><span>Организация</span><h2 id="nb-logistics-heading">2 дня /<br />16 часов</h2></div><div><p>Онлайн или в офисе в Москве.<br />На базе заказчика — по согласованию.<br />Даты согласуются с вами.</p>{detailed && <div className="nb-reading-details"><p>На нашей базе каждый слушатель получает отдельное рабочее место. Перед началом курса уточняются место проведения, удобные даты и способ оплаты.</p><p>При выезде на базу заказчика проезд и проживание преподавателя оплачиваются отдельно.</p><button type="button" className="nb-text-button" onClick={event => course.open("conditions", event)}>Все условия и ответы на вопросы</button></div>}</div><div className="nb-band-aside"><strong>Опыт преподавателя: 6+ лет</strong><p>{detailed ? "Специалисты с опытом работы в Tekla Structures не менее шести лет." : "В подробном режиме — условия и ответы на вопросы."}</p>{detailed && <p>Программа и формат согласуются с учётом подготовки участников.</p>}</div></section>
    <section className="nb-reading-cost" aria-labelledby="nb-cost-heading"><div className="nb-band-heading"><span>Стоимость</span><h2 id="nb-cost-heading">Прозрачный<br />расчёт</h2></div><div><MiniPrices course={course} /><p className="nb-reading-price-note">Для онлайн или офиса в Москве. 18 000 ₽ на человека при 5 участниках. Прайс на 1–20. Уровень не влияет на цену.</p>{detailed && <div className="nb-reading-price-details"><div className="nb-reading-price-controls"><PeopleSelect course={course} /><label className="nb-select"><span>Формат</span><select value={course.format} onChange={event => course.setFormat(event.target.value)}>{Object.entries(course.formats).map(([value, title]) => <option key={value} value={value}>{title}</option>)}</select></label></div><Price course={course} /><p>На базе заказчика — согласование, проезд и проживание отдельно.</p><button type="button" className="nb-text-button" onClick={event => course.open("price", event)}>Полная таблица стоимости</button></div>}</div><div className="nb-reading-cost-action"><Action course={course}>Обсудить обучение</Action>{detailed && <p>Параметры можно проверить в форме перед обращением к менеджеру.</p>}</div></section>
  </div>;
}

function FormatStudio({ course }) {
  const Icon = course.Icon;
  const zone = value => <section key={value} className={`nb-format-zone nb-format-${value} ${course.format === value ? "is-selected" : ""}`} aria-labelledby={`nb-format-title-${value}`}>
    <label className="nb-zone-radio"><input type="radio" name="nb-studio-format" value={value} checked={course.format === value} onChange={() => course.setFormat(value)} /><span>{course.format === value ? "Выбранный формат" : "Выбрать формат"}</span></label>
    {value === "office" ? <figure className="nb-format-classroom"><img src={course.assets.classroom} alt="Преподаватель объясняет модель Tekla взрослым слушателям за компьютерами" /><figcaption>Иллюстрация формата обучения</figcaption></figure> : <div className="nb-format-symbol"><Icon name={value === "online" ? "laptop" : "building-o"} /></div>}
    <div className="nb-format-zone-copy"><h2 id={`nb-format-title-${value}`}>{value === "office" ? "В офисе в Москве" : course.formats[value]}</h2><p>{value === "online" ? "Обучение в удобном для вас месте. Формат и время согласуются." : value === "office" ? "Обучение в нашем учебном классе." : "Обучение на территории вашей компании."}</p>{value === "office" ? <address><Icon name="map-marker" />Варшавское ш., 1с1-2, W-Plaza, оф. В-410</address> : <div className="nb-zone-condition">{value === "online" ? <><span>По исходному прайсу</span><strong>1–20</strong><b>участников</b></> : <><strong>По согласованию</strong><p>Проезд и проживание преподавателя оплачиваются отдельно.</p></>}</div>}</div>
  </section>;
  const summary = <div key="summary" className="nb-format-summary"><div className="nb-format-chosen"><span>Выбрано:</span><strong>{course.formats[course.format]}</strong></div><PeopleSelect course={course} /><Price course={course} /><div><Action course={course}>Обсудить обучение</Action><p>Уровень подготовки не влияет на стоимость. Даты согласуются индивидуально.</p></div></div>;
  return <div className="nb-page nb-format-studio" data-testid="format-studio"><header className="nb-format-heading"><div><p className="nb-kicker">Индивидуальное обучение Tekla Structures</p><h1>Где вам удобно учиться</h1><div className="nb-facts"><span><Icon name="calendar-o" />2 дня</span><span><Icon name="clock-o" />16 часов</span><span><Icon name="bar-chart" />Три уровня подготовки</span></div></div><div className="nb-format-heading-controls"><LevelSelect course={course} label="Уровень" /><Action course={course} panel="program" quiet>Посмотреть программу</Action></div></header><div className="nb-format-composition">{zone(course.format)}{summary}{["online", "office", "onsite"].filter(value => value !== course.format).map(zone)}</div></div>;
}

function PrintSyllabus({ course }) {
  const [contents, setContents] = useState(false);
  const Icon = course.Icon;
  const contentsId = useId();
  const dayNames = course.level === 1 ? ["Модель, соединения, компоненты", "Чертежи, настройки, отчёты"] : course.level === 2 ? ["Настройки модели и чертежей", "Среды, переменные, редактор отчётов"] : ["Логика Tekla и приложения", "Приложения и интеграция с производством"];
  return <div className="nb-page nb-syllabus" data-testid="print-syllabus"><div className="nb-document-toolbar"><LevelSelect course={course} label="Уровень" /><button type="button" className="nb-document-tool" aria-expanded={contents} aria-controls={contentsId} onClick={() => setContents(!contents)}><Icon name="list" />Оглавление</button><button type="button" className="nb-action nb-print-button" onClick={() => course.print()}><Icon name="print" />Печать программы</button><Action course={course} panel="program" quiet>Полная программа</Action></div>{contents && <nav className="nb-document-contents" id={contentsId} aria-label="Оглавление программы">{course.program.days.map((day, dayIndex) => <div key={dayIndex}><strong>День {dayIndex + 1}</strong>{day.map(module => <a href={`#nb-doc-${course.level}-${module.id}`} key={module.id}>{module.title}</a>)}</div>)}</nav>}<header className="nb-document-heading"><h1>Программа индивидуального обучения Tekla Structures</h1><p>{course.program.name} · 2 дня · 16 часов · {course.program.count} тем</p></header><div className="nb-document-days">{course.program.days.map((day, dayIndex) => <section className="nb-document-day" key={dayIndex} aria-labelledby={`nb-doc-day-${dayIndex}`}><header><h2 id={`nb-doc-day-${dayIndex}`}>День {dayIndex + 1}</h2><p>{dayNames[dayIndex]}</p></header>{day.map(module => <section className="nb-document-module" id={`nb-doc-${course.level}-${module.id}`} key={module.id}><h3>{module.title}</h3><Topics topics={module.topics} /></section>)}{dayIndex === 1 && <section className="nb-document-cost" aria-label="Стоимость и условия"><h2>Стоимость и условия</h2><table><caption className="nb-sr-only">Примеры стоимости двухдневного курса онлайн или в офисе в Москве</caption><tbody>{[1, 3, 5].map(people => { const price = course.prices.find(item => item.people === people); return price && <tr key={people}><th scope="row">{people} {people === 1 ? "участник" : people === 3 ? "участника" : "участников"}</th><td>{course.money(price.total)} за группу{people === 5 && ` / ${course.money(price.perPerson)} на человека`}</td></tr>; })}</tbody></table><p>Курс 2 дня / 16 часов. Цена не зависит от уровня.</p><p>Онлайн или в офисе в Москве. На базе заказчика — по согласованию; проезд и проживание отдельно.</p><button type="button" className="nb-text-button" onClick={event => course.open("price", event)}>Полный прайс на 1–20 участников</button><Action course={course}>Обсудить обучение</Action><p className="nb-document-print-note">Для печати: полная программа выбранного уровня, без меню и скрытых тем.</p></section>}</section>)}</div></div>;
}

export default function FamilyB({ course }) {
  switch (course.variant.id) {
    case 18: return <Composer course={course} />;
    case 19: return <ProjectExplorer course={course} />;
    case 20: return <ReadingModes course={course} />;
    case 21: return <FormatStudio course={course} />;
    case 22: return <PrintSyllabus course={course} />;
    default: return null;
  }
}

