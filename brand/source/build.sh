#!/usr/bin/env bash
# Rebuilds every brand asset from build.py.
# Needs: python3, rsvg-convert, ImageMagick (magick), ffmpeg, Firefox (headless).
#   ./build.sh            everything
#   ./build.sh --no-gif   skip the animated banners (the slow part)
set -euo pipefail

SRC="$(cd "$(dirname "$0")" && pwd)"
BRAND="$(dirname "$SRC")"
BUILD="$BRAND/.build"
FPS=10
JOBS=6

rm -rf -- "$BUILD"
python3 "$SRC/build.py" "$BUILD"
cp "$BRAND/fonts/"*.woff2 "$BUILD/html/"
cp "$BRAND/fonts/"*.woff2 "$BUILD/frames/"

# headless Firefox screenshot: shot <html> <out.png> <width> <height> <scale>
# (scale 2 renders a CSS-zoomed copy in a window twice the size: Firefox ignores devPixelsPerPx headless)
shot() {
  local profile page="$1"
  profile="$(mktemp -d "$BUILD/ff.XXXXXX")"
  if [[ "$5" != 1 ]]; then
    page="${1%.html}.x$5.html"
    sed "s|</head>|<style>html{zoom:$5}</style></head>|" "$1" > "$page"
  fi
  firefox --headless --no-remote --profile "$profile" --window-size="$(($3 * $5)),$(($4 * $5))" \
    --screenshot "$2" "file://$page" >/dev/null 2>&1
  rm -r -- "$profile"
}
export -f shot
export BUILD

# ---------------------------------------------------------------- logo
mkdir -p "$BRAND/logo"
cp "$BUILD/logo/"*.svg "$BRAND/logo/"
for theme in dark light; do
  for px in 1024 512 400; do
    rsvg-convert -w "$px" -h "$px" "$BUILD/logo/mark-$theme.svg" -o "$BRAND/logo/avatar-$theme-$px.png"
  done
done
rsvg-convert -w 1024 -h 1024 "$BUILD/logo/mark.svg" -o "$BRAND/logo/mark-transparent-1024.png"
rsvg-convert -w 1024 -h 1024 "$BUILD/logo/mark-on-dark.svg" -o "$BRAND/logo/mark-transparent-on-dark-1024.png"
mkdir -p "$BRAND/logo/favicon"
for px in 16 32 48 180 192 512; do
  rsvg-convert -w "$px" -h "$px" "$BUILD/logo/mark-dark.svg" -o "$BRAND/logo/favicon/favicon-$px.png"
done
magick "$BRAND/logo/favicon/favicon-16.png" "$BRAND/logo/favicon/favicon-32.png" "$BRAND/logo/favicon/favicon-48.png" \
  "$BRAND/logo/favicon/favicon.ico"
cp "$BUILD/logo/mark-dark.svg" "$BRAND/logo/favicon/favicon.svg"

# ---------------------------------------------------------------- static banners
mkdir -p "$BRAND/banners"
for theme in dark light; do
  # rendered at 2x, then downsampled for clean edges
  shot "$BUILD/html/linkedin-$theme.html" "$BRAND/banners/linkedin-$theme@2x.png" 1584 396 2
  magick "$BRAND/banners/linkedin-$theme@2x.png" -resize 1584x396 "$BRAND/banners/linkedin-$theme.png"
  shot "$BUILD/html/github-$theme.html" "$BUILD/github-$theme@2x.png" 1584 396 2
  magick "$BUILD/github-$theme@2x.png" -resize 2560x640 "$BRAND/banners/github-$theme@2x.png"
  magick "$BUILD/github-$theme@2x.png" -resize 1280x320 "$BRAND/banners/github-$theme.png"
  # X / Twitter header, 1500x500
  shot "$BUILD/html/x-$theme.html" "$BRAND/banners/x-$theme@2x.png" 1500 500 2
  magick "$BRAND/banners/x-$theme@2x.png" -resize 1500x500 "$BRAND/banners/x-$theme.png"
  # link preview (Open Graph) for the website, 1200x630
  shot "$BUILD/html/og-$theme.html" "$BUILD/og-$theme@2x.png" 1200 630 2
  magick "$BUILD/og-$theme@2x.png" -resize 1200x630 "$BRAND/banners/og-$theme.png"
done

# ---------------------------------------------------------------- animated banners
if [[ "${1:-}" != "--no-gif" ]]; then
  find "$BUILD/frames" -name '*.html' -print0 | sort -z |
    xargs -0 -P "$JOBS" -I{} bash -c 'shot "$1" "${1%.html}.png" 1584 396 1' _ {}
  for theme in dark light; do
    ffmpeg -loglevel error -y -framerate "$FPS" -i "$BUILD/frames/$theme-%03d.png" \
      -vf "scale=1280:320:flags=lanczos,split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle" \
      -loop 0 "$BRAND/banners/github-$theme-animated.gif"
    ffmpeg -loglevel error -y -framerate "$FPS" -i "$BUILD/frames/$theme-%03d.png" \
      -vf "scale=1280:320:flags=lanczos" -c:v libx264 -pix_fmt yuv420p -crf 20 -movflags +faststart \
      "$BRAND/banners/github-$theme-animated.mp4"
  done
fi

# live HTML versions (for the website): need the two fonts next to them
mkdir -p "$BRAND/banners/html"
cp "$BUILD/html/animated-"*.html "$BRAND/fonts/"*.woff2 "$BRAND/banners/html/"

rm -rf -- "$BUILD"
echo "done → $BRAND"
