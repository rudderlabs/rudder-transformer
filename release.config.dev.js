module.exports = {
  noCi: true,
  branches: ['release/test', 'release/*', 'hotfix-release/*'],
  extends: '@semantic-release/commit-analyzer',
  plugins: [
    [
      '@semantic-release/release-notes-generator',
      {
        presetConfig: {
          commit: true,
          issues: true,
        },
      },
    ],
    '@semantic-release/changelog',
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'package-lock.json'],
        message: 'chore: update to v${nextRelease.version}',
      },
    ],
  ],
  preset: 'conventionalcommits',
};
