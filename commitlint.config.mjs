export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': () => [2, 'always', ['fix', 'feat', 'chore', 'refactor', 'docs', 'test']],
  },
};

// module.exports = {
//   extends: ['@commitlint/config-conventional'],
//   rules: {
//     'type-enum': () => [2, 'always', ['fix', 'feat', 'chore', 'refactor', 'docs', 'test']],
//   },
// };

// export default {
//   extends: [config],
//   rules: {
//     'type-enum': () => [2, 'always', ['fix', 'feat', 'chore', 'refactor', 'docs', 'test']],
//   },
// };
