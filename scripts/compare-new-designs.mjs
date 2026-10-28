import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {nextVariants} from '../src/next/variants.js';
const root=process.cwd(), qa=path.join(root,'qa/2026-10-19');
const checks=JSON.parse(await fs.readFile(path.join(qa,'new-wide-final-checks.json'),'utf8'));
const tiles=[];
for(const variant of nextVariants){
 const check=checks.find(c=>c.id===variant.id), width=check.client;
 const actual=await sharp(path.join(qa,`${variant.id}-full.png`)).extract({left:0,top:Math.round(check.body.y),width,height:Math.floor(check.body.height)}).png().toBuffer();
 await fs.writeFile(path.join(qa,`${variant.id}-body.png`),actual);
 const target=await sharp(path.join(root,`mockups/2026-10-19/${variant.id}-${variant.slug}.png`)).resize({width}).png().toBuffer();
 const targetMeta=await sharp(target).metadata(), actualMeta=await sharp(actual).metadata();
 const height=Math.max(targetMeta.height,actualMeta.height);
 await sharp({create:{width:width*2,height,channels:3,background:'#e9edf0'}}).composite([{input:target,left:0,top:0},{input:actual,left:width,top:0}]).jpeg({quality:90}).toFile(path.join(qa,`${variant.id}-comparison.jpg`));
 const tile=await sharp(path.join(qa,`${variant.id}-wide-final.png`)).resize({width:640}).jpeg({quality:88}).toBuffer();
 tiles.push({input:tile,left:(tiles.length%2)*640,top:Math.floor(tiles.length/2)*363});
}
await sharp({create:{width:1280,height:1815,channels:3,background:'#d6dfe6'}}).composite(tiles).jpeg({quality:90}).toFile(path.join(qa,'new-wide-contact-final.jpg'));
for(const id of [13,18,21]){
 const comparison=path.join(qa,`${id}-comparison.jpg`), meta=await sharp(comparison).metadata();
 const focus=await sharp(comparison).extract({left:0,top:0,width:meta.width,height:Math.min(900,meta.height)}).jpeg({quality:93}).toBuffer();
 await fs.writeFile(path.join(qa,`${id}-focused-comparison.jpg`),focus);
}
console.log('Updated 10 normalized full comparisons, 3 focused comparisons and contact sheet.');
