---
name: destination-payload-conventions
description: Conventions for building destination payloads — monetary values and ISO-4217 minor units, where a setting belongs (destination config vs the per-event integrations object), and PII hashing/normalisation. Applied automatically — not user-invocable.
---

# Destination Payload Conventions

Three decisions that recur in every destination and are currently made inconsistently across
the repo. Each section states what the repo actually does today, so you can tell convention
from recommendation.

## Monetary values — never assume two decimal places

**The current state of the repo is a latent bug.** Every monetary conversion multiplies by a
hardcoded 100:

- `src/v0/destinations/dub/utils.ts:60` — `Math.round(rawPayload.amount * 100)`
- `src/cdk/v2/destinations/reddit/utils.js:74`, `:81`, `:88`
- `src/cdk/v2/destinations/rakuten/utils.js:29`
- `src/cdk/v2/destinations/optimizely_fullstack/procWorkflow.yaml:196`

That is correct only for currencies with an ISO-4217 exponent of 2. **39 of 179 currencies
are not** — JPY, KRW, VND, CLP, ISK and others are zero-decimal, so `× 100` reports revenue
**100× too high**; BHD, KWD, TND and others are three-decimal, so it reports 10× too low.
For an advertising or analytics destination this silently corrupts the customer's reported
conversion value in those markets, with nothing failing and no error to trace.

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

Notes:

- `cc.code()` returns `undefined` for an unrecognised code, so you still choose the fallback.
  Default to 2 **and log once per unrecognised currency** — a code the library doesn't know is
  either a customer typo or a currency it predates, and both are worth seeing.
- Decide explicitly what happens when a value resolves but a currency doesn't. Silently
  assuming one misattributes revenue; failing the single event surfaces it in Live Events.
- If the partner uses "micros" (currency unit × 10⁶ regardless of decimals, e.g. Google Ads),
  that is a fixed multiplier and **not** an exponent — don't route it through this.

Deliberately not fixing the four call sites above in one pass: each needs its own regression
testing against the partner. Do it when you touch the destination.

## Where a setting belongs — config vs the per-event `integrations` object

Both channels exist. Destination config (`destination.Config`) is set once in the dashboard;
the per-event `integrations` object (`getIntegrationsObj(message, '<dest>')`, used by ~45
destinations) is set by the customer per call. Neither is wrong — the mistake is **exposing
the same setting through both**.

- **A stable, destination-wide choice → config only.** Channel/`action_source` defaults,
  API version, default currency. A per-event override on top of a config default gives two
  places to set one value and two places to look when it's wrong, and the precedence between
  them becomes undocumented behaviour the customer discovers by experiment.
- **A genuinely per-event fact → `integrations` object only.** Consent/suppression flags for
  a specific event, an event-specific test id, a value only the caller knows. There is no
  sensible dashboard default for these.
- **Neither, if a message field already carries it.** Don't invent an override for something
  `properties` / `context` already expresses.

When you find yourself writing `integrationsObj.x ?? Config.x ?? derive()`, that three-step
chain is the smell — decide which of the two the setting actually is.

## PII hashing

The partner almost always wants SHA-256 of a **normalised** value: trimmed and lowercased
before hashing, emitted as a lowercase 64-char hex string. Normalising after hashing, or not
at all, produces a different digest for `Foo@Bar.com ` and `foo@bar.com` and quietly halves
the match rate. `src/cdk/v2/destinations/reddit/utils.js:191` hashes the raw string — don't
copy it. `src/v0/destinations/snapchat_conversion/transformV3.js:55` normalises first.

**Handling already-hashed input — the repo is split.** ~17 destinations expose a config
toggle (`hashData` / `isHashRequired` / `hashUserProperties`) telling the destination the
customer is sending pre-hashed values. Two detect it instead, testing `/^[\da-f]{64}$/i` and
passing a match through unchanged (`snapchat_conversion/util.js:28`).

The toggle is the majority pattern, so it is not wrong to follow it. Prefer **detection**
when the partner's contract forbids raw identifiers outright — a mis-set toggle then leaks
plaintext PII to the partner, whereas detection is correct in both directions and needs no
config. Detection's cost is that a 64-hex value that *isn't* a digest passes through unhashed;
in practice nothing else looks like that.

For audience-style records there is already a shared implementation — `HASHING_CONFIG` /
`processAudienceRecord` in `src/v0/util/audienceUtils.ts`, which does normalise → validate →
hash-if-not-already-hashed for SHA-256/SHA-512/MD5. Seven destinations use it
(`custom_audience`, `fb_custom_audience`, `google_adwords_enhanced_conversions`,
`google_adwords_remarketing_lists`, `iterable_audience`, `linkedin_audience`). Reuse it if it
fits; mirror it rather than reinventing the regex if it doesn't.

Finally: log counts and identifiers, never the values. A SHA-256 email is still a stable
cross-site identifier — logging the digest defeats the hashing.
