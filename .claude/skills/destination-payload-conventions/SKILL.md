---
name: destination-payload-conventions
description: Conventions for building destination payloads — monetary values and ISO-4217 minor units, preserving customer data, and merge order for passthrough extras. Applied automatically — not user-invocable.
---

# Destination Payload Conventions

## Monetary values — never assume two decimal places

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

**`currency-codes` is not currently a dependency of this repo** — the first destination that
needs this has to add it to `package.json`. If you'd rather not take the dependency, a local
constant listing only the non-2 exponents (≈39 codes, defaulting everything else to 2) is a
reasonable substitute; either way the exponent must come from a table, not a literal. Both
carry the same caveat: the ISO-4217 list is static and needs refreshing when a currency
redenominates.

Notes:

- `cc.code()` returns `undefined` for an unrecognised code, so you still choose the fallback.
  Default to 2 **and log once per unrecognised currency** — a code the library doesn't know is
  either a customer typo or a currency it predates, and both are worth seeing.
- Decide explicitly what happens when a value resolves but a currency doesn't. Silently
  assuming one misattributes revenue; failing the single event surfaces it in Live Events.
- If the partner uses "micros" (currency unit × 10⁶ regardless of decimals, e.g. Google Ads),
  that is a fixed multiplier and **not** an exponent — don't route it through this.

Deliberately not fixing the call sites above in one pass: each needs its own regression
testing against the partner. Do it when you touch the destination.

## Never silently rewrite or drop customer data

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

## Passthrough extras must not overwrite payload-owned fields

When a destination forwards unmapped properties as custom data, the merge order decides who
wins. `Object.assign(payload, extras)` after setting a payload-owned field lets a customer
property silently replace it — and a discriminator like `data.type` is exactly the field that
breaks the request when it changes.

Assign extras **first** and the payload's own fields **last**, so ownership is structural
rather than dependent on a reserved-key list staying complete. A reserved-key set is still
worth having (see the `mapping-config` skill for deriving one), but it should not be the only
thing standing between `properties.type` and the payload's `type`.

```ts
// Good — the payload's own fields always win
const data = { ...buildCustomExtras(message), type: dataType, amount, currency };

// Bad — a customer's `properties.type` clobbers the discriminator
const data = { type: dataType, amount, currency };
Object.assign(data, buildCustomExtras(message));
```
