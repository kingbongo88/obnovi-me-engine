// Pure pricing engine. All configuration comes from DB — nothing hardcoded here
// except the algorithm itself (Section 1.6 of the spec).

export type Grade = "A+" | "A" | "B";
export type ScreenState = "none" | "minor" | "cracked";
export type BackState = "none" | "minor" | "cracked";

export interface PricingBundle {
  devices: Array<{
    id: string;
    model_name: string;
    release_year: number;
    base_resale_value: number;
    buy_tier: number;
    storage_options: number[];
  }>;
  storageMultipliers: Record<number, number>; // 128 -> 1.0
  gradeMultipliers: Record<Grade, number>;
  refurbItems: Record<string, number>; // key -> amount
  config: {
    target_margin: number;
    warranty_reserve: number;
    min_payout_floor: number;
    tier2_flat_payout: number;
    round_step: number;
    list_price_ending: number;
    diagnostic_min_battery: number;
  };
}

export interface OfferInput {
  device_id: string;
  storage_gb: number;
  // Screening
  find_my_off: boolean;
  reported_stolen: boolean;
  water_corrosion: boolean;
  unauthorized_repair: boolean;
  // Health & condition
  battery_health: number; // 0..100
  screen: ScreenState;
  back: BackState;
  charging_works: boolean;
  speaker_mic_works: boolean;
  camera_works: boolean;
  face_id_works: boolean;
}

export type OfferResult =
  | {
      status: "rejected";
      reason:
        | "battery"
        | "findmy"
        | "stolen"
        | "water"
        | "unauthorized"
        | "tooOld"
        | "critical"
        | "tooLow"
        | "tier2"
        | "unknownDevice";
    }
  | {
      status: "ok";
      payout: number; // euros, rounded down to round_step
      resaleValue: number; // pre-round
      refurbCost: number;
      effectiveGrade: Grade;
      breakdown: {
        base: number;
        storageMult: number;
        gradeMult: number;
        refurbLines: Array<{ key: string; amount: number }>;
        formula: string;
      };
      tier: 1 | 2;
    };

export function computeCosmeticGrade(input: OfferInput): Grade {
  if (input.screen === "cracked") return "B";
  if (input.back === "cracked") return "B";
  if (input.screen === "minor" || input.back === "minor") return "A";
  return "A+";
}

export function floorTo(value: number, step: number): number {
  return Math.floor(value / step) * step;
}

/** Round DOWN to nearest number ending in `ending` (0..9). Never above value. */
export function roundListPriceEnding(value: number, ending: number): number {
  if (value <= 0) return 0;
  const base = Math.floor(value);
  const lastDigit = base % 10;
  const diff = (lastDigit - ending + 10) % 10;
  const candidate = base - diff;
  return candidate <= 0 ? ending : candidate;
}

export function computeOffer(input: OfferInput, bundle: PricingBundle): OfferResult {
  const device = bundle.devices.find((d) => d.id === input.device_id);
  if (!device) return { status: "rejected", reason: "unknownDevice" };

  // Hard rejects — screening
  if (!input.find_my_off) return { status: "rejected", reason: "findmy" };
  if (input.reported_stolen) return { status: "rejected", reason: "stolen" };
  if (input.water_corrosion) return { status: "rejected", reason: "water" };
  if (input.unauthorized_repair) return { status: "rejected", reason: "unauthorized" };

  // Hard reject — battery
  if (input.battery_health < bundle.config.diagnostic_min_battery) {
    return { status: "rejected", reason: "battery" };
  }

  // Hard reject — Face ID (spec 1.4.7 critical functional failure)
  if (!input.face_id_works) {
    return { status: "rejected", reason: "critical" };
  }

  // Hard reject — pile of major faults (3+ major issues simultaneously)
  const majorFaultCount =
    (input.screen === "cracked" ? 1 : 0) +
    (input.back === "cracked" ? 1 : 0) +
    (!input.charging_works ? 1 : 0) +
    (!input.speaker_mic_works ? 1 : 0) +
    (!input.camera_works ? 1 : 0);
  if (majorFaultCount >= 3) {
    return { status: "rejected", reason: "critical" };
  }

  // Tier 2 — flat payout, strict conditions
  if (device.buy_tier === 2) {
    const allFunctional =
      input.charging_works && input.speaker_mic_works && input.camera_works;
    if (input.screen === "cracked" || input.back === "cracked" || !allFunctional) {
      return { status: "rejected", reason: "tier2" };
    }
    return {
      status: "ok",
      payout: bundle.config.tier2_flat_payout,
      resaleValue: device.base_resale_value,
      refurbCost: 0,
      effectiveGrade: "A",
      tier: 2,
      breakdown: {
        base: device.base_resale_value,
        storageMult: 1,
        gradeMult: 1,
        refurbLines: [],
        formula: "Tier 2 flat payout",
      },
    };
  }

  // Tier 1 — full formula
  const effectiveGrade = computeCosmeticGrade(input);
  const storageMult = bundle.storageMultipliers[input.storage_gb] ?? 1;
  const gradeMult = bundle.gradeMultipliers[effectiveGrade];
  const resaleValue = device.base_resale_value * storageMult * gradeMult;

  const lines: Array<{ key: string; amount: number }> = [];
  const push = (key: string) => {
    const amt = bundle.refurbItems[key];
    if (amt != null) lines.push({ key, amount: amt });
  };

  push("diagnostic");
  if (input.battery_health < 90) push("battery_replace");
  if (input.screen === "cracked") push("screen_cracked");
  if (input.back === "cracked") push("back_cracked");
  else if (input.back === "minor") push("back_dented");
  if (!input.charging_works) push("charging_port");
  if (!input.speaker_mic_works) push("speaker_mic");
  if (!input.camera_works) push("camera");

  const refurbCost = lines.reduce((s, l) => s + l.amount, 0);
  const marginFactor = 1 - bundle.config.target_margin - bundle.config.warranty_reserve;
  const rawPayout = resaleValue * marginFactor - refurbCost;
  const rounded = floorTo(rawPayout, bundle.config.round_step);

  if (rounded < bundle.config.min_payout_floor) {
    return { status: "rejected", reason: "tooLow" };
  }

  return {
    status: "ok",
    payout: rounded,
    resaleValue,
    refurbCost,
    effectiveGrade,
    tier: 1,
    breakdown: {
      base: device.base_resale_value,
      storageMult,
      gradeMult,
      refurbLines: lines,
      formula: `${device.base_resale_value} × ${storageMult} × ${gradeMult} × ${marginFactor} − ${refurbCost}`,
    },
  };
}

export function generateReferenceCode(): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const t = Date.now().toString(36).slice(-4).toUpperCase();
  return `OB-${t}${rand}`;
}
