# Search Query Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the sidebar search term across navigation and automatically run the initial search on `/search/?q=...`.

**Architecture:** Add one pure URL-to-input hydration helper and call it from Astro's bundled search-page client script before the existing index fetch. Keep the current search algorithm and final `search()` call unchanged.

**Tech Stack:** Astro, TypeScript, Vitest, standard `URLSearchParams`

## Global Constraints

- The public blog title remains exactly `在思考与生活之间`.
- The GitHub repository remains `sylviajohnston69-sketch/notes-between-code-and-life`.
- The Vercel project remains `aike13/notes-between-code-and-life`.
- The production URL remains `https://notes-between-code-and-life.vercel.app`.
- Do not expose `.env.local`, `.vercel`, credentials, or local machine paths.
- Do not change layout, search matching rules, publication filtering, or unrelated code.

---

### Task 1: Preserve the sidebar search query

**Files:**
- Create: `src/lib/search-query.ts`
- Create: `tests/search-query.test.ts`
- Modify: `src/pages/search.astro`

**Interfaces:**
- Consumes: `window.location.search` and the existing `#site-search` input.
- Produces: `hydrateSearchQuery(search: string, input: { value: string }): void`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { hydrateSearchQuery } from '../src/lib/search-query';

describe('search query hydration', () => {
  it('hydrates a decoded q parameter into the search input', () => {
    const input = { value: '' };

    hydrateSearchQuery('?q=%E6%80%9D%E8%80%83', input);

    expect(input.value).toBe('思考');
  });

  it('keeps the current value when q is absent', () => {
    const input = { value: '原值' };

    hydrateSearchQuery('?tag=astro', input);

    expect(input.value).toBe('原值');
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
pnpm test -- tests/search-query.test.ts
```

Expected: FAIL because `src/lib/search-query.ts` does not exist.

- [ ] **Step 3: Implement the minimal helper**

```ts
interface SearchInput {
  value: string;
}

export function hydrateSearchQuery(search: string, input: SearchInput): void {
  const query = new URLSearchParams(search).get('q');
  if (query !== null) input.value = query;
}
```

- [ ] **Step 4: Wire the helper into the real search page**

Change the search script from inline to Astro-bundled form, import the helper, and call it immediately after validating the input element:

```astro
<script>
  import { hydrateSearchQuery } from '../lib/search-query';

  const input = document.querySelector('#site-search');
  const results = document.querySelector('#search-results');

  if (!(input instanceof HTMLInputElement) || !(results instanceof HTMLElement)) {
    throw new Error('Search controls are unavailable.');
  }

  hydrateSearchQuery(window.location.search, input);
```

Keep the existing index fetch and final `search()` call unchanged so the hydrated value is searched after loading.

- [ ] **Step 5: Verify GREEN and regression safety**

Run:

```powershell
pnpm test -- tests/search-query.test.ts
pnpm test
pnpm build
```

Expected: 2 focused tests pass, the complete suite passes, and the production build succeeds with no errors or warnings.

- [ ] **Step 6: Commit**

```powershell
git add src/lib/search-query.ts src/pages/search.astro tests/search-query.test.ts
git commit -m "fix: preserve sidebar search query"
```

- [ ] **Step 7: Publish and verify the real flow**

Push `HEAD:main`, deploy the linked production project, and open:

```text
https://notes-between-code-and-life.vercel.app/search/?q=思考
```

Expected: HTTP 200, the input value is `思考`, at least one matching result is visible, and the production title remains `在思考与生活之间`.

