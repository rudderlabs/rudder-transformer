import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload, generateMetadata } from '../../../testUtils';
import {
  destType,
  advertiserId,
  dataProviderId,
  segmentName,
  proxyV1PlatformErrorStatTags,
  firstPartyDataEndpoint,
} from '../common';
import { envMock } from '../mocks';

envMock();

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
  ],
};

const metadataArray = [generateMetadata(1)];

export const otherProxyV1: ProxyV1TestData[] = [
  {
    id: 'ttd_v1_scenario_1',
    name: destType,
    description:
      '[Proxy v1 API] :: Missing advertiser secret key in destination config from proxy request from server',
    successCriteria: 'Should return 400 with platform error',
    scenario: 'Framework',
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
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message: 'Advertiser secret key is missing in destination config. Aborting',
            response: [
              {
                error: 'Advertiser secret key is missing in destination config. Aborting',
                metadata: generateMetadata(1),
                statusCode: 400,
              },
            ],
            statTags: proxyV1PlatformErrorStatTags,
            status: 400,
          },
        },
      },
    },
  },
];
