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
  const jpegExtensions = new Set(['.jpg', '.jpeg']);
  const unsupportedExtensions = new Set(['.tif', '.tiff', '.heic']);
  const files = existsSync(root) ? walk(root) : [];
  const flaggedJpegs = files.filter(
    (path) =>
      jpegExtensions.has(extname(path).toLowerCase()) &&
      hasExifMarker(readFileSync(path)),
  );
  const unsupportedFiles = files.filter((path) =>
    unsupportedExtensions.has(extname(path).toLowerCase()),
  );

  if (flaggedJpegs.length || unsupportedFiles.length) {
    const messages = [];

    if (flaggedJpegs.length) {
      messages.push(
        `发现可能包含 EXIF 信息的 JPEG 图片\n${flaggedJpegs.join('\n')}\n请重新导出为不含元数据的图片。`,
      );
    }

    if (unsupportedFiles.length) {
      messages.push(
        `Unsupported privacy-risk image format:\n${unsupportedFiles.join('\n')}\nRe-export as PNG, WebP, or metadata-free JPEG.`,
      );
    }

    console.error(messages.join('\n\n'));
    process.exit(1);
  }

  console.log('图片隐私检查通过');
}
