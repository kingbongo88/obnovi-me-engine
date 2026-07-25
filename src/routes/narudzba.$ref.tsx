import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { getOrderByRef } from "@/lib/pricing.functions";
import { me } from "@/i18n/me";
import { Check } from "lucide-react";

export const Route = createFileRoute("/narudzba/$ref")({
  head: ({ params }) => ({
    meta: [{ title: `Porudžbina ${params.ref} — Obnovi.me` }, { name: "robots", content: "noindex" }],
  }),
  loader: async ({ params }) => {
    const o = await getOrderByRef({ data: { ref: params.ref } });
    if (!o) throw notFound();
    return o;
  },
  component: OrderPage,
  notFoundComponent: () => (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-narrow py-24 text-center">
        <h1 className="font-display text-4xl">Porudžbina nije pronađena</h1>
      </main>
      <SiteFooter />
    </div>
  ),
});

function OrderPage() {
  const order = Route.useLoaderData();
  const snap = order.item_snapshot as { model_name?: string; storage_gb?: number; grade?: string };
  const statusMap: Record<string, string> = {
    new: "Nova",
    confirmed: "Potvrđena",
    shipped: "Poslata",
    delivered: "Isporučena",
    cancelled: "Otkazana",
  };
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-narrow py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 md:p-12">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--success)]/10 text-[color:var(--success)]">
            <Check className="h-6 w-6" />
          </div>
          <h1 className="mt-6 font-display text-4xl">{me.checkout.orderSuccess}</h1>
          <p className="mt-3 text-muted-foreground">Kontaktiraćemo te radi potvrde adrese i dogovora oko dostave.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Info label={me.checkout.orderRefLabel} value={order.reference_code} />
            <Info label="Status" value={statusMap[order.status] ?? order.status} />
            <Info label="Uređaj" value={`${snap.model_name ?? ""} ${snap.storage_gb ? (snap.storage_gb >= 1024 ? "1TB" : snap.storage_gb + "GB") : ""}`} />
            <Info label="Iznos" value={`${Number(order.total_price)} €`} />
          </div>
          <Link to="/" className="btn-outline mt-8">Nazad na početnu</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[color:var(--surface-2)] p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}
