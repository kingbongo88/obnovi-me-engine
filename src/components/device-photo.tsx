import genA from "@/assets/gen-a.jpg";
import genB from "@/assets/gen-b.jpg";
import genBPro from "@/assets/gen-b-pro.jpg";
import genC from "@/assets/gen-c.jpg";
import genCPro from "@/assets/gen-c-pro.jpg";
import genD from "@/assets/gen-d.jpg";
import genDPro from "@/assets/gen-d-pro.jpg";
import genE from "@/assets/gen-e.jpg";
import genEPro from "@/assets/gen-e-pro.jpg";

import iphone12Black from "@/assets/models/iphone-12-black.jpg";
import iphone12Blue from "@/assets/models/iphone-12-blue.jpg";
import iphone12Purple from "@/assets/models/iphone-12-purple.jpg";
import iphone12Red from "@/assets/models/iphone-12-red.jpg";
import iphone13Blue from "@/assets/models/iphone-13-blue.jpg";
import iphone13Green from "@/assets/models/iphone-13-green.jpg";
import iphone13Midnight from "@/assets/models/iphone-13-midnight.jpg";
import iphone13Pink from "@/assets/models/iphone-13-pink.jpg";
import iphone13Starlight from "@/assets/models/iphone-13-starlight.jpg";
import iphone14Midnight from "@/assets/models/iphone-14-midnight.jpg";
import iphone14Purple from "@/assets/models/iphone-14-purple.jpg";
import iphone14Red from "@/assets/models/iphone-14-red.jpg";
import iphone14Starlight from "@/assets/models/iphone-14-starlight.jpg";
import iphone14ProDeepPurple from "@/assets/models/iphone-14-pro-deep-purple.jpg";
import iphone14ProGold from "@/assets/models/iphone-14-pro-gold.jpg";
import iphone14ProSilver from "@/assets/models/iphone-14-pro-silver.jpg";
import iphone14ProSpaceBlack from "@/assets/models/iphone-14-pro-space-black.jpg";
import iphone15Blue from "@/assets/models/iphone-15-blue.jpg";
import iphone15Midnight from "@/assets/models/iphone-15-midnight.jpg";
import iphone15Starlight from "@/assets/models/iphone-15-starlight.jpg";
import iphone15Yellow from "@/assets/models/iphone-15-yellow.jpg";
import iphone15ProBlackTitanium from "@/assets/models/iphone-15-pro-black-titanium.jpg";
import iphone15ProBlueTitanium from "@/assets/models/iphone-15-pro-blue-titanium.jpg";
import iphone15ProNaturalTitanium from "@/assets/models/iphone-15-pro-natural-titanium.jpg";
import iphone15ProWhiteTitanium from "@/assets/models/iphone-15-pro-white-titanium.jpg";
import iphone16Black from "@/assets/models/iphone-16-black.jpg";
import iphone16Pink from "@/assets/models/iphone-16-pink.jpg";
import iphone16Teal from "@/assets/models/iphone-16-teal.jpg";
import iphone16Ultramarine from "@/assets/models/iphone-16-ultramarine.jpg";
import iphone16eBlack from "@/assets/models/iphone-16e-black.jpg.asset.json";
import iphone16eWhite from "@/assets/models/iphone-16e-white.jpg.asset.json";
import iphone17ProDeepBlue from "@/assets/models/iphone-17-pro-deep-blue.jpg";
import iphone17ProSilver from "@/assets/models/iphone-17-pro-silver.jpg";
import iphone17ProCosmicOrange from "@/assets/models/iphone-17-pro-cosmic-orange.jpg";

type Key =
  | "A"
  | "B" | "B_PRO"
  | "C" | "C_PRO"
  | "D" | "D_PRO"
  | "E" | "E_PRO";

function classify(name: string): Key {
  const n = name.toLowerCase();
  const isPro = /\bpro\b/.test(n);
  if (/\b16\b|16e/.test(n)) return isPro ? "E_PRO" : "E";
  if (/\b17\b|17e|\bair\b/.test(n)) return isPro ? "E_PRO" : "E";
  if (/\b18\b|\bduo\b/.test(n)) return "E_PRO";
  if (/\b15\b/.test(n)) return isPro ? "D_PRO" : "D";
  if (/\b14\b/.test(n)) return isPro ? "C_PRO" : "C";
  if (/\b13\b/.test(n)) return isPro ? "C_PRO" : "C";
  if (/\b12\b/.test(n)) return isPro ? "B_PRO" : "B";
  if (/\b11\b/.test(n)) return isPro ? "B_PRO" : "B";
  return "A";
}

const FALLBACK_MAP: Record<Key, string> = {
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

const COLOR_MODEL_MAP: Record<string, string> = {
  "iphone 16e::black": iphone16eBlack.url,
  "iphone 16e::crna": iphone16eBlack.url,
  "iphone 16e::white": iphone16eWhite.url,
  "iphone 16e::bijela": iphone16eWhite.url,
  "iphone 17 pro::deep blue": iphone17ProDeepBlue,
  "iphone 17 pro::silver": iphone17ProSilver,
  "iphone 17 pro::cosmic orange": iphone17ProCosmicOrange,
  "iphone 17 pro max::deep blue": iphone17ProDeepBlue,
  "iphone 17 pro max::silver": iphone17ProSilver,
  "iphone 17 pro max::cosmic orange": iphone17ProCosmicOrange,
  "iphone 12::black": iphone12Black,
  "iphone 12::blue": iphone12Blue,
  "iphone 12::purple": iphone12Purple,
  "iphone 12::red": iphone12Red,

  "iphone 13::blue": iphone13Blue,
  "iphone 13::green": iphone13Green,
  "iphone 13::midnight": iphone13Midnight,
  "iphone 13::pink": iphone13Pink,
  "iphone 13::starlight": iphone13Starlight,

  "iphone 14::midnight": iphone14Midnight,
  "iphone 14::purple": iphone14Purple,
  "iphone 14::red": iphone14Red,
  "iphone 14::starlight": iphone14Starlight,

  "iphone 14 pro::deep purple": iphone14ProDeepPurple,
  "iphone 14 pro::gold": iphone14ProGold,
  "iphone 14 pro::silver": iphone14ProSilver,
  "iphone 14 pro::space black": iphone14ProSpaceBlack,

  "iphone 15::blue": iphone15Blue,
  "iphone 15::midnight": iphone15Midnight,
  "iphone 15::starlight": iphone15Starlight,
  "iphone 15::yellow": iphone15Yellow,

  "iphone 15 pro::black titanium": iphone15ProBlackTitanium,
  "iphone 15 pro::blue titanium": iphone15ProBlueTitanium,
  "iphone 15 pro::natural titanium": iphone15ProNaturalTitanium,
  "iphone 15 pro::white titanium": iphone15ProWhiteTitanium,

  "iphone 16::black": iphone16Black,
  "iphone 16::pink": iphone16Pink,
  "iphone 16::teal": iphone16Teal,
  "iphone 16::ultramarine": iphone16Ultramarine,
};

function normalize(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export function devicePhotoFor(modelName: string, color?: string | null): string {
  const modelKey = normalize(modelName);
  const colorKey = normalize(color);
  if (colorKey) {
    const exact = COLOR_MODEL_MAP[`${modelKey}::${colorKey}`];
    if (exact) return exact;
  }
  // These models have distinct camera designs, never reuse the 16/16 Pro photo.
  if (modelKey === "iphone 16e") return iphone16eBlack.url;
  if (modelKey === "iphone 17 pro" || modelKey === "iphone 17 pro max") return iphone17ProDeepBlue;
  return FALLBACK_MAP[classify(modelName)];
}

export function DevicePhoto({
  modelName,
  color,
  className,
  alt,
  eager = false,
}: {
  modelName: string;
  color?: string | null;
  className?: string;
  alt?: string;
  eager?: boolean;
}) {
  return (
    <img
      src={devicePhotoFor(modelName, color)}
      alt={alt ?? modelName}
      loading={eager ? "eager" : "lazy"}
      width={1024}
      height={1024}
      className={className}
    />
  );
}
