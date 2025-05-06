// module.exports = {
//   extends: ['@commitlint/config-conventional'],
//   rules: {
//     'type-enum': () => [2, 'always', ['fix', 'feat', 'chore', 'refactor', 'docs', 'test']],
//   },
// };

export default (async () => {
  const config = await import('@commitlint/config-conventional');
  return {
    extends: [config.default],
    rules: {
      'type-enum': () => [2, 'always', ['fix', 'feat', 'chore', 'refactor', 'docs', 'test']],
    },
  };
})();

// export default {
//   extends: [config],
//   rules: {
//     'type-enum': () => [2, 'always', ['fix', 'feat', 'chore', 'refactor', 'docs', 'test']],
//   },
// };
