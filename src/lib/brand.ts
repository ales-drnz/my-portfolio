// The ales-drnz identity, mirrored from brand/source/build.py (the generator of the logo and the
// banners). Keep the two in sync: colours live in global.css (--c-ramp-*, --c-mark*), geometry and
// the code listing live here.

// The mark, "al_": one monoline stroke (a geometric a running along a filleted baseline into the l)
// plus an underscore cursor, in a construction space fitted by MARK.fit into the r36 guide circle
export const MARK = {
  stroke:
    'M42.15,37.85 L42.15,50 A12.15,12.15 0 0 1 17.85,50 A12.15,12.15 0 0 1 42.15,50 ' +
    'L42.15,57.15 A5,5 0 0 0 47.15,62.15 L55.15,62.15 A5,5 0 0 0 60.15,57.15 L60.15,20.35',
  cursor: 'M71.15,62.15 h8',
  weight: 10.36,
  fit: 'matrix(0.86 0 0 0.86 9.08 10.82)',
};

// Abstract code listing: (indent px, token widths px); HOT maps "line:token" to a ramp index
export const CODE: [number, number[]][] = [
  [0, [64, 110]], [28, [52, 88, 40]], [28, [120, 60]], [56, [80, 150]], [56, [44, 72, 98]],
  [28, [36]], [0, []], [0, [96, 58]], [28, [138, 52]], [56, [66, 112, 30]], [56, [90, 46]],
  [28, [48]], [0, [24]], [0, []],
];
export const HOT: Record<string, number> = { '0:1': 0, '1:1': 1, '3:1': 0, '4:2': 2, '8:0': 1, '9:1': 3, '10:0': 2 };

// one loop: tokens type in on their turn, everything holds, fades out together, stays empty a moment
export const TIMING = { period: 12, typeStep: 0.42, tokenStep: 0.14, typeTime: 0.5, fade: [9.6, 10.4] as const };
