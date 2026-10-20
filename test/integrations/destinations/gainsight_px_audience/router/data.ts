import { generateMetadata, generateRecordPayload } from '../../../testUtils';
import { RouterTestData } from '../../../testTypes';
import {
  connection,
  connectionFor,
  connectionWithTraits,
  destination,
  destType,
  endpointPath,
  euDestination,
  euUsersUpdateEndpoint,
  headers,
  RouterInstrumentationErrorStatTags,
  usersUpdateEndpoint,
} from '../common';

const put = (endpoint: string, JSON: Record<string, unknown>) => ({
  version: '1',
  type: 'REST',
  method: 'PUT',
  endpoint,
  endpointPath,
  headers,
  params: {},
  body: { JSON, JSON_ARRAY: {}, XML: {}, FORM: {} },
  files: {},
});

const ok = (
  jobId: number,
  JSON: Record<string, unknown>,
  dest = destination,
  endpoint = usersUpdateEndpoint,
) => ({
  batchedRequest: put(endpoint, JSON),
  metadata: [generateMetadata(jobId)],
  batched: true,
  statusCode: 200,
  destination: dest,
});

const row = (
  jobId: number,
  action: string,
  identifyId: unknown,
  conn = connection,
  dest = destination,
) => ({
  message: generateRecordPayload({
    identifiers: identifyId === undefined ? {} : { identifyId },
    action,
  }),
  metadata: generateMetadata(jobId),
  destination: dest,
  connection: conn,
});

const routerCase = (
  id: string,
  description: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: any[],
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
  input: { request: { method: 'POST', body: { input, destType } } },
  output: { response: { status: 200, body: { output } } },
});

const traitRow = (
  jobId: number,
  action: string,
  identifyId: string,
  fields: Record<string, unknown>,
) => ({
  message: generateRecordPayload({ identifiers: { identifyId }, action, fields }),
  metadata: generateMetadata(jobId),
  destination,
  connection: connectionWithTraits,
});

export const data: RouterTestData[] = [
  routerCase(
    'gainsight-px-audience-router-actions',
    'insert/update write true and delete writes false, one PUT /v1/users/update each',
    [row(1, 'insert', 'u-1'), row(2, 'update', 'u-2'), row(3, 'delete', 'u-3')],
    [
      ok(1, { identifyId: 'u-1', customAttributes: { rs_gpx_e2e: true } }),
      ok(2, { identifyId: 'u-2', customAttributes: { rs_gpx_e2e: true } }),
      ok(3, { identifyId: 'u-3', customAttributes: { rs_gpx_e2e: false } }),
    ],
  ),
  routerCase(
    'gainsight-px-audience-router-eu',
    'EU data center maps to api-eu.aptrinsic.com',
    [row(1, 'insert', 'u-1', connection, euDestination)],
    [
      ok(
        1,
        { identifyId: 'u-1', customAttributes: { rs_gpx_e2e: true } },
        euDestination,
        euUsersUpdateEndpoint,
      ),
    ],
  ),
  routerCase(
    'gainsight-px-audience-router-special-ids',
    'identifyIds with ; , / + space and mixed case stay in the body unchanged',
    [row(1, 'insert', 'a;b,c'), row(2, 'insert', 'a/b+c d'), row(3, 'insert', 'Case-1')],
    [
      ok(1, { identifyId: 'a;b,c', customAttributes: { rs_gpx_e2e: true } }),
      ok(2, { identifyId: 'a/b+c d', customAttributes: { rs_gpx_e2e: true } }),
      ok(3, { identifyId: 'Case-1', customAttributes: { rs_gpx_e2e: true } }),
    ],
  ),
  routerCase(
    'gainsight-px-audience-router-two-connections',
    'rows of two connections in one call each write their own attribute',
    [
      row(1, 'insert', 'u-1', connectionFor('rs_attr_a', 'src-a')),
      row(2, 'delete', 'u-2', connectionFor('rs_attr_b', 'src-b')),
    ],
    [
      ok(1, { identifyId: 'u-1', customAttributes: { rs_attr_a: true } }),
      ok(2, { identifyId: 'u-2', customAttributes: { rs_attr_b: false } }),
    ],
  ),
  routerCase(
    'gainsight-px-audience-router-missing-identify-id',
    'a row with no identifyId fails alone with a static reason',
    [row(1, 'insert', undefined), row(2, 'insert', 'good')],
    [
      ok(2, { identifyId: 'good', customAttributes: { rs_gpx_e2e: true } }),
      {
        metadata: [generateMetadata(1)],
        batched: false,
        statusCode: 400,
        error: 'No identifyId mapped',
        statTags: RouterInstrumentationErrorStatTags,
        destination,
      },
    ],
  ),
  routerCase(
    'gainsight-px-audience-router-traits-insert',
    'insert writes the flag plus each trait converted to its PX type',
    [
      traitRow(1, 'insert', 'u-1', {
        rs_gpx_string: 'admin',
        rs_gpx_number: '42',
        rs_gpx_date: '2026-10-20T10:00:00Z',
      }),
    ],
    [
      ok(1, {
        identifyId: 'u-1',
        customAttributes: {
          rs_gpx_e2e: true,
          rs_gpx_string: 'admin',
          rs_gpx_number: 42,
          rs_gpx_date: 1792490400000,
        },
      }),
    ],
  ),
  routerCase(
    'gainsight-px-audience-router-traits-delete',
    'delete with traits mapped writes only the flag false',
    [traitRow(1, 'delete', 'u-1', { rs_gpx_string: 'admin', rs_gpx_number: 7 })],
    [ok(1, { identifyId: 'u-1', customAttributes: { rs_gpx_e2e: false } })],
  ),
  routerCase(
    'gainsight-px-audience-router-traits-unconvertible',
    'an unconvertible and a null trait are left out; the flag and the good trait still go',
    [traitRow(1, 'insert', 'u-1', { rs_gpx_string: 'viewer', rs_gpx_number: 'abc', rs_gpx_date: null })],
    [ok(1, { identifyId: 'u-1', customAttributes: { rs_gpx_e2e: true, rs_gpx_string: 'viewer' } })],
  ),
];
