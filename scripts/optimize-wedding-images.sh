#!/usr/bin/env bash
# scripts/optimize-wedding-images.sh
# Resize + recompress the raw wedding photos for web delivery.
# Originals are preserved under public/wedding/_originals/ (git-ignored).
set -euo pipefail
DIR="public/wedding"
ORIG="$DIR/_originals"
mkdir -p "$ORIG"

# source .JPG -> semantic lowercase .jpg (sorted N-files -> gallery-1..6)
map=(
  "N2551429.JPG:gallery-1.jpg"
  "N2551503.JPG:gallery-2.jpg"
  "N2552166.JPG:gallery-3.jpg"
  "N2570313.JPG:gallery-4.jpg"
  "N2570338.JPG:gallery-5.jpg"
  "N2571105.JPG:gallery-6.jpg"
  "groom.JPG:groom.jpg"
  "bride.JPG:bride.jpg"
)
for pair in "${map[@]}"; do
  src="${pair%%:*}"; out="${pair##*:}"
  [ -f "$DIR/$src" ] || { echo "skip missing $src"; continue; }
  # produce optimized web copy (max 2400px long edge, quality 80)
  sips -Z 2400 -s format jpeg -s formatOptions 80 "$DIR/$src" --out "$DIR/$out" >/dev/null
  # preserve original, then remove uppercase source from served dir
  mv "$DIR/$src" "$ORIG/$src"
  echo "optimized $src -> $out ($(du -h "$DIR/$out" | cut -f1))"
done
echo "Done. Optimized files in $DIR, originals in $ORIG."
