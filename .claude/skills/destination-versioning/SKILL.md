---
name: destination-versioning
description: Shipping a new integration major (v1 → v2 of a destination's config and API) — read `destination.version` through `getDestinationVersion` and branch inside the destination's own code. Use when a destination gains a new major, or when code reads `destination.version` / `destinationVersion`. A brand-new destination is v1 and needs none of this.
---

# Dispatching on the integration major (`destination.version`)

A destination can ship multiple **integration majors** (e.g. v1 → v2 of its config + API). The control plane stamps the major on the destination and the data plane **carries** it to the transformer — there is no up-conversion (stored shape = delivered shape = processed shape). Your job is to read that major and branch on it **inside your own destination's code**.

> **Terminology trap.** Three unrelated "versions" exist — do not conflate them:
> - **integration major** — `destination.version` (a number; `destinationVersion` on the proxy payload). **This is the axis you branch on.**
> - **transformer architecture version** — the `src/v0` / `v1` / `v2` directory (`getDestHandler`'s `version` argument, the `version: 'v0'` field in component tests). Unrelated.
> - **REST request-config version** — `version: '1'` inside `defaultRequestConfig()` / the proxy request shape. Unrelated.

**The idiom — an in-file inline branch, by default.** At the top of your entry `process`, branch on `getDestinationVersion(event.destination.version)`. Keep the existing v1 logic in place and factor shared logic into `utils.ts`:

```ts
import { getDestinationVersion } from '../../../util/utils';

const V2_MAJOR = 2;

const process = (event) => {
  // getDestinationVersion normalizes the raw major (0 / undefined / non-numeric -> 1, fractions
  // truncated), so 0 / undefined / 1 all run the existing v1 path (defensive) and metrics never
  // see a bogus destVersion=0.
  const major = getDestinationVersion(event.destination.version);
  if (major >= V2_MAJOR) {
    return processV2(event); // new major
  }
  return processV1(event); // existing v1 logic, unchanged
};
```

- **Normalize with `getDestinationVersion(...)` (`src/util/utils.js`); read `destination.version`, never `Config.apiVersion`.** The raw major is a number that may be absent on routes that don't carry it. `getDestinationVersion` maps `0` / `undefined` / non-numeric to `1` and truncates fractions to a whole integer, so `0`, `undefined`, and `1` all behave identically (v1) and dashboards never see `destVersion=0`. Branching on the bare `Number(event.destination.version)` skips this normalization — always go through the helper.
- **Shared logic lives in `utils.ts`**; v1 stays where it is. Until a destination ships a new major, every destination is v1 and runs exactly as today.
- **Escalate to a sibling module only on large divergence.** If the v2 branch grows large, move it to a sibling module following the existing repo convention (`transformV2.ts` / `<dest>Transform-v2.ts`, as Klaviyo/HubSpot/TikTok/Snapchat do). **Prefer a sibling module over `./v1` / `./v2` subdirectories** — no destination uses subdirs today, so they fragment the layout — but they aren't strictly off-limits if a major is large enough to warrant its own tree. The entry `transform` stays the dispatcher either way.
- **Branch `routerTransform`, `deleteUsers`, and the proxy/delivery handler only when a major actually changes them.** Most majors only touch `transform`.
- **The proxy / dataDelivery route has no destination object** — the major arrives as a top-level **`destinationVersion`** on the proxy request payload. Read it there (e.g. in `networkHandler`'s `proxy`/`responseHandler`), not `destination.version`.
- **Never route integration majors through `getDestHandler`.** That argument is the architecture version; routing majors there would explode the directory matrix.

See `src/v0/destinations/test_destination` for a worked, dev-only example exercising this idiom across `process` and `networkHandler`. Its router runs through the native batching framework (`routerTransform.ts`), which reuses `process`, so the major dispatch lives in one place rather than a separate `processRouterDest`.
