import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

type Ctx = { supabase: { from: (t: string) => { select: (c: string) => { eq: (col: string, v: string) => { eq: (col: string, v: string) => { maybeSingle: () => Promise<{ data: unknown; error: { message: string } | null }> } } } } }; userId: string };

async function assertAdmin(ctx: Ctx) {
  const { data, error } = await ctx.supabase.from("user_roles").select("role").eq("user_id", ctx.userId).eq("role", "admin").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Zabranjen pristup");
}

export const amIAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data, userId: context.userId };
  });

export const adminListSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin({ supabase: context.supabase as unknown as Ctx["supabase"], userId: context.userId });
    const { data, error } = await context.supabase
      .from("trade_in_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data;
  });

export const adminUpdateSubmissionStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; status: "pending" | "accepted" | "rejected" | "completed" | "cancelled" }) =>
    z.object({ id: z.string().uuid(), status: z.enum(["pending","accepted","rejected","completed","cancelled"]) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin({ supabase: context.supabase as unknown as Ctx["supabase"], userId: context.userId });
    const { error } = await context.supabase.from("trade_in_submissions").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListInventory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin({ supabase: context.supabase as unknown as Ctx["supabase"], userId: context.userId });
    const { data, error } = await context.supabase
      .from("inventory")
      .select("*, devices(model_name)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

const inventorySchema = z.object({
  id: z.string().uuid().optional(),
  device_id: z.string().uuid(),
  storage_gb: z.number().int(),
  grade: z.enum(["A+","A","B"]),
  battery_health: z.number().int().min(0).max(100),
  list_price: z.number().nonnegative(),
  status: z.enum(["available","reserved","sold","hidden"]).default("available"),
  color: z.string().nullable().optional(),
  description_me: z.string().nullable().optional(),
  photos: z.array(z.string()).default([]),
});

export const adminSaveInventory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof inventorySchema>) => inventorySchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin({ supabase: context.supabase as unknown as Ctx["supabase"], userId: context.userId });
    if (data.id) {
      const { error } = await context.supabase.from("inventory").update(data).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true, id: data.id };
    }
    const { id: _drop, ...insertData } = data;
    void _drop;
    const { data: row, error } = await context.supabase.from("inventory").insert(insertData).select("id").single();
    if (error) throw new Error(error.message);
    return { ok: true, id: row.id };
  });

export const adminDeleteInventory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin({ supabase: context.supabase as unknown as Ctx["supabase"], userId: context.userId });
    const { error } = await context.supabase.from("inventory").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin({ supabase: context.supabase as unknown as Ctx["supabase"], userId: context.userId });
    const { data, error } = await context.supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
    if (error) throw new Error(error.message);
    return data;
  });

export const adminUpdateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; status: "new"|"confirmed"|"shipped"|"delivered"|"cancelled" }) =>
    z.object({ id: z.string().uuid(), status: z.enum(["new","confirmed","shipped","delivered","cancelled"]) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin({ supabase: context.supabase as unknown as Ctx["supabase"], userId: context.userId });
    const { error } = await context.supabase.from("orders").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------- Pricing config (all editable) ---------------- */

export const adminGetAllPricing = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin({ supabase: context.supabase as unknown as Ctx["supabase"], userId: context.userId });
    const [devices, storage, grade, refurb, cfg] = await Promise.all([
      context.supabase.from("devices").select("*").order("sort_order"),
      context.supabase.from("storage_multipliers").select("*").order("storage_gb"),
      context.supabase.from("grade_multipliers").select("*").order("sort_order"),
      context.supabase.from("refurb_cost_items").select("*").order("sort_order"),
      context.supabase.from("pricing_config").select("*").eq("id", 1).single(),
    ]);
    return {
      devices: devices.data ?? [],
      storage: storage.data ?? [],
      grade: grade.data ?? [],
      refurb: refurb.data ?? [],
      config: cfg.data,
    };
  });

export const adminUpdateDevice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; base_resale_value: number; buy_tier: number; active: boolean }) =>
    z.object({ id: z.string().uuid(), base_resale_value: z.number(), buy_tier: z.number().int(), active: z.boolean() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin({ supabase: context.supabase as unknown as Ctx["supabase"], userId: context.userId });
    const { id, ...rest } = data;
    const { error } = await context.supabase.from("devices").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUpdateStorageMultiplier = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { storage_gb: number; multiplier: number }) =>
    z.object({ storage_gb: z.number().int(), multiplier: z.number() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin({ supabase: context.supabase as unknown as Ctx["supabase"], userId: context.userId });
    const { error } = await context.supabase.from("storage_multipliers").update({ multiplier: data.multiplier }).eq("storage_gb", data.storage_gb);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUpdateGradeMultiplier = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { grade: string; multiplier: number }) =>
    z.object({ grade: z.enum(["A+","A","B"]), multiplier: z.number() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin({ supabase: context.supabase as unknown as Ctx["supabase"], userId: context.userId });
    const { error } = await context.supabase.from("grade_multipliers").update({ multiplier: data.multiplier }).eq("grade", data.grade);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUpdateRefurbItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { key: string; amount: number; active: boolean }) =>
    z.object({ key: z.string(), amount: z.number(), active: z.boolean() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin({ supabase: context.supabase as unknown as Ctx["supabase"], userId: context.userId });
    const { error } = await context.supabase.from("refurb_cost_items").update({ amount: data.amount, active: data.active }).eq("key", data.key);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUpdatePricingConfig = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    target_margin: number; warranty_reserve: number; min_payout_floor: number;
    tier2_flat_payout: number; round_step: number; list_price_ending: number; diagnostic_min_battery: number;
  }) =>
    z.object({
      target_margin: z.number(), warranty_reserve: z.number(), min_payout_floor: z.number(),
      tier2_flat_payout: z.number(), round_step: z.number(),
      list_price_ending: z.number().int(), diagnostic_min_battery: z.number().int(),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin({ supabase: context.supabase as unknown as Ctx["supabase"], userId: context.userId });
    const { error } = await context.supabase.from("pricing_config").update(data).eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------- Site content (CMS) ---------------- */

export const adminListContent = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin({ supabase: context.supabase as unknown as Ctx["supabase"], userId: context.userId });
    const { data, error } = await context.supabase.from("site_content").select("*").order("key");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminSaveContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { key: string; value: string }) =>
    z.object({ key: z.string().min(1).max(120), value: z.string().max(5000) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin({ supabase: context.supabase as unknown as Ctx["supabase"], userId: context.userId });
    const { error } = await context.supabase
      .from("site_content")
      .upsert({ key: data.key, value: data.value }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { key: string }) => z.object({ key: z.string() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin({ supabase: context.supabase as unknown as Ctx["supabase"], userId: context.userId });
    const { error } = await context.supabase.from("site_content").delete().eq("key", data.key);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
