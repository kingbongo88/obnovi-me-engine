import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { me } from "@/i18n/me";
import { Check } from "lucide-react";

export const Route = createFileRoute("/prodaj/uspjeh/$ref")({
  head: ({ params }) => ({
    meta: [
      { title: `Zahtjev ${params.ref} zaprimljen — Obnovi.me` },
      { name: "description", content: "Zahtjev za otkup je zaprimljen. Javićemo ti se u roku od 24 sata." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Success,
});

function Success() {
  const { ref } = Route.useParams();
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-narrow py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 md:p-12">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--success)]/10 text-[color:var(--success)]">
            <Check className="h-6 w-6" />
          </div>
          <h1 className="mt-6 font-display text-4xl">{me.sell.successTitle}</h1>
          <p className="mt-3 text-muted-foreground">{me.sell.successSub}</p>
          <div className="mt-6 rounded-2xl bg-[color:var(--surface-2)] p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{me.sell.successRefLabel}</div>
            <div className="mt-1 font-display text-3xl">{ref}</div>
          </div>
          <div className="mt-8 flex gap-3">
            <Link to="/" className="btn-outline">Početna</Link>
            <Link to="/kupi" className="btn-primary">Pogledaj obnovljene uređaje</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
