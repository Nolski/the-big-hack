#!/usr/bin/env python3
"""Replace the dialogue audio of a Veo clip with a clean ElevenLabs version.

Veo's soundtrack often clips or sounds metallic. This takes a video, declips
its audio, and sends each speaker's stretch through ElevenLabs Voice Changer
(speech-to-speech), which keeps the timing and delivery but renders it in a
clean library voice, so lip sync holds. With --isolate it uses Voice Isolator
instead and keeps Veo's own voices. Each part is levelled to the same loudness
and the result is muxed back onto the original video stream, untouched.

The API key is read from the ELEVENLABS_API_KEY environment variable.

    python3 tools/clean_veo_audio.py in.mp4 out.mp4 --part 0:VOICE_ID --part 4.0:VOICE_ID
    python3 tools/clean_veo_audio.py in.mp4 out.mp4 --isolate

A part runs from its start time to the next part's start (or the end of the
clip). Put the split points in the silence between speakers.
"""
import argparse, json, os, subprocess, sys, tempfile, time
from pathlib import Path

import requests

API = 'https://api.elevenlabs.io'
STS_MODEL = 'eleven_multilingual_sts_v2'
RATE = 44100


def ff(*args):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *args], check=True)


def duration(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(path)],
                         capture_output=True, text=True, check=True).stdout
    return float(out)


def loudness(path):
    err = subprocess.run(['ffmpeg', '-nostats', '-i', str(path), '-af', 'ebur128', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    lines = [l for l in err.splitlines() if l.strip().startswith('I:')]
    return float(lines[-1].split()[1])


def post(s, url, path, data=None):
    for attempt in range(6):
        with open(path, 'rb') as f:
            r = s.post(url, params={'output_format': 'mp3_44100_128'}, data=data or {},
                       files={'audio': (path.name, f, 'audio/wav')}, timeout=300)
        if r.status_code == 200 and r.headers.get('content-type', '').startswith('audio/'): return r.content
        if r.status_code in (429, 500, 502, 503, 504): time.sleep(5 * (attempt + 1)); continue
        raise RuntimeError(f'{r.status_code}: {r.text[:300]}')
    raise RuntimeError('gave up after retries')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('video', type=Path)
    ap.add_argument('out', type=Path)
    ap.add_argument('--part', action='append', default=[], help='START:VOICE_ID, one per speaker stretch')
    ap.add_argument('--isolate', action='store_true', help='keep Veo voices, only isolate speech')
    ap.add_argument('--lufs', type=float, default=-23.0, help='loudness for every part')
    ap.add_argument('--seed', type=int, help='Voice Changer seed, for another take of the same clip')
    ap.add_argument('--settings', help='Voice Changer voice_settings as JSON, e.g. {"stability": 0.8}')
    a = ap.parse_args()
    if a.isolate == bool(a.part): sys.exit('give either --part (Voice Changer) or --isolate')
    key = os.environ.get('ELEVENLABS_API_KEY')
    if not key: sys.exit('No ElevenLabs key: set ELEVENLABS_API_KEY')
    s = requests.Session(); s.headers['xi-api-key'] = key

    total = duration(a.video)
    parts = [(float(p.split(':', 1)[0]), p.split(':', 1)[1]) for p in a.part] or [(0.0, None)]
    parts.sort()
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        src = tmp / 'src.wav'
        ff('-i', str(a.video), '-vn', '-ac', '1', '-ar', str(RATE), '-af', 'adeclip', str(src))
        pieces = []
        for i, (start, voice) in enumerate(parts):
            end = parts[i + 1][0] if i + 1 < len(parts) else total
            seg, got, fit = tmp / f'{i}.wav', tmp / f'{i}.mp3', tmp / f'{i}-fit.wav'
            ff('-i', str(src), '-af', f'atrim={start}:{end},asetpts=N/SR/TB', str(seg))
            if voice:
                data = {'model_id': STS_MODEL, 'remove_background_noise': 'true'}
                if a.seed is not None: data['seed'] = str(a.seed)
                if a.settings: data['voice_settings'] = a.settings
                audio = post(s, f'{API}/v1/speech-to-speech/{voice}', seg, data)
            else:
                audio = post(s, f'{API}/v1/audio-isolation', seg)
            got.write_bytes(audio)
            # Same length as the source stretch, so later parts stay in sync with the picture.
            gain = a.lufs - loudness(got)
            ff('-i', str(got), '-af', f'volume={gain}dB,aresample={RATE},apad,atrim=0:{end - start}', '-ac', '1', str(fit))
            pieces.append(fit)
            print(json.dumps({'part': i, 'start': start, 'end': round(end, 3), 'voice': voice or 'isolate',
                              'returned_s': round(duration(got), 3), 'gain_db': round(gain, 1)}), flush=True)
        joined = tmp / 'joined.wav'
        ff(*sum((['-i', str(p)] for p in pieces), []), '-filter_complex',
           ''.join(f'[{i}]' for i in range(len(pieces))) + f'concat=n={len(pieces)}:v=0:a=1,alimiter=limit=0.89:level=false',
           str(joined))
        ff('-i', str(a.video), '-i', str(joined), '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
           '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-t', str(total), '-movflags', '+faststart', str(a.out))
    print(json.dumps({'out': str(a.out), 'duration': duration(a.out)}), flush=True)


if __name__ == '__main__':
    main()
