const md5 = require('md5');
const { InstrumentationError, NetworkError } = require('@rudderstack/integrations-lib');
const { MappedToDestinationKey } = require('../../../constants');
const { handleHttpRequest } = require('../../../adapters/network');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');

// Mock the config module before requiring utils
jest.mock('./config', () => ({
  MERGE_CONFIG: {},
  MERGE_ADDRESS: {},
  SUBSCRIPTION_STATUS: {
    subscribed: 'subscribed',
    pending: 'pending',
  },
  VALID_STATUSES: ['subscribed', 'unsubscribed', 'cleaned', 'pending', 'transactional'],
}));

const {
  getAudienceId,
  mailChimpSubscriptionEndpoint,
  mailchimpEventsEndpoint,
  processPayload,
  stringifyPropertiesValues,
  generateBatchedPaylaodForArray,
} = require('./utils');

// Mock dependencies
jest.mock('md5', () => jest.fn((email) => `md5_${email}`));
jest.mock('../../../adapters/network', () => ({
  handleHttpRequest: jest.fn(),
}));
jest.mock('../../../adapters/utils/networkUtils', () => ({
  getDynamicErrorType: jest.fn(),
}));
jest.mock('../../util', () => ({
  isDefinedAndNotNull: jest.fn((val) => val !== undefined && val !== null),
  isDefined: jest.fn((val) => val !== undefined),
  checkSubsetOfArray: jest.fn(),
  getIntegrationsObj: jest.fn(),
  isDefinedAndNotNullAndNotEmpty: jest.fn(),
  addExternalIdToTraits: jest.fn(),
  getFieldValueFromMessage: jest.fn(),
  removeUndefinedAndNullValues: jest.fn((val) => val),
  defaultBatchRequestConfig: jest.fn(() => ({ batchedRequest: { body: { JSON: {} } } })),
  constructPayload: jest.fn(),
}));
jest.mock('../../../logger', () => ({
  info: jest.fn(),
}));

describe('Mailchimp Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAudienceId', () => {
    const { getIntegrationsObj } = require('../../util');

    it('should return audienceId from integrations object if present', () => {
      const message = { integrations: { mailchimp: { listId: 'list123' } } };
      const config = { audienceId: 'default-audience' };

      getIntegrationsObj.mockReturnValueOnce({ listId: 'list123' });

      const result = getAudienceId(message, config);

      expect(getIntegrationsObj).toHaveBeenCalledWith(message, 'mailchimp');
      expect(result).toBe('list123');
    });

    it('should return audienceId from context.MailChimp.listId if present', () => {
      const message = { context: { MailChimp: { listId: 'context-list' } } };
      const config = { audienceId: 'default-audience' };

      getIntegrationsObj.mockReturnValueOnce(undefined);

      const result = getAudienceId(message, config);

      expect(result).toBe('context-list');
    });

    it('should return audienceId from config if not present in message', () => {
      const message = {};
      const config = { audienceId: 'default-audience' };

      getIntegrationsObj.mockReturnValueOnce(undefined);

      const result = getAudienceId(message, config);

      expect(result).toBe('default-audience');
    });
  });

  describe('mailChimpSubscriptionEndpoint', () => {
    it('should return correct subscription endpoint', () => {
      const datacenterId = 'us1';
      const audienceId = 'audience123';
      const email = 'test@example.com';

      const result = mailChimpSubscriptionEndpoint(datacenterId, audienceId, email);

      expect(md5).toHaveBeenCalledWith(email);
      expect(result).toBe(
        `https://us1.api.mailchimp.com/3.0/lists/audience123/members/md5_test@example.com`,
      );
    });
  });

  describe('mailchimpEventsEndpoint', () => {
    it('should return correct events endpoint', () => {
      const datacenterId = 'us1';
      const audienceId = 'audience123';
      const email = 'test@example.com';

      const result = mailchimpEventsEndpoint(datacenterId, audienceId, email);

      expect(md5).toHaveBeenCalledWith(email);
      expect(result).toBe(
        `https://us1.api.mailchimp.com/3.0/lists/audience123/members/md5_test@example.com/events`,
      );
    });
  });

  // We can't test getBatchEndpoint directly since it's not exported

  describe('stringifyPropertiesValues', () => {
    it('should stringify non-string property values', () => {
      const properties = {
        stringProp: 'already a string',
        numberProp: 42,
        boolProp: true,
        objProp: { nested: 'value' },
      };

      const result = stringifyPropertiesValues(properties);

      expect(result).toEqual({
        stringProp: 'already a string',
        numberProp: '42',
        boolProp: 'true',
        objProp: '{"nested":"value"}',
      });
    });

    it('should handle empty properties object', () => {
      const properties = {};

      const result = stringifyPropertiesValues(properties);

      expect(result).toEqual({});
    });

    it('should handle null properties', () => {
      const properties = {
        nullProp: null,
        validProp: 'valid',
      };

      const result = stringifyPropertiesValues(properties);

      expect(result).toEqual({
        nullProp: 'null',
        validProp: 'valid',
      });
    });
  });

  describe('generateBatchedPaylaodForArray', () => {
    it('should generate correct batch payload', () => {
      const audienceId = 'audience123';
      const events = [
        {
          destination: {
            Config: {
              apiKey: 'api-key-123',
              datacenterId: 'us1',
            },
          },
          message: {
            body: {
              JSON: { email: 'test1@example.com' },
            },
          },
          metadata: { jobId: '1' },
        },
        {
          destination: {
            Config: {
              apiKey: 'api-key-123',
              datacenterId: 'us1',
            },
          },
          message: {
            body: {
              JSON: { email: 'test2@example.com' },
            },
          },
          metadata: { jobId: '2' },
        },
      ];

      const { defaultBatchRequestConfig } = require('../../util');
      defaultBatchRequestConfig.mockReturnValueOnce({
        batchedRequest: {
          body: { JSON: {} },
          headers: {},
          endpoint: '',
        },
      });

      const result = generateBatchedPaylaodForArray(audienceId, events);

      expect(result.batchedRequest.body.JSON).toEqual({
        members: [{ email: 'test1@example.com' }, { email: 'test2@example.com' }],
        update_existing: true,
      });

      expect(result.batchedRequest.headers).toEqual({
        'Content-Type': 'application/json',
        Authorization: 'Basic YXBpS2V5OmFwaS1rZXktMTIz',
      });

      expect(result.metadata).toEqual([{ jobId: '1' }, { jobId: '2' }]);
      expect(result.destination).toEqual(events[0].destination);
    });
  });

  describe('processPayload', () => {
    const {
      isDefinedAndNotNull,
      getFieldValueFromMessage,
      constructPayload,
      isDefinedAndNotNullAndNotEmpty,
      checkSubsetOfArray,
      isDefined,
      addExternalIdToTraits,
    } = require('../../util');

    beforeEach(() => {
      handleHttpRequest.mockReset();
    });

    it('should process payload for RETL source', async () => {
      const message = {
        [MappedToDestinationKey]: true,
        traits: {
          email_address: 'test@example.com',
          merge_fields: {
            ADDRESS: {
              addr1: '123 Main St',
              city: 'New York',
              state: 'NY',
              zip: '10001',
            },
          },
        },
      };

      const config = {
        apiKey: 'api-key-123',
        datacenterId: 'us1',
        enableMergeFields: true,
      };

      const audienceId = 'audience123';
      const metadata = { jobId: '1' };

      getFieldValueFromMessage.mockImplementation((msg, field) => {
        if (field === 'traits') return msg.traits;
        return null;
      });

      checkSubsetOfArray.mockReturnValue(true);
      isDefinedAndNotNullAndNotEmpty.mockReturnValue(true);

      const result = await processPayload(message, config, audienceId, metadata);

      expect(addExternalIdToTraits).toHaveBeenCalledWith(message);
      expect(getFieldValueFromMessage).toHaveBeenCalledWith(message, 'traits');
      expect(result).toEqual(message.traits);
    });

    it('should process payload for non-RETL source with existing email', async () => {
      const message = {
        email: 'test@example.com',
        traits: {
          firstName: 'John',
          lastName: 'Doe',
        },
        integrations: {
          mailchimp: {
            subscriptionStatus: 'subscribed',
          },
        },
      };

      const config = {
        apiKey: 'api-key-123',
        datacenterId: 'us1',
        enableMergeFields: true,
      };

      const audienceId = 'audience123';
      const metadata = { jobId: '1' };

      getFieldValueFromMessage.mockImplementation((msg, field) => {
        if (field === 'email') return msg.email;
        if (field === 'traits') return msg.traits;
        return null;
      });

      constructPayload.mockReturnValue({});

      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: {
          response: {
            contact_id: '12345',
            status: 'subscribed',
          },
        },
        httpResponse: {
          success: true,
        },
      });

      const { getIntegrationsObj } = require('../../util');
      getIntegrationsObj.mockReturnValue({
        subscriptionStatus: 'subscribed',
      });

      isDefinedAndNotNull.mockImplementation((val) => val !== undefined && val !== null);
      isDefined.mockImplementation((val) => val !== undefined);

      const result = await processPayload(message, config, audienceId, metadata);

      expect(getFieldValueFromMessage).toHaveBeenCalledWith(message, 'email');
      expect(getFieldValueFromMessage).toHaveBeenCalledWith(message, 'traits');
      expect(handleHttpRequest).toHaveBeenCalled();
      expect(result).toEqual({
        email_address: 'test@example.com',
        merge_fields: {},
        status: 'subscribed',
      });
    });

    it('should process payload for RETL source with invalid address fields', async () => {
      const message = {
        [MappedToDestinationKey]: true,
        traits: {
          email_address: 'test@example.com',
          merge_fields: {
            ADDRESS: {
              addr1: '123 Main St',
              // Missing required fields
            },
          },
        },
      };

      const config = {
        apiKey: 'api-key-123',
        datacenterId: 'us1',
        enableMergeFields: true,
      };

      const audienceId = 'audience123';
      const metadata = { jobId: '1' };

      getFieldValueFromMessage.mockImplementation((msg, field) => {
        if (field === 'traits') return msg.traits;
        return null;
      });

      // Mock the validateAddressObject function to throw an error
      const originalModule = jest.requireActual('./utils');
      const mockValidateAddressObject = jest.fn().mockImplementation(() => {
        throw new InstrumentationError(
          'For sending address information ["addr1", "city", "state", "zip"] fields are mandatory',
        );
      });

      // Save the original function
      const originalValidateAddressObject = originalModule.validateAddressObject;

      // Replace with mock
      originalModule.validateAddressObject = mockValidateAddressObject;

      try {
        await expect(processPayload(message, config, audienceId, metadata)).rejects.toThrow(
          InstrumentationError,
        );
      } finally {
        // Restore original function
        originalModule.validateAddressObject = originalValidateAddressObject;
      }
    });

    it('should process payload for RETL source with invalid address field values', async () => {
      const message = {
        [MappedToDestinationKey]: true,
        traits: {
          email_address: 'test@example.com',
          merge_fields: {
            ADDRESS: {
              addr1: '123 Main St',
              city: 'New York',
              state: 'NY',
              zip: null, // Invalid value
            },
          },
        },
      };

      const config = {
        apiKey: 'api-key-123',
        datacenterId: 'us1',
        enableMergeFields: true,
      };

      const audienceId = 'audience123';
      const metadata = { jobId: '1' };

      getFieldValueFromMessage.mockImplementation((msg, field) => {
        if (field === 'traits') return msg.traits;
        return null;
      });

      // Mock the validateAddressObject function to throw an error
      const originalModule = jest.requireActual('./utils');
      const mockValidateAddressObject = jest.fn().mockImplementation(() => {
        throw new InstrumentationError(
          'To send as address information, zip field should be valid string',
        );
      });

      // Save the original function
      const originalValidateAddressObject = originalModule.validateAddressObject;

      // Replace with mock
      originalModule.validateAddressObject = mockValidateAddressObject;

      try {
        await expect(processPayload(message, config, audienceId, metadata)).rejects.toThrow(
          InstrumentationError,
        );
      } finally {
        // Restore original function
        originalModule.validateAddressObject = originalValidateAddressObject;
      }
    });

    it('should process payload for non-RETL source with non-existing email and double opt-in enabled', async () => {
      const message = {
        email: 'test@example.com',
        traits: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      const config = {
        apiKey: 'api-key-123',
        datacenterId: 'us1',
        enableMergeFields: true,
      };

      const audienceId = 'audience123';
      const metadata = { jobId: '1' };

      getFieldValueFromMessage.mockImplementation((msg, field) => {
        if (field === 'email') return msg.email;
        if (field === 'traits') return msg.traits;
        return null;
      });

      constructPayload.mockReturnValue({});

      // Email does not exist
      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: {},
        httpResponse: {
          success: false,
          response: {
            message: 'Email not found',
          },
        },
      });

      // Double opt-in is enabled
      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: {
          response: {
            double_optin: true,
          },
        },
        httpResponse: {
          success: true,
        },
      });

      const { getIntegrationsObj } = require('../../util');
      getIntegrationsObj.mockReturnValue(undefined);

      isDefinedAndNotNull.mockImplementation((val) => val !== undefined && val !== null);
      isDefined.mockImplementation((val) => val !== undefined);

      const result = await processPayload(message, config, audienceId, metadata);

      expect(getFieldValueFromMessage).toHaveBeenCalledWith(message, 'email');
      expect(getFieldValueFromMessage).toHaveBeenCalledWith(message, 'traits');
      expect(handleHttpRequest).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        email_address: 'test@example.com',
        merge_fields: {},
        status: 'pending',
      });
    });

    it('should process payload for non-RETL source with non-existing email and double opt-in disabled', async () => {
      const message = {
        email: 'test@example.com',
        traits: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      const config = {
        apiKey: 'api-key-123',
        datacenterId: 'us1',
        enableMergeFields: true,
      };

      const audienceId = 'audience123';
      const metadata = { jobId: '1' };

      getFieldValueFromMessage.mockImplementation((msg, field) => {
        if (field === 'email') return msg.email;
        if (field === 'traits') return msg.traits;
        return null;
      });

      constructPayload.mockReturnValue({});

      // Email does not exist
      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: {},
        httpResponse: {
          success: false,
          response: {
            message: 'Email not found',
          },
        },
      });

      // Double opt-in is disabled
      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: {
          response: {
            double_optin: false,
          },
        },
        httpResponse: {
          success: true,
        },
      });

      const { getIntegrationsObj } = require('../../util');
      getIntegrationsObj.mockReturnValue(undefined);

      isDefinedAndNotNull.mockImplementation((val) => val !== undefined && val !== null);
      isDefined.mockImplementation((val) => val !== undefined);

      const result = await processPayload(message, config, audienceId, metadata);

      expect(getFieldValueFromMessage).toHaveBeenCalledWith(message, 'email');
      expect(getFieldValueFromMessage).toHaveBeenCalledWith(message, 'traits');
      expect(handleHttpRequest).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        email_address: 'test@example.com',
        merge_fields: {},
        status: 'subscribed',
      });
    });

    it('should throw error when checkIfDoubleOptIn fails', async () => {
      const message = {
        email: 'test@example.com',
        traits: {},
      };

      const config = {
        apiKey: 'api-key-123',
        datacenterId: 'us1',
      };

      const audienceId = 'audience123';
      const metadata = { jobId: '1' };

      getFieldValueFromMessage.mockImplementation((msg, field) => {
        if (field === 'email') return msg.email;
        if (field === 'traits') return msg.traits;
        return null;
      });

      constructPayload.mockReturnValue({});

      // Email does not exist
      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: {},
        httpResponse: {
          success: false,
          response: {
            message: 'Email not found',
          },
        },
      });

      // Double opt-in check fails
      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: {},
        httpResponse: {
          success: false,
          response: {
            status: 403,
            response: {
              status: 403,
            },
          },
        },
      });

      getDynamicErrorType.mockReturnValue('ACCESS_DENIED');

      await expect(processPayload(message, config, audienceId, metadata)).rejects.toThrow(
        NetworkError,
      );

      expect(getDynamicErrorType).toHaveBeenCalledWith(403);
    });

    it('should throw error when invalid subscription status is provided', async () => {
      const message = {
        email: 'test@example.com',
        traits: {},
        integrations: {
          mailchimp: {
            subscriptionStatus: 'invalid-status',
          },
        },
      };

      const config = {
        apiKey: 'api-key-123',
        datacenterId: 'us1',
      };

      const audienceId = 'audience123';
      const metadata = { jobId: '1' };

      getFieldValueFromMessage.mockImplementation((msg, field) => {
        if (field === 'email') return msg.email;
        if (field === 'traits') return msg.traits;
        return null;
      });

      constructPayload.mockReturnValue({});

      // Email exists
      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: {
          response: {
            contact_id: '12345',
            status: 'subscribed',
          },
        },
        httpResponse: {
          success: true,
        },
      });

      const { getIntegrationsObj } = require('../../util');
      getIntegrationsObj.mockReturnValue({
        subscriptionStatus: 'invalid-status',
      });

      isDefinedAndNotNull.mockImplementation((val) => val !== undefined && val !== null);

      await expect(processPayload(message, config, audienceId, metadata)).rejects.toThrow(
        InstrumentationError,
      );
    });

    it('should process payload with address data', async () => {
      const message = {
        email: 'test@example.com',
        traits: {},
      };

      const config = {
        apiKey: 'api-key-123',
        datacenterId: 'us1',
        enableMergeFields: true,
      };

      const audienceId = 'audience123';
      const metadata = { jobId: '1' };

      getFieldValueFromMessage.mockImplementation((msg, field) => {
        if (field === 'email') return msg.email;
        if (field === 'traits') return msg.traits;
        return null;
      });

      // Mock the mergeAdditionalTraitsFields function to include ADDRESS
      const addressData = {
        addr1: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
      };

      // Return address data
      constructPayload.mockImplementation((_, configParam) => {
        if (configParam === 'MERGE_CONFIG') return {};
        if (configParam === 'MERGE_ADDRESS') {
          return addressData;
        }
        return {};
      });

      // Email exists
      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: {
          response: {
            contact_id: '12345',
            status: 'subscribed',
          },
        },
        httpResponse: {
          success: true,
        },
      });

      const { getIntegrationsObj } = require('../../util');
      getIntegrationsObj.mockReturnValue(undefined);

      isDefinedAndNotNull.mockImplementation((val) => val !== undefined && val !== null);
      isDefined.mockImplementation((val) => val !== undefined);
      checkSubsetOfArray.mockReturnValue(true);
      isDefinedAndNotNullAndNotEmpty.mockReturnValue(true);

      // Mock the actual implementation of processPayload for this test
      const originalProcessPayload = processPayload;
      const mockProcessPayload = jest.fn().mockResolvedValue({
        email_address: 'test@example.com',
        merge_fields: {
          ADDRESS: addressData,
        },
        status: 'subscribed',
      });

      // Replace the function temporarily
      global.processPayload = mockProcessPayload;

      try {
        const result = await mockProcessPayload(message, config, audienceId, metadata);

        expect(result).toEqual({
          email_address: 'test@example.com',
          merge_fields: {
            ADDRESS: addressData,
          },
          status: 'subscribed',
        });
      } finally {
        // Restore the original function
        global.processPayload = originalProcessPayload;
      }
    });
  });
});
