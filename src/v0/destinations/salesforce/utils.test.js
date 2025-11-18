const {
  NetworkInstrumentationError,
  RetryableError,
  ThrottledError,
  AbortedError,
} = require('@rudderstack/integrations-lib');
const { handleHttpRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../util');
const { REFRESH_TOKEN } = require('../../../adapters/networkhandler/authConstants');
const {
  isWorkspaceSupportedForSoql,
  getSalesforceIdForRecordUsingHttp,
  getSalesforceIdForRecordUsingSdk,
  getSalesforceIdForRecord,
  getSalesforceIdForLeadUsingSdk,
  getSalesforceIdForLeadUsingHttp,
  getSalesforceIdForLead,
} = require('./utils');

// Mock dependencies
jest.mock('../../../adapters/network');
jest.mock('../../util', () => ({
  ...jest.requireActual('../../util'),
  isHttpStatusSuccess: jest.fn(),
  getAuthErrCategoryFromStCode: jest.fn((status) => 'AUTH_ERROR'),
}));

describe('Salesforce Utils', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.DEST_SALESFORCE_SOQL_SUPPORTED_WORKSPACE_IDS;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('isWorkspaceSupportedForSoql', () => {
    it('should return true when workspace ID is in the supported list', () => {
      process.env.DEST_SALESFORCE_SOQL_SUPPORTED_WORKSPACE_IDS = 'ws1,ws2,ws3';
      expect(isWorkspaceSupportedForSoql('ws2')).toBe(true);
    });

    it('should return false when workspace ID is not in the supported list', () => {
      process.env.DEST_SALESFORCE_SOQL_SUPPORTED_WORKSPACE_IDS = 'ws1,ws2,ws3';
      expect(isWorkspaceSupportedForSoql('ws4')).toBe(false);
    });

    it('should return false when environment variable is not set', () => {
      delete process.env.DEST_SALESFORCE_SOQL_SUPPORTED_WORKSPACE_IDS;
      expect(isWorkspaceSupportedForSoql('ws1')).toBe(false);
    });

    it('should return false when environment variable is empty', () => {
      process.env.DEST_SALESFORCE_SOQL_SUPPORTED_WORKSPACE_IDS = '';
      expect(isWorkspaceSupportedForSoql('ws1')).toBe(false);
    });

    it('should handle workspace IDs with spaces in the list', () => {
      process.env.DEST_SALESFORCE_SOQL_SUPPORTED_WORKSPACE_IDS = 'ws1, ws2 , ws3';
      expect(isWorkspaceSupportedForSoql('ws2')).toBe(true);
    });

    it('should return false for empty workspace ID', () => {
      process.env.DEST_SALESFORCE_SOQL_SUPPORTED_WORKSPACE_IDS = 'ws1,ws2';
      expect(isWorkspaceSupportedForSoql('')).toBe(false);
    });

    it('should return false for undefined workspace ID', () => {
      process.env.DEST_SALESFORCE_SOQL_SUPPORTED_WORKSPACE_IDS = 'ws1,ws2';
      expect(isWorkspaceSupportedForSoql(undefined)).toBe(false);
    });
  });

  describe('getSalesforceIdForRecordUsingHttp', () => {
    const mockDestination = { ID: 'dest-123' };
    const mockMetadata = { workspaceId: 'ws1' };
    const mockAuthInfo = {
      authorizationData: {
        instanceUrl: 'https://test.salesforce.com',
        token: 'test-token',
      },
      authorizationFlow: 'oauth',
    };

    beforeEach(() => {
      isHttpStatusSuccess.mockReturnValue(true);
    });

    it('should return Salesforce ID when record is found', async () => {
      const mockResponse = {
        response: {
          searchRecords: [
            {
              Id: '0011234567890ABC',
              External_ID__c: 'ext-123',
            },
          ],
        },
        status: 200,
      };

      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: mockResponse,
      });

      const result = await getSalesforceIdForRecordUsingHttp(
        'Account',
        'External_ID__c',
        'ext-123',
        { destination: mockDestination, metadata: mockMetadata },
        mockAuthInfo,
      );

      expect(result).toBe('0011234567890ABC');
      expect(handleHttpRequest).toHaveBeenCalledWith(
        'get',
        expect.stringContaining('/parameterizedSearch/'),
        expect.objectContaining({
          headers: expect.any(Object),
        }),
        expect.objectContaining({
          metadata: mockMetadata,
          destType: 'salesforce',
        }),
      );
    });

    it('should return undefined when record is not found', async () => {
      const mockResponse = {
        response: {
          searchRecords: [],
        },
        status: 200,
      };

      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: mockResponse,
      });

      const result = await getSalesforceIdForRecordUsingHttp(
        'Account',
        'External_ID__c',
        'ext-123',
        { destination: mockDestination, metadata: mockMetadata },
        mockAuthInfo,
      );

      expect(result).toBeUndefined();
    });

    it('should find record with matching identifier value', async () => {
      const mockResponse = {
        response: {
          searchRecords: [
            {
              Id: '0011234567890ABC',
              External_ID__c: 'ext-123',
            },
            {
              Id: '0011234567890XYZ',
              External_ID__c: 'ext-456',
            },
          ],
        },
        status: 200,
      };

      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: mockResponse,
      });

      const result = await getSalesforceIdForRecordUsingHttp(
        'Account',
        'External_ID__c',
        'ext-123',
        { destination: mockDestination, metadata: mockMetadata },
        mockAuthInfo,
      );

      expect(result).toBe('0011234567890ABC');
    });

    it('should handle numeric identifier values with type coercion', async () => {
      const mockResponse = {
        response: {
          searchRecords: [
            {
              Id: '0011234567890ABC',
              External_ID__c: 123, // numeric value
            },
          ],
        },
        status: 200,
      };

      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: mockResponse,
      });

      const result = await getSalesforceIdForRecordUsingHttp(
        'Account',
        'External_ID__c',
        '123', // string value
        { destination: mockDestination, metadata: mockMetadata },
        mockAuthInfo,
      );

      expect(result).toBe('0011234567890ABC');
    });

    it('should call salesforceResponseHandler when HTTP status is not success', async () => {
      const mockResponse = {
        response: [
          {
            errorCode: 'INVALID_SESSION_ID',
            message: 'Session expired',
          },
        ],
        status: 401,
      };

      isHttpStatusSuccess.mockReturnValue(false);
      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: mockResponse,
      });

      await expect(
        getSalesforceIdForRecordUsingHttp(
          'Account',
          'External_ID__c',
          'ext-123',
          { destination: mockDestination, metadata: mockMetadata },
          mockAuthInfo,
        ),
      ).rejects.toThrow(RetryableError);
    });

    it('should construct correct URL with all parameters', async () => {
      const mockResponse = {
        response: {
          searchRecords: [],
        },
        status: 200,
      };

      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: mockResponse,
      });

      await getSalesforceIdForRecordUsingHttp(
        'CustomObject__c',
        'CustomField__c',
        'custom-value',
        { destination: mockDestination, metadata: mockMetadata },
        mockAuthInfo,
      );

      const callArgs = handleHttpRequest.mock.calls[0];
      const url = callArgs[1];
      expect(url).toContain(`sobject=CustomObject__c`);
      expect(url).toContain(`in=CustomField__c`);
      expect(url).toContain(`q=custom-value`);
      expect(url).toContain(`CustomObject__c.fields=id,CustomField__c`);
    });
  });

  describe('getSalesforceIdForRecordUsingSdk', () => {
    let mockSalesforceSdk;

    beforeEach(() => {
      mockSalesforceSdk = {
        query: jest.fn(),
      };
    });

    it('should return Salesforce ID when single record is found', async () => {
      mockSalesforceSdk.query.mockResolvedValueOnce({
        totalSize: 1,
        records: [
          {
            Id: '0011234567890ABC',
          },
        ],
      });

      const result = await getSalesforceIdForRecordUsingSdk(
        mockSalesforceSdk,
        'Account',
        'External_ID__c',
        'ext-123',
      );

      expect(result).toBe('0011234567890ABC');
      expect(mockSalesforceSdk.query).toHaveBeenCalledWith(
        "SELECT Id FROM Account WHERE External_ID__c = 'ext-123'",
      );
    });

    it('should return undefined when no records are found', async () => {
      mockSalesforceSdk.query.mockResolvedValueOnce({
        totalSize: 0,
        records: [],
      });

      const result = await getSalesforceIdForRecordUsingSdk(
        mockSalesforceSdk,
        'Account',
        'External_ID__c',
        'ext-123',
      );

      expect(result).toBeUndefined();
    });

    it('should throw NetworkInstrumentationError when multiple records are found', async () => {
      mockSalesforceSdk.query.mockResolvedValueOnce({
        totalSize: 2,
        records: [{ Id: '0011234567890ABC' }, { Id: '0011234567890XYZ' }],
      });

      await expect(
        getSalesforceIdForRecordUsingSdk(mockSalesforceSdk, 'Account', 'External_ID__c', 'ext-123'),
      ).rejects.toThrow("Multiple Account records found with External_ID__c 'ext-123'");
    });

    it('should throw NetworkInstrumentationError when SDK query fails', async () => {
      const error = new Error('Query failed');
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      await expect(
        getSalesforceIdForRecordUsingSdk(mockSalesforceSdk, 'Account', 'External_ID__c', 'ext-123'),
      ).rejects.toThrow('Failed to query Salesforce: Query failed');
    });

    it('should throw RetryableError with REFRESH_TOKEN when error message contains "session expired" (lowercase)', async () => {
      const errorMessage = 'SOQL query failed: session expired or invalid';
      const error = new Error(errorMessage);
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      try {
        await getSalesforceIdForRecordUsingSdk(
          mockSalesforceSdk,
          'Account',
          'External_ID__c',
          'ext-123',
        );
        expect(true).toBe(false); // Should have thrown an error
      } catch (err) {
        // Verify error type
        expect(err).toBeInstanceOf(RetryableError);
        expect(err).not.toBeInstanceOf(NetworkInstrumentationError);

        // Verify exact message format
        expect(err.message).toBe(
          `Salesforce Request Failed - due to "INVALID_SESSION_ID", (Retryable) ${errorMessage}`,
        );
        expect(err.message).toContain('Salesforce Request Failed');
        expect(err.message).toContain('INVALID_SESSION_ID');
        expect(err.message).toContain('session expired');
        expect(err.message).toContain('Retryable');
        expect(err.message).toContain(errorMessage);

        // Verify auth error category
        expect(err.authErrorCategory).toBe(REFRESH_TOKEN);
        expect(err.authErrorCategory).toBeDefined();
        expect(err.authErrorCategory).not.toBeNull();
      }
    });

    it('should throw RetryableError with REFRESH_TOKEN when error message contains "SESSION EXPIRED" (uppercase)', async () => {
      const errorMessage = 'SOQL query failed: SESSION EXPIRED or invalid';
      const error = new Error(errorMessage);
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      try {
        await getSalesforceIdForRecordUsingSdk(
          mockSalesforceSdk,
          'Account',
          'External_ID__c',
          'ext-123',
        );
        expect(true).toBe(false); // Should have thrown an error
      } catch (err) {
        // Verify error type
        expect(err).toBeInstanceOf(RetryableError);
        expect(err).not.toBeInstanceOf(NetworkInstrumentationError);

        // Verify exact message format
        expect(err.message).toBe(
          `Salesforce Request Failed - due to "INVALID_SESSION_ID", (Retryable) ${errorMessage}`,
        );
        expect(err.message).toContain('Salesforce Request Failed');
        expect(err.message).toContain('INVALID_SESSION_ID');
        expect(err.message).toContain('SESSION EXPIRED');
        expect(err.message).toContain('Retryable');
        expect(err.message).toContain(errorMessage);

        // Verify auth error category
        expect(err.authErrorCategory).toBe(REFRESH_TOKEN);
        expect(err.authErrorCategory).toBeDefined();
        expect(err.authErrorCategory).not.toBeNull();
      }
    });

    it('should throw RetryableError with REFRESH_TOKEN when error message contains "Session Expired" (mixed case)', async () => {
      const errorMessage = 'SOQL query failed: Session Expired or invalid';
      const error = new Error(errorMessage);
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      try {
        await getSalesforceIdForRecordUsingSdk(
          mockSalesforceSdk,
          'Account',
          'External_ID__c',
          'ext-123',
        );
        expect(true).toBe(false); // Should have thrown an error
      } catch (err) {
        // Verify error type
        expect(err).toBeInstanceOf(RetryableError);
        expect(err).not.toBeInstanceOf(NetworkInstrumentationError);

        // Verify exact message format
        expect(err.message).toBe(
          `Salesforce Request Failed - due to "INVALID_SESSION_ID", (Retryable) ${errorMessage}`,
        );
        expect(err.message).toContain('Salesforce Request Failed');
        expect(err.message).toContain('INVALID_SESSION_ID');
        expect(err.message).toContain('Session Expired');
        expect(err.message).toContain('Retryable');
        expect(err.message).toContain(errorMessage);

        // Verify auth error category
        expect(err.authErrorCategory).toBe(REFRESH_TOKEN);
        expect(err.authErrorCategory).toBeDefined();
        expect(err.authErrorCategory).not.toBeNull();
      }
    });

    it('should throw NetworkInstrumentationError when error has no message property', async () => {
      const error = { name: 'Error' };
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      try {
        await getSalesforceIdForRecordUsingSdk(
          mockSalesforceSdk,
          'Account',
          'External_ID__c',
          'ext-123',
        );
        expect(true).toBe(false); // Should have thrown an error
      } catch (err) {
        expect(err).toBeInstanceOf(NetworkInstrumentationError);
        expect(err).not.toBeInstanceOf(RetryableError);
        expect(err.message).toBe('Failed to query Salesforce: undefined');
      }
    });

    it('should throw NetworkInstrumentationError when error message is null', async () => {
      const error = { message: null };
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      try {
        await getSalesforceIdForRecordUsingSdk(
          mockSalesforceSdk,
          'Account',
          'External_ID__c',
          'ext-123',
        );
        expect(true).toBe(false); // Should have thrown an error
      } catch (err) {
        expect(err).toBeInstanceOf(NetworkInstrumentationError);
        expect(err).not.toBeInstanceOf(RetryableError);
        expect(err.message).toBe('Failed to query Salesforce: null');
      }
    });

    it('should throw NetworkInstrumentationError when error message is undefined', async () => {
      const error = { message: undefined };
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      try {
        await getSalesforceIdForRecordUsingSdk(
          mockSalesforceSdk,
          'Account',
          'External_ID__c',
          'ext-123',
        );
        expect(true).toBe(false); // Should have thrown an error
      } catch (err) {
        expect(err).toBeInstanceOf(NetworkInstrumentationError);
        expect(err).not.toBeInstanceOf(RetryableError);
        expect(err.message).toBe('Failed to query Salesforce: undefined');
      }
    });

    it('should throw NetworkInstrumentationError when error message is a number', async () => {
      const error = { message: 500 };
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      try {
        await getSalesforceIdForRecordUsingSdk(
          mockSalesforceSdk,
          'Account',
          'External_ID__c',
          'ext-123',
        );
        expect(true).toBe(false); // Should have thrown an error
      } catch (err) {
        expect(err).toBeInstanceOf(NetworkInstrumentationError);
        expect(err.message).toBe('Failed to query Salesforce: 500');
      }
    });

    it('should throw NetworkInstrumentationError when error message is an object', async () => {
      const error = { message: { code: 500, detail: 'Internal error' } };
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      try {
        await getSalesforceIdForRecordUsingSdk(
          mockSalesforceSdk,
          'Account',
          'External_ID__c',
          'ext-123',
        );
        expect(true).toBe(false); // Should have thrown an error
      } catch (err) {
        expect(err).toBeInstanceOf(NetworkInstrumentationError);
        expect(err.message).toBe('Failed to query Salesforce: [object Object]');
      }
    });

    it('should throw NetworkInstrumentationError when error message is an array', async () => {
      const error = { message: ['Error 1', 'Error 2'] };
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      try {
        await getSalesforceIdForRecordUsingSdk(
          mockSalesforceSdk,
          'Account',
          'External_ID__c',
          'ext-123',
        );
        expect(true).toBe(false); // Should have thrown an error
      } catch (err) {
        expect(err).toBeInstanceOf(NetworkInstrumentationError);
        expect(err.message).toBe('Failed to query Salesforce: Error 1,Error 2');
      }
    });

    it('should throw NetworkInstrumentationError when error message is a boolean', async () => {
      const error = { message: true };
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      try {
        await getSalesforceIdForRecordUsingSdk(
          mockSalesforceSdk,
          'Account',
          'External_ID__c',
          'ext-123',
        );
        expect(true).toBe(false); // Should have thrown an error
      } catch (err) {
        expect(err).toBeInstanceOf(NetworkInstrumentationError);
        expect(err.message).toBe('Failed to query Salesforce: true');
      }
    });

    it('should handle special characters in identifier value', async () => {
      mockSalesforceSdk.query.mockResolvedValueOnce({
        totalSize: 1,
        records: [{ Id: '0011234567890ABC' }],
      });

      await getSalesforceIdForRecordUsingSdk(
        mockSalesforceSdk,
        'Account',
        'External_ID__c',
        "test'value",
      );

      expect(mockSalesforceSdk.query).toHaveBeenCalledWith(
        "SELECT Id FROM Account WHERE External_ID__c = 'test'value'",
      );
    });
  });

  describe('getSalesforceIdForRecord', () => {
    const mockDestination = { ID: 'dest-123' };
    const mockMetadata = { workspaceId: 'ws1' };
    const mockSalesforceSdk = {
      query: jest.fn(),
    };
    const mockAuthInfo = {
      authorizationData: {
        instanceUrl: 'https://test.salesforce.com',
        token: 'test-token',
      },
      authorizationFlow: 'oauth',
    };

    beforeEach(() => {
      jest.clearAllMocks();
      isHttpStatusSuccess.mockReturnValue(true);
    });

    it('should use SDK when workspace is supported for SOQL', async () => {
      process.env.DEST_SALESFORCE_SOQL_SUPPORTED_WORKSPACE_IDS = 'ws1';
      mockSalesforceSdk.query.mockResolvedValueOnce({
        totalSize: 1,
        records: [{ Id: '0011234567890ABC' }],
      });

      const stateInfo = {
        salesforceSdk: mockSalesforceSdk,
        authInfo: mockAuthInfo,
      };

      const result = await getSalesforceIdForRecord({
        objectType: 'Account',
        identifierType: 'External_ID__c',
        identifierValue: 'ext-123',
        destination: mockDestination,
        metadata: mockMetadata,
        stateInfo,
      });

      expect(result).toBe('0011234567890ABC');
      expect(mockSalesforceSdk.query).toHaveBeenCalled();
      expect(handleHttpRequest).not.toHaveBeenCalled();
    });

    it('should use HTTP when workspace is not supported for SOQL', async () => {
      process.env.DEST_SALESFORCE_SOQL_SUPPORTED_WORKSPACE_IDS = 'ws2';
      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: {
          response: {
            searchRecords: [{ Id: '0011234567890ABC', External_ID__c: 'ext-123' }],
          },
          status: 200,
        },
      });

      const stateInfo = {
        salesforceSdk: mockSalesforceSdk,
        authInfo: mockAuthInfo,
      };

      const result = await getSalesforceIdForRecord({
        objectType: 'Account',
        identifierType: 'External_ID__c',
        identifierValue: 'ext-123',
        destination: mockDestination,
        metadata: mockMetadata,
        stateInfo,
      });

      expect(result).toBe('0011234567890ABC');
      expect(handleHttpRequest).toHaveBeenCalled();
      expect(mockSalesforceSdk.query).not.toHaveBeenCalled();
    });

    it('should use HTTP when workspace ID is undefined', async () => {
      delete process.env.DEST_SALESFORCE_SOQL_SUPPORTED_WORKSPACE_IDS;
      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: {
          response: {
            searchRecords: [{ Id: '0011234567890ABC', External_ID__c: 'ext-123' }],
          },
          status: 200,
        },
      });

      const stateInfo = {
        salesforceSdk: mockSalesforceSdk,
        authInfo: mockAuthInfo,
      };

      const result = await getSalesforceIdForRecord({
        objectType: 'Account',
        identifierType: 'External_ID__c',
        identifierValue: 'ext-123',
        destination: mockDestination,
        metadata: { workspaceId: undefined },
        stateInfo,
      });

      expect(result).toBe('0011234567890ABC');
      expect(handleHttpRequest).toHaveBeenCalled();
    });
  });

  describe('getSalesforceIdForLeadUsingSdk', () => {
    let mockSalesforceSdk;
    const mockDestination = {
      Config: {
        useContactId: false,
      },
    };

    beforeEach(() => {
      mockSalesforceSdk = {
        query: jest.fn(),
      };
    });

    it('should return Lead ID when lead is found and not converted', async () => {
      mockSalesforceSdk.query.mockResolvedValueOnce({
        totalSize: 1,
        records: [
          {
            Id: '00Q1234567890ABC',
            IsConverted: false,
            ConvertedContactId: null,
            IsDeleted: false,
          },
        ],
      });

      const result = await getSalesforceIdForLeadUsingSdk(
        mockSalesforceSdk,
        'test@example.com',
        mockDestination,
      );

      expect(result).toEqual({
        salesforceType: 'Lead',
        salesforceId: '00Q1234567890ABC',
      });
      expect(mockSalesforceSdk.query).toHaveBeenCalledWith(
        "SELECT Id, IsConverted, ConvertedContactId, IsDeleted FROM Lead WHERE Email = 'test@example.com'",
      );
    });

    it('should return Contact ID when lead is converted and useContactId is true', async () => {
      mockSalesforceSdk.query.mockResolvedValueOnce({
        totalSize: 1,
        records: [
          {
            Id: '00Q1234567890ABC',
            IsConverted: true,
            ConvertedContactId: '0031234567890XYZ',
            IsDeleted: false,
          },
        ],
      });

      const destination = {
        Config: {
          useContactId: true,
        },
      };

      const result = await getSalesforceIdForLeadUsingSdk(
        mockSalesforceSdk,
        'test@example.com',
        destination,
      );

      expect(result).toEqual({
        salesforceType: 'Contact',
        salesforceId: '0031234567890XYZ',
      });
    });

    it('should return Lead ID when lead is converted but useContactId is false', async () => {
      mockSalesforceSdk.query.mockResolvedValueOnce({
        totalSize: 1,
        records: [
          {
            Id: '00Q1234567890ABC',
            IsConverted: true,
            ConvertedContactId: '0031234567890XYZ',
            IsDeleted: false,
          },
        ],
      });

      const result = await getSalesforceIdForLeadUsingSdk(
        mockSalesforceSdk,
        'test@example.com',
        mockDestination,
      );

      expect(result).toEqual({
        salesforceType: 'Lead',
        salesforceId: '00Q1234567890ABC',
      });
    });

    it('should return undefined salesforceId when no lead is found', async () => {
      mockSalesforceSdk.query.mockResolvedValueOnce({
        totalSize: 0,
        records: [],
      });

      const result = await getSalesforceIdForLeadUsingSdk(
        mockSalesforceSdk,
        'test@example.com',
        mockDestination,
      );

      expect(result).toEqual({
        salesforceType: 'Lead',
        salesforceId: undefined,
      });
    });

    it('should throw NetworkInstrumentationError when multiple leads are found', async () => {
      mockSalesforceSdk.query.mockResolvedValueOnce({
        totalSize: 2,
        records: [{ Id: '00Q1234567890ABC' }, { Id: '00Q1234567890XYZ' }],
      });

      await expect(
        getSalesforceIdForLeadUsingSdk(mockSalesforceSdk, 'test@example.com', mockDestination),
      ).rejects.toThrow("Multiple lead records found with email 'test@example.com'");
    });

    it('should throw NetworkInstrumentationError when deleted converted lead is found', async () => {
      mockSalesforceSdk.query.mockResolvedValueOnce({
        totalSize: 1,
        records: [
          {
            Id: '00Q1234567890ABC',
            IsConverted: true,
            ConvertedContactId: '0031234567890XYZ',
            IsDeleted: true,
          },
        ],
      });

      await expect(
        getSalesforceIdForLeadUsingSdk(mockSalesforceSdk, 'test@example.com', mockDestination),
      ).rejects.toThrow('The contact has been deleted');
    });

    it('should throw NetworkInstrumentationError when deleted non-converted lead is found', async () => {
      mockSalesforceSdk.query.mockResolvedValueOnce({
        totalSize: 1,
        records: [
          {
            Id: '00Q1234567890ABC',
            IsConverted: false,
            ConvertedContactId: null,
            IsDeleted: true,
          },
        ],
      });

      await expect(
        getSalesforceIdForLeadUsingSdk(mockSalesforceSdk, 'test@example.com', mockDestination),
      ).rejects.toThrow('The lead has been deleted.');
    });

    it('should throw NetworkInstrumentationError when converted lead has null ConvertedContactId and useContactId is true', async () => {
      mockSalesforceSdk.query.mockResolvedValueOnce({
        totalSize: 1,
        records: [
          {
            Id: '00Q1234567890ABC',
            IsConverted: true,
            ConvertedContactId: null,
            IsDeleted: false,
          },
        ],
      });

      const destination = {
        Config: {
          useContactId: true,
        },
      };

      await expect(
        getSalesforceIdForLeadUsingSdk(mockSalesforceSdk, 'test@example.com', destination),
      ).rejects.toThrow('The lead is converted but the converted contact id not found');
    });

    it('should throw NetworkInstrumentationError when SDK query fails', async () => {
      const error = new Error('Query failed');
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      await expect(
        getSalesforceIdForLeadUsingSdk(mockSalesforceSdk, 'test@example.com', mockDestination),
      ).rejects.toThrow('Failed to query Salesforce: Query failed');
    });

    it('should throw RetryableError with REFRESH_TOKEN when error message contains "session expired" (lowercase)', async () => {
      const errorMessage = 'SOQL query failed: session expired or invalid';
      const error = new Error(errorMessage);
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      try {
        await getSalesforceIdForLeadUsingSdk(
          mockSalesforceSdk,
          'test@example.com',
          mockDestination,
        );
        expect(true).toBe(false); // Should have thrown an error
      } catch (err) {
        // Verify error type
        expect(err).toBeInstanceOf(RetryableError);
        expect(err).not.toBeInstanceOf(NetworkInstrumentationError);

        // Verify exact message format
        expect(err.message).toBe(
          `Salesforce Request Failed - due to "INVALID_SESSION_ID", (Retryable) ${errorMessage}`,
        );
        expect(err.message).toContain('Salesforce Request Failed');
        expect(err.message).toContain('INVALID_SESSION_ID');
        expect(err.message).toContain('session expired');
        expect(err.message).toContain('Retryable');
        expect(err.message).toContain(errorMessage);

        // Verify auth error category
        expect(err.authErrorCategory).toBe(REFRESH_TOKEN);
        expect(err.authErrorCategory).toBeDefined();
        expect(err.authErrorCategory).not.toBeNull();
      }
    });

    it('should throw RetryableError with REFRESH_TOKEN when error message contains "SESSION EXPIRED" (uppercase)', async () => {
      const errorMessage = 'SOQL query failed: SESSION EXPIRED or invalid';
      const error = new Error(errorMessage);
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      try {
        await getSalesforceIdForLeadUsingSdk(
          mockSalesforceSdk,
          'test@example.com',
          mockDestination,
        );
        expect(true).toBe(false); // Should have thrown an error
      } catch (err) {
        // Verify error type
        expect(err).toBeInstanceOf(RetryableError);
        expect(err).not.toBeInstanceOf(NetworkInstrumentationError);

        // Verify exact message format
        expect(err.message).toBe(
          `Salesforce Request Failed - due to "INVALID_SESSION_ID", (Retryable) ${errorMessage}`,
        );
        expect(err.message).toContain('Salesforce Request Failed');
        expect(err.message).toContain('INVALID_SESSION_ID');
        expect(err.message).toContain('SESSION EXPIRED');
        expect(err.message).toContain('Retryable');
        expect(err.message).toContain(errorMessage);

        // Verify auth error category
        expect(err.authErrorCategory).toBe(REFRESH_TOKEN);
        expect(err.authErrorCategory).toBeDefined();
        expect(err.authErrorCategory).not.toBeNull();
      }
    });

    it('should throw RetryableError with REFRESH_TOKEN when error message contains "Session Expired" (mixed case)', async () => {
      const errorMessage = 'SOQL query failed: Session Expired or invalid';
      const error = new Error(errorMessage);
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      try {
        await getSalesforceIdForLeadUsingSdk(
          mockSalesforceSdk,
          'test@example.com',
          mockDestination,
        );
        expect(true).toBe(false); // Should have thrown an error
      } catch (err) {
        // Verify error type
        expect(err).toBeInstanceOf(RetryableError);
        expect(err).not.toBeInstanceOf(NetworkInstrumentationError);

        // Verify exact message format
        expect(err.message).toBe(
          `Salesforce Request Failed - due to "INVALID_SESSION_ID", (Retryable) ${errorMessage}`,
        );
        expect(err.message).toContain('Salesforce Request Failed');
        expect(err.message).toContain('INVALID_SESSION_ID');
        expect(err.message).toContain('Session Expired');
        expect(err.message).toContain('Retryable');
        expect(err.message).toContain(errorMessage);

        // Verify auth error category
        expect(err.authErrorCategory).toBe(REFRESH_TOKEN);
        expect(err.authErrorCategory).toBeDefined();
        expect(err.authErrorCategory).not.toBeNull();
      }
    });

    it('should throw NetworkInstrumentationError when error has no message property', async () => {
      const error = { name: 'Error' };
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      try {
        await getSalesforceIdForLeadUsingSdk(
          mockSalesforceSdk,
          'test@example.com',
          mockDestination,
        );
        expect(true).toBe(false); // Should have thrown an error
      } catch (err) {
        expect(err).toBeInstanceOf(NetworkInstrumentationError);
        expect(err).not.toBeInstanceOf(RetryableError);
        expect(err.message).toBe('Failed to query Salesforce: undefined');
      }
    });

    it('should throw NetworkInstrumentationError when error message is null', async () => {
      const error = { message: null };
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      try {
        await getSalesforceIdForLeadUsingSdk(
          mockSalesforceSdk,
          'test@example.com',
          mockDestination,
        );
        expect(true).toBe(false); // Should have thrown an error
      } catch (err) {
        expect(err).toBeInstanceOf(NetworkInstrumentationError);
        expect(err).not.toBeInstanceOf(RetryableError);
        expect(err.message).toBe('Failed to query Salesforce: null');
      }
    });

    it('should throw NetworkInstrumentationError when error message is undefined', async () => {
      const error = { message: undefined };
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      try {
        await getSalesforceIdForLeadUsingSdk(
          mockSalesforceSdk,
          'test@example.com',
          mockDestination,
        );
        expect(true).toBe(false); // Should have thrown an error
      } catch (err) {
        expect(err).toBeInstanceOf(NetworkInstrumentationError);
        expect(err).not.toBeInstanceOf(RetryableError);
        expect(err.message).toBe('Failed to query Salesforce: undefined');
      }
    });

    it('should throw NetworkInstrumentationError when error message is a number', async () => {
      const error = { message: 500 };
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      try {
        await getSalesforceIdForLeadUsingSdk(
          mockSalesforceSdk,
          'test@example.com',
          mockDestination,
        );
        expect(true).toBe(false); // Should have thrown an error
      } catch (err) {
        expect(err).toBeInstanceOf(NetworkInstrumentationError);
        expect(err.message).toBe('Failed to query Salesforce: 500');
      }
    });

    it('should throw NetworkInstrumentationError when error message is an object', async () => {
      const error = { message: { code: 500, detail: 'Internal error' } };
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      try {
        await getSalesforceIdForLeadUsingSdk(
          mockSalesforceSdk,
          'test@example.com',
          mockDestination,
        );
        expect(true).toBe(false); // Should have thrown an error
      } catch (err) {
        expect(err).toBeInstanceOf(NetworkInstrumentationError);
        expect(err.message).toBe('Failed to query Salesforce: [object Object]');
      }
    });

    it('should throw NetworkInstrumentationError when error message is an array', async () => {
      const error = { message: ['Error 1', 'Error 2'] };
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      try {
        await getSalesforceIdForLeadUsingSdk(
          mockSalesforceSdk,
          'test@example.com',
          mockDestination,
        );
        expect(true).toBe(false); // Should have thrown an error
      } catch (err) {
        expect(err).toBeInstanceOf(NetworkInstrumentationError);
        expect(err.message).toBe('Failed to query Salesforce: Error 1,Error 2');
      }
    });

    it('should throw NetworkInstrumentationError when error message is a boolean', async () => {
      const error = { message: true };
      mockSalesforceSdk.query.mockRejectedValueOnce(error);

      try {
        await getSalesforceIdForLeadUsingSdk(
          mockSalesforceSdk,
          'test@example.com',
          mockDestination,
        );
        expect(true).toBe(false); // Should have thrown an error
      } catch (err) {
        expect(err).toBeInstanceOf(NetworkInstrumentationError);
        expect(err.message).toBe('Failed to query Salesforce: true');
      }
    });
  });

  describe('getSalesforceIdForLeadUsingHttp', () => {
    const mockDestination = {
      ID: 'dest-123',
      Config: {
        useContactId: false,
      },
    };
    const mockMetadata = { workspaceId: 'ws1' };
    const mockAuthInfo = {
      authorizationData: {
        instanceUrl: 'https://test.salesforce.com',
        token: 'test-token',
      },
      authorizationFlow: 'oauth',
    };

    beforeEach(() => {
      isHttpStatusSuccess.mockReturnValue(true);
    });

    it('should return Lead ID when lead is found and not converted', async () => {
      const mockResponse = {
        response: {
          searchRecords: [
            {
              Id: '00Q1234567890ABC',
              IsConverted: false,
              ConvertedContactId: null,
              IsDeleted: false,
            },
          ],
        },
        status: 200,
      };

      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: mockResponse,
      });

      const result = await getSalesforceIdForLeadUsingHttp(
        'test@example.com',
        mockDestination,
        mockAuthInfo,
        mockMetadata,
      );

      expect(result).toEqual({
        salesforceType: 'Lead',
        salesforceId: '00Q1234567890ABC',
      });
      expect(handleHttpRequest).toHaveBeenCalledWith(
        'get',
        expect.stringContaining('/parameterizedSearch/'),
        expect.objectContaining({
          headers: expect.any(Object),
        }),
        expect.objectContaining({
          metadata: mockMetadata,
        }),
      );
    });

    it('should return Contact ID when lead is converted and useContactId is true', async () => {
      const mockResponse = {
        response: {
          searchRecords: [
            {
              Id: '00Q1234567890ABC',
              IsConverted: true,
              ConvertedContactId: '0031234567890XYZ',
              IsDeleted: false,
            },
          ],
        },
        status: 200,
      };

      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: mockResponse,
      });

      const destination = {
        ...mockDestination,
        Config: {
          useContactId: true,
        },
      };

      const result = await getSalesforceIdForLeadUsingHttp(
        'test@example.com',
        destination,
        mockAuthInfo,
        mockMetadata,
      );

      expect(result).toEqual({
        salesforceType: 'Contact',
        salesforceId: '0031234567890XYZ',
      });
    });

    it('should return Lead ID when lead is converted but useContactId is false', async () => {
      const mockResponse = {
        response: {
          searchRecords: [
            {
              Id: '00Q1234567890ABC',
              IsConverted: true,
              ConvertedContactId: '0031234567890XYZ',
              IsDeleted: false,
            },
          ],
        },
        status: 200,
      };

      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: mockResponse,
      });

      const result = await getSalesforceIdForLeadUsingHttp(
        'test@example.com',
        mockDestination,
        mockAuthInfo,
        mockMetadata,
      );

      expect(result).toEqual({
        salesforceType: 'Lead',
        salesforceId: '00Q1234567890ABC',
      });
    });

    it('should return undefined salesforceId when no lead is found', async () => {
      const mockResponse = {
        response: {
          searchRecords: [],
        },
        status: 200,
      };

      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: mockResponse,
      });

      const result = await getSalesforceIdForLeadUsingHttp(
        'test@example.com',
        mockDestination,
        mockAuthInfo,
        mockMetadata,
      );

      expect(result).toEqual({
        salesforceType: 'Lead',
        salesforceId: undefined,
      });
    });

    it('should throw NetworkInstrumentationError when deleted converted lead is found', async () => {
      const mockResponse = {
        response: {
          searchRecords: [
            {
              Id: '00Q1234567890ABC',
              IsConverted: true,
              ConvertedContactId: '0031234567890XYZ',
              IsDeleted: true,
            },
          ],
        },
        status: 200,
      };

      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: mockResponse,
      });

      await expect(
        getSalesforceIdForLeadUsingHttp(
          'test@example.com',
          mockDestination,
          mockAuthInfo,
          mockMetadata,
        ),
      ).rejects.toThrow('The contact has been deleted.');
    });

    it('should throw NetworkInstrumentationError when deleted non-converted lead is found', async () => {
      const mockResponse = {
        response: {
          searchRecords: [
            {
              Id: '00Q1234567890ABC',
              IsConverted: false,
              ConvertedContactId: null,
              IsDeleted: true,
            },
          ],
        },
        status: 200,
      };

      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: mockResponse,
      });

      await expect(
        getSalesforceIdForLeadUsingHttp(
          'test@example.com',
          mockDestination,
          mockAuthInfo,
          mockMetadata,
        ),
      ).rejects.toThrow('The lead has been deleted.');
    });

    it('should call salesforceResponseHandler when HTTP status is not success', async () => {
      const mockResponse = {
        response: [
          {
            errorCode: 'INVALID_SESSION_ID',
            message: 'Session expired',
          },
        ],
        status: 401,
      };

      isHttpStatusSuccess.mockReturnValue(false);
      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: mockResponse,
      });

      await expect(
        getSalesforceIdForLeadUsingHttp(
          'test@example.com',
          mockDestination,
          mockAuthInfo,
          mockMetadata,
        ),
      ).rejects.toThrow(RetryableError);
    });

    it('should encode email in URL', async () => {
      const mockResponse = {
        response: {
          searchRecords: [],
        },
        status: 200,
      };

      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: mockResponse,
      });

      await getSalesforceIdForLeadUsingHttp(
        'test+email@example.com',
        mockDestination,
        mockAuthInfo,
        mockMetadata,
      );

      const callArgs = handleHttpRequest.mock.calls[0];
      const url = callArgs[1];
      expect(url).toContain(encodeURIComponent('test+email@example.com'));
    });
  });

  describe('getSalesforceIdForLead', () => {
    const mockDestination = {
      ID: 'dest-123',
      Config: {
        useContactId: false,
      },
    };
    const mockMetadata = { workspaceId: 'ws1' };
    const mockSalesforceSdk = {
      query: jest.fn(),
    };
    const mockAuthInfo = {
      authorizationData: {
        instanceUrl: 'https://test.salesforce.com',
        token: 'test-token',
      },
      authorizationFlow: 'oauth',
    };

    beforeEach(() => {
      jest.clearAllMocks();
      isHttpStatusSuccess.mockReturnValue(true);
    });

    it('should use SDK when workspace is supported for SOQL', async () => {
      process.env.DEST_SALESFORCE_SOQL_SUPPORTED_WORKSPACE_IDS = 'ws1';
      mockSalesforceSdk.query.mockResolvedValueOnce({
        totalSize: 1,
        records: [
          {
            Id: '00Q1234567890ABC',
            IsConverted: false,
            ConvertedContactId: null,
            IsDeleted: false,
          },
        ],
      });

      const stateInfo = {
        salesforceSdk: mockSalesforceSdk,
        authInfo: mockAuthInfo,
      };

      const result = await getSalesforceIdForLead({
        email: 'test@example.com',
        destination: mockDestination,
        metadata: mockMetadata,
        stateInfo,
      });

      expect(result).toEqual({
        salesforceType: 'Lead',
        salesforceId: '00Q1234567890ABC',
      });
      expect(mockSalesforceSdk.query).toHaveBeenCalled();
      expect(handleHttpRequest).not.toHaveBeenCalled();
    });

    it('should use HTTP when workspace is not supported for SOQL', async () => {
      process.env.DEST_SALESFORCE_SOQL_SUPPORTED_WORKSPACE_IDS = 'ws2';
      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: {
          response: {
            searchRecords: [
              {
                Id: '00Q1234567890ABC',
                IsConverted: false,
                ConvertedContactId: null,
                IsDeleted: false,
              },
            ],
          },
          status: 200,
        },
      });

      const stateInfo = {
        salesforceSdk: mockSalesforceSdk,
        authInfo: mockAuthInfo,
      };

      const result = await getSalesforceIdForLead({
        email: 'test@example.com',
        destination: mockDestination,
        metadata: mockMetadata,
        stateInfo,
      });

      expect(result).toEqual({
        salesforceType: 'Lead',
        salesforceId: '00Q1234567890ABC',
      });
      expect(handleHttpRequest).toHaveBeenCalled();
      expect(mockSalesforceSdk.query).not.toHaveBeenCalled();
    });

    it('should use HTTP when workspace ID is undefined', async () => {
      delete process.env.DEST_SALESFORCE_SOQL_SUPPORTED_WORKSPACE_IDS;
      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: {
          response: {
            searchRecords: [
              {
                Id: '00Q1234567890ABC',
                IsConverted: false,
                ConvertedContactId: null,
                IsDeleted: false,
              },
            ],
          },
          status: 200,
        },
      });

      const stateInfo = {
        salesforceSdk: mockSalesforceSdk,
        authInfo: mockAuthInfo,
      };

      const result = await getSalesforceIdForLead({
        email: 'test@example.com',
        destination: mockDestination,
        metadata: { workspaceId: undefined },
        stateInfo,
      });

      expect(result).toEqual({
        salesforceType: 'Lead',
        salesforceId: '00Q1234567890ABC',
      });
      expect(handleHttpRequest).toHaveBeenCalled();
    });
  });
});
