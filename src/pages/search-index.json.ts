import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../lib/posts';
import { normalizeSearchText } from '../lib/post-utils';

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const index = posts.map((post) => ({
    title: post.data.title,
    slug: post.data.slug,
    description: post.data.description,
    category: post.data.category,
    tags: post.data.tags,
    text: normalizeSearchText(post.body ?? ''),
  }));

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
