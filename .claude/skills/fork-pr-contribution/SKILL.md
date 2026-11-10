---
name: fork-pr-contribution
description: Take an open-source contribution (a PR from a fork) through review and into develop. The contributor PR is merged into a contrib/<pr> branch in our repo, and a PR from that branch runs the full CI and is merged into develop with a merge commit. Use when asked to "handle", "land", "merge" or "run CI for" a contributor, community or fork PR, or when a PR's head repo is not rudderlabs/rudder-transformer.
argument-hint: <contributor-pr-number>
---

# Handling a contributor (fork) PR

**Objective:** Land a fork PR on `develop` with the full CI run and the contributor's
commits and authorship kept, in the same way every time.

**Why this flow:** GitHub gives fork PRs no secrets and no OIDC token. On a fork PR, our
workflows run only the fork-safe checks (lint, format, secret paths, unit tests). The checks
that need secrets (Docker image build and push, ingestion-service test, SonarCloud) show
as **skipped**, and branch protection treats skipped as passing. So a fork PR must never be
merged straight into `develop`. It goes through a `contrib/<pr>` branch in our repo, where the full CI runs.

```
fork PR ──(squash)──▶ contrib/<pr> ──(PR, full CI, merge commit)──▶ develop
```

## Before you start

- `gh` commands below pass `-R rudderlabs/rudder-transformer` so they never act on a fork or another repo.
- The `git` commands assume `origin` is `rudderlabs/rudder-transformer`. Check with `git remote -v` and use the right remote name if it isn't.

## 1. Check it's a fork PR and the sanity checks pass

```bash
gh pr view <pr> -R rudderlabs/rudder-transformer \
  --json isCrossRepository,headRepositoryOwner,baseRefName,title,author,state
gh pr checks <pr> -R rudderlabs/rudder-transformer
```

- `isCrossRepository` must be `true`. If not, it's a normal PR and this skill doesn't apply.
- These must **pass**: `Check for formatting & lint errors`, `Verify generated secret paths`,
  `Check PR Title`, `commitlint`, and `Code Coverage` (it runs the unit tests; only the Sonar
  upload is skipped).
- Expected on a fork PR, so ignore them:
  - **Skipped:** the Docker image builds, `Run Ingestion Service Test`, and the SonarCloud step.
  - **Failing:** the org-level zizmor `scan`, which can't mint its token without secrets.
- If a sanity check fails, the contributor fixes it on their PR. Comment what failed and stop.
  Don't fix it for them in `contrib/<pr>`.

## 2. Review the diff, including CI and test code

Once the code is in our repo, it runs **with our secrets**. Read the whole diff before step 3.

First record the commit you're reviewing. Step 3 merges only this commit:

```bash
gh pr view <pr> -R rudderlabs/rudder-transformer --json headRefOid --jq .headRefOid
```

Then read the diff:

```bash
gh pr diff <pr> -R rudderlabs/rudder-transformer --name-only
gh pr diff <pr> -R rudderlabs/rudder-transformer
```

**Stop and escalate to a maintainer** (don't continue) if the diff touches any of these:
- `.github/`, `Dockerfile*`, `package.json` scripts, `package-lock.json`, `.npmrc`,
  `scripts/`, or test setup and config (`jest.config*`, `test/__mocks__`, global setup)
- code that reads `process.env`, spawns processes (`child_process`, `exec`), writes files,
  or makes network calls outside the destination's own API module

Quick scan of the added lines:

```bash
gh pr diff <pr> -R rudderlabs/rudder-transformer | grep '^+' \
  | grep -nE 'process\.env|child_process|exec\(|spawn|eval\(|fs\.|https?://|curl|wget'
```

Each hit needs a reason in the PR before you continue. The normal code review (behaviour,
tests, conventions) also happens here, on the contributor's PR, and it needs an approval
before step 3.

## 3. Merge the contributor PR into `contrib/<pr>`

```bash
git fetch origin develop
git push origin origin/develop:refs/heads/contrib/<pr>
gh pr edit <pr> -R rudderlabs/rudder-transformer --base contrib/<pr>
gh pr merge <pr> -R rudderlabs/rudder-transformer --squash --match-head-commit <reviewed-sha>
```

- `--match-head-commit` makes GitHub refuse the merge if the contributor pushed after your
  review, so unreviewed code never reaches our repo. If it's refused, go back to step 1.
- The contributor's PR now shows as **Merged**. The squash commit's author is the PR
  author, so the contributor keeps the credit, and `develop` gets one commit titled with
  the PR title.
- Changing the base doesn't re-run checks. That's fine, because the sanity checks already
  passed in step 1.

## 4. Raise the PR from `contrib/<pr>` to `develop`

Reuse the contributor's title (it must pass `Check PR Title`) and description, with a
credit header:

```bash
gh pr view <pr> -R rudderlabs/rudder-transformer --json title,author --jq '.title, .author.login'
gh pr view <pr> -R rudderlabs/rudder-transformer --json body --jq .body > /tmp/contrib-<pr>-body.md
```

Put this at the top of the body:

```markdown
> **Contributed by @<author> in #<pr>** (fork PR). This PR brings their commits from
> `contrib/<pr>` to `develop` so the full CI (Docker build + ingestion-service test,
> SonarCloud) runs. **Merge with "Create a merge commit" (not squash)** to keep the
> contributor's commits on `develop`.
```

```bash
gh pr create -R rudderlabs/rudder-transformer --base develop --head contrib/<pr> \
  --title "<contributor PR title>" --body-file /tmp/contrib-<pr>-body.md
```

Then comment on the contributor PR with the new PR's link, so they can follow it to
`develop`.

## 5. Full CI, then merge with a merge commit

```bash
gh pr checks <new-pr> -R rudderlabs/rudder-transformer --watch
```

- Every check must pass, including the ones that were skipped on the fork PR. zizmor `scan`
  passes here too.
- If a check that needs secrets fails, report it on the **contributor PR**. The fix comes
  from the contributor (see [Follow-up fixes](#follow-up-fixes)). For a trivial fix, a
  maintainer may push it to `contrib/<pr>` directly, and must say so on the PR.
- If `develop` moved on, update the branch with a merge
  (`gh pr update-branch <new-pr> -R rudderlabs/rudder-transformer`), not a rebase.
- Needs one approval. Then merge with a **merge commit**:

```bash
gh pr merge <new-pr> -R rudderlabs/rudder-transformer --merge --delete-branch
```

## Follow-up fixes

When the contributor needs to change something after step 3, the fix goes into the
**existing** `contrib/<pr>` branch, so the existing PR to `develop` picks it up. Don't create
a new `contrib/` branch for the fix PR.

1. Ask the contributor to open a fork PR with base `contrib/<pr>`, using the original PR
   number. If they opened it against `develop`, retarget it:
   `gh pr edit <fix-pr> -R rudderlabs/rudder-transformer --base contrib/<pr>`.
2. Run steps 1 and 2 on `<fix-pr>`, recording its reviewed commit.
3. Squash-merge it with the pinned commit. Skip creating the branch:
   `gh pr merge <fix-pr> -R rudderlabs/rudder-transformer --squash --match-head-commit <reviewed-sha>`.
4. Go back to step 5 on the existing PR to `develop`. CI re-runs on the new commit.

## Rules

- **Never merge a fork PR straight into `develop`.** Its skipped checks count as passing, so
  the merge button looks green when the full CI hasn't run.
- **Squash into `contrib/<pr>`, merge-commit into `develop`.** A squash commit is authored by
  whoever opened the PR. That's the contributor in step 3, but you in step 5, so squashing
  there would replace their authorship with yours.
- **Always use `contrib/<pr>`** for the branch name, so anyone can see where the branch came from.
- **Don't edit the contributor's code** in `contrib/<pr>` without saying so on the PR.
  Requested changes go back to the contributor.
- **Merge only the commit you reviewed.** Always pass `--match-head-commit` when merging a fork PR.
- **New contributor commits after step 3** arrive as a fork PR to the existing
  `contrib/<pr>` (see [Follow-up fixes](#follow-up-fixes)) before the PR to `develop` is merged.
