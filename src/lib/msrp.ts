// Approximate original Apple retail price (EUR) at launch for the 128 GB base
// configuration of each model. Used only to display a strike-through reference
// price and a savings percentage on marketing surfaces. Not authoritative and
// intentionally kept in code — refurb pricing does not depend on this table.

const BASE_MSRP: Record<string, number> = {
  "iPhone XR": 849,
  "iPhone XS": 1179,
  "iPhone XS Max": 1279,
  "iPhone 11": 829,
  "iPhone 11 Pro": 1179,
  "iPhone 11 Pro Max": 1279,
  "iPhone 12 mini": 829,
  "iPhone 12": 929,
  "iPhone 12 Pro": 1179,
  "iPhone 12 Pro Max": 1279,
  "iPhone 13 mini": 829,
  "iPhone 13": 909,
  "iPhone 13 Pro": 1179,
  "iPhone 13 Pro Max": 1279,
  "iPhone 14": 1019,
  "iPhone 14 Plus": 1169,
  "iPhone 14 Pro": 1319,
  "iPhone 14 Pro Max": 1469,
  "iPhone 15": 979,
  "iPhone 15 Plus": 1129,
  "iPhone 15 Pro": 1229,
  "iPhone 15 Pro Max": 1479,
  "iPhone 16e": 719,
  "iPhone 16": 949,
  "iPhone 16 Plus": 1099,
  "iPhone 16 Pro": 1199,
  "iPhone 16 Pro Max": 1449,
  "iPhone 17e": 749,
  "iPhone 17": 979,
  "iPhone Air": 1199,
  "iPhone 17 Pro": 1299,
  "iPhone 17 Pro Max": 1549,
};

// Very rough storage step-up (matches Apple's typical +€120 per tier).
const STORAGE_UPLIFT: Record<number, number> = {
  64: -50,
  128: 0,
  256: 120,
  512: 350,
  1024: 580,
};

export function msrpFor(modelName: string, storageGb: number): number | null {
  const base = BASE_MSRP[modelName];
  if (!base) return null;
  const uplift = STORAGE_UPLIFT[storageGb] ?? 0;
  return Math.max(base + uplift, base);
}

export function savingsPct(listPrice: number, modelName: string, storageGb: number): number | null {
  const m = msrpFor(modelName, storageGb);
  if (!m || m <= listPrice) return null;
  return Math.round(((m - listPrice) / m) * 100);
}
