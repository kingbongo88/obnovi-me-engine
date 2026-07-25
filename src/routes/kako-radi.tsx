import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { me } from "@/i18n/me";
import { ShieldCheck, PackageCheck } from "lucide-react";

export const Route = createFileRoute("/kako-radi")({
  head: () => ({
    meta: [
      { title: "Kako radi — Obnovi.me" },
      { name: "description", content: "Kako otkupljujemo i obnavljamo iPhone uređaje. Klasifikacija, garancija, proces." },
      { property: "og:title", content: "Kako radi — Obnovi.me" },
      { property: "og:description", content: "Kako otkupljujemo i obnavljamo iPhone uređaje." },
      { property: "og:url", content: "https://obnovi.app/kako-radi" },
    ],
    links: [{ rel: "canonical", href: "https://obnovi.app/kako-radi" }],
  }),
  component: How,
});

function How() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-narrow py-16">
        <h1 className="font-display text-5xl">{me.how.title}</h1>
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <Col title={me.how.sell.title} icon={<PackageCheck className="h-5 w-5" />} steps={[me.how.sell.s1, me.how.sell.s2, me.how.sell.s3, me.how.sell.s4]} />
          <Col title={me.how.buy.title} icon={<ShieldCheck className="h-5 w-5" />} steps={[me.how.buy.s1, me.how.buy.s2, me.how.buy.s3, me.how.buy.s4]} />
        </div>

        <section className="mt-16">
          <h2 className="font-display text-3xl">{me.how.gradeTitle}</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              { g: "A+", label: "Odlično", d: "Bez vidljivih tragova korišćenja. Kao nov." },
              { g: "A",  label: "Vrlo dobro", d: "Lagane ogrebotine, nevidljive sa normalne razdaljine." },
              { g: "B",  label: "Dobro", d: "Vidljivi tragovi, moguće napuklo staklo na leđima. Ekran ispravan." },
            ].map((r) => (
              <div key={r.g} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">{r.label}</div>
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs">{r.g}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{r.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl bg-[color:var(--surface-2)] p-8 md:p-12">
          <h2 className="font-display text-3xl">{me.how.warrantyTitle}</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">{me.how.warrantyText}</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Col({ title, icon, steps }: { title: string; icon: React.ReactNode; steps: string[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[color:var(--accent-brand)]">{icon}<h2 className="text-2xl font-semibold text-foreground">{title}</h2></div>
      <ol className="mt-4 space-y-3">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-brand)] text-sm font-semibold text-white">{i + 1}</span>
            <span className="pt-1 text-sm text-muted-foreground">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
