import { Buffer } from 'node:buffer';
import { describe, expect, it } from 'vitest';
import { hasExifMarker } from '../scripts/check-image-metadata.mjs';

describe('image metadata guard', () => {
  it('identifies JPEG EXIF markers', () =>
    expect(hasExifMarker(Buffer.from('headerExif\0\0gps'))).toBe(true));

  it('allows images without EXIF markers', () =>
    expect(hasExifMarker(Buffer.from('plain image bytes'))).toBe(false));
});
