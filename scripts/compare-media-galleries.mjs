import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const qa=path.resolve('qa/2026-10-27-stacks');
const source=JSON.parse(await fs.readFile(path.join(qa,'source-geometry.json'),'utf8'));
const actual=JSON.parse(await fs.readFile(path.join(qa,'final-geometry.json'),'utf8'));
async function crop(file,section){
 const meta=await sharp(file).metadata();
 return sharp(file).extract({left:0,top:Math.round(section.y),width:meta.width,height:Math.floor(section.height)}).png().toBuffer();
}
for(const row of actual){
 for(const section of row.sections){
  const name=section.id==='training-books'?'books':'certificates';
  const result=await crop(path.join(qa,`23-${row.width}-full.png`),section);
  await fs.writeFile(path.join(qa,`23-${row.width}-${name}.png`),result);
  const original=source.find(r=>r.width===row.width)?.sections.find(s=>s.id===section.id);
  if(!original)continue;
  const sourceCrop=await crop(path.join(qa,`source-${row.width}-full.png`),original);
  await fs.writeFile(path.join(qa,`source-${row.width}-${name}.png`),sourceCrop);
  const width=Math.min(1440,row.width);
  const a=await sharp(sourceCrop).resize({width}).png().toBuffer();
  const b=await sharp(result).resize({width}).png().toBuffer();
  const ma=await sharp(a).metadata(),mb=await sharp(b).metadata();
  await sharp({create:{width:width*2,height:Math.max(ma.height,mb.height),channels:3,background:'#ecf0f4'}}).composite([{input:a,left:0,top:0},{input:b,left:width,top:0}]).jpeg({quality:92}).toFile(path.join(qa,`${row.width}-${name}-comparison.jpg`));
 }
}
const chosen=[{width:1440,name:'books'},{width:1440,name:'certificates'},{width:768,name:'books'},{width:390,name:'certificates'}];
const tiles=[];
for(let i=0;i<chosen.length;i++){
 const item=chosen[i];
 const tile=await sharp(path.join(qa,`23-${item.width}-${item.name}.png`)).resize({width:700,height:620,fit:'contain',background:'#ecf0f4'}).png().toBuffer();
 tiles.push({input:tile,left:i%2*700,top:Math.floor(i/2)*620});
}
await sharp({create:{width:1400,height:1240,channels:3,background:'#ecf0f4'}}).composite(tiles).jpeg({quality:92}).toFile(path.join(qa,'responsive-galleries.jpg'));
console.log('Source/implementation comparisons and responsive contact sheet saved.');
