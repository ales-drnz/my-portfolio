# ales-drnz brand

Personal identity for Alessandro Di Ronza: the **Tent** mark and the code banners.

Design canvas (all boards, editable): https://claude.ai/artifact/Wz3CCG4GZxHGVbJ66fUrPA

## Palette — Cyan → Navy

The blues of the package icons and README diagrams, one per row of the Tent, top to bottom.

| Row | Light grounds | Dark grounds |
|---|---|---|
| 1 (apex) | `#A8EBF9` cyan | `#A8EBF9` cyan |
| 2 | `#5B9BEF` | `#7FB3F5` |
| 3 | `#3261B6` | `#5B9BEF` |
| 4 (base) | `#0D2A75` package navy | `#3261B6` |

On dark grounds the navy end would vanish (1.6:1), so the dark ramp is shifted one step lighter.
On the light banner the word "open-source" starts from the second tone, because the palest cyan is
too faint for text on white.

Grounds: dark `#121214` (banner) / `#0B0B0D` (disc), light `#F7F7F5` (banner) / `#FFFFFF` (disc).
Ink: `#EDEDED` on dark, `#111318` on light. Typeface: **Geist** (text) and **Geist Mono** (line numbers), in `fonts/`.

## The mark

The Tent is a 5×4 grid of rounded cells, one colour per row, top to bottom.

- **Optical centring**: the cells' area centroid sits on the disc centre, not the bounding box.
  The farthest corner touches a concentric guide circle of radius 36 on a 100-unit disc, so the
  mark survives circle crops (GitHub, LinkedIn) with margin.
- Cell gap 16% of the cell, corner radius 20% of the cell.

| File | Use |
|---|---|
| `logo/tent-dark.svg`, `logo/tent-light.svg` | mark on its disc |
| `logo/tent.svg`, `logo/tent-transparent-1024.png` | mark alone, for light backgrounds |
| `logo/tent-on-dark.svg`, `logo/tent-transparent-on-dark-1024.png` | mark alone, for dark backgrounds |
| `logo/avatar-{dark,light}-{1024,512,400}.png` | profile pictures (GitHub, LinkedIn, pub.dev, X…) |
| `logo/favicon/` | `favicon.ico` (16/32/48), `favicon.svg`, PNGs 16–512 (180 = Apple touch icon) |

## Banners

Code listing on the left (the line numbers and tokens type in, in the animated version), dot grid
fading out towards the code, and the phrase *Building **open-source** tools and apps* with the
gradient on "open-source".

| File | Size | Use |
|---|---|---|
| `banners/linkedin-{dark,light}.png` (+ `@2x`) | 1584×396 | LinkedIn background, with the mark; the code starts at x 410, clear of the profile photo (bottom left) |
| `banners/github-{dark,light}.png` (+ `@2x`) | 1280×320 | static header (README, anywhere) |
| `banners/x-{dark,light}.png` (+ `@2x`) | 1500×500 | X/Twitter header: content kept inside x 400–1330, y 130–440, clear of the desktop avatar (bottom left), the ~135 px the phone app crops from each side, and the status bar and back/search buttons it draws over the top |
| `banners/og-{dark,light}.png` | 1200×630 | link preview of the website (`og-dark` is `public/og.png`), with the mark |
| `banners/github-{dark,light}-animated.gif` | 1280×320 | animated header for a GitHub profile README |
| `banners/github-{dark,light}-animated.mp4` | 1280×320 | same loop as video (posts, LinkedIn Featured) |
| `banners/html/animated-{dark,light}.html` | 1584×396 | live CSS version for the website (keep the fonts next to it) |

The animation is one 12 s loop: each token types in on its turn, everything holds, fades out
together, then the screen stays empty for a moment.

GitHub README, switching with the viewer's theme:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="brand/banners/github-dark-animated.gif">
  <img alt="Building open-source tools and apps" src="brand/banners/github-light-animated.gif">
</picture>
```

LinkedIn shows the profile background as a still image (an uploaded GIF does not animate), so it
uses the static PNG.

## Rebuilding

Everything is generated from `source/build.py` (colours, the Tent, the code layout and the
animation timing are constants at the top):

```sh
cd brand/source
./build.sh            # everything (~3 minutes, the GIF frames are the slow part)
./build.sh --no-gif   # logo + static banners only (seconds)
```

Needs `python3`, `rsvg-convert`, ImageMagick (`magick`), `ffmpeg` and Firefox (used headless to
render the banners with the real fonts).

`canvas/` holds the source of the design canvas boards (Design Component files), so the canvas can
be rebuilt or edited later.
