#!/usr/bin/env bash
# One time generation of the seven GOI rank badge emblems with Higgsfield Z Image (0.15 credits each),
# run sequentially. Raw downloads land in assets-raw/badge-<id>.png (git ignored); the archived
# originals live in assets-source/higgsfield/. Needs `higgsfield auth login`.
cd "$(dirname "$0")/.."
LOG=assets-raw/badges-log.txt
STYLE="Single modern glossy achievement badge emblem for a mobile game, centered with generous empty space around it, on a plain flat dark charcoal grey background. Clean 3D game UI icon style, soft studio lighting, crisp edges, slight glow. The center of the emblem is empty and blank. No text, no letters, no numbers, no words, no logos, no watermark."

run () { # id description
  echo "[$(date +%H:%M:%S)] start $1" >> "$LOG"
  out=$(higgsfield generate create z_image --aspect_ratio 1:1 --wait --prompt "$2. $STYLE" 2>&1 | tail -3)
  url=$(echo "$out" | grep -o 'https://[^ ]*\.png' | head -1)
  if [ -n "$url" ]; then curl -sSL -o "assets-raw/badge-$1.png" "$url" && echo "[$(date +%H:%M:%S)] ok $1" >> "$LOG"
  else echo "[$(date +%H:%M:%S)] FAILED $1: $(echo "$out" | tr '\n' ' ')" >> "$LOG"; fi
}

run grass "A matte grass green leaf shaped shield emblem with a small sprout on top and soft fresh green tones"
run rookie "A bronze hexagon medal emblem with a simple engraved border and warm copper highlights"
run farmer "A brushed silver five pointed star badge emblem with small wheat sprigs on the sides"
run lord "A polished gold shield emblem framed by a laurel wreath, rich yellow gold"
run legend "A glowing neon lime green circular ring emblem with an electric aura and sparks, dark metal core"
run peak "A deep purple and gold crown emblem with tiny stars and a cosmic nebula glow"
run ultimate "A black obsidian and gold crown emblem engulfed in bright lime and orange flames, the most prestigious looking"
echo "[$(date +%H:%M:%S)] ALL DONE; balance: $(higgsfield account status 2>&1)" >> "$LOG"
