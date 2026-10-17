// The ales-drnz identity, mirrored from the brand kit in ~/Scrivania/Brand (source/build.py generates
// the logo and the banners; source/sync.sh rewrites MARK below and the --c-mark* colours in global.css).

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
