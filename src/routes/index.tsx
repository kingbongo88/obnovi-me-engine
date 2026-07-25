import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { me } from "@/i18n/me";
import { Shield, RotateCcw, MapPin, Banknote, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Obnovi.me — Obnovljeni iPhone sa garancijom u Crnoj Gori" },
      {
        name: "description",
        content:
          "Prodajte svoj iPhone ili kupite obnovljeni uređaj sa 12 mjeseci garancije. Plaćanje pouzećem, isporuka u Crnoj Gori.",
      },
      { property: "og:title", content: "Obnovi.me — Obnovljeni iPhone sa garancijom" },
      { property: "og:description", content: "Otkup i prodaja obnovljenih iPhone uređaja u Crnoj Gori." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Hero />
        <TrustRow />
        <ValueSplit />
        <GradeExplain />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="container-narrow pb-16 pt-20 md:pt-28">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-[color:var(--surface-2)] px-3 py-1 text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]" />
          Otkup i prodaja u Crnoj Gori
        </div>
        <h1 className="mt-6 font-display text-5xl leading-[1.05] md:text-7xl">
          Obnovljeni iPhone.
          <br />
          <span className="italic text-[color:var(--accent-brand)]">Bez rizika.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{me.home.heroSub}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/prodaj" className="btn-primary group">
            {me.home.ctaSell}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link to="/kupi" className="btn-outline">
            {me.home.ctaShop}
          </Link>
        </div>
      </div>
    </section>
  );
}

function TrustRow() {
  const items = [
    { icon: Shield, ...me.home.trust, key: "warranty", label: me.home.trust.warranty, sub: me.home.trust.warrantySub },
    { icon: RotateCcw, key: "returns", label: me.home.trust.returns, sub: me.home.trust.returnsSub },
    { icon: MapPin, key: "local", label: me.home.trust.local, sub: me.home.trust.localSub },
    { icon: Banknote, key: "cod", label: me.home.trust.cod, sub: me.home.trust.codSub },
  ];
  return (
    <section className="border-y border-border bg-[color:var(--surface-2)]">
      <div className="container-narrow grid gap-8 py-10 md:grid-cols-4">
        {items.map((it) => (
          <div key={it.key} className="flex gap-3">
            <it.icon className="mt-0.5 h-5 w-5 text-[color:var(--accent-brand)]" />
            <div>
              <div className="text-sm font-semibold">{it.label}</div>
              <div className="text-sm text-muted-foreground">{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ValueSplit() {
  return (
    <section className="container-narrow grid gap-6 py-20 md:grid-cols-2">
      <Link
        to="/prodaj"
        className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-shadow hover:shadow-lg md:p-12"
      >
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Prodaj</div>
        <h2 className="mt-3 font-display text-4xl">Prodaj svoj iPhone,<br /> dobiješ pravu ponudu.</h2>
        <p className="mt-4 max-w-md text-muted-foreground">
          Odgovori na par pitanja, dobij konkretnu cijenu za 3 minuta.
          Preuzimamo lično u Podgorici, Budvi, Kotoru i Nikšiću.
        </p>
        <div className="mt-6 inline-flex items-center text-sm font-medium text-[color:var(--accent-brand)]">
          Započni <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
      <Link
        to="/kupi"
        className="group relative overflow-hidden rounded-3xl border border-border bg-[color:var(--primary)] p-8 text-[color:var(--primary-foreground)] transition-shadow hover:shadow-lg md:p-12"
      >
        <div className="text-xs uppercase tracking-widest opacity-70">Kupi</div>
        <h2 className="mt-3 font-display text-4xl">Kupi obnovljeni iPhone<br /> sa garancijom.</h2>
        <p className="mt-4 max-w-md opacity-80">
          Svaki uređaj testiran, baterija ≥ 90%, 12 mjeseci garancije i 14 dana povrata.
          Plaćaš kuriru pri dostavi.
        </p>
        <div className="mt-6 inline-flex items-center text-sm font-medium opacity-90">
          Pogledaj ponudu <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    </section>
  );
}

function GradeExplain() {
  const grades = [
    { grade: "Odlično", desc: "Bez vidljivih tragova. Kao nov." },
    { grade: "Vrlo dobro", desc: "Lagane ogrebotine, nevidljive sa normalne razdaljine." },
    { grade: "Dobro", desc: "Vidljivi tragovi korišćenja. Sve funkcije rade." },
  ];
  return (
    <section className="container-narrow py-16">
      <h2 className="font-display text-4xl">Tri jasne kategorije.</h2>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Ocjenjujemo svaki uređaj pošteno. Ono što piše — to i dobiješ.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {grades.map((g) => (
          <div key={g.grade} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[color:var(--success)]" />
              <div className="text-lg font-semibold">{g.grade}</div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{g.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
