# ales-drnz.com

Personal portfolio — plain HTML/CSS/JS, no build step, no dependencies.

Projects, stats and pub.dev package scores are fetched live from the GitHub and pub.dev APIs, so the page keeps itself up to date.

## Structure

- `index.html` — terminal-style hero, featured project, repo grid, package stats, contribution graph
- `style.css` — dark theme, Flutter-blue accent, all colors in `:root` variables
- `script.js` — live data loading + interactive terminal (click the prompt and type `help`)
- `404.html` — terminal-style not-found page

## Local preview

Any static server works, e.g.:

```sh
npx serve .
```
