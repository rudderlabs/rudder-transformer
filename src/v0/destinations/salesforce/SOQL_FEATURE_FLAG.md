# SOQL Lookup Feature Flag — `DEST_SALESFORCE_SOQL_SKIP_WORKSPACE_IDS`

## What it does

The environment variable `DEST_SALESFORCE_SOQL_SKIP_WORKSPACE_IDS` is a comma-separated list of workspace IDs that are excluded from the SOQL-based SDK lookup path. These workspaces fall back to the older parameterized REST search (`/services/data/vXX/parameterizedSearch/`).

The gating logic lives in `isWorkspaceAndDestTypeSupportedForSoql` in `utils.js`.

## Why this feature flag exists

When we migrated from parameterized REST search to SOQL-based lookups, some existing `SALESFORCE_OAUTH` workspaces started failing. The root cause: customers had configured lookup fields with mismatched data types. For example, a numeric value was provided for a field whose actual Salesforce data type is string. The SOQL query is strict about types and rejects these, whereas the parameterized REST endpoint is lenient and handles the mismatch silently.

### Why we did not fix the type mismatch in code

We considered fetching the field's actual data type from Salesforce metadata and casting/converting the value accordingly before building the SOQL query. We decided this is overkill given the scope of the problem — it only affects a subset of pre-existing customers whose configurations predate the SOQL feature.

### Why this only affects existing customers

New customers onboarding to `SALESFORCE_OAUTH` destinations get SOQL lookups by default. If their field types are misconfigured, they see the error immediately during setup and can fix it. The issue is isolated to older workspaces that were set up before SOQL enforcement, so their misconfigured fields only surface when we remove them from the skip list.

## How to use

Add workspace IDs (comma-separated) to the `DEST_SALESFORCE_SOQL_SKIP_WORKSPACE_IDS` environment variable:

```
DEST_SALESFORCE_SOQL_SKIP_WORKSPACE_IDS=ws-abc123,ws-def456
```

## When can this be removed?

This feature flag can be removed once all workspaces in the skip list have either:
1. Fixed their lookup field data types in Salesforce, or
2. Been confirmed as inactive/decommissioned.
