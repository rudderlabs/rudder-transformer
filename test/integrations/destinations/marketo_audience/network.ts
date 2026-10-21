import { accountId, listEndpoint, lookupUrl, rejectedAccountId } from './common';
import {
  accessToken,
  authHeader,
  clientId,
  clientSecret,
  rejectedClientSecret,
} from './maskedSecrets';

// Response bodies follow Marketo's documented envelopes (authentication, Get Leads by Filter Type,
// Add/Remove Leads to List, error codes) and the shapes already captured for MARKETO_STATIC_LIST.
// No live Marketo instance was available; the live checks are listed in the spec (§6.3).

const tokenRequest = (account: string, secret: string) => ({
  url: `https://${account}.mktorest.com/identity/oauth/token`,
  method: 'GET',
  params: { client_id: clientId, client_secret: secret, grant_type: 'client_credentials' },
});

// No Authorization here: the secret-path generator swaps the fetched token for a decoy, and a
// lookup matched on the real token would then fail and change the output shape. The bearer header
// on the lookup is asserted in lookup.test.ts.
const lookupHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

const membershipHeaders = {
  Authorization: authHeader,
  'Content-Type': 'application/json',
};

const lookupBody = (filterValues: string) =>
  `filterType=email&filterValues=${filterValues}&fields=id%2Cemail&batchSize=300`;

const membershipRequest = (method: string, listId: string, ids: number[]) => ({
  url: listEndpoint(listId),
  method,
  headers: membershipHeaders,
  data: { input: ids.map((id) => ({ id })) },
});

const membershipFailure = (code: string, message: string) => ({
  requestId: `e42b#${code}`,
  success: false,
  errors: [{ code, message }],
});

export const networkCallsData = [
  {
    httpReq: tokenRequest(accountId, clientSecret),
    httpRes: {
      status: 200,
      data: {
        access_token: accessToken,
        token_type: 'bearer',
        expires_in: 3599,
        scope: 'integrations@acme.io',
      },
    },
  },
  {
    httpReq: tokenRequest(rejectedAccountId, rejectedClientSecret),
    httpRes: {
      status: 401,
      data: { error: 'invalid_client', error_description: 'Bad client credentials' },
    },
  },
  {
    httpReq: {
      url: lookupUrl,
      method: 'POST',
      headers: lookupHeaders,
      data: lookupBody('alice%40acme.io%2Cdan%40acme.io%2Ceve%40acme.io'),
    },
    httpRes: {
      status: 200,
      data: {
        requestId: '10e3c#18a8d2c10e7',
        result: [
          { id: 1001, email: 'Alice@Acme.io' },
          { id: 2001, email: 'dan@acme.io' },
          { id: 2002, email: 'dan@acme.io' },
        ],
        success: true,
      },
    },
  },
  {
    httpReq: {
      url: lookupUrl,
      method: 'POST',
      headers: lookupHeaders,
      data: lookupBody('frank%40acme.io'),
    },
    httpRes: {
      status: 200,
      data: {
        requestId: '10e3d#18a8d2c10e8',
        result: [{ id: 3001, email: 'frank@acme.io' }],
        success: true,
      },
    },
  },
  {
    httpReq: {
      url: lookupUrl,
      method: 'POST',
      headers: lookupHeaders,
      data: lookupBody('grace%40acme.io'),
    },
    httpRes: {
      status: 200,
      data: membershipFailure('606', "Max rate limit '100' exceeded with in '20' secs"),
    },
  },
  {
    httpReq: membershipRequest('POST', '1234', [101, 102]),
    httpRes: {
      status: 200,
      data: {
        requestId: '12d3c#1846057dce2',
        result: [
          { id: 101, status: 'added' },
          { id: 102, status: 'added' },
        ],
        success: true,
      },
    },
  },
  {
    httpReq: membershipRequest('POST', '1234', [111, 112]),
    httpRes: {
      status: 200,
      data: {
        requestId: '12d3d#1846057dce3',
        result: [
          { id: 111, status: 'added' },
          { id: 112, status: 'skipped', reasons: [{ code: '1004', message: 'Lead not found' }] },
        ],
        success: true,
      },
    },
  },
  {
    // DELETE mocks match on URL only (axios-mock-adapter ignores the body), so this one has a
    // list of its own.
    httpReq: membershipRequest('DELETE', '2345', [121, 122, 123]),
    httpRes: {
      status: 200,
      data: {
        requestId: 'b6d1#18a8d2c10e7',
        result: [
          { id: 121, status: 'removed' },
          { id: 122, status: 'skipped', reasons: [{ code: '1004', message: 'Lead not found' }] },
          { id: 123, status: 'skipped', reasons: [{ code: '1015', message: 'Lead not in list' }] },
        ],
        success: true,
      },
    },
  },
  {
    httpReq: membershipRequest('POST', '1234', [131]),
    httpRes: { status: 200, data: membershipFailure('601', 'Access token invalid') },
  },
  {
    httpReq: membershipRequest('POST', '1234', [141]),
    httpRes: {
      status: 200,
      data: membershipFailure('606', "Max rate limit '100' exceeded with in '20' secs"),
    },
  },
  {
    httpReq: membershipRequest('POST', '1234', [151]),
    httpRes: { status: 200, data: membershipFailure('607', 'Daily quota reached') },
  },
  {
    httpReq: membershipRequest('POST', '1234', [161]),
    httpRes: { status: 200, data: membershipFailure('1013', 'Object not found') },
  },
  {
    httpReq: membershipRequest('POST', '1234', [171, 172]),
    httpRes: {
      status: 200,
      data: {
        requestId: '12d3e#1846057dce4',
        result: [
          { id: 171, status: 'added' },
          {
            id: 172,
            status: 'skipped',
            reasons: [{ code: '1008', message: 'Access denied to partition' }],
          },
        ],
        success: true,
      },
    },
  },
  {
    httpReq: membershipRequest('POST', '1234', [181, 182]),
    httpRes: {
      status: 200,
      data: {
        requestId: '12d3f#1846057dce5',
        result: [{ id: 181, status: 'added' }],
        success: true,
      },
    },
  },
];
