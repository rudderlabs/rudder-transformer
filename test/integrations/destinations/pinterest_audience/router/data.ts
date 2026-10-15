import { generateRecordPayload } from '../../../testUtils';
import { RouterTestData } from '../../../testTypes';
import {
  EMAIL_SHA256,
  MAID_SHA256,
  PHONE_SHA256,
  RAW_EMAIL,
  RAW_MAID,
  RAW_PHONE,
  RouterConfigurationErrorStatTags,
  RouterInstrumentationErrorStatTags,
  badAdAccountConnection,
  connection,
  destType,
  destination,
  endpoint,
  endpointFor,
  endpointPath,
  headers,
  metadataFor,
  otherCustomerListId,
  otherListConnection,
  preHashedConnection,
} from '../common';

const input = (
  jobId: number,
  action: 'insert' | 'update' | 'delete',
  identifiers: Record<string, unknown>,
  conn = connection,
) => ({
  message: generateRecordPayload({ identifiers, action }),
  metadata: metadataFor(jobId),
  destination,
  connection: conn,
});

const batchedRequest = (body: Record<string, unknown>, url = endpoint) => ({
  version: '1',
  type: 'REST',
  method: 'PATCH',
  endpoint: url,
  endpointPath,
  headers,
  params: {},
  body: { JSON: body, JSON_ARRAY: {}, XML: {}, FORM: {} },
  files: {},
});

const routerCase = (
  id: string,
  description: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputs: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output: any[],
): RouterTestData => ({
  id,
  name: destType,
  description,
  scenario: 'Business',
  successCriteria: description,
  feature: 'router',
  module: 'destination',
  version: 'v0',
  input: { request: { method: 'POST', body: { input: inputs, destType } } },
  output: { response: { status: 200, body: { output } } },
});

export const data: RouterTestData[] = [
  routerCase(
    'pinterest-audience-router-add-mixed-identifiers',
    'insert and update batch into one ADD request; rows with different identifier sets share it',
    [
      input(1, 'insert', { EMAIL: RAW_EMAIL, MAID: RAW_MAID, PHONE: RAW_PHONE }),
      input(2, 'update', { MAID: RAW_MAID }),
    ],
    [
      {
        batchedRequest: batchedRequest({
          operation_type: 'ADD',
          records_v2: [
            { email: EMAIL_SHA256, maid: MAID_SHA256, hashed_phone_number: PHONE_SHA256 },
            { maid: MAID_SHA256 },
          ],
        }),
        metadata: [metadataFor(1), metadataFor(2)],
        batched: true,
        statusCode: 200,
        destination,
      },
    ],
  ),
  routerCase(
    'pinterest-audience-router-add-remove-split',
    'D1: ADD and REMOVE share one URL, so internalGroupKey splits them',
    [input(1, 'insert', { EMAIL: RAW_EMAIL }), input(2, 'delete', { EMAIL: RAW_EMAIL })],
    [
      {
        batchedRequest: batchedRequest({ operation_type: 'ADD', records_v2: [{ email: EMAIL_SHA256 }] }),
        metadata: [metadataFor(1)],
        batched: true,
        statusCode: 200,
        destination,
      },
      {
        batchedRequest: batchedRequest({ operation_type: 'REMOVE', records_v2: [{ email: EMAIL_SHA256 }] }),
        metadata: [metadataFor(2)],
        batched: true,
        statusCode: 200,
        destination,
      },
    ],
  ),
  routerCase(
    'pinterest-audience-router-two-lists',
    'D2: rows of two connections go to their own customer list',
    [
      input(1, 'insert', { EMAIL: RAW_EMAIL }),
      input(2, 'insert', { EMAIL: RAW_EMAIL }, otherListConnection),
    ],
    [
      {
        batchedRequest: batchedRequest({ operation_type: 'ADD', records_v2: [{ email: EMAIL_SHA256 }] }),
        metadata: [metadataFor(1)],
        batched: true,
        statusCode: 200,
        destination,
      },
      {
        batchedRequest: batchedRequest(
          { operation_type: 'ADD', records_v2: [{ email: EMAIL_SHA256 }] },
          endpointFor(otherCustomerListId),
        ),
        metadata: [metadataFor(2)],
        batched: true,
        statusCode: 200,
        destination,
      },
    ],
  ),
  routerCase(
    'pinterest-audience-router-invalid-only-aborts-alone',
    'D7: a record whose identifiers are all invalid aborts; its sibling delivers',
    [input(1, 'insert', { PHONE: '12345' }), input(2, 'insert', { EMAIL: RAW_EMAIL })],
    [
      {
        batchedRequest: batchedRequest({ operation_type: 'ADD', records_v2: [{ email: EMAIL_SHA256 }] }),
        metadata: [metadataFor(2)],
        batched: true,
        statusCode: 200,
        destination,
      },
      {
        metadata: [metadataFor(1)],
        batched: false,
        statusCode: 400,
        error: 'No valid Pinterest identifier (EMAIL / MAID / PHONE) after normalization',
        statTags: RouterInstrumentationErrorStatTags,
        destination,
      },
    ],
  ),
  routerCase(
    'pinterest-audience-router-pre-hashed',
    'D8: isHashRequired false passes SHA-256 values through unchanged',
    [input(1, 'insert', { EMAIL: EMAIL_SHA256, PHONE: PHONE_SHA256 }, preHashedConnection)],
    [
      {
        batchedRequest: batchedRequest({
          operation_type: 'ADD',
          records_v2: [{ email: EMAIL_SHA256, hashed_phone_number: PHONE_SHA256 }],
        }),
        metadata: [metadataFor(1)],
        batched: true,
        statusCode: 200,
        destination,
      },
    ],
  ),
  routerCase(
    'pinterest-audience-router-bad-ad-account-id',
    'a non-numeric ad account id fails that row as a configuration error before any request',
    [input(1, 'insert', { EMAIL: RAW_EMAIL }, badAdAccountConnection)],
    [
      {
        metadata: [metadataFor(1)],
        batched: false,
        statusCode: 400,
        error:
          'connection.config.destination.adAccountId: adAccountId must be a numeric Pinterest id',
        statTags: RouterConfigurationErrorStatTags,
        destination,
      },
    ],
  ),
];
