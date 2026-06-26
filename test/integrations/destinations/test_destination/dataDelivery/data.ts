// ⚠️ DEV-ONLY TEST FIXTURE — NOT A REAL DESTINATION (INT-6492).
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { ProxyV1TestData } from '../../../testTypes';
import { v1Endpoint, v2StatTags } from '../common';

const v1Headers = { 'Content-Type': 'application/json', 'X-Api-Key': 'v1-secret-key' };
const deliveryBody = { event: 'Test Event', userId: 'user-1' };

// The proxy payload carries the integration major as the top-level `destinationVersion` (the proxy
// route has no destination object). Dispatch reads it: 1 -> v1 delivery, 2 -> not implemented.
const v1ProxyPayload = (destinationVersion?: number) => ({
  ...generateProxyV1Payload(
    { endpoint: v1Endpoint, method: 'POST', headers: v1Headers, JSON: deliveryBody },
    [generateMetadata(1)],
  ),
  destinationVersion,
});

export const data: ProxyV1TestData[] = [
  {
    id: 'test_destination-delivery-v1',
    name: 'test_destination',
    description: 'v1 delivery (destinationVersion: 1) is sent via the v1 proxy path',
    successCriteria: 'Should return 200 with a successful delivery response',
    scenario: 'Integration-major dispatch — delivery',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { body: v1ProxyPayload(1), method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message:
              '[Generic Response Handler] Request for destination: test_destination Processed Successfully',
            response: [
              {
                error: JSON.stringify({ success: true }),
                statusCode: 200,
                metadata: generateMetadata(1),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'test_destination-delivery-v2-unimplemented',
    name: 'test_destination',
    description:
      'v2 delivery (destinationVersion: 2) is rejected before any request — only v1 ships',
    successCriteria: 'Should return an error indicating v2 delivery is not yet implemented',
    scenario: 'Integration-major dispatch — delivery v2 not implemented',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { body: v1ProxyPayload(2), method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message: 'test_destination v2 delivery is not yet implemented',
            response: [
              {
                error: 'test_destination v2 delivery is not yet implemented',
                statusCode: 400,
                metadata: generateMetadata(1),
              },
            ],
            statTags: v2StatTags('dataDelivery'),
          },
        },
      },
    },
  },
];
