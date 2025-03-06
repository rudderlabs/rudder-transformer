import { stringifyValues } from './utils';

describe('eloqua', () => {
  describe('stringifyValues', () => {
    interface TestCase {
      name: string;
      input: Record<string, any>;
      expected: Record<string, string>;
    }

    const testCases: TestCase[] = [
      {
        name: 'empty object',
        input: {},
        expected: {},
      },
      {
        name: 'string values only',
        input: {
          name: 'John',
          email: 'john@example.com',
        },
        expected: {
          name: 'John',
          email: 'john@example.com',
        },
      },
      {
        name: 'non-string values',
        input: {
          age: 30,
          active: true,
          scores: [85, 90, 95],
          address: {
            city: 'New York',
            zip: 10001,
          },
        },
        expected: {
          age: '30',
          active: 'true',
          scores: '[85,90,95]',
          address: '{"city":"New York","zip":10001}',
        },
      },
      {
        name: 'mixed string and non-string values',
        input: {
          name: 'John',
          age: 30,
          email: 'john@example.com',
          preferences: { theme: 'dark', notifications: true },
        },
        expected: {
          name: 'John',
          age: '30',
          email: 'john@example.com',
          preferences: '{"theme":"dark","notifications":true}',
        },
      },
      {
        name: 'null and undefined values',
        input: {
          name: 'John',
          phone: null,
          address: undefined,
        },
        expected: {
          name: 'John',
          phone: 'null',
        },
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(`should handle ${name}`, () => {
        const result = stringifyValues(input);
        expect(result).toEqual(expected);
      });
    });
  });
});
