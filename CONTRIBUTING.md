# Contributing to RudderStack

Thanks for taking the time and for your help improving this project!

## Getting Help

If you have a question about rudder or have encountered problems using it,
start by asking a question on [Slack][slack].

## Rudder Labs Contributor Agreement

To contribute to this project, we need you to sign to [Contributor License Agreement (“CLA”)][cla] for the first commit you make. By agreeing to the [CLA][cla]
we can add you to list of approved contributors and review the changes proposed by you.

## Installing and Setting Up rudder-transformer

See the project's [README](README.md) for further information about working in this repository.

```bash
nvm use            # Node version from .nvmrc
npm run setup      # npm ci
npm run build:start
```

## Submitting a Pull Request

1. For an improvement or a bug fix, open an [issue][issue] describing the change first. For a new
   integration, share an [integration plan][integration-plan] with the RudderStack team before
   writing code.
2. Fork this repo, develop and test your change.
3. Open a pull request against the `develop` branch, with instructions on how to test it.
4. A maintainer reviews it. Because GitHub withholds secrets from fork PRs, a maintainer lands
   your PR through a branch in this repo, where the full CI runs; your commits and authorship
   are kept.

### Committing

Commit messages and PR titles follow conventional commits: `type(scope): description`, for
example `feat(my_destination): add identify support`. The allowed types are a closed list
enforced by `commitlint`: `fix`, `feat`, `chore`, `refactor`, `docs`, `test`, `ci`, `style`.
Commitlint checks every commit in the PR, so get the type right on each one.

## Building a new integration

An integration is two pull requests:

1. **Transformer code** in this repo — how events are transformed: from the source's payload to
   the [RudderStack Event Specification][event-spec] for a source, or from that specification to
   the partner's API for a destination.
2. **The integration definition** in [rudder-integrations-config][integrations-config] — the
   settings users see in the RudderStack dashboard. Use that repo's `bootstrap-new-destination`
   skill to scaffold it.

The RudderStack team writes the public documentation and announces the integration in the
[release notes][release-notes] once it ships, so put the setup details the docs need in your PR
description or integration plan.

### Read the repo's skills first

The conventions for writing integrations live in [`.claude/skills/`](.claude/skills/), not in
this file. They are short, scoped and kept current, and each one says which approach is the
*current* one. **Read the relevant ones before writing code**, whether you write it by hand or
with an AI coding agent (Claude Code loads them automatically; point other agents at them).

Copying the nearest existing destination is the most common mistake. Most of the code in this
repo predates the current conventions, so copying it reproduces the old way with nothing to tell
you it is wrong. The CDK v2 YAML workflows in `src/cdk/v2/destinations` and the JavaScript
`transform.js` destinations are legacy: do not add to them or use them as templates.

```bash
head -n 4 .claude/skills/*/SKILL.md   # name + description of every skill
```

Where a skill and this file disagree, **the skill is current**. Please fix this file.

### Destinations

Start with the [`batching-framework`](.claude/skills/batching-framework/SKILL.md) skill. It is
the transform path for every new destination, batched or not: a destination whose API takes one
event per request is a batch of one. In short, a new destination is:

- **TypeScript in `src/v0/destinations/<my_destination>/`** (snake_case), extending
  `DestinationIntegration` in `routerTransform.ts`.
- **Router-only.** No `transform.js` and no processor transform.
- **Without a `networkHandler.ts`.** The framework's default delivery handling applies; add a
  `delivery.ts` only to override specific responses (see
  [`batching-framework-delivery`](.claude/skills/batching-framework-delivery/SKILL.md)).
- **Mapped in data, not code.** Field mappings go in `data/<MY_DESTINATION>Config.json`, read by
  `constructPayload` (see [`event-transformation`](.claude/skills/event-transformation/SKILL.md)).
- **Registered in `src/features.ts`** and defined with `transformAtV1: router` in
  rudder-integrations-config.

[`src/v0/destinations/openai_ads/`](src/v0/destinations/openai_ads/) is the reference
implementation, and [`test/integrations/destinations/openai_ads/`](test/integrations/destinations/openai_ads/)
shows the tests that go with it.

### Sources

Sources live in `src/sources/<my_source>/` and use the v2 source contract: export a
`process(payload: SourceInputV2)` function that reads the request with
`getBodyFromV2SpecPayload` and returns RudderStack events. Write new sources in TypeScript.
[`src/sources/facebook_lead_ads_native/`](src/sources/facebook_lead_ads_native/) is a recent
example; older sources may still be JavaScript and should not be copied as a template.

### Tests

Integration tests live in `test/integrations/destinations/<name>/` or
`test/integrations/sources/<name>/`; partner API calls are mocked in `network.ts`. A new
destination also ships a `live.ts`. The [`writing-tests`](.claude/skills/writing-tests/SKILL.md)
and [`live-integration-test`](.claude/skills/live-integration-test/SKILL.md) skills describe the
layout.

We recommend writing the test cases first and marking them `skip`, so reviewers can agree on the
expected behaviour before you implement it. Skip a whole file with `export const skip = true;`,
or a single case with `skip: true`.

Before opening a PR, run:

```bash
npm run lint                                                         # prettier + eslint --fix
npm test -- --testPathPattern="<name>" --no-coverage                 # unit tests
npm run test:ts -- component --destination=<name>                    # or --source=<name>
```

If you touched a destination's transform, its test fixtures or its secret keys, regenerate
`src/secretPaths/secretPaths.json` as described in
[`src/secretPaths/tooling/README.md`](src/secretPaths/tooling/README.md). CI checks it on every PR.

## References

- [RudderStack Event Specification][event-spec]
- [rudder-integrations-config][integrations-config]
- [RudderStack JSON Templating Engine](https://github.com/rudderlabs/rudder-json-template-engine)

We look forward to your feedback on improving this project.

<!----variable's---->

[slack]: https://resources.rudderstack.com/join-rudderstack-slack
[issue]: https://github.com/rudderlabs/rudder-transformer/issues/new
[cla]: https://contributor.rudderlabs.com/
[event-spec]: https://www.rudderstack.com/docs/event-spec/standard-events/
[integrations-config]: https://github.com/rudderlabs/rudder-integrations-config
[release-notes]: https://www.rudderstack.com/docs/releases/
[integration-plan]: https://rudderstacks.notion.site/Integration-planning-document-example-Slack-Source-integration-46863d6041ec48258f9c5433eab93b28?pvs=25
