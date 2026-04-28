import { authHeader1 } from '../maskedSecrets';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';

const {
  SILENT_FAILURE_MESSAGE,
  SILENT_FAILURE_ERROR,
} = require('../../../../../src/v1/destinations/hs/networkHandler');

/**
 * Test data for HubSpot silent failure detection on batch endpoints.
 *
 * Background: When a malformed payload is sent to a HubSpot batch endpoint,
 * HubSpot accepts it and returns 2xx with empty results and errors arrays —
 * a silent no-op where no events are actually written. Previously these
 * would have been incorrectly marked as successful delivery.
 *
 * Tests cover:
 * - 200 with empty results+errors on batch upsert → events marked 400
 * - 207 with empty results+errors on batch upsert → events marked 400
 * - 200 with empty results on batch create → events marked 400
 * - 200 with empty results on batch update → events marked 400
 * - 200 with empty results on rETL associations batch create → events marked 400
 * - 204 empty body on track endpoint /events/v3/send → still marked success
 *   (regression: only batch endpoints under /crm/v3/.../batch/ should trigger
 *   the silent-failure check)
 */
export const silentFailureData = [
  {
    name: 'hs',
    id: 'hs_silent_failure_batch_upsert_200',
    description: 'silent failure: batch upsert returns 200 with empty results and errors',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authHeader1,
            },
            JSON: {
              inputs: [
                {
                  id: 'silent1@test.com',
                  idProperty: 'email',
                  properties: { email: 'silent1@test.com' },
                  objectWriteTraceId: '101',
                },
                {
                  id: 'silent2@test.com',
                  idProperty: 'email',
                  properties: { email: 'silent2@test.com' },
                  objectWriteTraceId: '102',
                },
              ],
            },
          },
          [generateMetadata(101), generateMetadata(102)],
          { apiVersion: 'newApi' },
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: SILENT_FAILURE_MESSAGE,
            response: [
              { statusCode: 400, metadata: generateMetadata(101), error: SILENT_FAILURE_ERROR },
              { statusCode: 400, metadata: generateMetadata(102), error: SILENT_FAILURE_ERROR },
            ],
          },
        },
      },
    },
  },
  {
    name: 'hs',
    id: 'hs_silent_failure_batch_upsert_207',
    description: 'silent failure: batch upsert returns 207 with empty results and errors',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authHeader1,
            },
            JSON: {
              inputs: [
                {
                  id: 'silent207@test.com',
                  idProperty: 'email',
                  properties: { email: 'silent207@test.com' },
                  objectWriteTraceId: '201',
                },
              ],
            },
          },
          [generateMetadata(201)],
          { apiVersion: 'newApi' },
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 207,
            message: SILENT_FAILURE_MESSAGE,
            response: [
              { statusCode: 400, metadata: generateMetadata(201), error: SILENT_FAILURE_ERROR },
            ],
          },
        },
      },
    },
  },
  {
    name: 'hs',
    id: 'hs_silent_failure_batch_create',
    description: 'silent failure: batch create returns 2xx with empty results',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/create',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authHeader1,
            },
            JSON: {
              inputs: [{ properties: { email: 'create-silent@test.com' } }],
            },
          },
          [generateMetadata(301)],
          { apiVersion: 'newApi' },
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: SILENT_FAILURE_MESSAGE,
            response: [
              { statusCode: 400, metadata: generateMetadata(301), error: SILENT_FAILURE_ERROR },
            ],
          },
        },
      },
    },
  },
  {
    name: 'hs',
    id: 'hs_silent_failure_batch_update',
    description: 'silent failure: batch update returns 2xx with empty results',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/update',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authHeader1,
            },
            JSON: {
              inputs: [{ id: '999', properties: { firstname: 'X' } }],
            },
          },
          [generateMetadata(401)],
          { apiVersion: 'newApi' },
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: SILENT_FAILURE_MESSAGE,
            response: [
              { statusCode: 400, metadata: generateMetadata(401), error: SILENT_FAILURE_ERROR },
            ],
          },
        },
      },
    },
  },
  {
    name: 'hs',
    id: 'hs_silent_failure_retl_association_batch',
    description: 'silent failure: rETL associations batch create returns 2xx with empty results',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.hubapi.com/crm/v3/associations/companies/contacts/batch/create',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authHeader1,
            },
            JSON: {
              inputs: [{ from: { id: 1 }, to: { id: 2 }, type: 'engineer' }],
            },
          },
          [generateMetadata(501)],
          { apiVersion: 'newApi' },
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: SILENT_FAILURE_MESSAGE,
            response: [
              { statusCode: 400, metadata: generateMetadata(501), error: SILENT_FAILURE_ERROR },
            ],
          },
        },
      },
    },
  },
  {
    name: 'hs',
    id: 'hs_silent_failure_track_endpoint_excluded',
    description:
      'regression: track endpoint /events/v3/send with empty body should still be marked success',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.hubapi.com/events/v3/send',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authHeader1,
            },
            JSON: {
              email: 'track@test.com',
              eventName: 'pe_test',
              properties: {},
            },
          },
          [generateMetadata(601)],
          { apiVersion: 'newApi' },
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 204,
            message: '[HUBSPOT Response V1 Handler] - Request Processed Successfully',
            response: [{ statusCode: 204, metadata: generateMetadata(601), error: '{}' }],
          },
        },
      },
    },
  },
];
