import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { getModelBySlug } from "@/lib/pricing.functions";
import { DevicePhoto } from "@/components/device-photo";
import { useCart } from "@/lib/cart";
import { msrpFor } from "@/lib/msrp";
import { useMemo, useState } from "react";
import { Shield, Truck, RotateCcw, Check, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const modelQuery = (slug: string) => ({
  queryKey: ["model", slug],
  queryFn: () => getModelBySlug({ data: { slug } }),
});

export const Route = createFileRoute("/kupi-iphone/$slug")({
  head: ({ loaderData }) => {
    const m = loaderData as Awaited<ReturnType<typeof getModelBySlug>> | undefined;
    if (!m) {
      return { meta: [{ title: "Model nedostupan — Obnovi.me" }, { name: "robots", content: "noindex" }] };
    }
    const min = Math.min(...m.units.map((u) => u.list_price));
    const title = `${m.model_name} obnovljeni — od ${min} € — Obnovi.me`;
    const desc = `Konfiguriši memoriju i stanje za ${m.model_name}. 6 mjeseci garancije, ≥85% baterija, 14 dana povrata.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: async ({ params, context }) => {
    const m = await context.queryClient.ensureQueryData(modelQuery(params.slug));
    if (!m || m.units.length === 0) throw notFound();
    return m;
  },
  component: ModelDetail,
  notFoundComponent: NotFoundPage,
});

function NotFoundPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl">Model trenutno nije dostupan</h1>
        <p className="mt-3 text-muted-foreground">Probaj drugi model iz kataloga.</p>
        <Link to="/kupi" className="btn-primary mt-6 inline-flex">Nazad na katalog</Link>
      </main>
      <SiteFooter />
    </div>
  );
}

type Grade = "A+" | "A" | "B";
const GRADE_ORDER: Grade[] = ["B", "A", "A+"];
const GRADE_LABEL: Record<Grade, string> = { B: "Dobro", A: "Vrlo dobro", "A+": "Odlično" };
const GRADE_DESC: Record<Grade, string> = {
  B: "Vidljivi tragovi korišćenja. Sve funkcije rade savršeno.",
  A: "Lagane ogrebotine, neprimjetne sa normalne razdaljine.",
  "A+": "Bez vidljivih tragova. Kao nov.",
};
const GRADE_LONG: Record<Grade, string> = {
  B: "Ekran: vidljive ogrebotine koje ne utiču na funkcionalnost. Okvir: tragovi korišćenja i sitne ogrebotine. Savršen izbor ako te zanima suština, a ne izgled.",
  A: "Ekran i okvir sa laganim mikroogrebotinama koje se ne primjećuju sa udaljenosti čitanja. Baterija ≥ 85%.",
  "A+": "Uređaj bez vidljivih tragova. Provjeren, testiran i kao nov po svim funkcijama.",
};

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
  srebrna: "#c0c0c0", silver: "#c0c0c0",
};
function colorHex(name: string): string {
  return COLOR_HEX[name.toLowerCase()] ?? "#94a3b8";
}

type ModelData = NonNullable<Awaited<ReturnType<typeof getModelBySlug>>>;

function ModelDetail() {
  const m = Route.useLoaderData() as ModelData;
  const nav = useNavigate();
  const add = useCart((s) => s.add);

  const storages = useMemo(
    () => Array.from(new Set(m.units.map((u) => u.storage_gb))).sort((a, b) => a - b),
    [m.units],
  );
  const [storage, setStorage] = useState<number>(storages[0]);
  const gradesForStorage = useMemo(() => {
    const set = new Set(m.units.filter((u) => u.storage_gb === storage).map((u) => u.grade as Grade));
    return GRADE_ORDER.filter((g) => set.has(g));
  }, [m.units, storage]);
  const [grade, setGrade] = useState<Grade>(gradesForStorage[gradesForStorage.length - 1] ?? "A");
  // Keep grade in sync when storage changes.
  if (!gradesForStorage.includes(grade) && gradesForStorage.length > 0) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    setTimeout(() => setGrade(gradesForStorage[gradesForStorage.length - 1]), 0);
  }

  // Battery tiers: Standard (85-99%) vs Nova baterija (100%). Only when stock exists.
  const batteryTiers = useMemo(() => {
    const rows = m.units.filter((u) => u.storage_gb === storage && u.grade === grade);
    const std = rows.some((u) => u.battery_health < 100);
    const nova = rows.some((u) => u.battery_health >= 100);
    return { std, nova };
  }, [m.units, storage, grade]);
  const [battery, setBattery] = useState<"std" | "nova">("std");
  if (battery === "nova" && !batteryTiers.nova) setTimeout(() => setBattery("std"), 0);
  if (battery === "std" && !batteryTiers.std && batteryTiers.nova) setTimeout(() => setBattery("nova"), 0);

  // All colors for this model, and which are available for the current
  // storage + grade + battery combo (unavailable ones are shown crossed out).
  const allColors = useMemo(
    () => Array.from(new Set(m.units.map((u) => u.color).filter((c): c is string => !!c))),
    [m.units],
  );
  const availableColors = useMemo(() => {
    const set = new Set(
      m.units
        .filter((u) => u.storage_gb === storage && u.grade === grade)
        .filter((u) => (battery === "nova" ? u.battery_health >= 100 : u.battery_health < 100))
        .map((u) => u.color)
        .filter((c): c is string => !!c),
    );
    return set;
  }, [m.units, storage, grade, battery]);
  const [color, setColor] = useState<string | null>(allColors[0] ?? null);
  // If the current color is unavailable in the new combo, switch to the first available.
  if (color && !availableColors.has(color) && availableColors.size > 0) {
    setTimeout(() => setColor(Array.from(availableColors)[0]), 0);
  }

  // Pick the cheapest matching unit for the chosen configuration (including color).
  const chosen = useMemo(() => {
    const rows = m.units
      .filter((u) => u.storage_gb === storage && u.grade === grade)
      .filter((u) => (battery === "nova" ? u.battery_health >= 100 : u.battery_health < 100))
      .filter((u) => (color ? u.color === color : true));
    return rows.sort((a, b) => a.list_price - b.list_price)[0];
  }, [m.units, storage, grade, battery, color]);

  const orig = msrpFor(m.model_name, storage);
  const price = chosen?.list_price ?? Math.min(...m.units.filter((u) => u.storage_gb === storage).map((u) => u.list_price));
  const savings = orig && orig > price ? orig - price : null;

  const [gallery, setGallery] = useState(0);
  const galleryImages = chosen?.photos && chosen.photos.length > 0 ? chosen.photos : [];
  const tintHex = color ? colorHex(color) : "#e5e7eb";

  const onBuy = () => {
    if (!chosen) return;
    add({
      inventory_id: chosen.id,
      model_name: m.model_name,
      storage_gb: chosen.storage_gb,
      grade: chosen.grade,
      list_price: chosen.list_price,
      photo: chosen.photos?.[0] ?? null,
    });
    toast.success("Dodato u korpu");
    nav({ to: "/kosarica" });
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Početna</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/kupi" className="hover:text-foreground">Kupi iPhone</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{m.model_name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {/* Left: gallery */}
          <div>
            <div
              className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl transition-colors duration-500"
              style={{ background: `color-mix(in oklab, ${tintHex} 22%, var(--surface-2))` }}
            >
              {galleryImages.length > 0 ? (
                <img src={galleryImages[gallery]} alt={m.model_name} className="h-full w-full object-cover" />
              ) : (
                <DevicePhoto modelName={m.model_name} className="h-full w-full object-contain p-10" eager />
              )}
              <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold shadow-md">
                <Shield className="h-3.5 w-3.5 text-[color:var(--accent-brand)]" /> 6 mjeseci garancije
              </div>
              {color && (
                <div className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold capitalize shadow-md">
                  <span className="h-3 w-3 rounded-full border border-black/10" style={{ background: tintHex }} />
                  {color}
                </div>
              )}
            </div>
            {galleryImages.length > 1 && (
              <div className="mt-3 flex gap-2">
                {galleryImages.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setGallery(i)}
                    className={
                      "h-16 w-16 overflow-hidden rounded-xl border " +
                      (i === gallery ? "border-[color:var(--accent-brand)]" : "border-border")
                    }
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: configurator */}
          <div>
            <h1 className="font-display text-4xl md:text-5xl [overflow-wrap:anywhere]">{m.model_name}</h1>
            <p className="mt-2 text-muted-foreground">Odličan izbor za svakodnevnu upotrebu.</p>

            <div className="mt-5 flex items-baseline gap-3">
              <div className="font-display text-4xl font-semibold">{price} €</div>
              {orig && orig > price && (
                <div className="text-sm text-muted-foreground">
                  Apple lansirana cijena: <span className="line-through">{orig} €</span>
                </div>
              )}
            </div>
            {savings !== null && (
              <div className="mt-1 text-sm font-semibold text-emerald-700">Ušteda: {savings} €</div>
            )}

            {/* Storage */}
            <Section label="Memorija">
              <div className="flex flex-wrap gap-2">
                {storages.map((s) => {
                  const on = s === storage;
                  return (
                    <button
                      key={s}
                      onClick={() => setStorage(s)}
                      className={
                        "rounded-full border px-4 py-2 text-sm font-medium " +
                        (on
                          ? "border-[color:var(--accent-brand)] bg-[color:var(--accent-brand)] text-white"
                          : "border-border bg-card hover:border-[color:var(--accent-brand)]/50")
                      }
                    >
                      {fmtStorage(s)}
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* Grade */}
            <Section label="Stanje">
              <div className="space-y-2">
                {gradesForStorage.map((g) => {
                  const on = g === grade;
                  const gPrice = Math.min(
                    ...m.units.filter((u) => u.storage_gb === storage && u.grade === g).map((u) => u.list_price),
                  );
                  return (
                    <button
                      key={g}
                      onClick={() => setGrade(g)}
                      className={
                        "flex w-full items-start justify-between gap-4 rounded-2xl border p-4 text-left transition-all " +
                        (on
                          ? "border-[color:var(--accent-brand)] bg-[color:var(--accent-brand)]/5"
                          : "border-border bg-card hover:border-[color:var(--accent-brand)]/40")
                      }
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={
                            "mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 " +
                            (on ? "border-[color:var(--accent-brand)]" : "border-muted-foreground/50")
                          }
                        >
                          {on && <span className="h-2 w-2 rounded-full bg-[color:var(--accent-brand)]" />}
                        </span>
                        <div>
                          <div className="font-semibold">{GRADE_LABEL[g]} <span className="ml-1 text-xs font-normal text-muted-foreground">({g})</span></div>
                          <div className="text-sm text-muted-foreground">{GRADE_DESC[g]}</div>
                        </div>
                      </div>
                      <div className="shrink-0 font-semibold">{gPrice} €</div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 rounded-xl bg-[color:var(--surface-2)] p-3 text-xs text-muted-foreground">
                {GRADE_LONG[grade]}
              </div>
            </Section>

            {/* Battery */}
            <Section label="Baterija">
              <div className="grid gap-2 sm:grid-cols-2">
                <BatteryOption
                  active={battery === "std"}
                  disabled={!batteryTiers.std}
                  onClick={() => setBattery("std")}
                  title="Standard"
                  desc="Baterija ≥ 85% zdravlja."
                />
                <BatteryOption
                  active={battery === "nova"}
                  disabled={!batteryTiers.nova}
                  onClick={() => setBattery("nova")}
                  title="Nova baterija"
                  desc="Zamjena na 100% zdravlja."
                />
              </div>
            </Section>

            {/* Availability + CTA */}
            {chosen ? (
              <div className="mt-6 text-sm font-medium text-emerald-700">
                Na stanju — dostava 1–3 dana
              </div>
            ) : (
              <div className="mt-6 text-sm font-medium text-muted-foreground">Nema na stanju za ovu kombinaciju</div>
            )}

            <button
              onClick={onBuy}
              disabled={!chosen}
              className="btn-primary mt-4 w-full text-base disabled:opacity-50"
            >
              Dodaj u korpu — {price} €
            </button>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><RotateCcw className="h-3.5 w-3.5" /> 14 dana povrata</span>
              <span className="inline-flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> Besplatna dostava</span>
              <span className="inline-flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> 6 mjeseci garancije</span>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <div className="mb-3 flex items-baseline justify-between">
        <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      </div>
      {children}
    </div>
  );
}

function BatteryOption({
  active, disabled, onClick, title, desc,
}: {
  active: boolean; disabled: boolean; onClick: () => void; title: string; desc: string;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={
        "flex items-start gap-3 rounded-2xl border p-3 text-left transition-all " +
        (disabled
          ? "cursor-not-allowed border-border bg-card opacity-40"
          : active
            ? "border-[color:var(--accent-brand)] bg-[color:var(--accent-brand)]/5"
            : "border-border bg-card hover:border-[color:var(--accent-brand)]/40")
      }
    >
      <span
        className={
          "mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 " +
          (active ? "border-[color:var(--accent-brand)]" : "border-muted-foreground/50")
        }
      >
        {active && <Check className="h-3 w-3 text-[color:var(--accent-brand)]" />}
      </span>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </button>
  );
}
