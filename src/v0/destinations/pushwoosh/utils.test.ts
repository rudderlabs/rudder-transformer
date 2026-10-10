import type { PushwooshMessage } from './types';
import { resolveDevicePlatform, toPushwooshValues } from './utils';

describe('toPushwooshValues', () => {
  const cases = [
    { name: 'non-object source', source: 'text', excluded: undefined, expected: {} },
    { name: 'undefined source', source: undefined, excluded: undefined, expected: {} },
    {
      name: 'scalars kept, null and undefined dropped',
      source: { s: 'a', n: 0, b: false, empty: '', nil: null, undef: undefined },
      excluded: undefined,
      expected: { s: 'a', n: 0, b: false, empty: '' },
    },
    {
      name: 'objects and object array items stringified',
      source: { obj: { a: 1 }, list: [{ a: 1 }, 'x', 2, null] },
      excluded: undefined,
      expected: { obj: '{"a":1}', list: ['{"a":1}', 'x', 2, 'null'] },
    },
    {
      name: 'excluded keys dropped',
      source: { email: 'a@b.c', plan: 'pro' },
      excluded: new Set(['email']),
      expected: { plan: 'pro' },
    },
  ];

  it.each(cases)('$name', ({ source, excluded, expected }) => {
    expect(toPushwooshValues(source, excluded)).toEqual(expected);
  });
});

describe('resolveDevicePlatform', () => {
  const cases = [
    { name: 'Android device type', context: { device: { type: 'Android' } }, expected: 'android' },
    { name: 'Android os name', context: { os: { name: 'android' } }, expected: 'android' },
    { name: 'iOS device type', context: { device: { type: 'iOS' } }, expected: 'ios' },
    { name: 'iPadOS os name', context: { os: { name: 'iPadOS' } }, expected: 'ios' },
    { name: 'tvOS os name', context: { os: { name: 'tvOS' } }, expected: 'ios' },
    { name: 'desktop browser', context: { os: { name: 'Mac OS X' } }, expected: 'web' },
    { name: 'no context', context: undefined, expected: 'web' },
  ];

  it.each(cases)('$name -> $expected', ({ context, expected }) => {
    expect(resolveDevicePlatform({ type: 'track', context } as PushwooshMessage)).toBe(expected);
  });
});
