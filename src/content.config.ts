import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog', retainBody: true }),
  schema: z.object({
    title: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    date: z.coerce.date(),
    description: z.string().min(20).max(220),
    category: z.enum(['技术', '随想', '札记']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean(),
  }),
});

export const collections = { blog };
