jest.mock('../../../../adapters/network');
import { PlatformError } from '@rudderstack/integrations-lib';
import { handleHttpRequest } from '../../../../adapters/network';
import {
  deduceModuleInfoV2,
  formatMultiSelectFieldsV2,
  calculateTrigger,
  searchRecordIdV2,
  getRegion,
  buildBatchedCOQLQueryWithIN,
  chunkByIdentifierLimit,
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
        status: false,
        message: 'No Leads is found for record identifier',
        apiResponse: {
          data: 'not-an-array',
        },
        apiStatus: 200,
        errorType: 'instrumentation',
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
        status: false,
        message: 'No Leads is found for record identifier',
        apiResponse: {},
        apiStatus: 200,
        errorType: 'instrumentation',
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
        status: false,
        message: 'No Leads is found for record identifier',
        apiResponse: {
          data: null,
        },
        apiStatus: 200,
        errorType: 'instrumentation',
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
        status: false,
        message: 'No Leads is found for record identifier',
        apiResponse: {
          data: [],
        },
        apiStatus: 200,
        errorType: 'instrumentation',
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
        status: true,
        records: [{ id: '123' }],
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
        status: true,
        records: [{ id: '123' }, { id: '456' }],
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
        status: false,
        apiStatus: 400,
        apiResponse: 'Bad Request Error',
      },
    },
    {
      fields: mockFields,
      query: mockQuery,
      module: mockConConfig.destination.object,
      name: 'should handle HTTP request error',
      error: new Error('Network Error'),
      expected: {
        status: false,
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
        status: false,
        message: 'Identifier values are not provided for Leads',
        errorType: 'instrumentation',
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

describe('buildBatchedCOQLQueryWithIN', () => {
  const testCases = [
    {
      name: 'should return empty string when filters array is empty',
      input: {
        module: 'Leads',
        filters: [],
        identifierFields: ['Email', 'Phone'],
      },
      expected: '',
    },
    {
      name: 'should return empty string when all filter values are empty/null/undefined',
      input: {
        module: 'Leads',
        filters: [
          { Email: '', Phone: null },
          { Email: undefined, Phone: '' },
        ],
        identifierFields: ['Email', 'Phone'],
      },
      expected: '',
    },
    {
      name: 'should build query with single field and single value',
      input: {
        module: 'Leads',
        filters: [{ Email: 'test@example.com' }],
        identifierFields: ['Email'],
      },
      expected: "SELECT id, Email FROM Leads WHERE Email in ('test@example.com')",
    },
    {
      name: 'should build query with single field and multiple values',
      input: {
        module: 'Leads',
        filters: [{ Email: 'a@test.com' }, { Email: 'b@test.com' }, { Email: 'c@test.com' }],
        identifierFields: ['Email'],
      },
      expected:
        "SELECT id, Email FROM Leads WHERE Email in ('a@test.com', 'b@test.com', 'c@test.com')",
    },
    {
      name: 'should deduplicate values across filters for same field',
      input: {
        module: 'Leads',
        filters: [
          { Email: 'duplicate@test.com', Phone: '123' },
          { Email: 'duplicate@test.com', Phone: '456' },
          { Email: 'unique@test.com', Phone: '123' },
        ],
        identifierFields: ['Email', 'Phone'],
      },
      expected:
        "SELECT id, Email, Phone FROM Leads WHERE (Email in ('duplicate@test.com', 'unique@test.com') OR Phone in ('123', '456'))",
    },
    {
      name: 'should handle numeric field values without quotes',
      input: {
        module: 'Leads',
        filters: [{ id: 100 }, { id: 200 }, { id: 300 }],
        identifierFields: ['id'],
      },
      expected: 'SELECT id FROM Leads WHERE id in (100, 200, 300)',
    },
    {
      name: 'should handle array values by joining with semicolons',
      input: {
        module: 'Leads',
        filters: [{ categories: ['cat1', 'cat2'] }, { categories: ['cat3', 'cat4', 'cat5'] }],
        identifierFields: ['categories'],
      },
      expected:
        "SELECT id, categories FROM Leads WHERE categories in ('cat1;cat2', 'cat3;cat4;cat5')",
    },
    {
      name: 'should escape single quotes in string values',
      input: {
        module: 'Leads',
        filters: [{ Name: "O'Brien" }, { Name: "D'Angelo" }],
        identifierFields: ['Name'],
      },
      expected: "SELECT id, Name FROM Leads WHERE Name in ('O\\'Brien', 'D\\'Angelo')",
    },
    {
      name: 'should process IN clause to 50 values',
      input: {
        module: 'Leads',
        filters: Array.from({ length: 50 }, (_, i) => ({ Email: `user${i}@test.com` })),
        identifierFields: ['Email'],
      },
      expected: `SELECT id, Email FROM Leads WHERE Email in (${Array.from({ length: 50 }, (_, i) => `'user${i}@test.com'`).join(', ')})`,
    },
    {
      name: 'should handle filters with partial field coverage',
      input: {
        module: 'Contacts',
        filters: [
          { Email: 'a@test.com', Phone: '111' },
          { Email: 'b@test.com' }, // No Phone
          { Phone: '222' }, // No Email
        ],
        identifierFields: ['Email', 'Phone'],
      },
      expected:
        "SELECT id, Email, Phone FROM Contacts WHERE (Email in ('a@test.com', 'b@test.com') OR Phone in ('111', '222'))",
    },
    {
      name: 'should handle boolean values as strings',
      input: {
        module: 'Leads',
        filters: [
          { Email: 'test@example.com', is_active: true },
          { Email: 'test2@example.com', is_active: false },
        ],
        identifierFields: ['Email', 'is_active'],
      },
      expected:
        "SELECT id, Email, is_active FROM Leads WHERE (Email in ('test@example.com', 'test2@example.com') OR is_active in ('true', 'false'))",
    },
    {
      name: 'should handle zero as a valid numeric value',
      input: {
        module: 'Leads',
        filters: [{ score: 0 }, { score: 100 }],
        identifierFields: ['score'],
      },
      expected: 'SELECT id, score FROM Leads WHERE score in (0, 100)',
    },
    {
      name: 'should handle 10 identifier fields with complex nested OR grouping',
      input: {
        module: 'Contacts',
        filters: [
          {
            Email: 'user1@test.com',
            Phone: '111-1111',
            External_ID: 'EXT001',
            Company: 'Acme Corp',
            Title: 'CEO',
            Country: 'US',
            City: 'New York',
            Zip: '10001',
            LinkedIn: 'linkedin.com/in/user1',
            Twitter: '@user1',
          },
          {
            Email: 'user2@test.com',
            Phone: '222-2222',
            External_ID: 'EXT002',
            Company: 'Tech Inc',
            Title: 'CTO',
            Country: 'CA',
            City: 'Toronto',
            Zip: 'M5H 2N2',
            LinkedIn: 'linkedin.com/in/user2',
            Twitter: '@user2',
          },
        ],
        identifierFields: [
          'Email',
          'Phone',
          'External_ID',
          'Company',
          'Title',
          'Country',
          'City',
          'Zip',
          'LinkedIn',
          'Twitter',
        ],
      },
      expected:
        "SELECT id, Email, Phone, External_ID, Company, Title, Country, City, Zip, LinkedIn, Twitter FROM Contacts WHERE ((Email in ('user1@test.com', 'user2@test.com') OR Phone in ('111-1111', '222-2222')) OR ((External_ID in ('EXT001', 'EXT002') OR Company in ('Acme Corp', 'Tech Inc')) OR ((Title in ('CEO', 'CTO') OR Country in ('US', 'CA')) OR ((City in ('New York', 'Toronto') OR Zip in ('10001', 'M5H 2N2')) OR (LinkedIn in ('linkedin.com/in/user1', 'linkedin.com/in/user2') OR Twitter in ('@user1', '@user2'))))))",
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      const result = buildBatchedCOQLQueryWithIN(
        input.module,
        input.filters,
        input.identifierFields,
      );
      expect(result).toBe(expected);
    });
  });
});

describe('chunkByIdentifierLimit', () => {
  // Helper function to count unique identifier values in a batch
  const countUniqueIdentifiers = (batch: any[]): Record<string, number> => {
    const uniqueValues: Record<string, Set<unknown>> = {};

    batch.forEach((event) => {
      const identifiers = event.message.identifiers;
      Object.entries(identifiers).forEach(([field, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          if (!uniqueValues[field]) {
            uniqueValues[field] = new Set();
          }
          const normalizedValue = Array.isArray(value) ? value.join(';') : value;
          uniqueValues[field].add(normalizedValue);
        }
      });
    });

    const counts: Record<string, number> = {};
    Object.entries(uniqueValues).forEach(([field, valueSet]) => {
      counts[field] = valueSet.size;
    });
    return counts;
  };

  const testCases = [
    {
      name: 'should return empty array when deletion queue is empty',
      input: {
        deletionQueue: [],
        maxValuesPerField: 50,
      },
      expected: 0, // Number of batches
    },
    {
      name: 'should create multiple batches when Phone hits limit first (10 unique emails, 100 unique phones)',
      input: {
        deletionQueue: Array.from({ length: 100 }, (_, i) => ({
          message: {
            identifiers: {
              Email: `user${i % 10}@test.com`, // Only 10 unique emails
              Phone: `phone${i}`, // 100 unique phones - this will hit limit at 50
            },
          },
          metadata: { jobId: i },
        })),
        maxValuesPerField: 50,
      },
      expected: 2, // Two batches because Phone hits 50 unique values first
      validateFirstBatch: (batch: any[]) => {
        expect(batch.length).toBe(50); // First 50 events (50 unique phones)
        const uniqueCounts = countUniqueIdentifiers(batch);
        expect(uniqueCounts.Email).toBe(10); // Only 10 unique emails
        expect(uniqueCounts.Phone).toBe(50); // Exactly 50 unique phones (at limit)
      },
      validateSecondBatch: (batch: any[]) => {
        expect(batch.length).toBe(50); // Remaining 50 events
        const uniqueCounts = countUniqueIdentifiers(batch);
        expect(uniqueCounts.Email).toBe(10); // Still only 10 unique emails
        expect(uniqueCounts.Phone).toBe(50); // Another 50 unique phones
      },
    },
    {
      name: 'should create multiple batches when Email hits limit first (100 unique emails)',
      input: {
        deletionQueue: Array.from({ length: 100 }, (_, i) => ({
          message: {
            identifiers: {
              Email: `user${i}@test.com`, // 100 unique emails
              Phone: `${i % 20}`, // Only 20 unique phones (cycles through 0-19)
            },
          },
          metadata: { jobId: i },
        })),
        maxValuesPerField: 50,
      },
      expected: 2, // Two batches because Email hits 50 unique values
      validateFirstBatch: (batch: any[]) => {
        expect(batch.length).toBe(50); // First 50 events (50 unique emails)
        const uniqueCounts = countUniqueIdentifiers(batch);
        expect(uniqueCounts.Email).toBe(50); // Exactly 50 unique emails (at limit)
        expect(uniqueCounts.Phone).toBeLessThanOrEqual(20); // At most 20 unique phones
      },
      validateSecondBatch: (batch: any[]) => {
        expect(batch.length).toBe(50); // Remaining 50 events
        const uniqueCounts = countUniqueIdentifiers(batch);
        expect(uniqueCounts.Email).toBe(50); // Another 50 unique emails
        expect(uniqueCounts.Phone).toBeLessThanOrEqual(20); // At most 20 unique phones
      },
    },
    {
      name: 'should handle events with only some identifiers present',
      input: {
        deletionQueue: [
          {
            message: { identifiers: { Email: 'a@test.com', Phone: '111' } },
            metadata: { jobId: 0 },
          },
          {
            message: { identifiers: { Email: 'b@test.com' } }, // No Phone
            metadata: { jobId: 1 },
          },
          {
            message: { identifiers: { Phone: '222' } }, // No Email
            metadata: { jobId: 2 },
          },
        ],
        maxValuesPerField: 50,
      },
      expected: 1, // Single batch, only 2 unique emails and 2 unique phones
      validateFirstBatch: (batch: any[]) => {
        expect(batch.length).toBe(3);
        const uniqueCounts = countUniqueIdentifiers(batch);
        expect(uniqueCounts.Email).toBe(2); // 2 unique emails (a, b)
        expect(uniqueCounts.Phone).toBe(2); // 2 unique phones (111, 222)
      },
    },
    {
      name: 'should handle null, undefined, and empty string values in identifiers',
      input: {
        deletionQueue: [
          {
            message: { identifiers: { Email: 'a@test.com', Phone: null } },
            metadata: { jobId: 0 },
          },
          {
            message: { identifiers: { Email: undefined, Phone: '111' } },
            metadata: { jobId: 1 },
          },
          {
            message: { identifiers: { Email: '', Phone: '222' } },
            metadata: { jobId: 2 },
          },
          {
            message: { identifiers: { Email: 'b@test.com', Phone: '333' } },
            metadata: { jobId: 3 },
          },
        ],
        maxValuesPerField: 50,
      },
      expected: 1, // Single batch, only 2 valid unique emails
      validateFirstBatch: (batch: any[]) => {
        expect(batch.length).toBe(4);
        const uniqueCounts = countUniqueIdentifiers(batch);
        expect(uniqueCounts.Email).toBe(2); // Only 2 valid emails (a, b) - null/undefined/empty ignored
        expect(uniqueCounts.Phone).toBe(3); // 3 valid phones (111, 222, 333) - null ignored
      },
    },
    {
      name: 'should handle array values in identifiers',
      input: {
        deletionQueue: Array.from({ length: 60 }, (_, i) => ({
          message: {
            identifiers: {
              Categories: [`cat${i}`, `cat${i + 1}`], // Arrays joined with semicolon
            },
          },
          metadata: { jobId: i },
        })),
        maxValuesPerField: 50,
      },
      expected: 2, // Two batches because we have 60 unique array combinations
      validateFirstBatch: (batch: any[]) => {
        expect(batch.length).toBe(50);
        const uniqueCounts = countUniqueIdentifiers(batch);
        expect(uniqueCounts.Categories).toBe(50); // 50 unique category combinations
      },
      validateSecondBatch: (batch: any[]) => {
        expect(batch.length).toBe(10);
        const uniqueCounts = countUniqueIdentifiers(batch);
        expect(uniqueCounts.Categories).toBe(10); // Remaining 10 unique combinations
      },
    },
    {
      name: 'should create new batch exactly when limit is reached (boundary test)',
      input: {
        deletionQueue: [
          // First 50 events with unique emails (fills to limit)
          ...Array.from({ length: 50 }, (_, i) => ({
            message: {
              identifiers: { Email: `user${i}@test.com` },
            },
            metadata: { jobId: i },
          })),
          // 51st event should trigger new batch
          {
            message: {
              identifiers: { Email: 'user50@test.com' },
            },
            metadata: { jobId: 50 },
          },
        ],
        maxValuesPerField: 50,
      },
      expected: 2, // Two batches: first with 50 events, second with 1 event
      validateFirstBatch: (batch: any[]) => {
        expect(batch.length).toBe(50);
        const uniqueCounts = countUniqueIdentifiers(batch);
        expect(uniqueCounts.Email).toBe(50); // Exactly 50 unique emails (at limit)
      },
      validateSecondBatch: (batch: any[]) => {
        expect(batch.length).toBe(1);
        const uniqueCounts = countUniqueIdentifiers(batch);
        expect(uniqueCounts.Email).toBe(1); // 1 unique email in second batch
      },
    },
    {
      name: 'should handle repeated identifiers across events (deduplication)',
      input: {
        deletionQueue: [
          // 100 events but only 10 unique email values (repeated 10 times each)
          ...Array.from({ length: 100 }, (_, i) => ({
            message: {
              identifiers: { Email: `user${i % 10}@test.com` },
            },
            metadata: { jobId: i },
          })),
        ],
        maxValuesPerField: 50,
      },
      expected: 1, // Single batch because only 10 unique emails
      validateFirstBatch: (batch: any[]) => {
        expect(batch.length).toBe(100);
        const uniqueCounts = countUniqueIdentifiers(batch);
        expect(uniqueCounts.Email).toBe(10); // Only 10 unique emails despite 100 events
      },
    },
    {
      name: 'should split when Phone hits limit before Email',
      input: {
        deletionQueue: [
          // First 30 events: unique phones, repeated emails (5 emails, 30 phones)
          ...Array.from({ length: 30 }, (_, i) => ({
            message: {
              identifiers: {
                Email: `user${i % 5}@test.com`, // Only 5 unique emails
                Phone: `phone${i}`, // 30 unique phones
              },
            },
            metadata: { jobId: i },
          })),
          // Next 25 events: more unique phones (total 55 phones)
          ...Array.from({ length: 25 }, (_, i) => ({
            message: {
              identifiers: {
                Email: `user${i % 5}@test.com`, // Still only 5 unique emails
                Phone: `phone${30 + i}`, // Phones 30-54 (total 55)
              },
            },
            metadata: { jobId: 30 + i },
          })),
        ],
        maxValuesPerField: 50,
      },
      expected: 2, // Two batches: Phone hits 50 after 50 events, then remaining 5 events
      validateFirstBatch: (batch: any[]) => {
        expect(batch.length).toBe(50); // First 50 events
        const uniqueCounts = countUniqueIdentifiers(batch);
        expect(uniqueCounts.Email).toBe(5); // Only 5 unique emails
        expect(uniqueCounts.Phone).toBe(50); // Exactly 50 unique phones (at limit)
      },
      validateSecondBatch: (batch: any[]) => {
        expect(batch.length).toBe(5); // Remaining 5 events
        const uniqueCounts = countUniqueIdentifiers(batch);
        expect(uniqueCounts.Email).toBe(5); // Still only 5 unique emails
        expect(uniqueCounts.Phone).toBe(5); // Remaining 5 unique phones (51-55)
      },
    },
  ];

  testCases.forEach(({ name, input, expected, validateFirstBatch, validateSecondBatch }: any) => {
    it(name, () => {
      const result = chunkByIdentifierLimit(input.deletionQueue, input.maxValuesPerField);

      expect(result.length).toBe(expected);

      if (validateFirstBatch && result.length > 0) {
        validateFirstBatch(result[0]);
      }

      if (validateSecondBatch && result.length > 1) {
        validateSecondBatch(result[1]);
      }
    });
  });
});
