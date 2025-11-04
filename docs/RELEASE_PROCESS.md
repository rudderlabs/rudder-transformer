# Release Process Documentation

## Overview

This document describes the automated release process for the rudder-transformer project, which creates GitHub releases with Angular conventional commit style release notes.

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
7. **Notification**: Sends Slack notification about the new release

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

### Common Issues

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

The release process uses these environment variables:

- `GITHUB_TOKEN` / `GH_TOKEN`: GitHub Personal Access Token
- `HUSKY`: Set to `0` to disable git hooks during CI

## Related Files

- `.github/workflows/publish-new-release.yml` - Main release workflow
- `scripts/create-github-release.js` - Release creation script
- `github-release.config.js` - Legacy configuration (deprecated)
- `package.json` - NPM scripts for release commands
