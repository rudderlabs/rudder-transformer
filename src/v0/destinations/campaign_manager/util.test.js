const { convertToMicroseconds } = require('./util');

describe('convertToMicroseconds utility test', () => {
  it('ISO 8601 input', () => {
    expect(convertToMicroseconds('2021-01-04T08:25:04.780Z')).toEqual(1609748704780000);
  });

  it('unix microseconds input', () => {
    expect(convertToMicroseconds('1668624722903333')).toEqual(1668624722903333);
  });

  it('non numeric time input', () => {
    expect(convertToMicroseconds('2022-11-17T00:22:02.903+05:30')).toEqual(1668624722903000);
  });

  it('unix seconds input', () => {
    expect(convertToMicroseconds('1697013935')).toEqual(1697013935000000);
  });

  it('unix miliseconds input', () => {
    expect(convertToMicroseconds('1697013935000')).toEqual(1697013935000000);
  });
});
