import { ProcessorTestData } from '../../../testTypes';
import { destination, metadata, requestBody } from '../common';
import { authHeader1 } from '../maskedSecrets';

const messageId = '1873f8bd-68f7-40fc-b262-56a245f22862';

const statTags = (errorType: string) => ({
  errorCategory: 'dataValidation',
  errorType,
  destType: 'TEXTKIT',
  module: 'destination',
  implementation: 'cdkV2',
  destinationId: 'default-destination',
  workspaceId: 'default-workspace',
  feature: 'processor',
});

const failure = (
  id: string,
  description: string,
  input: object,
  step: string,
  error: string,
  errorType = 'instrumentation',
) => ({
  id,
  name: 'textkit',
  description,
  scenario: description,
  successCriteria: 'The event is rejected with a clear error',
  feature: 'processor',
  module: 'destination',
  version: 'v0',
  input: { request: { method: 'POST', body: [input] } },
  output: {
    response: {
      status: 200,
      body: [
        {
          metadata,
          statusCode: 400,
          error: `${error}: Workflow: procWorkflow, ${step}, OriginalError: ${error}`,
          statTags: statTags(errorType),
        },
      ],
    },
  },
});

export const data = [
  {
    id: 'textkit-processor-100',
    name: 'textkit',
    description: 'Track event is recorded with its name normalized and scalar properties',
    scenario: 'A track event that is not the SMS event',
    successCriteria: 'The event goes to /v1/track',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              type: 'track',
              event: 'Trial Started',
              userId: 'user-1',
              messageId,
              context: { traits: { phone: '+14155550132' } },
              properties: { plan: 'pro', items: [1, 2] },
            },
            metadata,
            destination: destination({ smsEventName: 'Send SMS' }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.jointextkit.com/v1/track',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
                'Idempotency-Key': messageId,
              },
              params: {},
              body: requestBody({
                event: 'Trial_Started',
                user_id: 'user-1',
                phone: '+14155550132',
                properties: { plan: 'pro' },
              }),
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'textkit-processor-200',
    name: 'textkit',
    description: 'The configured event sends an SMS',
    scenario: 'A track event whose name matches smsEventName',
    successCriteria: 'The event goes to /v1/messages with to, body and from',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              type: 'track',
              event: 'Send SMS',
              userId: 'user-1',
              messageId,
              context: { traits: { phone: '+14155550132' } },
              properties: { body: 'Your order has shipped' },
            },
            metadata,
            destination: destination({ smsEventName: 'Send SMS', fromNumber: '+14155550100' }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.jointextkit.com/v1/messages',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
                'Idempotency-Key': messageId,
              },
              params: {},
              body: requestBody({
                to: '+14155550132',
                body: 'Your order has shipped',
                from: '+14155550100',
              }),
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  failure(
    'textkit-processor-300',
    'Identify events are not supported',
    { message: { type: 'identify', userId: 'user-1' }, metadata, destination: destination() },
    'Step: validateInput, ChildStep: undefined',
    'message type identify is not supported',
  ),
  failure(
    'textkit-processor-400',
    'The API key is missing',
    {
      message: { type: 'track', event: 'Trial Started', userId: 'user-1' },
      metadata,
      destination: destination({ apiKey: '' }),
    },
    'Step: validateInput, ChildStep: undefined',
    'apiKey must be supplied in destination config',
    'configuration',
  ),
  failure(
    'textkit-processor-500',
    'A track event has neither a user ID nor a phone number',
    { message: { type: 'track', event: 'Trial Started' }, metadata, destination: destination() },
    'Step: buildPayload, ChildStep: smsPayload',
    'userId or phone is required for track call',
  ),
  failure(
    'textkit-processor-600',
    'The SMS event has no text',
    {
      message: {
        type: 'track',
        event: 'Send SMS',
        context: { traits: { phone: '+14155550132' } },
      },
      metadata,
      destination: destination({ smsEventName: 'Send SMS' }),
    },
    'Step: buildPayload, ChildStep: smsPayload',
    'properties.body is required to send an SMS',
  ),
] as unknown as ProcessorTestData[];
