#!/usr/bin/env bash
# Resize oversized mock assets in-place.
# Default is dry-run; pass --apply to actually overwrite files.
# Requires: ffmpeg, sips (macOS built-in).
#
# Recover originals with `git checkout -- public/mock/...` before committing.

set -euo pipefail

APPLY=0
[[ "${1:-}" == "--apply" ]] && APPLY=1

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

human_size() {
  local bytes=$1
  awk -v b="$bytes" 'BEGIN {
    split("B KB MB GB", u);
    i = 1;
    while (b >= 1024 && i < 4) { b /= 1024; i++ }
    printf "%.1f%s", b, u[i]
  }'
}

resize_video() {
  local file=$1 width=$2 crf=$3
  [[ -f $file ]] || return 0
  local before=$(stat -f%z "$file")
  local dims=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$file")
  if [[ $APPLY -eq 1 ]]; then
    local tmp="${file}.tmp.mp4"
    ffmpeg -y -loglevel error -i "$file" \
      -vf "scale=${width}:-2" \
      -c:v libx264 -preset slow -crf "$crf" \
      -c:a aac -b:a 96k -movflags +faststart \
      "$tmp"
    mv "$tmp" "$file"
    local after=$(stat -f%z "$file")
    printf "  %-45s %s -> %s  (%s -> %s)\n" "$file" "$dims" "${width}×auto" "$(human_size $before)" "$(human_size $after)"
  else
    printf "  %-45s %s -> %s  (current %s, crf %s)\n" "$file" "$dims" "${width}×auto" "$(human_size $before)" "$crf"
  fi
}

resize_image() {
  local file=$1 max=$2
  [[ -f $file ]] || return 0
  local before=$(stat -f%z "$file")
  local dims=$(sips -g pixelWidth -g pixelHeight "$file" 2>/dev/null | awk '/pixel/ {print $2}' | paste -sd× -)
  if [[ $APPLY -eq 1 ]]; then
    sips -Z "$max" "$file" >/dev/null
    local after=$(stat -f%z "$file")
    printf "  %-55s %s -> max ${max}px  (%s -> %s)\n" "$file" "$dims" "$(human_size $before)" "$(human_size $after)"
  else
    printf "  %-55s %s -> max ${max}px  (current %s)\n" "$file" "$dims" "$(human_size $before)"
  fi
}

echo "Mode: $([[ $APPLY -eq 1 ]] && echo APPLY || echo DRY-RUN)"
echo

echo "Creative videos (1920×3414 → 720 wide):"
for f in public/mock/creative/*.mp4; do
  resize_video "$f" 720 24
done
echo

echo "Other videos:"
resize_video public/mock/video/video.mp4 1280 23
resize_video public/mock/photo/video.mp4 1280 23
resize_video public/mock/motion/vigilant.mp4 960 23
echo

echo "Billboard JPEGs (4500×3000 → max 2880px):"
for f in public/mock/branding/billboard-*.jpg; do
  resize_image "$f" 2880
done
echo

echo "Graphic carousel (rendered at ~232px, source up to 5000px → max 1200px):"
for f in public/mock/graphic/*.{jpg,png,jpeg}; do
  [[ -f $f ]] || continue
  resize_image "$f" 1200
done
echo

echo "Social padded (2650×3990 → max 1200px):"
for f in public/mock/social/*-padded.png; do
  resize_image "$f" 1200
done
echo

if [[ $APPLY -eq 0 ]]; then
  echo "Dry run complete. Re-run with --apply to overwrite files."
  echo "Originals will be recoverable via git until you commit."
fi
