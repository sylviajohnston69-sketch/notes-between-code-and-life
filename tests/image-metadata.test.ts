import { Buffer } from 'node:buffer';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { hasExifMarker } from '../scripts/check-image-metadata.mjs';

const checker = fileURLToPath(
  new URL('../scripts/check-image-metadata.mjs', import.meta.url),
);

function runPrivacyCheck(files: Record<string, Buffer>) {
  const cwd = mkdtempSync(join(tmpdir(), 'image-metadata-'));
  const images = join(cwd, 'public', 'images');
  mkdirSync(images, { recursive: true });

  try {
    for (const [name, content] of Object.entries(files)) {
      const path = join(images, name);
      mkdirSync(join(path, '..'), { recursive: true });
      writeFileSync(path, content);
    }

    return spawnSync(process.execPath, [checker], { cwd, encoding: 'utf8' });
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
}

describe('image metadata guard', () => {
  it('identifies JPEG EXIF markers', () =>
    expect(hasExifMarker(Buffer.from('headerExif\0\0gps'))).toBe(true));

  it('allows images without EXIF markers', () =>
    expect(hasExifMarker(Buffer.from('plain image bytes'))).toBe(false));

  it('blocks a flagged JPEG and reports its path', () => {
    const result = runPrivacyCheck({ 'nested/flagged.jpg': Buffer.from('Exif\0\0gps') });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('public\\images\\nested\\flagged.jpg');
  });

  it.each(['unsafe.tif', 'unsafe.tiff', 'unsafe.heic'])(
    'blocks %s without a JPEG EXIF marker',
    (name) => {
      const result = runPrivacyCheck({ [name]: Buffer.from('plain image bytes') });

      expect(result.status).toBe(1);
      expect(result.stderr).toMatch(/PNG, WebP, or metadata-free JPEG/i);
    },
  );

  it('allows clean JPEG content', () => {
    const result = runPrivacyCheck({ 'clean.jpeg': Buffer.from('plain image bytes') });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('图片隐私检查通过');
  });
});
