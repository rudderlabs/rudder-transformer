// Auto-discovered by the component runner (glob **/network.ts). Each mock matches on body AND on the
// injected X-APTRINSIC-API-KEY header, so a request sent without prepareRequest finds no mock.
import { sentHeaders, usersUpdateEndpoint } from '../common';

export const bodies = {
  success: { identifyId: 'gpx-ok', customAttributes: { rs_gpx_e2e: true } },
  notFoundTrue: { identifyId: 'gpx-missing-true', customAttributes: { rs_gpx_e2e: true } },
  notFoundFalse: { identifyId: 'gpx-missing-false', customAttributes: { rs_gpx_e2e: false } },
  attributeMissing: { identifyId: 'gpx-attr-missing', customAttributes: { rs_gpx_e2e: true } },
  typeMismatch: { identifyId: 'gpx-type-mismatch', customAttributes: { rs_gpx_e2e: true } },
  unauthorized: { identifyId: 'gpx-401', customAttributes: { rs_gpx_e2e: true } },
  forbidden: { identifyId: 'gpx-403', customAttributes: { rs_gpx_e2e: false } },
  rateLimited: { identifyId: 'gpx-429', customAttributes: { rs_gpx_e2e: true } },
  serverError: { identifyId: 'gpx-500', customAttributes: { rs_gpx_e2e: true } },
};

const put = (data: Record<string, unknown>) => ({
  method: 'PUT',
  url: usersUpdateEndpoint,
  data,
  headers: sentHeaders,
});

export const networkCallsData = [
  { httpReq: put(bodies.success), httpRes: { data: '', status: 204 } },
  {
    httpReq: put(bodies.notFoundTrue),
    httpRes: { data: { message: 'User not found' }, status: 404 },
  },
  {
    httpReq: put(bodies.notFoundFalse),
    httpRes: { data: { message: 'User not found' }, status: 404 },
  },
  {
    httpReq: put(bodies.attributeMissing),
    httpRes: {
      status: 400,
      data: {
        externalapierror: {
          status: 'BAD_REQUEST',
          subErrors: [
            {
              message: "User custom attribute api name 'rs_gpx_e2e' does not exist or not enabled",
            },
          ],
        },
      },
    },
  },
  {
    httpReq: put(bodies.typeMismatch),
    httpRes: {
      status: 400,
      data: {
        externalapierror: {
          status: 'BAD_REQUEST',
          subErrors: [
            { message: 'value null does not match the type BOOLEAN', rejectedValue: null },
          ],
        },
      },
    },
  },
  {
    httpReq: put(bodies.unauthorized),
    httpRes: { data: { message: 'Unauthorized' }, status: 401 },
  },
  { httpReq: put(bodies.forbidden), httpRes: { data: { message: 'Forbidden' }, status: 403 } },
  {
    httpReq: put(bodies.rateLimited),
    httpRes: { data: { message: 'Too many requests' }, status: 429 },
  },
  {
    httpReq: put(bodies.serverError),
    httpRes: { data: { message: 'Internal error' }, status: 500 },
  },
];
