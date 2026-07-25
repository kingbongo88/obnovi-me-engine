import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { me } from "@/i18n/me";

export const Route = createFileRoute("/pitanja")({
  head: () => ({
    meta: [
      { title: "Česta pitanja — Obnovi.me" },
      { name: "description", content: "Odgovori na česta pitanja o garanciji, povratu, klasifikaciji i procesu otkupa." },
      { property: "og:title", content: "Česta pitanja — Obnovi.me" },
      { property: "og:description", content: "Garancija, povrat, klasifikacija, otkup." },
      { property: "og:url", content: "https://obnovi.app/pitanja" },
    ],
    links: [{ rel: "canonical", href: "https://obnovi.app/pitanja" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: me.faq.items.map((it) => ({
            "@type": "Question",
            name: it.q,
            acceptedAnswer: { "@type": "Answer", text: it.a },
          })),
        }),
      },
    ],
  }),
  component: FAQ,
});

function FAQ() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-narrow py-16">
        <h1 className="font-display text-5xl">{me.faq.title}</h1>
        <div className="mt-10 space-y-3">
          {me.faq.items.map((it, i) => (
            <details key={i} className="group rounded-2xl border border-border bg-card p-5 [&_summary]:cursor-pointer">
              <summary className="flex items-center justify-between font-medium">
                {it.q}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{it.a}</p>
            </details>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
