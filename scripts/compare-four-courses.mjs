import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const qa=path.resolve('qa/2026-10-27-four-courses');
const rows=JSON.parse(await fs.readFile(path.join(qa,'capture-geometry.json'),'utf8'));
for(const row of rows){
 const file=path.join(qa,`23-${row.width}-full.png`);
 for(const section of row.sections){
  const height=section.id==='program'?Math.min(1200,section.height):section.height;
  await sharp(file).extract({left:0,top:Math.round(section.y),width:row.width,height:Math.floor(height)}).png().toFile(path.join(qa,`23-${row.width}-${section.id}.png`));
 }
 const r=row.fourthCard;
 await sharp(file).extract({left:Math.floor(r.x),top:Math.round(r.y),width:Math.floor(r.width),height:Math.floor(r.height)}).png().toFile(path.join(qa,`23-${row.width}-fourth-card.png`));
}
const source=JSON.parse(await fs.readFile(path.join(qa,'source-geometry.json'),'utf8'));
await sharp(path.join(qa,'source-full.png')).extract({left:0,top:Math.round(source.y),width:source.width,height:Math.floor(source.height)}).png().toFile(path.join(qa,'source-courses.png'));
const inputs=await Promise.all(['source-courses.png','23-2560-course-descriptions.png'].map(async name=>sharp(path.join(qa,name)).resize({width:1280}).png().toBuffer()));
const sizes=await Promise.all(inputs.map(input=>sharp(input).metadata()));
await sharp({create:{width:2560,height:Math.max(...sizes.map(s=>s.height)),channels:3,background:'#ecf0f4'}}).composite(inputs.map((input,index)=>({input,left:index*1280,top:0}))).jpeg({quality:92}).toFile(path.join(qa,'four-courses-comparison.jpg'));
console.log('Focused section captures and source comparison saved.');
