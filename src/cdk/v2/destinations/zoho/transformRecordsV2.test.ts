import { processRecordInputsV2 } from './transformRecordV2';
import { ZohoRouterIORequest } from './types';
import { Destination } from '../../../../types';

describe('processRecordInputsV2', () => {
  it('should return an empty array if no inputs are provided', async () => {
    const result = await processRecordInputsV2([], undefined);
    expect(result).toEqual([]);
  });

  it('should return an empty array if no destination is provided', async () => {
    const result = await processRecordInputsV2(
      [
        {
          metadata: {
            secret: {
              accessToken: 'test-token',
            },
          },
          message: {},
        },
      ] as unknown as ZohoRouterIORequest[],
      undefined,
    );
    expect(result).toEqual([]);
  });

  it('should return an empty array if no destination config is provided', async () => {
    const result = await processRecordInputsV2([], {} as unknown as Destination);
    expect(result).toEqual([]);
  });

  it('should return an empty array if no connection is provided', async () => {
    await expect(
      processRecordInputsV2(
        [
          {
            metadata: {
              secret: {
                accessToken: 'test-token',
              },
            },
            message: {},
          },
        ] as unknown as ZohoRouterIORequest[],
        {
          Config: {
            region: 'US' as const,
          },
        } as unknown as Destination,
      ),
    ).rejects.toThrow('Connection destination config is required');
  });

  it('should return an empty array if no connection destination config is provided', async () => {
    await expect(
      processRecordInputsV2(
        [
          {
            metadata: {
              secret: {
                accessToken: 'test-token',
              },
            },
            message: {},
            connection: {},
          },
        ] as unknown as ZohoRouterIORequest[],
        {
          Config: {
            region: 'US' as const,
          },
        } as unknown as Destination,
      ),
    ).rejects.toThrow('Connection destination config is required');
  });

  it('should return an empty array if no object and identifierMappings are provided in destination config', async () => {
    await expect(
      processRecordInputsV2(
        [
          {
            metadata: {
              secret: {
                accessToken: 'test-token',
              },
            },
            message: {},
            connection: {
              config: {
                destination: {} as unknown as Destination,
              },
            },
          },
        ] as unknown as ZohoRouterIORequest[],
        { Config: { region: 'US' as const } } as unknown as Destination,
      ),
    ).rejects.toThrow('Object and identifierMappings are required in destination config');
  });
});
