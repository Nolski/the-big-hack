#!/usr/bin/env python3
"""Clean the approved film list using ElevenLabs; keep original voices and films.

Requires existing ffmpeg/ffprobe and ELEVENLABS_API_KEY. No Python packages.
Outputs and isolated stems live in stage/assets/filmed/audio-cleanup.
Re-running keeps successful clips whose source, edit and processing match.
"""
import concurrent.futures
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import time
import urllib.error
import urllib.request
import uuid

ROOT = Path(__file__).resolve().parents[1]
STAGE = ROOT / 'stage'
OUT = STAGE / 'assets/filmed/audio-cleanup'
WORK = ROOT / 'build/audio-cleanup'
VERSION = 1


def run(args):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-threads', '2', *map(str, args)], check=True)


def duration(path):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries',
                 'format=duration', '-of', 'csv=p=0', str(path)]))


def isolate(source, dest):
    boundary = '----voice-' + uuid.uuid4().hex
    body = (f'--{boundary}\r\nContent-Disposition: form-data; name="audio"; '
            'filename="speech.wav"\r\nContent-Type: audio/wav\r\n\r\n').encode()
    body += source.read_bytes() + f'\r\n--{boundary}--\r\n'.encode()
    key = os.environ['ELEVENLABS_API_KEY'].strip()
    for attempt in range(5):
        req = urllib.request.Request('https://api.elevenlabs.io/v1/audio-isolation', data=body,
            headers={'xi-api-key': key, 'Content-Type': 'multipart/form-data; boundary=' + boundary})
        try:
            with urllib.request.urlopen(req, timeout=180) as response:
                if not response.headers.get('Content-Type', '').startswith('audio/'):
                    raise RuntimeError('Voice Isolator returned no audio')
                dest.write_bytes(response.read())
                return
        except urllib.error.HTTPError as error:
            detail = error.read().decode(errors='replace').replace(key, '[REDACTED]')
            if error.code in (429, 500, 502, 503, 504) and attempt < 4:
                time.sleep(min(10, 2 * (attempt + 1)))
                continue
            raise RuntimeError(f'ElevenLabs HTTP {error.code}: {detail[:400]}') from None


def clean(item):
    source = STAGE / item['source']
    source_hash = hashlib.sha256(source.read_bytes()).hexdigest()
    folder = WORK / item['id']; folder.mkdir(parents=True, exist_ok=True)
    record = OUT / (item['id'] + '.json')
    output = OUT / (item['id'] + '-clean-v1.mp4')
    signature = {'version': VERSION, 'edit': item, 'sourceSHA256': source_hash}
    if record.exists() and output.exists():
        old = json.loads(record.read_text())
        if old.get('signature') == signature and old.get('outputSHA256') == hashlib.sha256(output.read_bytes()).hexdigest():
            print(item['id'] + ': already ready', flush=True)
            return
    start = float(item.get('trimStart', 0))
    end = duration(source) - float(item.get('trimEnd', 0))
    length = end - start
    if length <= 0: raise ValueError('Trim removes the entire clip: ' + item['id'])
    isolated = OUT / 'isolated' / (item['id'] + '-' + source_hash[:12] + '.mp3')
    if record.exists():
        old = json.loads(record.read_text())
        if old.get('signature', {}).get('sourceSHA256') == source_hash:
            isolated = STAGE / old['isolatedStem']
    approved = STAGE / 'assets/share/exports/ai-news-cleanup-review/01-ai-cleaned-trimmed.mp4'
    stem = ROOT / 'exports/ai-news-cleanup-review/isolated.mp3'
    if item.get('reuseApproved') and approved.exists() and stem.exists():
        shutil.copyfile(approved, output); shutil.copyfile(stem, isolated)
        filters = json.loads((STAGE / 'assets/share/exports/ai-news-cleanup-review/test-edit.json').read_text())['postProcessing']['filters']
    else:
        if not isolated.exists():
            extracted = folder / 'speech.wav'
            run(['-i', source, '-map', '0:a:0', '-ac', '1', '-ar', '48000',
                 '-af', 'apad=whole_dur=5.2', '-c:a', 'pcm_s16le', extracted])
            isolate(extracted, isolated)
        base = (f'atrim=start={start}:end={end},asetpts=PTS-STARTPTS,highpass=f=65,'
                'equalizer=f=240:t=q:w=0.8:g=-1,equalizer=f=3000:t=q:w=0.7:g=1,'
                'acompressor=threshold=0.1:ratio=2:attack=15:release=150:makeup=1,'
                'aformat=channel_layouts=stereo')
        target = 'loudnorm=I=-16:TP=-1.5:LRA=7'
        measured = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(isolated),
            '-af', base + ',' + target + ':print_format=json', '-f', 'null', '-'],
            capture_output=True, text=True, check=True).stderr
        stats = json.JSONDecoder().raw_decode(measured[measured.rfind('{'):])[0]
        norm = (target + ':measured_I=' + stats['input_i'] + ':measured_TP=' + stats['input_tp']
                + ':measured_LRA=' + stats['input_lra'] + ':measured_thresh=' + stats['input_thresh']
                + ':offset=' + stats['target_offset'] + ':linear=true')
        filters = base + ',' + norm + f',aresample=48000,apad,atrim=duration={length},afade=t=in:d=0.008,afade=t=out:st={max(0,length-.02)}:d=0.02'
        run(['-i', source, '-i', isolated, '-filter_complex',
             f'[0:v]trim=start={start}:end={end},setpts=PTS-STARTPTS[v];[1:a]{filters}[a]',
             '-map', '[v]', '-map', '[a]', '-t', length, '-c:v', 'libx264', '-threads', '2',
             '-preset', 'fast', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac',
             '-b:a', '192k', '-ar', '48000', '-ac', '2', '-map_metadata', '-1',
             '-movflags', '+faststart', output])
    result = {'signature': signature, 'output': str(output.relative_to(STAGE)),
              'duration': duration(output), 'sourceStart': start, 'sourceEnd': end,
              'isolatedStem': str(isolated.relative_to(STAGE)), 'filters': filters,
              'outputSHA256': hashlib.sha256(output.read_bytes()).hexdigest(),
              'voice': 'Original generated performance; no replacement speech'}
    record.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(item['id'] + f': ready ({result["duration"]:.3f}s)', flush=True)


if __name__ == '__main__':
    (OUT / 'isolated').mkdir(parents=True, exist_ok=True)
    WORK.mkdir(parents=True, exist_ok=True)
    clips = json.loads((OUT / 'edits.json').read_text())['clips']
    failures = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        jobs = {pool.submit(clean, item): item['id'] for item in clips}
        for job in concurrent.futures.as_completed(jobs):
            try: job.result()
            except Exception as error:
                failures.append(jobs[job]); print(jobs[job] + ': FAILED: ' + str(error), flush=True)
    if failures: raise SystemExit('Failed clips: ' + ', '.join(failures))
