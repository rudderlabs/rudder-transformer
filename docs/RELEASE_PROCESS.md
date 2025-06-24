# Release Process & Notification Documentation

## Overview

This document describes the automated release process and notification workflows for the rudder-transformer project, including GitHub releases with Angular conventional commit style release notes and Slack notifications for merged pull requests.

## Automated Release Workflow

### Trigger

The release process is automatically triggered when:

- A pull request from a `release/v*` or `hotfix-release/v*` branch is merged into `main`

### Idempotent Design

The workflow is designed to be **idempotent** and safe to re-run:

- ✅ **Tag Creation**: Only creates tags if they don't already exist
- ✅ **Release Creation**: Skips creation if release already exists
- ✅ **Error Recovery**: Can be safely re-run after failures

### Process Steps

1. **Version Extraction**: Extracts version number from the branch name
2. **Tag Verification**: Checks if git tag already exists, creates only if missing
3. **Release Creation**: Creates a GitHub release with conventional commit style notes (skips if already exists)
4. **Verification**: Verifies the release was created successfully with detailed status
5. **Branch Sync**: Creates PR to sync changes back to develop branch
6. **Cleanup**: Deletes the release branch
7. **Notification**: Sends Slack notification about the new release to the release channel

## Release Notes Format

The release notes follow Angular conventional commit style with automatic categorization:

### Categories

- 🚀 **Features** (`feat:` commits)
- 🐛 **Bug Fixes** (`fix:` commits)
- ⚠️ **Breaking Changes** (commits with `!:`)
- 🔧 **Other Changes** (other commit types like `chore:`, `docs:`, etc.)

### Example Release Notes

```markdown
# Release v1.101.0

## 🚀 Features

- add new event mapping for tiktok (#4298)
- update destination type with optional account types (#4291)

## 🐛 Bug Fixes

- add uuid as fallback to missing anonymousId in webhook events (#4276)

## 🔧 Other Changes

- chore: pass copy of metadata to avoid actual metadata modifications (#4351)
- chore: mp add content type header to all apis (#4344)

**Full Changelog**: https://github.com/rudderlabs/rudder-transformer/compare/v1.100.0...v1.101.0
```

## Integration Test & Notification Workflow

### Overview

The `integration-test-notification.yml` workflow automatically runs integration tests when PRs are merged to develop/main branches and sends comprehensive Slack notifications with both PR details and test results.

### Triggers

The workflow triggers when:

- A pull request is **closed** (merged) to the `develop` branch
- A pull request is **closed** (merged) to the `main` branch

#### Integration Test Configurations

| Branch    | Test Config   | Duration                 | Purpose                            |
| --------- | ------------- | ------------------------ | ---------------------------------- |
| `main`    | comprehensive | ~2 minutes per scenario  | Thorough testing before production |
| `develop` | quick         | ~30 seconds per scenario | Fast feedback for development      |

### Features

#### 🎯 Smart Branch-Based Notifications

- **Main Branch Merges**: Sends notifications to the release channel with production deployment status
- **Develop Branch Merges**: Sends notifications to the development channel with development deployment status

#### 🧪 Automated Integration Testing

- **Test Execution**: Automatically runs integration tests using the existing test framework
- **Smart Configuration**: Uses comprehensive tests for main branch, quick tests for develop
- **Result Parsing**: Extracts detailed metrics from test results (scenarios, requests, response times, throughput)
- **Artifact Storage**: Uploads test results as GitHub artifacts for later analysis

#### 📋 Rich Notification Content

**PR Merge Notifications** include:

- PR number with clickable link
- PR title and author
- Source and target branches
- Merge commit hash (shortened)
- Environment context (Production/Development)
- Team mentions based on branch
- Deployment status updates

**Integration Test Notifications** include:

- Test execution status (✅ PASSED / ❌ FAILED)
- Total scenarios run and success/failure counts
- Request statistics (total requests, failed requests)
- Performance metrics (response time, throughput)
- Test configuration used
- Links to detailed results and workflow logs

#### 🔧 Configuration

##### Required Secrets

The workflow requires the following GitHub secrets to be configured:

```yaml
SLACK_BOT_TOKEN                    # Slack bot token for API access
SLACK_RELEASE_CHANNEL_ID          # Channel ID for main branch notifications
SLACK_INTEGRATION_DEV_CHANNEL_ID  # Channel ID for develop branch notifications
```

##### Branch-Specific Behavior

| Branch    | Channel         | Environment | Priority | Team Mentions          |
| --------- | --------------- | ----------- | -------- | ---------------------- |
| `main`    | Release Channel | Production  | High     | Backend + DevOps teams |
| `develop` | Dev Channel     | Development | Medium   | Backend team           |

### Notification Examples

#### Main Branch Merge

```
🚀 PR Merged to main (Production)

PR Number: #123
Author: developer-name
Target Branch: main
Source Branch: feature/new-feature
Title: Add new feature for user management
Merge Commit: abc1234

@backend-team @devops-team | Priority: High | Repository: Rudder Transformer
```

#### Develop Branch Merge

```
⚙️ PR Merged to develop (Development)

PR Number: #124
Author: developer-name
Target Branch: develop
Source Branch: feature/bug-fix
Title: Fix issue with data processing
Merge Commit: def5678

@backend-team | Priority: Medium | Repository: Rudder Transformer
```

### Deployment Status Updates

#### Production (Main Branch)

After the main notification, an additional message is sent:

- Informs about automatic production deployment pipeline trigger
- Provides link to GitHub Actions for monitoring
- Mentions relevant teams

#### Development (Develop Branch)

After the main notification, an additional message is sent:

- Informs about development environment deployment in progress
- Provides link to GitHub Actions for monitoring
- Mentions development team

### Error Handling

- All Slack notifications use `continue-on-error: true` to prevent workflow failures
- If Slack notifications fail, the workflow continues without blocking other processes
- Failed notifications don't affect the actual merge or deployment processes

## Manual Release Creation

### Using the Modern Script

```bash
# Navigate to the correct tag/commit
git checkout v1.102.0

# Run the release script
npm run release:github:modern
```

### Using GitHub CLI Directly

```bash
# Create release with auto-generated notes
gh release create v1.102.0 --title "v1.102.0" --generate-notes --latest

# Create release with custom notes file
gh release create v1.102.0 --title "v1.102.0" --notes-file release-notes.md --latest
```

## Scripts

### `scripts/create-github-release.js`

Modern release creation script that:

- Generates Angular conventional commit style release notes
- Uses GitHub CLI for reliable release creation
- Includes fallback mechanisms
- Provides detailed logging and error handling

### NPM Scripts

- `npm run release:github:modern` - **Recommended**: Uses the modern script
- `npm run release:github` - **Deprecated**: Uses old conventional-github-releaser (broken)

## Troubleshooting

### Release Process Issues

1. **Release Creation Fails**

   - Check GitHub token permissions
   - Verify tag exists: `git tag -l | grep v1.102.0`
   - Check GitHub CLI authentication: `gh auth status`

2. **Missing Release Notes**

   - Verify commits follow conventional commit format
   - Check git history between tags: `git log v1.101.0..v1.102.0 --oneline`

3. **Workflow Fails**
   - Check workflow logs in GitHub Actions
   - Verify all required secrets are set
   - Ensure branch naming follows `release/v*` or `hotfix-release/v*` pattern

### PR Notification Issues

1. **Notifications not sent**: Check that required secrets are configured
2. **Wrong channel**: Verify channel IDs in secrets match target channels
3. **Missing team mentions**: Ensure team/subteam IDs are correct
4. **Workflow not triggering**: Confirm PR is actually merged (not just closed)

#### Testing PR Notifications

To test the PR notification workflow:

1. Create a test PR to `develop` or `main`
2. Merge the PR (don't just close it)
3. Check the GitHub Actions tab for workflow execution
4. Verify notifications appear in the expected Slack channels

### Manual Recovery

If the automated process fails, you can manually create releases:

```bash
# 1. Checkout the tag
git checkout v1.102.0

# 2. Create release using our script
node scripts/create-github-release.js

# 3. Verify release was created
gh release view v1.102.0
```

## Migration from conventional-github-releaser

The project has migrated from the deprecated `conventional-github-releaser` package to a modern GitHub CLI-based approach because:

- `conventional-github-releaser` is 5+ years old and incompatible with current Node.js/GitHub API
- GitHub CLI is actively maintained and more reliable
- Better error handling and debugging capabilities
- Consistent Angular conventional commit formatting

## Dependencies

- **GitHub CLI** (`gh`): For release creation
- **Git**: For commit history analysis
- **Node.js**: For running the release script
- **GitHub Personal Access Token**: With `repo` permissions

## Configuration

### Release Process Configuration

The release process uses these environment variables:

- `GITHUB_TOKEN` / `GH_TOKEN`: GitHub Personal Access Token
- `HUSKY`: Set to `0` to disable git hooks during CI

### PR Notification Customization

#### Adding New Branches

To add notifications for additional branches:

1. Add the branch name to the workflow trigger:

```yaml
on:
  pull_request:
    types:
      - closed
    branches:
      - develop
      - main
      - your-new-branch # Add here
```

2. Update the notification configuration step to handle the new branch:

```yaml
elif [ "$target_branch" = "your-new-branch" ]; then
echo "channel_id=${{ secrets.YOUR_CHANNEL_ID }}" >> $GITHUB_OUTPUT
echo "environment=Your Environment" >> $GITHUB_OUTPUT
# ... other configurations
```

#### Modifying Team Mentions

Update the team mentions in the notification configuration step:

```yaml
echo "mentions=<!subteam^YOUR_TEAM_ID>" >> $GITHUB_OUTPUT
```

#### Changing Notification Format

Modify the Slack payload in the notification steps to customize:

- Message structure and content
- Visual elements (emojis, formatting)
- Additional fields or context

## Security Considerations

### Release Process Security

- GitHub Personal Access Token should have minimal required `repo` permissions
- Release workflow only triggers on specific branch patterns for security
- All sensitive tokens are stored as GitHub secrets

### PR Notification Security

- The workflow only triggers on merged PRs, not on every PR close
- Slack bot token should have minimal required permissions
- Channel IDs are stored as secrets to prevent unauthorized access
- No sensitive information is logged or exposed in notifications

## Related Files

### Release Process Files

- `.github/workflows/publish-new-release.yml` - Main release workflow
- `scripts/create-github-release.js` - Release creation script
- `github-release.config.js` - Legacy configuration (deprecated)
- `package.json` - NPM scripts for release commands

### PR Notification Files

- `.github/workflows/integration-test-notification.yml` - Integration test execution and notification workflow
- `.github/workflows/slack-notify.yml` - Reusable Slack notification workflow
