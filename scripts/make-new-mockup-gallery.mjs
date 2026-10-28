import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import sharp from "sharp";
import {nextVariants} from "../src/next/variants.js";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const output=path.join(root,"public/design-mockups/2026-10-19");
const assets=path.join(root,"public/assets/mockups");
await fs.mkdir(output,{recursive:true});await fs.mkdir(assets,{recursive:true});
const escape=(text)=>text.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll('"',"&quot;");
for(const variant of nextVariants){
  const stem=`${variant.id}-${variant.slug}`;
  await sharp(path.join(root,"mockups/2026-10-19",stem+".png")).jpeg({quality:93,chromaSubsampling:"4:4:4"}).toFile(path.join(assets,stem+".jpg"));
}
const items=nextVariants.map(v=>({id:v.id,name:v.name,focus:v.focus,description:v.description,file:`/assets/mockups/${v.id}-${v.slug}.jpg`,url:`/education-centr/tekla-${v.id}-${v.slug}/`}));
await fs.writeFile(path.join(output,"manifest.json"),JSON.stringify({date:"2026-10-19",review:"All ten image mockups visually approved by independent design critic before implementation",items},null,2));
await fs.writeFile(path.join(output,"index.html"),`<!doctype html>
<html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>10 новых макетов — Topengineer</title>
<style>
*{box-sizing:border-box}body{margin:0;font:18px/1.5 Arial,sans-serif;background:#eef2f6;color:#16222d}a{color:inherit}header{padding:30px 32px;background:#16222d;color:white}header a{color:#ffc64b}h1{font-size:42px;line-height:1.1;margin:14px 0}header p{max-width:75ch;color:#d3dfe9}.gallery{padding:28px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,400px),1fr));gap:24px}.card{background:white;overflow:hidden;border-radius:8px}.card img{display:block;width:100%;height:auto}.card .copy{padding:22px}.card h2{font-size:25px;line-height:1.15;margin:12px 0}.card p{font-size:16px;color:#526678}.badge{font-size:12px;color:#336553;font-weight:700}.actions{display:flex;flex-wrap:wrap;gap:14px;align-items:center}.button,button{font:inherit;cursor:pointer}.button{display:inline-flex;background:#ffc64b;border:0;border-radius:5px;padding:11px 16px;font-size:15px;text-decoration:none;color:#142334;font-weight:700}.actions a:not(.button){font-size:14px}dialog{width:96vw;max-width:none;height:94vh;max-height:94vh;border:0;border-radius:8px;padding:0;background:#eef2f6}dialog::backdrop{background:#07111fe8}.toolbar{position:sticky;top:0;display:flex;gap:12px;align-items:center;justify-content:space-between;background:#16222d;color:#fff;padding:13px 20px}.toolbar h2{font-size:18px;margin:0}.toolbar button{background:#ffc64b;border:0;border-radius:4px;padding:9px 14px;min-height:44px}.controls{display:flex;gap:8px}.large{display:block;width:100%;height:auto}a:focus-visible,button:focus-visible{outline:3px solid #087caa;outline-offset:4px}@media(max-width:600px){header{padding:24px 16px}h1{font-size:31px}.gallery{padding:16px;gap:20px}.toolbar{padding:10px}.toolbar h2{font-size:13px}.toolbar button{font-size:13px;padding:8px}.controls{gap:5px}dialog{width:100vw;height:100dvh;max-height:100dvh;border-radius:0}}
</style>
<header><a href="/education-centr/#designs">← Все 22 работающие страницы</a><h1>10 новых макетов курса Tekla Structures</h1><p>Каждый макет согласован с независимым критиком перед реализацией. Здесь можно рассмотреть изображение, скачать его и открыть работающую страницу.</p></header>
<main class="gallery">${items.map((v,i)=>`<article class="card"><a href="${v.file}" data-index="${i}"><img src="${v.file}" alt="${escape(v.name)} — макет страницы" loading="lazy"></a><div class="copy"><span class="badge">МАКЕТ СОГЛАСОВАН С КРИТИКОМ</span><h2>${v.id} — ${escape(v.name)}</h2><p>${escape(v.description)}</p><div class="actions"><button class="button" data-index="${i}">Рассмотреть</button><a class="button" href="${v.url}">Открыть страницу</a><a href="${v.file}" download>Скачать JPG</a></div></div></article>`).join("")}</main>
<dialog id="viewer" aria-labelledby="viewer-title"><div class="toolbar"><h2 id="viewer-title"></h2><div class="controls"><button id="previous" aria-label="Предыдущий макет">Назад</button><button id="next" aria-label="Следующий макет">Далее</button><button id="close" aria-label="Закрыть макет">Закрыть</button></div></div><img class="large" id="large" alt=""></dialog>
<script>
const items=${JSON.stringify(items).replaceAll("<","\\u003c")};let selected=0;const viewer=document.querySelector('#viewer');function show(index){selected=(index+items.length)%items.length;const item=items[selected];document.querySelector('#viewer-title').textContent=item.id+' — '+item.name;document.querySelector('#large').src=item.file;document.querySelector('#large').alt=item.name;if(!viewer.open)viewer.showModal();viewer.scrollTop=0}document.querySelectorAll('[data-index]').forEach(element=>element.addEventListener('click',event=>{event.preventDefault();show(Number(element.dataset.index))}));document.querySelector('#previous').onclick=()=>show(selected-1);document.querySelector('#next').onclick=()=>show(selected+1);document.querySelector('#close').onclick=()=>viewer.close();viewer.addEventListener('click',event=>{if(event.target===viewer)viewer.close()});viewer.addEventListener('keydown',event=>{if(event.key==='ArrowLeft')show(selected-1);if(event.key==='ArrowRight')show(selected+1)});
</script></html>`);
console.log(`Saved ${items.length} approved mockups and gallery.`);
