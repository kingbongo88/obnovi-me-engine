import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { getModelCatalog } from "@/lib/pricing.functions";
import { me } from "@/i18n/me";
import { useMemo, useState } from "react";
import { DevicePhoto } from "@/components/device-photo";
import { msrpFor, savingsPct } from "@/lib/msrp";
import { ChevronDown, Sparkles } from "lucide-react";

const catalogQuery = { queryKey: ["model-catalog"], queryFn: () => getModelCatalog() };

export const Route = createFileRoute("/kupi")({
  head: () => ({
    meta: [
      { title: "Kupi obnovljeni iPhone — Obnovi.me" },
      { name: "description", content: "Odaberi model. Obnovljeni iPhone uređaji sa 3 mjeseca garancije i ≥85% baterijom." },
      { property: "og:title", content: "Kupi obnovljeni iPhone — Obnovi.me" },
      { property: "og:description", content: "Testirani obnovljeni iPhone modeli, garancija, plaćanje pouzećem." },
      { property: "og:url", content: "https://obnovi.app/kupi" },
    ],
    links: [{ rel: "canonical", href: "https://obnovi.app/kupi" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  component: ShopPage,
});

function fmtStorage(gb: number) {
  return gb >= 1024 ? `${gb / 1024} TB` : `${gb} GB`;
}

const COLOR_HEX: Record<string, string> = {
  crna: "#111827", black: "#111827",
  bijela: "#f5f5f5", white: "#f5f5f5",
  siva: "#9ca3af", grey: "#9ca3af", gray: "#9ca3af",
  plava: "#2563eb", blue: "#2563eb",
  crvena: "#dc2626", red: "#dc2626",
  zelena: "#16a34a", green: "#16a34a",
  žuta: "#eab308", zuta: "#eab308", yellow: "#eab308",
  ljubičasta: "#7c3aed", ljubicasta: "#7c3aed", purple: "#7c3aed",
  roze: "#ec4899", pink: "#ec4899",
  zlatna: "#d4af37", gold: "#d4af37",
  titan: "#8b8680", titanium: "#8b8680",
};
function colorHex(name: string): string {
  return COLOR_HEX[name.toLowerCase()] ?? "#94a3b8";
}

type Model = Awaited<ReturnType<typeof getModelCatalog>>[number];

function ShopPage() {
  const { data } = useSuspenseQuery(catalogQuery);
  const models = data ?? [];

  const [openSection, setOpenSection] = useState<Record<string, boolean>>({
    model: true, storage: true, price: false, grade: false, battery: false,
  });
  const [selStorages, setSelStorages] = useState<Set<number>>(new Set());
  const [selGrades, setSelGrades] = useState<Set<string>>(new Set());
  const [priceMax, setPriceMax] = useState<number>(3000);

  const allStorages = useMemo(
    () => Array.from(new Set(models.flatMap((m) => m.storages))).sort((a, b) => a - b),
    [models],
  );
  const allGrades = useMemo(
    () => Array.from(new Set(models.flatMap((m) => m.grades))),
    [models],
  );

  const filtered = useMemo(() => {
    return models.filter((m) => {
      if (selStorages.size && !m.storages.some((s) => selStorages.has(s))) return false;
      if (selGrades.size && !m.grades.some((g) => selGrades.has(g))) return false;
      if (m.min_price > priceMax) return false;
      return true;
    });
  }, [models, selStorages, selGrades, priceMax]);

  // Featured: model with highest savings %.
  const featured = useMemo(() => {
    let best: { m: Model; pct: number } | null = null;
    for (const m of filtered) {
      const storage = m.storages[0];
      const pct = savingsPct(m.min_price, m.model_name, storage);
      if (pct !== null && (!best || pct > best.pct)) best = { m, pct };
    }
    return best;
  }, [filtered]);

  function toggleSet<T>(set: Set<T>, val: T, setter: (v: Set<T>) => void) {
    const next = new Set(set);
    if (next.has(val)) next.delete(val); else next.add(val);
    setter(next);
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl">Kupi obnovljeni iPhone</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Testirani uređaji sa 3 mjeseca garancije i ≥85% baterijom.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar filters */}
          <aside className="space-y-3">
            <FilterSection
              title="Model"
              open={openSection.model}
              onToggle={() => setOpenSection({ ...openSection, model: !openSection.model })}
            >
              <div className="text-xs text-muted-foreground">{filtered.length} modela</div>
            </FilterSection>

            <FilterSection
              title="Memorija"
              open={openSection.storage}
              onToggle={() => setOpenSection({ ...openSection, storage: !openSection.storage })}
            >
              <div className="flex flex-wrap gap-2">
                {allStorages.map((s) => {
                  const on = selStorages.has(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSet(selStorages, s, setSelStorages)}
                      className={
                        "rounded-full border px-3 py-1 text-xs " +
                        (on ? "border-[color:var(--accent-brand)] bg-[color:var(--accent-brand)] text-white" : "border-border")
                      }
                    >
                      {fmtStorage(s)}
                    </button>
                  );
                })}
              </div>
            </FilterSection>

            <FilterSection
              title="Cijena"
              open={openSection.price}
              onToggle={() => setOpenSection({ ...openSection, price: !openSection.price })}
            >
              <div className="text-xs text-muted-foreground">Do {priceMax} €</div>
              <input
                type="range"
                aria-label="Maksimalna cijena"
                min={100}
                max={3000}
                step={50}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="mt-2 w-full accent-[color:var(--accent-brand)]"
              />
            </FilterSection>

            <FilterSection
              title="Stanje"
              open={openSection.grade}
              onToggle={() => setOpenSection({ ...openSection, grade: !openSection.grade })}
            >
              <div className="flex flex-wrap gap-2">
                {allGrades.map((g) => {
                  const on = selGrades.has(g);
                  return (
                    <button
                      key={g}
                      onClick={() => toggleSet(selGrades, g, setSelGrades)}
                      className={
                        "rounded-full border px-3 py-1 text-xs font-medium " +
                        (on ? "border-[color:var(--accent-brand)] bg-[color:var(--accent-brand)] text-white" : "border-border")
                      }
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </FilterSection>

            <FilterSection
              title="Baterija"
              open={openSection.battery}
              onToggle={() => setOpenSection({ ...openSection, battery: !openSection.battery })}
            >
              <div className="text-xs text-muted-foreground">Svi uređaji ≥ 85% zdravlja</div>
            </FilterSection>
          </aside>

          {/* Grid */}
          <div>
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
                {me.shop.empty}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {featured && (
                  <FeaturedCard model={featured.m} pct={featured.pct} />
                )}
                {filtered.filter((m) => !featured || m.slug !== featured.m.slug).map((m) => (
                  <ModelCard key={m.slug} m={m} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function FilterSection({
  title, open, onToggle, children,
}: {
  title: string; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold"
      >
        {title}
        <ChevronDown className={"h-4 w-4 transition-transform " + (open ? "rotate-180" : "")} />
      </button>
      {open && <div className="border-t border-border px-4 py-3">{children}</div>}
    </div>
  );
}

function ModelCard({ m }: { m: Model }) {
  const startStorage = m.storages[0];
  const orig = msrpFor(m.model_name, startStorage);
  const pct = savingsPct(m.min_price, m.model_name, startStorage);
  return (
    <Link
      to="/kupi-iphone/$slug"
      params={{ slug: m.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[color:var(--surface-2)]">
        <DevicePhoto modelName={m.model_name} className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
        {pct !== null && (
          <span className="absolute left-3 top-3 rounded-full bg-[color:var(--cta)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--cta-foreground)]">
            −{pct}%
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="font-display text-lg font-semibold leading-tight [overflow-wrap:anywhere]">
          {m.model_name}
        </div>

        {m.storages.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {m.storages.map((s) => (
              <span key={s} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                {fmtStorage(s)}
              </span>
            ))}
          </div>
        )}

        {m.colors.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {m.colors.slice(0, 6).map((c) => (
              <span
                key={c}
                title={c}
                className="h-4 w-4 rounded-full border border-border/60 shadow-sm"
                style={{ background: colorHex(c) }}
              />
            ))}
          </div>
        )}

        <div className="mt-auto flex items-baseline gap-2 pt-4">
          <div className="text-xs text-muted-foreground">Od</div>
          <div className="font-display text-2xl font-semibold">{m.min_price} €</div>
          {orig && orig > m.min_price && (
            <div className="text-sm text-muted-foreground line-through">{orig} €</div>
          )}
        </div>
      </div>
    </Link>
  );
}

function FeaturedCard({ model, pct }: { model: Model; pct: number }) {
  const startStorage = model.storages[0];
  const orig = msrpFor(model.model_name, startStorage);
  return (
    <Link
      to="/kupi-iphone/$slug"
      params={{ slug: model.slug }}
      className="group relative col-span-full flex overflow-hidden rounded-3xl border border-transparent bg-gradient-to-br from-[color:var(--accent-brand)] via-[#0d3b34] to-[color:var(--cta)] p-6 text-white shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl sm:col-span-2 xl:col-span-2"
    >
      <div className="flex-1 pr-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest">
          <Sparkles className="h-3.5 w-3.5" /> Ponuda sedmice
        </div>
        <div className="mt-4 font-display text-3xl font-semibold [overflow-wrap:anywhere]">{model.model_name}</div>
        <div className="mt-1 text-sm text-white/80">Najveća ušteda ove sedmice · −{pct}%</div>
        <div className="mt-4 flex items-baseline gap-2">
          <div className="font-display text-4xl font-semibold">{model.min_price} €</div>
          {orig && <div className="text-white/70 line-through">{orig} €</div>}
        </div>
      </div>
      <div className="relative -my-2 hidden w-48 shrink-0 md:block">
        <DevicePhoto modelName={model.model_name} className="h-full w-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105" />
      </div>
    </Link>
  );
}
