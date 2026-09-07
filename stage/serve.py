#!/usr/bin/env python3
"""Show server with byte-range video and persistent filmed-clip overrides."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse,parse_qs,unquote
import argparse,json,re,threading,uuid
ROOT=Path(__file__).resolve().parent
LOCK=threading.Lock()
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
 def log_message(self,fmt,*args):
  if args and str(args[1] if len(args)>1 else '') not in ['200','206','304']:super().log_message(fmt,*args)
 def allowed(self):
  p=unquote(urlparse(self.path).path)
  return not any(s.startswith('.') for s in p.split('/')) and not p.startswith(('/production/','/tools/','/legacy/'))
 def send_head(self):
  if not self.allowed():self.send_error(403);return
  if urlparse(self.path).path=='/overrides.json' and not (ROOT/'overrides.json').exists():
   import io
   self.send_response(200);self.send_header('Content-Type','application/json');self.send_header('Content-Length','2');self.end_headers();return io.BytesIO(b'{}')
  path=Path(self.translate_path(self.path)).resolve()
  if not path.is_relative_to(ROOT):self.send_error(403);return
  if self.headers.get('Range') and path.is_file():
   size=path.stat().st_size;m=re.fullmatch(r'bytes=(\d*)-(\d*)',self.headers['Range'])
   if not m:self.send_error(416);return
   start=int(m[1] or 0);end=int(m[2]) if m[2] else size-1
   if not m[1] and m[2]:start=max(0,size-int(m[2]));end=size-1
   if start>=size or start>end:self.send_response(416);self.send_header('Content-Range',f'bytes */{size}');self.send_header('Content-Length','0');self.end_headers();return
   end=min(end,size-1);self.range_count=end-start+1
   f=path.open('rb');f.seek(start);self.send_response(206);self.send_header('Content-Type',self.guess_type(str(path)));self.send_header('Content-Range',f'bytes {start}-{end}/{size}');self.send_header('Content-Length',str(self.range_count));self.send_header('Accept-Ranges','bytes');self.end_headers();return f
  self.range_count=None;return super().send_head()
 def copyfile(self,source,outputfile):
  count=getattr(self,'range_count',None)
  try:
   if count is None:return super().copyfile(source,outputfile)
   while count>0:
    block=source.read(min(count,128*1024))
    if not block:break
    outputfile.write(block);count-=len(block)
  except (BrokenPipeError,ConnectionResetError):pass
 def json_response(self,data):
  raw=json.dumps(data,indent=2).encode();self.send_response(200);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(raw)));self.end_headers();self.wfile.write(raw)
 def do_POST(self):
  origin=self.headers.get('Origin')
  if origin and origin!=f'http://{self.headers.get("Host")}':self.send_error(403);return
  if self.headers.get('Sec-Fetch-Site')=='cross-site':self.send_error(403);return
  url=urlparse(self.path);q=parse_qs(url.query);length=int(self.headers.get('Content-Length','0'))
  if length<=0 or length>2*1024**3:self.send_error(413);return
  with LOCK:
   f=ROOT/'overrides.json';data=json.loads(f.read_text()) if f.exists() else {}
   valid={c['id'] for c in json.loads((ROOT/'show.json').read_text())['cues']}
   if url.path=='/api/cue':
    if length>100000:self.send_error(413);return
    try:d=json.loads(self.rfile.read(length));cid=d['id'];value=d['value']
    except Exception:self.send_error(400);return
    if cid not in valid:self.send_error(400);return
    if value is None:data.pop(cid,None)
    else:
     # Clip paths come only from the upload endpoint. Never accept arbitrary URLs/paths.
     old=data.get(cid,{})
     for field in ['audioSource','behavior']:
      permitted=['tts','left','right','none'] if field=='audioSource' else ['loop','hold']
      if value.get(field) not in permitted:self.send_error(400);return
     try:offset=max(0,float(value.get('loopStart',0)))
     except (ValueError,TypeError):self.send_error(400);return
     data[cid]={**old,'audioSource':value['audioSource'],'behavior':value['behavior'],'loopStart':offset}
   elif url.path=='/api/clip':
    cid=q.get('cue',[''])[0];side=q.get('side',[''])[0];ext=q.get('ext',[''])[0].lower()
    if cid not in valid or side not in ['left','right'] or ext not in ['mp4','webm','mov']:self.send_error(400);return
    folder=ROOT/'assets/filmed';folder.mkdir(exist_ok=True);out=folder/f'{cid}-{side}-{uuid.uuid4().hex[:8]}.{ext}';remaining=length
    with out.open('wb') as stream:
     while remaining:
      block=self.rfile.read(min(remaining,1024*1024))
      if not block:out.unlink(missing_ok=True);self.send_error(400);return
      stream.write(block);remaining-=len(block)
    data.setdefault(cid,{})[side]={'src':str(out.relative_to(ROOT))}
   else:self.send_error(404);return
   tmp=f.with_suffix('.tmp');tmp.write_text(json.dumps(data,indent=2)+'\n');tmp.replace(f);self.json_response(data)
if __name__=='__main__':
 ap=argparse.ArgumentParser();ap.add_argument('--port',type=int,default=8040);ap.add_argument('--host',default='0.0.0.0',help='Listening address; use 127.0.0.1 for this computer only');a=ap.parse_args();print(f'The Big Hack: http://127.0.0.1:{a.port} (listening on {a.host})',flush=True);ThreadingHTTPServer((a.host,a.port),Handler).serve_forever()
