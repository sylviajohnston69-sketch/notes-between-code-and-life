import { describe, expect, it } from 'vitest';
import {
  groupByYear,
  normalizeSearchText,
  readingMinutes,
  sortNewestFirst,
} from '../src/lib/post-utils';

describe('post utilities', () => {
  it('shows at least 1 minute for short content', () => {
    expect(readingMinutes('几句话')).toBe(1);
  });

  it('shows 2 minutes for approximately 1000 Chinese characters', () => {
    expect(readingMinutes('总'.repeat(1000))).toBe(2);
  });

  it('sorts by descending date without mutating the input', () => {
    const input = [{ date: new Date('2025-01-01') }, { date: new Date('2026-01-01') }];

    expect(sortNewestFirst(input)[0].date.getUTCFullYear()).toBe(2026);
    expect(input[0].date.getUTCFullYear()).toBe(2025);
  });

  it('groups entries by UTC publication year', () => {
    const groups = groupByYear([
      { date: new Date('2026-01-01') },
      { date: new Date('2025-01-01') },
    ]);

    expect([...groups.keys()]).toEqual([2026, 2025]);
  });

  it('removes Markdown syntax and normalizes to lowercase', () => {
    expect(normalizeSearchText('# Hello **世界** `Code`')).toBe('hello 世界 code');
  });
});
