// Montenegrin (Latin) copy dictionary. Structured as flat key/value so a future
// language switcher can be added without restructuring components.

export const me = {
  brand: "Obnovi.me",
  tagline: "Obnovljeni iPhone. Bez rizika.",

  nav: {
    home: "Početna",
    sell: "Prodaj iPhone",
    shop: "Kupi iPhone",
    how: "Kako radi",
    faq: "Česta pitanja",
    about: "O nama",
    contact: "Kontakt",
    admin: "Admin",
    signIn: "Prijava",
    signOut: "Odjava",
  },

  home: {
    heroTitle: "Obnovljeni iPhone,\nsa garancijom od 12 mjeseci.",
    heroSub:
      "Otkupljujemo i prodajemo obnovljene iPhone uređaje u Crnoj Gori. Svaki telefon je testiran, čist, i dolazi sa 14 dana povrata i godišnjom garancijom.",
    ctaSell: "Prodaj svoj iPhone",
    ctaShop: "Kupi obnovljeni iPhone",
    trust: {
      warranty: "12 mjeseci garancije",
      warrantySub: "Servisiramo ili mijenjamo, bez raspravljanja.",
      returns: "14 dana povrata",
      returnsSub: "Vratite uređaj bez razloga u prvih 14 dana.",
      local: "Lokalno preuzimanje",
      localSub: "Podgorica, Budva, Kotor, Nikšić — ili poštom.",
      cod: "Plaćanje pouzećem",
      codSub: "Platite kuriru kada primite uređaj.",
    },
  },

  common: {
    from: "od",
    eur: "€",
    battery: "Baterija",
    grade: "Stanje",
    storage: "Memorija",
    next: "Dalje",
    back: "Nazad",
    submit: "Pošalji",
    cancel: "Otkaži",
    yes: "Da",
    no: "Ne",
    works: "Radi",
    doesntWork: "Ne radi",
    loading: "Učitavanje...",
    error: "Došlo je do greške. Pokušajte ponovo.",
    empty: "Nema rezultata.",
  },

  sell: {
    title: "Prodaj svoj iPhone",
    sub: "Odgovorite na par pitanja i dobijte konkretnu ponudu za nekoliko minuta.",

    step1Title: "Izaberi model",
    step1Sub: "Koji iPhone prodaješ?",
    searchPlaceholder: "Pretraga modela...",

    step2Title: "Izaberi memoriju",

    step3Title: "Osnovna pitanja",
    q_findmy: "Da li je Find My iPhone / iCloud isključen?",
    q_findmyHelp:
      "Podešavanja → [tvoje ime] → Find My → Find My iPhone → Isključi. Ovo je obavezno da bismo mogli otkupiti uređaj.",
    q_stolen: "Da li je telefon prijavljen kao izgubljen ili ukraden?",
    q_water: "Da li je telefon imao kontakt sa vodom i ima vidljivu koroziju?",
    q_unauthorized:
      "Da li je ekran ili matična ploča mijenjana od strane neovlašćenog servisera?",

    step4Title: "Zdravlje baterije",
    step4Sub:
      "Provjeri u Podešavanja → Baterija → Zdravlje baterije. Upiši broj sa te stranice.",
    batteryLabel: "Zdravlje baterije (%)",

    step5Title: "Stanje uređaja",
    screenLabel: "Ekran",
    screen_none: "Bez ogrebotina",
    screen_minor: "Sitne ogrebotine",
    screen_cracked: "Napukao / polomljen",
    backLabel: "Leđa i okvir",
    back_none: "Bez oštećenja",
    back_minor: "Sitne ogrebotine ili udubljenja",
    back_cracked: "Napuklo staklo ili okvir",
    funcTitle: "Funkcije",
    f_charging: "Konektor za punjenje",
    f_speaker: "Zvučnik i mikrofon",
    f_camera: "Kamere",
    f_faceid: "Face ID",

    step6Title: "Naša ponuda",
    offerLabel: "Naša ponuda za tvoj uređaj",
    offerAccept: "Prihvatam ponudu",
    offerRestart: "Krenimo iznova",

    step7Title: "Podaci za preuzimanje",
    nameLabel: "Ime i prezime",
    phoneLabel: "Telefon",
    emailLabel: "Email (opciono)",
    dropoffLabel: "Način predaje",
    dropoff_pg: "Lično — Podgorica",
    dropoff_bd: "Lično — Budva",
    dropoff_kt: "Lično — Kotor",
    dropoff_nk: "Lično — Nikšić",
    dropoff_mail: "Poštom (uskoro)",

    successTitle: "Hvala! Zaprimili smo tvoj zahtjev.",
    successSub:
      "Referentni broj tvog zahtjeva je ispod. Javićemo ti se u roku od 24 sata radi dogovora oko predaje.",
    successRefLabel: "Referentni broj",

    reject: {
      battery:
        "Nažalost, ne otkupljujemo telefone sa zdravljem baterije ispod 85%. Zdravlje baterije možete provjeriti u Podešavanja → Baterija → Zdravlje baterije.",
      findmy:
        "Da bismo otkupili tvoj iPhone, moraš prvo isključiti Find My iPhone. Otvori Podešavanja → [tvoje ime] → Find My → Find My iPhone → Isključi, pa krenimo iznova.",
      findmyCta: "Pokušaj ponovo",
      stolen:
        "Ne možemo otkupiti uređaje prijavljene kao izgubljene ili ukradene. Ukoliko misliš da je ovo greška, kontaktiraj nas direktno.",
      water:
        "Uređaji sa vidljivom korozijom od vode ne mogu proći kroz naš proces obnove. Možemo ih besplatno primiti na recikliranje.",
      unauthorized:
        "Uređaji sa neautorizovanim popravkama zahtijevaju ručnu procjenu. Kontaktiraj nas direktno da dogovorimo pregled.",
      tooOld:
        "Ovaj model je stariji od onih koje trenutno otkupljujemo. Možemo ga primiti besplatno na recikliranje.",
      critical:
        "Kombinacija kvarova na ovom uređaju čini obnovu neisplativom. Kontaktiraj nas direktno — možda možemo ponuditi otkup za dijelove.",
      tooLow:
        "Za ovaj uređaj trenutno ne možemo ponuditi otkup, ali ga možeš donijeti besplatno na recikliranje.",
      tier2:
        "Ovaj model otkupljujemo samo po fiksnoj cijeni i samo u ispravnom stanju. Provjeri baterija ≥ 85% i da sve funkcije rade.",
    },
  },

  shop: {
    title: "Obnovljeni iPhone uređaji",
    sub: "Svaki uređaj je testiran, sa baterijom ≥ 90%, 12 mjeseci garancije i 14 dana povrata.",
    filterModel: "Model",
    filterStorage: "Memorija",
    filterGrade: "Stanje",
    filterPrice: "Cijena",
    all: "Sve",
    empty: "Trenutno nema dostupnih uređaja. Provjeri uskoro.",
    addToCart: "Dodaj u korpu",
    outOfStock: "Prodato",
    buy: "Kupi sada",
  },

  cart: {
    title: "Tvoja korpa",
    empty: "Korpa je prazna.",
    continue: "Nastavi kupovinu",
    checkout: "Nastavi na naplatu",
    remove: "Ukloni",
    total: "Ukupno",
  },

  checkout: {
    title: "Naplata",
    contactTitle: "Kontakt",
    shippingTitle: "Adresa dostave",
    paymentTitle: "Način plaćanja",
    cod: "Pouzećem (plaćaš kuriru)",
    codSub: "Preporučeno. Platite kada primite uređaj.",
    card: "Karticom (uskoro)",
    placeOrder: "Potvrdi porudžbinu",
    addressLabel: "Adresa",
    cityLabel: "Grad",
    postalLabel: "Poštanski broj",
    notesLabel: "Napomena (opciono)",
    orderSuccess: "Hvala na porudžbini!",
    orderRefLabel: "Broj porudžbine",
  },

  how: {
    title: "Kako radi",
    sell: {
      title: "Prodaja iPhone-a",
      s1: "Popuni obrazac — traje 3 minuta.",
      s2: "Dobiješ konkretnu ponudu na osnovu stanja uređaja.",
      s3: "Doneseš uređaj (ili pošalješ) i mi ga testiramo.",
      s4: "Isplata odmah nakon potvrde stanja.",
    },
    buy: {
      title: "Kupovina obnovljenog iPhone-a",
      s1: "Izabereš model i stanje.",
      s2: "Poručiš — plaćaš kuriru pri dostavi.",
      s3: "Ako nešto nije u redu, imaš 14 dana da vratiš uređaj.",
      s4: "12 mjeseci garancije, servis kod nas.",
    },
    gradeTitle: "Kako klasifikujemo stanje",
    warrantyTitle: "Šta pokriva garancija",
    warrantyText:
      "Garancija od 12 mjeseci pokriva sve hardverske kvarove koji nijesu posljedica pada, vode ili neovlašćene intervencije. Baterija je garantovano ≥ 90% kapaciteta prilikom prodaje.",
  },

  faq: {
    title: "Česta pitanja",
    items: [
      {
        q: "Kakva je garancija na obnovljene uređaje?",
        a: "Svaki uređaj dolazi sa garancijom od 12 mjeseci koja pokriva hardverske kvarove. Baterija je garantovano ≥ 90% kapaciteta u trenutku prodaje.",
      },
      {
        q: "Šta ako se uređaj pokvari u roku garancije?",
        a: "Doneseš ga kod nas, mi ga popravljamo ili mijenjamo o svom trošku. Nema skrivenih troškova.",
      },
      {
        q: "Kako klasifikujete stanje uređaja?",
        a: "Odlično — bez vidljivih tragova. Vrlo dobro — sitne ogrebotine, nevidljive sa normalne razdaljine. Dobro — vidljivi tragovi korišćenja ili napuklo staklo na leđima.",
      },
      {
        q: "Zašto ne otkupljujete telefone sa iCloud zaključavanjem?",
        a: "Bez isključenog Find My iPhone-a, novi vlasnik ne može aktivirati uređaj. Zato je isključenje obavezan uslov.",
      },
      {
        q: "Zašto ne otkupljujete telefone sa baterijom ispod 85%?",
        a: "Da bismo garantovali ≥ 90% baterije pri prodaji, moramo je zamijeniti. To se ekonomski isplati samo iznad 85% ulaznog kapaciteta.",
      },
      {
        q: "Gdje se nalazite?",
        a: "Preuzimamo lično u Podgorici, Budvi, Kotoru i Nikšiću. Slanje poštom stižemo uskoro.",
      },
      {
        q: "Kako se plaća pri kupovini?",
        a: "Pouzećem — plaćaš kuriru kada primiš uređaj. Uskoro dodajemo i plaćanje karticom.",
      },
    ],
  },

  about: {
    title: "O nama",
    body: [
      "Obnovi.me je crnogorski servis za otkup i prodaju obnovljenih iPhone uređaja.",
      "Cilj nam je da tržište obnovljenih telefona kod nas bude transparentno, pošteno i sa istom garancijom kao kod novih uređaja. Svaki telefon prolazi kroz istu proceduru testiranja i obnove.",
      "Nemamo skrivene troškove. Ako uređaj ne odgovara opisu, vratite ga u 14 dana. Ako se pokvari u garantnom roku, popravljamo ili mijenjamo.",
    ],
  },

  contact: {
    title: "Kontakt",
    email: "info@obnovi.me",
    phone: "+382 68 000 000",
    hours: "Radno vrijeme: pon–pet 09–17h, sub 10–14h",
    cities: "Podgorica · Budva · Kotor · Nikšić",
  },

  admin: {
    title: "Administracija",
    pricing: "Cjenovnik",
    submissions: "Otkupi",
    inventory: "Inventar",
    orders: "Porudžbine",
    signIn: "Prijava",
    signOut: "Odjava",
    notAuthorized: "Nemate pristup administraciji.",
  },
} as const;
