import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const qa=path.resolve('qa/2026-10-27');
const checks=JSON.parse(await fs.readFile(path.join(qa,'responsive-final.json'),'utf8'));
const source=JSON.parse(await fs.readFile(path.join(qa,'source-sections.json'),'utf8'));
const desktop=checks.find(c=>c.name==='desktop');
let sourceImage=path.join(qa,'reference-desktop-full.png');
let targetImage=path.join(qa,'23-desktop-full.png');
const normalized=new Map();
// Explicit clips include overscan to retain the entire page when scrollbars hide.
for(const item of [{file:sourceImage,height:source.docHeight},...checks.map(c=>({file:path.join(qa,`23-${c.name}-full.png`),height:c.docHeight}))]){
 const meta=await sharp(item.file).metadata();
 if(item.height&&meta.height>item.height){
  const trimmed=await sharp(item.file).extract({left:0,top:0,width:meta.width,height:Math.ceil(item.height)}).png().toBuffer();
  const output=item.file.replace(/\.png$/,'-normalized.png');
  await fs.writeFile(output,trimmed);
  normalized.set(item.file,output);
 }
}
sourceImage=normalized.get(sourceImage)||sourceImage;
targetImage=normalized.get(targetImage)||targetImage;
const sourceMeta=await sharp(sourceImage).metadata(),targetMeta=await sharp(targetImage).metadata();
async function crop(file,y,height){
 const meta=await sharp(file).metadata();
 return sharp(file).extract({left:0,top:Math.max(0,Math.round(y)),width:meta.width,height:Math.max(1,Math.min(Math.floor(height),meta.height-Math.round(y)))}).png().toBuffer();
}
async function pair(left,right,name,width=1440){
 const a=await sharp(left).resize({width}).png().toBuffer(),b=await sharp(right).resize({width}).png().toBuffer();
 const ma=await sharp(a).metadata(),mb=await sharp(b).metadata();
 await sharp({create:{width:width*2,height:Math.max(ma.height,mb.height),channels:3,background:'#ecf0f4'}}).composite([{input:a,top:0,left:0},{input:b,top:0,left:width}]).jpeg({quality:92}).toFile(path.join(qa,name));
}
const sourceEnd=source.sections.find(s=>s.id==='course-programmes');
const sourceBody=await crop(sourceImage,130,sourceEnd.top+sourceEnd.height-130);
const actualBody=await crop(targetImage,desktop.body.y,desktop.body.height);
await fs.writeFile(path.join(qa,'23-body.png'),actualBody);
await pair(sourceBody,actualBody,'23-full-comparison.jpg',900);
const sourceFirst=source.sections.find(s=>s.id==='course-descriptions');
await pair(await crop(sourceImage,130,sourceFirst.top-130),await crop(targetImage,desktop.sections[0].y,desktop.sections[0].height),'23-hero-comparison.jpg');
for(const [id,name] of [['training-calculator','calculator'],['training-books','books'],['course-programmes','program']]){
 const s=source.sections.find(x=>x.id===id),t=desktop.sections.find(x=>x.id===(id==='course-programmes'?'ref-full-program':id));
 await pair(await crop(sourceImage,s.top,Math.min(s.height,1300)),await crop(targetImage,t.y,Math.min(t.height,1300)),`23-${name}-comparison.jpg`);
 await fs.writeFile(path.join(qa,`23-${name}-desktop.png`),await crop(targetImage,t.y,Math.min(t.height,1500)));
}
for(const name of ['desktop','wide','mobile','small-mobile']){
 const row=checks.find(c=>c.name===name), file=path.join(qa,`23-${name}-full.png`);
 await fs.writeFile(path.join(qa,`23-${name}-hero.png`),await crop(file,0,row.height));
 if(name==='mobile'){
  const calc=row.sections.find(s=>s.id==='training-calculator');
  await fs.writeFile(path.join(qa,'23-calculator-mobile.png'),await crop(file,calc.y,calc.height));
  const program=row.sections.find(s=>s.id==='ref-full-program');
  await fs.writeFile(path.join(qa,'23-program-mobile.png'),await crop(file,program.y,Math.min(program.height,2000)));
 }
}
await pair(await crop(path.join(qa,'reference-mobile-full.png'),130,1600),await crop(path.join(qa,'23-mobile-full.png'),checks.find(c=>c.name==='mobile').body.y,1600),'23-mobile-comparison.jpg',390);
await fs.writeFile(path.join(qa,'comparison-metadata.json'),JSON.stringify({source:sourceMeta,target:targetMeta,normalizedDesktopWidth:1440,fullComparisonWidthPerColumn:900,sourceBodyTop:130,targetBodyTop:desktop.body.y},null,2));
console.log('Full, focused and mobile comparisons updated.');
