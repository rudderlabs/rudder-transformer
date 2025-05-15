const md5 = require('md5');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { handleHttpRequest } = require('../../../adapters/network');
const { MappedToDestinationKey } = require('../../../constants');
const utils = require('./utils');
const {
  getAudienceId,
  mailChimpSubscriptionEndpoint,
  mailchimpEventsEndpoint,
  processPayload,
  stringifyPropertiesValues,
  generateBatchedPaylaodForArray,
} = utils;
const { SUBSCRIPTION_STATUS, VALID_STATUSES } = require('./config');
const { JSON_MIME_TYPE } = require('../../util/constant');

// Mock dependencies
jest.mock('../../../adapters/network');
jest.mock('../../../adapters/utils/networkUtils');
jest.mock('md5', () => jest.fn((email) => `md5-${email}`));

describe('Mailchimp Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAudienceId', () => {
    const testCases = [
      {
        name: 'should return audienceId from integrations object',
        input: {
          message: {
            integrations: {
              mailchimp: {
                listId: 'integration-list-id',
              },
            },
          },
          config: {
            audienceId: 'config-audience-id',
          },
        },
        expected: 'integration-list-id',
      },
      {
        name: 'should return audienceId from context.MailChimp (deprecated)',
        input: {
          message: {
            context: {
              MailChimp: {
                listId: 'context-list-id',
              },
            },
          },
          config: {
            audienceId: 'config-audience-id',
          },
        },
        expected: 'context-list-id',
      },
      {
        name: 'should return audienceId from config when not in message',
        input: {
          message: {},
          config: {
            audienceId: 'config-audience-id',
          },
        },
        expected: 'config-audience-id',
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = getAudienceId(input.message, input.config);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('mailChimpSubscriptionEndpoint', () => {
    it('should return correct subscription endpoint', () => {
      const datacenterId = 'us1';
      const audienceId = 'abc123';
      const email = 'test@example.com';

      const result = mailChimpSubscriptionEndpoint(datacenterId, audienceId, email);

      expect(result).toEqual(
        `https://${datacenterId}.api.mailchimp.com/3.0/lists/${audienceId}/members/md5-${email}`,
      );
      expect(md5).toHaveBeenCalledWith(email);
    });
  });

  describe('mailchimpEventsEndpoint', () => {
    it('should return correct events endpoint', () => {
      const datacenterId = 'us1';
      const audienceId = 'abc123';
      const email = 'test@example.com';

      const result = mailchimpEventsEndpoint(datacenterId, audienceId, email);

      expect(result).toEqual(
        `https://${datacenterId}.api.mailchimp.com/3.0/lists/${audienceId}/members/md5-${email}/events`,
      );
      expect(md5).toHaveBeenCalledWith(email);
    });
  });

  describe('stringifyPropertiesValues', () => {
    const testCases = [
      {
        name: 'should stringify non-string values',
        input: {
          name: 'John',
          age: 30,
          isActive: true,
          preferences: { color: 'blue' },
          tags: ['tag1', 'tag2'],
        },
        expected: {
          name: 'John',
          age: '30',
          isActive: 'true',
          preferences: '{"color":"blue"}',
          tags: '["tag1","tag2"]',
        },
      },
      {
        name: 'should not modify string values',
        input: {
          name: 'John',
          description: 'A test user',
        },
        expected: {
          name: 'John',
          description: 'A test user',
        },
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = stringifyPropertiesValues(input);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('generateBatchedPaylaodForArray', () => {
    it('should generate correct batched payload', () => {
      const audienceId = 'list123';
      const events = [
        {
          message: {
            body: {
              JSON: { email_address: 'user1@example.com', merge_fields: { FNAME: 'User1' } },
            },
          },
          metadata: { userId: 'user1' },
          destination: {
            Config: {
              apiKey: 'test-api-key',
              datacenterId: 'us1',
              enableMergeFields: true,
            },
          },
        },
        {
          message: {
            body: {
              JSON: { email_address: 'user2@example.com', merge_fields: { FNAME: 'User2' } },
            },
          },
          metadata: { userId: 'user2' },
          destination: {
            Config: {
              apiKey: 'test-api-key',
              datacenterId: 'us1',
              enableMergeFields: true,
            },
          },
        },
      ];

      const result = generateBatchedPaylaodForArray(audienceId, events);

      expect(result.batchedRequest.body.JSON).toEqual({
        members: [
          { email_address: 'user1@example.com', merge_fields: { FNAME: 'User1' } },
          { email_address: 'user2@example.com', merge_fields: { FNAME: 'User2' } },
        ],
        update_existing: true,
      });

      expect(result.batchedRequest.endpoint).toContain(
        `https://us1.api.mailchimp.com/3.0/lists/${audienceId}`,
      );
      expect(result.batchedRequest.headers).toEqual({
        'Content-Type': JSON_MIME_TYPE,
        Authorization: expect.stringContaining('Basic '),
      });

      expect(result.metadata).toEqual([{ userId: 'user1' }, { userId: 'user2' }]);
      expect(result.destination).toEqual(events[0].destination);
    });
  });

  describe('processPayload', () => {
    beforeEach(() => {
      handleHttpRequest.mockClear(); // ensure a fresh counter
      handleHttpRequest.mockImplementation(async (_, url) => {
        if (url.includes('members/md5-exists@example.com')) {
          return {
            processedResponse: {
              response: {
                contact_id: '123',
                status: 'subscribed',
              },
            },
            httpResponse: {
              success: true,
            },
          };
        } else if (
          url.includes('members/md5-notexists@example.com') ||
          url.includes('members/md5-custom-status@example.com')
        ) {
          return {
            processedResponse: {},
            httpResponse: {
              success: false,
              response: {
                message: 'Resource not found',
              },
            },
          };
        } else if (url.includes('lists/audience123')) {
          return {
            processedResponse: {
              response: {
                double_optin: true,
              },
            },
            httpResponse: {
              success: true,
            },
          };
        } else if (url.includes('lists/audience456')) {
          return {
            processedResponse: {
              response: {
                double_optin: false,
              },
            },
            httpResponse: {
              success: true,
            },
          };
        } else if (url.includes('lists/audience-error')) {
          return {
            processedResponse: {},
            httpResponse: {
              success: false,
              response: {
                response: {
                  status: 403,
                },
                message: 'Access denied',
              },
            },
          };
        }
      });
    });

    it('should process payload for existing user', async () => {
      const message = {
        traits: {
          email: 'exists@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
        },
      };

      const config = {
        apiKey: 'test-api-key',
        datacenterId: 'us1',
        enableMergeFields: true,
      };

      const audienceId = 'audience123';
      const metadata = { userId: 'user1' };

      const result = await processPayload(message, config, audienceId, metadata);

      expect(result).toHaveProperty('email_address', 'exists@example.com');
      expect(result).toHaveProperty('status', 'subscribed');
      expect(result).toHaveProperty('merge_fields');
      expect(handleHttpRequest).toHaveBeenCalledTimes(1);
    });

    it('should process payload for new user with double opt-in enabled', async () => {
      const message = {
        traits: {
          email: 'notexists@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '0987654321',
        },
      };

      const config = {
        apiKey: 'test-api-key',
        datacenterId: 'us1',
        enableMergeFields: true,
      };

      const audienceId = 'audience123';
      const metadata = { userId: 'user2' };

      const result = await processPayload(message, config, audienceId, metadata);

      expect(result).toHaveProperty('email_address', 'notexists@example.com');
      expect(result).toHaveProperty('status', 'pending');
      expect(result).toHaveProperty('merge_fields');
      expect(handleHttpRequest).toHaveBeenCalledTimes(2);
    });

    it('should process payload for new user with double opt-in disabled', async () => {
      const message = {
        traits: {
          email: 'notexists@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '0987654321',
        },
      };

      const config = {
        apiKey: 'test-api-key',
        datacenterId: 'us1',
        enableMergeFields: true,
      };

      const audienceId = 'audience456';
      const metadata = { userId: 'user2' };

      const result = await processPayload(message, config, audienceId, metadata);

      expect(result).toHaveProperty('email_address', 'notexists@example.com');
      expect(result).toHaveProperty('status', 'subscribed');
      expect(result).toHaveProperty('merge_fields');
      expect(handleHttpRequest).toHaveBeenCalledTimes(2);
    });

    it('should process payload with custom subscription status from integrations object', async () => {
      const message = {
        traits: {
          email: 'custom-status@example.com',
          firstName: 'Custom',
          lastName: 'User',
        },
        integrations: {
          mailchimp: {
            subscriptionStatus: 'unsubscribed',
          },
        },
      };

      const config = {
        apiKey: 'test-api-key',
        datacenterId: 'us1',
        enableMergeFields: true,
      };

      const audienceId = 'audience123';
      const metadata = { userId: 'user4' };

      const result = await processPayload(message, config, audienceId, metadata);

      expect(result).toHaveProperty('email_address', 'custom-status@example.com');
      expect(result).toHaveProperty('merge_fields');
      expect(handleHttpRequest).toHaveBeenCalledTimes(2);
    });

    it('should process payload for reverse ETL source', async () => {
      const message = {
        [MappedToDestinationKey]: true,
        traits: {
          email_address: 'retl@example.com',
          merge_fields: {
            FNAME: 'RETL',
            LNAME: 'User',
            ADDRESS: {
              addr1: '123 Main St',
              city: 'San Francisco',
              state: 'CA',
              zip: '94105',
            },
          },
          status: 'subscribed',
        },
      };

      const config = {
        apiKey: 'test-api-key',
        datacenterId: 'us1',
      };

      const audienceId = 'audience123';
      const metadata = { userId: 'user3' };

      const result = await processPayload(message, config, audienceId, metadata);

      expect(result).toEqual(message.traits);
      expect(handleHttpRequest).not.toHaveBeenCalled();
    });
  });

  describe('Subscription Status Determination', () => {
    // Create a direct test for determineSubscriptionStatus by accessing it through the module
    // This is a more focused test that doesn't rely on processPayload

    it('should test subscription status determination directly', async () => {
      // This test uses processPayload to indirectly test the determineSubscriptionStatus function

      // Create test cases for different scenarios
      const testCases = [
        {
          name: 'should set status to pending for new users when double opt-in is enabled',
          userStatus: { exists: false },
          message: {},
          primaryPayload: { email_address: 'test@example.com' },
          doubleOptIn: true,
          expectedStatus: 'pending',
        },
        {
          name: 'should set status to subscribed for new users when double opt-in is disabled',
          userStatus: { exists: false },
          message: {},
          primaryPayload: { email_address: 'test@example.com' },
          doubleOptIn: false,
          expectedStatus: 'subscribed',
        },
        {
          name: 'should use existing status for existing users',
          userStatus: { exists: true, subscriptionStatus: 'subscribed' },
          message: {},
          primaryPayload: { email_address: 'test@example.com' },
          doubleOptIn: true, // doesn't matter for existing users
          expectedStatus: 'subscribed',
        },
        {
          name: 'should override status with value from integrations object',
          userStatus: { exists: true, subscriptionStatus: 'subscribed' },
          message: {
            integrations: {
              mailchimp: {
                subscriptionStatus: 'cleaned',
              },
            },
          },
          primaryPayload: { email_address: 'test@example.com' },
          doubleOptIn: true, // doesn't matter when overriding
          expectedStatus: 'cleaned',
        },
      ];

      // Test each case by mocking processPayload with appropriate responses
      for (const testCase of testCases) {
        // Reset the HTTP mock for each test case
        handleHttpRequest.mockClear();

        // Test processPayload with the appropriate configuration
        handleHttpRequest.mockImplementation(async (_, url) => {
          if (url.includes('members/md5-test@example.com')) {
            return {
              processedResponse: {
                response: testCase.userStatus.exists
                  ? { contact_id: '456', status: testCase.userStatus.subscriptionStatus }
                  : {},
              },
              httpResponse: {
                success: testCase.userStatus.exists,
              },
            };
          } else if (url.includes('lists/test-audience')) {
            return {
              processedResponse: {
                response: {
                  double_optin: testCase.doubleOptIn,
                },
              },
              httpResponse: {
                success: true,
              },
            };
          }
        });

        // Execute the test
        const message = testCase.message;
        message.traits = { email: 'test@example.com' };

        const config = {
          apiKey: 'test-api-key',
          datacenterId: 'us1',
          enableMergeFields: true,
        };

        const audienceId = 'test-audience';
        const metadata = { userId: 'test-user' };

        const result = await processPayload(message, config, audienceId, metadata);

        // Verify the result
        expect(result).toHaveProperty('status', testCase.expectedStatus);
      }
    });

    it('should throw NetworkError when checkIfDoubleOptIn fails', async () => {
      handleHttpRequest.mockClear();
      handleHttpRequest.mockImplementation(async (_, url) => {
        if (url.includes('members/md5-test@example.com')) {
          return {
            processedResponse: {},
            httpResponse: {
              success: false,
              response: {
                message: 'Resource not found',
              },
            },
          };
        } else if (url.includes('lists/audience-error')) {
          return {
            processedResponse: {},
            httpResponse: {
              success: false,
              response: {
                response: {
                  status: 403,
                },
                message: 'Access denied',
              },
            },
          };
        }
      });

      const message = {
        traits: {
          email: 'test@example.com',
        },
      };

      const config = {
        apiKey: 'test-api-key',
        datacenterId: 'us1',
        enableMergeFields: true,
      };

      const audienceId = 'audience-error';
      const metadata = { userId: 'test-user' };

      await expect(processPayload(message, config, audienceId, metadata)).rejects.toThrow(
        'User does not have access to the requested operation',
      );
    });

    it('should throw InstrumentationError when subscription status is invalid', async () => {
      handleHttpRequest.mockClear();
      handleHttpRequest.mockImplementation(async (_, url) => {
        if (url.includes('members/md5-test@example.com')) {
          return {
            processedResponse: {
              response: {
                contact_id: '456',
                status: 'subscribed',
              },
            },
            httpResponse: {
              success: true,
            },
          };
        }
      });

      const message = {
        traits: {
          email: 'test@example.com',
        },
        integrations: {
          mailchimp: {
            subscriptionStatus: 'invalid-status', // Invalid status
          },
        },
      };

      const config = {
        apiKey: 'test-api-key',
        datacenterId: 'us1',
        enableMergeFields: true,
      };

      const audienceId = 'audience123';
      const metadata = { userId: 'test-user' };

      await expect(processPayload(message, config, audienceId, metadata)).rejects.toThrow(
        'The status must be one of [subscribed, unsubscribed, cleaned, pending, transactional]',
      );
    });
  });
});
