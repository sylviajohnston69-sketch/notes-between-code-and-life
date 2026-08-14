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
    ? walk(root).filter(
        (path) =>
          extensions.has(extname(path).toLowerCase()) &&
          hasExifMarker(readFileSync(path)),
      )
    : [];

  if (flagged.length) {
    console.error(
      `发现可能包含 EXIF 信息的图片\n${flagged.join('\n')}\n请重新导出为不含元数据的图片。`,
    );
    process.exit(1);
  }

  console.log('图片隐私检查通过');
}
