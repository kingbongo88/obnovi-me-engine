
# Obnovi.me — Build Plan

Bilingual-ready (Montenegrin only visible), EUR, iPhone-only-at-launch trade-in + refurb marketplace with an admin-editable pricing engine.

## 1. Backend (Lovable Cloud / Supabase)

Enable Lovable Cloud. Create schema + RLS + grants in migrations:

- `devices` — id, device_type ('iphone'|'ipad'), model_name, release_year, base_resale_value (numeric), buy_tier (1|2), storage_options (int[]), image_url, sort_order, active
- `storage_multipliers` — storage_gb (pk), multiplier
- `grade_multipliers` — grade ('A+'|'A'|'B'), label_me, multiplier
- `refurb_cost_items` — key, label, amount, active
- `pricing_config` — singleton row: target_margin, warranty_reserve, min_payout_floor, tier2_flat_payout, round_step (5), list_price_ending (9)
- `trade_in_submissions` — id, device_id, storage_gb, screening_answers jsonb, battery_health int, cosmetic_grade, functional_answers jsonb, cracked_screen bool, cracked_back bool, resale_value, refurb_cost, calculated_payout, breakdown jsonb, rejection_reason, status ('pending'|'accepted'|'rejected'|'completed'), customer_name, customer_phone, customer_email, dropoff_method, dropoff_city, reference_code, created_at
- `inventory` — id, device_id, storage_gb, grade, battery_health, list_price, status ('available'|'reserved'|'sold'), photos text[], description, created_at
- `orders` — id, inventory_id, customer_name, phone, address, city, payment_method ('cod'|'card'), status ('new'|'confirmed'|'shipped'|'delivered'|'cancelled'), created_at
- `user_roles` — (user_id, role app_role) with `has_role()` SECURITY DEFINER (roles: 'admin', 'user')

RLS: public SELECT on `devices`, `storage_multipliers`, `grade_multipliers`, `refurb_cost_items`, `pricing_config`, and available `inventory`. Anon INSERT allowed on `trade_in_submissions` and `orders` (rate-limited server-side). All writes/reads on submissions/orders/config for admins go through `has_role(auth.uid(),'admin')`. Grants added per public-schema-grants rule.

Seed migration inserts every model from Section 1.2, all storage multipliers, grade multipliers, refurb line items, pricing_config defaults (target_margin 0.33, warranty_reserve 0.05, min_payout_floor 20, tier2_flat_payout 25).

## 2. Pricing engine (single source of truth)

`src/lib/pricing.ts` — pure function `computeOffer(input, config)` returning either `{status:'rejected', reason}` or `{status:'ok', payout, resaleValue, refurbCost, effectiveGrade, breakdown}`.

Rules implemented exactly per Section 1:
- Hard rejects (1.4): battery<85, iCloud on, lost/stolen, water+corrosion, unauthorized repair, model=iPhone 6s/older, "critical functional failure" (Face ID broken OR ≥3 major faults among {charging, speaker/mic, camera, cracked screen, cracked back}).
- Tier 2 (7/8/SE2020): flat tier2 payout if battery≥85 AND no cracked screen AND all functions work; else reject.
- Tier 1: cracked screen forces grade B; ResaleValue = base × storageMult × gradeMult; RefurbCost = 12 diagnostic + battery(85–89→35) + cracked screen 70 + back glass cracked 50 or dented 15 + charging 25 + speaker/mic 20 + camera 40; Payout = Resale × (1 − margin − reserve) − Refurb; round DOWN to nearest 5; if <min_payout_floor → "recycle" message.
- List price (1.8): round to nearest number ending in 9, never above ResaleValue.

Unit-tested with the two worked examples in 1.7 (Vitest) to lock behavior.

Data loaded via a server function `getPricingBundle()` (public, read-only) that returns devices + all multipliers + config + refurb items. The trade-in wizard calls this once and computes offers client-side; the acceptance step re-computes server-side inside `submitTradeIn` server fn before insert to prevent tampering.

## 3. Routes (TanStack Start)

```
src/routes/
  __root.tsx                     header, footer, MNE meta
  index.tsx                      Home — hero, Prodaj / Kupi CTAs, trust signals
  prodaj.tsx                     Flow A wizard (steps 1–7)
  prodaj.uspjeh.$ref.tsx         confirmation w/ reference code
  kupi.tsx                       shop grid + filters
  kupi.$id.tsx                   product detail + add to cart
  kosarica.tsx                   cart
  naplata.tsx                    checkout (COD default; card placeholder)
  narudzba.$id.tsx               order status
  kako-radi.tsx
  o-nama.tsx
  pitanja.tsx                    FAQ
  kontakt.tsx
  _authenticated/route.tsx       managed gate (created by cloud)
  admin.tsx                      layout (admin role check via has_role)
  admin.index.tsx                dashboard
  admin.cjenovnik.tsx            editable pricing tables (all Section 1 values)
  admin.otkupi.tsx               trade-in submissions list + detail
  admin.inventar.tsx             inventory CRUD, price prefilled via 1.8
  admin.narudzbe.tsx             orders list
  auth.tsx                       email/password + Google sign-in (for admin)
```

Each content route has unique `head()` (title, description, og). Cart uses Zustand+localStorage.

## 4. Flow A — Prodaj svoj iPhone

Wizard state machine (single page, stepper UI):
1. Model — searchable grid grouped by generation, thumbnails
2. Storage — only options from `devices.storage_options`
3. Screening (order fixed): Find My off? / stolen? / water+corrosion? / unauthorized repair? — any hard-fail short-circuits with its specific MNE message; iCloud reject is recoverable (retry CTA)
4. Battery health numeric input (0–100) with Settings screenshot helper; <85 → immediate hard-reject stop
5. Cosmetic: screen (none/minor/cracked), back (none/minor/cracked); Functional: charging, speaker/mic, camera, Face ID (radi/ne radi)
6. Result: single final € number (no breakdown shown), OR reject message, OR recycle message; full breakdown stored server-side
7. Accept → contact form (ime, telefon, email) + drop-off (Podgorica/Budva/Kotor/Nikšić/pošta-placeholder) → `submitTradeIn` server fn → reference code page

IMEI/GSMA blacklist: TODO with staff-verification note in submission detail (per 1.4).

## 5. Flow B — Kupi iPhone

Grid with filters (model, storage, grade, price range). Detail page shows grade explanation, battery ≥90% badge, 12-month warranty, 14-day returns. Cart → checkout with COD primary, card disabled with "Uskoro" placeholder. Order confirmation + `/narudzba/$id` status.

## 6. Admin panel

`/_authenticated/admin/*`, gated by `has_role('admin')` (redirect if not admin). Server fns use `requireSupabaseAuth` and re-check role before mutating.

- Cjenovnik: tabs for Modeli (edit base_resale + tier per device), Skladište (storage multipliers), Ocjene (grade multipliers), Popravke (refurb line items), Parametri (margin, reserve, min floor, tier2 flat, rounding). Inline edits, "Sačuvaj".
- Otkupi: table of submissions with status filter; row detail shows every input + stored breakdown + calculated payout; buttons Prihvati / Odbij / Završi.
- Inventar: CRUD; on create, list_price auto-computed via 1.8 (nearest-9 below ResaleValue) but overridable; photos as URL list.
- Narudžbe: list + detail + status update.

First admin: created by inserting into `user_roles` post-signup (documented in README).

## 7. Design

Clean editorial minimal — near-white background, single accent (deep graphite or a restrained teal), generous whitespace, confident typography (e.g. Instrument Serif display + Inter body OR Space Grotesk + DM Sans — pick one, keep semantic tokens in `styles.css`). No purple gradients, no stock photography. Product cards use placeholder image slots (soft neutral). Trust badges: warranty 12m, povrat 14 dana, lokalno preuzimanje, pouzećem.

## 8. Copy dictionary

`src/i18n/me.ts` — flat key/value object used across the app so a future language switcher is a config change, not a refactor. No English toggle in UI.

## 9. Guardrails enforced in code

- Zero hardcoded pricing constants — the pricing module fetches config from DB.
- Server-side recompute on submit; client offer is advisory.
- Screening order fixed in the wizard state machine.
- Battery <85 is a strict boolean gate, no soft path.
- Cracked screen always caps grade B AND adds the 70€ line item.

## 10. Order of implementation

1. Enable Cloud, run schema+seed migration, add auth (email/password + Google).
2. Pricing engine module + Vitest tests using the worked examples.
3. Public server fn to fetch pricing bundle; devices grid.
4. Flow A wizard end-to-end, including submit server fn.
5. Home, Kako radi, FAQ, O nama, Kontakt.
6. Flow B: inventory listing, detail, cart, COD checkout, order status.
7. Admin panel (roles, all editable tables, submissions, inventory, orders).
8. Head metadata pass on every route; final QA against Section 1.7 examples.

## Open questions before I start building

1. Is a single accent color OK (I'll propose graphite + soft cream) or do you want to pick — I can generate 3 rendered design directions before coding if you'd like.
2. Placeholder product photos — use neutral silhouettes/gradients, or leave empty frames?
3. Admin bootstrap: OK to make the first signed-up account admin via a one-time SQL, then require existing admin to promote others?

I can proceed with sensible defaults on all three if you don't want to decide now.
