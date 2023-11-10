import ControllerUtility from './index';

describe('adaptInputToVersion', () => {
  it('should return the input unchanged when the implementation version is not found', () => {
    const sourceType = 'NA_SOURCE';
    const requestVersion = 'v0';
    const input = [
      { key1: 'val1', key2: 'val2' },
      { key1: 'val1', key2: 'val2' },
      { key1: 'val1', key2: 'val2' },
    ];
    const expected = {
      implementationVersion: undefined,
      input: [
        { key1: 'val1', key2: 'val2' },
        { key1: 'val1', key2: 'val2' },
        { key1: 'val1', key2: 'val2' },
      ],
    };

    const result = ControllerUtility.adaptInputToVersion(sourceType, requestVersion, input);

    expect(result).toEqual(expected);
  });
  it('should return the input unchanged when the implementation version and request version are the same i.e. v0', () => {
    const sourceType = 'pipedream';
    const requestVersion = 'v0';
    const input = [
      { key1: 'val1', key2: 'val2' },
      { key1: 'val1', key2: 'val2' },
      { key1: 'val1', key2: 'val2' },
    ];
    const expected = {
      implementationVersion: 'v0',
      input: [
        { key1: 'val1', key2: 'val2' },
        { key1: 'val1', key2: 'val2' },
        { key1: 'val1', key2: 'val2' },
      ],
    };

    const result = ControllerUtility.adaptInputToVersion(sourceType, requestVersion, input);

    expect(result).toEqual(expected);
  });
  it('should return the input unchanged when the implementation version and request version are the same i.e. v1', () => {
    const sourceType = 'webhook';
    const requestVersion = 'v1';
    const input = [
      {
        event: { key1: 'val1', key2: 'val2' },
        source: { id: 'source_id', config: { configField1: 'configVal1' } },
      },
      {
        event: { key1: 'val1', key2: 'val2' },
        source: { id: 'source_id', config: { configField1: 'configVal1' } },
      },
      {
        event: { key1: 'val1', key2: 'val2' },
        source: { id: 'source_id', config: { configField1: 'configVal1' } },
      },
    ];
    const expected = {
      implementationVersion: 'v1',
      input: [
        {
          event: { key1: 'val1', key2: 'val2' },
          source: { id: 'source_id', config: { configField1: 'configVal1' } },
        },
        {
          event: { key1: 'val1', key2: 'val2' },
          source: { id: 'source_id', config: { configField1: 'configVal1' } },
        },
        {
          event: { key1: 'val1', key2: 'val2' },
          source: { id: 'source_id', config: { configField1: 'configVal1' } },
        },
      ],
    };

    const result = ControllerUtility.adaptInputToVersion(sourceType, requestVersion, input);

    expect(result).toEqual(expected);
  });
  it('should convert input from v0 to v1 when the request version is v0 and the implementation version is v1', () => {
    const sourceType = 'webhook';
    const requestVersion = 'v0';
    const input = [
      { key1: 'val1', key2: 'val2' },
      { key1: 'val1', key2: 'val2' },
      { key1: 'val1', key2: 'val2' },
    ];
    const expected = {
      implementationVersion: 'v1',
      input: [
        { event: { key1: 'val1', key2: 'val2' }, source: undefined },
        { event: { key1: 'val1', key2: 'val2' }, source: undefined },
        { event: { key1: 'val1', key2: 'val2' }, source: undefined },
      ],
    };

    const result = ControllerUtility.adaptInputToVersion(sourceType, requestVersion, input);

    expect(result).toEqual(expected);
  });

  it('should convert input from v1 to v0 format when the request version is v1 and the implementation version is v0', () => {
    const sourceType = 'pipedream';
    const requestVersion = 'v1';
    const input = [
      {
        event: { key1: 'val1', key2: 'val2' },
        source: { id: 'source_id', config: { configField1: 'configVal1' } },
      },
      {
        event: { key1: 'val1', key2: 'val2' },
        source: { id: 'source_id', config: { configField1: 'configVal1' } },
      },
      {
        event: { key1: 'val1', key2: 'val2' },
        source: { id: 'source_id', config: { configField1: 'configVal1' } },
      },
    ];
    const expected = {
      implementationVersion: 'v0',
      input: [
        { key1: 'val1', key2: 'val2' },
        { key1: 'val1', key2: 'val2' },
        { key1: 'val1', key2: 'val2' },
      ],
    };

    const result = ControllerUtility.adaptInputToVersion(sourceType, requestVersion, input);

    expect(result).toEqual(expected);
  });

  // Should return an empty array when the input is an empty array
  it('should return an empty array when the input is an empty array', () => {
    const sourceType = 'pipedream';
    const requestVersion = 'v1';
    const input = [];
    const expected = { implementationVersion: 'v0', input: [] };

    const result = ControllerUtility.adaptInputToVersion(sourceType, requestVersion, input);

    expect(result).toEqual(expected);
  });
});
