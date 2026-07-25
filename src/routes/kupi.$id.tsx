import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { getInventoryItem } from "@/lib/pricing.functions";
import { useCart } from "@/lib/cart";
import { me } from "@/i18n/me";
import { Shield, RotateCcw, Battery } from "lucide-react";
import { DeviceSilhouette } from "@/components/device-silhouette";
import { GradeMeter } from "@/components/grade-meter";
import { toast } from "sonner";

export const Route = createFileRoute("/kupi/$id")({
  head: ({ loaderData }) => {
    const item = loaderData as Awaited<ReturnType<typeof getInventoryItem>> | undefined;
    if (!item) {
      return {
        meta: [
          { title: "Uređaj nedostupan — Obnovi.me" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const model = (item.devices as { model_name: string } | null)?.model_name ?? "iPhone";
    const title = `${model} ${item.storage_gb >= 1024 ? "1 TB" : `${item.storage_gb} GB`} (${item.grade}) — ${Number(item.list_price)} € — Obnovi.me`;
    const desc = `Obnovljeni ${model}, ${item.storage_gb >= 1024 ? "1TB" : item.storage_gb + "GB"}, stanje ${item.grade}, baterija ${item.battery_health}%. 12 mjeseci garancije.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: async ({ params }) => {
    const item = await getInventoryItem({ data: { id: params.id } });
    if (!item) throw notFound();
    return item;
  },
  component: Detail,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-narrow py-24 text-center">
        <h1 className="font-display text-4xl">Uređaj nije pronađen</h1>
      </main>
      <SiteFooter />
    </div>
  );
}

function Detail() {
  const item = Route.useLoaderData();
  const nav = useNavigate();
  const add = useCart((s) => s.add);
  const model = (item.devices as { model_name: string } | null)?.model_name ?? "iPhone";

  const onBuy = () => {
    add({
      inventory_id: item.id,
      model_name: model,
      storage_gb: item.storage_gb,
      grade: item.grade,
      list_price: Number(item.list_price),
      photo: item.photos?.[0] ?? null,
    });
    toast.success("Dodato u korpu");
    nav({ to: "/kosarica" });
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-narrow py-12">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex aspect-square items-center justify-center rounded-3xl bg-[color:var(--surface-2)] text-[color:var(--accent-brand)]">
            {item.photos?.[0] ? (
              <img src={item.photos[0]} alt={model} className="h-full w-full rounded-3xl object-cover" />
            ) : (
              <DeviceSilhouette modelName={model} className="h-64 w-auto" />
            )}
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Obnovljeni</div>
            <h1 className="mt-2 font-display text-4xl">{model}</h1>
            <div className="mt-2 text-muted-foreground">
              {item.storage_gb >= 1024 ? "1 TB" : `${item.storage_gb} GB`}
              {item.color ? ` · ${item.color}` : ""}
            </div>
            <div className="mt-6 font-display text-5xl">{Number(item.list_price)} €</div>

            <div className="mt-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Stanje uređaja</div>
              <div className="mt-2"><GradeMeter grade={item.grade as "A+" | "A" | "B"} size="lg" showLabel /></div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Info icon={<Battery className="h-4 w-4" />} label="Baterija" value={`${item.battery_health}% (≥85% zagarantovano)`} />
              <Info icon={<Shield className="h-4 w-4" />} label="Garancija" value="6 mjeseci" />
              <Info icon={<RotateCcw className="h-4 w-4" />} label="Povrat" value="14 dana" />
              <Info label="Ocjena" value={item.grade} />
            </div>

            {item.description_me && (
              <p className="mt-6 text-sm text-muted-foreground">{item.description_me}</p>
            )}

            <button onClick={onBuy} className="btn-primary mt-8 w-full sm:w-auto">
              {me.shop.addToCart}
            </button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Info({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}
