const mockCacheGet = jest.fn();
const mockCacheSet = jest.fn();

jest.mock('../../../adapters/network');
jest.mock('../../util/cache', () =>
  jest.fn().mockImplementation(() => ({
    get: mockCacheGet,
    set: mockCacheSet,
  })),
);

import {
  getRequestData,
  extractIDsForSearchAPI,
  validatePayloadDataTypes,
  getObjectAndIdentifierType,
  removeHubSpotSystemField,
  isUpsertEnabled,
  isLookupFieldUnique,
} from './util';
import { primaryToSecondaryFields } from './config';
import { HubspotRudderMessage } from './types';
import { httpGET } from '../../../adapters/network';

const propertyMap: Record<string, string> = {
  firstName: 'string',
  lstName: 'string',
  age: 'number',
  city: 'string',
  isPaidPlan: 'bool',
  address: 'enumeration',
};

describe('Validate payload data types utility function test cases', () => {
  it('Should validate payload data type and return it', () => {
    const expectedOutput = 'rohan';
    expect(validatePayloadDataTypes(propertyMap, 'firstName', 'rohan', 'fn')).toEqual(
      expectedOutput,
    );
  });

  it('Should convert payload data type and return it', () => {
    const expectedOutput = { surname: 'shah' };
    expect(validatePayloadDataTypes(propertyMap, 'lastName', { surname: 'shah' }, 'ln')).toEqual(
      expectedOutput,
    );
  });

  it('Should convert payload data type and return it', () => {
    const expectedOutput = '45';
    expect(validatePayloadDataTypes(propertyMap, 'city', 45, 'city')).toEqual(expectedOutput);
  });

  it('Should throw an error as data type is not matching with hubspot data type', () => {
    const expectedOutput =
      'Property userAge data type string is not matching with Hubspot property data type number';
    try {
      const output = validatePayloadDataTypes(propertyMap, 'age', 'Twenty', 'userAge');
      expect(output).toEqual('');
    } catch (error: unknown) {
      expect((error as Error).message).toEqual(expectedOutput);
    }
  });
});

describe('getObjectAndIdentifierType utility test cases', () => {
  it('should return an object with objectType and identifierType properties when given a valid input', () => {
    const firstMessage = {
      type: 'identify',
      traits: {
        to: {
          id: 1,
        },
        from: {
          id: 940,
        },
      },
      userId: '1',
      context: {
        externalId: [
          {
            id: 1,
            type: 'HS-association',
            toObjectType: 'contacts',
            fromObjectType: 'companies',
            identifierType: 'id',
            associationTypeId: 'engineer',
          },
        ],
        mappedToDestination: 'true',
      },
    };
    const result = getObjectAndIdentifierType(firstMessage as unknown as HubspotRudderMessage);
    expect(result).toEqual({ objectType: 'association', identifierType: 'id' });
  });

  it('should throw an error when objectType or identifierType is not present in input', () => {
    const firstMessage = {
      type: 'identify',
      traits: {
        to: {
          id: 1,
        },
        from: {
          id: 940,
        },
      },
      userId: '1',
      context: {
        externalId: [
          {
            id: 1,
            type: 'HS-',
            toObjectType: 'contacts',
            fromObjectType: 'companies',
            associationTypeId: 'engineer',
          },
        ],
        mappedToDestination: 'true',
      },
    };
    try {
      getObjectAndIdentifierType(firstMessage as unknown as HubspotRudderMessage);
    } catch (err: unknown) {
      expect((err as Error).message).toBe('rETL - external Id not found.');
    }
  });
});

describe('extractUniqueValues utility test cases', () => {
  it('Should return an array of unique values', () => {
    const inputs = [
      {
        message: {
          context: {
            externalId: [
              {
                identifierType: 'email',
                id: 'testhubspot2@email.com',
                type: 'HS-lead',
              },
            ],
            mappedToDestination: true,
          },
        },
      },
      {
        message: {
          context: {
            externalId: [
              {
                identifierType: 'email',
                id: 'Testhubspot3@email.com',
                type: 'HS-lead',
              },
            ],
            mappedToDestination: true,
          },
        },
      },
      {
        message: {
          context: {
            externalId: [
              {
                identifierType: 'email',
                id: 'testhubspot4@email.com',
                type: 'HS-lead',
              },
            ],
            mappedToDestination: true,
          },
        },
      },
      {
        message: {
          context: {
            externalId: [
              {
                identifierType: 'email',
                id: 'testHUBSPOT5@email.com',
                type: 'HS-lead',
              },
            ],
            mappedToDestination: true,
          },
        },
      },
      {
        message: {
          context: {
            externalId: [
              {
                identifierType: 'email',
                id: 'testhubspot2@email.com',
                type: 'HS-lead',
              },
            ],
            mappedToDestination: true,
          },
        },
      },
    ];

    const result = extractIDsForSearchAPI(inputs as unknown as { message: HubspotRudderMessage }[]);

    expect(result).toEqual([
      'testhubspot2@email.com',
      'testhubspot3@email.com',
      'testhubspot4@email.com',
      'testhubspot5@email.com',
    ]);
  });

  it('Should return an empty array when the input is empty', () => {
    const inputs: { message: HubspotRudderMessage }[] = [];
    const result = extractIDsForSearchAPI(inputs);
    expect(result).toEqual([]);
  });
});

describe('getRequestDataAndRequestOptions utility test cases', () => {
  it('Should return an object with requestData and requestOptions', () => {
    const identifierType = 'email';
    const chunk = ['test1@gmail.com'];

    const expectedRequestData = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: identifierType,
              values: chunk,
              operator: 'IN',
            },
          ],
        },
        {
          filters: [
            {
              propertyName: primaryToSecondaryFields[identifierType],
              values: chunk,
              operator: 'IN',
            },
          ],
        },
      ],
      properties: [identifierType, primaryToSecondaryFields[identifierType]],
      limit: 100,
      after: 0,
    };

    const requestData = getRequestData(identifierType, chunk);
    expect(requestData).toEqual(expectedRequestData);
  });
});

describe('removeHubSpotSystemField utility test cases', () => {
  it('should remove HubSpot system fields from the properties', () => {
    const properties = {
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
      hs_object_id: '123',
    };

    const expectedOutput = {
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
    };

    const result = removeHubSpotSystemField(properties);
    expect(result).toEqual(expectedOutput);
  });

  it('should return the same object if no HubSpot system fields are present', () => {
    const properties = {
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
    };

    const expectedOutput = {
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
    };

    const result = removeHubSpotSystemField(properties);
    expect(result).toEqual(expectedOutput);
  });

  it('should handle an empty properties object', () => {
    const properties = {};
    const expectedOutput = {};

    const result = removeHubSpotSystemField(properties);
    expect(result).toEqual(expectedOutput);
  });
});

describe('isUpsertEnabled utility test cases', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables before each test
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.HUBSPOT_UPSERT_ENABLED_WORKSPACES;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return true when enabled is ALL', () => {
    process.env.HUBSPOT_UPSERT_ENABLED_WORKSPACES = 'ALL';
    const result = isUpsertEnabled('workspace123');
    expect(result).toBe(true);
  });

  it('should return true when enabled is all (case insensitive)', () => {
    process.env.HUBSPOT_UPSERT_ENABLED_WORKSPACES = 'all';
    const result = isUpsertEnabled('workspace123');
    expect(result).toBe(true);
  });

  it('should return true when workspace is in enabled list', () => {
    process.env.HUBSPOT_UPSERT_ENABLED_WORKSPACES = 'workspace123,workspace456,workspace789';
    const result = isUpsertEnabled('workspace456');
    expect(result).toBe(true);
  });

  it('should return false when workspace is not in enabled list', () => {
    process.env.HUBSPOT_UPSERT_ENABLED_WORKSPACES = 'workspace123,workspace456';
    const result = isUpsertEnabled('workspace999');
    expect(result).toBe(false);
  });

  it('should return false when enabled workspaces env is not set', () => {
    const result = isUpsertEnabled('workspace123');
    expect(result).toBe(false);
  });

  it('should return false when enabled workspaces env is empty string', () => {
    process.env.HUBSPOT_UPSERT_ENABLED_WORKSPACES = '';
    const result = isUpsertEnabled('workspace123');
    expect(result).toBe(false);
  });

});

describe('isLookupFieldUnique utility test cases', () => {
  const mockDestination = {
    ID: 'dest-123',
    Config: {
      authorizationType: 'newPrivateAppApi' as const,
      accessToken: 'test-token',
    },
  };
  const mockMetadata = { jobId: 1 };

  const createV3ApiResponse = (properties: Array<{ name: string; hasUniqueValue?: boolean }>) => ({
    success: true,
    response: {
      data: { results: properties },
      status: 200,
      headers: {},
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when lookup field has hasUniqueValue', async () => {
    const propertiesMap = { email: true, hs_object_id: true };
    mockCacheGet.mockResolvedValue(propertiesMap);

    const result = await isLookupFieldUnique(
      mockDestination as any,
      'email',
      mockMetadata as any,
    );

    expect(result).toBe(true);
    expect(mockCacheGet).toHaveBeenCalledWith('dest-123');
    expect(httpGET).not.toHaveBeenCalled();
  });

  it('should return false when lookup field does not have hasUniqueValue', async () => {
    const propertiesMap = { email: false, custom_field: false };
    mockCacheGet.mockResolvedValue(propertiesMap);

    const result = await isLookupFieldUnique(
      mockDestination as any,
      'email',
      mockMetadata as any,
    );

    expect(result).toBe(false);
  });

  it('should return false when lookup field is not in cached properties', async () => {
    const propertiesMap = { email: true };
    mockCacheGet
      .mockResolvedValueOnce(propertiesMap)
      .mockResolvedValueOnce({ email: true, new_custom_field: true });

    (httpGET as jest.Mock).mockResolvedValue(
      createV3ApiResponse([
        { name: 'email', hasUniqueValue: true },
        { name: 'new_custom_field', hasUniqueValue: true },
      ]),
    );

    const result = await isLookupFieldUnique(
      mockDestination as any,
      'new_custom_field',
      mockMetadata as any,
    );

    expect(result).toBe(true);
    expect(httpGET).toHaveBeenCalled();
    expect(mockCacheSet).toHaveBeenCalledWith(
      'dest-123',
      expect.objectContaining({ email: true, new_custom_field: true }),
    );
  });

  it('should fetch from API on cache miss and cache the result', async () => {
    mockCacheGet.mockReset();
    mockCacheGet.mockResolvedValue(undefined);

    (httpGET as jest.Mock).mockReset();
    (httpGET as jest.Mock).mockResolvedValue(
      createV3ApiResponse([
        { name: 'email', hasUniqueValue: true },
        { name: 'hs_object_id', hasUniqueValue: true },
      ]),
    );

    const result = await isLookupFieldUnique(
      mockDestination as any,
      'email',
      mockMetadata as any,
    );

    expect(result).toBe(true);
    expect(httpGET).toHaveBeenCalled();
    expect((httpGET as jest.Mock).mock.calls[0][0]).toContain('/crm/v3/properties/contacts');
    expect(mockCacheSet).toHaveBeenCalledWith(
      'dest-123',
      expect.objectContaining({ email: true, hs_object_id: true }),
    );
  });

  it('should return false when lookup field not found after API fetch', async () => {
    mockCacheGet.mockResolvedValue(undefined);

    (httpGET as jest.Mock).mockResolvedValue(
      createV3ApiResponse([{ name: 'email', hasUniqueValue: true }]),
    );

    const result = await isLookupFieldUnique(
      mockDestination as any,
      'nonexistent_field',
      mockMetadata as any,
    );

    expect(result).toBe(false);
  });
});
