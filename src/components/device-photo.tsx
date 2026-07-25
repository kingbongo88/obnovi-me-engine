// Real photograph fallback for a device, grouped by physical design generation.
// Used in the trade-in model picker (permanent) and the shop grid when a unit
// has no uploaded photos yet (launch placeholder).

import genA from "@/assets/gen-a.jpg";
import genB from "@/assets/gen-b.jpg";
import genC from "@/assets/gen-c.jpg";
import genD from "@/assets/gen-d.jpg";
import genE from "@/assets/gen-e.jpg";

type Group = "A" | "B" | "C" | "D" | "E";

function classify(name: string): Group {
  const n = name.toLowerCase();
  if (/\b17\b|\bair\b|17e/.test(n)) return "E";
  if (/\b15\b|\b16\b|16e/.test(n)) return "D";
  if (/\b13\b|\b14\b/.test(n)) return "C";
  if (/\b11\b|\b12\b/.test(n)) return "B";
  return "A"; // XR / XS and anything older
}

const MAP: Record<Group, string> = {
  A: genA,
  B: genB,
  C: genC,
  D: genD,
  E: genE,
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
