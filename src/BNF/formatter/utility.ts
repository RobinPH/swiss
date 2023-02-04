const CHARACTER_MAPPING = {
  // "\n": "\\n",
  // "\r": "\\r",
  "\n": "",
  "\r": "",
} as const;

export const getTextFromInput = (
  input: string,
  range: { from: number; to: number }
) => {
  const mapped = input
    .slice(range.from, range.to)
    .split("")
    .map((c) => {
      if (c in CHARACTER_MAPPING) {
        // @ts-ignore
        return CHARACTER_MAPPING[c];
      }
      return c;
    })
    .join("");

  const MAX_LENGTH = 20;

  if (mapped.length > MAX_LENGTH) {
    return mapped.slice(0, MAX_LENGTH) + "...";
  }

  return mapped;
};
