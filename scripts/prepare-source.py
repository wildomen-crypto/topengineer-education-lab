"""Prepare a local, inert copy of the public site shell and source course content."""
from pathlib import Path
from bs4 import BeautifulSoup, Comment
from urllib.parse import urljoin, urlsplit
from urllib.request import Request, urlopen
from concurrent.futures import ThreadPoolExecutor
import hashlib, json, re, shutil

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / 'artifacts/topengineer-education-sources'
PUBLIC = ROOT / 'public/assets'
PUBLIC.mkdir(parents=True, exist_ok=True)
(ROOT / 'src/data').mkdir(exist_ok=True)
base = 'https://dev.topengineer.ru/education-centr/'
mapping = {}
assets = []
for filename in ['assets.json', 'reference-assets.json', 'old-assets.json']:
    manifest = json.loads((SOURCE / filename).read_text(encoding='utf-8'))
    for asset in manifest['assets']:
        if asset['url'].startswith('inline-svg:'):
            continue
        url = asset['url']
        key = url.split('?')[0]
        name = asset['id'] + Path(asset['path']).suffix
        if key not in mapping:
            shutil.copyfile(asset['path'], PUBLIC / name)
            mapping[key] = '/assets/' + name
            assets.append(asset)

def download(url):
    key = url.split('?')[0]
    if key in mapping:
        return mapping[key]
    extension = Path(urlsplit(url).path).suffix or '.css'
    name = hashlib.sha256(url.encode()).hexdigest()[:16] + extension
    try:
        request = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urlopen(request, timeout=20) as response:
            data = response.read()
        (PUBLIC / name).write_bytes(data)
        mapping[key] = '/assets/' + name
        return mapping[key]
    except Exception:
        return None

# Every dependency is derived from the captured CSS, rather than guessed paths.
css_assets = [a for a in assets if a['kind'] == 'stylesheet']
for asset in css_assets:
    file = PUBLIC / mapping[asset['url'].split('?')[0]].split('/')[-1]
    css = file.read_text(encoding='utf-8')
    dependencies = []
    for raw in re.findall(r'url\([\"\']?([^\)\"\']+)[\"\']?\)', css):
        if raw.startswith('data:'):
            continue
        dependencies.append(urljoin(asset['url'], raw))
    with ThreadPoolExecutor(max_workers=12) as pool:
        list(pool.map(download, set(dependencies)))
    # Imports can introduce font dependencies. Copy those locally too.
    for url in set(dependencies):
        local = mapping.get(url.split('?')[0])
        if local and 'fonts.googleapis.com' in url:
            imported = PUBLIC / local.split('/')[-1]
            text = imported.read_text(encoding='utf-8')
            nested = re.findall(r'url\(([^)]+)\)', text)
            with ThreadPoolExecutor(max_workers=12) as pool:
                list(pool.map(download, nested))
            for nested_url in nested:
                replacement = mapping.get(nested_url.split('?')[0])
                if replacement:
                    text = text.replace(nested_url, replacement)
            imported.write_text(text, encoding='utf-8')
    def replace(match):
        raw = match.group(1).strip('\"\'')
        if raw.startswith('data:'):
            return match.group(0)
        url = urljoin(asset['url'], raw)
        return 'url("' + mapping.get(url.split('?')[0], 'data:,') + '")'
    css = re.sub(r'url\(([^)]+)\)', replace, css)
    file.write_text(css, encoding='utf-8')

soup = BeautifulSoup((SOURCE / 'source.html').read_text(encoding='utf-8'), 'html.parser')
responsive_assets = set()
for image in soup.select('img, source'):
    for item in image.get('srcset', '').split(','):
        if item.strip():
            responsive_assets.add(urljoin(base, item.strip().split()[0]))
    if image.get('src') and not image['src'].startswith('data:'):
        responsive_assets.add(urljoin(base, image['src']))
with ThreadPoolExecutor(max_workers=12) as pool:
    list(pool.map(download, responsive_assets))
def clean(node):
    for el in node.find_all(['script']):
        el.decompose()
    for comment in node.find_all(string=lambda x:isinstance(x, Comment)):
        comment.extract()
    for el in node.find_all(True):
        for attribute in list(el.attrs):
            if attribute.startswith('on') or attribute in ['contenteditable', 'data-codex-favicon-badge']:
                del el[attribute]
        if el.get('title', '').startswith('Двойной'):
            del el['title']
        for attr in ['src', 'poster']:
            raw = el.get(attr)
            if raw and not raw.startswith('data:'):
                key = urljoin(base, raw).split('?')[0]
                local = mapping.get(key)
                if not local and el.name == 'img':
                    # Picture fallbacks share the already captured source's asset.
                    picture = el.find_parent('picture')
                    if picture and picture.find('source'):
                        key = urljoin(base, picture.find('source').get('srcset','')).split('?')[0]
                        local = mapping.get(key)
                if local:
                    el[attr] = local
        if el.get('srcset'):
            el['srcset'] = ', '.join(mapping.get(urljoin(base,item.strip().split(' ')[0]).split('?')[0], 'data:,') + (' '+ ' '.join(item.strip().split(' ')[1:]) if len(item.strip().split(' '))>1 else '') for item in el['srcset'].split(','))
        if el.get('style'):
            def inline_replace(m):
                raw=m.group(1).strip('\"\'')
                return 'url("'+mapping.get(urljoin(base,raw).split('?')[0], 'data:,')+'")'
            el['style'] = re.sub(r'url\(([^)]+)\)', inline_replace, el['style'])
        if el.name == 'a' and el.get('href','').startswith('/'):
            if el['href'] != '/education-centr/':
                el['href'] = urljoin(base,el['href'])
    return str(node)

header = clean(soup.find('header'))
footer = clean(soup.find('footer'))
main = clean(soup.find('main'))
(ROOT/'src/data/shell.json').write_text(json.dumps({'header':header,'footer':footer,'main':main},ensure_ascii=False),encoding='utf-8')
old = BeautifulSoup((SOURCE/'old-course.html').read_text(encoding='utf-8'),'html.parser')
levels = []
for index in range(1,4):
    lines = old.select_one('#collapse'+str(index)).get_text('\n',strip=True).splitlines()
    days = [[],[]]
    day = 0
    for line in lines:
        line = re.sub(r'\s+',' ',line).strip()
        if 'День' in line and ('Второй' in line or 'второй' in line):
            day=1
        if re.match(r'^\d+\.\d+',line):
            days[day].append(line)
    levels.append({'id':index,'days':days})
(ROOT/'src/data/programs.json').write_text(json.dumps(levels,ensure_ascii=False,indent=2),encoding='utf-8')
css = [mapping[a['url'].split('?')[0]] for a in assets if a['kind']=='stylesheet' and ('template_' in a['url'] or 'page_a06' in a['url'])]
index = ROOT/'index.html'
index.write_text('''<!doctype html>
<html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Учебный центр — Топинженер</title>'''+''.join('<link rel="stylesheet" href="'+url+'">' for url in css)+'''</head><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>''',encoding='utf-8')
(ROOT/'public/asset-map.json').write_text(json.dumps(mapping,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'assets':len(mapping),'program_topics':[sum(len(d) for d in l['days']) for l in levels],'css':css}))
