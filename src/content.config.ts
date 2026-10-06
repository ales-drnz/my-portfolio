import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tagline: z.string(),
      summary: z.string(),
      kind: z.enum(['library', 'app', 'tool', 'system']),
      order: z.number(),
      featured: z.boolean().default(false),
      group: z.enum(['dart', 'linux', 'build', 'other']),
      /** other repos this page already covers, hidden from the repo grid */
      alsoCovers: z.array(z.string()).default([]),
      /** GitHub repo name under ales-drnz, for live stars / last push */
      repo: z.string().optional(),
      /** pub.dev package name, for live likes / downloads / points */
      package: z.string().optional(),
      platforms: z.array(z.string()).default([]),
      stack: z.array(z.string()).default([]),
      highlights: z.array(z.string()).default([]),
      logo: image().optional(),
      cover: image(),
      coverAlt: z.string(),
      /** CSS object-position for the cropped home-page cover */
      coverPosition: z.string().default('top'),
      /** portrait phone screenshots, shown side by side instead of a cropped cover */
      phones: z.array(image()).optional(),
      /** muted looping clip under /public, shown over the cover */
      coverVideo: z.string().optional(),
      links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
    }),
});

export const collections = { projects };
