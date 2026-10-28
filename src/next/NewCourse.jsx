import React, {useEffect, useMemo, useRef, useState} from "react";
import sourcePrograms from "../data/programs.json";
import FamilyA from "./FamilyA.jsx";
import FamilyB from "./FamilyB.jsx";
import "./next-common.css";

const money = (value) => new Intl.NumberFormat("ru-RU").format(value) + " ₽";
function Icon({name}) { return <i className={"fa fa-" + name} aria-hidden="true" />; }
const formats = {online:"Онлайн",office:"В Москве",onsite:"На базе заказчика"};

// Preserve the original numbering, including groups that continue on the next day.
function enrichPrograms(levels) {
  return levels.map((meta) => {
    const source = sourcePrograms.find((entry) => entry.id === meta.id);
    const days = source.days.map((topics, index) => {
      const groups = new Map();
      topics.forEach((topic) => {
        const number = Number(topic.split(".")[0]);
        if (!groups.has(number)) groups.set(number, []);
        groups.get(number).push(topic);
      });
      return [...groups].map(([number, entries]) => ({
        id:`d${index+1}-m${number}`, number, day:index+1,
        title:meta.modules[number-1], topics:entries,
      }));
    });
    return {id:meta.id,name:meta.full,short:["Базовый","С опытом","Профессиональный"][meta.id-1],
      experience:meta.experience,text:meta.text,result:meta.result,
      count:source.days.flat().length,topics:source.days.flat(),days,modules:days.flat()};
  });
}

function PrintDocument({program, prices, format, people}) {
  return <article className="nc-print-document" aria-hidden="true">
    <p>Учебный центр Topengineer · +7 (495) 215-07-79 · info@topengineer.ru</p>
    <h1>Программа индивидуального обучения Tekla Structures</h1>
    <p><strong>{program.name}</strong> · 2 дня · 16 часов · {program.count} тем</p>
    <p>{program.experience}. {program.result}</p>
    {program.days.map((modules,index) => <section key={index}>
      <h2>День {index+1}</h2>
      {modules.map((module) => <div key={module.id}><h3>{module.title}</h3>
        <ul>{module.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
      </div>)}
    </section>)}
    <section><h2>Стоимость и условия</h2>
      <p>Выбранный формат: {formats[format]}. Участников: {people > 20 ? "больше 20" : people}.</p>
      <p>Цены за всю группу за 2 дня / 16 часов, онлайн или в офисе в Москве. Цена не зависит от уровня. На базе заказчика и для групп свыше 20 человек — по согласованию. Транспорт и проживание оплачиваются отдельно.</p>
      <table><thead><tr><th>Участников</th><th>За группу</th><th>На человека</th></tr></thead>
        <tbody>{prices.map((price) => <tr key={price.people}><td>{price.people}</td><td>{money(price.total)}</td><td>{money(price.perPerson)}</td></tr>)}</tbody>
      </table>
      <p>Темы, последовательность, даты и время согласуются с преподавателем. Полные условия: topengineer.ru/education-centr/ts/single</p>
    </section>
  </article>;
}

export default function NewCourse({variant, levels, prices, components, allVariants, route, home}) {
  const [level,setLevel] = useState(1);
  const [people,setPeople] = useState([13,16,21].includes(variant.id) ? 5 : 1);
  const [format,setFormat] = useState(variant.id === 21 ? "office" : "online");
  const [panel,setPanel] = useState(null);
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const programs = useMemo(() => enrichPrograms(levels), [levels]);
  const program = programs[level-1];
  const price = format !== "onsite" && people <= 20 ? prices.find((p) => p.people === Number(people)) : null;
  const {Program,Enroll,Pricing,Logistics,Support,FAQ,Review} = components;
  const selection = {people,setPeople,format,setFormat};

  const open = (name,event,selectedLevel) => {
    event?.preventDefault();
    if (event?.currentTarget) openerRef.current = event.currentTarget;
    if (selectedLevel) setLevel(Number(selectedLevel));
    setPanel(name);
  };
  useEffect(() => {
    const handler = (event) => {openerRef.current=event.detail?.opener;setPanel("enroll");};
    window.addEventListener("tekla-intensive-enroll",handler);
    const hash = location.hash.slice(1);
    if (["program","enroll","conditions","price"].includes(hash)) setPanel(hash);
    return () => window.removeEventListener("tekla-intensive-enroll",handler);
  }, []);
  useEffect(() => {
    if (!panel) return;
    const dialog = dialogRef.current;
    dialog.showModal();dialog.scrollTop=0;
    const overflow = document.body.style.overflow;
    document.body.style.overflow="hidden";
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow=overflow;
      if (openerRef.current?.isConnected) openerRef.current.focus();
    };
  }, [panel]);

  const course = {variant,level,setLevel,people,setPeople,format,setFormat,program,programs,prices,price,formats,open,money,Icon,
    assets:{classroom:"/assets/team-class/practice.jpg",instructor:"/assets/intensive/instructor.jpg",group:"/assets/intensive/demonstration.jpg",model:"/assets/next/project-model.jpg",modelOverview:"/assets/next/project-model.jpg"},
    print:() => window.print()};
  const position = allVariants.findIndex((entry) => entry.id === variant.id);
  const count = allVariants.length;
  const countText = count + " " + (count % 100 >= 11 && count % 100 <= 14 ? "вариантов" : count % 10 >= 2 && count % 10 <= 4 ? "варианта" : count % 10 === 1 ? "вариант" : "вариантов");

  return <main className={"course-site next-course nc-"+variant.slug+" variant-"+variant.id}>
    <Review variant={variant} />
    <div className="next-body">{variant.id <= 17 ? <FamilyA course={course} /> : <FamilyB course={course} />}</div>
    <nav className="nc-variant-nav" aria-label="Другие варианты дизайна">
      <a href={route(allVariants[(position+allVariants.length-1)%allVariants.length])}>Предыдущий вариант</a>
      <a href={home+"#designs"}>Все {countText}</a>
      <a href={route(allVariants[(position+1)%allVariants.length])}>Следующий вариант</a>
    </nav>
    <div className="nc-source">Содержание: <a href="https://topengineer.ru/education-centr/ts/single" target="_blank" rel="noreferrer">исходная программа</a> · <a href="https://docs.google.com/spreadsheets/d/1OXJCYJOVf4lFeD9aB64Fyh17PpONTn-8G2UBpMU-D5Y/edit?gid=0#gid=0" target="_blank" rel="noreferrer">исходный прайс</a></div>
    {panel && <dialog ref={dialogRef} className="nc-dialog" aria-labelledby="nc-panel-title"
      onCancel={(event) => {event.preventDefault();setPanel(null);}}
      onClick={(event) => {
        if (event.target === event.currentTarget) setPanel(null);
        const link=event.target.closest("a[href='#program'],a[href='#enroll'],a[href='#price']");
        if(link){event.preventDefault();setPanel(link.getAttribute("href").slice(1));}
      }}>
      <div className="nc-dialog-toolbar"><h2 id="nc-panel-title">{{program:"Полная программа",enroll:"Обсудить обучение",conditions:"Организация обучения",price:"Стоимость обучения"}[panel]}</h2>
        <button onClick={() => setPanel(null)} aria-label="Закрыть окно">Закрыть <Icon name="times" /></button>
      </div>
      {panel === "program" ? <Program level={level} setLevel={setLevel} />
        : panel === "enroll" ? <Enroll courseLevel={level} setCourseLevel={setLevel} priceSelection={selection} />
          : panel === "price" ? <Pricing selection={selection} /> : <><Logistics /><Support /><FAQ /></>}
      <div className="nc-dialog-actions">
        {panel !== "program" && <button onClick={() => setPanel("program")}>Полная программа <Icon name="list" /></button>}
        {panel !== "price" && <button onClick={() => setPanel("price")}>Стоимость <Icon name="calculator" /></button>}
        {panel !== "conditions" && <button onClick={() => setPanel("conditions")}>Условия <Icon name="info-circle" /></button>}
        {panel !== "enroll" && <button className="nc-primary" onClick={() => setPanel("enroll")}>Обсудить обучение <Icon name="arrow-right" /></button>}
      </div>
    </dialog>}
    <PrintDocument program={program} prices={prices} format={format} people={people} />
  </main>;
}
