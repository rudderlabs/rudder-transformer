module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': () => [2, 'always', ['fix', 'feat', 'chore', 'refactor', 'docs', 'test']],
    'body-max-line-length': () => [2, 'always', 500],
  },
};
