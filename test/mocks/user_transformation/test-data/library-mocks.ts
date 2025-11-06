// Mock library codes
export const libraryMocks: Record<string, any> = {
  'lodash-lib-v1': {
    versionId: 'lodash-lib-v1',
    code: `// Lodash library mock - simplified version
      const _ = {
        omit: (obj, keys) => {
          const result = { ...obj };
          keys.forEach(key => delete result[key]);
          return result;
        },
        mapKeys: (obj, iteratee) => {
          const result = {};
          Object.keys(obj).forEach(key => {
            result[iteratee(obj[key], key)] = obj[key];
          });
          return result;
        },
        camelCase: (str) => {
          return str.replace(/[-_\\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
        },
        size: (obj) => {
          return Object.keys(obj || {}).length;
        }
      };
      export default _;
    `,
    name: 'lodash',
    importName: 'lodash',
  },

  'moment-lib-v1': {
    versionId: 'moment-lib-v1',
    code: `// Moment library mock - simplified version
      const moment = {
        now: () => Date.now(),
        format: (date, format) => new Date(date).toISOString(),
        add: (date, amount, unit) => new Date(date.getTime() + amount * 1000),
        subtract: (date, amount, unit) => new Date(date.getTime() - amount * 1000)
      };
      export default moment;
    `,
    name: 'moment',
    importName: 'moment',
  },
};
