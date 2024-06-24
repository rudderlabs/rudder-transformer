const { getOneSignalAliases } = require('./util');

describe('getOneSignalAliases', () => {
  // returns aliases when integrationsObj contains aliases
  it('should return aliases when integrationsObj contains aliases', () => {
    const message = {
      someKey: 'someValue',
      integrations: { one_signal: { aliases: { alias1: 'value1' } } },
    };
    const result = getOneSignalAliases(message);
    expect(result).toEqual({ alias1: 'value1' });
  });

  // handles null or undefined message parameter gracefully
  it('should handle null or undefined message parameter gracefully', () => {
    let result = getOneSignalAliases(null);
    expect(result).toEqual({});
    result = getOneSignalAliases(undefined);
    expect(result).toEqual({});
  });

  // returns an empty object when integrationsObj does not contain aliases
  it('should return an empty object when integrationsObj does not contain aliases', () => {
    const message = { someKey: 'someValue', integrations: { one_signal: {} } };
    const result = getOneSignalAliases(message);
    expect(result).toEqual({});
  });

  // handles message parameter with unexpected structure
  it('should handle message parameter with unexpected structure', () => {
    const message = null;
    const result = getOneSignalAliases(message);
    expect(result).toEqual({});
  });
});
