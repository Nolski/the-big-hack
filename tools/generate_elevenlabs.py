#!/usr/bin/env python3
"""Generate the recorded (non-live) stage roles with ElevenLabs.

Reads the current script from stage/show.json, voices every spoken cue whose
speaker has a voice in tools/elevenlabs-voices.json, and attaches each file to
stage/generated-voices.json through ScriptStore.register_audio, the same path
the storyboard uses. Re-running skips cues that already have a matching
ElevenLabs recording in the same voice and model, so it resumes after a stop.

The API key is read from ELEVENLABS_API_KEY or the `elevenlabs` file beside
the vault (never committed). Before each line it checks the remaining credits
and stops cleanly rather than failing half way through a request.

    python3 tools/generate_elevenlabs.py [--dry-run] [--only kristina,hr]
"""
import argparse, json, os, subprocess, sys, tempfile, time
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent.parent
STAGE = ROOT / 'stage'
sys.path.insert(0, str(STAGE))
from script_store import ScriptStore, Conflict  # noqa: E402

API = 'https://api.elevenlabs.io'


def api_key():
    key = os.environ.get('ELEVENLABS_API_KEY')
    if not key:
        f = ROOT.parent / 'elevenlabs'
        key = f.read_text().strip() if f.exists() else ''
    if not key: sys.exit('No ElevenLabs key: set ELEVENLABS_API_KEY or create ../elevenlabs')
    return key


def credits_left(s):
    r = s.get(f'{API}/v1/user/subscription', timeout=30); r.raise_for_status()
    d = r.json(); return d['character_limit'] - d['character_count']


def duration(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(path)],
                         capture_output=True, text=True, check=True).stdout
    return round(float(out), 6)


def synthesise(s, voice, model, fmt, text):
    for attempt in range(6):
        r = s.post(f'{API}/v1/text-to-speech/{voice}', params={'output_format': fmt},
                   json={'text': text, 'model_id': model}, timeout=180)
        if r.status_code == 200 and r.headers.get('content-type', '').startswith('audio/'): return r.content
        if r.status_code in (429, 500, 502, 503, 504): time.sleep(5 * (attempt + 1)); continue
        raise RuntimeError(f'{r.status_code}: {r.text[:300]}')
    raise RuntimeError('gave up after retries')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--only', help='comma-separated speakers')
    a = ap.parse_args()
    cfg = json.loads((ROOT / 'tools/elevenlabs-voices.json').read_text())
    voices, model, fmt = cfg['voices'], cfg['model'], cfg['outputFormat']
    only = set(a.only.split(',')) if a.only else set(voices)
    store = ScriptStore(STAGE)
    show = store.read()
    manifest = json.loads((STAGE / 'generated-voices.json').read_text())['recordings']

    def done(c):
        r = manifest.get(c['id'], {}); p = r.get('provenance', {})
        return (r.get('text'), r.get('speaker'), r.get('voiceProfile')) == (c['text'], c['speaker'], c.get('voiceProfile')) \
            and p.get('type') == 'elevenlabs' and p.get('voiceId') == voices[c['speaker']]['voiceId'] and p.get('model') == model

    rank = {sp: i for i, sp in enumerate(cfg['order'])}
    todo = [c for c in show['cues'] if c.get('speaker') in voices and c['speaker'] in only
            and c['kind'] != 'stage' and c['text'].strip() and not done(c)]
    todo.sort(key=lambda c: rank.get(c['speaker'], 99))
    need = sum(len(c['text']) for c in todo)
    print(json.dumps({'todo': len(todo), 'characters': need}), flush=True)
    if a.dry_run or not todo: return

    s = requests.Session(); s.headers['xi-api-key'] = api_key()
    left = credits_left(s)
    ok = 0
    with tempfile.TemporaryDirectory() as tmp:
        for n, c in enumerate(todo, 1):
            if n % 20 == 1: left = credits_left(s)
            if len(c['text']) > left:
                print(json.dumps({'stopped': 'credits', 'left': left, 'next': c['id'], 'remaining': len(todo) - n + 1}), flush=True)
                break
            v = voices[c['speaker']]
            try:
                audio = synthesise(s, v['voiceId'], model, fmt, c['text'])
                f = Path(tmp) / f"{c['id']}.mp3"; f.write_bytes(audio)
                store.register_audio(c['id'], c['text'], c['speaker'], c.get('voiceProfile'), f, duration(f),
                                     provenance={'type': 'elevenlabs', 'model': model, 'voiceId': v['voiceId'], 'voiceName': v['name']})
                left -= len(c['text']); ok += 1
                print(json.dumps({'n': n, 'id': c['id'], 'speaker': c['speaker'], 'ok': True}), flush=True)
            except (RuntimeError, Conflict, requests.RequestException) as e:
                print(json.dumps({'n': n, 'id': c['id'], 'speaker': c['speaker'], 'ok': False, 'error': str(e)}), flush=True)
    print(json.dumps({'done': True, 'generated': ok, 'of': len(todo)}), flush=True)


if __name__ == '__main__':
    main()
