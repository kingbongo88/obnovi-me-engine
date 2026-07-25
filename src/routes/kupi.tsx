import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { getInventory } from "@/lib/pricing.functions";
import { me } from "@/i18n/me";
import { useMemo, useState } from "react";
import { DeviceSilhouette } from "@/components/device-silhouette";
import { GradeMeter } from "@/components/grade-meter";

export const Route = createFileRoute("/kupi")({
  head: () => ({
    meta: [
      { title: "Kupi obnovljeni iPhone — Obnovi.me" },
      { name: "description", content: "Obnovljeni iPhone uređaji sa 6 mjeseci garancije, ≥85% baterija, 14 dana povrata." },
      { property: "og:title", content: "Kupi obnovljeni iPhone — Obnovi.me" },
      { property: "og:description", content: "Testirani uređaji, garancija, plaćanje pouzećem." },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({ queryKey: ["inventory"], queryFn: () => getInventory() }),
  component: ShopPage,
});

function ShopPage() {
  const { data } = useSuspenseQuery({ queryKey: ["inventory"], queryFn: () => getInventory() });
  const items = (data ?? []) as NonNullable<typeof data>;
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const filtered = useMemo(
    () => items.filter((i) => (gradeFilter === "all" ? true : i.grade === gradeFilter)),
    [items, gradeFilter],
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-narrow py-12">
        <h1 className="font-display text-5xl">{me.shop.title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{me.shop.sub}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {["all", "A+", "A", "B"].map((g) => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className={
                "rounded-full border px-4 py-1.5 text-sm " +
                (gradeFilter === g ? "border-[color:var(--accent-brand)] bg-[color:var(--accent-brand)] text-white" : "border-border")
              }
            >
              {g === "all" ? me.shop.all : g}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            {me.shop.empty}
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it) => {
              const model = (it.devices as { model_name: string } | null)?.model_name ?? "iPhone";
              const grade = (it.grade as "A+" | "A" | "B") ?? "A";
              return (
                <Link
                  key={it.id}
                  to="/kupi/$id"
                  params={{ id: it.id }}
                  className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
                >
                  <div className="flex aspect-[4/3] items-center justify-center bg-[color:var(--surface-2)] text-[color:var(--accent-brand)]">
                    {it.photos && it.photos[0] ? (
                      <img src={it.photos[0]} alt={model} className="h-full w-full object-cover" />
                    ) : (
                      <DeviceSilhouette modelName={model} className="h-32 w-auto" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="font-medium">{model}</div>
                      <span className="rounded-full border border-border px-2 py-0.5 text-[11px]">{grade}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {it.storage_gb >= 1024 ? "1 TB" : `${it.storage_gb} GB`} · Baterija {it.battery_health}%
                    </div>
                    <div className="mt-3"><GradeMeter grade={grade} size="sm" showLabel={false} /></div>
                    <div className="mt-3 font-display text-2xl">{Number(it.list_price)} €</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
