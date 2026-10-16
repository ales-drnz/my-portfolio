#!/usr/bin/env python3
"""Generates the ales-drnz brand sources: logo SVGs and the banner HTML pages.

Run through build.sh, which also rasterises everything (rsvg-convert for the
logo, headless Firefox for the banners) and assembles the GIF and MP4.

    python3 build.py <out-dir>

Everything the identity is made of lives in the constants below: change a
colour or the code layout here and rebuild.
"""
import sys
from pathlib import Path

# ---------------------------------------------------------------- identity
# Cyan → Navy, top row of the Tent to the bottom: the blues of the package icons and README diagrams.
# On dark grounds the navy end (#0D2A75) disappears, so the dark ramp is shifted one step lighter.
MIX = {
    'light': ['#A8EBF9', '#5B9BEF', '#3261B6', '#0D2A75'],
    'dark':  ['#A8EBF9', '#7FB3F5', '#5B9BEF', '#3261B6'],
}

THEMES = {
    'dark':  {'bg': '#121214', 'disc': '#0B0B0D', 'ink': '#EDEDED', 'dots': '#EDEDED1C', 'bar': '#EDEDED26', 'num': '#EDEDED55'},
    'light': {'bg': '#F7F7F5', 'disc': '#FFFFFF', 'ink': '#111318', 'dots': '#1113181F', 'bar': '#11131824', 'num': '#11131855'},
}

# The Tent: 5x4 cells, one colour per row
TENT = ['..#..', '.###.', '##.##', '#...#']
# optical centring on a 100-unit disc: the cells' area centroid (2.2 rows down) sits on the
# centre and the farthest corner touches a concentric guide circle of radius 36
CELL, GAP_K, CENTROID_ROW = 12.125, 0.16, 2.2

# Abstract code listing on the banners: (indent px, token widths px); HOT maps (line, token) → MIX index
CODE = [
    (0, [64, 110]), (28, [52, 88, 40]), (28, [120, 60]), (56, [80, 150]), (56, [44, 72, 98]),
    (28, [36]), (0, []), (0, [96, 58]), (28, [138, 52]), (56, [66, 112, 30]), (56, [90, 46]),
    (28, [48]), (0, [24]), (0, []),
]
HOT = {(0, 1): 0, (1, 1): 1, (3, 1): 0, (4, 2): 2, (8, 0): 1, (9, 1): 3, (10, 0): 2}

# Banner formats. "wide" is LinkedIn/GitHub (4:1). "og" is the link preview of the website (1.91:1). "x" is the X/Twitter header (3:1): there the profile
# photo covers the bottom-left third and the mobile app crops top and bottom, so the code and the
# phrase sit together in the upper band, clear of both.
FORMATS = {
    'wide': {'w': 1584, 'h': 396, 'code': 'left: 64px; top: 46px; bottom: 46px', 'side': 'right: 96px; top: 0; bottom: 0', 'phrase': 50},
    # LinkedIn: the profile photo covers the bottom-left corner (about x 50–365 from y 200 down), so the
    # code starts to the right of it and the mark is a little smaller to leave room
    'linkedin': {'w': 1584, 'h': 396, 'code': 'left: 410px; top: 46px; bottom: 46px', 'side': 'right: 96px; top: 0; bottom: 0', 'phrase': 50, 'mark': 120, 'fade': (30, 70)},
    'og':   {'w': 1200, 'h': 630, 'code': 'left: 72px; top: 189px; height: 252px', 'side': 'right: 80px; top: 0; bottom: 0', 'phrase': 44},
    'x':    {'w': 1500, 'h': 500, 'code': 'left: 400px; top: 132px; height: 252px', 'side': 'right: 170px; top: 318px; height: 120px', 'phrase': 46},
}

PERIOD = 12.0     # seconds, one loop of the animated banner
TYPE_STEP = 0.42  # a new line starts typing every TYPE_STEP seconds
TOKEN_STEP = 0.14 # and each token on it TOKEN_STEP after the previous one
TYPE_TIME = 0.5   # how long one token takes to type in
FADE = (9.6, 10.4)  # everything fades out together, then the screen stays empty until PERIOD


# ---------------------------------------------------------------- logo
def tent_cells(ramp):
    s, g = CELL, CELL * GAP_K
    x0, y0 = 50 - 2.5 * s, 50 - CENTROID_ROW * s
    for r, row in enumerate(TENT):
        for c, ch in enumerate(row):
            if ch == '#':
                yield x0 + c * s + g / 2, y0 + r * s + g / 2, s - g, ramp[r]


def logo_svg(ramp, disc=None, size=None):
    dims = f' width="{size}" height="{size}"' if size else ''
    body = ''.join(
        f'<rect x="{x:.3f}" y="{y:.3f}" width="{w:.3f}" height="{w:.3f}" rx="{w * 0.2:.3f}" fill="{fill}"/>'
        for x, y, w, fill in tent_cells(ramp))
    back = f'<circle cx="50" cy="50" r="50" fill="{disc}"/>' if disc else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"{dims}>{back}{body}</svg>\n'


# ---------------------------------------------------------------- banner
def keyframes(name, start, prop_from, prop_to):
    """One element's loop: hidden → typed in at `start` → held → fades out with everyone."""
    a, b = start / PERIOD * 100, (start + TYPE_TIME) / PERIOD * 100
    f0, f1 = FADE[0] / PERIOD * 100, FADE[1] / PERIOD * 100
    return (f'@keyframes {name} {{ 0%, {a:.2f}% {{ {prop_from}; opacity: 1 }} {b:.2f}% {{ {prop_to}; opacity: 1 }} '
            f'{f0:.2f}% {{ {prop_to}; opacity: 1 }} {f1:.2f}%, 100% {{ {prop_to}; opacity: 0 }} }}')


def banner_html(theme, logo=False, animated=False, frame_t=None, fmt='wide'):
    """A 1584x396 banner page. Static unless animated (live CSS loop, for the site) or
    frame_t is set (that instant of the loop, frozen through the Web Animations API, for GIF frames)."""
    p = THEMES[theme]
    F = FORMATS[fmt]
    fade = F.get('fade', (18, 62))  # where the dots fade in, left to right (% of the width)
    ramp = MIX[theme]
    # on the light ground the palest tone is too faint for text: the word starts one step darker
    text_ramp = ramp[1:] if theme == 'light' else ramp
    animated = animated or frame_t is not None
    css = []
    lines = []
    for i, (indent, widths) in enumerate(CODE):
        bars = ''
        for j, w in enumerate(widths):
            anim = ''
            if animated:
                css.append(keyframes(f't{i}_{j}', i * TYPE_STEP + j * TOKEN_STEP, 'transform: scaleX(0)', 'transform: scaleX(1)'))
                anim = f'animation:t{i}_{j} {PERIOD}s linear infinite both;'
            bars += (f'<span class="bar" style="width:{w}px;margin-left:{indent if j == 0 else 0}px;'
                     f'background:{ramp[HOT[(i, j)]] if (i, j) in HOT else p["bar"]};{anim}"></span>')
        num_anim = ''
        if animated:
            a, b = i * TYPE_STEP / PERIOD * 100, (i * TYPE_STEP + 0.2) / PERIOD * 100
            f0, f1 = FADE[0] / PERIOD * 100, FADE[1] / PERIOD * 100
            css.append(f'@keyframes n{i} {{ 0%, {a:.2f}% {{ opacity: 0 }} {b:.2f}%, {f0:.2f}% {{ opacity: 1 }} {f1:.2f}%, 100% {{ opacity: 0 }} }}')
            num_anim = f' style="animation:n{i} {PERIOD}s linear infinite both"'
        lines.append(f'<div class="line"><span class="num"{num_anim}>{i + 1:02d}</span><div class="bars">{bars}</div></div>')

    mark = ''
    if logo:
        mark = logo_svg(ramp, size=F.get('mark', 150)).replace('<svg ', '<svg class="mark" ', 1)

    anim_css = ''
    if animated:
        anim_css = '\n  '.join(css) + '\n  @media (prefers-reduced-motion: reduce) { .bar, .num { animation: none !important; } }'
    freeze = f"""<script>
      document.getAnimations().forEach(a => {{ a.pause(); a.currentTime = {frame_t * 1000:.1f}; }});
    </script>""" if frame_t is not None else ''

    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>ales-drnz banner</title>
<style>
  @font-face {{ font-family: Geist; src: url(geist.woff2) format('woff2'); font-weight: 100 900; }}
  @font-face {{ font-family: 'Geist Mono'; src: url(geist-mono.woff2) format('woff2'); font-weight: 100 900; }}
  html, body {{ margin: 0; background: {p['bg']}; }}
  .banner {{ width: {F['w']}px; height: {F['h']}px; position: relative; overflow: hidden; background: {p['bg']}; color: {p['ink']}; font-family: Geist, sans-serif; }}
  .dots {{ position: absolute; inset: 0;
          background-image: radial-gradient(circle, {p['dots']} 1.4px, transparent 1.9px);
          background-size: 22px 22px; background-position: 11px 11px;
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, transparent {fade[0]}%, #000 {fade[1]}%);
          mask-image: linear-gradient(90deg, transparent 0%, transparent {fade[0]}%, #000 {fade[1]}%); }}
  .code {{ position: absolute; {F['code']}; display: flex; flex-direction: column; justify-content: space-between; }}
  .line {{ display: flex; align-items: center; gap: 20px; }}
  .num {{ font-family: 'Geist Mono', monospace; font-size: 14px; color: {p['num']}; width: 22px; }}
  .bars {{ display: flex; gap: 9px; }}
  .bar {{ display: block; height: 12px; border-radius: 6px; transform-origin: left center; }}
  .side {{ position: absolute; {F['side']}; display: flex; align-items: center; gap: 36px; }}
  .phrase {{ font-size: {F['phrase']}px; font-weight: 600; letter-spacing: -0.025em; line-height: 1.12; text-align: {'left' if logo else 'right'}; }}
  .grad {{ background: linear-gradient(90deg, {', '.join(text_ramp)}); -webkit-background-clip: text; background-clip: text;
          color: transparent; -webkit-text-fill-color: transparent; }}
  {anim_css}
</style></head>
<body><div class="banner">
  <div class="dots"></div>
  <div class="code">{''.join(lines)}</div>
  <div class="side">{mark}<div class="phrase">Building <span class="grad">open-source</span><br>tools and apps</div></div>
</div>{freeze}</body></html>
"""


def main():
    out = Path(sys.argv[1] if len(sys.argv) > 1 else 'build')
    (out / 'logo').mkdir(parents=True, exist_ok=True)
    (out / 'html').mkdir(parents=True, exist_ok=True)
    (out / 'frames').mkdir(parents=True, exist_ok=True)

    (out / 'logo' / 'tent-dark.svg').write_text(logo_svg(MIX['dark'], disc=THEMES['dark']['disc']))
    (out / 'logo' / 'tent-light.svg').write_text(logo_svg(MIX['light'], disc=THEMES['light']['disc']))
    # transparent marks: one for light backgrounds, one for dark ones
    (out / 'logo' / 'tent.svg').write_text(logo_svg(MIX['light']))
    (out / 'logo' / 'tent-on-dark.svg').write_text(logo_svg(MIX['dark']))

    for theme in THEMES:
        (out / 'html' / f'linkedin-{theme}.html').write_text(banner_html(theme, logo=True, fmt='linkedin'))
        (out / 'html' / f'github-{theme}.html').write_text(banner_html(theme, logo=False))
        (out / 'html' / f'og-{theme}.html').write_text(banner_html(theme, logo=True, fmt='og'))
        (out / 'html' / f'x-{theme}.html').write_text(banner_html(theme, logo=False, fmt='x'))
        (out / 'html' / f'animated-{theme}.html').write_text(banner_html(theme, logo=False, animated=True))
        fps = 10
        for k in range(int(PERIOD * fps)):
            (out / 'frames' / f'{theme}-{k:03d}.html').write_text(banner_html(theme, logo=False, frame_t=k / fps))


if __name__ == '__main__':
    main()
