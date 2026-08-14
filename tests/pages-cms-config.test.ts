import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

describe('Pages CMS contract', () => {
  const config = parse(readFileSync('.pages.yml', 'utf8'));
  const posts = config.content.find((entry: { name: string }) => entry.name === 'posts');
  const field = (name: string) => posts.fields.find((entry: { name: string }) => entry.name === name);

  it('edits Astro posts and the public image directory', () => {
    expect(config.media).toEqual({ input: 'public/images', output: '/images' });
    expect(posts.path).toBe('src/content/blog');
  });

  it('keeps the fields aligned with the Astro schema', () => {
    expect(posts.fields.map((field: { name: string }) => field.name)).toEqual([
      'title', 'slug', 'date', 'description', 'category', 'tags', 'draft', 'body',
    ]);
  });

  it('writes Markdown frontmatter files from the slug field', () => {
    expect(posts.format).toBe('yaml-frontmatter');
    expect(posts.filename).toEqual({ template: '{fields.slug}.md', field: 'create' });
  });

  it('enforces the Astro frontmatter field contract', () => {
    expect(field('title')).toMatchObject({ type: 'string', required: true });
    expect(field('slug')).toMatchObject({
      type: 'string',
      required: true,
      pattern: { regex: '^[a-z0-9]+(?:-[a-z0-9]+)*$' },
    });
    expect(field('date')).toMatchObject({
      type: 'date',
      required: true,
      options: { format: 'yyyy-MM-dd' },
    });
    expect(field('description')).toMatchObject({
      type: 'text',
      required: true,
      options: { minlength: 20, maxlength: 220 },
    });
    expect(field('category')).toMatchObject({
      type: 'select',
      required: true,
      options: {},
    });
    expect(field('category').options.values).toEqual(['技术', '随想', '札记']);
    expect(field('tags')).toMatchObject({ type: 'string', list: true });
    expect(field('draft')).toMatchObject({ type: 'boolean', default: true, required: true });
    expect(field('body')).toMatchObject({ type: 'rich-text', required: true });
  });
});
