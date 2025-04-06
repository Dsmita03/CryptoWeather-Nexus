// src/utils/helpers.ts
export const normalizeCityKey = (id: string): string => {
  const map: Record<string, string> = {
    london: "London",
    "new-york": "New York",
    tokyo: "Tokyo",
  };

  return map[id.toLowerCase()] ?? id;
};
