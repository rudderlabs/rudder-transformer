import { destType, destination } from '../common';
import { secret1 } from '../maskedSecrets';
import MockAdapter from 'axios-mock-adapter';

export const data = [
  {
    id: 'dummy-user-deletion-test-1',
    name: destType,
    description: 'Basic User Deletion Test - Success',
    scenario: 'Business',
    successCriteria: 'The response should have a status code of 200',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination,
              message: {
                userId: 'test-user-id',
                anonymousId: 'test-anonymous-id',
                regulation: 'GDPR',
                timestamp: '2023-01-01T00:00:00.000Z',
              },
            },
          ],
          destType,
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {},
      },
    },
  },
  {
    id: 'dummy-user-deletion-test-2',
    name: destType,
    description: 'User Deletion Test - Missing User ID',
    scenario: 'Framework',
    successCriteria:
      'The response should have a status code of 400 and indicate a configuration error',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination,
              message: {
                anonymousId: 'test-anonymous-id',
                regulation: 'GDPR',
                timestamp: '2023-01-01T00:00:00.000Z',
              },
            },
          ],
          destType,
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {},
      },
    },
  },
  {
    id: 'dummy-user-deletion-test-3',
    name: destType,
    description: 'User Deletion Test - Batch Deletion',
    scenario: 'Business',
    successCriteria: 'The response should have a status code of 200 for all valid requests',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination,
              message: {
                userId: 'test-user-id-1',
                anonymousId: 'test-anonymous-id-1',
                regulation: 'GDPR',
                timestamp: '2023-01-01T00:00:00.000Z',
              },
            },
            {
              destination,
              message: {
                userId: 'test-user-id-2',
                anonymousId: 'test-anonymous-id-2',
                regulation: 'CCPA',
                timestamp: '2023-01-01T00:00:00.000Z',
              },
            },
          ],
          destType,
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {},
      },
    },
  },
];
