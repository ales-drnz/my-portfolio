/* Material Symbols Rounded (weight 400), the set flutter.dev uses, read from @material-symbols/svg-400
   at build time and inlined: no icon font and no request at runtime. */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const require = createRequire(join(process.cwd(), 'package.json'));
const cache = new Map<string, string>();

/** the inner markup of a symbol, drawn on a 0 -960 960 960 box; throws on an unknown name so a typo fails the build */
export function symbolPaths(name: string, fill = false): string {
  const file = `${name}${fill ? '-fill' : ''}.svg`;
  let inner = cache.get(file);
  if (inner === undefined) {
    let svg: string;
    try {
      svg = readFileSync(require.resolve(`@material-symbols/svg-400/rounded/${file}`), 'utf8');
    } catch {
      throw new Error(`Material Symbol not found: rounded/${file}`);
    }
    inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    cache.set(file, inner);
  }
  return inner;
}

/* The ink box of the symbols drawn beside figures, measured with getBBox() on the rounded, weight-400 set
   (x, y, width, height on the 0 -960 960 960 grid). Glyphs fill 67-88% of their box, each differently, so a
   figure's icon is cropped to its ink to match the digits' height exactly. */
const INK: Record<string, [number, number, number, number]> = {
  apps: [160, -800, 640, 640],
  deployed_code: [120, -883, 720, 806],
  download: [160, -800, 640, 640],
  merge: [226, -828, 508, 696],
  star: [124, -833, 712, 681],
  task_alt: [80, -880, 800, 800],
  thumb_up: [80, -885, 840, 765],
};

/** the viewBox cropped to the symbol's ink; throws for a symbol not measured yet, so the build says so */
export function inkBox(name: string): [number, number, number, number] {
  const box = INK[name];
  if (!box) throw new Error(`No ink box for Material Symbol "${name}": measure it and add it to INK in lib/symbols.ts`);
  return box;
}
