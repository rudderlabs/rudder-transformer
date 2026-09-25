import { authHeader1 } from '../maskedSecrets';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';

const UPDATE_ENDPOINT = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/update';
const NOT_FOUND_MESSAGE =
  'Could not get some CONTACT objects, they may be deleted or not exist. Check that ids are valid.';
const MULTI_STATUS_MESSAGE =
  '[HUBSPOT Response V1 Handler] - Batch upsert completed with partial results';

/**
 * 207 Multi-Status handling for the HubSpot batch update API.
 *
 * batch/update reports a missing record (OBJECT_NOT_FOUND) in errors[], echoing the failed
 * input's objectWriteTraceId in error.context (next to the record id in context.ids). Each update
 * input carries the job id(s) it was built from as objectWriteTraceId (comma-separated when
 * several events were merged into one input), so the handler fails exactly those jobs; every
 * other job in the batch succeeds.
 * Network mocks: network.ts (batch/update, ids 90001 / 90002).
 */
export const updateMultiStatusData = [
  {
    name: 'hs',
    id: 'hs_update_207_record_not_found_merged_input',
    description:
      '207 from batch/update: a missing record id fails every job merged into its input, the rest succeed',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: UPDATE_ENDPOINT,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authHeader1,
            },
            JSON: {
              inputs: [
                { id: '90001', properties: { firstname: 'Alive' }, objectWriteTraceId: '1' },
                { id: '90002', properties: { firstname: 'Gone' }, objectWriteTraceId: '2,3' },
              ],
            },
          },
          [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
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
            message: MULTI_STATUS_MESSAGE,
            response: [
              { statusCode: 200, metadata: generateMetadata(1), error: 'success' },
              { statusCode: 400, metadata: generateMetadata(2), error: NOT_FOUND_MESSAGE },
              { statusCode: 400, metadata: generateMetadata(3), error: NOT_FOUND_MESSAGE },
            ],
          },
        },
      },
    },
  },
];
