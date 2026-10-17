import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { me } from "@/i18n/me";
import { getPricingBundle, submitTradeIn } from "@/lib/pricing.functions";
import { computeOffer, type OfferInput, type OfferResult } from "@/lib/pricing";
import { ArrowRight, ArrowLeft, Search, Check, X, AlertTriangle, Truck, Shield, RotateCcw } from "lucide-react";
import { DevicePhoto } from "@/components/device-photo";
import { toast } from "sonner";

export const Route = createFileRoute("/prodaj")({
  head: () => ({
    meta: [
      { title: "Prodaj svoj iPhone — Obnovi.me" },
      { name: "description", content: "Dobij konkretnu ponudu za svoj iPhone za 3 minuta. Otkup u Crnoj Gori." },
      { property: "og:title", content: "Prodaj svoj iPhone — Obnovi.me" },
      { property: "og:description", content: "Konkretna ponuda za 3 minuta. Šalji poštom ili dogovori sastanak sa predstavnikom." },
      { property: "og:url", content: "https://obnovi.app/prodaj" },
    ],
    links: [{ rel: "canonical", href: "https://obnovi.app/prodaj" }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["pricing-bundle"],
      queryFn: () => getPricingBundle(),
    }),
  component: SellPage,
});

type WizardState = Partial<OfferInput> & { step: number };

function SellPage() {
  const { data: bundle } = useSuspenseQuery({
    queryKey: ["pricing-bundle"],
    queryFn: () => getPricingBundle(),
  });
  const [s, setS] = useState<WizardState>({ step: 1 });

  return (
    <div className="min-h-screen bg-[color:var(--surface-2)]">
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-4 py-8 md:py-12">
        <Stepper step={s.step} />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-3xl border border-border bg-background p-6 md:p-10">
            {s.step === 1 && <Step1 bundle={bundle} onNext={(device_id) => setS({ ...s, device_id, step: 2 })} />}
            {s.step === 2 && (
              <Step2
                bundle={bundle}
                deviceId={s.device_id!}
                onBack={() => setS({ ...s, step: 1 })}
                onNext={(storage_gb) => setS({ ...s, storage_gb, step: 3 })}
              />
            )}
            {s.step === 3 && (
              <Step3
                onBack={() => setS({ ...s, step: 2 })}
                onNext={(v) => setS({ ...s, ...v, step: 4 })}
              />
            )}
            {s.step === 4 && (
              <Step4
                minBattery={bundle.config.diagnostic_min_battery}
                onBack={() => setS({ ...s, step: 3 })}
                onNext={(bh) => setS({ ...s, battery_health: bh, step: 5 })}
              />
            )}
            {s.step === 5 && (
              <Step5
                onBack={() => setS({ ...s, step: 4 })}
                onNext={(v) => setS({ ...s, ...v, step: 6 })}
              />
            )}
            {s.step === 6 && (
              <Step6
                bundle={bundle}
                input={s as OfferInput}
                onBack={() => setS({ ...s, step: 5 })}
                onNext={() => setS({ ...s, step: 7 })}
                onRestart={() => setS({ step: 1 })}
              />
            )}
            {s.step === 7 && (
              <Step7
                input={s as OfferInput}
                onBack={() => setS({ ...s, step: 6 })}
              />
            )}
          </div>
          <QuoteSidebar bundle={bundle} state={s} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function QuoteSidebar({
  bundle,
  state,
}: {
  bundle: Awaited<ReturnType<typeof getPricingBundle>>;
  state: WizardState;
}) {
  const device = bundle.devices.find((d) => d.id === state.device_id);

  // Optimistic fill: unanswered fields assume best case for a live preview.
  const preview: OfferInput = {
    device_id: state.device_id ?? "",
    storage_gb: state.storage_gb ?? 128,
    find_my_off: state.find_my_off ?? true,
    reported_stolen: state.reported_stolen ?? false,
    water_corrosion: state.water_corrosion ?? false,
    unauthorized_repair: state.unauthorized_repair ?? false,
    battery_health: state.battery_health ?? 95,
    screen: state.screen ?? "none",
    back: state.back ?? "none",
    charging_works: state.charging_works ?? true,
    speaker_mic_works: state.speaker_mic_works ?? true,
    camera_works: state.camera_works ?? true,
    face_id_works: state.face_id_works ?? true,
  };
  const offer = device ? computeOffer(preview, bundle) : null;
  const payout = offer?.status === "ok" ? offer.payout : null;

  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <div className="rounded-3xl border border-border bg-background p-6">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Tvoja procjena</div>
        {device ? (
          <>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-16 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[color:var(--surface-2)]">
                <DevicePhoto modelName={device.model_name} className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold leading-tight [overflow-wrap:anywhere]">{device.model_name}</div>
                <div className="text-xs text-muted-foreground">
                  {state.storage_gb ? (state.storage_gb >= 1024 ? `${state.storage_gb / 1024} TB` : `${state.storage_gb} GB`) : "Odaberi memoriju"}
                </div>
              </div>
            </div>
            <div className="mt-6 border-t border-border pt-5">
              {payout !== null ? (
                <>
                  <div className="font-display text-5xl font-semibold text-[color:var(--accent-brand)]">{payout} €</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {state.step < 6 ? "Okvirna procjena — može se promijeniti" : "Konačna ponuda"}
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Nastavi da vidiš iznos.</div>
              )}
            </div>
            <ul className="mt-5 space-y-2 text-xs">
              <SummaryRow label="Model" value={device.model_name} />
              {state.storage_gb != null && (
                <SummaryRow label="Memorija" value={state.storage_gb >= 1024 ? `${state.storage_gb / 1024} TB` : `${state.storage_gb} GB`} />
              )}
              {state.battery_health != null && <SummaryRow label="Baterija" value={`${state.battery_health}%`} />}
              {state.screen && <SummaryRow label="Ekran" value={me.sell[`screen_${state.screen}`]} />}
              {state.back && <SummaryRow label="Leđa" value={me.sell[`back_${state.back}`]} />}
            </ul>
          </>
        ) : (
          <div className="mt-4 text-sm text-muted-foreground">
            Izaberi svoj model da započneš procjenu — obično traje manje od 3 minuta.
          </div>
        )}
        <div className="mt-6 space-y-2 border-t border-border pt-4 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2"><Check className="h-3 w-3 text-[color:var(--accent-brand)]" /> Isplata odmah nakon pregleda</div>
          <div className="flex items-center gap-2"><Check className="h-3 w-3 text-[color:var(--accent-brand)]" /> Bez obaveze prihvatanja</div>
          <div className="flex items-center gap-2"><Check className="h-3 w-3 text-[color:var(--accent-brand)]" /> 6 mjeseci naša garancija na kupca</div>
        </div>
      </div>
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate text-right font-medium text-foreground">{value}</span>
    </li>
  );
}


function Stepper({ step }: { step: number }) {
  return (
    <div className="mb-8 flex items-center gap-2 text-xs text-muted-foreground">
      {["Model", "Memorija", "Provjera", "Baterija", "Stanje", "Ponuda", "Predaja"].map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <div key={label} className="flex items-center gap-2">
            <span
              className={
                "inline-flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold " +
                (active
                  ? "border-[color:var(--accent-brand)] bg-[color:var(--accent-brand)] text-white"
                  : done
                    ? "border-[color:var(--success)] bg-[color:var(--success)]/10 text-[color:var(--success)]"
                    : "border-border")
              }
            >
              {done ? <Check className="h-3 w-3" /> : n}
            </span>
            <span className={active ? "font-medium text-foreground" : ""}>{label}</span>
            {n < 7 && <span className="opacity-40">·</span>}
          </div>
        );
      })}
    </div>
  );
}

function Step1({
  bundle,
  onNext,
}: {
  bundle: Awaited<ReturnType<typeof getPricingBundle>>;
  onNext: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      bundle.devices.filter((d) =>
        d.model_name.toLowerCase().includes(q.toLowerCase()),
      ),
    [bundle.devices, q],
  );
  const tier1 = filtered.filter((d) => d.buy_tier === 1);
  const tier2 = filtered.filter((d) => d.buy_tier === 2);

  return (
    <div>
      <h1 className="font-display text-4xl">{me.sell.step1Title}</h1>
      <p className="mt-2 text-muted-foreground">{me.sell.step1Sub}</p>
      <div className="mt-6 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          aria-label="Pretraži modele"
          className="w-full bg-transparent text-sm outline-none"
          placeholder={me.sell.searchPlaceholder}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <ModelGrid title="Novije generacije" list={tier1} onPick={onNext} />
      {tier2.length > 0 && <ModelGrid title="Starije generacije (fiksna cijena)" list={tier2} onPick={onNext} />}
    </div>
  );
}

function ModelGrid({
  title,
  list,
  onPick,
}: {
  title: string;
  list: Array<{ id: string; model_name: string; release_year: number; base_resale_value: number }>;
  onPick: (id: string) => void;
}) {
  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {list.map((d) => (
          <button
            key={d.id}
            onClick={() => onPick(d.id)}
            className="group flex items-center gap-5 rounded-2xl border border-border bg-card p-6 text-left transition-all hover:-translate-y-0.5 hover:border-[color:var(--accent-brand)] hover:shadow-lg"
          >
            <div className="flex h-28 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[color:var(--surface-2)]">
              <DevicePhoto modelName={d.model_name} className="h-full w-full object-contain" />
            </div>
            <div
              className="min-w-0 flex-1"
              style={{ wordBreak: "keep-all", overflowWrap: "break-word" }}
            >
              <div className="text-[21px] font-bold leading-[1.15] tracking-tight">{d.model_name}</div>
              <div className="mt-1.5 text-sm text-muted-foreground">{d.release_year}</div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 self-center text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[color:var(--accent-brand)]" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Step2({
  bundle,
  deviceId,
  onBack,
  onNext,
}: {
  bundle: Awaited<ReturnType<typeof getPricingBundle>>;
  deviceId: string;
  onBack: () => void;
  onNext: (storage: number) => void;
}) {
  const device = bundle.devices.find((d) => d.id === deviceId);
  if (!device) return null;
  return (
    <div>
      <BackBtn onBack={onBack} />
      <h1 className="font-display text-4xl">{me.sell.step2Title}</h1>
      <p className="mt-2 text-muted-foreground">{device.model_name}</p>
      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        {device.storage_options.map((gb) => (
          <button
            key={gb}
            onClick={() => onNext(gb)}
            className="rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-[color:var(--accent-brand)]"
          >
            <div className="font-display text-3xl">{gb >= 1024 ? `${gb / 1024} TB` : `${gb} GB`}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step3({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: (v: {
    find_my_off: boolean;
    reported_stolen: boolean;
    water_corrosion: boolean;
    unauthorized_repair: boolean;
  }) => void;
}) {
  const [findMy, setFindMy] = useState<boolean | null>(null);
  const [stolen, setStolen] = useState<boolean | null>(null);
  const [water, setWater] = useState<boolean | null>(null);
  const [repair, setRepair] = useState<boolean | null>(null);

  // Order matters: iCloud first (recoverable), then permanent rejects
  if (findMy === false) {
    return (
      <RejectCard
        title="Prvo isključi Find My iPhone"
        body={me.sell.reject.findmy}
        actionLabel={me.sell.reject.findmyCta}
        onAction={() => setFindMy(null)}
      />
    );
  }
  if (stolen === true) return <RejectCard title="Ne možemo pomoći" body={me.sell.reject.stolen} />;
  if (water === true) return <RejectCard title="Nažalost, ne otkupljujemo" body={me.sell.reject.water} />;
  if (repair === true) return <RejectCard title="Ručna procjena" body={me.sell.reject.unauthorized} />;

  const ready = findMy !== null && stolen !== null && water !== null && repair !== null;

  return (
    <div>
      <BackBtn onBack={onBack} />
      <h1 className="font-display text-4xl">{me.sell.step3Title}</h1>
      <div className="mt-6 space-y-3">
        <YesNo question={me.sell.q_findmy} help={me.sell.q_findmyHelp} value={findMy} onChange={setFindMy} />
        <YesNo question={me.sell.q_stolen} value={stolen} onChange={setStolen} />
        <YesNo question={me.sell.q_water} value={water} onChange={setWater} />
        <YesNo question={me.sell.q_unauthorized} value={repair} onChange={setRepair} />
      </div>
      <div className="mt-8">
        <button
          disabled={!ready}
          onClick={() => onNext({ find_my_off: !!findMy, reported_stolen: !!stolen, water_corrosion: !!water, unauthorized_repair: !!repair })}
          className="btn-primary disabled:opacity-40"
        >
          {me.common.next}
        </button>
      </div>
    </div>
  );
}

function Step4({
  minBattery,
  onBack,
  onNext,
}: {
  minBattery: number;
  onBack: () => void;
  onNext: (n: number) => void;
}) {
  const [v, setV] = useState<string>("");
  const [rejected, setRejected] = useState(false);
  const trimmed = v.trim();
  const n = parseInt(trimmed, 10);
  const valid = /^\d{1,3}$/.test(trimmed) && !isNaN(n) && n >= 0 && n <= 100;

  const onConfirm = () => {
    if (!valid) return;
    if (n < minBattery) {
      setRejected(true);
      return;
    }
    onNext(n);
  };

  if (rejected) {
    return <RejectCard title="Baterija je preslaba" body={me.sell.reject.battery} onAction={() => { setRejected(false); setV(""); }} actionLabel="Unesi ponovo" />;
  }

  return (
    <div>
      <BackBtn onBack={onBack} />
      <h1 className="font-display text-4xl">{me.sell.step4Title}</h1>
      <p className="mt-2 text-muted-foreground">{me.sell.step4Sub}</p>
      <div className="mt-6 flex items-center gap-3">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={3}
          value={v}
          onChange={(e) => setV(e.target.value.replace(/[^0-9]/g, ""))}
          onKeyDown={(e) => { if (e.key === "Enter") onConfirm(); }}
          className="w-32 rounded-2xl border border-border bg-card px-4 py-3 text-3xl font-semibold outline-none focus:border-[color:var(--accent-brand)]"
          placeholder="92"
        />
        <span className="text-2xl text-muted-foreground">%</span>
      </div>
      <div className="mt-8">
        <button disabled={!valid} onClick={onConfirm} className="btn-primary disabled:opacity-40">
          {me.common.next}
        </button>
      </div>
    </div>
  );
}

function Step5({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: (v: {
    screen: "none" | "minor" | "cracked";
    back: "none" | "minor" | "cracked";
    charging_works: boolean;
    speaker_mic_works: boolean;
    camera_works: boolean;
    face_id_works: boolean;
  }) => void;
}) {
  const [screen, setScreen] = useState<"none" | "minor" | "cracked" | null>(null);
  const [back, setBack] = useState<"none" | "minor" | "cracked" | null>(null);
  const [charge, setCharge] = useState<boolean | null>(null);
  const [spk, setSpk] = useState<boolean | null>(null);
  const [cam, setCam] = useState<boolean | null>(null);
  const [fid, setFid] = useState<boolean | null>(null);

  const ready = screen && back && charge !== null && spk !== null && cam !== null && fid !== null;

  return (
    <div>
      <BackBtn onBack={onBack} />
      <h1 className="font-display text-4xl">{me.sell.step5Title}</h1>
      <div className="mt-6 space-y-6">
        <SegGroup
          label={me.sell.screenLabel}
          value={screen}
          onChange={setScreen}
          options={[
            { value: "none", label: me.sell.screen_none },
            { value: "minor", label: me.sell.screen_minor },
            { value: "cracked", label: me.sell.screen_cracked },
          ]}
        />
        <SegGroup
          label={me.sell.backLabel}
          value={back}
          onChange={setBack}
          options={[
            { value: "none", label: me.sell.back_none },
            { value: "minor", label: me.sell.back_minor },
            { value: "cracked", label: me.sell.back_cracked },
          ]}
        />
        <div>
          <div className="text-sm font-semibold">{me.sell.funcTitle}</div>
          <div className="mt-3 space-y-2">
            <FuncRow label={me.sell.f_charging} value={charge} onChange={setCharge} />
            <FuncRow label={me.sell.f_speaker} value={spk} onChange={setSpk} />
            <FuncRow label={me.sell.f_camera} value={cam} onChange={setCam} />
            <FuncRow label={me.sell.f_faceid} value={fid} onChange={setFid} />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <button
          disabled={!ready}
          onClick={() =>
            onNext({
              screen: screen!,
              back: back!,
              charging_works: !!charge,
              speaker_mic_works: !!spk,
              camera_works: !!cam,
              face_id_works: !!fid,
            })
          }
          className="btn-primary disabled:opacity-40"
        >
          Izračunaj ponudu
        </button>
      </div>
    </div>
  );
}

function Step6({
  bundle,
  input,
  onBack,
  onNext,
  onRestart,
}: {
  bundle: Awaited<ReturnType<typeof getPricingBundle>>;
  input: OfferInput;
  onBack: () => void;
  onNext: () => void;
  onRestart: () => void;
}) {
  const offer: OfferResult = useMemo(() => computeOffer(input, bundle), [input, bundle]);

  if (offer.status === "rejected") {
    const map: Record<string, string> = {
      battery: me.sell.reject.battery,
      findmy: me.sell.reject.findmy,
      stolen: me.sell.reject.stolen,
      water: me.sell.reject.water,
      unauthorized: me.sell.reject.unauthorized,
      tooOld: me.sell.reject.tooOld,
      critical: me.sell.reject.critical,
      tooLow: me.sell.reject.tooLow,
      tier2: me.sell.reject.tier2,
      unknownDevice: me.common.error,
    };
    return <RejectCard title="Nažalost" body={map[offer.reason]} onAction={onRestart} actionLabel={me.sell.offerRestart} />;
  }

  const device = bundle.devices.find((d) => d.id === input.device_id);
  return (
    <div>
      <BackBtn onBack={onBack} />
      <div className="grid gap-6 md:grid-cols-[1.15fr_1fr]">
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {me.sell.offerLabel}
          </div>
          <div className="mt-2 font-display text-6xl font-semibold text-[color:var(--accent-brand)] md:text-7xl">
            {offer.payout} €
          </div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-brand)]/10 px-3 py-1 text-xs font-medium text-[color:var(--accent-brand)]">
            <Check className="h-3 w-3" /> Ponuda važi 14 dana
          </div>
          <DepreciationChart payout={offer.payout} />
          <p className="mt-6 text-xs text-muted-foreground">
            Konačan iznos zavisi od stvarnog stanja prilikom fizičkog pregleda. Isplata odmah nakon potvrde.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={onNext} className="btn-primary">
              {me.sell.offerAccept} <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button onClick={onRestart} className="btn-outline">
              {me.sell.offerRestart}
            </button>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <h3 className="font-display text-2xl">Prodaj svoj {device?.model_name ?? "iPhone"}</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-center gap-3"><Truck className="h-4 w-4 text-[color:var(--accent-brand)]" /> Slanje poštom ili sastanak sa predstavnikom</li>
            <li className="flex items-center gap-3"><Shield className="h-4 w-4 text-[color:var(--accent-brand)]" /> Sigurno brisanje podataka</li>
            <li className="flex items-center gap-3"><RotateCcw className="h-4 w-4 text-[color:var(--accent-brand)]" /> Nezadovoljan? Vraćamo uređaj besplatno</li>
          </ul>
          <button onClick={onNext} className="btn-primary mt-6 w-full justify-center">
            Prodaj za {offer.payout} €
          </button>
        </div>
      </div>
    </div>
  );
}

function DepreciationChart({ payout }: { payout: number }) {
  // Typical refurb-market depreciation curve for iPhones.
  const points = [
    { label: "danas",     months: 0,  value: payout },
    { label: "3 mjeseca", months: 3,  value: Math.round(payout * 0.94) },
    { label: "6 mjeseci", months: 6,  value: Math.round(payout * 0.86) },
    { label: "12 mjeseci",months: 12, value: Math.round(payout * 0.72) },
  ];
  const loss = points[0].value - points[points.length - 1].value;
  const W = 520, H = 160, PL = 24, PR = 24, PT = 20, PB = 32;
  const iw = W - PL - PR, ih = H - PT - PB;
  const maxV = points[0].value, minV = points[points.length - 1].value;
  const span = Math.max(1, maxV - minV);
  const xs = points.map((_, i) => PL + (i / (points.length - 1)) * iw);
  const ys = points.map((p) => PT + ((maxV - p.value) / span) * ih);
  const line = points.map((_, i) => `${i === 0 ? "M" : "L"}${xs[i]},${ys[i]}`).join(" ");
  const area = `${line} L${xs[xs.length - 1]},${PT + ih} L${xs[0]},${PT + ih} Z`;
  return (
    <div className="mt-6 rounded-2xl border border-border bg-[color:var(--surface-2)] p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        <AlertTriangle className="h-3.5 w-3.5 text-[color:var(--warning)]" />
        Prognoza vrijednosti
      </div>
      <div className="mt-1 text-sm text-foreground">
        Čekanje sa prodajom može te koštati do{" "}
        <span className="font-semibold text-[color:var(--warning)]">{loss} €</span> za godinu dana.
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img" aria-label="Prognoza vrijednosti">
        <defs>
          <linearGradient id="depFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-brand)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--accent-brand)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#depFill)" />
        <path d={line} fill="none" stroke="var(--accent-brand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={p.label}>
            <circle cx={xs[i]} cy={ys[i]} r={i === 0 ? 5 : 3.5} fill={i === 0 ? "var(--accent-brand)" : "white"} stroke="var(--accent-brand)" strokeWidth="2" />
            <text x={xs[i]} y={ys[i] - 10} textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>
              {p.value} €
            </text>
            <text x={xs[i]} y={H - 8} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Step7({ input, onBack }: { input: OfferInput; onBack: () => void }) {
  const navigate = useNavigate();
  const submit = useServerFn(submitTradeIn);
  const [form, setForm] = useState({ customer_name: "", customer_phone: "", customer_email: "", dropoff_method: "", dropoff_city: "" });

  const m = useMutation({
    mutationFn: async () => {
      if (!form.customer_name.trim() || !form.customer_phone.trim() || !form.dropoff_method) {
        throw new Error("Popuni obavezna polja.");
      }
      return submit({
        data: {
          ...input,
          customer_name: form.customer_name.trim(),
          customer_phone: form.customer_phone.trim(),
          customer_email: form.customer_email.trim() || undefined,
          dropoff_method: form.dropoff_method,
          dropoff_city: form.dropoff_city || undefined,
        },
      });
    },
    onSuccess: (res) => {
      navigate({ to: "/prodaj/uspjeh/$ref", params: { ref: res.reference_code } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : me.common.error),
  });

  return (
    <div>
      <BackBtn onBack={onBack} />
      <h1 className="font-display text-4xl">{me.sell.step7Title}</h1>
      <div className="mt-6 grid gap-4">
        <Field label={me.sell.nameLabel} value={form.customer_name} onChange={(v) => setForm({ ...form, customer_name: v })} />
        <Field label={me.sell.phoneLabel} value={form.customer_phone} onChange={(v) => setForm({ ...form, customer_phone: v })} />
        <Field label={me.sell.emailLabel} value={form.customer_email} onChange={(v) => setForm({ ...form, customer_email: v })} type="email" />
        <div>
          <label className="mb-1 block text-sm font-medium">{me.sell.dropoffLabel}</label>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { v: "mail", l: me.sell.dropoff_mail, sub: me.sell.dropoff_mail_sub },
              { v: "meet", l: me.sell.dropoff_meet, sub: me.sell.dropoff_meet_sub },
            ].map((o) => (
              <button
                key={o.v}
                type="button"
                onClick={() => setForm({ ...form, dropoff_method: o.v, dropoff_city: "" })}
                className={
                  "rounded-xl border p-4 text-left text-sm " +
                  (form.dropoff_method === o.v ? "border-[color:var(--accent-brand)] bg-[color:var(--accent)]" : "border-border bg-card")
                }
              >
                <div className="font-medium">{o.l}</div>
                <div className="mt-1 text-xs text-muted-foreground">{o.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <button onClick={() => m.mutate()} disabled={m.isPending} className="btn-primary disabled:opacity-40">
          {m.isPending ? "Šaljemo..." : me.common.submit}
        </button>
      </div>
    </div>
  );
}

/* ---------- shared bits ---------- */

function BackBtn({ onBack }: { onBack: () => void }) {
  return (
    <button onClick={onBack} className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft className="h-4 w-4" /> {me.common.back}
    </button>
  );
}

function YesNo({
  question,
  help,
  value,
  onChange,
}: {
  question: string;
  help?: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-sm font-medium">{question}</div>
      {help && <div className="mt-1 text-xs text-muted-foreground">{help}</div>}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onChange(true)}
          className={
            "rounded-full px-4 py-1.5 text-sm " +
            (value === true ? "bg-[color:var(--accent-brand)] text-white" : "border border-border")
          }
        >
          {me.common.yes}
        </button>
        <button
          onClick={() => onChange(false)}
          className={
            "rounded-full px-4 py-1.5 text-sm " +
            (value === false ? "bg-[color:var(--accent-brand)] text-white" : "border border-border")
          }
        >
          {me.common.no}
        </button>
      </div>
    </div>
  );
}

function SegGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T | null;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold">{label}</div>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={
              "rounded-xl border p-3 text-left text-sm " +
              (value === o.value ? "border-[color:var(--accent-brand)] bg-[color:var(--accent)]" : "border-border bg-card")
            }
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FuncRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
      <div className="text-sm">{label}</div>
      <div className="flex gap-1">
        <button
          onClick={() => onChange(true)}
          className={
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs " +
            (value === true ? "bg-[color:var(--success)] text-white" : "border border-border")
          }
        >
          <Check className="h-3 w-3" /> {me.common.works}
        </button>
        <button
          onClick={() => onChange(false)}
          className={
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs " +
            (value === false ? "bg-destructive text-destructive-foreground" : "border border-border")
          }
        >
          <X className="h-3 w-3" /> {me.common.doesntWork}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-medium">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-[color:var(--accent-brand)]"
      />
    </label>
  );
}

function RejectCard({
  title,
  body,
  onAction,
  actionLabel,
}: {
  title: string;
  body: string;
  onAction?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 md:p-12">
      <AlertTriangle className="h-6 w-6 text-[color:var(--warning)]" />
      <h2 className="mt-3 font-display text-3xl">{title}</h2>
      <p className="mt-3 text-muted-foreground">{body}</p>
      {onAction && actionLabel && (
        <button onClick={onAction} className="btn-primary mt-6">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
