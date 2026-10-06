# ales-drnz.com

Personal portfolio, built with [Astro](https://astro.build), React islands, TypeScript and Tailwind CSS.

All GitHub and pub.dev numbers (stars, likes, downloads, contribution calendar, merged upstream PRs) are
fetched **at build time**, so the page ships as static HTML with no client-side API calls. A GitHub Action
rebuilds and deploys it to GitHub Pages on every push and once a night.

## Structure

- `src/content/projects/*.mdx` — one case study per project (frontmatter schema in `src/content.config.ts`)
- `src/lib/data.ts` — build-time GitHub / pub.dev fetching, memoized and failure-tolerant
- `src/lib/site.ts` — name, socials, skills
- `src/components/` — UI; `CommandPalette.tsx` is the only client-side React island (⌘K)
- `src/styles/global.css` — design tokens (light/dark) and prose styles
- `public/media/` — muted demo clips (GIFs converted to MP4)

## Adding a project

1. Put images in `src/assets/projects/<slug>/` (clips go in `public/media/<slug>/`).
2. Create `src/content/projects/<slug>.mdx`, following an existing one.
3. Set `featured: true` to show it as a large card on the home page.

## Development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

Set `GITHUB_TOKEN` locally to avoid GitHub's unauthenticated rate limit and to use the GraphQL
contribution calendar.

Easter eggs: press ⌘K and try `sudo hire-me`, or enter the Konami code.
