# Git Workflow and CI/CD

This document outlines the Git workflow, branching strategy, and CI/CD pipeline used in the RudderStack Transformer repository.

## Git Workflow

### Branching Strategy

The repository follows a modified GitFlow branching strategy:

1. **`develop`**: The main development branch where all feature branches are merged
2. **`main`**: The production branch that contains stable, released code
3. **`feature/*`**: Feature branches for new features and enhancements
4. **`fix/*`**: Branches for bug fixes
5. **`release/*`**: Release branches created from `develop` for preparing releases
6. **`hotfix/*`**: Hotfix branches created from `main` for urgent production fixes

### Workflow Process

1. **Feature Development**:

   - Create a feature branch from `develop`: `feature/description` or `fix/description`
   - Implement changes and commit with conventional commit messages
   - Create a pull request to merge back into `develop`
   - After review and approval, merge into `develop`

2. **Release Process**:

   - Create a release branch from `develop`: `release/vX.Y.Z`
   - Perform final testing and fixes on the release branch
   - Create a pull request to merge into `main`
   - After approval, merge into `main` and tag the release
   - Merge back into `develop` to incorporate any release fixes

3. **Hotfix Process**:
   - Create a hotfix branch from `main`: `hotfix/vX.Y.Z`
   - Implement the fix and commit with conventional commit messages
   - Create a pull request to merge into `main`
   - After approval, merge into `main` and tag the hotfix release
   - Merge back into `develop` to incorporate the hotfix

## Commit Standards

### Conventional Commits

The repository uses the Conventional Commits format for commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

- **Type**: Describes the kind of change (e.g., feat, fix, docs, style, refactor, perf, test, chore)
- **Scope** (optional): Describes what part of the code is affected
- **Subject**: Short description of the change
- **Body** (optional): Detailed description of the change
- **Footer** (optional): Information about breaking changes and issue references

### Commit Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Changes that don't affect code functionality (formatting, etc.)
- **refactor**: Code changes that neither fix a bug nor add a feature
- **perf**: Performance improvements
- **test**: Adding or fixing tests
- **chore**: Changes to the build process or auxiliary tools

### Commit Validation

Commits are validated using:

- **Husky**: Git hooks for pre-commit and commit-msg validation
- **Commitlint**: Ensures commit messages follow the conventional format
- **GitHub Actions**: Additional validation on push

## Pull Request Process

### PR Requirements

1. **Title Format**: Must follow conventional commit format
2. **Linear Task Reference**: Must include a reference to a Linear task (e.g., `Resolves INT-XXX`)
3. **Description**: Must include:
   - Explanation of changes
   - Objectives of changes
   - Any changes to existing behavior
   - New dependencies introduced
   - Technical or performance considerations

### PR Checklist

Developers must ensure:

- Code follows project style guidelines
- No breaking changes are introduced
- All related documentation is updated
- All changes are manually tested
- PR is limited to 10 file changes
- PR is limited to one Linear task
- Relevant test cases are added

### PR Review Process

1. Create a pull request with the required information
2. Automated checks run (linting, tests, etc.)
3. Reviewers check for:
   - Appropriate PR title
   - No exposed credentials or confidential data
   - Code quality and adherence to standards
4. After approval, the PR can be merged

## CI/CD Pipeline

### GitHub Actions Workflows

The repository uses GitHub Actions for CI/CD with the following key workflows:

#### Verification Workflows

1. **Verify** (`verify.yml`):

   - Runs on pull requests
   - Checks for formatting and linting errors
   - Ensures code follows style guidelines

2. **Commitlint** (`commitlint.yml`):

   - Runs on push
   - Validates commit messages follow conventional format

3. **Check PR Title** (`check-pr-title.yml`):

   - Runs on pull request creation and updates
   - Ensures PR titles follow conventional commit format

4. **Tests** (`ut-tests.yml`):
   - Runs on pull requests
   - Sets up test environment with Kubernetes and OpenFaaS
   - Runs user transformation integration tests

#### Build and Release Workflows

1. **Build Docker Image** (`build-push-docker-image.yml`):

   - Builds Docker images for both ARM64 and AMD64 architectures
   - Runs tests inside the Docker container
   - Pushes images to DockerHub
   - Creates multi-architecture manifests

2. **Draft New Release** (`draft-new-release.yml`):

   - Triggered manually by release stakeholders
   - Calculates the next version based on conventional commits
   - Creates a release branch
   - Updates changelog and bumps version
   - Creates a pull request to merge into main

3. **Publish New Release** (`publish-new-release.yml`):

   - Creates GitHub releases
   - Publishes release notes

4. **Deployment Preparation**:
   - `prepare-for-dev-deploy.yml`: Prepares for development deployment
   - `prepare-for-staging-deploy.yml`: Prepares for staging deployment
   - `prepare-for-prod-dt-deploy.yml`: Prepares for production deployment
   - `prepare-for-prod-ut-deploy.yml`: Prepares for user transformation deployment

### CI/CD Process Flow

1. **Development**:

   - Developer creates a feature branch and implements changes
   - Pre-commit hooks run tests and linting locally
   - Developer creates a pull request

2. **Continuous Integration**:

   - GitHub Actions run verification workflows
   - Code is checked for style, formatting, and commit message format
   - Tests are run to ensure functionality

3. **Review and Approval**:

   - Code is reviewed by team members
   - Automated checks must pass
   - PR is approved and merged to develop

4. **Release Preparation**:

   - Release branch is created
   - Version is bumped and changelog updated
   - PR is created to merge into main

5. **Continuous Deployment**:
   - Docker images are built and tested
   - Images are pushed to DockerHub
   - Deployment preparation workflows run
   - Release is published to GitHub

## Git Hooks

The repository uses Husky for Git hooks:

1. **Pre-commit Hook**:

   - Runs tests: `npm run test:ts:silent && npm run test:js:silent`
   - Runs linting on staged files: `npx lint-staged`

2. **Commit-msg Hook**:
   - Validates commit messages: `commitlint --edit`

## Versioning

The repository uses Semantic Versioning (SemVer) with automated version calculation:

1. **Version Format**: `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)
2. **Version Bumping**:
   - `feat` commits trigger a MINOR version bump
   - `fix` commits trigger a PATCH version bump
   - Breaking changes trigger a MAJOR version bump
3. **Tools**:
   - `standard-version`: Automates version bumping and changelog generation
   - Conventional commits determine the next version

## Release Process

1. **Initiate Release**:

   - A release stakeholder triggers the draft-new-release workflow
   - The workflow calculates the next version based on commits

2. **Prepare Release**:

   - A release branch is created
   - Version is bumped and changelog updated
   - PR is created to merge into main

3. **Review and Approve**:

   - The release PR is reviewed and approved
   - Tests and checks must pass

4. **Publish Release**:

   - The release is merged into main
   - GitHub release is created with release notes
   - Docker images are built and published

5. **Post-Release**:
   - Changes are merged back to develop
   - Development continues on the next version

## Hotfix Process

1. **Identify Issue**:

   - A critical issue is identified in production

2. **Create Hotfix**:

   - A hotfix branch is created from main
   - The fix is implemented and tested

3. **Review and Approve**:

   - The hotfix PR is reviewed and approved
   - Tests and checks must pass

4. **Publish Hotfix**:

   - The hotfix is merged into main
   - Version is bumped (PATCH)
   - GitHub release is created
   - Docker images are built and published

5. **Merge Back**:
   - The hotfix is merged back to develop
