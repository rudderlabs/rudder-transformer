jest.mock('../../../../adapters/network');
import { PlatformError } from '@rudderstack/integrations-lib';
import { handleHttpRequest } from '../../../../adapters/network';
import {
  deduceModuleInfoV2,
  formatMultiSelectFieldsV2,
  calculateTrigger,
  searchRecordIdV2,
  getRegion,
} from './utils';
import { Destination } from '../../../../types';

describe('formatMultiSelectFieldsV2', () => {
  const testCases = [
    {
      name: 'should convert a field value to an array if a mapping exists in multiSelectFieldLevelDecision',
      input: {
        config: {
          object: 'Leads',
          identifierMappings: [],
          multiSelectFieldLevelDecision: [{ from: 'tags', to: 'true' }],
        },
        fields: { tags: 'value' },
      },
      expected: { tags: ['value'] },
    },
    {
      name: 'should leave fields unchanged if mapping fields exists but null',
      input: {
        config: {
          object: 'Leads',
          identifierMappings: [],
          multiSelectFieldLevelDecision: [{ from: 'tags', to: 'true' }],
        },
        fields: { tags: null, other: 'val' },
      },
      expected: { tags: null, other: 'val' },
    },
    {
      name: 'should leave fields unchanged if no mapping exists',
      input: {
        config: {
          object: 'Leads',
          identifierMappings: [],
          multiSelectFieldLevelDecision: [{ from: 'categories', to: 'true' }],
        },
        fields: { tags: 'value', other: 'val' },
      },
      expected: { tags: 'value', other: 'val' },
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      const result = formatMultiSelectFieldsV2(input.config, { ...input.fields });
      expect(result).toEqual(expected);
    });
  });
});

describe('calculateTrigger', () => {
  const testCases = [
    {
      name: 'should return null when trigger is "Default"',
      input: 'Default',
      expected: null,
    },
    {
      name: 'should return an empty array when trigger is "None"',
      input: 'None',
      expected: [],
    },
    {
      name: 'should return an array containing the trigger for Custom',
      input: 'Custom',
      expected: ['Custom'],
    },
    {
      name: 'should return an array containing the trigger for Approval',
      input: 'Approval',
      expected: ['Approval'],
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      expect(calculateTrigger(input)).toEqual(expected);
    });
  });
});

describe('searchRecordIdV2', () => {
  const mockFields = { Email: 'test@example.com' };
  const mockMetadata = { secret: { accessToken: 'mock-token' } };
  const mockConfig = { region: 'US' as const };
  const mockConConfig = {
    destination: {
      object: 'Leads',
      identifierMappings: [{ to: 'Email', from: 'Email' }],
      multiSelectFieldLevelDecision: [],
    },
  };
  const mockQuery = "SELECT id FROM Leads WHERE Email = 'test@example.com'";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    {
      fields: mockFields,
      module: mockConConfig.destination.object,
      query: mockQuery,
      name: 'should handle non-array response data',
      response: {
        httpResponse: Promise.resolve({}),
        processedResponse: {
          status: 200,
          response: {
            data: 'not-an-array',
          },
        },
      },
      expected: {
        erroneous: true,
        message: 'No Leads is found with record details',
      },
    },
    {
      fields: mockFields,
      query: mockQuery,
      module: mockConConfig.destination.object,
      name: 'should handle missing response data property',
      response: {
        httpResponse: Promise.resolve({}),
        processedResponse: {
          status: 200,
          response: {},
        },
      },
      expected: {
        erroneous: true,
        message: 'No Leads is found with record details',
      },
    },
    {
      fields: mockFields,
      query: mockQuery,
      module: mockConConfig.destination.object,
      name: 'should handle null response data',
      response: {
        httpResponse: Promise.resolve({}),
        processedResponse: {
          status: 200,
          response: {
            data: null,
          },
        },
      },
      expected: {
        erroneous: true,
        message: 'No Leads is found with record details',
      },
    },
    {
      fields: mockFields,
      query: mockQuery,
      module: mockConConfig.destination.object,
      name: 'should handle empty array response data',
      response: {
        httpResponse: Promise.resolve({}),
        processedResponse: {
          status: 200,
          response: {
            data: [],
          },
        },
      },
      expected: {
        erroneous: true,
        message: 'No Leads is found with record details',
      },
    },
    {
      fields: mockFields,
      query: mockQuery,
      module: mockConConfig.destination.object,
      name: 'should handle valid array response data with single record',
      response: {
        httpResponse: Promise.resolve({}),
        processedResponse: {
          status: 200,
          response: {
            data: [{ id: '123' }],
          },
        },
      },
      expected: {
        erroneous: false,
        message: ['123'],
      },
    },
    {
      fields: {
        Name: 'rid1927ce14265c006ae11555ec6e1cdbbac',
        Name1: 'Liam Bailey',
        Has_Chargeback: true,
        Last_Client_Purchase: '2021-06-15T00:00:00Z',
        Purchase_Category: ['category1', 'category2'],
        Lifetime_Client_Revenue: 1200,
        Name2: 'Olivia Smith',
        Has_Chargeback2: false,
        Last_Client_Purchase2: '2022-01-10T00:00:00Z',
        Purchase_Category2: ['category3', 'category4'],
        Lifetime_Client_Revenue2: 800,
        Name3: 'Noah Johnson',
        Has_Chargeback3: true,
        Last_Client_Purchase3: '2023-03-22T00:00:00Z',
        Purchase_Category3: ['category5'],
        Lifetime_Client_Revenue3: 1500,
        Name4: 'Emma Davis',
        Has_Chargeback4: false,
        Last_Client_Purchase4: '2023-07-01T00:00:00Z',
        Purchase_Category4: ['category6', 'category7'],
        Lifetime_Client_Revenue4: 900,
        Name5: 'James Wilson',
        Has_Chargeback5: true,
        Last_Client_Purchase5: '2022-11-05T00:00:00Z',
        Purchase_Category5: ['category8'],
        Lifetime_Client_Revenue5: 1100,
        Name6: 'Sophia Miller',
        Has_Chargeback6: false,
        Last_Client_Purchase6: '2024-01-12T00:00:00Z',
        Purchase_Category6: ['category9', 'category10'],
        Lifetime_Client_Revenue6: 1300,
      },
      module: mockConConfig.destination.object,
      query:
        "SELECT id FROM Leads WHERE ((Name = 'rid1927ce14265c006ae11555ec6e1cdbbac' AND Name1 = 'Liam Bailey') AND ((Has_Chargeback = 'true' AND Last_Client_Purchase = '2021-06-15T00:00:00Z') AND ((Purchase_Category = 'category1;category2' AND Lifetime_Client_Revenue = 1200) AND ((Name2 = 'Olivia Smith' AND Has_Chargeback2 = 'false') AND ((Last_Client_Purchase2 = '2022-01-10T00:00:00Z' AND Purchase_Category2 = 'category3;category4') AND ((Lifetime_Client_Revenue2 = 800 AND Name3 = 'Noah Johnson') AND ((Has_Chargeback3 = 'true' AND Last_Client_Purchase3 = '2023-03-22T00:00:00Z') AND ((Purchase_Category3 = 'category5' AND Lifetime_Client_Revenue3 = 1500) AND ((Name4 = 'Emma Davis' AND Has_Chargeback4 = 'false') AND ((Last_Client_Purchase4 = '2023-07-01T00:00:00Z' AND Purchase_Category4 = 'category6;category7') AND ((Lifetime_Client_Revenue4 = 900 AND Name5 = 'James Wilson') AND ((Has_Chargeback5 = 'true' AND Last_Client_Purchase5 = '2022-11-05T00:00:00Z') AND Purchase_Category5 = 'category8'))))))))))))",
      name: 'should handle valid array response data with multiple records',
      response: {
        httpResponse: Promise.resolve({}),
        processedResponse: {
          status: 200,
          response: {
            data: [{ id: '123' }, { id: '456' }],
          },
        },
      },
      expected: {
        erroneous: false,
        message: ['123', '456'],
      },
    },
    {
      fields: mockFields,
      query: mockQuery,
      module: mockConConfig.destination.object,
      name: 'should handle non-success HTTP status code',
      response: {
        httpResponse: Promise.resolve({}),
        processedResponse: {
          status: 400,
          response: 'Bad Request Error',
        },
      },
      expected: {
        erroneous: true,
        message: 'Bad Request Error',
      },
    },
    {
      fields: mockFields,
      query: mockQuery,
      module: mockConConfig.destination.object,
      name: 'should handle HTTP request error',
      error: new Error('Network Error'),
      expected: {
        erroneous: true,
        message: 'Network Error',
      },
    },
  ];

  testCases.forEach(({ name, response, error, expected, query, fields }) => {
    it(name, async () => {
      if (error) {
        jest.mocked(handleHttpRequest).mockRejectedValueOnce(error);
      } else {
        jest.mocked(handleHttpRequest).mockResolvedValueOnce(response);
      }

      const result = await searchRecordIdV2({
        identifiers: fields,
        metadata: mockMetadata,
        destination: { Config: mockConfig } as unknown as Destination,
        destConfig: mockConConfig.destination,
      });
      expect(handleHttpRequest).toHaveBeenCalledWith(
        'post',
        'https://www.zohoapis.com/crm/v6/coql',
        {
          select_query: query,
        },
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${mockMetadata.secret.accessToken}`,
          },
        },
        {
          destType: 'zoho',
          feature: 'deleteRecords',
          requestMethod: 'POST',
          endpointPath: 'https://www.zohoapis.com/crm/v6/coql',
          module: 'router',
        },
      );

      expect(result).toEqual(expected);
    });
  });

  const testCases2 = [
    {
      fields: {
        Email: '',
        phone: null,
        jobs: [],
      },
      query: mockQuery,
      module: mockConConfig.destination.object,
      name: 'should return intrumentation error when identifier value is empty',
      response: {
        httpResponse: Promise.resolve({}),
        processedResponse: {
          status: 200,
          response: {
            data: [{ id: '123' }],
          },
        },
      },
      expected: {
        erroneous: true,
        code: 'INSTRUMENTATION_ERROR',
        message: 'Identifier values are not provided for Leads',
      },
    },
  ];

  testCases2.forEach(({ name, expected, fields }) => {
    it(name, async () => {
      const result = await searchRecordIdV2({
        identifiers: fields,
        metadata: mockMetadata,
        destination: { Config: mockConfig } as unknown as Destination,
        destConfig: mockConConfig.destination,
      });
      expect(result).toEqual(expected);
    });
  });
});

describe('deduceModuleInfoV2', () => {
  const testCases = [
    {
      name: 'should return operationModuleInfo, upsertEndPoint and identifierType when conConfig is present',
      input: {
        destination: { Config: { region: 'US' as const } },
        destConfig: {
          object: 'Leads',
          identifierMappings: [{ to: 'Email', from: 'Email' }],
          multiSelectFieldLevelDecision: [],
        },
      },
      expected: {
        operationModuleType: 'Leads',
        upsertEndPoint: 'https://www.zohoapis.com/crm/v6/Leads',
        identifierType: ['Email'],
      },
    },
    {
      name: 'should handle different regions in config',
      input: {
        destination: { Config: { region: 'EU' as const } },
        destConfig: {
          object: 'Leads',
          identifierMappings: [{ to: 'Email', from: 'Email' }],
          multiSelectFieldLevelDecision: [],
        },
      },
      expected: {
        operationModuleType: 'Leads',
        upsertEndPoint: 'https://www.zohoapis.eu/crm/v6/Leads',
        identifierType: ['Email'],
      },
    },
    {
      name: 'should use default US region when config.region is null',
      input: {
        destination: { Config: {} },
        destConfig: {
          object: 'Leads',
          identifierMappings: [{ to: 'Email', from: 'Email' }],
          multiSelectFieldLevelDecision: [],
        },
      },
      expected: {
        operationModuleType: 'Leads',
        upsertEndPoint: 'https://www.zohoapis.com/crm/v6/Leads',
        identifierType: ['Email'],
      },
    },
    {
      name: 'should use default US region when config.region is undefined',
      input: {
        destination: { Config: {} }, // region is undefined
        destConfig: {
          object: 'Leads',
          identifierMappings: [{ to: 'Email', from: 'Email' }],
          multiSelectFieldLevelDecision: [],
        },
      },
      expected: {
        operationModuleType: 'Leads',
        upsertEndPoint: 'https://www.zohoapis.com/crm/v6/Leads',
        identifierType: ['Email'],
      },
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      const result = deduceModuleInfoV2(
        input.destination as unknown as Destination,
        input.destConfig,
      );
      expect(result).toEqual(expected);
    });
  });
});

describe('getRegion', () => {
  const testCases = [
    {
      name: 'should return region from delivery account options when delivery account exists with account definition',
      input: {
        deliveryAccount: {
          accountDefinition: {},
          options: {
            region: 'EU' as const,
          },
        },
        Config: {
          region: 'US' as const,
        },
      },
      expected: 'EU',
    },
    {
      name: 'should return region from delivery account options when delivery account exists with account definition and Config region is undefined',
      input: {
        deliveryAccount: {
          accountDefinition: {},
          options: {
            region: 'AU' as const,
          },
        },
        Config: {},
      },
      expected: 'AU',
    },
    {
      name: 'should throw PlatformError when delivery account exists with account definition but options.region is undefined',
      input: {
        deliveryAccount: {
          accountDefinition: {},
          options: {},
        },
        Config: {
          region: 'US' as const,
        },
      },
      expectError: true,
      errorType: PlatformError,
      errorMessage: 'Region is not defined in delivery account options',
      errorStatus: 500,
    },
    {
      name: 'should throw PlatformError when delivery account exists with account definition but options.region is null',
      input: {
        deliveryAccount: {
          accountDefinition: {},
          options: {
            region: undefined,
          },
        },
        Config: {
          region: 'US' as const,
        },
      },
      expectError: true,
      errorType: PlatformError,
      errorMessage: 'Region is not defined in delivery account options',
      errorStatus: 500,
    },
    {
      name: 'should throw PlatformError when delivery account exists with account definition but options is undefined',
      input: {
        deliveryAccount: {
          accountDefinition: {},
        },
        Config: {
          region: 'US' as const,
        },
      },
      expectError: true,
      errorType: PlatformError,
      errorMessage: 'Region is not defined in delivery account options',
      errorStatus: 500,
    },
    {
      name: 'should return region from Config when delivery account exists but no account definition',
      input: {
        deliveryAccount: {
          options: {
            region: 'EU' as const,
          },
        },
        Config: {
          region: 'US' as const,
        },
      },
      expected: 'US',
    },
    {
      name: 'should return region from Config when delivery account is undefined',
      input: {
        Config: {
          region: 'US' as const,
        },
      },
      expected: 'US',
    },
    {
      name: 'should return region from Config when delivery account is null',
      input: {
        deliveryAccount: undefined,
        Config: {
          region: 'EU' as const,
        },
      },
      expected: 'EU',
    },
    {
      name: 'should return undefined when no delivery account and Config.region is undefined',
      input: {
        Config: {},
      },
      expected: undefined,
    },
    {
      name: 'should return undefined when no delivery account and Config is undefined',
      input: {},
      expected: undefined,
    },
    {
      name: 'should return undefined when no delivery account and Config.region is explicitly undefined',
      input: {
        Config: {
          region: undefined,
        },
      },
      expected: undefined,
    },
  ];

  testCases.forEach(
    ({ name, input, expected, expectError, errorType, errorMessage, errorStatus }) => {
      const regionInput = input as unknown as Destination;
      it(name, () => {
        if (expectError) {
          expect(() => getRegion(regionInput)).toThrow(errorType);
          expect(() => getRegion(regionInput)).toThrow(errorMessage);

          // Test the error status code
          try {
            getRegion(regionInput);
          } catch (error: any) {
            expect(error.status).toBe(errorStatus);
          }
        } else {
          expect(getRegion(regionInput)).toBe(expected);
        }
      });
    },
  );
});
