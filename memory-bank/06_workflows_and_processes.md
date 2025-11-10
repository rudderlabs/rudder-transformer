# Workflows and Processes

## Development Workflow

### Git Branching Strategy

The repository follows a modified GitFlow branching strategy:

1. **`develop`**: The main development branch where all feature branches are merged
2. **`main`**: The production branch that contains stable, released code
3. **`feature/*`**: Feature branches for new features and enhancements
4. **`fix/*`**: Branches for bug fixes
5. **`release/*`**: Release branches created from `develop` for preparing releases
6. **`hotfix/*`**: Hotfix branches created from `main` for urgent production fixes

### Feature Development Process

1. **Issue Creation**

   - Create an issue in the Linear task tracker
   - Describe the feature or bug to be addressed
   - Add appropriate labels and assign to a team member

2. **Branch Creation**

   - Create a feature branch from `develop`
   - Use a descriptive branch name following the convention: `feature/description` or `fix/description`

3. **Implementation**

   - Implement the changes following coding standards
   - Write tests for new functionality
   - Update documentation as needed

4. **Local Testing**

   - Run unit tests: `npm run test:ts`
   - Run integration tests if applicable
   - Verify changes work as expected

5. **Code Review Preparation**

   - Run linting: `npm run lint`
   - Ensure all tests pass
   - Make commits with conventional commit format

6. **Pull Request**

   - Create a pull request to the `develop` branch
   - Fill out the PR template with details about the changes
   - Include a reference to the Linear task (e.g., `Resolves INT-XXX`)
   - Ensure PR title follows conventional commit format
   - Request reviews from appropriate team members

7. **Code Review**

   - Address review comments
   - Make requested changes
   - Get approval from reviewers

8. **Merge**
   - Merge the PR to `develop` after approval
   - Delete the feature branch after successful merge

### Git Hooks

The repository uses Husky for Git hooks:

1. **Pre-commit Hook**:

   - Runs tests: `npm run test:ts:silent && npm run test:js:silent`
   - Runs linting on staged files: `npx lint-staged`

2. **Commit-msg Hook**:
   - Validates commit messages: `commitlint --edit`

### Commit Message Format

Follow the conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

- **Type**: feat, fix, docs, style, refactor, perf, test, chore
- **Scope**: Optional, indicates the section of the codebase
- **Subject**: Short description of the change
- **Body**: Detailed description of the change
- **Footer**: Optional, references to issues or breaking changes

Example:

```
feat(iterable): add support for catalog items

Implement support for catalog items in the Iterable destination.
- Add processCatalogBatch function
- Add size validation for catalog items
- Update tests

Fixes #123
```

## CI/CD Pipeline

### GitHub Actions Workflows

The repository uses GitHub Actions for CI/CD with the following key workflows:

#### Verification Workflows

1. **Verify**:

   - Runs on pull requests
   - Checks for formatting and linting errors
   - Ensures code follows style guidelines

2. **Commitlint**:

   - Runs on push
   - Validates commit messages follow conventional format

3. **Check PR Title**:

   - Runs on pull request creation and updates
   - Ensures PR titles follow conventional commit format

4. **Tests**:
   - Runs on pull requests
   - Sets up test environment
   - Runs unit and integration tests

#### Build and Release Workflows

1. **Build Docker Image**:

   - Builds Docker images for both ARM64 and AMD64 architectures
   - Runs tests inside the Docker container
   - Pushes images to DockerHub
   - Creates multi-architecture manifests

2. **Draft New Release**:

   - Triggered manually by release stakeholders
   - Calculates the next version based on conventional commits
   - Creates a release branch
   - Updates changelog and bumps version
   - Creates a pull request to merge into main

3. **Publish New Release**:
   - Creates GitHub releases
   - Publishes release notes

### Deployment Process

1. **Build**

   - Automated by GitHub Actions
   - Run `npm run build:clean` to build the application
   - Verify the build completes successfully

2. **Package**

   - Automated by GitHub Actions
   - Create Docker images for multiple architectures
   - Tag the images with the appropriate version

3. **Test**

   - Automated tests run in CI pipeline
   - Additional manual verification in staging environment

4. **Release**

   - Automated version calculation based on conventional commits
   - Changelog generation
   - GitHub release creation
   - Docker image publication to registry

5. **Deploy**

   - Deployment preparation workflows run
   - Deploy the new version to production
   - Monitor the deployment for any issues

6. **Verify**
   - Run health checks to ensure the service is running correctly
   - Monitor metrics and logs for any anomalies

## Maintenance Procedures

### Monitoring

- **Metrics**: Monitor Prometheus metrics for performance and errors
- **Logs**: Review logs for warnings and errors
- **Alerts**: Set up alerts for critical issues

### Performance Optimization

- Regularly review performance metrics
- Identify bottlenecks in the system
- Implement optimizations based on data

### Dependency Management

- Regularly update dependencies to address security issues
- Test thoroughly after dependency updates
- Keep track of breaking changes in dependencies

### Troubleshooting

1. **Identify the Issue**

   - Review logs and metrics
   - Reproduce the issue if possible

2. **Diagnose**

   - Analyze the root cause
   - Check for similar issues in the past

3. **Fix**

   - Implement a fix following the development workflow
   - Add tests to prevent regression

4. **Verify**
   - Test the fix thoroughly
   - Monitor after deployment to ensure the issue is resolved
