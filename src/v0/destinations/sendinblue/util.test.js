const { transformUserTraits } = require('./util');

describe('Sendinblue transformUserTraits', () => {
  const contactAttributeMapping = [
    { from: 'area_code', to: 'AREA' },
    { from: 'location', to: 'LOCATION' },
  ];

  test('maps configured traits and removes original keys', () => {
    const traits = { area_code: '415', location: 'SF', other: 'x' };
    const result = transformUserTraits(traits, contactAttributeMapping);

    expect(result).toEqual({ AREA: '415', LOCATION: 'SF', other: 'x' });
    // Ensure original keys are not present
    expect(result.area_code).toBeUndefined();
    expect(result.location).toBeUndefined();
  });

  test('ignores unmapped or falsy values', () => {
    const traits = { area_code: '', location: null, other: 'x' };
    const result = transformUserTraits(traits, contactAttributeMapping);

    expect(result).toEqual({ other: 'x' });
  });

  test('returns empty object when traits is empty object', () => {
    const traits = {};
    const result = transformUserTraits(traits, contactAttributeMapping);
    expect(result).toEqual({});
  });

  test('throws when traits is undefined', () => {
    expect(() => transformUserTraits(undefined, contactAttributeMapping)).toThrow(
      'Sendinblue: traits should be defined.',
    );
  });
});
