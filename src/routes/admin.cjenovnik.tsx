import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  adminGetAllPricing,
  adminUpdateDevice,
  adminUpdateStorageMultiplier,
  adminUpdateGradeMultiplier,
  adminUpdateRefurbItem,
  adminUpdatePricingConfig,
} from "@/lib/admin.functions";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/admin/cjenovnik")({
  component: PricingPage,
});

interface AllPricing {
  devices: Array<{ id: string; model_name: string; base_resale_value: number; buy_tier: number; active: boolean; release_year: number }>;
  storage: Array<{ storage_gb: number; multiplier: number }>;
  grade: Array<{ grade: string; label_me: string; multiplier: number }>;
  refurb: Array<{ key: string; label_me: string; amount: number; active: boolean }>;
  config: {
    target_margin: number; warranty_reserve: number; min_payout_floor: number;
    tier2_flat_payout: number; round_step: number; list_price_ending: number; diagnostic_min_battery: number;
  };
}

function PricingPage() {
  const get = useServerFn(adminGetAllPricing);
  const q = useQuery({ queryKey: ["admin","pricing-all"], queryFn: () => get() });
  const data = q.data as unknown as AllPricing | undefined;
  const [tab, setTab] = useState<"devices"|"storage"|"grade"|"refurb"|"config">("devices");

  if (!data) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div>
      <h1 className="font-display text-3xl">Pricing</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {[
          { k: "devices", l: "Models" },
          { k: "storage", l: "Storage" },
          { k: "grade", l: "Grades" },
          { k: "refurb", l: "Repairs" },
          { k: "config", l: "Settings" },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k as "devices"|"storage"|"grade"|"refurb"|"config")}
            className={"rounded-full px-4 py-1.5 text-sm " + (tab === t.k ? "bg-primary text-primary-foreground" : "border border-border")}
          >{t.l}</button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "devices" && <DevicesTab data={data} onSaved={() => q.refetch()} />}
        {tab === "storage" && <StorageTab data={data} onSaved={() => q.refetch()} />}
        {tab === "grade" && <GradeTab data={data} onSaved={() => q.refetch()} />}
        {tab === "refurb" && <RefurbTab data={data} onSaved={() => q.refetch()} />}
        {tab === "config" && <ConfigTab data={data} onSaved={() => q.refetch()} />}
      </div>
    </div>
  );
}

function DevicesTab({ data, onSaved }: { data: AllPricing; onSaved: () => void }) {
  const update = useServerFn(adminUpdateDevice);
  const m = useMutation({ mutationFn: (v: Parameters<typeof update>[0]["data"]) => update({ data: v }), onSuccess: () => { toast.success("Saved"); onSaved(); }, onError: (e) => toast.error(e instanceof Error ? e.message : "Error") });

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-[color:var(--surface-2)] text-left text-xs uppercase text-muted-foreground">
          <tr><th className="px-4 py-3">Model</th><th className="px-4 py-3">Year</th><th className="px-4 py-3">Base price (€)</th><th className="px-4 py-3">Tier</th><th className="px-4 py-3">Active</th><th></th></tr>
        </thead>
        <tbody>
          {data.devices.map((d) => <DeviceRow key={d.id} device={d} onSave={(v) => m.mutate(v)} />)}
        </tbody>
      </table>
    </div>
  );
}
function DeviceRow({ device, onSave }: { device: AllPricing["devices"][number]; onSave: (v: { id: string; base_resale_value: number; buy_tier: number; active: boolean }) => void }) {
  const [v, setV] = useState({ base_resale_value: Number(device.base_resale_value), buy_tier: device.buy_tier, active: device.active });
  useEffect(() => setV({ base_resale_value: Number(device.base_resale_value), buy_tier: device.buy_tier, active: device.active }), [device]);
  return (
    <tr className="border-t border-border">
      <td className="px-4 py-2">{device.model_name}</td>
      <td className="px-4 py-2 text-muted-foreground">{device.release_year}</td>
      <td className="px-4 py-2"><input type="number" step="1" value={v.base_resale_value} onChange={(e) => setV({ ...v, base_resale_value: parseFloat(e.target.value)||0 })} className="w-24 rounded border border-border bg-background px-2 py-1" /></td>
      <td className="px-4 py-2"><select value={v.buy_tier} onChange={(e) => setV({ ...v, buy_tier: parseInt(e.target.value) })} className="rounded border border-border bg-background px-2 py-1"><option value={1}>1</option><option value={2}>2</option></select></td>
      <td className="px-4 py-2"><input type="checkbox" checked={v.active} onChange={(e) => setV({ ...v, active: e.target.checked })} /></td>
      <td className="px-4 py-2"><button onClick={() => onSave({ id: device.id, ...v })} className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">Save</button></td>
    </tr>
  );
}

function StorageTab({ data, onSaved }: { data: AllPricing; onSaved: () => void }) {
  const update = useServerFn(adminUpdateStorageMultiplier);
  const m = useMutation({ mutationFn: (v: { storage_gb: number; multiplier: number }) => update({ data: v }), onSuccess: () => { toast.success("Saved"); onSaved(); } });
  return <SimpleMultTable rows={data.storage.map((s) => ({ key: String(s.storage_gb), label: s.storage_gb >= 1024 ? `${s.storage_gb / 1024} TB` : `${s.storage_gb} GB`, mult: Number(s.multiplier) }))}
    onSave={(k, mult) => m.mutate({ storage_gb: parseInt(k), multiplier: mult })} />;
}
function GradeTab({ data, onSaved }: { data: AllPricing; onSaved: () => void }) {
  const update = useServerFn(adminUpdateGradeMultiplier);
  const m = useMutation({ mutationFn: (v: { grade: string; multiplier: number }) => update({ data: v }), onSuccess: () => { toast.success("Saved"); onSaved(); } });
  return <SimpleMultTable rows={data.grade.map((g) => ({ key: g.grade, label: `${g.grade} — ${g.label_me}`, mult: Number(g.multiplier) }))}
    onSave={(k, mult) => m.mutate({ grade: k, multiplier: mult })} />;
}
function SimpleMultTable({ rows, onSave }: { rows: Array<{ key: string; label: string; mult: number }>; onSave: (k: string, mult: number) => void }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-[color:var(--surface-2)] text-left text-xs uppercase text-muted-foreground">
          <tr><th className="px-4 py-3">Item</th><th className="px-4 py-3">Multiplier</th><th></th></tr>
        </thead>
        <tbody>
          {rows.map((r) => <MultRow key={r.key} r={r} onSave={onSave} />)}
        </tbody>
      </table>
    </div>
  );
}
function MultRow({ r, onSave }: { r: { key: string; label: string; mult: number }; onSave: (k: string, mult: number) => void }) {
  const [v, setV] = useState(r.mult);
  useEffect(() => setV(r.mult), [r.mult]);
  return (
    <tr className="border-t border-border">
      <td className="px-4 py-2">{r.label}</td>
      <td className="px-4 py-2"><input type="number" step="0.01" value={v} onChange={(e) => setV(parseFloat(e.target.value)||0)} className="w-24 rounded border border-border bg-background px-2 py-1" /></td>
      <td className="px-4 py-2"><button onClick={() => onSave(r.key, v)} className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">Save</button></td>
    </tr>
  );
}

function RefurbTab({ data, onSaved }: { data: AllPricing; onSaved: () => void }) {
  const update = useServerFn(adminUpdateRefurbItem);
  const m = useMutation({ mutationFn: (v: { key: string; amount: number; active: boolean }) => update({ data: v }), onSuccess: () => { toast.success("Saved"); onSaved(); } });
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-[color:var(--surface-2)] text-left text-xs uppercase text-muted-foreground">
          <tr><th className="px-4 py-3">Item</th><th className="px-4 py-3">Amount (€)</th><th className="px-4 py-3">Active</th><th></th></tr>
        </thead>
        <tbody>
          {data.refurb.map((r) => <RefurbRow key={r.key} r={r} onSave={(a, act) => m.mutate({ key: r.key, amount: a, active: act })} />)}
        </tbody>
      </table>
    </div>
  );
}
function RefurbRow({ r, onSave }: { r: AllPricing["refurb"][number]; onSave: (a: number, act: boolean) => void }) {
  const [amt, setAmt] = useState(Number(r.amount));
  const [act, setAct] = useState(r.active);
  useEffect(() => { setAmt(Number(r.amount)); setAct(r.active); }, [r]);
  return (
    <tr className="border-t border-border">
      <td className="px-4 py-2">{r.label_me}</td>
      <td className="px-4 py-2"><input type="number" value={amt} onChange={(e) => setAmt(parseFloat(e.target.value)||0)} className="w-24 rounded border border-border bg-background px-2 py-1" /></td>
      <td className="px-4 py-2"><input type="checkbox" checked={act} onChange={(e) => setAct(e.target.checked)} /></td>
      <td className="px-4 py-2"><button onClick={() => onSave(amt, act)} className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">Save</button></td>
    </tr>
  );
}

function ConfigTab({ data, onSaved }: { data: AllPricing; onSaved: () => void }) {
  const update = useServerFn(adminUpdatePricingConfig);
  const [c, setC] = useState({ ...data.config });
  useEffect(() => setC({ ...data.config }), [data.config]);
  const m = useMutation({
    mutationFn: () => update({ data: {
      target_margin: Number(c.target_margin),
      warranty_reserve: Number(c.warranty_reserve),
      min_payout_floor: Number(c.min_payout_floor),
      tier2_flat_payout: Number(c.tier2_flat_payout),
      round_step: Number(c.round_step),
      list_price_ending: Number(c.list_price_ending),
      diagnostic_min_battery: Number(c.diagnostic_min_battery),
    }}),
    onSuccess: () => { toast.success("Saved"); onSaved(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Error"),
  });

  const F = (label: string, key: keyof typeof c, step: string = "0.01") => (
    <label className="block">
      <div className="mb-1 text-xs font-medium">{label}</div>
      <input type="number" step={step} value={c[key] as number} onChange={(e) => setC({ ...c, [key]: parseFloat(e.target.value)||0 })}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
    </label>
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="grid gap-4 md:grid-cols-2">
        {F("Target margin (e.g. 0.33)", "target_margin")}
        {F("Warranty reserve (e.g. 0.05)", "warranty_reserve")}
        {F("Minimum payout (€)", "min_payout_floor", "1")}
        {F("Tier 2 flat payout (€)", "tier2_flat_payout", "1")}
        {F("Payout rounding (€)", "round_step", "1")}
        {F("Price ends with digit", "list_price_ending", "1")}
        {F("Min. battery (%)", "diagnostic_min_battery", "1")}
      </div>
      <div className="mt-6">
        <button onClick={() => m.mutate()} className="btn-primary">Save</button>
      </div>
    </div>
  );
}
