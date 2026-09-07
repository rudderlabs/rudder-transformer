---
name: mapping-config
description: Declarative field mapping for destinations — the standard mapping JSON shape, constructPayload, getValueFromMessage, sourceFromGenericMap, and the presence-check semantics of the shared util helpers. Applied automatically — not user-invocable.
---

# Mapping Config

**Objective:** field plucking is *data*, not code. A destination's source-field →
destination-field mapping belongs in `data/<DEST_UPPER>Config.json` in the repo-standard shape,
consumed by `constructPayload`. Only genuinely custom transformation — hashing, unit
conversion, partner-specific validation — is written as TypeScript.

`src/v0/destinations/openai_ads/` is the current worked example: mapping JSON in
`data/OPENAI_ADSConfig.json`, `constructPayload` in `utils.ts`, and only the hashing,
amount/currency and content-item validation left in code.

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

| Generic key | Expands to something wider than the name suggests |
|---|---|
| `zipcode` | 28 paths — every `zip` / `zipcode` / `zip_code` / `zipCode` / `postalcode` / `postal_code` / `postalCode` spelling under `traits`, `traits.address` and the `context.traits` mirrors |
| `email` | includes `properties.email` **and** `context.externalId.0.id` |
| `phone` | includes `properties.phone` |
| `city` | **only** `traits.address.city` / `context.traits.address.city` — not `traits.city` |
| `firstName` / `lastName` | singular forms only, in three casings; no plural (`firstNames`) forms |

So: `region` and `country` are safe (`traits.region` / `traits.country` and their
`context.traits` mirrors, nothing else), while `zipcode`, `email` and `phone` pull in paths a
destination often should not read. If the generic map is wider or narrower than the partner
spec, list the paths explicitly instead — and if the destination field is a **plural array**,
you need explicit plural source keys regardless, because the generic map carries only the
singular forms.

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

## Don't Guess Source Paths

Every path in a mapping file is a claim that the partner reads that field from there. Adding
`traits.state` to a `regions` mapping, or `traits.countryCode` to `countries`, because they
"look related" ships wrong values to the partner with nothing failing. Map only what the spec
or the partner's docs name, and let the field be absent otherwise.
