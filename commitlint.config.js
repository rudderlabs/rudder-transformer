module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': () => [2, 'always', ['fix', 'feat', 'chore', 'refactor', 'docs', 'test']],
  },
  // We need this until https://github.com/dependabot/dependabot-core/issues/2445
  // is resolved.
  ignores: [(msg) => /Signed-off-by: dependabot\[bot]/m.test(msg)],
};
