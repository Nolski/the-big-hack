#!/usr/bin/env python3
"""Render the end-credits card video, cut on the drum hits of the audio track.

The cards are white serif text on black. Each change lands on a big drum hit
(HITS, in seconds, measured from the source track; the hits are two bars
apart, about 168 BPM, so later hits are extrapolated from the fitted grid).

The audio is not stored in Git. The source video is downloaded to the cache
folder on first use, or pass --source to use a file you already have.
Needs ffmpeg and Pillow (pip install pillow).

    python3 tools/make_credits.py [--out build/credits/credits.mp4] [--source video.mp4]
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
        """Centred paragraphs, wrapped. *Asterisks* put a word in italics."""
        im = Image.new('RGB', (W, H), 'black')
        d = ImageDraw.Draw(im)

        def split(text, roman, slanted):
            out = []
            for i, part in enumerate(text.split('*')):
                out += [(w, slanted if i % 2 else roman) for w in part.split()]
            return out

        blocks = []
        for text, size, fill, track in paragraphs:
            roman = ImageFont.truetype(font_path, size)
            slanted = ImageFont.truetype(italic_path, size)
            space = d.textlength(' ', font=roman)

            def width(ws, track=track, space=space):
                return (sum(d.textlength(w, font=f) + track * len(w) for w, f in ws)
                        + space * max(len(ws) - 1, 0))

            rows, row = [], []
            for word in split(text, roman, slanted):
                if row and width(row + [word]) > max_width:
                    rows.append(row)
                    row = [word]
                else:
                    row.append(word)
            rows.append(row)
            blocks.append((rows, fill, track, size * 1.4, space, width))
        y = (H - sum(len(r) * lh for r, _, _, lh, _, _ in blocks) - gap * (len(blocks) - 1)) / 2
        for rows, fill, track, lh, space, width in blocks:
            for row in rows:
                x = (W - width(row)) / 2
                for word, f in row:
                    for c in word:
                        d.text((x, y + lh / 2), c, font=f, fill=fill, anchor='lm')
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
            ('SPUT, FOR ENABLING AND ENCOURAGING THIS', 26, WHITE, 2),
            ('SQUIRREL AND MADMAN FOR THE AV', 26, WHITE, 2),
            ('MAD PROPS TO LJ AND SHARROW FOR THE PROPS', 26, WHITE, 2),
            ('JESS K AND MICROMILL.ORG FOR *BOTH* OFFERING US LOOMS', 26, WHITE, 2),
            ('THE WHOLE KAWAIICON CR\u00dcE AND VOLUNTEERS', 26, WHITE, 2),
            ('ANYONE ELSE WHO HELPED IN BETWEEN NOW AND WHEN WE GENERATED THIS',
             26, WHITE, 2)], max_width=1160, gap=16),
        'tech': card([('MUSIC BY', 30, 190, GREY, 9), ('SUNO', 64, 265, WHITE, 7),
                      ('PRERECORDED VIDEO BY', 30, 385, GREY, 9), ('GOOGLE VEO', 64, 460, WHITE, 7),
                      ('NEWS SOURCES', 64, 540, WHITE, 7)]),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', default=str(ROOT / 'build/credits/credits.mp4'))
    ap.add_argument('--source', help='video to take the audio from (default: download)')
    ap.add_argument('--fade', type=float, default=3.0, help='seconds of audio fade at the end')
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
                (hit(4), 'a1'), (hit(5), 'a2'), (hit(6), 'cast'), (hit(10), 'tech'), (hit(12), 'plea'), (hit(16), 'real'), (hit(21), 'black')]
    end = hit(22)
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
                        '-c:v', 'libx264', '-crf', '16', '-c:a', 'aac', '-b:a', '192k', str(out)], check=True)
    for t, name in timeline:
        print(f'{t:7.3f}  {name}')
    print(f'{end:7.3f}  end -> {out}')


if __name__ == '__main__':
    main()
