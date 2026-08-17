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
