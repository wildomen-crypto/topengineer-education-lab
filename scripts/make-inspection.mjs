import fs from 'node:fs';
const shell=JSON.parse(fs.readFileSync(new URL('../src/data/shell.json',import.meta.url),'utf8'));
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const styles=[...index.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)].map(m=>m[0]).join('');
fs.writeFileSync(new URL('../public/source-capture.html',import.meta.url),'<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'+styles+'<title>Исходная страница — сохранённый снимок</title></head><body>'+shell.header+shell.main+shell.footer+'</body></html>');
