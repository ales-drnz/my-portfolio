// The ales-drnz identity, mirrored from brand/source/build.py (the generator of the logo and the
// banners). Keep the two in sync: colours live in global.css as --c-ramp-*, geometry and the code
// listing live here.

// The Tent: 5x4 cells, one colour per row (row r takes --c-ramp-{r+1})
const TENT = ['..#..', '.###.', '##.##', '#...#'];
// optical centring on a 100-unit disc: the cells' area centroid (2.2 rows down) sits on the
// centre and the farthest corner touches a concentric guide circle of radius 36
const CELL = 12.125;
const GAP = CELL * 0.16;

export const TENT_CELLS = TENT.flatMap((row, r) =>
  [...row].flatMap((ch, c) =>
    ch === '#'
      ? [{ x: 50 - 2.5 * CELL + c * CELL + GAP / 2, y: 50 - 2.2 * CELL + r * CELL + GAP / 2, size: CELL - GAP, row: r }]
      : [],
  ),
);

// Abstract code listing: (indent px, token widths px); HOT maps "line:token" to a ramp index
export const CODE: [number, number[]][] = [
  [0, [64, 110]], [28, [52, 88, 40]], [28, [120, 60]], [56, [80, 150]], [56, [44, 72, 98]],
  [28, [36]], [0, []], [0, [96, 58]], [28, [138, 52]], [56, [66, 112, 30]], [56, [90, 46]],
  [28, [48]], [0, [24]], [0, []],
];
export const HOT: Record<string, number> = { '0:1': 0, '1:1': 1, '3:1': 0, '4:2': 2, '8:0': 1, '9:1': 3, '10:0': 2 };

// one loop: tokens type in on their turn, everything holds, fades out together, stays empty a moment
export const TIMING = { period: 12, typeStep: 0.42, tokenStep: 0.14, typeTime: 0.5, fade: [9.6, 10.4] as const };
