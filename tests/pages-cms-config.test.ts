import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

describe('Pages CMS contract', () => {
  const config = parse(readFileSync('.pages.yml', 'utf8'));
  const posts = config.content.find((entry: { name: string }) => entry.name === 'posts');

  it('edits Astro posts and the public image directory', () => {
    expect(config.media).toEqual({ input: 'public/images', output: '/images' });
    expect(posts.path).toBe('src/content/blog');
  });

  it('keeps the fields aligned with the Astro schema', () => {
    expect(posts.fields.map((field: { name: string }) => field.name)).toEqual([
      'title', 'slug', 'date', 'description', 'category', 'tags', 'draft', 'body',
    ]);
  });
});
