#!/usr/bin/env python3
"""Render the end-credits card video, cut on the drum hits of the audio track.

The cards are white serif text on black. Each change lands on a big drum hit
(HITS, in seconds, measured from the source track; the hits are two bars
apart, about 168 BPM, so later hits are extrapolated from the fitted grid).

The audio is not stored in Git. The source video is downloaded to the cache
folder on first use, or pass --source to use a file you already have.
Needs ffmpeg and Pillow (pip install pillow).

    python3 tools/make_credits.py [--out build/credits/credits.mp4] [--source video.mp4]

To put the guardrail gag on the end, build it first and pass it to --append:

    tools/credits-gag/build.sh
    python3 tools/make_credits.py --append build/credits-gag/guardrail-gag.mp4
"""
import argparse, subprocess, tempfile, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE_URL = 'https://archive.org/download/Beastie_Boys_Sabotage/Beastie_Boys_Sabotage.mp4'
W, H, FPS = 1280, 720, 24
HITS = [0.528, 3.379, 6.216, 9.111, 11.980, 14.810]
SERIFS = ['/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf',
          '/Library/Fonts/Times New Roman.ttf', 'C:/Windows/Fonts/times.ttf']
ITALICS = ['/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf',
           '/Library/Fonts/Times New Roman Italic.ttf', 'C:/Windows/Fonts/timesi.ttf']
WHITE, GREY = (240, 240, 240), (150, 150, 150)


def fit_grid():
    n = len(HITS)
    mx, my = (n - 1) / 2, sum(HITS) / n
    b = sum((k - mx) * (t - my) for k, t in enumerate(HITS)) / sum((k - mx) ** 2 for k in range(n))
    a = my - b * mx
    return lambda k: a + b * k


def cards(font_path, italic_path):
    from PIL import Image, ImageDraw, ImageFont

    def card(lines):
        im = Image.new('RGB', (W, H), 'black')
        d = ImageDraw.Draw(im)
        for text, size, cy, fill, track, *pos in lines:
            f = ImageFont.truetype(font_path, size)
            ws = [d.textlength(c, font=f) for c in text]
            width = sum(ws) + track * max(len(text) - 1, 0)
            side, edge = pos or ('c', W / 2)
            x = edge - width / 2 if side == 'c' else edge - width if side == 'r' else edge
            for c, w in zip(text, ws):
                d.text((x, cy), c, font=f, fill=fill, anchor='lm')
                x += w + track
        return im

    def cast(rows):
        lines = [('CAST', 30, 60, GREY, 9)]
        for i, (role, who) in enumerate(rows):
            y = 125 + i * 50
            lines += [(role, 34, y, GREY, 5, 'r', W / 2 - 30), (who, 34, y, WHITE, 5, 'l', W / 2 + 30)]
        return card(lines)

    def message(paragraphs, max_width=1000, gap=36):
        """Centred paragraphs, wrapped. *Asterisks* put a word in italics, and
        a ^caret drops the rest of that line to the label grey."""
        im = Image.new('RGB', (W, H), 'black')
        d = ImageDraw.Draw(im)

        def split(text, roman, slanted, fill):
            out, shade = [], fill
            for i, part in enumerate(text.split('*')):
                for word in part.split():
                    if word.startswith('^'):
                        shade, word = GREY, word[1:]
                    if word:
                        out.append((word, slanted if i % 2 else roman, shade))
            return out

        blocks = []
        for text, size, fill, track in paragraphs:
            roman = ImageFont.truetype(font_path, size)
            slanted = ImageFont.truetype(italic_path, size)
            space = d.textlength(' ', font=roman)

            def width(ws, track=track, space=space):
                return (sum(d.textlength(w, font=f) + track * len(w) for w, f, _ in ws)
                        + space * max(len(ws) - 1, 0))

            rows, row = [], []
            for word in split(text, roman, slanted, fill):
                if row and width(row + [word]) > max_width:
                    rows.append(row)
                    row = [word]
                else:
                    row.append(word)
            rows.append(row)
            blocks.append((rows, track, size * 1.4, space, width))
        y = (H - sum(len(r) * lh for r, _, lh, _, _ in blocks) - gap * (len(blocks) - 1)) / 2
        for rows, track, lh, space, width in blocks:
            for row in rows:
                x = (W - width(row)) / 2
                for word, f, shade in row:
                    for c in word:
                        d.text((x, y + lh / 2), c, font=f, fill=shade, anchor='lm')
                        x += d.textlength(c, font=f) + track
                    x += space
                y += lh
            y += gap
        return im

    def credit(label, names, extra):
        return card([(label, 30, 255, GREY, 9), (names, 64, 340, WHITE, 7), (extra, 64, 430, WHITE, 7)])
    return {
        'black': card([]),
        'title': card([('THE BIG HACK', 118, H / 2, WHITE, 16)]),
        'w1': credit('WRITTEN BY', 'DYLAN AND MIKE', ''),
        'w2': credit('WRITTEN BY', 'DYLAN AND MIKE', 'AND CLAUDE'),
        'a1': credit('ADDITIONAL WRITING BY', 'CHARLIE AND LIAM', ''),
        'a2': credit('ADDITIONAL WRITING BY', 'CHARLIE AND LIAM', 'AND CLAUDE'),
        'cast': cast([('SJ', 'DYLAN'), ('BRENDAN', 'MIKE'), ('KRISTINA', 'CHARLIE'), ('MARCUS', 'LIAM'),
                      ('NARRATOR', 'ELEVENLABS'), ('DANA FROM HR', 'ELEVENLABS'),
                      ('JUDGE', 'VEO'), ('COPS', 'VEO'), ('PROSECUTOR', 'VEO'),
                      ('BLUE TEAM', 'VEO'), ('METLSTORM', 'HIMSELF')]),
        'plea': message([
            ("AI MIGHT BE ABLE TO WRITE CODE, BUT IT CAN'T CREATE ART.", 26, GREY, 5),
            ('PAY ARTISTS AND CREATIVES.', 50, WHITE, 4)], max_width=1160, gap=44),
        'real': message([
            ('OK ENOUGH AI BULLSHIT, THE REAL CREDITS TO', 30, GREY, 9),
            ('', 10, GREY, 1),
            ('SPUT ^ENABLING AND ENCOURAGING THIS', 34, WHITE, 2),
            ('SQUIRREL AND MADMAN ^AV', 34, WHITE, 2),
            ('LJ AND SHARROW ^PROPS', 34, WHITE, 2),
            ('JESS K AND MICROMILL.ORG ^*BOTH* OFFERING US LOOMS', 34, WHITE, 2),
            ('THE WHOLE KAWAIICON CR\u00dcE AND VOLUNTEERS', 34, WHITE, 2),
            ('ANYONE ELSE WHO HELPED SINCE WE GENERATED THIS',
             34, WHITE, 2)], max_width=1160, gap=16),
        'tech': card([('MUSIC BY', 30, 190, GREY, 9), ('SUNO', 64, 265, WHITE, 7),
                      ('PRERECORDED VIDEO BY', 30, 385, GREY, 9), ('GOOGLE VEO', 64, 460, WHITE, 7),
                      ('NEWS SOURCES', 64, 540, WHITE, 7)]),
    }


def join(parts, out):
    """Concatenate the cards and whatever follows, normalising as we go so a
    clip that was made somewhere else still joins cleanly."""
    steps, pads = [], ''
    for i in range(len(parts)):
        steps.append(f'[{i}:v]scale={W}:{H},fps={FPS},format=yuv420p,setsar=1[v{i}]')
        steps.append(f'[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo[a{i}]')
        pads += f'[v{i}][a{i}]'
    steps.append(f'{pads}concat=n={len(parts)}:v=1:a=1[v][a]')
    cmd = ['ffmpeg', '-v', 'error', '-y']
    for part in parts:
        cmd += ['-i', str(part)]
    subprocess.run(cmd + ['-filter_complex', ';'.join(steps), '-map', '[v]', '-map', '[a]',
                          '-c:v', 'libx264', '-crf', '16', '-c:a', 'aac', '-b:a', '192k',
                          str(out)], check=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', default=str(ROOT / 'build/credits/credits.mp4'))
    ap.add_argument('--source', help='video to take the audio from (default: download)')
    ap.add_argument('--fade', type=float, default=3.0, help='seconds of audio fade at the end')
    ap.add_argument('--append', nargs='+', default=[], metavar='VIDEO',
                    help='videos to join on after the cards, e.g. the guardrail gag')
    a = ap.parse_args()
    out = Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    source = Path(a.source) if a.source else out.parent / 'source.mp4'
    if not source.exists():
        print('Downloading', SOURCE_URL)
        urllib.request.urlretrieve(SOURCE_URL, source)
    font = next((f for f in SERIFS if Path(f).exists()), None)
    if not font:
        raise SystemExit('No serif font found; add one to SERIFS')
    italic = next((f for f in ITALICS if Path(f).exists()), font)

    hit = fit_grid()
    timeline = [(0, 'black'), (hit(0), 'title'), (hit(2), 'w1'), (hit(3), 'w2'),
                (hit(4), 'a1'), (hit(5), 'a2'), (hit(6), 'cast'), (hit(9), 'tech'),
                (hit(10), 'plea'), (hit(11), 'real'), (hit(15), 'black')]
    end = hit(16)
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        lines = []
        for name, im in cards(font, italic).items():
            im.save(tmp / f'{name}.png')
        for i, (t, name) in enumerate(timeline):
            f0 = round(t * FPS)
            f1 = round((timeline[i + 1][0] if i + 1 < len(timeline) else end) * FPS)
            lines.append(f"file '{tmp / name}.png'\nduration {(f1 - f0) / FPS:.5f}")
        lines.append(f"file '{tmp / 'black'}.png'")
        (tmp / 'list.txt').write_text('\n'.join(lines) + '\n')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(tmp / 'list.txt'),
                        '-i', str(source), '-map', '0:v', '-map', '1:a',
                        '-vf', f'fps={FPS},format=yuv420p', '-t', f'{end:.3f}',
                        '-af', f'afade=t=out:st={end - a.fade:.3f}:d={a.fade}',
                        '-c:v', 'libx264', '-crf', '16', '-c:a', 'aac', '-b:a', '192k',
                        str(out if not a.append else tmp / 'cards.mp4')], check=True)
        if a.append:
            join([tmp / 'cards.mp4'] + [Path(v) for v in a.append], out)
    for t, name in timeline:
        print(f'{t:7.3f}  {name}')
    print(f'{end:7.3f}  end of cards')
    for v in a.append:
        print(f'{"":7}  then {v}')
    print(f'{"":7}  -> {out}')


if __name__ == '__main__':
    main()
