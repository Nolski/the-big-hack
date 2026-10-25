#!/usr/bin/env python3
"""Rebuild the SJ heartbeat audition with Python + FFmpeg, inside Docker by default."""
import argparse
from array import array
import hashlib
import json
import math
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
PACKAGE = ROOT / 'stage/assets/sound-design/sj-realization'
IMAGE = 'bighack-news-rebuild:1'


def run(args, **kwargs):
    return subprocess.run(args, check=True, **kwargs)


def read_audio(path, channels, rate):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(path),
                                   '-vn', '-ac', str(channels), '-ar', str(rate),
                                   '-f', 'f32le', 'pipe:1'])
    values = array('f')
    values.frombytes(raw)
    if sys.byteorder != 'little':
        values.byteswap()
    return values


def encode_audio(path, values, channels, rate, codec):
    data = array('f', values)
    if sys.byteorder != 'little':
        data.byteswap()
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(rate),
         '-ac', str(channels), '-i', 'pipe:0', *codec, str(path)], input=data.tobytes())


def ramp(t, start, end):
    x = max(0., min(1., (t - start) / max(end - start, 1e-9)))
    return .5 - .5 * math.cos(math.pi * x)


def pair(hits, progress, cfg):
    sr = cfg['sampleRate']
    gap = cfg['slowPairGapSeconds'] + progress * (cfg['fastPairGapSeconds'] - cfg['slowPairGapSeconds'])
    pieces = []
    for n, raw in enumerate(hits):
        duration = cfg['slowHitDurationsSeconds'][n] + progress * (
            cfg['fastHitDurationsSeconds'][n] - cfg['slowHitDurationsSeconds'][n])
        size = round(duration * sr)
        if size > len(raw):
            raise ValueError('Hit duration exceeds its source recording')
        hit = array('f', (raw[i] * ramp(i / sr, 0, .005) *
                         (1 - ramp(i / sr, duration - .018, duration)) for i in range(size)))
        rms = math.sqrt(sum(v * v for v in hit) / max(1, len(hit)))
        gain = (1. if n == 0 else cfg['secondHitRms']) / max(rms, 1e-9)
        pieces.append(array('f', (v * gain for v in hit)))
    offset = round(gap * sr)
    result = array('f', [0.]) * max(len(pieces[0]), offset + len(pieces[1]))
    for start, hit in [(0, pieces[0]), (offset, pieces[1])]:
        for i, value in enumerate(hit):
            result[start + i] += value
    peak = max(max(map(abs, result)), 1e-9)
    return array('f', (v / peak for v in result)), gap


def heartbeat(cfg, frames):
    sr = cfg['sampleRate']
    first, peak_at, stop = (cfg[k] for k in (
        'heartbeatStartSeconds', 'peakTempoAtSeconds', 'heartbeatStopSeconds'))
    if not 0 <= first < peak_at < stop <= frames / sr:
        raise ValueError('Heartbeat timing must satisfy start < peak tempo < stop <= scene length')
    if not 0 < cfg['startBpm'] <= cfg['endBpm']:
        raise ValueError('BPM must be positive, with endBpm >= startBpm')
    hits = [read_audio(PACKAGE / 'sources' / name, 1, sr)
            for name in ['heart-s1.wav', 'heart-s2.wav']]
    track = array('f', [0.]) * (frames * 2)
    start_rate, end_rate = cfg['startBpm'] / 60, cfg['endBpm'] / 60
    length = peak_at - first
    slope = (end_rate - start_rate) / length
    cycles = .5 * (start_rate + end_rate) * length
    pulses = []
    n = 0
    while True:
        if n <= cycles and slope > 1e-12:
            delta = (-start_rate + math.sqrt(start_rate ** 2 + 2 * slope * n)) / slope
        elif n <= cycles:
            delta = n / start_rate
        else:
            delta = length + (n - cycles) / end_rate
        when = first + delta
        if when >= stop:
            break
        progress = min(1., delta / length)
        bpm = cfg['startBpm'] + progress * (cfg['endBpm'] - cfg['startBpm'])
        hit, gap = pair(hits, progress, cfg)
        if len(hit) / sr >= 60 / bpm:
            raise ValueError('The paired heartbeat is too long for this BPM')
        db = cfg['startPeakDb'] + progress * (cfg['endPeakDb'] - cfg['startPeakDb']) + cfg['heartbeatGainDb']
        gain = 10 ** (db / 20)
        begin = round(when * sr)
        for i, value in enumerate(hit):
            frame = begin + i
            if frame >= frames or frame / sr >= stop:
                break
            fade = 1 - ramp(frame / sr, stop - cfg['fadeOutSeconds'], stop)
            track[frame * 2] += value * gain * fade
            track[frame * 2 + 1] += value * gain * fade
        pulses.append({'time': round(when, 6), 'bpm': round(bpm, 3),
                       'peakDb': round(db, 2), 'withinPairGap': round(gap, 6)})
        n += 1
    return track, pulses


def render(destination):
    cfg = json.loads((PACKAGE / 'edit.json').read_text())
    timeline = json.loads((PACKAGE / 'timeline.json').read_text())
    sr = cfg['sampleRate']
    voice_source = PACKAGE / 'stems/dialogue.flac'
    voices = read_audio(voice_source, 2, sr)
    frames = len(voices) // 2
    heart, pulses = heartbeat(cfg, frames)
    if max(map(abs, heart), default=0.) > 1:
        raise ValueError('Heartbeat stem would clip; lower heartbeatGainDb or endPeakDb in edit.json')
    destination.mkdir(parents=True, exist_ok=True)
    stems = destination / 'stems'
    stems.mkdir(exist_ok=True)
    voice_target = stems / 'dialogue.flac'
    if not voice_target.exists() or not voice_source.samefile(voice_target):
        shutil.copy2(voice_source, voice_target)
    encode_audio(stems / 'heartbeat.flac', heart, 2, sr, ['-c:a', 'flac', '-sample_fmt', 's32'])
    with tempfile.TemporaryDirectory(prefix='sj-sound-') as temp:
        premix = Path(temp) / 'premix.wav'
        mixed = array('f', (a + b for a, b in zip(voices, heart)))
        encode_audio(premix, mixed, 2, sr, ['-c:a', 'pcm_f32le'])
        measurement = run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(premix),
                           '-af', 'aresample=192000,astats=measure_overall=Peak_level:measure_perchannel=none:reset=0',
                           '-f', 'null', '-'], capture_output=True, text=True)
        matches = re.findall(r'Peak level dB:\s*(-?[\d.]+)', measurement.stderr)
        if not matches:
            raise RuntimeError('FFmpeg did not report the mix peak')
        peak_db = float(matches[-1])
        master_db = min(0., cfg['truePeakTargetDb'] - peak_db)
        target = destination / 'mix-no-ringing.mp3'
        run(['ffmpeg', '-v', 'error', '-y', '-i', str(premix), '-af', f'volume={master_db}dB',
             '-c:a', 'libmp3lame', '-b:a', '256k', str(target)])
    manifest = {
        'title': 'SJ realizes what happened', 'version': 'heartbeat-no-ringing',
        'audio': target.name, 'duration': round(frames / sr, 3),
        'renderId': hashlib.sha256(target.read_bytes()).hexdigest()[:16],
        'events': timeline['events'],
        'markers': [
            {'label': 'Heartbeat build', 'time': max(0, cfg['heartbeatStartSeconds'] - .55)},
            {'label': 'Marcus', 'time': next(e['start'] for e in timeline['events'] if e['id'] == 's22_sorry')},
            {'label': f"{cfg['endBpm']} BPM", 'time': cfg['peakTempoAtSeconds']},
            {'label': 'Dry door knocks', 'time': next(e['start'] for e in timeline['events'] if e['id'] == 's22_l11') + .001},
        ],
        'sound': {'ringing': False, 'musicOrAmbienceAdded': False, 'voiceFilteringOrFades': False,
                  'heartbeatStartBpm': cfg['startBpm'], 'heartbeatEndBpm': cfg['endBpm'],
                  'heartbeatGainDb': cfg['heartbeatGainDb'], 'heartbeatStopSeconds': cfg['heartbeatStopSeconds'],
                  'masterGainDb': round(master_db, 4), 'truePeakDb': round(peak_db + master_db, 3),
                  'heartbeatPulses': pulses},
        'note': 'Standalone audition. The production script and presenter are unchanged.',
    }
    (destination / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(f"Ready: {target} ({frames / sr:.2f}s; {cfg['startBpm']}–{cfg['endBpm']} BPM; no ringing)")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--native', action='store_true', help='Use existing local FFmpeg; install nothing')
    parser.add_argument('--output', type=Path, default=ROOT / 'build/sj-sound')
    args = parser.parse_args()
    if args.native:
        render(args.output.resolve())
        return
    if not shutil.which('docker'):
        parser.error('Start Docker first. Existing FFmpeg users can pass --native.')
    check = subprocess.run(['docker', 'image', 'inspect', IMAGE], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if check.returncode:
        run(['docker', 'build', '-t', IMAGE, '-f', str(ROOT / 'tools/news-montages/Dockerfile'), str(ROOT)])
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    run(['docker', 'run', '--rm', '--network', 'none', '--read-only', '--cap-drop', 'ALL',
         '--security-opt', 'no-new-privileges', '--tmpfs', '/tmp:rw,noexec,nosuid,size=256m',
         '--mount', f'type=bind,src={ROOT},dst=/repo,readonly',
         '--mount', f'type=bind,src={output},dst=/out', IMAGE,
         'python3', '/repo/tools/rebuild_sj_sound.py', '--native', '--output', '/out'])


if __name__ == '__main__':
    main()
