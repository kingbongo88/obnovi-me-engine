import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const Route = createFileRoute("/uslovi")({
  head: () => ({
    meta: [
      { title: "Uslovi korišćenja — Obnovi.me" },
      { name: "description", content: "Opšti uslovi kupovine, otkupa, garancije i povrata obnovljenih iPhone uređaja na Obnovi.me." },
      { property: "og:title", content: "Uslovi korišćenja — Obnovi.me" },
      { property: "og:description", content: "Opšti uslovi kupovine, otkupa, garancije i povrata na Obnovi.me." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://obnovi.app/uslovi" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://obnovi.app/uslovi" }],
  }),
  component: Terms,
});

const SECTIONS: Array<{ h: string; p: string[] }> = [
  { h: "1. Opšte odredbe", p: [
    "Ovi uslovi korišćenja (\"Uslovi\") uređuju korišćenje sajta Obnovi.me i sve kupovine i otkupe uređaja preko njega. Korišćenjem sajta, slanjem narudžbe ili zahtjeva za otkup prihvataš ove Uslove.",
    "Prodavac i kupac uređaja je Obnovi.me, sa sjedištem u Podgorici, Crna Gora. Zadržavamo pravo da izmijenimo Uslove; za svaku narudžbu važe Uslovi objavljeni u trenutku narudžbe.",
  ]},
  { h: "2. Proizvodi", p: [
    "Prodajemo obnovljene (polovne, testirane) iPhone uređaje. Uređaji nijesu novi i mogu imati tragove korišćenja u skladu sa označenim stanjem (ocjenom).",
    "Fotografije su ilustrativne. Boja, stanje i kapacitet baterije navedeni u oglasu su obavezujući. Svaki uređaj ima kapacitet baterije od najmanje 85% u trenutku prodaje.",
    "Uređaji se isporučuju bez originalne kutije i dodatne opreme, osim ako nije drugačije navedeno.",
  ]},
  { h: "3. Cijene i plaćanje", p: [
    "Sve cijene su izražene u eurima (€) i uključuju PDV gdje je primjenjivo. Troškove dostave snosi kupac, osim ako nije drugačije navedeno.",
    "Plaćanje se vrši pouzećem prilikom preuzimanja uređaja, ili drugim načinom ponuđenim na sajtu. Zadržavamo pravo da otkažemo narudžbu u slučaju očigledne greške u cijeni ili nedostupnosti uređaja.",
  ]},
  { h: "4. Narudžba i isporuka", p: [
    "Narudžba je zaključena kada je potvrdimo. Isporuku vršimo kurirskom službom na teritoriji Crne Gore ili ličnim preuzimanjem kod predstavnika, po dogovoru.",
    "Rokovi isporuke su okvirni. Rizik od gubitka ili oštećenja prelazi na kupca u trenutku preuzimanja pošiljke.",
  ]},
  { h: "5. Pravo na povrat (14 dana)", p: [
    "Kupac ima pravo da vrati uređaj bez navođenja razloga u roku od 14 dana od preuzimanja.",
    "Uređaj mora biti vraćen u istom stanju u kojem je primljen, bez novih oštećenja, sa isključenim Find My iPhone / iCloud nalogom i vraćen na fabrička podešavanja. Troškove povratnog slanja snosi kupac.",
    "Povrat novca vršimo u roku od 14 dana od prijema i pregleda uređaja. Ako je uređaj oštećen ili zaključan, zadržavamo pravo da umanjimo iznos povrata ili odbijemo povrat.",
  ]},
  { h: "6. Garancija (3 mjeseca)", p: [
    "Na svaki prodati uređaj dajemo garanciju od 3 mjeseca od dana isporuke. Garancija pokriva hardverske kvarove nastale pri normalnoj upotrebi.",
    "Garancija ne pokriva: fizička oštećenja (napukao ekran ili staklo, udarce, savijeno kućište), oštećenja od tečnosti, kozmetičko habanje nakon kupovine, softverske probleme, neovlašćene popravke ili otvaranje uređaja, gubitak ili krađu, i dodatnu opremu. Ne vršimo popravke oštećenja nastalih krivicom korisnika.",
    "U slučaju opravdane reklamacije uređaj mijenjamo istim ili sličnim modelom, a ako to nije moguće, vraćamo novac. Garancija ne umanjuje zakonska prava potrošača.",
  ]},
  { h: "7. Otkup uređaja", p: [
    "Ponuda prikazana na sajtu je okvirna i zasniva se na podacima koje si unio/la. Konačna ponuda se utvrđuje nakon fizičkog pregleda uređaja.",
    "Ako se stanje razlikuje od prijavljenog, poslaćemo novu ponudu. Ako je ne prihvatiš, uređaj vraćamo, a troškove povratnog slanja snosi prodavac uređaja.",
    "Prodavac garantuje da je zakoniti vlasnik uređaja, da uređaj nije ukraden, blokiran kod operatera niti pod finansijskom obavezom, i da je Find My iPhone isključen. Ne otkupljujemo ukradene ili zaključane uređaje i sarađujemo sa nadležnim organima.",
    "Troškove slanja uređaja na otkup snosi pošiljalac. Prije slanja obriši sve podatke; ne odgovaramo za podatke ostavljene na uređaju.",
  ]},
  { h: "8. Ograničenje odgovornosti", p: [
    "Ne odgovaramo za gubitak podataka, posrednu štetu ili izgubljenu dobit nastalu korišćenjem uređaja ili sajta. Naša ukupna odgovornost je ograničena na iznos plaćen za predmetni uređaj, osim ako zakon ne propisuje drugačije.",
  ]},
  { h: "9. Lični podaci", p: [
    "Lične podatke (ime, telefon, e-mail, adresa) koristimo isključivo za obradu narudžbi i otkupa i ne prodajemo ih trećim licima. Podatke dijelimo samo sa kurirskim službama u svrhu isporuke.",
  ]},
  { h: "10. Intelektualna svojina", p: [
    "Sadržaj sajta (tekstovi, logo, dizajn) pripada Obnovi.me. iPhone i Apple su zaštitni znaci kompanije Apple Inc.; Obnovi.me nije povezan sa kompanijom Apple.",
  ]},
  { h: "11. Rješavanje sporova", p: [
    "Na ove Uslove primjenjuje se pravo Crne Gore. Sporove nastojimo riješiti sporazumno; u suprotnom nadležan je sud u Podgorici. Kupac se može obratiti i nadležnim organima za zaštitu potrošača.",
  ]},
  { h: "12. Kontakt", p: [
    "Za sva pitanja, reklamacije i povrate javi nam se putem stranice Kontakt.",
  ]},
];

function Terms() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-narrow py-16">
        <h1 className="font-display text-5xl">Uslovi korišćenja</h1>
        <p className="mt-3 text-sm text-muted-foreground">Posljednje ažuriranje: oktobar 2026.</p>
        <div className="mt-10 max-w-3xl space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-2xl">{s.h}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {s.p.map((t, i) => <p key={i}>{t}</p>)}
              </div>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
