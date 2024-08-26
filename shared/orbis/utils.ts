/** Parse a seed from string, or return if it's already in the right format */
export const parseDidSeed = (seed: string) => {
  const attemptJsonParse = (str: string) => {
    try {
      return JSON.parse(str);
    } catch {
      return false;
    }
  };

  const parsedSeed = attemptJsonParse(seed) || seed;

  if (typeof parsedSeed === "string") {
    if (!/^(0x)?[0-9a-f]+$/i.test(seed)) {
      throw "Invalid seed format. It's not a hex string or an array.";
    }
    return seed;
  }

  if (Array.isArray(parsedSeed)) {
    return new Uint8Array(parsedSeed);
  }

  if (parsedSeed instanceof Uint8Array) {
    return parsedSeed;
  }

  throw "Invalid seed format. It's not a hex string or an array.";
};
