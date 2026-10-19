// Montenegrin (Latin) copy dictionary.

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
    heroTitle: "Obnovljeni iPhone,\nsa 3 mjeseca garancije.",
    heroSub:
      "Otkupljujemo i prodajemo obnovljene iPhone uređaje u Crnoj Gori. Svaki telefon je testiran, čist, i dolazi sa 14 dana povrata i 3 mjeseca garancije.",
    ctaSell: "Prodaj svoj iPhone",
    ctaShop: "Kupi obnovljeni iPhone",
    trust: {
      warranty: "3 mjeseca garancije",
      warrantySub: "Zamjena ili povrat novca za fabričke kvarove.",
      returns: "14 dana povrata",
      returnsSub: "Vratite uređaj bez razloga u prvih 14 dana.",
      shipMail: "Pošalji poštom",
      shipMailSub: "Šaljemo ti uputstvo za pakovanje i adresu. Trošak slanja snosi pošiljalac.",
      meet: "Sastanak sa predstavnikom",
      meetSub: "Dogovorite lični sastanak putem kontakt forme.",
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
      "Provjeri u Podešavanja → Baterija → Zdravlje baterije. Upiši broj i klikni Dalje.",
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

    step7Title: "Podaci za predaju",
    nameLabel: "Ime i prezime",
    phoneLabel: "Telefon",
    emailLabel: "Email (opciono)",
    dropoffLabel: "Kako želiš predati uređaj?",
    dropoff_mail: "Pošalji poštom",
    dropoff_mail_sub: "Vi snosite trošak slanja. Pošaljemo ti uputstvo za pakovanje i adresu za slanje.",
    dropoff_meet: "Sastanak sa predstavnikom",
    dropoff_meet_sub: "Naš predstavnik dolazi na dogovoreno mjesto i vrijeme. Detalje potvrđujemo telefonom.",

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
    sub: "Svaki uređaj je testiran, sa baterijom ≥ 85%, 3 mjeseca garancije i 14 dana povrata.",
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
      s3: "Pošalješ uređaj poštom (trošak slanja snosi pošiljalac) ili dogovoriš sastanak sa predstavnikom.",
      s4: "Isplata odmah nakon potvrde stanja.",
    },
    buy: {
      title: "Kupovina obnovljenog iPhone-a",
      s1: "Izabereš model i stanje.",
      s2: "Poručiš — plaćaš kuriru pri dostavi.",
      s3: "Ako nešto nije u redu, imaš 14 dana da vratiš uređaj.",
      s4: "3 mjeseca garancije na hardverske kvarove.",
    },
    gradeTitle: "Kako klasifikujemo stanje",
    warrantyTitle: "Šta pokriva garancija",
    warrantyText:
      "Garancija od 3 mjeseca pokriva hardverske kvarove koji nastanu pri normalnoj upotrebi (npr. dugmad, zvučnik, mikrofon, kamera, punjenje, Face ID). Ne pokriva fizička oštećenja kao što su napukao ekran ili staklo, oštećenja od vode, niti uređaje koje je otvarao neko drugi. Ne vršimo popravke oštećenja nastalih krivicom korisnika.",
  },

  faq: {
    title: "Česta pitanja",
    items: [
      {
        q: "Šta je zapravo obnovljeni (refurbished) telefon?",
        a: "Obnovljeni telefon je original iPhone koji je nekome prethodno korišćen, a zatim prošao kroz profesionalnu provjeru i obnovu: testiramo svaku funkciju (ekran, baterija, kamere, zvučnik, mikrofon, punjenje, Face ID), provjeravamo da uređaj nije kraden ili iCloud zaključan, te ga temeljno očistimo i dezinficujemo prije prodaje. Ako neki dio ne radi ispravno, mijenjamo ga. Rezultat je telefon koji radi kao novi, ali po znatno nižoj cijeni — i bolji je za okolinu, jer se produžava život uređaja umjesto da završi na otpadu. Od običnog polovnog telefona razlikuje se po tome što je testiran, garantiran (3 mjeseca) i sa pravom povrata u 14 dana.",
      },
      {
        q: "Koliko traje garancija?",
        a: "Svaki obnovljeni iPhone kupljen kod nas ima garanciju od 3 mjeseca od dana isporuke. Garancija važi samo za prvog kupca i uz broj narudžbe.",
      },
      {
        q: "Šta pokriva garancija?",
        a: "Garancija pokriva hardverske kvarove koji nastanu pri normalnoj upotrebi: ekran koji prestane da reaguje na dodir ili prikazuje greške (bez fizičkog oštećenja), dugmad, zvučnike, mikrofon, kamere, port za punjenje, Face ID / Touch ID, Wi-Fi, Bluetooth i mrežu. Baterija je pokrivena ako kapacitet padne ispod 80% u garantnom roku.",
      },
      {
        q: "Šta garancija NE pokriva?",
        a: "Garancija ne pokriva: napukao ili razbijen ekran i zadnje staklo, udarce i padove, oštećenja od vode ili drugih tečnosti, savijeno kućište, kozmetičko habanje nakon kupovine, uređaje koje je otvarao ili popravljao neko drugi, softverske probleme (iOS, aplikacije, zaboravljene lozinke), gubitak ili krađu, te dodatnu opremu. Ne popravljamo oštećenja nastala krivicom korisnika, ni uz plaćanje.",
      },
      {
        q: "Šta ako se uređaj pokvari u roku garancije?",
        a: "Javi nam se putem kontakt forme sa brojem narudžbe i opisom problema. Poslaćemo ti uputstvo za slanje uređaja. Prije slanja isključi Find My iPhone i napravi backup podataka. Kad pregledamo uređaj, mijenjamo ga istim ili sličnim modelom, a ako to nije moguće, vraćamo novac. Ako je kvar pokriven garancijom, troškove slanja snosimo mi.",
      },
      {
        q: "Šta ako kvar nije pokriven garancijom?",
        a: "Ako pregled pokaže da kvar nije pokriven (npr. fizičko ili oštećenje od vode) ili da nema kvara, uređaj ti vraćamo u stanju u kojem smo ga primili. Troškove povratnog slanja tada snosi kupac.",
      },
      {
        q: "Da li garancija utiče na moja zakonska prava?",
        a: "Ne. Garancija je dodatak tvojim zakonskim pravima potrošača po zakonima Crne Gore i ne umanjuje ih.",
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
        a: "Da bismo garantovali ≥ 85% baterije pri prodaji, ulazni kapacitet mora biti barem toliki. Ispod tog praga obnova nam se ne isplati.",
      },
      {
        q: "Kako predajem svoj uređaj?",
        a: "Dvije opcije: pošalješ poštom (trošak slanja snosi pošiljalac) ili dogovoriš sastanak sa našim predstavnikom putem kontakt forme. Trenutno nemamo fizičku prodavnicu.",
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
      "Cilj nam je da tržište obnovljenih telefona kod nas bude transparentno, pošteno i sa jasnim uslovima garancije. Svaki telefon prolazi kroz istu proceduru testiranja i obnove.",
      "Nemamo skrivene troškove. Ako uređaj ne odgovara opisu, vratite ga u 14 dana. Ako se pokvari u garantnom roku, popravljamo ili mijenjamo.",
    ],
  },

  contact: {
    title: "Kontakt",
    email: "kontaktobnovime@gmail.com",
    hours: "Radno vrijeme: pon–pet 09–17h, sub 10–14h",
    cities: "Predstavnik dostupan u Podgoricu",
  },

  admin: {
    title: "Admin",
    pricing: "Pricing",
    submissions: "Trade-ins",
    inventory: "Inventory",
    orders: "Orders",
    signIn: "Sign in",
    signOut: "Sign out",
    notAuthorized: "You do not have admin access.",
  },
} as const;
