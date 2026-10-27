"""Build the keyboard track by retriggering real recorded keypresses.

Takes a folder of single-keystroke WAVs and the typing schedule, and places
one sample per key: never the same sample twice running, small gain and
timing-independent variation, and a lower, louder sample for the space bar
and Enter. Overlapping tails are summed, as they are on a real keyboard.

    python3 -I retrigger.py <sample-dir> <keys.json> <seconds> <out.wav>
"""
import json, random, struct, sys, wave
from array import array
from pathlib import Path

sample_dir, sched_path, duration, out_path = Path(sys.argv[1]), Path(sys.argv[2]), float(sys.argv[3]), Path(sys.argv[4])
sched = json.loads(sched_path.read_text())
rng = random.Random(11)


def load(path):
    with wave.open(str(path), 'rb') as w:
        assert w.getsampwidth() == 2 and w.getnchannels() == 1, path
        sr = w.getframerate()
        d = array('h')
        d.frombytes(w.readframes(w.getnframes()))
    peak = max(abs(v) for v in d) or 1
    onset = next(i for i, v in enumerate(d) if abs(v) > peak * 0.04)
    start = max(0, onset - int(0.0015 * sr))          # keep a hair of attack
    return sr, [v / peak for v in d[start:]]


samples, SR = [], None
for f in sorted(sample_dir.glob('*.wav')):
    sr, data = load(f)
    SR = SR or sr
    assert sr == SR, f
    samples.append(data)
if not samples:
    raise SystemExit('no .wav samples in %s' % sample_dir)


def resample(data, rate):
    """Play a sample slower (rate < 1) to drop its pitch, for the big keys."""
    n = int(len(data) / rate)
    out = []
    for i in range(n):
        x = i * rate
        j = int(x)
        if j + 1 >= len(data):
            break
        f = x - j
        out.append(data[j] * (1 - f) + data[j + 1] * f)
    return out


buf = array('d', bytes(8 * int((duration + 1) * SR)))
text, t0 = sched['text'], sched['t0']
events = [(t0 + at, text[i]) for i, at in enumerate(sched['keys'])] + [(sched['send'], '\n')]
last = -1
for at, char in events:
    i = rng.randrange(len(samples))
    while i == last and len(samples) > 1:
        i = rng.randrange(len(samples))
    last = i
    data = samples[i]
    # every stroke is pitched slightly differently, so a small pool of
    # samples does not read as the same click over and over
    rate = (0.90 if char == ' ' else 0.86 if char == '\n' else 1.0) * rng.uniform(0.955, 1.045)
    data = resample(data, rate)
    gain = (1.3 if char == '\n' else 1.15 if char == ' ' else 1.0) * rng.uniform(0.82, 1.18)
    start = int(at * SR)
    for k, v in enumerate(data):
        if start + k >= len(buf):
            break
        buf[start + k] += v * gain

peak = max(abs(v) for v in buf) or 1.0
gain = 0.74 / peak
total = int(duration * SR)
with wave.open(str(out_path), 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(struct.pack('<%dh' % total,
                              *(max(-32768, min(32767, int(v * gain * 32767))) for v in buf[:total])))
print('%d samples in pool, %d keys, %dHz, summed peak %.2f' % (len(samples), len(events), SR, peak))
