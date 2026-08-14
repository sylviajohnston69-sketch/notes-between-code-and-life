export interface Dated {
  date: Date;
}

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
    const year = item.date.getUTCFullYear();
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
