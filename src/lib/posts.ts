import { getCollection, type CollectionEntry } from 'astro:content';
import { sortNewestFirst } from './post-utils';

export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return sortNewestFirst(posts.map((post) => ({ ...post, date: post.data.date })))
    .map(({ date: _date, ...post }) => post as CollectionEntry<'blog'>);
}
