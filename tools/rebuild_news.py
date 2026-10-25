#!/usr/bin/env python3
"""Rebuild the play's news films; write previews, never the running show."""

import argparse
import json
import math
from pathlib import Path
import shutil
import subprocess
import sys

REPO = Path(__file__).resolve().parents[1]
STAGE = REPO / "stage"
NEWS = STAGE / "assets/filmed/news"
CONFIG = NEWS / "rebuild.json"
IMAGE = "bighack-news-rebuild:1"
DATA = json.loads(CONFIG.read_text(encoding="utf-8"))
WORK = None
SIZE = "1920x1080"
FPS = 30


def source(relative):
    path = STAGE / relative
    if not path.is_file():
        raise FileNotFoundError(f"Missing source: {path}")
    return path


def run(args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-filter_complex_threads", "1",
                    *map(str, args)], check=True)


def duration(path):
    return float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "csv=p=0", str(path)], text=True))


def codec(crf=19):
    return ["-c:v", "libx264", "-threads", "2", "-preset", "fast", "-crf", str(crf),
            "-pix_fmt", "yuv420p", "-r", str(FPS), "-video_track_timescale", "15360",
            "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2"]


def fit():
    w, h = SIZE.split("x")
    return (f"scale={w}:{h}:force_original_aspect_ratio=decrease,"
            f"pad={w}:{h}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps={FPS},format=yuv420p")


def concat(paths, name):
    listing = WORK / (name + ".txt")
    listing.write_text("".join("file '" + str(p).replace("'", "'\\''") + "'\n"
                               for p in paths), encoding="utf-8")
    out = WORK / (name + ".mp4")
    run(["-f", "concat", "-safe", "0", "-i", listing, "-c", "copy", out])
    return out


def card(name, seconds, picture=None):
    out = WORK / (name + ".mp4")
    video = (["-loop", "1", "-framerate", str(FPS), "-i", source(picture)] if picture else
             ["-f", "lavfi", "-i", f"color=c=0x0c0e11:s={SIZE}:r={FPS}"])
    run([*video, "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo",
         "-t", seconds, "-vf", "setsar=1", *codec(), out])
    return out


def shot(name, item, vf=None, af=None, hiss=0):
    """Separate picture/sound seeks preserve the original reports' B-roll edits."""
    out = WORK / (name + ".mp4")
    length = item["length"]
    video_start = item.get("visual", item.get("start", 0))
    audio_start = item.get("start", 0)
    args = ["-threads", "2", "-ss", video_start, "-i", source(item.get("videoFile", item["file"])),
            "-threads", "2", "-ss", audio_start, "-i", source(item["file"])]
    video = vf or fit()
    audio = af or "loudnorm=I=-17:TP=-2:LRA=7,aresample=48000"
    filters = (f"[0:v]{video},tpad=stop_mode=clone:stop_duration=0.2,"
               f"trim=duration={length},setpts=PTS-STARTPTS[v];"
               f"[1:a]atrim=duration={length},asetpts=PTS-STARTPTS,{audio},apad,"
               f"atrim=duration={length}[voice]")
    if hiss:
        filters += (f";anoisesrc=color=pink:amplitude={hiss}:r=48000[hiss];"
                    "[voice][hiss]amix=inputs=2:duration=first:normalize=0[a]")
    else:
        filters += ";[voice]anull[a]"
    run([*args, "-filter_complex", filters, "-map", "[v]", "-map", "[a]",
         "-t", length, *codec(), out])
    return out


def lead(report, picture, name):
    """Hold date 3.5s; report audio starts at 2s and its picture at 3.5s."""
    title = card(name + "-card", 3.5, picture)
    length = duration(report) + 2
    filters = ("[0:v]trim=start=1.5,setpts=PTS-STARTPTS[report];"
               "[1:v]setpts=PTS-STARTPTS[date];"
               "[date][report]concat=n=2:v=1:a=0[v];"
               f"[0:a]adelay=2000:all=1,apad,atrim=duration={length}[a]")
    out = WORK / (name + ".mp4")
    run(["-i", report, "-i", title, "-filter_complex", filters,
         "-map", "[v]", "-map", "[a]", "-t", length, *codec(), out])
    return out


def mix(dry, name, fade_in=.12, fade_out=1.1, fade_at=None, opening=False):
    length = duration(dry)
    out = WORK / (name + ".mp4")
    if opening:
        music = "[1:a]volume=0.55[m]"
        duck = "threshold=0.02:ratio=7:attack=15:release=220"
    else:
        fade_at = length - fade_out if fade_at is None else fade_at
        music = (f"[1:a]atrim=duration={length},asetpts=PTS-STARTPTS,"
                 "loudnorm=I=-17:TP=-2:LRA=9,volume=0.45,"
                 f"afade=t=in:d={fade_in},afade=t=out:st={fade_at}:d={fade_out}[m]")
        duck = "threshold=0.028:ratio=5:attack=12:release=350"
    filters = (f"[0:a]asplit=2[voice][key];{music};"
               f"[m][key]sidechaincompress={duck}[duck];"
               "[voice][duck]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.94[a]")
    run(["-i", dry, "-stream_loop", "-1", "-i", source(DATA["score"]),
         "-filter_complex", filters, "-map", "0:v", "-map", "[a]", "-t", length,
         "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out])
    return out


def opening():
    parts = []
    for n, item in enumerate(DATA["opening"]["clips"]):
        length = item["length"]
        cuts = item["cuts"]
        if item["name"] == "blackhat-clean":
            filters = ("[0:v]crop=375:495:900:120,split=2[bg][fg];"
                       "[bg]scale=1920:1080:force_original_aspect_ratio=increase,"
                       "crop=1920:1080,boxblur=35:3[b];[fg]scale=-2:1080[f];"
                       "[b][f]overlay=(W-w)/2:0,setsar=1[base];")
        else:
            filters = ("[0:v]scale=1920:1080:force_original_aspect_ratio=increase,"
                       "crop=1920:1080,setsar=1[base];")
        if cuts:
            filters += "[base]split=3[wide][c1][c2];"
            if item["name"] == "breach-clip":
                filters += ("[c1]crop=1120:630:800:300,scale=1920:1080[z1];"
                            "[c2]crop=1760:990:80:20,scale=1920:1080[z2];")
            else:
                filters += ("[c1]crop=1760:990:80:20,scale=1920:1080[z1];"
                            "[c2]crop=1600:900:160:40,scale=1920:1080[z2];")
            second = cuts[1] if len(cuts) > 1 else length + 1
            filters += (f"[wide][z1]overlay=enable='between(t,{cuts[0]},{second})'[mid];"
                        f"[mid][z2]overlay=enable='gte(t,{second})',fps=30,format=yuv420p[v]")
        else:
            filters += "[base]fps=30,format=yuv420p[v]"
        filters += ";[0:a]loudnorm=I=-17:TP=-2:LRA=7,aresample=48000,apad[a]"
        out = WORK / f"opening-{n}.mp4"
        run(["-ss", item["start"], "-i", source(item["file"]), "-filter_complex", filters,
             "-map", "[v]", "-map", "[a]", "-t", length, *codec(), out])
        parts.append(out)
    news = mix(concat(parts, "news-dry"), "news", opening=True)
    parts = [news]
    for n, relative in enumerate(DATA["opening"]["narration"]):
        audio = source(relative)
        out = WORK / f"narration-{n}.mp4"
        length = math.ceil(duration(audio) * FPS) / FPS
        run(["-f", "lavfi", "-i", f"color=c=black:s={SIZE}:r={FPS}", "-i", audio,
             "-t", length, "-af", "loudnorm=I=-17:TP=-2:LRA=7,aresample=48000,apad",
             *codec(), out])
        parts.append(out)
    parts.append(card("opening-date", 5, DATA["opening"]["card"]))
    return concat(parts, "opening")


def time_jump(key):
    recipe = DATA["timeJumps"][key]
    parts = [card("black-intro", 2)]
    for n, group in enumerate(recipe["groups"]):
        shots = []
        for m, item in enumerate(group["clips"]):
            d = item["length"]
            af = ("loudnorm=I=-17:TP=-2:LRA=7,aresample=48000,"
                  f"afade=t=in:d=0.015,afade=t=out:st={d-.035}:d=0.035")
            shots.append(shot(f"group-{n}-shot-{m}", item, af=af))
        parts.append(lead(concat(shots, f"group-{n}"), group["card"], f"lead-{n}"))
    end = card("return-date", 4, recipe["returnCard"])
    if recipe["mixBeforeReturn"]:
        mixed = mix(concat(parts, "dry"), "mixed")
        result = concat([mixed, end], "with-return")
    else:
        result = mix(concat(parts + [end], "dry"), "mixed")
    if recipe["muteUntil"]:
        out = WORK / "piano-lead.mp4"
        run(["-i", result, "-c:v", "copy", "-af", f"volume=0:enable='lt(t,{recipe['muteUntil']})'",
             "-c:a", "aac", "-b:a", "192k", out])
        result = out
    return result


def three_day():
    reports = []
    for n, item in enumerate(DATA["threeDay"]):
        if n == 7:
            paths = []
            for k, (start, length) in enumerate([(0, 6.65), (.5, 6.55)], 1):
                paths.append(shot(f"nuclear-{k}", {
                    "file": f"assets/filmed/news/raw/three-day/08-nuclear-plant-part-{k}.mp4",
                    "start": start, "length": length},
                    vf=("crop=iw*0.94:ih*0.94,scale=1280:720," if k == 2 else "") + "setsar=1,fps=30",
                    af="anull"))
            nuclear = concat(paths, "nuclear-dry")
            normalized = WORK / "nuclear-source.mp4"
            run(["-i", nuclear, "-c:v", "copy", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
                 "-c:a", "aac", "-ar", "48000", normalized])
            out = WORK / "report-8.mp4"
            run(["-i", normalized, "-vf", "scale=1920:1080,setsar=1,fps=30",
                 "-af", DATA["treatments"]["newsAudio"], *codec(), out])
        else:
            out = shot(f"report-{n+1}", item, af=DATA["treatments"]["newsAudio"])
        reports.append(out)
    parts = []
    for n, report in enumerate(reports):
        if n in (0, 3, 5):
            day = {0: 1, 3: 2, 5: 3}[n]
            report = lead(report, f"assets/filmed/news/graphics/three-day-{day}.png", f"day-{day}")
        parts.append(report)
    nuclear_at = sum(duration(p) for p in parts[:-1])
    return mix(concat(parts, "dry"), "three-day", fade_out=1.2, fade_at=nuclear_at)


def collapse():
    t = DATA["treatments"]
    parts = []
    for n, filename in enumerate([
        "01-flight-bookings", "02-brownouts-dialogue-source", "03-analogue-television",
        "04-radio-bulletin", "05-courthouse-trial", "06-courthouse-worm-author"]):
        item = {"file": f"assets/filmed/news/raw/collapse-to-trial/{filename}.mp4", "length": 8.1}
        vf, af, hiss = t["plainVideo"], t["plainAudio"], .0015
        if n == 1:
            item["videoFile"] = "assets/filmed/news/raw/collapse-to-trial/02-brownouts-picture.mp4"
        if n == 2:
            vf, af = t["crtVideo"], t["crtAudio"]
        if n >= 3:
            vf += "," + ("crop=900:506:190:0,scale=1280:720," if n == 4 else "") + t["sepiaVideo"]
            af, hiss = t["radioAudio"], .007
        report = shot(filename, item, vf=vf + ",setsar=1", af=af, hiss=hiss)
        if n in (0, 2, 4):
            label = {0: "week-one", 2: "week-three", 4: "months-later"}[n]
            report = lead(report, f"assets/filmed/news/graphics/collapse-{label}.png", f"lead-{n}")
        parts.append(report)
    parts.append(card("trial-begins", 2.5, "assets/filmed/news/graphics/collapse-trial-begins.png"))
    return mix(concat(parts, "dry"), "collapse", fade_in=1, fade_out=4)


def sentencing():
    parts = []
    for n, length in [(1, 7.7), (2, 8)]:
        item = {"file": f"assets/filmed/news/raw/sentencing/0{n}-" +
                ("judge-statement.mp4" if n == 1 else "maximum-punishment.mp4"), "length": length}
        af = "highpass=f=70,loudnorm=I=-17:TP=-2:LRA=9,aresample=48000,highpass=f=150,lowpass=f=5500"
        parts.append(shot(f"quote-{n}", item, vf=DATA["treatments"]["sentencingVideo"], af=af))
    for n, item in enumerate(DATA["sentencing"]["real"]):
        vf = (item["crop"] + "," if item.get("crop") else "") + fit()
        parts.append(shot(f"statement-{n}", item, vf=vf, af=f"volume={item['gain']}"))
    return mix(concat(parts, "dry"), "sentencing")


def reporter(key):
    item = DATA["reporters"][key]
    font = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    bold = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
    # Existing lower-third layout. DejaVu is included in the container, unlike Arial.
    vf = ("drawbox=x=44:y=568:w=530:h=104:color=black@0.78:t=fill,"
          "drawbox=x=44:y=568:w=5:h=104:color=white@0.9:t=fill,"
          f"drawtext=fontfile='{bold}':text='{item['name']}':fontsize=32:fontcolor=white:x=68:y=583,"
          f"drawtext=fontfile='{font}':text='{item['role']}':fontsize=25:fontcolor=white:x=68:y=626")
    out = WORK / (key + ".mp4")
    run(["-i", source(f"assets/filmed/news/raw/interviews/reporter-{item['person']}.mp4"),
         "-vf", vf, "-c:v", "libx264", "-preset", "fast", "-crf", "18",
         "-pix_fmt", "yuv420p", "-c:a", "copy", out])
    return out


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("film", nargs="?", default="all", choices=["all", *DATA["targets"]])
    parser.add_argument("--list", action="store_true", help="List films and their current cue IDs")
    parser.add_argument("--native", action="store_true", help="Use already installed FFmpeg instead of Docker")
    parser.add_argument("--output", type=Path, default=REPO / "build/news")
    args = parser.parse_args()
    if args.list:
        for key, target in DATA["targets"].items():
            print(f"{key:14} {target['cue']:38} {target['referenceSeconds']:.1f}s")
        return
    output = args.output.resolve()
    if output.is_relative_to(STAGE):
        parser.error("Use a preview folder outside stage/; builds must not overwrite the running show.")
    output.mkdir(parents=True, exist_ok=True)
    if not args.native:
        if not shutil.which("docker"):
            parser.error("Start Docker, or use --native if FFmpeg is already installed.")
        if subprocess.run(["docker", "image", "inspect", IMAGE], stdout=subprocess.DEVNULL,
                          stderr=subprocess.DEVNULL).returncode:
            subprocess.run(["docker", "build", "-t", IMAGE, str(REPO / "tools/news-montages")], check=True)
        subprocess.run([
            "docker", "run", "--rm", "--network", "none", "--read-only", "--cap-drop", "ALL",
            "--security-opt", "no-new-privileges", "--tmpfs", "/tmp:rw,noexec,nosuid",
            "--mount", f"type=bind,src={REPO},dst=/repo,readonly",
            "--mount", f"type=bind,src={output},dst=/out", IMAGE,
            "python3", "/repo/tools/rebuild_news.py", args.film, "--native", "--output", "/out"], check=True)
        return
    if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
        parser.error("FFmpeg and ffprobe are required for --native; omit --native to use Docker.")
    global WORK, SIZE, FPS
    for key in DATA["targets"] if args.film == "all" else [args.film]:
        target = DATA["targets"][key]
        WORK = output / ("work-" + key)
        WORK.mkdir(exist_ok=True)
        SIZE, FPS = ("1280x720", 24) if key == "collapse" else ("1920x1080", 30)
        print(f"Building {key} ({target['cue']})…", flush=True)
        if key.startswith("time-jump-"):
            film = time_jump(key)
        elif key.startswith("reporter-"):
            film = reporter(key)
        else:
            film = {"opening": opening, "three-day": three_day, "collapse": collapse,
                    "sentencing": sentencing}[key]()
        dest = output / Path(target["output"]).name
        run(["-i", film, "-map", "0:v:0", "-map", "0:a:0", "-c", "copy",
             "-movflags", "+faststart", dest])
        print(f"Ready: {dest} ({duration(dest):.2f}s; reference {target['referenceSeconds']:.2f}s)", flush=True)


if __name__ == "__main__":
    try:
        main()
    except (FileNotFoundError, subprocess.CalledProcessError) as error:
        print(f"Build failed: {error}", file=sys.stderr)
        sys.exit(1)
