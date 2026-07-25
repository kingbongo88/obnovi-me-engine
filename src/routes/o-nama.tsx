import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { me } from "@/i18n/me";

export const Route = createFileRoute("/o-nama")({
  head: () => ({
    meta: [
      { title: "O nama — Obnovi.me" },
      { name: "description", content: "Ko smo mi i zašto radimo obnovu iPhone uređaja u Crnoj Gori." },
      { property: "og:title", content: "O nama — Obnovi.me" },
      { property: "og:description", content: "Transparentan otkup i prodaja obnovljenih iPhone uređaja." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-narrow py-16">
        <h1 className="font-display text-5xl">{me.about.title}</h1>
        <div className="mt-8 max-w-2xl space-y-4 text-lg text-muted-foreground">
          {me.about.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
