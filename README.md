# Renewed Gadgets

I want you to build an app, obnovi.me its called see below:

SECTION 1 — THE PRICING ENGINE (build this exactly — this is the core of the app)

This is the core IP of the business. Everything else (design, pages, copy) is replaceable. This logic is not — get it right and the app is trivial; get it wrong and the app is dangerous (you'll either lose money on every trade-in or insult customers with lowball offers). Every number below must be implemented as real data (database rows / config, editable from the admin panel in section 4) — never as constants hardcoded inside components.

1.1 Scope for launch

iPhones only. Data model must include a device_type field (iphone | ipad) from day one, even though only iphone is populated at launch — this means adding iPads later is a data-entry task, not a rebuild.

1.2 Device catalog & base resale values

"Base resale value" = what we list a Grade A (Vrlo dobro), 128GB refurbished unit for, in EUR. All other storage sizes and grades are derived from this with multipliers (below). These starting values are anchored to real EU refurb-market pricing (Swappie's public prices) and de-risked for Montenegro being a smaller, less price-elastic market with no organized refurb competitor yet. Mark these as admin-editable — do not hardcode them in components. They need recalibration monthly against local classifieds (Pazar3.me, prodajemkupujem.me) once the business is live.

ModelBase resale value (128GB, Grade A)Buy tieriPhone XR90€Tier 1iPhone XS100€Tier 1iPhone XS Max110€Tier 1iPhone 11150€Tier 1iPhone 11 Pro190€Tier 1iPhone 11 Pro Max210€Tier 1iPhone 12 mini170€Tier 1iPhone 12210€Tier 1iPhone 12 Pro270€Tier 1iPhone 12 Pro Max300€Tier 1iPhone 13 mini280€Tier 1iPhone 13330€Tier 1iPhone 13 Pro430€Tier 1iPhone 13 Pro Max500€Tier 1iPhone 14380€Tier 1iPhone 14 Plus440€Tier 1iPhone 14 Pro510€Tier 1iPhone 14 Pro Max570€Tier 1iPhone 15500€Tier 1iPhone 15 Plus550€Tier 1iPhone 15 Pro675€Tier 1iPhone 15 Pro Max780€Tier 1iPhone 16690€Tier 1iPhone 16 Plus790€Tier 1iPhone 16 Pro930€Tier 1iPhone 16 Pro Max1070€Tier 1iPhone 8 / 8 Plus70€Tier 2 (flat)iPhone 7 / 7 Plus55€Tier 2 (flat)iPhone SE (2020)60€Tier 2 (flat)iPhone 6s and older—Rejected outright, not in catalog

Storage multipliers (applied to base resale value; base = 128GB):

StorageMultiplier64GB× 0.90128GB× 1.00 (reference)256GB× 1.15512GB× 1.351TB (Pro Max only)× 1.55

1.3 Grading tiers (cosmetic condition → resale multiplier)

GradeMontenegrin labelDefinitionMultiplier on base resale valueA+OdličnoNo visible wear on screen or back× 1.08AVrlo dobroLight scratches only, not visible from normal viewing distance× 1.00 (reference)BDobroVisible scratches/dents, or cracked back glass (screen must be intact)× 0.85

A cracked screen always caps the device at Grade B for pricing purposes and also forces a mandatory screen replacement in refurb cost (see 1.5) — you can't resell a phone with a cracked screen regardless of everything else being fine.

1.4 HARD REJECTS — no offer generated, full stop

These must short-circuit the calculator entirely and show a clear rejection message. Do not let the flow continue to a price.

Battery health below 85%. Non-negotiable, no exceptions, no discounted offer. Message: "Nažalost, ne otkupljujemo telefone sa zdravljem baterije ispod 85%. Zdravlje baterije možete provjeriti u Podešavanja → Baterija → Zdravlje baterije."

iCloud / Find My iPhone still active. Message should explain how to turn it off and invite them to restart the quote once done — this one is recoverable, not a permanent reject.

IMEI reported lost/stolen or blacklisted. Check against GSMA blacklist or equivalent database (this needs a real API integration — flag as a TODO with a manual fallback: staff verify IMEI by phone/in person before finalizing any Tier 1 offer if no API is wired up yet).

Water damage with visible corrosion (liquid contact indicator tripped and visible internal damage — this will typically be confirmed at physical drop-off, but ask the screening question upfront to filter it out of online quotes).

Serial number / parts mismatch ("Frankenphone" — screen or logic board doesn't match the device's original configuration). Also confirmed at physical inspection; ask upfront if the customer knows the phone has had non-Apple-authorized repairs.

Model is iPhone 6s or older, or any Android/other brand (out of scope entirely).

Critical functional failure: Face ID completely non-functional, phone won't power on reliably, or multiple major faults simultaneously (e.g., broken charging port AND broken speaker AND cracked screen). One or two isolated functional issues get a repair-cost deduction (below); a pile of them means the unit isn't economical to refurbish — reject with an explanation, optionally offer a flat 15–20€ "parts only" cash price as a manual override for staff, not the algorithm.

1.5 Refurb cost line items (subtracted from payout calculation)

Condition foundRefurb cost addedBase diagnostic + cleaning (always applied)12€Battery 85–89% (must replace to guarantee ≥90% at resale)+35€Battery ≥90%+0€Screen cracked (mandatory replacement)+70€Screen minor scratches only+0€ (cosmetic, reflected in grade only)Back glass/frame cracked+50€Back glass/frame dented/scuffed (cosmetic cleanup)+15€Charging port faulty+25€Speaker or microphone faulty+20€Single camera fault+40€Face ID faultyHard reject (see 1.4.7)

1.6 The payout formula

ResaleValue = BaseResaleValue[model] × StorageMultiplier[storage] × GradeMultiplier[grade]

RefurbCost = sum of applicable line items from 1.5

Payout = ResaleValue × (1 − TargetMargin − WarrantyReserve) − RefurbCost

Where:
  TargetMargin    = 0.33   (33%, admin-editable)
  WarrantyReserve = 0.05   (5%, admin-editable)

  → simplifies to: Payout = ResaleValue × 0.62 − RefurbCost

Round DOWN to nearest 5€.

If Payout < 20€ → do not show a numeric offer. Show: "Za ovaj uređaj trenutno ne možemo ponuditi otkup, ali možete ga donijeti besplatno na recikliranje."

Tier 2 devices (iPhone 7/8/SE 2020): skip the formula entirely. Flat payout of 25€ if: battery ≥85%, no cracked screen, all functions work. Otherwise reject (no partial offers on Tier 2 — the margin is too thin to support grading).

1.7 Worked example (for your own QA / to sanity-check Lovable's implementation)

iPhone 13, 128GB, Grade A (light scratches only), battery 92%, everything functional:

ResaleValue = 330 × 1.00 × 1.00 = 330€
RefurbCost  = 12€ (diagnostic only, battery ≥90%, no cracks)
Payout      = 330 × 0.62 − 12 = 204.6 − 12 = 192.6 → round down to 190€

iPhone 13, 128GB, screen cracked, battery 87%:

Grade forced to B (× 0.85) because screen is cracked
ResaleValue = 330 × 1.00 × 0.85 = 280.5€
RefurbCost  = 12 (diagnostic) + 35 (battery replacement, 87%<90%) + 70 (screen) = 117€
Payout      = 280.5 × 0.62 − 117 = 173.9 − 117 = 56.9 → round down to 55€

1.8 Resale (outgoing) pricing

When listing a refurbished unit for sale, list price = ResaleValue rounded to end in 9 (psychological pricing — e.g., 329€ not 330€, 199€ not 200€). Round to the nearest 9 below the calculated value, never above.

1.9 Everything in this section must be admin-editable

Build an admin panel (see Part 2) where a logged-in operator can update, without touching code:

Base resale value per model

Storage multipliers

Grade multipliers

TargetMargin and WarrantyReserve percentages

Refurb cost line items

Tier 2 flat payout amount

Minimum payout floor (currently 20€)

SECTION 2 — PROJECT BRIEF

PROJECT: Obnovi.me — refurbished iPhone marketplace for Montenegro

Build a bilingual-ready but Montenegrin-only-for-launch e-commerce web app for a company that buys used iPhones from consumers, refurbishes them, and resells them with a warranty — modeled on Swappie.com but adapted for the Montenegrin market. Currency is EUR throughout. All customer-facing copy is in Montenegrin (Latin script). Do not add English as a visible language toggle yet — architect the copy as a simple key-value dictionary so a language switcher can be added later without restructuring components.

Brand & tone

Name: Obnovi.me ("obnovi" = renew/restore in Montenegrin; .me is Montenegro's domain, doubling as a tagline). Tone: trustworthy, modern, straightforward — this brand's entire value proposition is trust (warranty, real returns, no shady classifieds seller) in a market used to informal, unregulated phone trading. Avoid anything that reads as "budget" or "sketchy secondhand shop." Think: clean, Apple-adjacent aesthetic (lots of white space, high-quality product photography placeholders, confident typography) without directly copying Apple's visual identity or using their trademarks.

SECTION 3 — CORE USER FLOWS (build all of these)

Flow A — Sell your iPhone (trade-in)

Landing page with clear CTA: "Prodaj svoj iPhone" (Sell your iPhone)

Step 1: Select model from a searchable/filterable grid (group by generation, show icon/thumbnail)

Step 2: Select storage (64/128/256/512GB/1TB — only show options that actually exist for that model)

Step 3: Hard-reject screening questions, asked BEFORE cosmetic questions so we don't waste the customer's time:

"Da li je Find My iPhone/iCloud isključen?" (Yes/No — if No, show instructions + let them come back)

"Da li je telefon prijavljen kao izgubljen/ukraden?" (Yes/No — if Yes, reject immediately, no further questions)

"Da li je telefon imao kontakt sa vodom i ima vidljivu koroziju?" (Yes/No — if Yes, reject immediately)

"Da li je ekran ili matična ploča mijenjana od strane neovlašćenog servisera?" (Yes/No — if Yes, reject immediately, suggest they contact us directly for manual assessment)

Step 4: Battery health input (numeric input or a simple slider, with an instructional graphic showing where to find this in Settings → Battery → Battery Health). If <85, immediately show the hard-reject message and stop the flow — do not let them continue to cosmetic questions.

Step 5: Cosmetic & functional condition — screen (none/minor scratches/cracked), back/frame (none/minor/cracked), and functional checklist (charging port, speaker/mic, cameras, Face ID — each a simple toggle "radi / ne radi")

Step 6: Calculate and display the offer using the exact formula in Section 1 above (section 1.6, "The payout formula" — implement it precisely, including the round-down-to-nearest-5€ rule and the 20€ minimum floor). A breakdown is NOT necessary to show the customer (keep it simple — just show the final number), but store the full breakdown (resale value, grade multiplier, every refurb line item applied) in the database for the admin panel.

Step 7: If offer is accepted, collect contact info + choose drop-off method (in-person in Podgorica/Budva/Kotor/Nikšić, or mail-in with prepaid label — mail-in can be a placeholder for now) → confirmation screen with a reference number.

Every hard-reject state needs its own clear, kind, specific message — never a generic "sorry, we can't buy this."

Flow B — Buy a refurbished iPhone

Product listing grid, filterable by model, storage, grade, price range

Product detail page: photos (placeholder gallery), grade explanation (Odlično/Vrlo dobro/Dobro with plain-language descriptions of what each means), battery health guarantee (≥90%), 12-month warranty badge, 14-day return badge

Add to cart → checkout: cash on delivery (pouzećem) as the default and primary payment method — this is essential for the Montenegrin market, do not build a Stripe-only checkout. Include a placeholder for card payment via a local processor to be wired in later, but COD must work end to end in the initial build.

Order confirmation + simple order status page

SECTION 4 — ADMIN PANEL (basic auth-gated, doesn't need to be fancy)

Editable pricing engine table: every value from Section 1 — base resale values per model, storage multipliers, grade multipliers, TargetMargin/WarrantyReserve percentages, refurb cost line items, Tier 2 flat payout, minimum payout floor — all editable via forms, not requiring a code deploy to change

List of incoming trade-in submissions with full condition breakdown and calculated offer, status (pending/accepted/rejected/completed)

Inventory list of refurbished units for sale (add/edit/remove, set grade, set final price — pre-filled from the calculator per section 1.8's psychological-pricing rule, but manually overridable)

Simple order list for purchases (Section 3, Flow B)

SECTION 5 — PAGES

Home (hero, "sell" and "buy" CTAs, trust signals: warranty, returns, local pickup, testimonials placeholder)

Prodaj svoj iPhone (Flow A entry point)

Kupi iPhone (shop grid — Flow B)

Product detail page

Kako radi (How it works — explain grading, warranty, process in plain language)

O nama (About)

Česta pitanja (FAQ) — pre-fill with genuinely useful FAQs: battery health guarantee, what happens if my phone fails within warranty, how grading works, delivery areas, why we can't buy iCloud-locked phones

Kontakt

Admin panel (separate route, auth-gated)

SECTION 6 — DATA MODEL (guidance for Lovable/Supabase)

devices table: id, device_type (iphone/ipad), model_name, release_year, base_resale_value, buy_tier (1/2/rejected), storage_options (array), image_url

storage_multipliers, grade_multipliers, refurb_cost_items, pricing_config (margin %, reserve %, min payout floor) — all admin-editable, not hardcoded

trade_in_submissions: id, device_id, storage, screening_answers (jsonb), battery_health, cosmetic_grade, functional_answers (jsonb), calculated_payout, status, customer_contact, created_at

inventory: id, device_id, storage, grade, battery_health, list_price, status (available/sold), photos

orders: id, inventory_id, customer_info, payment_method (cod default), status, created_at

SECTION 7 — DESIGN DIRECTION

Clean, confident, minimal — generous white space, a restrained color palette (one accent color, everything else neutral), clear typographic hierarchy. Avoid generic "AI startup" gradients and avoid stock-photo-looking hero images. This should feel closer to a premium consumer electronics brand than a discount marketplace, since trust is the entire value proposition. Buttons and CTAs should be unambiguous — "Prodaj svoj iPhone" and "Kupi iPhone" should be impossible to miss on the homepage.

SECTION 8 — WHAT NOT TO DO

Do not hardcode any pricing values inside components — everything from Section 1 must be editable data, not constants baked into JSX

Do not build a Stripe-first checkout — cash on delivery is the primary flow

Do not skip the hard-reject screening questions or reorder them after the battery/cosmetic questions — they exist specifically to avoid wasting time on phones we can never buy

Do not average or "soften" the battery <85% rule under any circumstance in the logic — it's a hard boolean gate

Do not simplify or drop any of the refurb cost line items (1.5) or the grade-forcing rule for cracked screens (1.3) — these are what keep the payout formula from losing money on real units

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://obnovi-me-engine.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f5d18c75-67b1-4f39-8d80-0ae1ca0a4101).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
