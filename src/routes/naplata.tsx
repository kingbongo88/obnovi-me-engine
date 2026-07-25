import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { useCart } from "@/lib/cart";
import { me } from "@/i18n/me";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { placeOrder } from "@/lib/pricing.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/naplata")({
  head: () => ({ meta: [{ title: "Naplata — Obnovi.me" }, { name: "robots", content: "noindex" }] }),
  component: Checkout,
});

function Checkout() {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const nav = useNavigate();
  const submit = useServerFn(placeOrder);
  const total = items.reduce((s, i) => s + i.list_price, 0);

  const [f, setF] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    address: "",
    city: "",
    postal_code: "",
    notes: "",
  });

  const m = useMutation({
    mutationFn: async () => {
      if (items.length === 0) throw new Error("Korpa je prazna");
      if (!f.customer_name.trim() || !f.customer_phone.trim() || !f.address.trim() || !f.city.trim()) {
        throw new Error("Popuni obavezna polja");
      }
      return submit({
        data: {
          items: items.map((i) => ({ inventory_id: i.inventory_id, quantity: 1 })),
          customer_name: f.customer_name.trim(),
          customer_phone: f.customer_phone.trim(),
          customer_email: f.customer_email.trim() || undefined,
          address: f.address.trim(),
          city: f.city.trim(),
          postal_code: f.postal_code.trim() || undefined,
          notes: f.notes.trim() || undefined,
          payment_method: "cod",
        },
      });
    },
    onSuccess: (res) => {
      clear();
      nav({ to: "/narudzba/$ref", params: { ref: res.reference_code } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : me.common.error),
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="container-narrow py-24 text-center">
          <p className="text-muted-foreground">{me.cart.empty}</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-narrow py-12">
        <h1 className="font-display text-4xl">{me.checkout.title}</h1>
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <Section title={me.checkout.contactTitle}>
              <Field label={me.sell.nameLabel} value={f.customer_name} onChange={(v) => setF({ ...f, customer_name: v })} />
              <Field label={me.sell.phoneLabel} value={f.customer_phone} onChange={(v) => setF({ ...f, customer_phone: v })} />
              <Field label={me.sell.emailLabel} value={f.customer_email} onChange={(v) => setF({ ...f, customer_email: v })} type="email" />
            </Section>
            <Section title={me.checkout.shippingTitle}>
              <Field label={me.checkout.addressLabel} value={f.address} onChange={(v) => setF({ ...f, address: v })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={me.checkout.cityLabel} value={f.city} onChange={(v) => setF({ ...f, city: v })} />
                <Field label={me.checkout.postalLabel} value={f.postal_code} onChange={(v) => setF({ ...f, postal_code: v })} />
              </div>
              <Field label={me.checkout.notesLabel} value={f.notes} onChange={(v) => setF({ ...f, notes: v })} />
            </Section>
            <Section title={me.checkout.paymentTitle}>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-[color:var(--accent-brand)] bg-[color:var(--accent)] p-4">
                  <input type="radio" checked readOnly className="mt-1" />
                  <div>
                    <div className="font-medium">{me.checkout.cod}</div>
                    <div className="text-xs text-muted-foreground">{me.checkout.codSub}</div>
                  </div>
                </label>
                <label className="flex cursor-not-allowed items-start gap-3 rounded-xl border border-border bg-muted/40 p-4 opacity-50">
                  <input type="radio" disabled className="mt-1" />
                  <div>
                    <div className="font-medium">{me.checkout.card}</div>
                  </div>
                </label>
              </div>
            </Section>
          </div>
          <aside className="h-fit rounded-2xl border border-border bg-card p-6">
            <div className="text-sm font-semibold">Pregled</div>
            <div className="mt-3 space-y-2">
              {items.map((i) => (
                <div key={i.inventory_id} className="flex justify-between text-sm">
                  <span>{i.model_name} · {i.storage_gb >= 1024 ? "1TB" : `${i.storage_gb}GB`}</span>
                  <span>{i.list_price} €</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold">
              <span>{me.cart.total}</span><span>{total} €</span>
            </div>
            <button onClick={() => m.mutate()} disabled={m.isPending} className="btn-primary mt-6 w-full disabled:opacity-40">
              {m.isPending ? "Šaljemo..." : me.checkout.placeOrder}
            </button>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}
function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-medium">{label}</div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-[color:var(--accent-brand)]" />
    </label>
  );
}
