const { convertToMicroseconds } = require('./util');

describe('convertToMicroseconds utility test', () => {
  it('ISO 8601 input', () => {
    expect(1609748704780000).toEqual(convertToMicroseconds('2021-01-04T08:25:04.780Z'));
  });

  it('unix microseconds input', () => {
    expect(1668624722903333).toEqual(convertToMicroseconds('1668624722903333'));
  });

  it('non numeric time input', () => {
    expect(1668624722903000).toEqual(convertToMicroseconds('2022-11-17T00:22:02.903+05:30'));
  });

  it('unix seconds input', () => {
    expect(1697013935000000).toEqual(convertToMicroseconds('1697013935'));
  });

  it('unix miliseconds input', () => {
    expect(1697013935000000).toEqual(convertToMicroseconds('1697013935000'));
  });
});
