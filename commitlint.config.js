module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': ['fix', 'feat', 'chore', 'refactor', 'docs', 'test']
  }
};
