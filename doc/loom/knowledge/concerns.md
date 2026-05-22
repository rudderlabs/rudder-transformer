# Concerns & Technical Debt

> Technical debt, warnings, issues, and improvements needed.
> This file is append-only - agents add discoveries, never delete.

(Add concerns as you discover them)

## MAX_BATCH_SIZE unverified against Iterable docs

Iterable's documented per-request maximum for `/api/lists/subscribe` and `/api/lists/unsubscribe` is listed as 1000 in the LLD. This has not been sandbox-verified against the live API. Start with 1000 and tune during beta if real traffic surfaces 413 or 429 errors.

## Sync auto-disable on 401/404 — out of M1 scope

The PRD requires audit-logged sync auto-disable on persistent 401 (bad/revoked API key) and 404 (list deleted). This is NOT a current platform feature — it requires platform-level machinery outside this destination's scope. M1 surfaces the errors in per-record status codes and the sync status dashboard; the customer/admin disables the sync manually. Tracked as a separate platform-level improvement.

## createList name-conflict behavior undocumented

Iterable's error response shape for duplicate list name is not specified in the OpenAPI spec. The `setup` handler (integrations-info) should sandbox-test and surface a friendly UI error. Expected to be a 400 with a descriptive `msg`, but not confirmed.

## failedUpdates.invalidDataEmails always empty for M1

`invalidDataEmails` / `invalidDataUserIds` capture failures from invalid `dataFields` on the user profile. M1 sends identifier-only payloads (no `dataFields`). These arrays should always be empty in M1 traffic. The reused `createBatchErrorChecker` still parses them defensively; they are classified as 400 errors if they unexpectedly appear.

## Per-project rate limits not published

Iterable does not publicly document per-project rate limits for list subscribe/unsubscribe endpoints. Framework-level 429 backoff is the default mitigation. If real traffic surfaces persistent 429 errors, investigate per-project limits with Iterable support.
