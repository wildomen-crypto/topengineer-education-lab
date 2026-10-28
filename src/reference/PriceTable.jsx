import React,{useRef,useState} from 'react';
import {rates,participantOptions,quoteCourse,money} from './pricing.js';
import {word} from './courses.js';

export default function PriceTable({format='online'}){
  const [mode,setMode]=useState(format==='onsite'?'onsite':'online');
  const [days,setDays]=useState(format==='onsite'?5:2),tabs=useRef(null);
  return <>
    <p>Цена одного курса за всю группу, в рублях. Для всех четырёх программ действует один прайс. Занятия — по {rates.hoursPerDay} часов в день.</p>
    <label className="ref-field"><span>Условия в прайсе</span><select value={mode} onChange={event=>{setMode(event.target.value);if(event.target.value==='onsite'&&days===2)setDays(5);}}><option value="online">Онлайн или наш офис</option><option value="onsite">С выездом к заказчику</option></select></label>
    <div className="ref-price-tabs" ref={tabs} role="tablist" aria-label="Длительность в прайсе">{rates.days.map((value,index)=><button type="button" role="tab" key={value} id={`ref-price-tab-${value}`} aria-controls="ref-price-panel" aria-selected={days===value} tabIndex={days===value?0:-1} onClick={()=>setDays(value)} onKeyDown={event=>{
      const next=event.key==='ArrowRight'?(index+1)%rates.days.length:event.key==='ArrowLeft'?(index+rates.days.length-1)%rates.days.length:event.key==='Home'?0:event.key==='End'?rates.days.length-1:null;
      if(next!==null){event.preventDefault();setDays(rates.days[next]);tabs.current.querySelector(`#ref-price-tab-${rates.days[next]}`).focus();}
    }}>{value} {word(value,['день','дня','дней'])} · {value*rates.hoursPerDay} часов</button>)}</div>
    <div id="ref-price-panel" role="tabpanel" aria-labelledby={`ref-price-tab-${days}`} tabIndex={0}>
      <div className="ref-price-scroll"><table className="ref-price-table"><caption>{mode==='onsite'?'С выездом':'Онлайн или наш офис'} · {days} {word(days,['день','дня','дней'])} · {days*rates.hoursPerDay} часов · ₽</caption><thead><tr><th scope="col" aria-label="Участников в группе">Чел.</th><th scope="col">На человека</th><th scope="col">За всю группу</th></tr></thead><tbody>{participantOptions.map(participants=>{const quote=quoteCourse({days,participants,format:mode});return <tr key={participants}><th scope="row">{participants}{quote.billedParticipants>participants&&<small className="ref-cell-note">Оплата за {quote.billedParticipants}</small>}</th><td>{quote.totalCents===null?'—':money(quote.totalCents/participants)}</td><td><strong>{quote.totalCents===null?'По запросу':money(quote.totalCents)}</strong></td></tr>;})}</tbody></table></div>
    </div>
    <p className="ref-price-note">{mode==='onsite'?'Для выезда на 5 дней приведены ставки для групп от 5 человек. Двухдневный выезд и группы до 5 человек — по согласованию. Десятидневный выезд стоит вдвое больше пятидневного.':'Онлайн и в офисе: для 5 и 10 дней минимальная оплата — за 3 участников, даже если обучаются один или двое. Десятидневный курс стоит вдвое больше пятидневного для той же оплачиваемой группы.'}</p>
    <p>Стоимость выбранных курсов суммируется без скидки за пакет. Электронный комплект книг оплачивается отдельно и добавляется в общий итог.</p>
  </>;
}
