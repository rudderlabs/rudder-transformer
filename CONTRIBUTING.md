# Contributing to rudder-transformer

Thanks for helping improve RudderStack.

Building an integration here is mostly an AI agent's job now. This repo ships the skills an agent needs, so the code comes quickly. What takes time is **checking** it: for you, for us, and for every customer whose events flow through it. This guide is built around that. Follow it and your PR arrives already verified, and it merges fast.

## The short version

| Step | You do | You get |
| --- | --- | --- |
| 1. Plan | Ask your agent for an integration plan, post it as an issue | A maintainer's OK on *what* to build, before any code |
| 2. Tests first | Have the agent write the test cases, marked `skip` | Agreement on *how it behaves*, before any code |
| 3. Build | Point the agent at the skills and let it write the code | Code that follows current conventions |
| 4. Prove it | Run the checks, then a live test (destination) or real webhooks (source) from your own sandbox | Evidence that it works with the real vendor |
| 5. Open the PR | Paste the evidence into the PR | A review that checks evidence, not guesses |

Reviewers approve at two points: the plan (step 1) and the PR (step 5). Everything in between is yours and your agent's.

## Before you start

- **Get a sandbox or test account with the vendor**, with API credentials. Start on this first: it often takes the longest, and step 4 needs it.
- **Use an AI coding agent.** Claude Code loads this repo's [`.claude/skills/`](.claude/skills/) automatically. With any other agent (Cursor, Codex, Copilot, [DevBox][devbox] or your own), tell it to read `CLAUDE.md` and every `.claude/skills/*/SKILL.md` before it writes code.
- **Set up the repo:**

  ```bash
  nvm use            # Node version from .nvmrc
  npm run setup      # npm ci
  ```

Bug fix or small improvement instead of a new integration? Skip to [Small changes](#small-changes).

## Step 1: Plan

Ask your agent for the plan. For example:

> Read CLAUDE.md and every skill in .claude/skills. Then write an integration plan for a new `<Vendor>` destination using `<link to vendor API docs>`: which RudderStack events it supports and how each maps to the vendor's API (field by field), the auth method, batching and rate limits, how each error response is handled, and the settings users enter in the dashboard. Link the vendor docs page behind every claim. List anything you're unsure of as open questions.

### Planning a source

A source plan answers different questions, and the first one can end it:

- **Does the vendor push events?** It has to send an HTTP request when something happens (a webhook). If it only offers an API you'd poll, stop here: it can't ship as a source.
- **Who sets up the webhook?** Either it works for every customer once they register the URL (like Stripe), or each customer has to build their own rule or automation to send it (like Freshdesk Automations). Both work, but the second needs much more setup in the docs.
- **How do we know a request is real?** Does the vendor sign the payload? If so, with which algorithm and header, over the raw body or the parsed one, and with a timestamp against replays? Does the vendor require the receiver to check the signature, or is that optional? If the vendor signs anything, plan a native source that verifies it.
- **What does the payload look like?** Check the format, how each event type maps to RudderStack's event fields, and whether one request can carry several events (then the source splits them).
- **Is there a handshake?** Some vendors send a test or challenge request when the webhook is registered and won't activate it until it's answered.
- **Can the sandbox fire the events?** Some vendors only send certain event types for real data. List which events your test account can actually trigger.

Ask the agent for the same plan with these questions in place of the destination ones, still linking the vendor docs page behind every claim.

### Post the plan

Read it yourself and answer the open questions you can. Leave the ones only RudderStack can answer (whether to build it, what's out of scope for the first version) marked as questions, not guesses. Post it as a [new issue][issue] titled `New destination: <Vendor>` or `New source: <Vendor>`. A maintainer reviews it, and checks the claims against the doc links.

**Wait for the OK before you build.** Changing a plan costs minutes. Changing a merged-looking PR costs days, for you and for us.

## Step 2: Tests first

Ask the agent to write the test cases from the agreed plan, without the implementation:

> Using the plan in issue #<n> and the `writing-tests` skill, write the component test cases for `<my_destination>` in `test/integrations/destinations/<my_destination>/`, with the partner API mocked in `network.ts`. Mark the file `export const skip = true;`. Don't write the transform yet.

Open a **draft PR** with just these tests and link it from the issue. Reviewers read expected inputs and outputs much faster than they read code, and this is where most review comments belong. Once the expected behaviour is agreed, the implementation only has to make the tests pass.

## Step 3: Build

Hand the agent the plan and the tests:

> Implement `<my_destination>` so the tests in `test/integrations/destinations/<my_destination>/` pass. Follow the skills in .claude/skills, starting with `batching-framework`. Use `src/v0/destinations/openai_ads/` as the reference implementation. Don't copy any other destination. Then remove the `skip`.

What the skills will produce, so you can spot it when they don't:

- **TypeScript in `src/v0/destinations/<my_destination>/`** (snake_case), extending `DestinationIntegration` in `routerTransform.ts`.
- **Router only.** No `transform.js`, no processor transform, no `networkHandler.ts` (add a `delivery.ts` only to override specific responses; see [`batching-framework-delivery`](.claude/skills/batching-framework-delivery/SKILL.md)).
- **Mappings in data, not code:** `data/<MY_DESTINATION>Config.json`, read by `constructPayload` (see [`event-transformation`](.claude/skills/event-transformation/SKILL.md)).
- **Registered in `src/features.ts`.**

Sources follow the v2 source contract in `src/sources/<my_source>/`, in TypeScript: export a `process(payload: SourceInputV2)` function that reads the request with `getBodyFromV2SpecPayload`, verifies it where the vendor signs requests, and returns RudderStack events. [`src/sources/facebook_lead_ads_native/`](src/sources/facebook_lead_ads_native/) is a recent example of the contract, not of every vendor's security: its handshake is specific to Meta. Take the signing and handshake details from your vendor's docs and the plan.

**An integration is two PRs.** This repo has the transform. [rudder-integrations-config][integrations-config] has the dashboard settings; ask the agent to scaffold that one with its `bootstrap-new-destination` skill, and link the two PRs to each other.

### Don't copy the nearest destination

This is the most common reason a PR goes back for rework. Most code in this repo predates the current conventions: copying it reproduces the old way, and nothing tells you it's wrong. The CDK v2 YAML workflows in `src/cdk/v2/destinations` and the JavaScript `transform.js` destinations are legacy. Agents copy neighbours by default, so tell yours not to.

Where a skill and this file disagree, **the skill is current**. If the agent gets a convention wrong because a skill was unclear, say which skill in your PR. Fixing the skill helps every contributor after you.

## Step 4: Prove it

Run the same checks CI runs, and keep the output:

```bash
npm run lint                                                   # prettier + eslint --fix
npm test -- --testPathPattern="<my_destination>" --no-coverage # unit tests
npm run test:ts -- component --destination=<my_destination>    # component tests
```

If you touched a destination's transform, its fixtures or its secret keys, regenerate `src/secretPaths/secretPaths.json` as described in [`src/secretPaths/tooling/README.md`](src/secretPaths/tooling/README.md). CI checks it on every PR.

### Live test against your sandbox

The component tests use a mocked API, so they prove the transform does what the tests say. They don't prove the vendor accepts it. The live test does: it sends real events through `transform → deliver` to your sandbox account and checks the vendor's actual response.

Ask the agent to write it with the [`live-integration-test`](.claude/skills/live-integration-test/SKILL.md) skill, then run it with your sandbox credentials:

```bash
LIVE_SECRET_<MY_DESTINATION>='{...}' npm run test:live -- --destination=<my_destination>
```

The secret's shape is described in [`test/integrations/live/README.md`](test/integrations/live/README.md). Keep credentials in your shell; never commit them or paste them in the PR.

**A new destination without a passing live run is not ready for review.** If the vendor gives you no sandbox, say so in the PR and we'll work out another way to verify it.

### Real webhooks for a source

The live harness covers destinations only. For a source, the proof is real traffic from your sandbox:

- Register a webhook in your test account (a request-capture tool works as the receiver) and trigger each event type the plan covers.
- Save the captured requests, with secrets and personal data replaced, as the source's test fixtures, so the tests run on what the vendor really sends.
- If the vendor signs requests, add a test that accepts a correctly signed request and one that rejects a bad signature.
- In the PR, list which event types you captured for real and which you couldn't trigger.

## Step 5: Open the PR

Open it against `develop`, or mark your draft from step 2 ready for review. Fill in this block at the top of the description:

```markdown
## Evidence
- Plan: #<issue>   Config PR: rudderlabs/rudder-integrations-config#<n>
- Component tests: <N> passed (paste the summary line)
- Live run (destination): <N> scenarios passed against <vendor> sandbox (paste the summary, no secrets)
- Real webhooks (source): captured <event types>; not triggerable in sandbox: <event types or "none">; signature check tested: <yes / vendor doesn't sign>
- Lint and secret paths: clean
- Files outside `src/v0/destinations/<my_destination>/` and its test folder: <list each and why, or "none">
- Not covered: <what the tests don't exercise, or "nothing known">
- Agent and skills used: <e.g. Claude Code; batching-framework, writing-tests, live-integration-test>
```

The "not covered" line matters. An honest gap is a five-minute conversation. A gap the reviewer finds alone costs a full extra round.

Put the setup details users need (where to find the API key, which plan the vendor requires) in the PR description too. The RudderStack team writes the public docs and the [release notes][release-notes] from them.

### Commits and PR titles

Conventional commits: `type(scope): description`, for example `feat(my_destination): add identify support`. The types are a closed list enforced by `commitlint`: `fix`, `feat`, `chore`, `refactor`, `docs`, `test`, `ci`, `style`. It checks every commit in the PR, so get the type right on each one.

## What makes a review slow

Each of these sends a PR back. Ask your agent to check for them before you open it:

- Code copied from a legacy destination, or files the skills say not to add (`transform.js`, `networkHandler.ts`, a `processor/` test folder).
- Changes outside your integration's folders that the evidence block doesn't explain.
- Two spellings of a field "for compatibility". A new integration has no old payloads to stay compatible with.
- Tests changed to match the code, rather than code changed to match the agreed tests.
- No live run, or a live run that only covers the happy path. For a source: fixtures written by hand instead of captured from the vendor.
- Plan claims with no link to the vendor docs behind them.
- A diff you can't explain line by line. You're the author: if a reviewer asks why, "the agent wrote it" is not an answer.

## During review

Paste review comments into your agent, re-run step 4, and update the evidence block. Reply to each comment with what changed.

GitHub withholds secrets from fork PRs, so part of CI is skipped on yours. When the PR is approved, a maintainer lands it through a branch in this repo where the full CI runs. Your commits and authorship are kept.

## Small changes

For a bug fix or an improvement to an existing integration:

1. Open an [issue][issue] describing the problem, with a failing payload if you have one.
2. Have the agent add a test case that reproduces it, then fix it.
3. Run step 4. A live run is expected when the fix changes what gets sent to the vendor.
4. Open the PR with the evidence block, skipping the lines that don't apply.

## Skills in this repo

| Working on | Skill |
| --- | --- |
| Any new destination | [`batching-framework`](.claude/skills/batching-framework/SKILL.md), [`batching-framework-delivery`](.claude/skills/batching-framework-delivery/SKILL.md) |
| Field mapping | [`event-transformation`](.claude/skills/event-transformation/SKILL.md) |
| Tests | [`writing-tests`](.claude/skills/writing-tests/SKILL.md), [`live-integration-test`](.claude/skills/live-integration-test/SKILL.md) |
| Code layout and style | [`code-structure`](.claude/skills/code-structure/SKILL.md), [`typescript-guidelines`](.claude/skills/typescript-guidelines/SKILL.md) |
| A new version of an existing destination | [`destination-versioning`](.claude/skills/destination-versioning/SKILL.md) |
| Audience and object destinations | [`vdm-next-audience-integration`](.claude/skills/vdm-next-audience-integration/SKILL.md), [`vdm-v2-object-destination`](.claude/skills/vdm-v2-object-destination/SKILL.md) |

```bash
head -n 4 .claude/skills/*/SKILL.md   # name and description of every skill
```

## Getting help

Ask in [Slack][slack] or comment on your issue.

## References

- [RudderStack Event Specification][event-spec]
- [rudder-integrations-config][integrations-config] and its [contributing guide][config-contributing]
- [RudderStack JSON Templating Engine](https://github.com/rudderlabs/rudder-json-template-engine)

<!----variables---->

[slack]: https://resources.rudderstack.com/join-rudderstack-slack
[issue]: https://github.com/rudderlabs/rudder-transformer/issues/new
[devbox]: https://github.com/rudderlabs/devbox
[event-spec]: https://www.rudderstack.com/docs/event-spec/standard-events/
[integrations-config]: https://github.com/rudderlabs/rudder-integrations-config
[config-contributing]: https://github.com/rudderlabs/rudder-integrations-config/blob/main/CONTRIBUTING.md
[release-notes]: https://www.rudderstack.com/docs/releases/
