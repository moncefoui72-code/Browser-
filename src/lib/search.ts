export type SearchSuggestion = {
  id: string;
  label: string;
  value: string;
};

export const getSuggestions = (text: string): SearchSuggestion[] => {
  const query = text.trim();
  if (!query) return [];

  const base = [
    `M browser`,
    `M privacy`,
    `M video`,
    `${query} docs`,
    `${query} download`,
    `${query} examples`,
  ];

  const items = new Set<string>();
  for (const candidate of base) {
    if (candidate.toLowerCase().includes(query.toLowerCase())) items.add(candidate);
  }

  return Array.from(items).slice(0, 6).map((label, index) => ({
    id: `${label}-${index}`,
    label,
    value: label,
  }));
};
