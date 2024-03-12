import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload, generateMetadata } from '../../../testUtils';
import {
  destType,
  advertiserId,
  dataProviderId,
  segmentName,
  sampleDestination,
  proxyV1AbortableErrorStatTags,
  firstPartyDataEndpoint,
} from '../common';

const validRequestPayload1 = {
  AdvertiserId: advertiserId,
  DataProviderId: dataProviderId,
  Items: [
    {
      DAID: 'test-daid-1',
      Data: [
        {
          Name: segmentName,
          TTLInMinutes: 43200,
        },
      ],
    },
    {
      Data: [
        {
          Name: segmentName,
          TTLInMinutes: 43200,
        },
      ],
      UID2: 'test-uid2-1',
    },
    {
      DAID: 'test-daid-2',
      Data: [
        {
          Name: segmentName,
          TTLInMinutes: 0,
        },
      ],
    },
    {
      Data: [
        {
          Name: segmentName,
          TTLInMinutes: 0,
        },
      ],
      UID2: 'test-uid2-2',
    },
  ],
};

const invalidRequestPayload1 = {
  AdvertiserId: advertiserId,
  DataProviderId: dataProviderId,
  Items: [
    {
      DAID: 'test-daid',
      Data: [
        {
          Name: segmentName,
          TTLInMinutes: 43200,
        },
      ],
    },
    {
      Data: [
        {
          Name: segmentName,
          TTLInMinutes: 43200,
        },
      ],
      UID2: 'test-invalid-uid2',
    },
  ],
};

const metadataArray = [generateMetadata(1)];

export const businessProxyV1: ProxyV1TestData[] = [
  {
    id: 'ttd_v1_scenario_1',
    name: destType,
    description:
      '[Proxy v1 API] :: Test for a valid request - Successful delivery of Add/Remove IDs to Trade Desk',
    successCriteria: 'Should return 200 with no error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: {},
            params: {},
            JSON: validRequestPayload1,
            endpoint: firstPartyDataEndpoint,
          },
          metadataArray,
          sampleDestination.Config,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Request Processed Successfully',
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(1),
                error: '{}',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'ttd_v1_scenario_2',
    name: destType,
    description:
      '[Proxy v1 API] :: Test for invalid ID - where the destination responds with 200 with invalid ID',
    successCriteria: 'Should return 400 with error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: {},
            params: {},
            JSON: invalidRequestPayload1,
            endpoint: firstPartyDataEndpoint,
          },
          metadataArray,
          sampleDestination.Config,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              'Request failed with status: 200 due to {"FailedLines":[{"ErrorCode":"MissingUserId","Message":"Invalid UID2, item #2"}]}',
            response: [
              {
                error:
                  '{"FailedLines":[{"ErrorCode":"MissingUserId","Message":"Invalid UID2, item #2"}]}',
                metadata: generateMetadata(1),
                statusCode: 400,
              },
            ],
            statTags: proxyV1AbortableErrorStatTags,
            status: 400,
          },
        },
      },
    },
  },
];
