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

const formatNames={online:'Онлайн',office:'В офисе в Москве',onsite:'На базе заказчика'};
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
export default function ReferenceCourse({variant,Review,allVariants,route,home}){
  const [selected,setSelected]=useState([1]);
  const [people,setPeople]=useState(()=>Object.fromEntries(levels.map(item=>[item.id,1])));
  const [durations,setDurations]=useState(()=>Object.fromEntries(levels.map(item=>[item.id,2])));
  const [dates,setDates]=useState(()=>Object.fromEntries(levels.map(item=>[item.id,''])));
  const [format,setFormat]=useState('online');
  const [level,setLevel]=useState(1);
  const [books,setBooks]=useState(false);
  const [bookQuantity,setBookQuantity]=useState(1);
  const [panel,setPanel]=useState(null);
  const [city,setCity]=useState('');
  const [message,setMessage]=useState('');
  const dialog=useRef(null),opener=useRef(null);
  const selection=levels.filter(item=>selected.includes(item.id));
  const summary=summarize(selection.map(item=>({...item,selected:true,format,days:durations[item.id],participants:people[item.id],startDate:dates[item.id]})),books?bookQuantity:0);
  const priceText=money(summary.totalCents);
  const hasItems=selection.length>0||books;
  const invalidDates=selection.some(item=>dates[item.id]&&!endDate(dates[item.id],durations[item.id]));
  const lineQuote=id=>quoteCourse({format,days:durations[id],participants:people[id]});
  const toggle=id=>{
    if(!selected.includes(id)){setDurations(current=>({...current,[id]:2}));setPeople(current=>({...current,[id]:1}));}
    setSelected(current=>current.includes(id)?current.filter(n=>n!==id):[...current,id].sort());
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
    selection.length?'Формат: '+formatNames[format]:'',
    ...summary.courses.map(item=>`${item.full}: ${item.participants} участн., ${item.days} ${word(item.days,['день','дня','дней'])} / ${item.hours} часов, ${money(item.totalCents)} за группу.${item.billedParticipants>item.participants?' Минимальная оплата за '+item.billedParticipants+' участников.':''} Желаемое начало: ${formatDate(item.startDate)||'по согласованию'}. Окончание: ${formatDate(endDate(item.startDate,item.days))||'по согласованию'}.`),
    books?`Электронный комплект из трёх томов на английском языке: ${bookQuantity} ${word(bookQuantity,['комплект','комплекта','комплектов'])} × ${money(bookProduct.unitPriceCents)} = ${money(summary.bookTotalCents)}.`:'',
    'Итого за выбранные позиции: '+priceText,
    selection.length&&format==='onsite'?'Проезд и проживание преподавателя согласуются и оплачиваются отдельно.':'',
    selection.length?'Город: '+(city||'уточню'):'',
    'Задачи и вопросы: '+message,
  ].filter(Boolean).join('\n');
  const mailto='mailto:info@topengineer.ru?subject='+encodeURIComponent('Обучение Tekla Structures')+'&body='+encodeURIComponent(email);
  const position=allVariants.findIndex(item=>item.id===variant.id);
  return <main className="course-site reference-course variant-23">
    <Review variant={variant}/>
    <div className="ref-content">
      <section className="ref-intro" aria-labelledby="ref-title">
        <div className="ref-intro-copy">
          <p className="ref-eyebrow">Учебный центр / Tekla Structures</p>
          <h1 id="ref-title">Индивидуальное обучение <span>Tekla Structures</span></h1>
          <p className="ref-intro-strong">Практические навыки для ваших инженерных задач.</p>
          <p>Занимайтесь с преподавателем, который работает в Tekla Structures. До начала курса обсудим вашу подготовку, рабочие задачи и удобное время.</p>
          <p>Начните с базового курса. После него курсы 2–4 можно проходить в любом порядке; последовательность по номерам — рекомендуемая. Для опытных инженеров программу можно адаптировать под рабочие задачи.</p>
          <p className="ref-hero-facts">{trainingDurations.map(({days,hours},index)=><React.Fragment key={days}>{index>0&&' · '}<span className="ref-hero-duration">{days} {word(days,['день','дня','дней'])} / {hours} часов</span></React.Fragment>)}<small>От {money(rates.totalsCents['2']['1'])} за группу — 2 дня онлайн или в нашем офисе.</small></p>
          <div className="ref-intro-actions"><Button href="#training-calculator">Рассчитать обучение</Button><Button href="#course-descriptions" secondary>Выбрать программу</Button></div>
        </div>
        <figure className="ref-hero-photo"><img src="/assets/reference/classroom.png" width="1644" height="957" alt="Преподаватель объясняет работу в Tekla Structures ученикам за компьютерами"/><figcaption>Иллюстрация формата обучения</figcaption></figure>
        <aside className="ref-at-glance" aria-labelledby="ref-facts-title"><h2 id="ref-facts-title">Коротко о курсе</h2><dl>{[
          ['Программа','Tekla Structures'],['Длительность','2, 5 или 10 дней'],['Занятия','8 часов в день'],['Курсы','4 программы: основы, компоненты, продвинутая работа, шаблоны'],['Участники','1–20 человек'],['Формат','Онлайн, в Москве или на вашей базе'],['Начало','По согласованию'],['Язык','Русский или English'],['Стоимость',<a href="#training-calculator">Рассчитать для группы <Icon name="angle-right"/></a>],
        ].map(([name,value])=><div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl></aside>
      </section>

      <section id="course-descriptions" className="ref-section ref-courses" aria-labelledby="ref-courses-title">
        <Heading eyebrow="Четыре курса Tekla Structures" title={<span id="ref-courses-title">Выберите свою программу</span>}>Базовый курс — основа для курсов 2–4. Выберите нужные направления: отмеченные программы сразу появляются в расчёте.</Heading>
        <div className="ref-course-grid">{levels.map(item=><article className={'ref-course-card '+(selected.includes(item.id)?'is-selected':'')} key={item.id} aria-labelledby={'ref-course-'+item.id}>
          <label className="ref-card-choice"><input type="checkbox" checked={selected.includes(item.id)} onChange={()=>toggle(item.id)} aria-label={'Добавить в расчёт: '+item.full}/><span>Курс 0{item.id}</span><small>{topicText(topicCount(item))}</small></label>
          <div className="ref-course-card-body"><h3 id={'ref-course-'+item.id}>{item.full}</h3><p className="ref-course-subtitle">{item.text}</p><div><h4>Для кого</h4><p>{item.experience}.</p></div><div><h4>Что изучаем</h4><ul>{item.goals.map(goal=><li key={goal}><Icon name="check"/>{goal}</li>)}</ul></div><div><h4>После курса</h4><p>{item.result}</p></div><Button secondary onClick={()=>openProgram(item.id)}>Полная программа · {topicText(topicCount(item))}</Button></div>
        </article>)}</div>
      </section>

      <section id="training-calculator" className="ref-section ref-calculator" aria-labelledby="ref-calc-title">
        <Heading eyebrow="Стоимость без догадок" title={<span id="ref-calc-title">Рассчитайте своё обучение</span>}>Для каждой программы выберите длительность и число участников. Цены — за группу, в рублях. Для онлайн-занятий и нашего офиса действует один прайс; для выезда — отдельный. Занятия — по {rates.hoursPerDay} часов в день.</Heading>
        <div className="ref-calc-toolbar">
          <label className="ref-field"><span>Где будете заниматься</span><select value={format} onChange={event=>setFormat(event.target.value)}>{Object.entries(formatNames).map(([key,value])=><option key={key} value={key}>{value}</option>)}</select></label>
          <div><button className="ref-text-button" type="button" disabled={!hasItems} onClick={()=>{setSelected([]);setBooks(false);}}>Очистить выбор</button><button className="ref-text-button" type="button" onClick={event=>open('prices',event)}><Icon name="table"/>Прайс на 1–20 участников</button></div>
        </div>
        <div className="ref-table-wrap"><table className="ref-calc-table">
          <caption className="ref-sr-only">Выбор программ, длительности и расчёт стоимости для группы в рублях</caption>
          <thead><tr><th scope="col">Выбрать</th><th scope="col">Программа</th><th scope="col">Длительность</th><th scope="col">Участники</th><th scope="col">Желаемое начало</th><th scope="col">За группу</th></tr></thead>
          <tbody>{levels.map(item=>{
            const active=selected.includes(item.id),quote=lineQuote(item.id),finish=endDate(dates[item.id],durations[item.id]),badDate=!!dates[item.id]&&!finish;
            return <tr key={item.id} className={active?'is-selected':''}>
              <td data-label="Выбрать"><label className="ref-row-choice"><input type="checkbox" checked={active} onChange={()=>toggle(item.id)} aria-label={'Выбрать: '+item.full}/><span>Курс {item.id}</span></label></td>
              <th scope="row" data-label="Программа"><strong>{item.full}</strong><button type="button" className="ref-text-button" onClick={()=>openProgram(item.id)}>Программа <Icon name="file-text-o"/></button></th>
              {active?<>
                <td data-label="Длительность"><label className="ref-sr-only" htmlFor={'ref-days-'+item.id}>Длительность: {item.full}</label><select id={'ref-days-'+item.id} value={durations[item.id]} onChange={event=>setDurations({...durations,[item.id]:Number(event.target.value)})}>{rates.days.map(value=><option key={value} value={value}>{value} {word(value,['день','дня','дней'])}</option>)}</select><span className="ref-cell-note">{quote.hours} часов</span><a className="ref-text-link ref-cell-note" href="#training-duration">О форматах</a></td>
                <td data-label="Участники"><label className="ref-sr-only" htmlFor={'ref-people-'+item.id}>Участники: {item.full}</label><select id={'ref-people-'+item.id} value={people[item.id]} onChange={event=>setPeople({...people,[item.id]:Number(event.target.value)})}>{participantOptions.map(value=><option key={value} value={value}>{value}</option>)}</select></td>
                <td data-label="Желаемое начало"><label className="ref-sr-only" htmlFor={'ref-start-'+item.id}>Дата начала: {item.full}</label><input id={'ref-start-'+item.id} type="date" min="0001-01-01" max="9999-12-31" value={dates[item.id]} aria-invalid={badDate||undefined} onInput={event=>setDates({...dates,[item.id]:event.currentTarget.value})} onChange={event=>setDates({...dates,[item.id]:event.target.value})}/><span className="ref-cell-note">{finish?'До '+formatDate(finish)+'*':badDate?'Проверьте дату':'Дата по согласованию'}</span></td>
                <td data-label="За группу"><strong className="ref-row-price">{money(quote.totalCents)}</strong>{quote.totalCents!==null?<span className="ref-cell-note">{money(quote.totalCents/quote.participants)} на человека</span>:<span className="ref-cell-note">Для этого выездного формата и размера группы тарифа в таблице нет.</span>}{quote.billedParticipants>quote.participants&&<span className="ref-cell-note ref-minimum-fee">Минимальная оплата за {quote.billedParticipants} участников. Фактически обучаются: {quote.participants}.</span>}</td>
              </>:<td className="ref-inactive-row" colSpan={4}>Отметьте программу, чтобы добавить её в расчёт</td>}
            </tr>;
          })}
          <tr className={'ref-book-row '+(books?'is-selected':'')}>
            <td><label className="ref-row-choice"><input type="checkbox" checked={books} onChange={event=>setBooks(event.target.checked)} aria-label="Добавить руководство в запрос"/><span>Книги</span></label></td>
            <td colSpan={5}><div><strong>Tekla Structures — руководство в трёх томах</strong><span>Электронный комплект на английском языке · {money(bookProduct.unitPriceCents)} за комплект</span><a href="#training-books">Подробнее о руководстве <Icon name="angle-right"/></a></div>
              <div className="ref-book-controls"><label className="ref-field"><span>Количество комплектов книг</span><select aria-label="Количество комплектов книг" value={bookQuantity} disabled={!books} onChange={event=>setBookQuantity(Number(event.target.value))}>{Array.from({length:bookProduct.maxQuantity},(_,index)=>index+1).map(value=><option key={value} value={value}>{value}</option>)}</select></label><strong>{books?money(summary.bookTotalCents):'Не добавлено'}</strong></div>
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
          <p>Онлайн и в офисе: для 5 и 10 дней минимальная оплата — за 3 участников. Для выезда опубликован тариф на группы от 5 человек; остальные случаи — по согласованию. Десятидневный курс стоит вдвое больше пятидневного. Цены курсов суммируются без скидки за пакет.</p>
          <p>* Окончание считается по календарным дням, включая выходные и день начала. Фактический график подтверждает преподаватель. При выезде проезд и проживание оплачиваются отдельно.</p>
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
            <dl><div><dt>Комплект</dt><dd>3 электронных тома</dd></div><div><dt>Язык</dt><dd>Английский</dd></div><div><dt>Стоимость</dt><dd>{money(bookProduct.unitPriceCents)} за комплект</dd></div></dl>
            <p>Добавьте электронный комплект к обучению или приобретите книги отдельно. Количество комплектов можно выбрать в калькуляторе.</p>
            <div className="ref-inline-actions"><Button onClick={()=>{setBooks(true);scrollTo('training-calculator');}}>{books?'Руководство добавлено в запрос':'Добавить руководство в запрос'}</Button><a className="ref-text-link" href="https://dev.topengineer.ru/education-centr/books/" target="_blank" rel="noreferrer">Другие издания <Icon name="angle-right"/></a></div>
          </div>
        </div>
      </section>

      <section className="ref-section ref-duration" id="training-duration" aria-labelledby="ref-duration-title">
        <Heading eyebrow="Время на обучение и практику" title={<span id="ref-duration-title">Выберите длительность обучения</span>}>Практика помогает внедрить Tekla Structures в работу компании. Выберите, сколько времени отвести занятиям и работе над своим проектом.</Heading>
        <div className="ref-duration-grid">{trainingDurations.map(item=><article className={'ref-duration-card '+(item.popular?'is-popular':'')} key={item.days} aria-labelledby={`ref-duration-${item.days}`}>
          <header><h3 id={`ref-duration-${item.days}`}>{item.days} {item.days===2?'дня':'дней'}</h3><p>{item.hours} часов</p></header>
          {item.popular&&<span className="ref-duration-popular">Популярный формат</span>}
          <h4 className="ref-duration-title">{item.title}</h4>
          {item.split&&<p className="ref-duration-split">{item.split}</p>}
          {item.paragraphs.map(text=><p key={text}>{text}</p>)}
          {item.popularity&&<p className="ref-duration-popularity">{item.popularity}</p>}
        </article>)}</div>
        <div className="ref-duration-footnote"><p>Выберите длительность каждой программы в калькуляторе. Прайс указан в рублях; для выездного обучения действуют отдельные ставки.</p><a className="ref-text-link" href="#training-calculator">Вернуться к расчёту <Icon name="arrow-up"/></a></div>
      </section>

      <section className="ref-section ref-formats" id="training-formats">
        <Heading eyebrow="Выберите удобный способ" title="Где будем заниматься">Программа зависит от вашей подготовки, формат — от организации работы.</Heading>
        <div className="ref-format-grid">{[
          ['online','laptop','Онлайн','Из вашего города','Занятия через интернет. Преподаватель демонстрирует инструменты, вы повторяете действия на своём компьютере.','По исходному прайсу на 1–20 участников'],
          ['office','building-o','В Москве','В учебном классе','На базе Topengineer каждому слушателю предоставляется отдельное рабочее место.','Варшавское ш., 1с1-2, W-Plaza, офис В-410'],
          ['onsite','users','На вашей базе','Для вашей команды','Преподаватель проводит обучение по месту расположения группы. Условия выезда обсуждаем заранее.','Курс — по прайсу · проезд и проживание отдельно'],
        ].map(([value,icon,title,sub,text,note])=><article className={format===value?'is-selected':''} key={value}><Icon name={icon}/><h3>{title}</h3><p className="ref-format-subtitle">{sub}</p><p>{text}</p><small>{note}</small><button type="button" className="ref-text-button" aria-pressed={format===value} onClick={()=>setFormat(value)}>{format===value?<><Icon name="check-circle"/>Формат выбран</>:<>Выбрать формат<Icon name="angle-right"/></>}</button></article>)}</div><a href="#training-calculator" className="ref-text-link">Вернуться к расчёту <Icon name="arrow-up"/></a>
      </section>

      <section className="ref-section ref-preparation" id="before-training">
        <Heading eyebrow="До первого занятия" title="Подготовьтесь к обучению">Организационные вопросы лучше решить заранее, чтобы на занятиях заниматься практикой.</Heading>
        <div className="ref-prepare-grid">{[
          ['01','Программа и подготовка','Сообщите свой опыт работы в Tekla и задачи, которые хотите разобрать. Согласуйте необходимые темы с преподавателем.'],
          ['02','Компьютер и рабочее место','Для онлайн-занятий подготовьте компьютер с Tekla Structures, связь и звук. Необходимую версию и дополнительные инструменты обсудите заранее.'],
          ['03','Даты и организация','Укажите город, удобную дату начала и способ оплаты. Для группы согласуйте место проведения и доступ к рабочим файлам.'],
        ].map(([n,title,text])=><article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        <div className="ref-support"><div><p className="ref-eyebrow">После курса</p><h3>Поддержка в дальнейшей работе</h3><p>Технические вопросы можно обсудить на специализированном форуме. Помощь во внедрении Tekla на предприятии оформляется отдельным соглашением.</p></div><a className="ref-text-link" href="https://topengineer.ru/forum" target="_blank" rel="noreferrer">Перейти на форум <Icon name="angle-right"/></a></div>
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
      <div className="ref-full-program"><ReferenceProgram level={level} setLevel={setLevel}/></div>
    </div>
    <nav className="ref-variant-nav" aria-label="Другие варианты дизайна"><a href={route(allVariants[(position+allVariants.length-1)%allVariants.length])}>Предыдущий вариант</a><a href={home+'#designs'}>Все {allVariants.length} варианта</a><a href={route(allVariants[(position+1)%allVariants.length])}>Следующий вариант</a></nav>
    {panel&&<dialog ref={dialog} className="ref-dialog" aria-labelledby="ref-dialog-title" onCancel={event=>{event.preventDefault();setPanel(null);}} onClick={event=>{if(event.target===event.currentTarget)setPanel(null);}}>
      <header><div><p className="ref-eyebrow">Учебный центр Topengineer</p><h2 id="ref-dialog-title">{panel==='prices'?'Прайс на обучение':'Обсудим ваш выбор'}</h2></div><button type="button" className="ref-close" onClick={()=>setPanel(null)} aria-label="Закрыть окно"><Icon name="times"/></button></header>
      <div className="ref-dialog-body">{panel==='prices'?<PriceTable format={format}/>:<>
        <p>Проверьте выбранные позиции и оставьте вопросы. Кнопка ниже подготовит письмо — отправку вы подтвердите в своём почтовом приложении.</p>
        {selection.length>0&&<ul className="ref-request-list">{summary.courses.map(item=><li key={item.id}>
          <strong>{item.full}</strong><span>{item.days} {word(item.days,['день','дня','дней'])} · {item.hours} часов · {item.participants} {word(item.participants,['участник','участника','участников'])} · {money(item.totalCents)} за группу</span>
          <span>Начало: {formatDate(item.startDate)||'по согласованию'}. Окончание: {formatDate(endDate(item.startDate,item.days))||'по согласованию'}.</span>
          {item.billedParticipants>item.participants&&<small>Минимальная оплата за {item.billedParticipants} участников.</small>}
        </li>)}</ul>}
        {books&&<p className="ref-request-books"><Icon name="book"/>Электронный комплект из трёх томов на английском языке: {bookQuantity} {word(bookQuantity,['комплект','комплекта','комплектов'])} × {money(bookProduct.unitPriceCents)} = <strong>{money(summary.bookTotalCents)}</strong>.</p>}
        <div className="ref-request-total"><span>{selection.length?formatNames[format]:'Электронные книги'}</span><strong>{priceText}</strong></div>
        {selection.length>0&&format==='onsite'&&<p className="ref-price-note">Проезд и проживание преподавателя согласуются и оплачиваются отдельно.</p>}
        {selection.length>0&&<label className="ref-field"><span>Ваш город</span><input value={city} onChange={event=>setCity(event.target.value)} placeholder="Например, Москва"/></label>}
        <label className="ref-field"><span>Задачи и вопросы</span><textarea rows={4} value={message} onChange={event=>setMessage(event.target.value)} placeholder="Что хотите изучить или уточнить?"/></label>
        {invalidDates?<p className="ref-calculator-error">Проверьте даты начала в калькуляторе.</p>:hasItems?<Button href={mailto}>Подготовить письмо</Button>:<p>Сначала выберите курс или комплект книг в калькуляторе.</p>}
        <p className="ref-dialog-contact"><a href="tel:+74952150779">+7 (495) 215-07-79</a><a href="mailto:info@topengineer.ru">info@topengineer.ru</a></p>
      </>}</div>
    </dialog>}
  </main>;
}
