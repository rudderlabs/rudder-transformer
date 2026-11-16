# Audit Sections Format

The integration audit workflow parses two README sections by heading and by bullet label: `## Version Information` and `### Changelog References`. Write them exactly in this format so the parser gets the same answer every time.

## Rules

- Use the headings and bold labels exactly as shown, in the order shown. Don't rename, merge or skip a label.
- Every label gets a value. When something doesn't exist, use the fixed word for that label (`None found`, `Not versioned`, `None announced`, `Unknown`). `None found` means you searched and it doesn't exist.
- Values are facts with a source: a Markdown link, a code path, or a date in `YYYY-MM-DD`. Don't write "recently", "soon" or "early 2025" without the source link that says it.
- Every URL must open (check it). Don't invent or guess URLs. A URL that blocks automated requests can stay if you confirmed it through search; add `(blocks automated requests)` after it.
- Use `NEEDS REVIEW` only for a fact you couldn't confirm, after the bullets, never in place of a bullet value.
- Free text is allowed below the bullets of a subsection, for context such as breaking changes between versions.

## Version Information

```markdown
## Version Information

### Current Version

- **Version:** `v3`
- **Where in code:** `config.js` (`BASE_ENDPOINT`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [API versioning](https://example.com/docs/versioning)

### Latest Available Version

- **Version:** `v4`
- **Released:** 2026-07-15
- **Upgrade needed:** Yes
- **Source:** [Release notes](https://example.com/docs/release-notes)
```

| Label | Allowed values |
|---|---|
| Version | The version string in backticks, or `Unversioned` when the API has no version |
| Where in code | File path and constant or function where the version or endpoint is set |
| Status | `Supported`, `Deprecated`, `Sunset` or `Unknown` |
| Sunset date | `YYYY-MM-DD` or `None announced` |
| Released | `YYYY-MM-DD` or `Unknown` |
| Upgrade needed | `Yes` or `No` (`No` when we're on the latest version or the API is unversioned) |
| Source | Link to the page that states the status, date or latest version |

If the destination calls several APIs with different versions (for example a REST API and an events API), repeat the bullets under each subsection once per API, each group starting with `- **API:** <name>`.

## Changelog References

`### Changelog References` sits under `## Documentation Links`.

```markdown
### Changelog References

- **Changelog:** [Developer changelog](https://example.com/changelog)
- **Deprecations:** [Deprecated APIs](https://example.com/docs/deprecations)
- **Versions:** [API versions and sunset dates](https://example.com/docs/versioning)
- **Feed:** [Changelog RSS](https://example.com/changelog/rss.xml)
- **Announcements:** [OAuth required from 2027-04-30](https://example.com/blog/oauth)
- **Last checked:** 2026-11-16
```

| Label | What to link | When there is none |
|---|---|---|
| Changelog | Developer or API changelog. If the partner has none, its product release notes. | `None found` |
| Deprecations | Deprecations, API lifecycle or breaking-changes page | `None found` |
| Versions | Page listing API versions with release and sunset dates | `Not versioned` (API has no versions) or `None found` |
| Feed | RSS or Atom feed for the changelog, release notes or developer blog | `None found` |
| Announcements | Specific posts about auth changes, deprecations or sunsets that affect this integration | `None found` |
| Last checked | Date these links were last checked | Always set |

A label may hold several links, separated by `; `. Link to stable index pages (all-years changelog), not to a single year or month, unless the partner only has those.
