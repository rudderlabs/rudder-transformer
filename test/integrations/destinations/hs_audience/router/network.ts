import { accessToken } from '../maskedSecrets';

const lookupUrl = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/read';

// The router calls batch-read while transforming an email identifier. Direct
// record ids do not. The membership request produced afterwards has no token.
export const emailLookupBody = {
  idProperty: 'email',
  properties: ['email'],
  propertiesWithHistory: [],
  inputs: [{ id: 'alice@example.com' }],
};

export const emailLookupResponse = {
  status: 'COMPLETE',
  results: [{ id: '501', properties: { email: 'alice@example.com' } }],
  errors: [],
};

export const networkCallsData = [
  {
    httpReq: {
      url: lookupUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      data: emailLookupBody,
    },
    httpRes: {
      status: 200,
      data: emailLookupResponse,
    },
  },
];
