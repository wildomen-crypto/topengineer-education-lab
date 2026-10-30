import {build} from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const version='te-tekla-20261030';
const prefix=`/test/${version}/`;
const output=path.join(root,'dist/bitrix-test',version);
const publicRoot=path.join(root,'public');
const referencedAssets=new Set();

async function flattenCss(file,seen=new Set()){
  const css=await fs.readFile(file,'utf8');
  let flattened=css;
  for(const match of css.matchAll(/@import\s+url\(["']?(\/assets\/[\w.-]+\.css)["']?\)\s*;/gi)){
    const imported=path.join(publicRoot,match[1]);
    let replacement='';
    if(!seen.has(imported)){seen.add(imported);replacement=await flattenCss(imported,seen);}
    flattened=flattened.replace(match[0],replacement);
  }
  return flattened;
}

const theme=(await Promise.all(['ee866a2a00f28324.css','f04a0d8499931d27.css'].map(name=>flattenCss(path.join(publicRoot,'assets',name))))).join('\n');
await build({
  configFile:false,
  root,
  publicDir:false,
  define:{'process.env.NODE_ENV':'"production"'},
  plugins:[react(),{name:'te-training-theme',resolveId(id){if(id==='virtual:te-training-theme')return '\0te-training-theme';},load(id){if(id==='\0te-training-theme')return `export default ${JSON.stringify(theme)}`;}}],
  build:{outDir:output,emptyOutDir:true,cssCodeSplit:false,lib:{entry:path.join(root,'src/embedded/main.jsx'),formats:['es'],fileName:()=> 'tekla-body.js',cssFileName:'tekla-body'},minify:'esbuild'},
});

for(const name of ['tekla-body.js','tekla-body.css']){
  const file=path.join(output,name);
  let contents=await fs.readFile(file,'utf8');
  for(const match of contents.matchAll(/\/assets\/[A-Za-z0-9_./-]+/g))referencedAssets.add(match[0]);
  contents=contents.replaceAll('/assets/',prefix+'assets/');
  await fs.writeFile(file,contents);
}
await fs.cp(path.join(publicRoot,'assets/reference'),path.join(output,'assets/reference'),{recursive:true});
await fs.mkdir(path.join(output,'assets/intensive'),{recursive:true});
await fs.copyFile(path.join(publicRoot,'assets/intensive/hero.jpg'),path.join(output,'assets/intensive/hero.jpg'));
for(const asset of referencedAssets){
  const input=path.resolve(publicRoot,'.'+asset);
  if(!input.startsWith(path.join(publicRoot,'assets')+path.sep))throw new Error('Asset outside public folder');
  try{
    if(!(await fs.stat(input)).isFile())continue;
    const destination=path.join(output,'.'+asset);
    await fs.mkdir(path.dirname(destination),{recursive:true});
    await fs.copyFile(input,destination);
  }catch(error){if(error.code!=='ENOENT')throw error;}
}
const snippet=`<te-training-test data-te-training style="display:block"><p>Загрузка страницы обучения…</p></te-training-test>\n<script type="module" src="${prefix}tekla-body.js"></script>`;
await fs.writeFile(path.join(root,'dist/bitrix-test/body-snippet.html'),snippet);
await fs.writeFile(path.join(root,'dist/bitrix-test/deployment.json'),JSON.stringify({version,prefix},null,2));
await fs.cp(output,path.join(root,'dist/client/test',version),{recursive:true});
console.log(`Body-only package: ${output}`);
