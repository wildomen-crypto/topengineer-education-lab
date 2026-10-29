import React from 'react';
import {createRoot} from 'react-dom/client';
import ReferenceCourse from '../reference/ReferenceCourse.jsx';
import baseCss from '../styles.css?raw';
import wideCss from '../full-width.css?raw';
import embedCss from './test-body.css?raw';
import themeCss from 'virtual:te-training-theme';

const fontAliases={Roboto:'TE Training Roboto',Archivo:'TE Training Archivo',FontAwesome:'TE Training FontAwesome','pbminfotech-base-icons':'te-training-base-icons',pbmit_induyst:'te-training-induyst'};
const scopedFonts=css=>Object.entries(fontAliases).reduce((text,[name,alias])=>text.replaceAll(name,alias),css);

function registerFonts(css){
  for(const match of css.matchAll(/@font-face\s*\{([^}]+)\}/gi)){
    const declaration=match[1];
    const value=property=>[...declaration.matchAll(new RegExp('(?:^|;)\\s*'+property+'\\s*:\\s*([^;]+)','gi'))].at(-1)?.[1].trim();
    const family=value('font-family')?.replace(/^['"]|['"]$/g,'');
    const source=value('src');
    if(!family||!source||!Object.values(fontAliases).includes(family))continue;
    const descriptors={};
    for(const [property,key] of [['font-weight','weight'],['font-style','style'],['unicode-range','unicodeRange']]){
      if(value(property))descriptors[key]=value(property);
    }
    try { document.fonts.add(new FontFace(family,source,descriptors)); } catch { /* Existing site fonts remain usable as fallbacks. */ }
  }
}

async function mount(){
  const host=document.querySelector('te-training-test[data-te-training]');
  if(!host||host.shadowRoot)return;
  const response=await fetch(new URL(/* @vite-ignore */ './tekla-body.css',import.meta.url));
  if(!response.ok)throw new Error('Course stylesheet is unavailable');
  const css=scopedFonts([themeCss,baseCss,wideCss,await response.text(),embedCss].join('\n'));
  registerFonts(css);
  const shadow=host.attachShadow({mode:'open'});
  const style=document.createElement('style');
  style.textContent=css;
  const target=document.createElement('div');
  shadow.append(style,target);
  shadow.addEventListener('click',event=>{
    const link=event.target.closest?.('a[href^="#"]');
    if(!link)return;
    const id=link.getAttribute('href').slice(1);
    const section=shadow.getElementById(id);
    if(!section)return;
    event.preventDefault();
    section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    history.replaceState(null,'',location.pathname+location.search+'#te-training-'+id);
  });
  createRoot(target).render(<ReferenceCourse photoHero embedded/>);
  host.dataset.teReady='true';
}

mount().catch(()=>{
  const host=document.querySelector('te-training-test[data-te-training]');
  if(host)host.textContent='Не удалось загрузить страницу обучения. Обновите страницу или свяжитесь с нами.';
});
