# Blog Display Name Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change the public blog title to “在思考与生活之间” without changing the GitHub repository, Vercel project, or public URL.

**Architecture:** Keep `src/config/site.ts` as the single runtime source for the title so the header, document title, and metadata stay aligned. Update the README separately because it is repository documentation, then redeploy the same Vercel project.

**Tech Stack:** Astro 7, TypeScript 6, Vitest 4, pnpm, Vercel CLI

## Global Constraints

- The exact public title is `在思考与生活之间`.
- Keep the GitHub repository `sylviajohnston69-sketch/notes-between-code-and-life` unchanged.
- Keep the Vercel project `aike13/notes-between-code-and-life` unchanged.
- Keep `https://notes-between-code-and-life.vercel.app` unchanged.
- Do not rewrite historical design or implementation documents that describe the old title as a setup-stage example.
- Do not expose `.env.local`, `.vercel/`, credentials, or local filesystem paths.

---

### Task 1: Rename the public display title

**Files:**
- Create: `tests/site-config.test.ts`
- Modify: `src/config/site.ts:1-7`
- Modify: `README.md:1`

**Interfaces:**
- Consumes: `SITE.title` from `src/config/site.ts`.
- Produces: the exact string `在思考与生活之间` for every page that renders the shared site title.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { SITE } from '../src/config/site';

describe('site configuration', () => {
  it('uses the approved public blog title', () => {
    expect(SITE.title).toBe('在思考与生活之间');
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
pnpm test tests/site-config.test.ts
```

Expected: FAIL because the current value is `在代码与生活之间`.

- [ ] **Step 3: Make the minimal implementation change**

Change `src/config/site.ts` to:

```ts
export const SITE = {
  title: '在思考与生活之间',
  eyebrow: '一个匿名者的思想存档',
  description: '记录技术学习、生活经历与尚未完成的思考。',
  quote: '我写下的不是结论，而是此刻所能抵达的位置。',
} as const;

export const CATEGORIES = ['技术', '随想', '札记'] as const;
```

Change the first line of `README.md` to:

```markdown
# 在思考与生活之间
```

- [ ] **Step 4: Run focused and full verification**

Run:

```powershell
pnpm test tests/site-config.test.ts
pnpm test
pnpm build
```

Expected: the focused test passes, all tests pass, the privacy check passes, Astro reports 0 errors, and the production build completes.

Run:

```powershell
rg -n --fixed-strings '在代码与生活之间' src README.md
rg -n --fixed-strings '在思考与生活之间' dist/index.html dist/posts
git diff --check
```

Expected: the first command returns no matches; the second finds the new title in generated public pages; `git diff --check` returns no errors.

- [ ] **Step 5: Commit the source change**

```powershell
git add tests/site-config.test.ts src/config/site.ts README.md
git commit -m "feat: rename blog display title"
```

### Task 2: Publish and verify the renamed site

**Files:**
- No source files should change during deployment.
- Local-only state remains under ignored `.vercel/` and `.env.local`.

**Interfaces:**
- Consumes: the verified build from Task 1 and the linked Vercel project `aike13/notes-between-code-and-life`.
- Produces: a production deployment at `https://notes-between-code-and-life.vercel.app` with the new public title.

- [ ] **Step 1: Confirm anonymous publication scope**

Run:

```powershell
git status -sb
git log -3 --format='%h %an <%ae> %s'
git ls-files .env.local .vercel
```

Expected: only intended commits are ahead of `origin/main`, commit identity is `Codex <codex@local>`, and no credential files are tracked.

- [ ] **Step 2: Push the verified commit**

Run:

```powershell
git push origin HEAD:main
```

Expected: `origin/main` advances to the local HEAD. If GitHub connectivity is still unavailable, preserve the local commit, continue the already-authorized Vercel production deployment from the local checkout, and report the GitHub synchronization as pending rather than discarding or rewriting history.

- [ ] **Step 3: Deploy the existing Vercel project**

Run:

```powershell
vercel deploy --prod --yes --scope aike13
```

Expected: the deployment completes and aliases to `https://notes-between-code-and-life.vercel.app`.

- [ ] **Step 4: Verify deployment status**

Run:

```powershell
vercel inspect https://notes-between-code-and-life.vercel.app --wait --scope aike13
```

Expected: target is `production` and status is `Ready`.

- [ ] **Step 5: Verify the public response**

Fetch `/`, `/posts/confusion-is-not-failure/`, and `/posts/private-draft/` over HTTPS. Verify that the first two return 200 and contain `在思考与生活之间`, the draft returns 404, the old title is absent from public HTML, and the canonical URL still uses `https://notes-between-code-and-life.vercel.app`.

- [ ] **Step 6: Confirm repository state**

```powershell
git status -sb
git rev-parse HEAD
git ls-remote origin refs/heads/main
```

Expected: the worktree is clean. When GitHub is reachable, the local HEAD and remote `main` SHA match; otherwise report the exact local SHA still pending synchronization.
