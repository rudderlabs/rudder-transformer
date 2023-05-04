const {
  validatePayloadAndRetunImpIds,
  createMissingSubscriptionResponse,
  createResponseForSubscribedUser,
} = require('./utils');

const getTestMessage = () => {
  let message = {
    event: 'testEventName',
    anonymousId: 'anonId',
    traits: {
      email: 'abc@test.com',
      name: 'rudder',
      planId: 'testPlanId',
      planInterval: 'month',
      value: 'testValue',
      effectiveDate: '1609748705',
      address: {
        city: 'kolkata',
        country: 'India',
      },
      createdAt: '2014-05-21T15:54:20Z',
      timestamp: '2014-05-21T15:54:20Z',
    },
    properties: {
      category: 'test',
      email: 'test@test.com',
      templateId: 1234,
      campaignId: 5678,
      name: 'pageName',
    },
    context: {
      device: {
        token: 1234,
      },
      os: {
        token: 5678,
      },
      mappedToDestination: false,
      externalId: [
        {
          id: '12345',
          identifierType: 'test_identifier',
        },
      ],
    },
  };
  return message;
};

describe('profitwell utils test cases', () => {
  describe('createResponseForSubscribedUser', () => {
    it('correct flow', async () => {
      let expectedOutput = {
        body: {
          FORM: {},
          JSON: {
            effective_date: 1609748705,
            plan_id: 'testPlanId',
            plan_interval: 'month',
            value: 'testValue',
          },
          JSON_ARRAY: {},
          XML: {},
        },
        endpoint: 'https://api.profitwell.com/v2/subscriptions/testId/',
        files: {},
        headers: { Authorization: 'testApiKey', 'Content-Type': 'application/json' },
        method: 'PUT',
        params: {},
        type: 'REST',
        version: '1',
      };
      expect(
        createResponseForSubscribedUser(getTestMessage(), 'testId', 'testAlias', {
          privateApiKey: 'testApiKey',
        }),
      ).toEqual(expectedOutput);
    });

    it('erroneous flow', async () => {
      let fittingPayload = { ...getTestMessage() };
      fittingPayload.traits.effectiveDate = '2019-10-15T09:35:31.288Z';
      expect(() =>
        createResponseForSubscribedUser(fittingPayload, 'testId', 'testAlias', {
          privateApiKey: 'testApiKey',
        }),
      ).toThrow('Invalid timestamp format for effectiveDate. Aborting');
    });
  });

  describe('createMissingSubscriptionResponse', () => {
    it('correct flow', async () => {
      let expectedOutput = {
        body: {
          FORM: {},
          JSON: {
            effective_date: 1609748705,
            email: 'abc@test.com',
            plan_id: 'testPlanId',
            plan_interval: 'month',
            user_alias: 'testAlias',
            user_id: 'testId',
            value: 'testValue',
          },
          JSON_ARRAY: {},
          XML: {},
        },
        endpoint: 'https://api.profitwell.com/v2/subscriptions/',
        files: {},
        headers: { Authorization: 'testApiKey', 'Content-Type': 'application/json' },
        method: 'POST',
        params: {},
        type: 'REST',
        version: '1',
      };
      expect(
        createMissingSubscriptionResponse('testId', 'testAlias', null, null, getTestMessage(), {
          privateApiKey: 'testApiKey',
        }),
      ).toEqual(expectedOutput);
    });

    it('erroneous flow with wrong plan interval', async () => {
      let fittingPayload = { ...getTestMessage() };
      fittingPayload.traits.planInterval = 'test';
      expect(() =>
        createMissingSubscriptionResponse('testId', 'testAlias', null, null, fittingPayload, {
          privateApiKey: 'testApiKey',
        }),
      ).toThrow('invalid format for planInterval. Aborting');
    });

    it('erroneous flow with subscriptionId', async () => {
      let fittingPayload = { ...getTestMessage() };
      fittingPayload.traits.planInterval = 'test';
      expect(() =>
        createMissingSubscriptionResponse('testId', 'testAlias', 124, fittingPayload, {
          privateApiKey: 'testApiKey',
        }),
      ).toThrow('Profitwell subscription_id not found');
    });
  });

  describe('validatePayloadAndRetunImpIds', () => {
    it('should validate and return correct ids', () => {
      let fittingPayload = { ...getTestMessage() };
      fittingPayload.traits.subscriptionAlias = 'testAlias';
      let expectedOutput = {
        subscriptionAlias: 'testAlias',
        subscriptionId: null,
        userAlias: 'anonId',
        userId: null,
      };
      expect(validatePayloadAndRetunImpIds(fittingPayload)).toEqual(expectedOutput);
    });

    it('should error out if both subscriptionId and subscriptionAlias are absent', () => {
      expect(() => validatePayloadAndRetunImpIds(getTestMessage())).toThrow(
        'subscriptionId or subscriptionAlias is required for identify',
      );
    });

    it('should error out if both userId and userAlias are absent', () => {
      let fittingPayload = { ...getTestMessage() };
      delete fittingPayload.anonymousId;
      expect(() => validatePayloadAndRetunImpIds(fittingPayload)).toThrow(
        'userId or userAlias is required for identify',
      );
    });
  });
});
