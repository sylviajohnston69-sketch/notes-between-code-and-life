import { describe, expect, it } from 'vitest';
import { SITE } from '../src/config/site';

describe('site configuration', () => {
  it('uses the approved public blog title', () => {
    expect(SITE.title).toBe('在思考与生活之间');
  });
});
