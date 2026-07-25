import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { PricingBundle, Grade } from "./pricing";
import { computeOffer, generateReferenceCode, roundListPriceEnding } from "./pricing";
import { modelToSlug } from "./slug";

function isNewKey(v: string) {
  return v.startsWith("sb_publishable_") || v.startsWith("sb_secret_");
}
function makeFetch(key: string): typeof fetch {
  return (input, init) => {
    const h = new Headers(init?.headers);
    if (isNewKey(key) && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
    h.set("apikey", key);
    return fetch(input, { ...init, headers: h });
  };
}
function serverClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: { fetch: makeFetch(key) },
  });
}

export const getPricingBundle = createServerFn({ method: "GET" }).handler(
  async (): Promise<PricingBundle> => {
    const sb = serverClient();
    const [devicesRes, storageRes, gradeRes, refurbRes, cfgRes] = await Promise.all([
      sb
        .from("devices")
        .select("id, model_name, release_year, base_resale_value, buy_tier, storage_options, image_url, sort_order")
        .eq("active", true)
        .order("sort_order", { ascending: true }),
      sb.from("storage_multipliers").select("storage_gb, multiplier"),
      sb.from("grade_multipliers").select("grade, multiplier"),
      sb.from("refurb_cost_items").select("key, amount").eq("active", true),
      sb.from("pricing_config").select("*").eq("id", 1).single(),
    ]);

    if (devicesRes.error) throw devicesRes.error;
    if (storageRes.error) throw storageRes.error;
    if (gradeRes.error) throw gradeRes.error;
    if (refurbRes.error) throw refurbRes.error;
    if (cfgRes.error) throw cfgRes.error;

    const storageMultipliers: Record<number, number> = {};
    for (const r of storageRes.data!) storageMultipliers[r.storage_gb] = Number(r.multiplier);
    const gradeMultipliers = { "A+": 0, A: 0, B: 0 } as Record<Grade, number>;
    for (const r of gradeRes.data!) gradeMultipliers[r.grade as Grade] = Number(r.multiplier);
    const refurbItems: Record<string, number> = {};
    for (const r of refurbRes.data!) refurbItems[r.key] = Number(r.amount);

    return {
      devices: devicesRes.data!.map((d) => ({
        id: d.id,
        model_name: d.model_name,
        release_year: d.release_year,
        base_resale_value: Number(d.base_resale_value),
        buy_tier: d.buy_tier,
        storage_options: d.storage_options,
      })),
      storageMultipliers,
      gradeMultipliers,
      refurbItems,
      config: {
        target_margin: Number(cfgRes.data.target_margin),
        warranty_reserve: Number(cfgRes.data.warranty_reserve),
        min_payout_floor: Number(cfgRes.data.min_payout_floor),
        tier2_flat_payout: Number(cfgRes.data.tier2_flat_payout),
        round_step: Number(cfgRes.data.round_step),
        list_price_ending: cfgRes.data.list_price_ending,
        diagnostic_min_battery: cfgRes.data.diagnostic_min_battery,
      },
    };
  },
);

export interface TradeInSubmissionInput {
  device_id: string;
  storage_gb: number;
  find_my_off: boolean;
  reported_stolen: boolean;
  water_corrosion: boolean;
  unauthorized_repair: boolean;
  battery_health: number;
  screen: "none" | "minor" | "cracked";
  back: "none" | "minor" | "cracked";
  charging_works: boolean;
  speaker_mic_works: boolean;
  camera_works: boolean;
  face_id_works: boolean;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  dropoff_method: string;
  dropoff_city?: string;
}

export const submitTradeIn = createServerFn({ method: "POST" })
  .inputValidator((data: TradeInSubmissionInput) => data)
  .handler(async ({ data }) => {
    const sb = serverClient();
    // Reload bundle server-side to prevent tampering
    const bundle = await getPricingBundle();
    const offer = computeOffer(data, bundle);
    const device = bundle.devices.find((d) => d.id === data.device_id);

    const ref = generateReferenceCode();
    const row = {
      reference_code: ref,
      device_id: data.device_id,
      model_name: device?.model_name ?? "unknown",
      storage_gb: data.storage_gb,
      screening_answers: {
        find_my_off: data.find_my_off,
        reported_stolen: data.reported_stolen,
        water_corrosion: data.water_corrosion,
        unauthorized_repair: data.unauthorized_repair,
      },
      battery_health: data.battery_health,
      cosmetic_grade: null,
      effective_grade: offer.status === "ok" ? offer.effectiveGrade : null,
      functional_answers: {
        screen: data.screen,
        back: data.back,
        charging_works: data.charging_works,
        speaker_mic_works: data.speaker_mic_works,
        camera_works: data.camera_works,
        face_id_works: data.face_id_works,
      },
      cracked_screen: data.screen === "cracked",
      cracked_back: data.back === "cracked",
      resale_value: offer.status === "ok" ? offer.resaleValue : null,
      refurb_cost: offer.status === "ok" ? offer.refurbCost : null,
      calculated_payout: offer.status === "ok" ? offer.payout : null,
      breakdown: offer.status === "ok" ? offer.breakdown : {},
      rejection_reason: offer.status === "rejected" ? offer.reason : null,
      status: offer.status === "ok" ? "pending" : "rejected",
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      customer_email: data.customer_email ?? null,
      dropoff_method: data.dropoff_method,
      dropoff_city: data.dropoff_city ?? null,
    };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("trade_in_submissions").insert(row);
    if (error) throw new Error(error.message);
    return { reference_code: ref, offer };
  });

export const getInventory = createServerFn({ method: "GET" }).handler(async () => {
  const sb = serverClient();
  const { data, error } = await sb
    .from("inventory")
    .select("id, storage_gb, grade, battery_health, list_price, photos, description_me, color, device_id, devices(model_name, release_year)")
    .eq("status", "available")
    .order("list_price", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
});

export const getInventoryItem = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const sb = serverClient();
    const { data: row, error } = await sb
      .from("inventory")
      .select("id, storage_gb, grade, battery_health, list_price, photos, description_me, color, device_id, status, devices(model_name, release_year)")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export interface OrderInput {
  items: Array<{ inventory_id: string; quantity: number }>;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  address: string;
  city: string;
  postal_code?: string;
  notes?: string;
  payment_method: "cod";
}

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: OrderInput) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const sb = supabaseAdmin;
    // Only 1 unit per order for now (each inventory row is unique)
    const first = data.items[0];
    if (!first) throw new Error("Prazna korpa");
    const { data: inv, error: invErr } = await sb
      .from("inventory")
      .select("id, list_price, status, storage_gb, grade, battery_health, devices(model_name)")
      .eq("id", first.inventory_id)
      .maybeSingle();
    if (invErr) throw new Error(invErr.message);
    if (!inv || inv.status !== "available") throw new Error("Uređaj više nije dostupan");

    const ref = generateReferenceCode();
    const unit = Number(inv.list_price);
    const { data: order, error } = await sb
      .from("orders")
      .insert({
        reference_code: ref,
        inventory_id: inv.id,
        item_snapshot: {
          model_name: (inv.devices as { model_name: string } | null)?.model_name,
          storage_gb: inv.storage_gb,
          grade: inv.grade,
          battery_health: inv.battery_health,
        },
        unit_price: unit,
        total_price: unit,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_email: data.customer_email ?? null,
        address: data.address,
        city: data.city,
        postal_code: data.postal_code ?? null,
        notes: data.notes ?? null,
        payment_method: data.payment_method,
        status: "new",
      })
      .select("id, reference_code")
      .single();
    if (error) throw new Error(error.message);
    // Reserve unit
    await sb.from("inventory").update({ status: "reserved" }).eq("id", inv.id);
    return { reference_code: order.reference_code, id: order.id };
  });

export const getOrderByRef = createServerFn({ method: "GET" })
  .inputValidator((data: { ref: string }) => data)
  .handler(async ({ data }) => {
    if (!data.ref || data.ref.length < 6) return null;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("orders")
      .select("reference_code, item_snapshot, unit_price, total_price, status, city, address, payment_method, created_at")
      .eq("reference_code", data.ref)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export function calcListPrice(resaleValue: number, ending: number) {
  return roundListPriceEnding(resaleValue, ending);
}

// Model-level catalog: aggregates inventory into one card per iPhone model
// (derived from the existing `devices` + `inventory` tables — no schema change).
export const getModelCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const sb = serverClient();
  const { data, error } = await sb
    .from("inventory")
    .select("storage_gb, grade, battery_health, list_price, color, device_id, devices(model_name, release_year, sort_order, storage_options)")
    .eq("status", "available");
  if (error) throw new Error(error.message);

  type Row = NonNullable<typeof data>[number];
  const groups = new Map<string, { model: string; year: number; sort: number; rows: Row[] }>();
  for (const r of data ?? []) {
    const d = r.devices as { model_name: string; release_year: number; sort_order: number } | null;
    if (!d) continue;
    const key = d.model_name;
    if (!groups.has(key)) groups.set(key, { model: d.model_name, year: d.release_year, sort: d.sort_order, rows: [] });
    groups.get(key)!.rows.push(r);
  }

  const models = Array.from(groups.values()).map((g) => {
    const prices = g.rows.map((r) => Number(r.list_price));
    const storages = Array.from(new Set(g.rows.map((r) => r.storage_gb))).sort((a, b) => a - b);
    const grades = Array.from(new Set(g.rows.map((r) => r.grade)));
    const colors = Array.from(new Set(g.rows.map((r) => r.color).filter((c): c is string => !!c)));
    return {
      slug: modelToSlug(g.model),
      model_name: g.model,
      release_year: g.year,
      sort_order: g.sort,
      min_price: Math.min(...prices),
      storages,
      grades,
      colors,
      units: g.rows.length,
    };
  });
  models.sort((a, b) => a.sort_order - b.sort_order || b.release_year - a.release_year);
  return models;
});

// Detail: all available inventory rows for one model_name (matched by slug).
export const getModelBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const sb = serverClient();
    const { data: devices, error: devErr } = await sb
      .from("devices")
      .select("id, model_name, release_year, storage_options")
      .eq("active", true);
    if (devErr) throw new Error(devErr.message);
    const device = (devices ?? []).find((d) => modelToSlug(d.model_name) === data.slug);
    if (!device) return null;

    const { data: rows, error } = await sb
      .from("inventory")
      .select("id, storage_gb, grade, battery_health, list_price, photos, color, description_me")
      .eq("device_id", device.id)
      .eq("status", "available")
      .order("list_price", { ascending: true });
    if (error) throw new Error(error.message);

    return {
      model_name: device.model_name,
      release_year: device.release_year,
      storage_options: device.storage_options,
      units: (rows ?? []).map((r) => ({
        id: r.id,
        storage_gb: r.storage_gb,
        grade: r.grade,
        battery_health: r.battery_health,
        list_price: Number(r.list_price),
        photos: r.photos,
        color: r.color,
        description_me: r.description_me,
      })),
    };
  });
