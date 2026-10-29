import React, {useEffect, useRef, useState} from 'react';
import './media-gallery.css';

export const bookCovers = [1,2,3].map(volume=>({
  title:`Том ${volume}`,
  subtitle:'Рассмотреть обложку',
  src:`/assets/reference/books/volume-${volume}.jpg`,
  width:826,height:920,
  alt:`Обложка англоязычного руководства Tekla Structures, том ${volume}`,
}));

export const certificateSamples = [
  {days:2,hours:16,description:'Базовое обучение'},
  {days:5,hours:40,description:'Углублённое обучение'},
  {days:10,hours:80,description:'Обучение и пилотный проект'},
].map(item=>({
  ...item,
  title:`${item.days} ${item.days===2?'дня':'дней'}`,
  subtitle:`${item.hours} часов · Рассмотреть`,
  src:`/assets/reference/certificates/${item.days}-days.png`,
  preview:`/assets/reference/certificates/${item.days}-days.webp`,
  width:1536,height:1024,
  alt:`Образец сертификата TopEngineer: ${item.days} ${item.days===2?'дня':'дней'}, ${item.hours} часов. Демонстрационный документ.`,
}));

function ArtworkViewer({items,index,onIndex,onClose,opener}){
  const dialog=useRef(null);
  const item=items[index];
  const change=direction=>onIndex((index+direction+items.length)%items.length);
  useEffect(()=>{
    const element=dialog.current;
    const previousOverflow=document.body.style.overflow;
    const hadBodyStyle=document.body.hasAttribute('style');
    element.showModal();
    document.body.style.overflow='hidden';
    return()=>{
      if(element.open)element.close();
      document.body.style.overflow=previousOverflow;
      if(!hadBodyStyle&&!document.body.getAttribute('style'))document.body.removeAttribute('style');
      if(opener.current?.isConnected)opener.current.focus();
    };
  },[]);
  return <dialog ref={dialog} className="ref-artwork-viewer" aria-labelledby="ref-artwork-title"
    onCancel={event=>{event.preventDefault();onClose();}}
    onClick={event=>{if(event.target===event.currentTarget)onClose();}}
    onKeyDown={event=>{
      if(event.key==='ArrowLeft'){event.preventDefault();change(-1);}
      if(event.key==='ArrowRight'){event.preventDefault();change(1);}
    }}>
    <header className="ref-artwork-toolbar">
      <div><span>{index+1} / {items.length}</span><h2 id="ref-artwork-title">{item.title}{item.hours?` · ${item.hours} часов`:''}</h2></div>
      <nav aria-label="Просмотр изображений">
        <button type="button" onClick={()=>change(-1)} aria-label="Предыдущее изображение"><i className="fa fa-angle-left" aria-hidden="true"/></button>
        <button type="button" onClick={()=>change(1)} aria-label="Следующее изображение"><i className="fa fa-angle-right" aria-hidden="true"/></button>
        <button type="button" onClick={onClose} aria-label="Закрыть просмотр"><i className="fa fa-times" aria-hidden="true"/></button>
      </nav>
    </header>
    <figure className="ref-artwork-full"><img src={item.src} alt={item.alt} width={item.width} height={item.height}/><figcaption><span>{item.description||'Обложка руководства Tekla Structures'}</span><a href={item.src} target="_blank" rel="noreferrer">Открыть оригинал <i className="fa fa-external-link" aria-hidden="true"/></a></figcaption></figure>
  </dialog>;
}

export default function MediaGallery({kind,items,caption}){
  const [active,setActive]=useState(null);
  const opener=useRef(null);
  const show=(index,event)=>{opener.current=event.currentTarget;setActive(index);};
  return <figure className={`ref-media-gallery ref-${kind}-gallery`} aria-label={kind==='book'?'Три тома руководства Tekla Structures':'Образцы сертификатов TopEngineer'}>
    <div className="ref-media-deck">
      {items.map((item,index)=><button type="button" className="ref-media-item" key={item.src} style={{'--media-index':index}} onClick={event=>show(index,event)} aria-label={`Рассмотреть ${kind==='book'?'обложку':'сертификат'}: ${item.title}`}>
        <img src={item.preview||item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" decoding="async"/>
      </button>)}
    </div>
    {kind==='certificate'&&<div className="ref-media-labels">{items.map((item,index)=><button type="button" key={item.src} onClick={event=>show(index,event)} aria-label={`${item.title} — открыть изображение`}><strong>{item.title}</strong><span>{item.subtitle}</span></button>)}</div>}
    <figcaption>{caption}</figcaption>
    {active!==null&&<ArtworkViewer items={items} index={active} onIndex={setActive} onClose={()=>setActive(null)} opener={opener}/>}
  </figure>;
}
