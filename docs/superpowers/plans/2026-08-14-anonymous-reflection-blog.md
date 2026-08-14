# 匿名技术与随想博客实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个可通过网页后台或本地 Markdown 写作、能够自动部署、适合匿名记录技术与思考的公开博客。

**Architecture:** Astro 在构建阶段读取 Markdown 内容并生成静态页面；纯函数负责阅读时长、归档、标签和搜索文本处理。Pages CMS 直接编辑 GitHub 仓库中的同一批 Markdown 文件，Vercel 在仓库更新后运行检查并部署，构建失败时不替换线上正常版本。

**Tech Stack:** Astro 5+、TypeScript、Markdown Content Collections、Vitest、Pages CMS、GitHub、Vercel、原生 CSS 与浏览器 JavaScript。

## Global Constraints

- 网站匿名公开，默认不展示真实姓名、单位、私人邮箱或私人联系方式。
- 首版栏目固定为“技术”“随想”“札记”。
- 首版不包含评论、点赞、读者注册、访问统计、广告和第三方行为追踪。
- 每篇公开文章必须包含标题、发布日期、摘要、栏目、标签、草稿状态和 Markdown 正文。
- 桌面和手机均需支持首页、文章、归档、栏目、标签、搜索、关于和 404 页面。
- 视觉采用暖米色、暗红褐色、克制衬线字体的“旧刊与札记”方向，同时使用 Astro 内置 Shiki 代码高亮并保证代码块清晰可读。
- 内容与代码必须保存在 GitHub；网页后台不得引入独立内容数据库。
- 项目命令统一使用 `pnpm`，Node.js 版本要求为 20 或更高。

---

## 文件结构

```text
.
├── .pages.yml                         # Pages CMS 字段、媒体目录与文章集合
├── README.md                          # 项目入口和常用命令
├── astro.config.mjs                   # Astro、站点 URL 和 sitemap 配置
├── package.json                       # 开发、检查、测试、构建与隐私检查命令
├── tsconfig.json                      # Astro 严格 TypeScript 配置
├── public/
│   ├── favicon.svg                    # 匿名博客图标
│   └── images/.gitkeep                # Pages CMS 图片目录
├── scripts/
│   └── check-image-metadata.mjs       # 阻止带 EXIF 标记的图片进入构建
├── src/
│   ├── content.config.ts              # 文章集合及 frontmatter 校验
│   ├── content/blog/
│   │   ├── confusion-is-not-failure.md
│   │   ├── error-as-a-clue.md
│   │   └── private-draft.md
│   ├── config/site.ts                 # 站名、描述、导航与栏目常量
│   ├── layouts/
│   │   ├── BaseLayout.astro           # HTML、SEO、页头、页脚与全局样式
│   │   └── PostLayout.astro           # 文章元信息和正文容器
│   ├── components/
│   │   ├── Header.astro               # 主导航与移动端布局
│   │   ├── Footer.astro               # 匿名说明与版权
│   │   ├── PostCard.astro             # 首页和列表页文章摘要
│   │   └── Sidebar.astro              # 搜索入口、栏目、标签与匿名说明
│   ├── lib/
│   │   ├── post-utils.ts              # 纯函数：阅读时长、排序、分组、文本清理
│   │   └── posts.ts                   # Astro 内容查询与草稿过滤
│   ├── pages/
│   │   ├── index.astro                # 首页
│   │   ├── about.astro                # 匿名关于页
│   │   ├── archive.astro              # 年月归档页
│   │   ├── search.astro               # 搜索界面
│   │   ├── search-index.json.ts       # 静态搜索索引
│   │   ├── 404.astro                  # 无效网址页面
│   │   ├── posts/[slug].astro          # 文章详情页
│   │   ├── categories/[category].astro # 栏目文章列表
│   │   └── tags/[tag].astro            # 标签文章列表
│   └── styles/global.css              # 颜色、排版、响应式与代码样式
├── tests/
│   ├── post-utils.test.ts             # 纯函数单元测试
│   ├── pages-cms-config.test.ts       # CMS 字段与目录契约测试
│   └── image-metadata.test.ts         # EXIF 检测测试
└── docs/
    └── publishing-guide.md             # 新手写作、预览、发布与匿名检查指南
```

---

### Task 1: 建立 Astro 项目与受校验的文章集合

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/content.config.ts`
- Create: `src/content/blog/confusion-is-not-failure.md`
- Create: `src/content/blog/error-as-a-clue.md`
- Create: `src/content/blog/private-draft.md`
- Create: `public/favicon.svg`
- Create: `public/images/.gitkeep`

**Interfaces:**
- Produces: Astro collection `blog`; frontmatter type `{ title, slug, date, description, category, tags, draft }`.
- Produces: commands `pnpm dev`, `pnpm check`, `pnpm test`, `pnpm build`, `pnpm privacy:check`.

- [ ] **Step 1: 创建依赖和命令清单**

```json
{
  "name": "anonymous-reflection-blog",
  "type": "module",
  "private": true,
  "engines": { "node": ">=20" },
  "scripts": {
    "dev": "astro dev",
    "check": "astro check",
    "test": "vitest run",
    "build": "pnpm privacy:check && astro check && astro build",
    "preview": "astro preview",
    "privacy:check": "node scripts/check-image-metadata.mjs"
  },
  "dependencies": {
    "@astrojs/sitemap": "latest",
    "astro": "latest"
  },
  "devDependencies": {
    "@astrojs/check": "latest",
    "typescript": "latest",
    "vitest": "latest",
    "yaml": "latest"
  }
}
```

Run: `pnpm install`

Expected: 生成 `pnpm-lock.yaml`，安装成功且没有 `ERR_PNPM_` 错误。

- [ ] **Step 2: 创建 Astro 和 TypeScript 配置**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL ?? 'http://localhost:4321';

export default defineConfig({
  site,
  integrations: [sitemap()],
  markdown: { shikiConfig: { theme: 'github-dark' } },
});
```

```json
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

创建图标：

```svg
<!-- public/favicon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="8" fill="#6d3229"/>
  <path d="M18 16h28v32H18z" fill="#f7f1e5"/>
  <path d="M24 25h16M24 32h16M24 39h11" stroke="#ad8156" stroke-width="3"/>
</svg>
```

创建空目录标记 `public/images/.gitkeep`，文件内容为空。

- [ ] **Step 3: 先创建缺少摘要的文章与内容校验**

```ts
// src/content.config.ts
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
```

```md
---
title: 混乱不是一种失败
slug: confusion-is-not-failure
date: 2026-08-14
category: 随想
tags: [成长, 写作]
draft: false
---

我开始写这个博客，不是因为我已经想明白了，而是因为脑中的线索需要一个可以停靠的地方。
```

- [ ] **Step 4: 运行构建，确认内容校验会拒绝错误文章**

Run: `pnpm astro sync && pnpm astro check`

Expected: FAIL，错误明确指出 `description` 缺失。

- [ ] **Step 5: 补全摘要，并加入技术文章与不可公开草稿**

将第一篇文章 frontmatter 补入：

```yaml
description: 写作并不要求先获得清晰结论，它也可以成为整理混乱、观察变化和认识自己的方法。
```

新增 `error-as-a-clue.md`，frontmatter 为：

```yaml
---
title: 从一次报错谈起
slug: error-as-a-clue
date: 2026-08-08
description: 从一个小小的程序错误出发，记录排查过程，以及错误如何暴露我们未经检验的假设。
category: 技术
tags: [编程, 调试]
draft: false
---
```

`error-as-a-clue.md` 的 frontmatter 后使用以下正文：

````md
程序没有突然背叛我，它只是忠实执行了我没有意识到的假设。

```js
const visiblePosts = posts.filter((post) => !post.draft);
```

这次排查让我重新意识到：报错首先是一条线索，其次才是一种阻碍。把假设写出来，比盯着结果反复猜测更有效。
````

新增 `private-draft.md`：

```md
---
title: 尚未整理好的问题
slug: private-draft
date: 2026-08-14
description: 用于验证草稿过滤是否有效的内部文章，这段文字不应进入任何公开页面或搜索索引。
category: 札记
tags: [草稿]
draft: true
---

这篇草稿不应出现在公开页面。
```

- [ ] **Step 6: 运行基础校验**

Run: `pnpm astro sync && pnpm astro check`

Expected: PASS，0 errors。

- [ ] **Step 7: 提交项目骨架**

```bash
git add package.json pnpm-lock.yaml astro.config.mjs tsconfig.json src/content.config.ts src/content/blog public
git commit -m "feat: establish validated Astro content"
```

---

### Task 2: 用测试驱动文章排序、阅读时长、归档与搜索文本

**Files:**
- Create: `src/lib/post-utils.ts`
- Create: `src/lib/posts.ts`
- Create: `tests/post-utils.test.ts`

**Interfaces:**
- Produces: `readingMinutes(markdown: string): number`.
- Produces: `sortNewestFirst<T extends Dated>(items: T[]): T[]`，不修改输入数组。
- Produces: `groupByYear<T extends Dated>(items: T[]): Map<number, T[]>`.
- Produces: `normalizeSearchText(markdown: string): string`.
- Produces: `getPublishedPosts(): Promise<CollectionEntry<'blog'>[]>`，统一过滤草稿并按日期倒序。

- [ ] **Step 1: 写纯函数失败测试**

```ts
// tests/post-utils.test.ts
import { describe, expect, it } from 'vitest';
import { groupByYear, normalizeSearchText, readingMinutes, sortNewestFirst } from '../src/lib/post-utils';

describe('post utilities', () => {
  it('短内容也至少显示 1 分钟', () => expect(readingMinutes('几句话')).toBe(1));
  it('约 1000 个汉字显示 2 分钟', () => expect(readingMinutes('思'.repeat(1000))).toBe(2));
  it('按日期倒序且不修改输入', () => {
    const input = [{ date: new Date('2025-01-01') }, { date: new Date('2026-01-01') }];
    expect(sortNewestFirst(input)[0].date.getFullYear()).toBe(2026);
    expect(input[0].date.getFullYear()).toBe(2025);
  });
  it('按年份分组', () => {
    const groups = groupByYear([{ date: new Date('2026-01-01') }, { date: new Date('2025-01-01') }]);
    expect([...groups.keys()]).toEqual([2026, 2025]);
  });
  it('删除 Markdown 标记并统一小写', () => {
    expect(normalizeSearchText('# Hello **世界** `Code`')).toBe('hello 世界 code');
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test -- tests/post-utils.test.ts`

Expected: FAIL，提示找不到 `src/lib/post-utils.ts`。

- [ ] **Step 3: 实现最小纯函数**

```ts
// src/lib/post-utils.ts
export interface Dated { date: Date }

export function readingMinutes(markdown: string): number {
  const text = normalizeSearchText(markdown);
  const cjk = text.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const latin = text.replace(/[\u3400-\u9fff]/g, ' ').match(/[a-zA-Z0-9_]+/g)?.length ?? 0;
  return Math.max(1, Math.ceil(cjk / 500 + latin / 200));
}

export function sortNewestFirst<T extends Dated>(items: T[]): T[] {
  return [...items].sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function groupByYear<T extends Dated>(items: T[]): Map<number, T[]> {
  const groups = new Map<number, T[]>();
  for (const item of sortNewestFirst(items)) {
    const year = item.date.getFullYear();
    groups.set(year, [...(groups.get(year) ?? []), item]);
  }
  return groups;
}

export function normalizeSearchText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[`*_>#\[\]()!-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('zh-CN');
}
```

```ts
// src/lib/posts.ts
import { getCollection, type CollectionEntry } from 'astro:content';
import { sortNewestFirst } from './post-utils';

export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return sortNewestFirst(posts.map((post) => ({ ...post, date: post.data.date })))
    .map(({ date: _date, ...post }) => post as CollectionEntry<'blog'>);
}
```

- [ ] **Step 4: 运行单元和类型检查**

Run: `pnpm test -- tests/post-utils.test.ts && pnpm check`

Expected: 5 tests PASS；Astro check 0 errors。

- [ ] **Step 5: 提交文章工具**

```bash
git add src/lib tests/post-utils.test.ts
git commit -m "feat: add tested post utilities"
```

---

### Task 3: 建立旧刊札记设计系统与共享布局

**Files:**
- Create: `src/config/site.ts`
- Create: `src/styles/global.css`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/PostCard.astro`
- Create: `src/components/Sidebar.astro`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/layouts/PostLayout.astro`

**Interfaces:**
- Produces: `SITE` 常量及 `CATEGORIES = ['技术', '随想', '札记'] as const`.
- Produces: `BaseLayout` props `{ title?: string; description?: string }`.
- Produces: `PostCard` prop `{ post: CollectionEntry<'blog'> }`.
- Consumes: `readingMinutes()` 和 `getPublishedPosts()`.

- [ ] **Step 1: 创建站点常量**

```ts
// src/config/site.ts
export const SITE = {
  title: '在代码与生活之间',
  eyebrow: '一个匿名者的思想存档',
  description: '记录技术学习、生活经历与尚未完成的思考。',
  quote: '我写下的不是结论，而是此刻所能抵达的位置。',
} as const;

export const CATEGORIES = ['技术', '随想', '札记'] as const;
```

- [ ] **Step 2: 写全局视觉令牌和响应式规则**

`src/styles/global.css` 必须定义以下实际令牌和基础规则：

```css
:root {
  --paper: #f7f1e5;
  --paper-deep: #eee3d2;
  --ink: #342d27;
  --muted: #756b60;
  --wine: #6d3229;
  --copper: #ad8156;
  --line: #d7cab7;
  --content: 72rem;
  --reading: 43rem;
}
* { box-sizing: border-box; }
html { color-scheme: light; background: var(--paper-deep); }
body { margin: 0; color: var(--ink); background: var(--paper); font-family: Georgia, "Noto Serif SC", "Songti SC", serif; line-height: 1.75; }
a { color: var(--wine); text-underline-offset: .2em; }
img { max-width: 100%; height: auto; }
code, pre { font-family: "Cascadia Code", Consolas, monospace; }
pre { overflow-x: auto; padding: 1.1rem; border-radius: .25rem; }
.shell { width: min(calc(100% - 2rem), var(--content)); margin-inline: auto; }
.reading { width: min(calc(100% - 2rem), var(--reading)); margin-inline: auto; }
.home-grid { display: grid; grid-template-columns: minmax(0, 1fr) 15rem; gap: 3rem; }
@media (max-width: 760px) { .home-grid { grid-template-columns: 1fr; } }
```

继续在同一文件中加入以下具体规则：

```css
.site-header { color: #f7ecdd; background: var(--wine); }
.site-header__inner { display: flex; justify-content: space-between; align-items: end; gap: 2rem; padding: 1.6rem 0; }
.site-nav { display: flex; flex-wrap: wrap; gap: 1.25rem; }
.site-nav a { color: inherit; text-decoration: none; }
.site-nav a:hover { text-decoration: underline; }
.post-card { padding: 1.4rem 0; border-top: 1px solid var(--line); }
.post-card__meta { color: var(--muted); font: .8rem/1.5 system-ui, sans-serif; letter-spacing: .04em; }
.post-card h2 { margin: .45rem 0; font-size: clamp(1.25rem, 3vw, 1.6rem); }
.sidebar { font-size: .9rem; }
.sidebar section { margin-bottom: 2rem; }
.prose { font-size: 1.08rem; }
.prose h2, .prose h3 { line-height: 1.35; margin-top: 2em; }
.prose blockquote { margin-inline: 0; padding: .8rem 1rem; border-left: .25rem solid var(--copper); background: var(--paper-deep); }
.tag { display: inline-block; margin: 0 .35rem .45rem 0; padding: .2rem .55rem; border: 1px solid var(--line); }
input[type="search"] { width: 100%; padding: .7rem; color: var(--ink); background: #fffdf8; border: 1px solid var(--line); }
:focus-visible { outline: 3px solid var(--copper); outline-offset: 3px; }
@media (max-width: 760px) {
  .site-header__inner { align-items: start; flex-direction: column; }
  .home-grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; }
}
```

- [ ] **Step 3: 创建共享组件和布局**

`Header.astro` 使用以下结构，只包含四个主链接：

```astro
---
import { SITE } from '../config/site';
---
<header class="site-header">
  <div class="shell site-header__inner">
    <a href="/" aria-label="返回首页"><small>{SITE.eyebrow}</small><strong>{SITE.title}</strong></a>
    <nav class="site-nav" aria-label="主导航">
      <a href="/">首页</a><a href="/archive/">归档</a><a href="/about/">关于</a><a href="/search/">搜索</a>
    </nav>
  </div>
</header>
```

`Footer.astro` 使用 `<footer><div class="shell">匿名写作，保留修正自己的权利。</div></footer>`，不输出邮箱或社交账号。`PostCard.astro` 接收 `post`，调用 `readingMinutes(post.body ?? '')`，输出标题、日期、栏目、阅读时长和摘要，并将文章链接固定为 `/posts/${post.data.slug}/`。`Sidebar.astro` 接收 `posts`，用 `CATEGORIES.map()` 计算栏目数，用 `new Set(posts.flatMap(post => post.data.tags))` 生成按中文排序的标签链接。

`BaseLayout.astro` 的完整文档头必须包含：

```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { SITE } from '../config/site';
import '../styles/global.css';
interface Props { title?: string; description?: string }
const { title, description = SITE.description } = Astro.props;
const pageTitle = title ? `${title} · ${SITE.title}` : SITE.title;
const canonical = new URL(Astro.url.pathname, Astro.site ?? Astro.url.origin);
---
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" href="/favicon.svg" />
    <title>{pageTitle}</title>
  </head>
  <body><Header /><main><slot /></main><Footer /></body>
</html>
```

`PostLayout.astro` 使用以下实现，接收单篇 `post` 并将正文限制在 `.reading` 容器：

```astro
---
import type { CollectionEntry } from 'astro:content';
import BaseLayout from './BaseLayout.astro';
import { readingMinutes } from '../lib/post-utils';
interface Props { post: CollectionEntry<'blog'> }
const { post } = Astro.props;
---
<BaseLayout title={post.data.title} description={post.data.description}>
  <article class="reading prose">
    <header>
      <p class="post-card__meta">
        <time datetime={post.data.date.toISOString()}>{post.data.date.toLocaleDateString('zh-CN')}</time>
        · <a href={`/categories/${encodeURIComponent(post.data.category)}/`}>{post.data.category}</a>
        · {readingMinutes(post.body ?? '')} 分钟
      </p>
      <h1>{post.data.title}</h1>
      <p>{post.data.description}</p>
      <p>{post.data.tags.map((tag) => <a class="tag" href={`/tags/${encodeURIComponent(tag)}/`}>{tag}</a>)}</p>
    </header>
    <slot />
  </article>
</BaseLayout>
```

- [ ] **Step 4: 运行静态检查**

Run: `pnpm check`

Expected: 0 errors，0 warnings。

- [ ] **Step 5: 提交设计系统**

```bash
git add src/config src/styles src/components src/layouts
git commit -m "feat: add journal-inspired design system"
```

---

### Task 4: 构建首页、文章页与浏览入口

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/posts/[slug].astro`
- Create: `src/pages/archive.astro`
- Create: `src/pages/categories/[category].astro`
- Create: `src/pages/tags/[tag].astro`

**Interfaces:**
- Consumes: `getPublishedPosts()`, `groupByYear()`, `PostCard`, `Sidebar`, `PostLayout`.
- Produces: 静态路由 `/`, `/posts/:slug`, `/archive`, `/categories/:category`, `/tags/:tag`.

- [ ] **Step 1: 创建首页与文章路由**

`index.astro` 使用以下实现：

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PostCard from '../components/PostCard.astro';
import Sidebar from '../components/Sidebar.astro';
import { SITE } from '../config/site';
import { getPublishedPosts } from '../lib/posts';
const posts = await getPublishedPosts();
---
<BaseLayout>
  <div class="shell">
    <blockquote>{SITE.quote}</blockquote>
    <div class="home-grid">
      <section aria-label="最新文章">{posts.map((post) => <PostCard post={post} />)}</section>
      <Sidebar posts={posts} />
    </div>
  </div>
</BaseLayout>
```

创建 `[slug].astro`，在 `getStaticPaths()` 中仅从 `getPublishedPosts()` 返回 `{ params: { slug: post.data.slug }, props: { post } }`。

文章页渲染入口使用：

```astro
---
import { render } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';
import { getPublishedPosts } from '../../lib/posts';
export async function getStaticPaths() {
  return (await getPublishedPosts()).map((post) => ({ params: { slug: post.data.slug }, props: { post } }));
}
const { post } = Astro.props;
const { Content } = await render(post);
---
<PostLayout post={post}><Content /></PostLayout>
```

- [ ] **Step 2: 运行类型检查，确认路由与组件接口一致**

Run: `pnpm check`

Expected: PASS，0 errors；如出现 props 类型错误，按 Task 3 的接口修正调用方，不删除文章元信息。

- [ ] **Step 3: 完成首页与文章页**

首页顶部输出 `SITE.quote`，正文使用 `.home-grid`；左侧列出文章，右侧放 `Sidebar`。文章页代码块必须横向滚动，标签链接到 `/tags/<编码后的标签>`，栏目链接到 `/categories/<编码后的栏目>`。

- [ ] **Step 4: 完成归档、栏目与标签页面**

`archive.astro` 使用 `groupByYear(posts.map(post => ({ ...post, date: post.data.date })))` 按年分组。栏目和标签路由分别生成全部实际存在的栏目/标签路径；每个页面重复使用 `PostCard`，没有复制文章卡片 HTML。

- [ ] **Step 5: 验证草稿隔离与页面生成**

Run: `pnpm build`

Expected: PASS；`dist/posts/private-draft/index.html` 不存在；`dist/posts/confusion-is-not-failure/index.html` 和 `dist/archive/index.html` 存在。

Run: `rg -n "这篇草稿不应出现在公开页面" dist`

Expected: 无匹配，命令退出码为 1。

- [ ] **Step 6: 提交公开页面**

```bash
git add src/pages
git commit -m "feat: add post and archive pages"
```

---

### Task 5: 测试并实现站内搜索、关于页和 404

**Files:**
- Modify: `tests/post-utils.test.ts`
- Create: `src/pages/search-index.json.ts`
- Create: `src/pages/search.astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/404.astro`

**Interfaces:**
- Consumes: `normalizeSearchText()` 与 `getPublishedPosts()`.
- Produces: JSON 数组 `{ title, slug, description, category, tags, text }[]`.
- Produces: `/search`, `/search-index.json`, `/about`, `/404.html`.

- [ ] **Step 1: 加入搜索文本边界测试**

```ts
it('搜索文本不会保留围栏代码内容', () => {
  expect(normalizeSearchText('正文\n```js\nconst secret = 1\n```\n结尾')).toBe('正文 结尾');
});
```

- [ ] **Step 2: 运行测试确认当前实现的边界行为**

Run: `pnpm test -- tests/post-utils.test.ts`

Expected: PASS；如果失败，只修改 `normalizeSearchText`，直到代码围栏内容被移除且原 5 个测试仍通过。

- [ ] **Step 3: 生成不含草稿的静态搜索索引**

```ts
// src/pages/search-index.json.ts
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
  return new Response(JSON.stringify(index), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
```

- [ ] **Step 4: 实现无第三方脚本的搜索界面**

`search.astro` 包含带 `<label>` 的输入框、结果容器和 `type="module"` 内联脚本。脚本加载 `/search-index.json`，将查询统一为小写，并在标题、摘要、栏目、标签和正文中执行 `includes()`；查询为空显示“输入关键词开始搜索”，无结果显示“没有找到相关文章”，结果链接使用 `/posts/${post.slug}/`。所有结果标题通过 DOM `textContent` 写入，不使用 `innerHTML` 拼接内容。

- [ ] **Step 5: 实现关于与 404 页面**

关于页只说明写作缘起、内容范围和“观点会随认识变化”，不包含真实身份线索。404 页显示“这页似乎没有留下记录”，并提供首页和搜索链接。

- [ ] **Step 6: 构建并检查搜索索引**

Run: `pnpm test && pnpm build`

Expected: tests PASS；构建 PASS；`dist/search-index.json` 存在。

Run: `rg -n "private-draft|这篇草稿不应出现在公开页面" dist/search-index.json`

Expected: 无匹配。

- [ ] **Step 7: 提交搜索与辅助页面**

```bash
git add tests/post-utils.test.ts src/pages
git commit -m "feat: add private-by-default site search"
```

---

### Task 6: 用契约测试配置 Pages CMS 双入口写作

**Files:**
- Create: `.pages.yml`
- Create: `tests/pages-cms-config.test.ts`

**Interfaces:**
- Consumes: Task 1 的 frontmatter 字段与 `public/images` 媒体目录。
- Produces: Pages CMS 集合 `posts`，文件名为 `{slug}.md`，正文使用 `rich-text` 编辑器。

- [ ] **Step 1: 写 CMS 配置失败测试**

```ts
// tests/pages-cms-config.test.ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

describe('Pages CMS contract', () => {
  const config = parse(readFileSync('.pages.yml', 'utf8'));
  const posts = config.content.find((entry: { name: string }) => entry.name === 'posts');
  it('编辑 Astro 的文章与公开图片目录', () => {
    expect(config.media).toEqual({ input: 'public/images', output: '/images' });
    expect(posts.path).toBe('src/content/blog');
  });
  it('字段和 Astro schema 保持一致', () => {
    expect(posts.fields.map((field: { name: string }) => field.name)).toEqual([
      'title', 'slug', 'date', 'description', 'category', 'tags', 'draft', 'body'
    ]);
  });
});
```

- [ ] **Step 2: 运行测试确认配置不存在**

Run: `pnpm test -- tests/pages-cms-config.test.ts`

Expected: FAIL，`ENOENT: no such file or directory, open '.pages.yml'`。

- [ ] **Step 3: 创建 Pages CMS 配置**

```yaml
media:
  input: public/images
  output: /images

content:
  - name: posts
    label: 文章
    type: collection
    path: src/content/blog
    format: yaml-frontmatter
    filename:
      template: "{slug}.md"
      field: create
    view:
      fields: [title, date, category, draft]
      primary: title
      sort: [date, title]
      search: [title, description, tags]
      default:
        sort: date
        order: desc
    fields:
      - name: title
        label: 标题
        type: string
        required: true
      - name: slug
        label: 网址标识
        type: string
        required: true
        pattern:
          regex: "^[a-z0-9]+(?:-[a-z0-9]+)*$"
          message: 只使用小写英文字母、数字和连字符
      - name: date
        label: 发布日期
        type: date
        required: true
        options:
          format: yyyy-MM-dd
      - name: description
        label: 摘要
        type: text
        required: true
        options:
          minlength: 20
          maxlength: 220
      - name: category
        label: 栏目
        type: select
        required: true
        options:
          values: [技术, 随想, 札记]
      - name: tags
        label: 标签
        type: string
        list: true
      - name: draft
        label: 草稿
        type: boolean
        default: true
        required: true
      - name: body
        label: 正文
        type: rich-text
        required: true
```

- [ ] **Step 4: 运行 CMS 契约与全套测试**

Run: `pnpm test`

Expected: 所有测试 PASS。

- [ ] **Step 5: 提交网页写作后台配置**

```bash
git add .pages.yml tests/pages-cms-config.test.ts
git commit -m "feat: configure Pages CMS editing"
```

---

### Task 7: 阻止带 EXIF 标记的图片进入发布构建

**Files:**
- Create: `scripts/check-image-metadata.mjs`
- Create: `tests/image-metadata.test.ts`

**Interfaces:**
- Produces: `hasExifMarker(buffer: Buffer): boolean`.
- Produces: `pnpm privacy:check`，发现 `public/images` 中带 EXIF 标记的文件时退出码为 1。

- [ ] **Step 1: 写 EXIF 检测失败测试**

```ts
// tests/image-metadata.test.ts
import { Buffer } from 'node:buffer';
import { describe, expect, it } from 'vitest';
import { hasExifMarker } from '../scripts/check-image-metadata.mjs';

describe('image metadata guard', () => {
  it('识别 JPEG EXIF 标记', () => expect(hasExifMarker(Buffer.from('headerExif\0\0gps'))).toBe(true));
  it('允许不含 EXIF 标记的图片', () => expect(hasExifMarker(Buffer.from('plain image bytes'))).toBe(false));
});
```

- [ ] **Step 2: 运行测试确认模块不存在**

Run: `pnpm test -- tests/image-metadata.test.ts`

Expected: FAIL，提示找不到 `scripts/check-image-metadata.mjs`。

- [ ] **Step 3: 实现递归图片检查**

```js
// scripts/check-image-metadata.mjs
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function hasExifMarker(buffer) {
  return buffer.includes(Buffer.from('Exif\0\0'));
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = 'public/images';
  const extensions = new Set(['.jpg', '.jpeg', '.tif', '.tiff', '.heic']);
  const flagged = existsSync(root)
    ? walk(root).filter((path) => extensions.has(extname(path).toLowerCase()) && hasExifMarker(readFileSync(path)))
    : [];
  if (flagged.length) {
    console.error(`发现可能包含 EXIF 信息的图片:\n${flagged.join('\n')}\n请重新导出为不含元数据的图片。`);
    process.exit(1);
  }
  console.log('图片隐私检查通过');
}
```

- [ ] **Step 4: 运行隐私与全套测试**

Run: `pnpm test && pnpm privacy:check`

Expected: tests PASS；输出“图片隐私检查通过”。

- [ ] **Step 5: 提交图片隐私防线**

```bash
git add scripts tests/image-metadata.test.ts
git commit -m "feat: guard against EXIF image leaks"
```

---

### Task 8: 编写新手发布指南并完成本地端到端验证

**Files:**
- Create: `docs/publishing-guide.md`
- Create: `README.md`
- Modify: `astro.config.mjs`

**Interfaces:**
- Consumes: 所有开发、测试、构建、预览和 CMS 命令。
- Produces: 从本地写作或 Pages CMS 写作到 Vercel 发布的可重复操作手册。

- [ ] **Step 1: 编写本地写作与预览说明**

`docs/publishing-guide.md` 必须按顺序写明：安装 Node.js 20+ 与 pnpm、运行 `pnpm install`、运行 `pnpm dev`、复制现有 Markdown、保持 `draft: true`、访问本地预览、完成匿名检查、将 `draft` 改为 `false`、运行 `pnpm build`、提交并推送。每条命令单独放置，解释成功时会看到什么。

- [ ] **Step 2: 写网页后台操作说明**

同一指南写明：访问 `https://app.pagescms.org`、使用匿名 GitHub 账号登录、只为博客仓库安装 Pages CMS GitHub App、选择 `posts`、创建文章、保持草稿、预览文字和图片、关闭草稿并保存。明确说明 Pages CMS 的保存会修改 GitHub 文件并触发 Vercel 构建。

- [ ] **Step 3: 写匿名发布检查表**

指南必须包含以下逐项勾选内容：

```markdown
- [ ] 正文没有真实姓名、单位、住址或可识别的精确时间地点组合
- [ ] 截图没有用户名、文件路径、通知、标签页账号或公司内部信息
- [ ] `pnpm privacy:check` 已通过
- [ ] Git 提交邮箱是 GitHub 提供的匿名 noreply 邮箱
- [ ] 关于页没有私人邮箱、社交账号或简历式经历
- [ ] 预览地址上的手机和桌面页面均检查完毕
```

- [ ] **Step 4: 配置生产站点地址说明**

保留 `astro.config.mjs` 的 `SITE_URL` 环境变量读取方式。指南写明：从 Vercel 项目 Overview 页面复制 Production Deployment 域名，在 Vercel 项目设置中新增名为 `SITE_URL` 的 Production 环境变量，将复制的完整 `https://` 地址粘贴为值；保存后重新部署并检查 canonical 与 sitemap 使用该域名。

- [ ] **Step 5: 运行完整本地验证**

Run: `pnpm test && pnpm build`

Expected: tests 全部 PASS；Astro check 0 errors；构建成功生成 `dist/`。

Run: `pnpm preview`

Expected: 本地预览服务启动；人工检查首页、两篇公开文章、归档、三个栏目入口、标签、搜索、关于和 404；草稿不可访问。

- [ ] **Step 6: 浏览器验证桌面和移动端**

在 1440×900 和 390×844 两个视口验证：无横向页面溢出；导航可用；正文行宽舒适；代码块自身横向滚动；侧栏在手机端位于文章列表下方；搜索“报错”返回技术文章；搜索随机不存在词显示“没有找到相关文章”。

- [ ] **Step 7: 提交指南与最终本地版本**

```bash
git add README.md docs/publishing-guide.md astro.config.mjs
git commit -m "docs: add anonymous publishing workflow"
```

---

### Task 9: 建立匿名 GitHub 仓库并部署到 Vercel

**Files:**
- Modify: `docs/publishing-guide.md`（只记录实际生产地址，不记录账号邮箱）

**Interfaces:**
- Consumes: 通过 Task 8 全部验证的 `main` 分支。
- Produces: GitHub 远程仓库、Vercel 生产部署、可公开访问的网址和可用 Pages CMS 后台。

- [ ] **Step 1: 创建匿名账号边界**

使用新笔名、独立邮箱和匿名头像建立 GitHub 账号；在 GitHub Email 设置中启用“Keep my email addresses private”和“Block command line pushes that expose my email”。复制 GitHub 提供的 noreply 地址，并仅在当前仓库配置：

```powershell
$blogAuthor = Read-Host '输入准备公开使用的笔名'
$blogNoreply = Read-Host '粘贴 GitHub Email 设置页显示的 noreply 地址'
git config user.name $blogAuthor
git config user.email $blogNoreply
git config --get user.name
git config --get user.email
```

Expected: 最后两条命令只显示笔名与 noreply 地址。

- [ ] **Step 2: 检查历史中没有私人邮箱**

Run: `git log --format="%h %an <%ae>"`

Expected: 只出现 `Codex <codex@local>` 和匿名笔名的 noreply 地址；不出现私人邮箱。`codex@local` 是本地不可投递的工具身份，不包含个人信息，可以保留。

- [ ] **Step 3: 创建仓库并推送**

在 GitHub 创建不带 README 的新仓库，仓库名使用 `notes-between-code-and-life`，可见性设为 Public。复制 GitHub 显示的 HTTPS 地址后运行：

```powershell
$blogRemote = Read-Host '粘贴 GitHub 仓库页面显示的 HTTPS 地址'
git remote add origin $blogRemote
git push -u origin main
```

Expected: GitHub 页面显示当前全部文件，并且提交作者不暴露私人邮箱。

- [ ] **Step 4: 连接 Vercel 并首次部署**

在 Vercel 选择 Add New Project，导入 `notes-between-code-and-life`，Framework Preset 确认为 Astro，Build Command 使用 `pnpm build`，Output Directory 使用 `dist`。部署成功后复制生产域名，在 Vercel 添加 `SITE_URL` 生产环境变量并重新部署。

Expected: Vercel 状态为 Ready，生产网址可打开首页。

- [ ] **Step 5: 连接 Pages CMS**

访问 `https://app.pagescms.org`，用匿名 GitHub 账号登录，只授权 `notes-between-code-and-life` 仓库。打开 `posts`，编辑草稿并保存。

Expected: GitHub 出现对应 Markdown 修改；Vercel 产生新部署；草稿内容仍不出现在公开网站。

- [ ] **Step 6: 做一次真实发布演练**

在 Pages CMS 将测试草稿保持 `draft: true` 保存并确认线上不可见；随后将其改成一篇可公开的简短札记、完成匿名检查、切换 `draft: false` 并保存。

Expected: Vercel 构建成功后，新札记出现在首页、归档、对应栏目、标签和搜索结果中。

- [ ] **Step 7: 记录生产地址并做最终验证**

将实际生产地址写入 `docs/publishing-guide.md` 的“我的博客地址”一节，运行：

```bash
pnpm test
pnpm build
git status --short
```

Expected: tests PASS，构建 PASS，工作区干净。随后人工打开生产网址检查首页、文章、搜索和 404。

- [ ] **Step 8: 提交实际地址记录**

```bash
git add docs/publishing-guide.md
git commit -m "docs: record production blog URL"
git push
```
