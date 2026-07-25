// Real photograph fallback per iPhone model. Grouped by generation AND by
// Pro/non-Pro so camera counts always match the real device.

import genA from "@/assets/gen-a.jpg";           // XR / XS single-cam era
import genB from "@/assets/gen-b.jpg";           // 11 / 12 mini / 12 (dual)
import genBPro from "@/assets/gen-b-pro.jpg";    // 11 Pro / 12 Pro (triple)
import genC from "@/assets/gen-c.jpg";           // 13 / 14 diagonal dual
import genCPro from "@/assets/gen-c-pro.jpg";    // 13 Pro / 14 Pro (triple + LiDAR)
import genD from "@/assets/gen-d.jpg";           // 15 / 15 Plus diagonal dual + Dynamic Island
import genDPro from "@/assets/gen-d-pro.jpg";    // 15 Pro / 15 Pro Max (titanium, triple)
import genE from "@/assets/gen-e.jpg";           // 16 / 16 Plus vertical dual
import genEPro from "@/assets/gen-e-pro.jpg";    // 16 Pro / 16 Pro Max (triple)

type Key =
  | "A"
  | "B" | "B_PRO"
  | "C" | "C_PRO"
  | "D" | "D_PRO"
  | "E" | "E_PRO";

function classify(name: string): Key {
  const n = name.toLowerCase();
  const isPro = /\bpro\b/.test(n);
  // 16 / 16e (16e ships as base tier for imagery purposes)
  if (/\b16\b|16e/.test(n)) return isPro ? "E_PRO" : "E";
  // 17 / Air use the newest visual language too
  if (/\b17\b|17e|\bair\b/.test(n)) return isPro ? "E_PRO" : "E";
  if (/\b15\b/.test(n)) return isPro ? "D_PRO" : "D";
  if (/\b14\b/.test(n)) return isPro ? "C_PRO" : "C";
  if (/\b13\b/.test(n)) return isPro ? "C_PRO" : "C";
  if (/\b12\b/.test(n)) return isPro ? "B_PRO" : "B";
  if (/\b11\b/.test(n)) return isPro ? "B_PRO" : "B";
  return "A"; // XR, XS, XS Max, older
}

const MAP: Record<Key, string> = {
  A: genA,
  B: genB,
  B_PRO: genBPro,
  C: genC,
  C_PRO: genCPro,
  D: genD,
  D_PRO: genDPro,
  E: genE,
  E_PRO: genEPro,
};

export function devicePhotoFor(modelName: string): string {
  return MAP[classify(modelName)];
}

export function DevicePhoto({
  modelName,
  className,
  alt,
  eager = false,
}: {
  modelName: string;
  className?: string;
  alt?: string;
  eager?: boolean;
}) {
  return (
    <img
      src={devicePhotoFor(modelName)}
      alt={alt ?? modelName}
      loading={eager ? "eager" : "lazy"}
      width={1024}
      height={1024}
      className={className}
    />
  );
}
