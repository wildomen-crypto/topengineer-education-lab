import React, {useEffect, useRef, useState} from 'react';
import './reference-course.css';
import MediaGallery, {bookCovers,certificateSamples} from './MediaGallery.jsx';
import ReferenceProgram from './ReferenceProgram.jsx';
import {courses as levels,topicCount,topicText,word} from './courses.js';
import './programmes.css';
import {trainingDurations} from './durations.js';
import './duration.css';
import {rates,bookProduct,participantOptions,quoteCourse,summarize,money,endDate,formatDate} from './pricing.js';
import PriceTable from './PriceTable.jsx';
import './pricing.css';
import './site-width.css';
import './calculator-compact.css';
import './course-interactions.css';
import './support.css';
import './photo-hero.css';

const formatNames={online:'Онлайн',office:'В офисе в Москве',onsite:'На базе заказчика'};
const listChoices=values=>new Intl.ListFormat('ru-RU',{type:'disjunction'}).format(values.map(String));
const otherBookLanguages=new Intl.ListFormat('ru-RU').format(bookProduct.availableLanguages.filter(language=>language!==bookProduct.language).map(language=>language.toLowerCase()));
const bookLanguageSummary=`${bookProduct.language} (основной). Также доступны ${otherBookLanguages}.${bookProduct.otherLanguagesOnRequest?' Другие языки — по запросу.':''}`;
const introParagraphs=[
  'Занимайтесь с преподавателем, который работает в Tekla Structures. До начала курса обсудим вашу подготовку, рабочие задачи и удобное время.',
  'Начните с базового курса. После него курсы 2–4 можно проходить в любом порядке; последовательность по номерам — рекомендуемая. Для опытных инженеров программу можно адаптировать под рабочие задачи.',
];
const steps=[
  ['Согласуйте задачи и связь','До начала занятий обсудите подготовку, рабочие задачи, программу и удобный способ подключения.'],
  ['Посмотрите, как работает инструмент','Преподаватель показывает последовательность действий в Tekla Structures и объясняет, как применять её в работе.'],
  ['Повторите на своей модели','Выполните показанные действия самостоятельно. Для онлайн-занятий удобно использовать два монитора.'],
  ['Разберите вопросы на практике','Задавайте вопросы по теме и обсуждайте результат. Содержание и последовательность можно согласовать под ваши задачи.'],
];

function Icon({name}){return <i className={'fa fa-'+name} aria-hidden="true"/>;}
function Button({children,secondary=false,onClick,href,className='',...props}){
  const Tag=href?'a':'button';
  return <Tag {...(href?{href}:{type:'button'})} className={`ref-button ${secondary?'ref-secondary':''} ${className}`} onClick={onClick} {...props}><span>{children}</span><span className="ref-button-icon"><Icon name="arrow-right"/></span></Tag>;
}
function Heading({eyebrow,title,children}){return <header className="ref-heading"><p className="ref-eyebrow">{eyebrow}</p><h2>{title}</h2>{children&&<p>{children}</p>}</header>;}
export default function ReferenceCourse({photoHero=false}){
  const [selected,setSelected]=useState([1]);
  const [people,setPeople]=useState(()=>Object.fromEntries(levels.map(item=>[item.id,1])));
  const [durations,setDurations]=useState(()=>Object.fromEntries(levels.map(item=>[item.id,2])));
  const [dates,setDates]=useState(()=>Object.fromEntries(levels.map(item=>[item.id,''])));
  const [formats,setFormats]=useState(()=>Object.fromEntries(levels.map(item=>[item.id,'online'])));
  const [level,setLevel]=useState(1);
  const [books,setBooks]=useState(false);
  const [bookQuantity,setBookQuantity]=useState(1);
  const [panel,setPanel]=useState(null);
  const [city,setCity]=useState('');
  const [message,setMessage]=useState('');
  const dialog=useRef(null),opener=useRef(null);
  const selection=levels.filter(item=>selected.includes(item.id));
  const summary=summarize(selection.map(item=>({...item,selected:true,format:formats[item.id],days:durations[item.id],participants:people[item.id],startDate:dates[item.id]})),books?bookQuantity:0);
  const priceText=money(summary.totalCents);
  const hasItems=selection.length>0||books;
  const invalidDates=selection.some(item=>dates[item.id]&&!endDate(dates[item.id],durations[item.id]));
  const hasOnsiteCourse=summary.courses.some(item=>item.format==='onsite');
  const lineQuote=id=>quoteCourse({format:formats[id],days:durations[id],participants:people[id]});
  const toggle=id=>{
    if(!selected.includes(id)){setDurations(current=>({...current,[id]:2}));setPeople(current=>({...current,[id]:1}));}
    setSelected(current=>current.includes(id)?current.filter(n=>n!==id):[...current,id].sort());
  };
  const selectFromCard=(event,id)=>{
    // Keep the native checkbox and programme button independent, and allow text selection.
    if(event.target.closest('a,button,input,label,select,textarea,summary')||window.getSelection()?.toString().trim())return;
    event.currentTarget.querySelector('input[type="checkbox"]')?.focus({preventScroll:true});
    toggle(id);
  };
  const scrollTo=id=>document.getElementById(id)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  const open=(name,event)=>{opener.current=event?.currentTarget;setPanel(name);};
  const openProgram=id=>{setLevel(id);requestAnimationFrame(()=>scrollTo('program'));};
  useEffect(()=>{
    const order=event=>{opener.current=event.detail?.opener;setPanel('quote');};
    window.addEventListener('tekla-intensive-enroll',order);
    if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());
    return()=>window.removeEventListener('tekla-intensive-enroll',order);
  },[]);
  useEffect(()=>{
    if(!panel)return;
    const element=dialog.current;const oldOverflow=document.body.style.overflow;
    element.showModal();document.body.style.overflow='hidden';
    return()=>{if(element.open)element.close();document.body.style.overflow=oldOverflow;if(opener.current?.isConnected)opener.current.focus();};
  },[panel]);
  const email=[
    selection.length?'Здравствуйте! Хочу обсудить обучение Tekla Structures.':'Здравствуйте! Хочу приобрести электронный комплект книг Tekla Structures.',
    ...summary.courses.map(item=>`${item.full}: ${formatNames[item.format]}, ${item.participants} участн., ${item.days} ${word(item.days,['день','дня','дней'])} / ${item.hours} часов, ${money(item.totalCents)} за группу.${item.billedParticipants>item.participants?' Единая стоимость для группы от 1 до '+item.billedParticipants+' человек.':''} Желаемое начало: ${formatDate(item.startDate)||'по согласованию'}. Окончание: ${formatDate(endDate(item.startDate,item.days))||'по согласованию'}.`),
    books?`Электронный комплект из трёх томов: ${bookQuantity} ${word(bookQuantity,['комплект','комплекта','комплектов'])} × ${money(bookProduct.unitPriceCents)} = ${money(summary.bookTotalCents)}. Языки: ${bookLanguageSummary}`:'',
    'Итого за выбранные позиции: '+priceText,
    hasOnsiteCourse?'Для выездных курсов проезд и проживание преподавателя согласуются и оплачиваются отдельно.':'',
    selection.length?'Город: '+(city||'уточню'):'',
    'Задачи и вопросы: '+message,
  ].filter(Boolean).join('\n');
  const mailto='mailto:info@topengineer.ru?subject='+encodeURIComponent('Обучение Tekla Structures')+'&body='+encodeURIComponent(email);
  return <main className={'course-site reference-course variant-23'+(photoHero?' ref-photo-course':'')}>
    <div className="ref-content">
      <section className="ref-intro" aria-labelledby="ref-title">
        {photoHero&&<figure className="ref-photo-background"><img src="/assets/intensive/hero.jpg" width="1853" height="849" fetchPriority="high" alt="Преподаватель показывает инженерную модель Tekla Structures группе за компьютерами"/><figcaption>Иллюстрация формата обучения</figcaption></figure>}
        <div className="ref-intro-copy">
          <p className="ref-eyebrow">Учебный центр / Tekla Structures</p>
          <h1 id="ref-title">{photoHero?'Индивидуальный курс обучения':'Индивидуальное обучение'} <span>Tekla Structures</span></h1>
          <p className="ref-intro-strong">Практические навыки для ваших инженерных задач.</p>
          {!photoHero&&introParagraphs.map(text=><p key={text}>{text}</p>)}
          <p className="ref-hero-facts">{trainingDurations.map(({days,hours},index)=><React.Fragment key={days}>{index>0&&' · '}<span className="ref-hero-duration">{days} {word(days,['день','дня','дней'])} / {hours} часов</span></React.Fragment>)}<small>От {money(rates.totalsCents['2']['1'])} за группу — 2 дня онлайн или в нашем офисе.</small></p>
          <div className="ref-intro-actions"><Button href="#training-calculator">Рассчитать обучение</Button><Button href="#course-descriptions" secondary>Выбрать программу</Button></div>
          {photoHero&&<details className="ref-photo-details"><summary>Подробнее об обучении</summary>{introParagraphs.map(text=><p key={text}>{text}</p>)}</details>}
        </div>
        {!photoHero&&<figure className="ref-hero-photo"><img src="/assets/reference/classroom.png" width="1644" height="957" alt="Преподаватель объясняет работу в Tekla Structures ученикам за компьютерами"/><figcaption>Иллюстрация формата обучения</figcaption></figure>}
        <aside className="ref-at-glance" aria-labelledby="ref-facts-title"><h2 id="ref-facts-title">Коротко о курсе</h2><dl>{[
          ['Программа','Tekla Structures'],
          ['Версия Tekla','Любая версия'],
          ['Дней на курс',`${listChoices(trainingDurations.map(item=>item.days))} дней`],
          ['Часов в день',`${rates.hoursPerDay} часов`],
          ['Всего часов',`${listChoices(trainingDurations.map(item=>item.hours))} часов на курс`],
          ['Курсы',<a href="#course-descriptions">4 программы <Icon name="angle-right"/></a>],
          ['Формат',<>Онлайн, в Москве или на вашей базе.<small>Онлайн: Zoom, Google Meet или аналог.</small></>],
          ['Начало','Любая удобная дата — по согласованию'],
          ['Участники','1–20 человек'],
          ['Подготовка','Курс 1 — без опыта; курсы 2–4 — знания базового курса'],
          ['Языки','Русский, английский и испанский'],
          ['Оплата','Банковский перевод по счёту (по согласованию)'],
          ['Стоимость',<a href="#training-calculator">Рассчитать для группы <Icon name="angle-right"/></a>],
        ].map(([name,value])=><div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl></aside>
      </section>

      <section id="course-descriptions" className="ref-section ref-courses" aria-labelledby="ref-courses-title">
        <Heading eyebrow="Четыре курса Tekla Structures" title={<span id="ref-courses-title">Выберите свою программу</span>}>Базовый курс — основа для курсов 2–4. Нажмите на карточку, чтобы добавить курс в расчёт или убрать его. Полную программу можно открыть отдельной кнопкой.</Heading>
        <div className="ref-course-grid">{levels.map(item=><article className={'ref-course-card '+(selected.includes(item.id)?'is-selected':'')} key={item.id} aria-labelledby={'ref-course-'+item.id} onClick={event=>selectFromCard(event,item.id)}>
          <label className="ref-card-choice"><input type="checkbox" checked={selected.includes(item.id)} onChange={()=>toggle(item.id)} aria-label={'Добавить в расчёт: '+item.full}/><span>Курс 0{item.id}</span><small>{topicText(topicCount(item))}</small></label>
          <div className="ref-course-card-body"><h3 id={'ref-course-'+item.id}>{item.full}</h3><p className="ref-course-subtitle">{item.text}</p><div><h4>Для кого</h4><p>{item.experience}.</p></div><div><h4>Что изучаем</h4><ul>{item.goals.map(goal=><li key={goal}><Icon name="check"/>{goal}</li>)}</ul></div><div><h4>После курса</h4><p>{item.result}</p></div><Button secondary onClick={()=>openProgram(item.id)}>Полная программа · {topicText(topicCount(item))}</Button></div>
        </article>)}</div>
      </section>

      <section id="training-calculator" className="ref-section ref-calculator" aria-labelledby="ref-calc-title">
        <Heading eyebrow="Стоимость без догадок" title={<span id="ref-calc-title">Рассчитайте своё обучение</span>}>Для каждого курса выберите место, длительность и число участников. Стоимость — за всю группу, в рублях.</Heading>
        <div className="ref-calc-toolbar">
          <div><button className="ref-text-button" type="button" disabled={!hasItems} onClick={()=>{setSelected([]);setBooks(false);}}>Очистить выбор</button><button className="ref-text-button" type="button" onClick={event=>open('prices',event)}><Icon name="table"/>Прайс на 1–20 участников</button></div>
        </div>
        <div className="ref-table-wrap"><table className="ref-calc-table">
          <caption className="ref-sr-only">Выбор программ, длительности и расчёт стоимости для группы в рублях</caption>
          <thead><tr><th scope="col">Выбрать</th><th scope="col">Программа</th><th scope="col">Где будете заниматься</th><th scope="col">Длительность</th><th scope="col">Участники</th><th scope="col">Желаемое начало</th><th scope="col">За группу</th></tr></thead>
          <tbody>{levels.map(item=>{
            const active=selected.includes(item.id),quote=lineQuote(item.id),finish=endDate(dates[item.id],durations[item.id]),badDate=!!dates[item.id]&&!finish;
            return <tr key={item.id} className={active?'is-selected':''}>
              <td data-label="Выбрать"><label className="ref-row-choice"><input type="checkbox" checked={active} onChange={()=>toggle(item.id)} aria-label={'Выбрать: '+item.full}/><span>Курс {item.id}</span></label></td>
              <th scope="row" data-label="Программа"><strong>{item.full}</strong><button type="button" className="ref-text-button" onClick={()=>openProgram(item.id)}>Программа <Icon name="file-text-o"/></button></th>
              {active?<>
                <td className="ref-course-format" data-label="Где будете заниматься"><label className="ref-sr-only" htmlFor={'ref-format-'+item.id}>Где будете заниматься: {item.full}</label><select id={'ref-format-'+item.id} value={formats[item.id]} onChange={event=>setFormats(current=>({...current,[item.id]:event.target.value}))}>{Object.entries(formatNames).map(([key,value])=><option key={key} value={key}>{value}</option>)}</select></td>
                <td data-label="Длительность"><label className="ref-sr-only" htmlFor={'ref-days-'+item.id}>Длительность: {item.full}</label><select id={'ref-days-'+item.id} value={durations[item.id]} onChange={event=>setDurations({...durations,[item.id]:Number(event.target.value)})}>{rates.days.map(value=><option key={value} value={value}>{value} {word(value,['день','дня','дней'])}</option>)}</select><div className="ref-duration-meta"><span>{quote.hours} часов</span><a className="ref-text-link" href="#training-duration">О форматах</a></div></td>
                <td data-label="Участники"><label className="ref-sr-only" htmlFor={'ref-people-'+item.id}>Участники: {item.full}</label><select id={'ref-people-'+item.id} value={people[item.id]} onChange={event=>setPeople({...people,[item.id]:Number(event.target.value)})}>{participantOptions.map(value=><option key={value} value={value}>{value}</option>)}</select></td>
                <td className="ref-course-date" data-label="Желаемое начало"><label className="ref-sr-only" htmlFor={'ref-start-'+item.id}>Дата начала: {item.full}</label><input id={'ref-start-'+item.id} type="date" min="0001-01-01" max="9999-12-31" value={dates[item.id]} aria-invalid={badDate||undefined} onInput={event=>setDates({...dates,[item.id]:event.currentTarget.value})} onChange={event=>setDates({...dates,[item.id]:event.target.value})}/><span className="ref-cell-note">{finish?'До '+formatDate(finish)+'*':badDate?'Проверьте дату':'Дата по согласованию'}</span></td>
                <td className="ref-course-price" data-label="За группу"><strong className="ref-row-price">{money(quote.totalCents)}</strong>{quote.totalCents!==null?<span className="ref-cell-note">{money(quote.totalCents/quote.participants)} на человека</span>:<span className="ref-cell-note">Тариф согласуем отдельно.</span>}{quote.billedParticipants>quote.participants&&<span className="ref-cell-note ref-minimum-fee">Единый тариф для 1–{quote.billedParticipants} человек.</span>}</td>
              </>:<td className="ref-inactive-row" colSpan={5}>Не выбран</td>}
            </tr>;
          })}
          <tr className={'ref-book-row '+(books?'is-selected':'')}>
            <td><label className="ref-row-choice"><input type="checkbox" checked={books} onChange={event=>setBooks(event.target.checked)} aria-label="Добавить руководство в запрос"/><span>Книги</span></label></td>
            <td colSpan={6}><div className="ref-book-line"><div className="ref-book-info"><strong>Tekla Structures — руководство в трёх томах</strong><span>Электронный комплект · основной язык — {bookProduct.language.toLowerCase()} · {money(bookProduct.unitPriceCents)} за комплект</span>{' '}<a href="#training-books">Подробнее <Icon name="angle-right"/></a></div>
              {books&&<div className="ref-book-controls"><label className="ref-field"><span>Комплектов</span><select aria-label="Количество комплектов книг" value={bookQuantity} onChange={event=>setBookQuantity(Number(event.target.value))}>{Array.from({length:bookProduct.maxQuantity},(_,index)=>index+1).map(value=><option key={value} value={value}>{value}</option>)}</select></label><strong>{money(summary.bookTotalCents)}</strong></div>}</div>
            </td>
          </tr></tbody>
        </table></div>
        <div className="ref-total" aria-live="polite" aria-atomic="true">
          <div><span>Итого за выбранные позиции</span><strong>{priceText}</strong>
            <p>{summary.courseCount?summary.courseCount+' '+word(summary.courseCount,['программа','программы','программ'])+' · '+summary.days+' '+word(summary.days,['день','дня','дней'])+' · '+summary.hours+' '+word(summary.hours,['час','часа','часов']):books?'Только электронные книги':'Выберите курс или комплект книг'}</p>
            {books&&<small>{bookQuantity} {word(bookQuantity,['комплект книг','комплекта книг','комплектов книг'])} × {money(bookProduct.unitPriceCents)} = {money(summary.bookTotalCents)}. Включено в итог.</small>}
            {summary.unpricedCount>0&&<small>Есть позиции без тарифа. Известная часть стоимости: {money(summary.knownSubtotalCents)}. Общую сумму согласуем отдельно.</small>}
          </div>
          <Button disabled={!hasItems||invalidDates} onClick={event=>open('quote',event)}>{selection.length?'Обсудить выбранный курс':'Обсудить заказ книг'}</Button>
        </div>
        <div className="ref-calculator-notes">
          <p className="ref-calc-rule">На 5 и 10 дней стоимость группы от 1 до 5 человек одинакова.</p>
          <details className="ref-calc-conditions"><summary>Условия расчёта и календарных дат</summary><p>Для онлайн-занятий и нашего офиса действует один прайс; для выезда — отдельный. Занятия — по {rates.hoursPerDay} часов в день. Начиная с 6 участников цена меняется по прайсу. Десятидневный курс стоит вдвое больше пятидневного. Двухдневный выезд — по согласованию. Цены курсов суммируются без скидки за пакет.</p><p>* Окончание считается по календарным дням, включая выходные и день начала. Фактический график подтверждает преподаватель. При выезде проезд и проживание оплачиваются отдельно.</p></details>
          {invalidDates&&<p role="alert" className="ref-calculator-error">Проверьте дату начала: курс должен закончиться не позже 31.12.9999.</p>}
        </div>
      </section>

      <section id="how-training-works" className="ref-section ref-how">
        <Heading eyebrow="Показ → практика → вопросы" title="Как проходит обучение">Разбираем инструменты вместе с преподавателем и применяем их на модели.</Heading>
        <div className="ref-how-grid"><figure><img src="/assets/reference/online-lesson.webp" width="1536" height="1024" loading="lazy" alt="Онлайн-обучение Tekla Structures с двумя мониторами: показ преподавателя и самостоятельная работа"/><figcaption>Иллюстрация онлайн-занятия</figcaption></figure><ol className="ref-steps">{steps.map(([title,text],index)=><li key={title}><span>0{index+1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol></div>
      </section>

      <section id="training-books" className="ref-section ref-books">
        <Heading eyebrow="Материалы для самостоятельной работы" title="Руководство Tekla Structures">Практический справочник во время обучения и после него.</Heading>
        <div className="ref-books-grid ref-overlap-layout">
          <MediaGallery kind="book" items={bookCovers} caption="Обложки англоязычного издания · Нажмите для просмотра"/>
          <div className="ref-books-copy">
            <h3>Три тома для начинающих и опытных пользователей</h3><p>Пошаговые объяснения, иллюстрации и практические примеры помогут повторить изученное и продолжить работу самостоятельно.</p>
            <ul><li>Моделирование стальных и бетонных конструкций, включая армирование.</li><li>Компоненты и практические примеры инженерных задач.</li><li>Материал для повторения после занятий.</li></ul>
            <dl><div><dt>Комплект</dt><dd>3 электронных тома</dd></div><div><dt>Языки</dt><dd>{bookLanguageSummary}</dd></div><div><dt>Стоимость</dt><dd>{money(bookProduct.unitPriceCents)} за комплект</dd></div></dl>
            <p>Добавьте электронный комплект к обучению или приобретите книги отдельно. Количество комплектов можно выбрать в калькуляторе.</p>
            <div className="ref-inline-actions"><Button onClick={()=>{setBooks(true);scrollTo('training-calculator');}}>{books?'Руководство добавлено в запрос':'Добавить руководство в запрос'}</Button><a className="ref-text-link" href="https://dev.topengineer.ru/education-centr/books/" target="_blank" rel="noreferrer">Другие издания <Icon name="angle-right"/></a></div>
          </div>
        </div>
      </section>

      <section className="ref-section ref-duration" id="training-duration" aria-labelledby="ref-duration-title">
        <Heading eyebrow="Время на обучение и практику" title={<span id="ref-duration-title">Выберите длительность обучения</span>}>Практика помогает внедрить Tekla Structures в работу компании. Выберите, сколько времени отвести занятиям и работе над своим проектом.</Heading>
        <div className="ref-duration-grid">{trainingDurations.map(item=><article className={'ref-duration-card '+(item.popular?'is-popular':'')} key={item.days} aria-labelledby={`ref-duration-${item.days}`}>
          <header><h3 id={`ref-duration-${item.days}`}>{item.days} {item.days===2?'дня':'дней'}</h3><div className="ref-duration-hours"><p>{item.hours} часов</p>{item.popular&&<span className="ref-duration-popular">Популярный формат</span>}</div></header>
          <h4 className="ref-duration-title">{item.title}</h4>
          <p className="ref-duration-plan">{item.split||item.plan}</p>
          <p>{item.overview}</p>
        </article>)}</div>
        <p className="ref-duration-popularity">{trainingDurations.find(item=>item.popular)?.popularity}</p>
        <details className="ref-duration-details"><summary>Подробнее о форматах на 2, 5 и 10 дней</summary><div className="ref-duration-details-grid">{trainingDurations.map(item=><article key={item.days}><h3>{item.days} {word(item.days,['день','дня','дней'])} · {item.hours} часов</h3>{item.split&&<p className="ref-duration-detail-split">{item.split}</p>}{item.paragraphs.map(text=><p key={text}>{text}</p>)}</article>)}</div></details>
        <div className="ref-duration-footnote"><p>Выберите длительность каждой программы в калькуляторе. Прайс указан в рублях; для выездного обучения действуют отдельные ставки.</p><a className="ref-text-link" href="#training-calculator">Вернуться к расчёту <Icon name="arrow-up"/></a></div>
      </section>

      <section className="ref-section ref-formats" id="training-formats">
        <Heading eyebrow="Выберите удобный способ" title="Где будем заниматься">Программа зависит от вашей подготовки, формат — от организации работы. Место занятий выбирается для каждого курса в калькуляторе.</Heading>
        <div className="ref-format-grid">{[
          ['online','laptop','Онлайн','Из вашего города','Занятия через интернет. Преподаватель демонстрирует инструменты, вы повторяете действия на своём компьютере.','По исходному прайсу на 1–20 участников'],
          ['office','building-o','В Москве','В учебном классе','На базе Topengineer каждому слушателю предоставляется отдельное рабочее место.','Варшавское ш., 1с1-2, W-Plaza, офис В-410'],
          ['onsite','users','На вашей базе','Для вашей команды','Преподаватель проводит обучение по месту расположения группы. Условия выезда обсуждаем заранее.','Курс — по прайсу · проезд и проживание отдельно'],
        ].map(([value,icon,title,sub,text,note])=><article key={value}><Icon name={icon}/><h3>{title}</h3><p className="ref-format-subtitle">{sub}</p><p>{text}</p><small>{note}</small><a className="ref-text-button" href="#training-calculator">Выбрать для курса<Icon name="angle-right"/></a></article>)}</div><a href="#training-calculator" className="ref-text-link">Вернуться к расчёту <Icon name="arrow-up"/></a>
      </section>

      <section className="ref-section ref-preparation" id="before-training">
        <Heading eyebrow="До первого занятия" title="Подготовьтесь к обучению">Организационные вопросы лучше решить заранее, чтобы на занятиях заниматься практикой.</Heading>
        <div className="ref-prepare-grid">{[
          ['01','Программа и подготовка','Сообщите свой опыт работы в Tekla и задачи, которые хотите разобрать. Согласуйте необходимые темы с преподавателем.'],
          ['02','Компьютер и рабочее место','Для онлайн-занятий подготовьте компьютер с Tekla Structures, связь и звук. Необходимую версию и дополнительные инструменты обсудите заранее.'],
          ['03','Даты и организация','Укажите город, удобную дату начала и способ оплаты. Для группы согласуйте место проведения и доступ к рабочим файлам.'],
        ].map(([n,title,text])=><article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="ref-section ref-certificates" id="course-certificate" aria-labelledby="ref-certificate-title">
        <Heading eyebrow="Подтверждение пройденного обучения" title={<span id="ref-certificate-title">Ваш сертификат</span>}>Именной электронный документ с названием курса и уникальным номером.</Heading>
        <div className="ref-certificate-layout">
          <MediaGallery kind="certificate" items={certificateSamples} caption="Образцы оформления сертификатов. Выберите изображение или подпись, чтобы открыть крупно."/>
          <div className="ref-certificate-copy">
            <p>После завершения обучения участник получает именной сертификат TopEngineer. В документе указываются пройденный курс, продолжительность занятий и имя слушателя.</p>
            <ul className="ref-certificate-types">{certificateSamples.map(item=><li key={item.days}><h3>{item.title} · {item.hours} часов</h3><p>{item.description}</p></li>)}</ul>
            <p>На изображениях показаны образцы для разной продолжительности обучения. Электронную версию можно сохранить или распечатать самостоятельно.</p>
          </div>
        </div>
      </section>
      <section className="ref-section ref-after-support" id="after-training-support" aria-labelledby="ref-support-title">
        <Heading eyebrow="Когда курс завершён" title={<span id="ref-support-title">Поддержка после обучения</span>}>Поможем применить новые навыки на практике.</Heading>
        <p className="ref-after-support-intro">После курса у вас остаются прямые контакты преподавателя. Вы можете задавать дополнительные вопросы в Telegram, WhatsApp или через другой согласованный канал связи.</p>
        <div className="ref-support-options">
          <article className="ref-support-option"><Icon name="comments-o"/><div><h3>Короткие вопросы — бесплатно</h3><p>Если на вопрос можно ответить без существенных затрат времени, преподаватель поможет бесплатно.</p></div></article>
          <article className="ref-support-option"><Icon name="clock-o"/><div><h3>Сложные задачи — с почасовой оплатой</h3><p>Если требуется непосредственное участие преподавателя и значительное рабочее время, можно заказать платную техническую поддержку. Задачу и почасовую ставку согласуем с вами до начала работ.</p></div></article>
        </div>
        <div className="ref-support-resources"><p>Технические вопросы также можно обсудить на специализированном форуме. Помощь во внедрении Tekla на предприятии оформляется отдельным соглашением.</p><a className="ref-text-link" href="https://topengineer.ru/forum" target="_blank" rel="noreferrer">Перейти на форум <Icon name="angle-right"/></a></div>
      </section>
      <div className="ref-full-program"><ReferenceProgram level={level} setLevel={setLevel}/></div>
    </div>
    {panel&&<dialog ref={dialog} className="ref-dialog" aria-labelledby="ref-dialog-title" onCancel={event=>{event.preventDefault();setPanel(null);}} onClick={event=>{if(event.target===event.currentTarget)setPanel(null);}}>
      <header><div><p className="ref-eyebrow">Учебный центр Topengineer</p><h2 id="ref-dialog-title">{panel==='prices'?'Прайс на обучение':'Обсудим ваш выбор'}</h2></div><button type="button" className="ref-close" onClick={()=>setPanel(null)} aria-label="Закрыть окно"><Icon name="times"/></button></header>
      <div className="ref-dialog-body">{panel==='prices'?<PriceTable format={summary.courses[0]?.format}/>:<>
        <p>Проверьте выбранные позиции и оставьте вопросы. Кнопка ниже подготовит письмо — отправку вы подтвердите в своём почтовом приложении.</p>
        {selection.length>0&&<ul className="ref-request-list">{summary.courses.map(item=><li key={item.id}>
          <strong>{item.full}</strong><span>{formatNames[item.format]} · {item.days} {word(item.days,['день','дня','дней'])} · {item.hours} часов · {item.participants} {word(item.participants,['участник','участника','участников'])} · {money(item.totalCents)} за группу</span>
          <span>Начало: {formatDate(item.startDate)||'по согласованию'}. Окончание: {formatDate(endDate(item.startDate,item.days))||'по согласованию'}.</span>
          {item.billedParticipants>item.participants&&<small>Единая стоимость для группы от 1 до {item.billedParticipants} человек.</small>}
        </li>)}</ul>}
        {books&&<p className="ref-request-books"><Icon name="book"/>Электронный комплект из трёх томов: {bookQuantity} {word(bookQuantity,['комплект','комплекта','комплектов'])} × {money(bookProduct.unitPriceCents)} = <strong>{money(summary.bookTotalCents)}</strong>. Языки: {bookLanguageSummary}</p>}
        <div className="ref-request-total"><span>Итого за выбранные позиции</span><strong>{priceText}</strong></div>
        {hasOnsiteCourse&&<p className="ref-price-note">Для выездных курсов проезд и проживание преподавателя согласуются и оплачиваются отдельно.</p>}
        {selection.length>0&&<label className="ref-field"><span>Ваш город</span><input value={city} onChange={event=>setCity(event.target.value)} placeholder="Например, Москва"/></label>}
        <label className="ref-field"><span>Задачи и вопросы</span><textarea rows={4} value={message} onChange={event=>setMessage(event.target.value)} placeholder="Что хотите изучить или уточнить?"/></label>
        {invalidDates?<p className="ref-calculator-error">Проверьте даты начала в калькуляторе.</p>:hasItems?<Button href={mailto}>Подготовить письмо</Button>:<p>Сначала выберите курс или комплект книг в калькуляторе.</p>}
        <p className="ref-dialog-contact"><a href="tel:+74952150779">+7 (495) 215-07-79</a><a href="mailto:info@topengineer.ru">info@topengineer.ru</a></p>
      </>}</div>
    </dialog>}
  </main>;
}
