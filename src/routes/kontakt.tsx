import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { me } from "@/i18n/me";
import { Mail, Phone, Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt — Obnovi.me" },
      { name: "description", content: "Kontaktirajte nas. Kontakt forma i telefon." },
      { property: "og:title", content: "Kontakt — Obnovi.me" },
      { property: "og:description", content: "Kontakt podaci i lokacije." },
      { property: "og:url", content: "https://obnovi.app/kontakt" },
    ],
    links: [{ rel: "canonical", href: "https://obnovi.app/kontakt" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-narrow py-16">
        <h1 className="font-display text-5xl">{me.contact.title}</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Row icon={<Mail className="h-4 w-4" />} label="Email" value={me.contact.email} />
          <Row icon={<Phone className="h-4 w-4" />} label="Telefon" value={me.contact.phone} />
          <Row icon={<Clock className="h-4 w-4" />} label="Radno vrijeme" value={me.contact.hours} />
          <Row icon={<MapPin className="h-4 w-4" />} label="Lokacije" value={me.contact.cities} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">{icon}{label}</div>
      <div className="mt-1 text-lg font-medium">{value}</div>
    </div>
  );
}
