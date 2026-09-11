---
name: event-transformation
description: Business logic for turning one RudderStack event into one destination payload — the standard mapping JSON shape and constructPayload, resolving source values, ISO-4217 minor units, preserving customer data, and assembling the payload, plus category conventions for ads destinations (identity match fields, deduplication keys). Applied automatically — not user-invocable.
---

# Event Transformation

**Objective:** everything involved in turning a single RudderStack event into a single
destination payload — where each value comes from, how it is resolved, what you are allowed to
do to it, and how the final object is assembled.

The governing idea: **field plucking is *data*, not code.** A destination's source-field →
destination-field mapping belongs in `data/<DEST_UPPER>Config.json` in the repo-standard shape,
consumed by `constructPayload`. Only genuinely custom transformation — hashing, unit
conversion, partner-specific validation — is written as TypeScript.

`src/v0/destinations/openai_ads/` is the current worked example: mapping JSON in
`data/OPENAI_ADSConfig.json`, `constructPayload` in `utils.ts`, and only the hashing,
amount/currency and content-item validation left in code.

Everything up to **Category Conventions** applies to every destination. That last section
holds rules that bind only one class of destination — read the subsection for what you are
building and skip the rest. A rule sits there because it is wrong or meaningless outside its
category, not because it is optional inside it.

## The Standard Mapping Shape

A mapping file is an array of entries. `constructPayload(message, mappingJson)`
(`src/v0/util/index.js:1081`) walks it and builds the payload.

```json
[
  {
    "sourceKeys": ["traits.emails", "context.traits.emails", "traits.email"],
    "destKey": "emails_sha256"
  },
  { "sourceKeys": "event", "destKey": "type", "required": true },
  {
    "sourceKeys": ["timestamp", "originalTimestamp"],
    "destKey": "timestamp_ms",
    "metadata": { "type": "timestamp" }
  }
]
```

- **`sourceKeys`** — a dot path, or an array of dot paths tried **in precedence order**.
- **`destKey`** — set via `lodash.set`, so `"data.amount"` nests.
- **`required: true`** — `constructPayload` throws
  `InstrumentationError("Missing required value from ...")` when nothing resolves. Use this
  instead of a downstream presence check and a hand-written throw.
- **`metadata: { type: "timestamp" }`** — routes the value through `formatTimeStamp`, which
  with no `typeFormat` returns `date.getTime()` — epoch **milliseconds**
  (`src/v0/util/index.js:398-406`). This replaces a bespoke timestamp resolver entirely; most
  CAPI destinations want exactly this for a `timestamp_ms` field.

Do **not** invent a bespoke config shape (`userFields`, `contentSourcePaths`,
`clickIdPaths`, …). A custom shape forces a hand-written config type, a resolver function per
field group, and a hand-maintained parallel list of "keys we already mapped" — all of which
disappear when the config is a standard mapping array.

### Mapping individual array items

For a repeated object (line items, products, contents), call `constructPayload` once per
element with an item-level mapping. Precedent: `src/v0/destinations/ga4/utils.js:215,254` and
`src/v0/destinations/ometria/util.js:28,43`.

```ts
const contents = rawContents.map((item) => constructPayload(item, MAPPING.contentMappings));
```

## `constructPayload` Sets Only What It Finds

The write is guarded: `if (value || value === 0 || value === false)` then
`lodash.set(payload, destKey, value)` (`src/v0/util/index.js:1136-1139`). Three consequences
worth knowing before you rely on them:

- **Empty strings never land.** `''` is falsy and is not one of the two exceptions, so a
  `destKey` whose source resolves to `''` is simply absent from the payload.
- **`false` and `0` do land.** A boolean or numeric field is safe to map declaratively.
- **Two entries with the same `destKey` act as a precedence chain** — later entries only
  overwrite when they resolve. This *works*, but it reads like a copy-paste accident and the
  behaviour depends on array order. **Collapse duplicate `destKey`s into one entry with the
  union of the source keys**, ordered by precedence.

`constructPayload` performs **no type validation**. A field declared as an object in your
payload type (`Record<string, unknown>`) will happily receive a scalar from the event. If the
emitted shape must match a declared type, guard it after the call.

```ts
// Good — the mapping plucks it, the code guarantees its shape
const item = constructPayload(raw, MAPPING.contentMappings);
if (!isPlainObject(item.variant_dict)) delete item.variant_dict;

// Bad — `variant_dict` is typed Record<string, unknown> but a scalar reaches the wire
const item = constructPayload(raw, MAPPING.contentMappings);
```

## Use `getValueFromMessage`, Not a Hand-Rolled First-Of-N Helper

`getValueFromMessage(message, sourceKeys)` (`src/v0/util/index.js:647`) already takes an array
of paths and returns the first usable value. Do not write `getFirstValue` /
`getFirstDefinedValue` / `firstScalar` variants of it.

Two behaviours to be deliberate about:

- **It logs on single-element arrays.** `sourceKeys.length === 1` triggers
  `logger.warn('List with single element is not ideal. Use it as string instead')` — on
  *every event*. A one-path mapping entry must use a bare string, not a one-element array.
- **Its usability test is `val || val === false || val === 0`.** So it skips `''` and falls
  through to the next path, and returns `null` when nothing matches. It never returns `''` —
  don't write downstream `!== ''` checks, they are dead code.

## `sourceFromGenericMap` — Check What It Expands To First

`sourceFromGenericMap: true` resolves `sourceKeys` through
`src/v0/util/data/GenericFieldMapping.json` instead of treating them as paths. It removes real
duplication, but **the expansion is large and not always what you want** — verify the entry
before using it.

The trap: an earlier review round removes `*.zip` paths from a postal-code mapping; a later
round "simplifies" it to `sourceFromGenericMap: true` with `sourceKeys: "zipcode"` — and
silently reinstates them, because `zipcode` expands to 28 paths including `traits.zip`,
`traits.zipCode`, `traits.address.zip_code` and the `context.traits.*` mirrors.

Entries that commonly surprise:

| Generic key                | Expands to something wider than the name suggests                                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zipcode`                  | 28 paths — every `zip` / `zipcode` / `zip_code` / `zipCode` / `postalcode` / `postal_code` / `postalCode` spelling under `traits`, `traits.address` and the `context.traits` mirrors |
| `email`                    | includes `properties.email` **and** `context.externalId.0.id`                                                                                                   |
| `phone`                    | includes `properties.phone`                                                                                                                                     |
| `city`                     | **only** `traits.address.city` / `context.traits.address.city` — not `traits.city`                                                                              |
| `firstName` / `lastName`   | singular forms only, in three casings; no plural (`firstNames`) forms                                                                                           |

So: `region` and `country` are safe (`traits.region` / `traits.country` and their
`context.traits` mirrors, nothing else), while `zipcode`, `email` and `phone` pull in paths a
destination often should not read. If the generic map is wider or narrower than the partner
spec, list the paths explicitly instead — and if the destination field is a **plural array**,
you need explicit plural source keys regardless, because the generic map carries only the
singular forms.

## Don't Guess Source Paths

Every path in a mapping file is a claim that the partner reads that field from there. Adding
`traits.state` to a `regions` mapping, or `traits.countryCode` to `countries`, because they
"look related" ships wrong values to the partner with nothing failing. Map only what the spec
or the partner's docs name, and let the field be absent otherwise.

## Presence Checks: Know What The Shared Helpers Actually Do

Two helpers in `src/v0/util/index.js` are routinely misapplied. Both are one-liners over
lodash, and both have a sharp edge.

**`isDefinedAndNotNullAndNotEmpty` is `lodash.isEmpty`-based, so it rejects every number and
every boolean.** `lodash.isEmpty(1)` is `true` — numbers have no length and no own enumerable
keys. Using it as a general presence check silently drops `quantity: 1` and `amount: 0`.

```ts
// Good — use it only for strings, arrays and objects
if (isDefinedAndNotNullAndNotEmpty(rawContents)) { /* skip empty contents[] */ }

// Bad — `quantity: 1` is dropped, with no error
if (isDefinedAndNotNullAndNotEmpty(quantity)) payload.quantity = quantity;
```

For numbers, booleans and "any scalar the partner accepts", use `isDefinedAndNotNull`
(`x !== undefined && x !== null`) or a single local `isPresent` predicate — and use **one**
predicate throughout a file. Four divergent spellings of the same idea in one module is a
review finding on its own.

**`removeUndefinedAndNullValues` is `lodash.pickBy(obj, isDefinedAndNotNull)`**
(`src/v0/util/index.js:60`), so it **preserves `false` and `0`**. That makes it the safe way to
replace a stack of conditional spreads with one flat object literal:

```ts
// Good — flat and readable; `opt_out: false` survives
return removeUndefinedAndNullValues({
  id, type, timestamp_ms, oppref, source_url, opt_out, data,
});

// Bad — five conditional spreads for the same result
return {
  id, type, timestamp_ms,
  ...(oppref ? { oppref } : {}),
  ...(sourceUrl ? { source_url: sourceUrl } : {}),
  ...(optOut !== undefined ? { opt_out: optOut } : {}),
  ...(data ? { data } : {}),
};
```

Its sibling `removeUndefinedAndNullAndEmptyValues` does **not** preserve them — it adds
`isNotEmpty`, inheriting the `lodash.isEmpty` behaviour above. Don't reach for it reflexively.

One caveat when a required field can be absent: `removeUndefinedAndNullValues` will strip it,
and the request goes out silently missing a field the API requires. Validate required fields
before this call (or map them with `required: true`), rather than letting them disappear.

## Monetary Values — Never Assume Two Decimal Places

**The current state of the repo is a latent bug.** Every monetary conversion multiplies by a
hardcoded 100:

- `src/cdk/v2/destinations/reddit/utils.js:74`, `:81`, `:88`
- `src/cdk/v2/destinations/rakuten/utils.js:29`
- `src/cdk/v2/destinations/optimizely_fullstack/procWorkflow.yaml:196`

Those three are unconditional. `src/v0/destinations/dub/utils.ts:60` also multiplies by 100,
but only behind the customer-set `convertAmountToCents` flag, and dub's own field doc already
carries the caveat (`src/v0/destinations/dub/types.ts:90-92`) — so it is opt-in and documented
rather than silently wrong. Don't treat it as the pattern to copy either.

Multiplying by 100 is correct only for currencies with an ISO-4217 exponent of 2, and **39 of
the 179 currencies in the ISO-4217 table are not** (count taken from the `currency-codes`
package's table, not from this repo). JPY, KRW, VND, CLP and ISK are zero-decimal, so `× 100`
reports revenue **100× too high**; BHD, KWD and TND are three-decimal, so it reports 10× too
low. For an advertising or analytics destination this silently corrupts the customer's
reported conversion value in those markets, with nothing failing and no error to trace.

There is no shared helper in the repo (the only trace is a comment at
`src/v0/destinations/dub/types.ts:92`). For new work, resolve the exponent from a real
ISO-4217 source rather than a literal:

```ts
import cc from 'currency-codes'; // MIT, 179 currencies, exposes `digits`
const DEFAULT_EXPONENT = 2;
const exponent = (code?: string) => cc.code(code ?? '')?.digits ?? DEFAULT_EXPONENT;
const toMinorUnits = (value: number, currency?: string) =>
  Math.round(value * 10 ** exponent(currency));
```

**`currency-codes` is a dependency of this repo** (`package.json:79`, `^2.2.0`) — `openai_ads`
added it, so no new dependency is needed. The ISO-4217 list is static and needs refreshing
when a currency redenominates.

That snippet is the minimum shape. The worked reference is
`src/v0/destinations/openai_ads/utils.ts:377` (`toMinorUnits`), which scales the decimal string
with `BigInt` rather than multiplying a float — worth copying when the partner accepts only an
exact integer, since `value * 10 ** exponent` inherits float error. It also bounds the input
length before `BigInt` parses a customer-controlled digit string, rounds half-away-from-zero
instead of dropping the event over a fraction of a cent, and keeps negative amounts (a refund
is a conversion with a negative value).

Notes:

- `cc.code()` returns `undefined` for an unrecognised code, so you still choose the fallback.
  Default to 2 **and log once per unrecognised currency** — a code the library doesn't know is
  either a customer typo or a currency it predates, and both are worth seeing. `openai_ads`
  makes the opposite call and throws an `InstrumentationError`; either is defensible, but
  decide it deliberately rather than by omission.
- Decide explicitly what happens when a value resolves but a currency doesn't. Silently
  assuming one misattributes revenue; failing the single event surfaces it in Live Events.
- If the partner uses "micros" (currency unit × 10⁶ regardless of decimals, e.g. Google Ads),
  that is a fixed multiplier and **not** an exponent — don't route it through this.

Deliberately not fixing the call sites above in one pass: each needs its own regression
testing against the partner. Do it when you touch the destination.

## Never Silently Rewrite or Drop Customer Data

A transformer's job is to map the customer's event onto the partner's schema, not to clean it
up. When you normalize, reformat or discard a value the customer deliberately sent, the change
is invisible: nothing fails, no error reaches Live Events, and the partner receives something
the customer never sent. Pass values through and let the partner's API validate them.

Three shapes this takes, all of them easy to add and hard to notice:

- **Trimming everywhere.** Trim belongs *only* inside hash normalizers, where a stray space
  changes the digest. Applying a `trimString` helper to event names, dot-path values, URLs and
  content fields rewrites customer data at every call site — and, because the helper doubles as
  a truthiness check, makes the value-resolution path harder to follow than a plain lookup.
- **Re-serialising URLs.** Parsing a customer's URL through `new URL()` just to strip
  `search`/`hash` and re-serialise also lowercases the host, adds a trailing slash and drops a
  default port. Return the raw value.
- **"Sanitising" custom properties.** A recursive walk that drops empty strings, non-finite
  numbers, empty arrays/objects and anything non-plain deletes data the customer chose to send.

The exception is a documented partner requirement — hashing, minor-unit conversion, or an enum
the API rejects otherwise. Those are transformations you can point at a spec for.

```ts
// Good — resolve, then hand it over untouched
const sourceUrl = getValueFromMessage(message, MAPPING.sourceUrlPaths);

// Bad — silently normalizes the customer's URL
const sourceUrl = (() => {
  try {
    const u = new URL(raw);
    u.search = '';
    u.hash = '';
    return u.toString();
  } catch {
    return undefined;
  }
})();
```

Where the partner *does* require a normalized form, apply it **consistently**. If a file trims
and lowercases one enum before comparing it, every other enum comparison in that file should do
the same — an `action_source` matched case-sensitively rejects a perfectly ordinary `'Web'` and
drops the event, purely because it was the one string nobody normalized.

## Passthrough Extras Must Not Overwrite Payload-Owned Fields

When a destination forwards unmapped properties as custom data, the merge order decides who
wins. `Object.assign(payload, extras)` after setting a payload-owned field lets a customer
property silently replace it — and a discriminator like `data.type` is exactly the field that
breaks the request when it changes.

Assign extras **first** and the payload's own fields **last**, so ownership is structural
rather than dependent on a reserved-key list staying complete. A reserved-key set is still
worth having (see below), but it should not be the only thing standing between
`properties.type` and the payload's `type`.

```ts
// Good — the payload's own fields always win
const data = { ...buildCustomExtras(message), type: dataType, amount, currency };

// Bad — a customer's `properties.type` clobbers the discriminator
const data = { type: dataType, amount, currency };
Object.assign(data, buildCustomExtras(message));
```

## Reserved-Key Sets Must Be Scoped To The Object Being Filtered

A destination that forwards unmapped event properties as custom data needs a set of keys to
*exclude* — the ones already mapped. Derive that set from the mapping config so it cannot
drift, but **scope it to the object the passthrough actually reads**.

A custom-extras builder that iterates `message.properties` can only ever collide with the
direct children of `properties`. Trait paths, message-level fields and item-level keys address
different objects and can never collide — including them silently deletes the customer's data.

```ts
// Good — only `properties.`-rooted source paths contribute a reserved key
const PROPERTIES_PREFIX = 'properties.';
const RESERVED = new Set(
  Object.values(MAPPING)
    .flatMap(sourceKeysOf)
    .flatMap((keys) =>
      (Array.isArray(keys) ? keys : [keys])
        .filter((p) => p.startsWith(PROPERTIES_PREFIX))
        .map((p) => p.slice(PROPERTIES_PREFIX.length).split('.')[0]),
    ),
);

// Bad — walks every group and takes the last path segment. Reserves item-level field
// names (`id`, `name`, `type`, `sku`, `price`, `quantity`) and trait leaves, so a custom
// event sending `properties.id` or `properties.name` loses them with no error.
const RESERVED = new Set(Object.values(MAPPING).flatMap(lastSegmentOf));
```

Restructuring the JSON to separate message-relative paths from item-level keys does *not* fix
this on its own — `context.externalId.0.id` is message-domain and still contributes an `id`
leaf. The prefix filter is what fixes it. Cover it with a component-test fixture: a custom
event carrying `properties.id` / `properties.name` must pass them through.

## Category Conventions

Everything above applies to every destination. What follows does not.

### Ads Destinations

Scope: conversion / offline-event APIs where we send server-side events for ad attribution —
`openai_ads`, `facebook_conversions`, `pinterest_tag`, `linkedin_ads`, `snapchat_conversion`,
`reddit`, the Google Ads conversion destinations. **Not** CRMs or marketing platforms that
maintain user profiles (Braze, HubSpot, Customer.io), and **not** audience/RETL sync
destinations — both have identity models that these two rules would actively break.

`src/v0/destinations/openai_ads/` is the reference implementation for both.

#### A partner field named `external_id` is not RudderStack's `externalId`

The names collide; the concepts are unrelated. Establish which one you are looking at *before*
writing the mapping.

For an ads destination, map the partner's identifier field from top-level **`userId`, falling
back to `anonymousId`** — and nothing else
(`src/v0/destinations/openai_ads/data/OPENAI_ADSConfig.json:26-27`):

```json
{ "sourceKeys": ["userId", "anonymousId"], "destKey": "external_ids_sha256" }
```

**Precedent that is not the pattern:** `facebook_conversions` maps `external_id` from
`["userId", "traits.userId", "traits.id", "context.traits.userId", "context.traits.id",
"anonymousId"]` (`src/v0/destinations/facebook_conversions/data/FBCUserDataConfig.json:2-16`).
It is an older integration with a deliberately broad fallback chain. Don't copy it into a new
destination.

#### `deduplicationKey` goes on the event-mapping row, not the destination config

The config key is spelled **`deduplicationKey`** — not `eventId`, `conversionId`, or a new
spelling. That much matches `rudder-integrations-config/CONVENTIONS.md`. What follows is about
*where the field lives*, which that document does not cover.

**If the destination config has an event-mapping table, `deduplicationKey` is a field on each
row.** Ads partners dedupe server events against a browser pixel per conversion type, and the
field carrying the shared id differs per event — an order dedupes on `properties.orderId`, a
signup on something else. One global key forces every event through a single path, so it
resolves for one event type and silently falls back to `messageId` for the rest, which never
matches the pixel. A global key is right only when the destination has no event-mapping table.

**It is optional, and absent-or-unresolved means `messageId`.** Never required, never validated
as non-empty.

`openai_ads` implements exactly this:

- `deduplicationKey: z.string().optional()` inside `OpenAIAdsEventMappingSchema`, alongside
  `from`, `to` and `customEventName` (`src/v0/destinations/openai_ads/types.ts:16`).
- `resolveEventId` resolves the row's dot path against the message and falls back to
  `message.messageId` when the key is unset or the path yields nothing
  (`src/v0/destinations/openai_ads/utils.ts:531-542`).
- In `integrations-config`, a `textInput` inside the event-mapping row with
  `"configKey": "deduplicationKey"`, no `required`, and a regex admitting the empty string
  (`^$|^[A-Za-z_]…`) so clearing it stays valid.

A resolved-but-non-scalar value throws an `InstrumentationError` there rather than falling back
silently: a customer pointing the key at an object is a misconfiguration worth surfacing, not
worth papering over with `messageId`.

**Precedent that is not the pattern:** `pinterest_tag` and `snapchat_conversion` both have
event-mapping tables (`eventsMapping`, `rudderEventsToSnapEvents`) *and* keep
`deduplicationKey` global — that is the shape this rule moves away from, not an exception to
it. `linkedin_ads` has no event-mapping table, so its global key
(`src/cdk/v2/destinations/linkedin_ads/procWorkflow.yaml:47`) is fine as it stands.

Watch the fallback shape if you copy from the older ones. `pinterest_tag` and `linkedin_ads`
use `getOneByPaths(…) ?? .messageId`, which falls back when the config is unset *or* no path
resolves. `snapchat_conversion` uses `deduplicationKey || 'messageId'`, so a set-but-
unresolvable path yields no id at all rather than `messageId`. Prefer the first.
