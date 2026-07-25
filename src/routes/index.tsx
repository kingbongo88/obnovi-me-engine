import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { me } from "@/i18n/me";
import { Shield, RotateCcw, Battery, Truck, ArrowRight, Check, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { GradeMeter } from "@/components/grade-meter";
import { DevicePhoto } from "@/components/device-photo";
import { getInventory } from "@/lib/pricing.functions";
import { msrpFor, savingsPct } from "@/lib/msrp";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Obnovi.me — Obnovljeni iPhone sa garancijom u Crnoj Gori" },
      {
        name: "description",
        content:
          "Prodajte svoj iPhone ili kupite obnovljeni uređaj sa 6 mjeseci garancije. Plaćanje pouzećem, isporuka u Crnoj Gori.",
      },
      { property: "og:title", content: "Obnovi.me — Obnovljeni iPhone sa garancijom" },
      { property: "og:description", content: "Otkup i prodaja obnovljenih iPhone uređaja u Crnoj Gori." },
    ],
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
        <ProductCarousel />
        <TrustStrip />
        <GradeExplain />
        <Testimonials />
      </main>
      <SiteFooter />
    </div>
  );
}

/* -------- Reveal on scroll -------- */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) { setShown(true); io.disconnect(); break; }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 600ms ease ${delay}ms, transform 600ms ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* -------- Hero -------- */
function Hero() {
  return (
    <section className="container-narrow pb-10 pt-6 md:pt-10">
      <div className="grid items-center gap-8 md:grid-cols-[1.05fr_1fr] md:gap-12">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-[color:var(--surface-2)] px-3 py-1 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--cta)]" />
            Otkup i prodaja u Crnoj Gori
          </div>
          <h1 className="mt-5 font-display text-5xl leading-[1.05] md:text-6xl">
            Obnovljeni iPhone.
            <br />
            <span className="text-[color:var(--accent-brand)]">Bez rizika.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">{me.home.heroSub}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/kupi" className="btn-primary group">
              {me.home.ctaShop}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link to="/prodaj" className="btn-outline">
              {me.home.ctaSell}
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-[color:var(--surface-2)] md:aspect-[5/6]">
            <img
              src={heroImg}
              alt="Ruke drže obnovljeni iPhone"
              width={1600}
              height={1200}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 left-6 right-6 rounded-2xl border border-border bg-card p-4 shadow-sm md:left-auto md:right-4 md:w-64">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Provjereno stanje</div>
            <div className="mt-2">
              <GradeMeter grade="A+" size="sm" showLabel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------- Product carousel (from live inventory) -------- */
function ProductCarousel() {
  const { data } = useSuspenseQuery({ queryKey: ["inventory"], queryFn: () => getInventory() });
  const items = (data ?? []).slice(0, 8);
  const scroller = useRef<HTMLDivElement | null>(null);
  const { ref: sectionRef, shown } = useReveal<HTMLElement>();

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.9, 720), behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="container-narrow pt-14 pb-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Ponuda uživo</div>
          <h2 className="mt-2 font-display text-3xl md:text-4xl">Trenutno dostupno</h2>
        </div>
        <div className="hidden gap-2 md:flex">
          <button onClick={() => scrollBy(-1)} aria-label="Nazad" className="rounded-full border border-border bg-card p-2 transition hover:border-[color:var(--accent-brand)]">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scrollBy(1)} aria-label="Naprijed" className="rounded-full border border-border bg-card p-2 transition hover:border-[color:var(--accent-brand)]">
            <ChevronRight className="h-4 w-4" />
          </button>
          <Link to="/kupi" className="ml-2 inline-flex items-center gap-1 rounded-full border border-border bg-card px-4 py-2 text-sm hover:border-[color:var(--accent-brand)]">
            Sve <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          Uskoro — puni se inventar.
        </div>
      ) : (
        <div
          ref={scroller}
          className="mt-6 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4"
          style={{ scrollbarWidth: "thin" }}
        >
          {items.map((it, idx) => (
            <ProductCard key={it.id} it={it} idx={idx} visible={shown} />
          ))}
        </div>
      )}
    </section>
  );
}

type InvItem = Awaited<ReturnType<typeof getInventory>>[number];

function ProductCard({ it, idx, visible }: { it: InvItem; idx: number; visible: boolean }) {
  const model = (it.devices as { model_name: string } | null)?.model_name ?? "iPhone";
  const grade = (it.grade as "A+" | "A" | "B") ?? "A";
  const price = Number(it.list_price);
  const orig = msrpFor(model, it.storage_gb);
  const pct = savingsPct(price, model, it.storage_gb);
  const displayPrice = useCountUp(price, visible, 700, idx * 80);
  const displayPct = useCountUp(pct ?? 0, visible, 700, idx * 80);

  return (
    <Link
      to="/kupi/$id"
      params={{ id: it.id }}
      className="group w-[78%] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[46%] md:w-[31%]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 500ms ease ${idx * 70}ms, transform 500ms ease ${idx * 70}ms, box-shadow 300ms ease, translate 300ms ease`,
      }}
    >
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[color:var(--surface-2)]">
        {it.photos && it.photos[0] ? (
          <img src={it.photos[0]} alt={model} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <DevicePhoto modelName={model} className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
        )}
        {pct !== null && (
          <span className="absolute left-3 top-3 rounded-full bg-[color:var(--cta)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--cta-foreground)]">
            −{displayPct}%
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full border border-border bg-card/90 px-2 py-0.5 text-[11px] backdrop-blur">
          {grade}
        </span>
      </div>
      <div className="p-4">
        <div className="font-medium">{model}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          {it.storage_gb >= 1024 ? "1 TB" : `${it.storage_gb} GB`} · Baterija {it.battery_health}%
        </div>
        <div className="mt-3"><GradeMeter grade={grade} size="sm" showLabel={false} /></div>
        <div className="mt-3 flex items-baseline gap-2">
          <div className="font-display text-2xl">{displayPrice} €</div>
          {orig && orig > price && (
            <div className="text-sm text-muted-foreground line-through">{orig} €</div>
          )}
        </div>
      </div>
    </Link>
  );
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
        // easeOutCubic
        const eased = 1 - Math.pow(1 - p, 3);
        setV(Math.round(target * eased));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { window.clearTimeout(t); cancelAnimationFrame(raf); };
  }, [target, run, duration, delay]);
  return v;
}

/* -------- Teal trust strip -------- */
function TrustStrip() {
  const items = [
    { icon: Battery, label: "Baterija ≥ 85%", sub: "Zagarantovano pri prodaji" },
    { icon: Shield, label: "6 mjeseci garancije", sub: "Servisiramo ili mijenjamo" },
    { icon: RotateCcw, label: "14 dana povrata", sub: "Bez razloga, bez pitanja" },
    { icon: Truck, label: "Pouzećem", sub: "Plaćaš kuriru pri dostavi" },
  ];
  return (
    <section className="mt-10 bg-[color:var(--primary)] text-[color:var(--primary-foreground)]">
      <div className="container-narrow py-12">
        <Reveal>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {items.map((it) => (
              <div key={it.label} className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--cta)] text-[color:var(--cta-foreground)]">
                  <it.icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold">{it.label}</div>
                  <div className="text-sm opacity-75">{it.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------- Grading explainer (kept from before) -------- */
function GradeExplain() {
  const grades: Array<{ grade: "A+" | "A" | "B"; label: string; desc: string }> = [
    { grade: "A+", label: "Odlično", desc: "Bez vidljivih tragova. Kao nov." },
    { grade: "A", label: "Vrlo dobro", desc: "Lagane ogrebotine, nevidljive sa normalne razdaljine." },
    { grade: "B", label: "Dobro", desc: "Vidljivi tragovi korišćenja. Sve funkcije rade." },
  ];
  return (
    <section className="container-narrow py-16">
      <Reveal>
        <h2 className="font-display text-4xl">Tri jasne kategorije.</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Ocjenjujemo svaki uređaj pošteno. Ono što piše — to i dobiješ.
        </p>
      </Reveal>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {grades.map((g, i) => (
          <Reveal key={g.grade} delay={i * 100}>
            <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[color:var(--accent-brand)]" />
                <div className="text-lg font-semibold">{g.label}</div>
              </div>
              <div className="mt-4"><GradeMeter grade={g.grade} size="md" showLabel={false} /></div>
              <p className="mt-3 text-sm text-muted-foreground">{g.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* -------- Testimonials -------- */
function Testimonials() {
  const quotes = [
    { name: "Marko J.", city: "Podgorica", text: "Prodao stari 12 Pro za pošteniju cijenu nego bilo gdje drugdje. Sve prošlo za dva dana." },
    { name: "Ana P.", city: "Budva", text: "Uzela obnovljeni 14 — izgleda kao nov, baterija 92%. Isporuka za jedan dan, platila kuriru." },
    { name: "Nikola R.", city: "Nikšić", text: "Zvučalo predobro, pa sam bio skeptičan. Dobio račun, garantni list, sve uredno." },
  ];
  return (
    <section className="bg-[color:var(--surface-2)]">
      <div className="container-narrow py-16">
        <Reveal>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Iskustva</div>
          <h2 className="mt-2 font-display text-4xl">Šta kažu naši korisnici.</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {quotes.map((q, i) => (
            <Reveal key={q.name} delay={i * 100}>
              <figure className="h-full rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex gap-0.5 text-[color:var(--cta)]">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm text-foreground">"{q.text}"</blockquote>
                <figcaption className="mt-4 text-xs text-muted-foreground">
                  {q.name} · {q.city}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
