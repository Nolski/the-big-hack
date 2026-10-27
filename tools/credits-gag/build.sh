#!/bin/sh
# Render the guardrail gag. Everything lands in build/credits-gag/, which Git
# ignores; nothing here is needed to edit or present the play.
#
#   tools/credits-gag/build.sh
#
# Needs ffmpeg, python3, and node with Playwright's Chromium available.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
ROOT=$(cd "$HERE/../.." && pwd)
OUT=${OUT:-$ROOT/build/credits-gag}
KEYS="$OUT/samples/keyboard-soundpack-1"
export OUT
mkdir -p "$OUT"

if [ ! -d "$KEYS/Single Keys" ]; then
  echo "Fetching the CC0 keyboard samples (see README.md)"
  mkdir -p "$KEYS"
  curl -fsSL -o "$OUT/samples/pack.zip" \
    https://opengameart.org/sites/default/files/unicae_games_keyboard_soundpack_1_0.zip
  unzip -oq "$OUT/samples/pack.zip" -d "$KEYS"
fi

node "$HERE/keystrokes.js"                       # typing rhythm -> keys.json
node "$HERE/render.js"                           # picture -> silent.mp4
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/silent.mp4")
python3 -I "$HERE/retrigger.py" "$KEYS/Single Keys" "$OUT/keys.json" "$D" "$OUT/keyboard.wav"
ffmpeg -v error -y -i "$OUT/silent.mp4" -i "$OUT/keyboard.wav" -map 0:v -map 1:a \
  -c:v copy -ac 2 -c:a aac -b:a 192k -shortest "$OUT/guardrail-gag.mp4"
echo "$OUT/guardrail-gag.mp4  ${D}s"
