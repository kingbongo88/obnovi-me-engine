import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { useCart } from "@/lib/cart";
import { me } from "@/i18n/me";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/kosarica")({
  head: () => ({ meta: [{ title: "Korpa — Obnovi.me" }, { name: "robots", content: "noindex" }] }),
  component: Cart,
});

function Cart() {
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const total = items.reduce((s, i) => s + i.list_price, 0);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-narrow py-12">
        <h1 className="font-display text-4xl">{me.cart.title}</h1>
        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            {me.cart.empty}
            <div className="mt-4">
              <Link to="/kupi" className="btn-primary">{me.cart.continue}</Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
            <div className="space-y-3">
              {items.map((i) => (
                <div key={i.inventory_id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                  <div className="h-20 w-20 rounded-xl bg-[color:var(--surface-2)]" />
                  <div className="flex-1">
                    <div className="font-medium">{i.model_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {i.storage_gb >= 1024 ? `${i.storage_gb / 1024} TB` : `${i.storage_gb} GB`} · {i.grade}
                    </div>
                  </div>
                  <div className="font-medium">{i.list_price} €</div>
                  <button onClick={() => remove(i.inventory_id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="h-fit rounded-2xl border border-border bg-card p-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{me.cart.total}</span>
                <span className="font-semibold">{total} €</span>
              </div>
              <Link to="/naplata" className="btn-primary mt-6 w-full">
                {me.cart.checkout}
              </Link>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
