You are auditing partner API changes for one RudderStack integration: **{{title}}** (`{{name}}`, folder `{{dir}}`).

Today is {{today}}. Report changes published or taking effect since **{{since}}** ({{lookbackDays}}-day lookback), plus any future-dated change (sunset, deprecation, auth change) that the README below does not already record.

## What the integration uses (from its README)

The README is the record of what this integration uses. These are its audit sections, already extracted:

<readme_sections>
{{sections}}
</readme_sections>

Files you may read only when needed (for example, to check whether a changed field is mapped): {{onDemandFiles}}

## Already filed

Items already on this integration's audit tickets, as `key`: title:

{{filedItems}}

## Steps

1. Fetch the Changelog References links first (Changelog, Deprecations, Versions, Feed, Announcements). Use a feed when there is one, because entries carry dates.
2. Verify the latest version on the Versions link (or the changelog). If it differs from the README's Latest Available Version, report it.
3. Only if a needed fact is missing, fetch other links from Documentation Links or run a web search. Budget for the whole audit: at most {{maxFetches}} fetches and {{maxSearches}} searches.
4. For each relevant entry, decide whether it affects what this integration uses: auth and configuration, the endpoints and versions listed, request and response fields, limits, error handling. Open the files above only for field-level questions.

Rules:

- Don't change repository files (scratch files under `/tmp` are fine). Don't call Linear or any write API.
- Only report facts you saw on a partner page, with its URL. Never invent URLs or dates.
- Always report auth changes as `breaking`: a new or required auth method, a deprecated or removed one, and token, scope, refresh or expiry rules. Report them even for an auth method this integration doesn't use yet, because moving to it is a breaking change for the integration.
- Skip other entries about products or endpoints this integration does not use. Count them in `skipped`.
- If a source can't be fetched, list it in `unreachable` and carry on.
- Still report a change that is already filed, and set its `sameAs` to that item's key, even if you would word or categorise it differently. Set `sameAs` to null only for a change none of the filed items describes. One announcement can contain several changes: match on the change, not on the link.

## Output

End your answer with exactly one JSON object between the two marker lines below, and nothing after it.

BEGIN_FINDINGS_JSON
{
"integration": "{{name}}",
"sourcesChecked": ["<url>"],
"unreachable": ["<url>"],
"latestVersionSeen": "<version string or null>",
"skipped": 0,
"findings": [
{
"category": "version_upgrade | endpoint_lifecycle | auth | request_response_fields | new_mapping | validation_limits | new_capability | error_handling",
"impact": "breaking | version_upgrade | opportunity",
"title": "<short, specific>",
"summary": "<what changes and what in this integration it affects>",
"announcementUrl": "<url>",
"announcedOn": "<YYYY-MM-DD or null>",
"effectiveDate": "<YYYY-MM-DD, YYYY-MM or null>",
"targetVersion": "<version string, only for version_upgrade, else null>",
"affects": "<README section, endpoint or file this hits>",
"sameAs": "<key from Already filed for the same change, or null>"
}
]
}
END_FINDINGS_JSON

`effectiveDate` is when the change takes effect for an integration that does nothing: a sunset, a removal or an enforcement date. A new version's release date is not an effective date; leave it null.

`impact`: `breaking` changes or removes something we use; `version_upgrade` means a newer API version exists than the one we use; `opportunity` is a new field, mapping or capability we don't use yet. Return an empty `findings` array when nothing applies.
