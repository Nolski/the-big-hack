#!/bin/zsh
cd "${0:A:h}"
exec python3 - <<'PY'
import subprocess,sys,urllib.request
from http.server import ThreadingHTTPServer
from serve import Handler
url='http://127.0.0.1:8040'
try:
 with urllib.request.urlopen(url,timeout=1) as r:
  already_running='The Big Hack' in r.read(4096).decode()
except Exception:already_running=False
if already_running:
 subprocess.run(['open','-a','Google Chrome',url])
 sys.exit(0)
server=ThreadingHTTPServer(('127.0.0.1',8040),Handler)
print('The Big Hack: '+url,flush=True)
subprocess.run(['open','-a','Google Chrome',url])
try:server.serve_forever()
except KeyboardInterrupt:server.server_close()
PY
