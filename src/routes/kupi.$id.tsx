import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { getInventoryItem } from "@/lib/pricing.functions";
import { useCart } from "@/lib/cart";
import { me } from "@/i18n/me";
import { Shield, Battery } from "lucide-react";
import { DevicePhoto } from "@/components/device-photo";
import { GradeMeter } from "@/components/grade-meter";
import { toast } from "sonner";

export const Route = createFileRoute("/kupi/$id")({
  head: ({ params, loaderData }) => {
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
    const storage = item.storage_gb >= 1024 ? `${item.storage_gb / 1024} TB` : `${item.storage_gb} GB`;
    const price = Number(item.list_price);
    const title = `${model} ${storage} (${item.grade}) — ${price} € — Obnovi.me`;
    const desc = `Obnovljeni ${model}, ${storage}, stanje ${item.grade}, baterija ${item.battery_health}%. 3 mjeseca garancije.`;
    const url = `https://obnovi.app/kupi/${params.id}`;
    const image = Array.isArray(item.photos) && item.photos[0] ? item.photos[0] : undefined;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:url", content: url },
        ...(image ? [{ property: "og:image", content: image } as const, { name: "twitter:image", content: image } as const] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${model} ${storage} (${item.grade})`,
            description: desc,
            ...(image ? { image } : {}),
            brand: { "@type": "Brand", name: "Apple" },
            category: "Refurbished smartphone",
            offers: {
              "@type": "Offer",
              url,
              priceCurrency: "EUR",
              price: price.toFixed(2),
              itemCondition: "https://schema.org/RefurbishedCondition",
              availability: item.status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
          }),
        },
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
  const item = Route.useLoaderData() as NonNullable<Awaited<ReturnType<typeof getInventoryItem>>>;
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
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-[color:var(--surface-2)]">
            {item.photos?.[0] ? (
              <img src={item.photos[0]} alt={model} className="h-full w-full rounded-3xl object-cover" />
            ) : (
              <DevicePhoto modelName={model} color={item.color} className="h-full w-full object-contain p-8" />
            )}
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Obnovljeni</div>
            <h1 className="mt-2 font-display text-4xl">{model}</h1>
            <div className="mt-2 text-muted-foreground">
              {item.storage_gb >= 1024 ? `${item.storage_gb / 1024} TB` : `${item.storage_gb} GB`}
              {item.color ? ` · ${item.color}` : ""}
            </div>
            <div className="mt-6 font-display text-5xl">{Number(item.list_price)} €</div>

            <div className="mt-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Stanje uređaja</div>
              <div className="mt-2"><GradeMeter grade={item.grade as "A+" | "A" | "B"} size="lg" showLabel /></div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Info icon={<Battery className="h-4 w-4" />} label="Baterija" value={`${item.battery_health}% (≥85% zagarantovano)`} />
              <Info icon={<Shield className="h-4 w-4" />} label="Garancija" value="3 mjeseca" />
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
