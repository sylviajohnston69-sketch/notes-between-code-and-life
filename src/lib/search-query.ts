interface SearchInput {
  value: string;
}

export function hydrateSearchQuery(search: string, input: SearchInput): void {
  const query = new URLSearchParams(search).get('q');
  if (query !== null) input.value = query;
}
