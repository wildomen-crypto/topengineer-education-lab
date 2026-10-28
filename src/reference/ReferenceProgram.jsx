import React, {useEffect,useRef,useState} from 'react';
import {courses,topicCount,topicText} from './courses.js';

export default function ReferenceProgram({level,setLevel}){
  const [query,setQuery]=useState('');
  const [expanded,setExpanded]=useState(true);
  const [revision,setRevision]=useState(0);
  const tabs=useRef(null);
  const selected=courses.find(course=>course.id===level)||courses[0];
  useEffect(()=>{setQuery('');setExpanded(true);setRevision(value=>value+1);},[level]);
  const choose=id=>{setLevel(id);setQuery('');};
  const parts=selected.parts.map(part=>({...part,groups:part.groups.map(group=>({...group,topics:group.topics.filter(topic=>(topic.number+' '+topic.title).toLocaleLowerCase('ru').includes(query.trim().toLocaleLowerCase('ru')))})).filter(group=>group.topics.length)}));
  const results=parts.reduce((sum,part)=>sum+part.groups.reduce((count,group)=>count+group.topics.length,0),0);
  return <section id="program" className="course-section program-section" aria-labelledby="ref-program-title">
    <div className="course-container">
    <header className="section-heading"><p className="eyebrow">Программы четырёх курсов</p><h2 id="ref-program-title">От основ к вашим рабочим задачам</h2><p>Начните с базового курса. Курсы 2–4 после него можно проходить в любом порядке; последовательность по номерам — рекомендуемая.</p></header>
    <div ref={tabs} className="program-levels" role="tablist" aria-label="Программа курса">{courses.map((course,index)=><button type="button" role="tab" key={course.id} id={`ref-level-tab-${course.id}`} aria-selected={selected.id===course.id} aria-controls="ref-program-panel" tabIndex={selected.id===course.id?0:-1} className={selected.id===course.id?'active':''} onClick={()=>choose(course.id)} onKeyDown={event=>{
      const next=event.key==='ArrowRight'?(index+1)%courses.length:event.key==='ArrowLeft'?(index+courses.length-1)%courses.length:event.key==='Home'?0:event.key==='End'?courses.length-1:null;
      if(next!==null){event.preventDefault();choose(courses[next].id);tabs.current.querySelector(`#ref-level-tab-${courses[next].id}`).focus();}
    }}>0{course.id} · {course.full}</button>)}</div>
    <div id="ref-program-panel" role="tabpanel" aria-labelledby={`ref-level-tab-${selected.id}`} tabIndex={0}>
      <div className="program-intro"><div><h3>{selected.full}</h3><p>{selected.experience}. {selected.result}</p></div><span>2 части · {topicText(topicCount(selected))}</span></div>
      <div className="program-tools"><label>Найти тему<input type="search" placeholder="Например: чертежи, компоненты, шаблоны" value={query} onChange={event=>setQuery(event.target.value)}/></label><button type="button" className="text-link" onClick={()=>{setExpanded(value=>!value);setRevision(value=>value+1);}}>{expanded?'Свернуть темы':'Раскрыть все темы'}</button></div>
      {query&&<p className="fine-print" role="status">Найдено: {topicText(results)}</p>}
      {!results?<p className="empty-result" role="status">Тем с таким названием не найдено. Попробуйте другой запрос.</p>:<div className="program-days" key={`${level}-${revision}`}>
        {parts.map((part,index)=><div className="program-day" key={part.title}><div className="day-heading"><span>0{index+1}</span><div><h3>Часть {index===0?'первая':'вторая'}</h3><p>{part.title}</p></div><small>{topicText(part.groups.reduce((sum,group)=>sum+group.topics.length,0))}</small></div>
          {part.groups.map((group,groupIndex)=><details key={group.title} open={expanded||!!query}><summary><span>{String(groupIndex+1).padStart(2,'0')}</span><strong>{group.title}</strong><small>{topicText(group.topics.length)}</small><i className="pbmit-base-icon-down-open-big" aria-hidden="true"/></summary>{group.note&&<p className="ref-program-note">{group.note}</p>}<ul className="topic-list">{group.topics.map(topic=><li key={topic.number}><span className="ref-topic-number">{topic.number}</span><span>{topic.title}</span></li>)}</ul></details>)}
        </div>)}
      </div>}
      <p className="fine-print">Программа разделена на две части. Расписание, последовательность тем и время на практику согласуются с преподавателем.</p>
    </div>
    </div>
  </section>;
}
