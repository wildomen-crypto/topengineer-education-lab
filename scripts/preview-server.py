"""Serve the finished local site, including direct links to its ten pages."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit

site = Path(__file__).resolve().parents[1] / 'dist' / 'client'

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(site), **kwargs)

    def do_GET(self):
        original = self.path
        if urlsplit(self.path).path.startswith('/education-centr/'):
            self.path = '/index.html'
        try:
            super().do_GET()
        finally:
            self.path = original

if __name__ == '__main__':
    print('http://127.0.0.1:4173/education-centr/#designs', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 4173), Handler).serve_forever()
