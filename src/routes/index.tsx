import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Shield, Battery, Truck, RotateCcw, ArrowRight, Star } from "lucide-react";
import { DevicePhoto, devicePhotoFor } from "@/components/device-photo";
import { getInventory } from "@/lib/pricing.functions";
import { msrpFor, savingsPct } from "@/lib/msrp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Obnovi.me — Obnovljeni iPhone sa garancijom u Crnoj Gori" },
      { name: "description", content: "Obnovljeni iPhone uređaji sa garancijom. Testirani, čisti, spremni za slanje. Uštedi do 50%." },
      { property: "og:title", content: "Obnovi.me — Obnovljeni iPhone sa garancijom u Crnoj Gori" },
      { property: "og:description", content: "Obnovljeni iPhone uređaji sa garancijom. Testirani, čisti, spremni za slanje. Uštedi do 50%." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://obnovi.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://obnovi.app/" }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({ queryKey: ["inventory"], queryFn: () => getInventory() }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Hero />
        <TrustBar />
        <ProductGrid />
        <GradeSection />
        <Testimonials />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ------------------------------ Reveal ----------------------------- */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => { for (const e of entries) if (e.isIntersecting) { setShown(true); io.disconnect(); break; } },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

function useCountUp(target: number, run: boolean, duration = 700, delay = 0) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    let start = 0;
    const t = window.setTimeout(() => {
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min(1, (ts - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setV(Math.round(target * eased));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { window.clearTimeout(t); cancelAnimationFrame(raf); };
  }, [run, target, duration, delay]);
  return v;
}

/* ------------------------------ Hero ------------------------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-[color:var(--surface-dark)] text-white">
      {/* Mesh gradient */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[color:var(--accent-brand)] opacity-20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-indigo-500 opacity-20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-teal-400 opacity-15 blur-3xl" />
      </div>

      <div className="container-wide relative grid items-center gap-10 py-12 md:grid-cols-[1.05fr_1fr] md:py-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-brand)]" />
            Kupovina i otkup u Crnoj Gori
          </div>
          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
            Obnovljeni iPhone. <span className="text-[color:var(--accent-brand)]">Bez rizika.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300">
            6 mjeseci garancije. Baterija 85%+. 14 dana povrata. Uštedi do 50% u odnosu na novi.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/kupi" className="btn-primary group">
              Kupi odmah
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link to="/prodaj" className="btn-outline-light">
              Prodaj svoj iPhone
            </Link>
          </div>
        </div>

        <HeroPhoneCluster />
      </div>
    </section>
  );
}

function HeroPhoneCluster() {
  return (
    <div className="relative mx-auto h-[280px] w-full max-w-md md:h-[360px]">
      <div
        className="absolute left-0 top-6 w-1/2 rounded-2xl bg-white/95 p-3 shadow-2xl float-slow"
        style={{ ["--r" as string]: "-6deg" }}
      >
        <img src={devicePhotoFor("iPhone 13")} alt="Obnovljeni iPhone 13" className="h-full w-full rounded-xl object-contain" />
      </div>
      <div
        className="absolute left-1/2 top-0 w-1/2 -translate-x-1/2 rounded-2xl bg-white/95 p-3 shadow-2xl float-slow-2"
        style={{ ["--r" as string]: "3deg" }}
      >
        <img src={devicePhotoFor("iPhone 15")} alt="Obnovljeni iPhone 15" className="h-full w-full rounded-xl object-contain" />
      </div>
      <div
        className="absolute right-0 top-10 w-1/2 rounded-2xl bg-white/95 p-3 shadow-2xl float-slow-3"
        style={{ ["--r" as string]: "8deg" }}
      >
        <img src={devicePhotoFor("iPhone 16 Pro")} alt="Obnovljeni iPhone 16 Pro" className="h-full w-full rounded-xl object-contain" />
      </div>
    </div>
  );
}

/* ------------------------------ Trust bar (dense, dark) ------------------------------ */
function TrustBar() {
  const items = [
    { icon: Shield, label: "6 mjeseci garancije" },
    { icon: Battery, label: "Baterija 85%+" },
    { icon: RotateCcw, label: "14 dana povrata" },
    { icon: Truck, label: "Brza dostava po Crnoj Gori" },
  ];
  return (
    <section className="border-y border-white/10 bg-[color:var(--surface-dark-2)] text-white">
      <div className="container-wide grid grid-cols-2 gap-3 py-4 md:grid-cols-4">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--accent-brand)]/15 text-[color:var(--accent-brand)]">
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Product grid ------------------------------ */
function ProductGrid() {
  const { data } = useSuspenseQuery({ queryKey: ["inventory"], queryFn: () => getInventory() });
  const items = (data ?? []).slice(0, 8);
  const { ref, shown } = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="container-wide py-10 md:py-14">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Trenutno dostupno</h2>
        <Link to="/kupi" className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--accent-brand)] hover:underline">
          Sve <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          Uskoro — puni se inventar.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, idx) => (
            <ProductCard key={it.id} it={it} idx={idx} visible={shown} />
          ))}
        </div>
      )}
    </section>
  );
}

type InvItem = Awaited<ReturnType<typeof getInventory>>[number];

function gradeBadgeClass(g: string) {
  if (g === "A+") return "badge-grade-aplus";
  if (g === "A") return "badge-grade-a";
  return "badge-grade-b";
}

function ProductCard({ it, idx, visible }: { it: InvItem; idx: number; visible: boolean }) {
  const model = (it.devices as { model_name: string } | null)?.model_name ?? "iPhone";
  const grade = (it.grade as "A+" | "A" | "B") ?? "A";
  const price = Number(it.list_price);
  const orig = msrpFor(model, it.storage_gb);
  const pct = savingsPct(price, model, it.storage_gb);
  const displayPrice = useCountUp(price, visible, 700, idx * 60);
  const displayPct = useCountUp(pct ?? 0, visible, 700, idx * 60);
  const batteryClass = it.battery_health >= 90 ? "text-[color:var(--grade-a-plus)]" : "text-[color:var(--grade-b)]";

  return (
    <Link
      to="/kupi/$id"
      params={{ id: it.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card card-hover"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 500ms ease ${idx * 60}ms, transform 500ms ease ${idx * 60}ms, box-shadow 250ms ease, translate 250ms ease`,
      }}
    >
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[color:var(--surface-2)]">
        <DevicePhoto
          modelName={model}
          color={it.color}
          className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
        />
        <span className={`absolute left-3 top-3 rounded-full px-2 py-0.5 text-[11px] font-bold ${gradeBadgeClass(grade)}`}>
          {grade}
        </span>
        {pct !== null && (
          <span className="absolute right-3 top-3 rounded-full bg-[color:var(--foreground)]/90 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
            −{displayPct}%
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="text-sm font-semibold">{model}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          {it.storage_gb >= 1024 ? `${it.storage_gb / 1024} TB` : `${it.storage_gb} GB`}
          {it.color ? ` · ${it.color}` : ""}
        </div>
        <div className={`mt-1 text-xs font-medium ${batteryClass}`}>Baterija {it.battery_health}%</div>
        <div className="mt-3 flex items-baseline gap-2">
          <div className="font-display text-2xl font-bold">{displayPrice} €</div>
          {orig && orig > price && (
            <div className="text-sm text-muted-foreground line-through">{orig} €</div>
          )}
        </div>
        <button className="mt-3 w-full rounded-full bg-[color:var(--foreground)] py-2 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--accent-brand)]">
          Dodaj u korpu
        </button>
      </div>
    </Link>
  );
}

/* ------------------------------ Grade explanation ------------------------------ */
function GradeSection() {
  const grades = [
    { g: "A+", cls: "badge-grade-aplus", title: "Odlično", body: "Kao novo. Bez vidljivih tragova upotrebe. Baterija 95%+." },
    { g: "A",  cls: "badge-grade-a",     title: "Vrlo dobro", body: "Sitne mikrogrebotine vidljive iz određenog ugla. Baterija 90%+." },
    { g: "B",  cls: "badge-grade-b",     title: "Dobro", body: "Vidljivi tragovi upotrebe. Puna funkcionalnost. Baterija 85%+." },
  ];
  return (
    <section className="bg-[color:var(--surface-2)] py-14">
      <div className="container-wide">
        <div className="mb-8 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-[color:var(--accent-brand)]">Naša kategorizacija</div>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Tri klase stanja — jasno i pošteno</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {grades.map((x) => (
            <div key={x.g} className="rounded-2xl border border-border bg-card p-6 card-hover">
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-0.5 text-sm font-bold ${x.cls}`}>{x.g}</span>
                <div className="font-semibold">{x.title}</div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{x.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Testimonials ------------------------------ */
function Testimonials() {
  const items = [
    { name: "Marko", city: "Podgorica", body: "Kupio iPhone 14. Stanje kao na slikama, brza dostava. Preporučujem." },
    { name: "Ana",   city: "Budva",     body: "Prodala sam stari 12 Pro — ponuda poštena, isplata brza." },
    { name: "Nikola",city: "Nikšić",    body: "Prvi put kupujem obnovljen. Garancija radi — smireno spavam." },
  ];
  return (
    <section className="container-wide py-14">
      <h2 className="mb-8 font-display text-3xl font-bold md:text-4xl">Šta kažu naši kupci</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((t) => (
          <div key={t.name} className="rounded-2xl border border-border bg-card p-6 card-hover">
            <div className="flex gap-0.5 text-[color:var(--grade-b)]">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="mt-3 text-sm">{t.body}</p>
            <div className="mt-4 text-sm font-semibold">{t.name} <span className="text-muted-foreground font-normal">· {t.city}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}
