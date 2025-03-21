const { processRecordInputs } = require('./transformRecordV2');

describe('processRecordInputs', () => {
  it('should return an empty array if no inputs are provided', async () => {
    const result = await processRecordInputs([]);
    expect(result).toEqual([]);
  });

  it('should return an empty array if no destination is provided', async () => {
    const result = await processRecordInputs(
      [
        {
          id: '1',
          metadata: {},
          type: 'record',
        },
      ],
      null,
    );
    expect(result).toEqual([]);
  });

  it('should return an empty array if no destination config is provided', async () => {
    const result = await processRecordInputs([], {
      destination: {
        config: {},
      },
    });
    expect(result).toEqual([]);
  });

  it('should return an empty array if no connection is provided', async () => {
    await expect(
      processRecordInputs(
        [
          {
            id: '1',
            metadata: {},
            type: 'record',
          },
        ],
        {
          destination: {
            Config: {
              Region: 'US',
            },
          },
        },
      ),
    ).rejects.toThrow('Connection destination config is required');
  });

  it('should return an empty array if no connection destination config is provided', async () => {
    await expect(
      processRecordInputs(
        [
          {
            id: '1',
            metadata: {},
            type: 'record',
            connection: {},
          },
        ],
        {
          destination: {
            Config: {
              Region: 'US',
            },
          },
        },
      ),
    ).rejects.toThrow('Connection destination config is required');
  });

  it('should return an empty array if no object and identifierMappings are provided in destination config', async () => {
    await expect(
      processRecordInputs(
        [
          {
            id: '1',
            metadata: {},
            type: 'record',
            destination: {
              config: { region: 'US' },
            },
            connection: {
              config: {
                destination: {},
              },
            },
          },
        ],
        { destination: { config: { region: 'US' } } },
      ),
    ).rejects.toThrow('Object and identifierMappings are required in destination config');
  });
});
