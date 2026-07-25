import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation } from "@tanstack/react-query";
import { adminListInventory, adminSaveInventory, adminDeleteInventory, adminGetAllPricing } from "@/lib/admin.functions";
import { roundListPriceEnding } from "@/lib/pricing";
import { toast } from "sonner";
import { useState } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/inventar")({
  component: InvPage,
});

interface InvRow {
  id: string;
  device_id: string;
  storage_gb: number;
  grade: "A+" | "A" | "B";
  battery_health: number;
  list_price: number;
  status: "available"|"reserved"|"sold"|"hidden";
  color?: string | null;
  description_me?: string | null;
  photos?: string[];
  devices?: { model_name: string } | null;
}

function InvPage() {
  const list = useServerFn(adminListInventory);
  const del = useServerFn(adminDeleteInventory);
  const getPricing = useServerFn(adminGetAllPricing);
  const q = useQuery({ queryKey: ["admin","inv"], queryFn: () => list() });
  const p = useQuery({ queryKey: ["admin","pricing-all"], queryFn: () => getPricing() });
  const dm = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { q.refetch(); toast.success("Obrisano"); },
  });
  const [editing, setEditing] = useState<Partial<InvRow> | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Inventar</h1>
        <button onClick={() => setEditing({})} className="btn-primary"><Plus className="mr-1 h-4 w-4" />Novi uređaj</button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--surface-2)] text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Mem.</th>
              <th className="px-4 py-3">Stanje</th>
              <th className="px-4 py-3">Bat.</th>
              <th className="px-4 py-3">Cijena</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {((q.data ?? []) as unknown as InvRow[]).map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3">{r.devices?.model_name}</td>
                <td className="px-4 py-3">{r.storage_gb >= 1024 ? "1TB" : `${r.storage_gb}GB`}</td>
                <td className="px-4 py-3">{r.grade}</td>
                <td className="px-4 py-3">{r.battery_health}%</td>
                <td className="px-4 py-3 font-medium">{Number(r.list_price)} €</td>
                <td className="px-4 py-3">{r.status}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(r)} className="text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => { if (confirm("Obrisati?")) dm.mutate(r.id); }} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {q.data && q.data.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Nema uređaja.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && p.data && (
        <InvEditor
          initial={editing}
          pricing={p.data as unknown as {
            devices: Array<{ id: string; model_name: string; base_resale_value: number; storage_options: number[] }>;
            storage: Array<{ storage_gb: number; multiplier: number }>;
            grade: Array<{ grade: string; multiplier: number }>;
            config: { list_price_ending: number };
          }}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); q.refetch(); }}
        />
      )}
    </div>
  );
}

function InvEditor({
  initial, pricing, onClose, onSaved,
}: {
  initial: Partial<InvRow>;
  pricing: {
    devices: Array<{ id: string; model_name: string; base_resale_value: number; storage_options: number[] }>;
    storage: Array<{ storage_gb: number; multiplier: number }>;
    grade: Array<{ grade: string; multiplier: number }>;
    config: { list_price_ending: number };
  };
  onClose: () => void;
  onSaved: () => void;
}) {
  const save = useServerFn(adminSaveInventory);
  const [f, setF] = useState<Partial<InvRow>>({
    grade: "A", storage_gb: 128, battery_health: 92, list_price: 0, status: "available", photos: [], ...initial,
  });
  const device = pricing.devices.find((d) => d.id === f.device_id);

  const suggested = () => {
    if (!device || !f.grade || !f.storage_gb) return 0;
    const sm = pricing.storage.find((s) => s.storage_gb === f.storage_gb)?.multiplier ?? 1;
    const gm = pricing.grade.find((g) => g.grade === f.grade)?.multiplier ?? 1;
    return roundListPriceEnding(Number(device.base_resale_value) * Number(sm) * Number(gm), pricing.config.list_price_ending);
  };

  const m = useMutation({
    mutationFn: async () => {
      if (!f.device_id) throw new Error("Model je obavezan");
      return save({
        data: {
          id: f.id,
          device_id: f.device_id,
          storage_gb: f.storage_gb!,
          grade: f.grade as "A+"|"A"|"B",
          battery_health: f.battery_health!,
          list_price: Number(f.list_price),
          status: (f.status ?? "available") as "available"|"reserved"|"sold"|"hidden",
          color: f.color ?? null,
          description_me: f.description_me ?? null,
          photos: f.photos ?? [],
        },
      });
    },
    onSuccess: () => { toast.success("Sačuvano"); onSaved(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Greška"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-2xl">{f.id ? "Izmjena uređaja" : "Novi uređaj"}</h2>
        <div className="mt-4 grid gap-3">
          <label className="block">
            <div className="mb-1 text-xs font-medium">Model</div>
            <select value={f.device_id ?? ""} onChange={(e) => setF({ ...f, device_id: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
              <option value="">— izaberi —</option>
              {pricing.devices.map((d) => <option key={d.id} value={d.id}>{d.model_name}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <Field label="Memorija (GB)" type="number" value={String(f.storage_gb ?? "")} onChange={(v) => setF({ ...f, storage_gb: parseInt(v)||0 })} />
            <label className="block">
              <div className="mb-1 text-xs font-medium">Stanje</div>
              <select value={f.grade ?? "A"} onChange={(e) => setF({ ...f, grade: e.target.value as "A+"|"A"|"B" })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
                <option value="A+">A+</option><option value="A">A</option><option value="B">B</option>
              </select>
            </label>
            <Field label="Baterija (%)" type="number" value={String(f.battery_health ?? "")} onChange={(v) => setF({ ...f, battery_health: parseInt(v)||0 })} />
          </div>
          <div className="flex items-end gap-2">
            <Field label="Cijena (€)" type="number" value={String(f.list_price ?? "")} onChange={(v) => setF({ ...f, list_price: parseFloat(v)||0 })} />
            <button type="button" onClick={() => setF({ ...f, list_price: suggested() })} className="rounded-full border border-border px-3 py-2 text-xs">
              Predloži: {suggested()} €
            </button>
          </div>
          <Field label="Boja" value={f.color ?? ""} onChange={(v) => setF({ ...f, color: v })} />
          <label className="block">
            <div className="mb-1 text-xs font-medium">Fotografije (URL, po jedan u redu)</div>
            <textarea rows={3} value={(f.photos ?? []).join("\n")} onChange={(e) => setF({ ...f, photos: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <div className="mb-1 text-xs font-medium">Opis</div>
            <textarea rows={3} value={f.description_me ?? ""} onChange={(e) => setF({ ...f, description_me: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <div className="mb-1 text-xs font-medium">Status</div>
            <select value={f.status ?? "available"} onChange={(e) => setF({ ...f, status: e.target.value as "available"|"reserved"|"sold"|"hidden" })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
              <option value="available">available</option><option value="reserved">reserved</option>
              <option value="sold">sold</option><option value="hidden">hidden</option>
            </select>
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="btn-outline">Otkaži</button>
          <button onClick={() => m.mutate()} disabled={m.isPending} className="btn-primary disabled:opacity-40">Sačuvaj</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium">{label}</div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
    </label>
  );
}
