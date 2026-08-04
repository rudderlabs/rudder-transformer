import { generateMetadata, generateRecordPayload } from '../../../testUtils';
import { RouterTestData } from '../../../testTypes';
import {
  destType,
  destination,
  connection,
  euDestination,
  auDestination,
  bulkEndpoint,
  euBulkEndpoint,
  auBulkEndpoint,
  headers,
  RouterInstrumentationErrorStatTags,
} from '../common';

export const data: RouterTestData[] = [
  {
    id: 'braze-audience-router-mixed-actions-batch',
    name: destType,
    description:
      'INSERT/UPDATE set custom attr true; DELETE sets false; all batched to /users/track/bulk',
    scenario: 'Framework+Business',
    successCriteria:
      'One batched POST with three attributes reflecting membership booleans; US-03 endpoint',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: generateRecordPayload({
                identifiers: { external_id: 'user-1' },
                action: 'insert',
              }),
              metadata: generateMetadata(1),
              destination,
              connection,
            },
            {
              message: generateRecordPayload({
                identifiers: { external_id: 'user-2' },
                action: 'update',
              }),
              metadata: generateMetadata(2),
              destination,
              connection,
            },
            {
              message: generateRecordPayload({
                identifiers: { external_id: 'user-3' },
                action: 'delete',
              }),
              metadata: generateMetadata(3),
              destination,
              connection,
            },
          ],
          destType,
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: bulkEndpoint,
                endpointPath: '/users/track/bulk',
                headers,
                params: {},
                body: {
                  JSON: {
                    attributes: [
                      { external_id: 'user-1', rs_high_intent: true },
                      { external_id: 'user-2', rs_high_intent: true },
                      { external_id: 'user-3', rs_high_intent: false },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
              batched: true,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'braze-audience-router-eu-dc',
    name: destType,
    description: 'EU-01 data center maps to rest.fra-01.braze.eu',
    scenario: 'Business',
    successCriteria: 'Endpoint host is fra-01.braze.eu',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: generateRecordPayload({
                identifiers: { external_id: 'eu-1' },
                action: 'insert',
              }),
              metadata: generateMetadata(1),
              destination: euDestination,
              connection,
            },
          ],
          destType,
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: euBulkEndpoint,
                endpointPath: '/users/track/bulk',
                headers,
                params: {},
                body: {
                  JSON: {
                    attributes: [{ external_id: 'eu-1', rs_high_intent: true }],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1)],
              batched: true,
              statusCode: 200,
              destination: euDestination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'braze-audience-router-au-dc',
    name: destType,
    description: 'AU-01 data center maps to rest.au-01.braze.com',
    scenario: 'Business',
    successCriteria: 'Endpoint host is au-01.braze.com',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: generateRecordPayload({
                identifiers: { external_id: 'au-1' },
                action: 'insert',
              }),
              metadata: generateMetadata(1),
              destination: auDestination,
              connection,
            },
          ],
          destType,
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: auBulkEndpoint,
                endpointPath: '/users/track/bulk',
                headers,
                params: {},
                body: {
                  JSON: {
                    attributes: [{ external_id: 'au-1', rs_high_intent: true }],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1)],
              batched: true,
              statusCode: 200,
              destination: auDestination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'braze-audience-router-empty-external-id',
    name: destType,
    description: 'Empty external_id after trim fails the record; sibling succeeds',
    scenario: 'Framework',
    successCriteria: '400 instrumentation error for empty id; 200 batch for valid sibling',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: generateRecordPayload({
                identifiers: { external_id: '   ' },
                action: 'insert',
              }),
              metadata: generateMetadata(1),
              destination,
              connection,
            },
            {
              message: generateRecordPayload({
                identifiers: { external_id: 'good' },
                action: 'insert',
              }),
              metadata: generateMetadata(2),
              destination,
              connection,
            },
          ],
          destType,
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: bulkEndpoint,
                endpointPath: '/users/track/bulk',
                headers,
                params: {},
                body: {
                  JSON: {
                    attributes: [{ external_id: 'good', rs_high_intent: true }],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(2)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 400,
              error: 'external_id is missing or empty after trim',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
          ],
        },
      },
    },
  },
];
