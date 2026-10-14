---
name: event-transformation
description: Business logic for turning one RudderStack event into one destination payload — the standard mapping JSON shape and constructPayload, resolving source values, ISO-4217 minor units, preserving customer data, which event validations a transform may add (only what the partner rejects), and assembling the payload, plus category conventions for ads destinations (identity match fields, deduplication keys). Applied automatically — not user-invocable.
---

# Event Transformation

**Field plucking is data, not code.** The source→destination mapping lives in
`data/<DEST_UPPER>Config.json` in the standard shape, consumed by `constructPayload`. Only genuinely
custom work — hashing, unit conversion, partner-specific validation — is TypeScript. Worked
example: `src/v0/destinations/openai_ads/` (mapping JSON, `constructPayload` in `utils.ts`, only
hashing/amount/content-item validation in code).

Everything before **Category Conventions** applies to every destination; that section binds only
its category.

## The Standard Mapping Shape

`constructPayload(message, mappingJson)` (`src/v0/util/index.js:1081`) walks an array:

```json
[
  { "sourceKeys": ["traits.emails", "context.traits.emails", "traits.email"], "destKey": "emails_sha256" },
  { "sourceKeys": "event", "destKey": "type", "required": true },
  { "sourceKeys": ["timestamp", "originalTimestamp"], "destKey": "timestamp_ms", "metadata": { "type": "timestamp" } }
]
```

- `sourceKeys` — a path, or paths in **precedence order**. `destKey` — `lodash.set`, so `"data.amount"` nests.
- `required: true` — throws `InstrumentationError("Missing required value from ...")`; replaces a
  hand-written presence check.
- `metadata: { type: "timestamp" }` — `formatTimeStamp` with no `typeFormat` returns epoch **ms**
  (`src/v0/util/index.js:398-406`); replaces bespoke timestamp resolvers (what most CAPI
  `timestamp_ms` fields want).

Never invent a config shape (`userFields`, `contentSourcePaths`, `clickIdPaths`, …) — it forces a
hand-written type, a resolver per group, and a parallel "already mapped" list.

**Array items:** call `constructPayload` per element with an item-level mapping
(`src/v0/destinations/ga4/utils.js:215,254`, `src/v0/destinations/ometria/util.js:28,43`):

```ts
const contents = rawContents.map((item) => constructPayload(item, MAPPING.contentMappings));
```

## `constructPayload` Sets Only What It Finds

The write is guarded by `value || value === 0 || value === false` (`src/v0/util/index.js:1136-1139`):

- `''` never lands; `false` and `0` do.
- Duplicate `destKey`s act as a precedence chain (later overwrite only when they resolve) — reads
  like a copy-paste accident. **Collapse them into one entry** with the union of keys in precedence order.
- **No type validation.** A field typed `Record<string, unknown>` will receive a scalar; guard after:

```ts
const item = constructPayload(raw, MAPPING.contentMappings);
if (!isPlainObject(item.variant_dict)) delete item.variant_dict;
```

## Use `getValueFromMessage`, Not a Hand-Rolled First-Of-N Helper

`getValueFromMessage(message, sourceKeys)` (`src/v0/util/index.js:647`) already returns the first
usable value — no `getFirstValue`/`getFirstDefinedValue`/`firstScalar`.

- A **one-element array** logs `List with single element is not ideal...` on *every event* — use a
  bare string.
- Usability is `val || val === false || val === 0`: skips `''`, returns `null` when nothing
  matches, never `''` — downstream `!== ''` checks are dead code.

## `sourceFromGenericMap` — Check What It Expands To First

`sourceFromGenericMap: true` expands `sourceKeys` via `src/v0/util/data/GenericFieldMapping.json`.
The expansion is large — verify the entry first. Trap: a review removes `*.zip` paths, a later
"simplification" to `sourceKeys: "zipcode"` silently reinstates them.

| Generic key | Surprise |
| --- | --- |
| `zipcode` | 28 paths — every zip/postal spelling under `traits`, `traits.address`, and `context.traits` mirrors |
| `email` | includes `properties.email` **and** `context.externalId.0.id` |
| `phone` | includes `properties.phone` |
| `city` | **only** `traits.address.city` / `context.traits.address.city`, not `traits.city` |
| `firstName` / `lastName` | singular only, three casings; no plural forms |

`region`/`country` are safe (`traits.*` + `context.traits.*` only). When the generic map is wider or
narrower than the partner spec, list paths explicitly. Plural-array destination fields always need
explicit plural source keys.

## Don't Guess Source Paths

Every path claims the partner reads that field from there. Adding `traits.state` to `regions` or
`traits.countryCode` to `countries` because they "look related" ships wrong values silently. Map
only what the spec or partner docs name.

## A Value The SDKs Populate Has One Canonical `context.*` Path

| Partner asks for | Read from |
| --- | --- |
| Mobile advertising id — IDFA, GAID, AAID, MADID, RDID | `context.device.advertisingId` |
| App / bundle / package id | `context.app.namespace` |
| User agent · IP | `context.userAgent` · `context.ip` |

(19 destinations read `context.device.advertisingId`; `context.userAgent` in 40 files vs 2 with a
`properties.*` alias; `context.ip` in 61 vs none.) A `properties.*` alias invents a second
contract the customer can only meet by sending the value twice. Neither of the first two has a
`GenericFieldMapping.json` entry — list the path explicitly.

**Event-stream only.** Audience/RETL destinations take identifiers from record fields
(`src/v0/destinations/fb_custom_audience/util.ts:127` MADID from the row schema;
`src/v0/destinations/google_adwords_remarketing_lists/dataManager/util.ts:115` from `fields.mobileId`).

**Device type picks the destination field, not the source path.** The gate lives in different
layers: workflow condition (`src/cdk/v2/destinations/reddit/procWorkflow.yaml:44-45` —
`$.isAppleFamily(os)` → `idfa`, `os === "android"` → `aaid`), transform
branch (`src/v0/destinations/impact/util.js` `AppleIfa` vs `GoogAId`; `src/v0/destinations/adj/transform.js:36-41`
maps `idfa` and `gps_adid` from one path, then deletes the one the platform can't carry), or per-platform mapping files (`singular/data/SINGULARIosEventConfig.json` `idfa` vs
`SINGULARAndroidEventConfig.json` `aifa`).

**Gate on `isAppleFamily` / `isAndroidFamily`** (`src/v0/util/index.js:1724`, `:1732`;
`$.isAppleFamily` in YAML) — used by ~20 destinations. Apple = `ios`, `ipados`, `watchos`, `tvos`;
Android = `android`. They lowercase and return `false` for non-strings (no `.toLowerCase()` or
presence guard needed) but don't trim. A local `new Set(['ios','iphone','ipad','apple'])` drops
`watchos`/`tvos`, admits model names, and routes ids differently from every other destination.

**Precedent that is not the pattern:** `branch`/`revenue_cat` (`context.idfa`/`context.aaid`
first), `snapchat_conversion` (`properties.adId`), `facebook_conversions` (`properties.anon_id`),
`tiktok_ads` (`properties.appId`), `openai_ads` (`traits.*` chain), `rakuten` (`properties.*` only,
`src/cdk/v2/destinations/rakuten/data/propertiesMapping.json:89`). Each has a local reason. Start
with the canonical path alone; add an alias only when partner docs or an agreed contract demand it.

## Presence Checks: Know What The Shared Helpers Actually Do

- **`isDefinedAndNotNullAndNotEmpty` is `lodash.isEmpty`-based — rejects every number and
  boolean** (`isEmpty(1) === true`), silently dropping `quantity: 1`. Use it only for
  strings/arrays/objects. For scalars use `isDefinedAndNotNull` or one local `isPresent` — and
  **one** predicate per file.
- **`removeUndefinedAndNullValues` = `lodash.pickBy(obj, isDefinedAndNotNull)`**
  (`src/v0/util/index.js:60`) — preserves `false`/`0`, so prefer one flat literal over conditional spreads:

```ts
// Good — `opt_out: false` survives
return removeUndefinedAndNullValues({ id, type, timestamp_ms, oppref, source_url, opt_out, data });
// Bad
return { id, type, timestamp_ms, ...(oppref ? { oppref } : {}), ...(optOut !== undefined ? { opt_out: optOut } : {}) };
```

- `removeUndefinedAndNullAndEmptyValues` adds `isNotEmpty` and **drops** `false`/`0` — don't reach
  for it reflexively.
- Both strip an absent required field silently; validate first or map with `required: true`.
  "Required" = the partner is shown to reject without it
  ([Reject Only What The Partner Rejects](#reject-only-what-the-partner-rejects)).

## Monetary Values — Never Assume Two Decimal Places

**Latent bug:** hardcoded `× 100` at `src/cdk/v2/destinations/reddit/utils.js:74,81,88`,
`src/cdk/v2/destinations/rakuten/utils.js:29`,
`src/cdk/v2/destinations/optimizely_fullstack/procWorkflow.yaml:196` (unconditional).
`src/v0/destinations/dub/utils.ts:60` is opt-in behind `convertAmountToCents` and documented
(`dub/types.ts:90-92`) — still not the pattern.

`× 100` is right only for exponent-2 currencies; **39 of 179** ISO-4217 currencies aren't. JPY,
KRW, VND, CLP, ISK (0 decimals) → 100× too high; BHD, KWD, TND (3) → 10× too low. Silent revenue
corruption for ads/analytics destinations.

No shared helper exists. Resolve the exponent from ISO-4217 (`currency-codes` is already a
dependency, `package.json:81`, `^2.2.0`; refresh when a currency redenominates):

```ts
import cc from 'currency-codes';
const DEFAULT_EXPONENT = 2;
const exponent = (code?: string) => cc.code(code ?? '')?.digits ?? DEFAULT_EXPONENT;
const toMinorUnits = (value: number, currency?: string) => Math.round(value * 10 ** exponent(currency));
```

Better reference: `src/v0/destinations/openai_ads/utils.ts:393` `toMinorUnits` — scales the
decimal string with `BigInt` (no float error, for exact-integer partners), bounds input length
before `BigInt` parses customer digits, rounds half-away-from-zero, keeps negatives (refunds).

- Unknown code → `cc.code()` is `undefined`. Default to 2 **and log once per unrecognised
  currency**, or throw `InstrumentationError` like `openai_ads` — decide deliberately.
- Decide what happens when a value resolves but the currency doesn't (assuming one misattributes;
  failing surfaces it in Live Events).
- "Micros" (×10⁶, e.g. Google Ads) is a fixed multiplier, not an exponent.
- Fix the legacy call sites when you touch each destination, with partner regression testing.

## Never Silently Rewrite or Drop Customer Data

Map, don't clean. Normalizing or discarding a deliberately-sent value is invisible — nothing fails
and the partner gets something the customer never sent. Let the partner validate.

- **Trim only inside hash normalizers.** A `trimString` helper on event names, paths, URLs and
  content rewrites data everywhere and, doubling as a truthiness check, obscures resolution.
- **Don't re-serialise URLs** via `new URL()` — it lowercases the host, adds a trailing slash and
  drops default ports. Return the raw value.
- **Don't "sanitise" custom properties** by recursively dropping empties, non-finite numbers or
  non-plain values.

Exception: documented partner requirements (hashing, minor units, an enum the API otherwise
rejects). Where normalization *is* required, apply it **consistently** — one case-sensitive enum
comparison (`action_source: 'Web'`) among normalized ones drops ordinary events.

```ts
const sourceUrl = getValueFromMessage(message, MAPPING.sourceUrlPaths); // Good — untouched
// Bad — new URL(raw); u.search = ''; u.hash = ''; return u.toString();
```

## Reject Only What The Partner Rejects

Every `InstrumentationError` drops a customer event, so each must point at something the partner
**enforces**: a rejection observed live or a mock captured from one. Docs alone — "required", a
documented size limit, a documented missing-field error, a stricter type than the API parses —
are not enough. If you can't send the request yet, forward the event and record the check as
unverified with the request that would settle it.

- **Before adding "requires X", send the payload without X.** Accepted → delete the check.
- **Coerce convertible types** (`String(value)` for a numeric id), don't `z.string()`-reject.
- **Size/count limits belong to the batch strategy.** A per-event byte check needs a shown
  rejection *and* a limit the strategy can't express.

Enforced rules still belong in `transformEvent`, especially for all-or-nothing endpoints
(`.claude/skills/batching-framework/SKILL.md#partners-that-reject-the-whole-batch`). The test is
whether you can produce the partner's rejection.

## Passthrough Extras Must Not Overwrite Payload-Owned Fields

Assign extras **first**, payload-owned fields **last**, so ownership is structural, not dependent on
a complete reserved-key list:

```ts
const data = { ...buildCustomExtras(message), type: dataType, amount, currency }; // Good
const data = { type: dataType, amount, currency }; Object.assign(data, buildCustomExtras(message)); // Bad — properties.type clobbers the discriminator
```

## Reserved-Key Sets Must Be Scoped To The Object Being Filtered

Derive the exclusion set from the mapping config, **scoped to the object the passthrough reads**.
A builder iterating `message.properties` can only collide with direct children of `properties`;
reserving trait leaves, message fields or item keys deletes customer data.

```ts
// Good — only `properties.`-rooted paths reserve a key
const PROPERTIES_PREFIX = 'properties.';
const RESERVED = new Set(
  Object.values(MAPPING).flatMap(sourceKeysOf).flatMap((keys) =>
    (Array.isArray(keys) ? keys : [keys])
      .filter((p) => p.startsWith(PROPERTIES_PREFIX))
      .map((p) => p.slice(PROPERTIES_PREFIX.length).split('.')[0])),
);
// Bad — last segment of every path reserves `id`, `name`, `type`, `sku`, `price`, `quantity`
const RESERVED = new Set(Object.values(MAPPING).flatMap(lastSegmentOf));
```

Splitting the JSON into message vs item paths doesn't fix it (`context.externalId.0.id` still
yields `id`); the prefix filter does. Add a component fixture: a custom event with
`properties.id`/`properties.name` must pass them through.

## Category Conventions

### Ads Destinations

Scope: server-side conversion APIs for ad attribution — `openai_ads`, `facebook_conversions`,
`pinterest_tag`, `linkedin_ads`, `snapchat_conversion`, `reddit`, Google Ads conversion
destinations. **Not** CRMs/marketing platforms (Braze, HubSpot, Customer.io) or audience/RETL
destinations. Reference: `src/v0/destinations/openai_ads/`.

#### A partner field named `external_id` is not RudderStack's `externalId`

Unrelated concepts. Map the partner's identifier from **`userId`, falling back to `anonymousId`**,
nothing else (`src/v0/destinations/openai_ads/data/OPENAI_ADSConfig.json:26-27`):

```json
{ "sourceKeys": ["userId", "anonymousId"], "destKey": "external_ids_sha256" }
```

Not the pattern: `facebook_conversions`' broad chain
(`userId`, `traits.userId`, `traits.id`, `context.traits.userId`, `context.traits.id`, `anonymousId` —
`src/v0/destinations/facebook_conversions/data/FBCUserDataConfig.json:2-16`).

#### `deduplicationKey` goes on the event-mapping row, not the destination config

Spelled `deduplicationKey` — not `eventId`, `conversionId` or a new spelling (per `rudder-integrations-config/CONVENTIONS.md`, which doesn't cover
placement). **With an event-mapping table, it's a per-row field**: each conversion type dedupes
against the pixel on a different property (order → `properties.orderId`); one global key resolves
for one type and falls back to `messageId` (never matching the pixel) for the rest. Global only
when there's no event-mapping table. **Optional; absent or unresolved → `messageId`**; never
required or validated non-empty.

`openai_ads`: `deduplicationKey: z.string().optional()` in `OpenAIAdsEventMappingSchema` beside
`from`/`to`/`customEventName` (`types.ts:16`); `resolveEventId` falls back to `message.messageId`
(`utils.ts:547`) and throws `InstrumentationError` for a resolved non-scalar (a
misconfiguration worth surfacing); in integrations-config, a row `textInput` with
`"configKey": "deduplicationKey"`, no `required`, regex admitting empty (`^$|^[A-Za-z_]…`).

Not the pattern: `pinterest_tag`/`snapchat_conversion` have mapping tables but a global key.
`linkedin_ads` has no table, so its global key (`src/cdk/v2/destinations/linkedin_ads/procWorkflow.yaml:47`) is fine.
Fallback shape: prefer `getOneByPaths(…) ?? .messageId` (pinterest_tag, linkedin_ads) over
`deduplicationKey || 'messageId'` (snapchat_conversion — a set-but-unresolvable path yields no id).
