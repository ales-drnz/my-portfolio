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
