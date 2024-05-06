export const headerBlockWithCorrectAccessToken = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-WSSE':
    'UsernameToken Username="dummy", PasswordDigest="NDc5MjNlODIyMGE4ODhiMTQyNTA0OGMzZTFjZTM1MmMzMmU0NmNiNw==", Nonce="5398e214ae99c2e50afb709a3bc423f9", Created="2019-10-14T00:00:00.000Z"',
};

export const headerBlockWithWrongAccessToken = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-WSSE':
    'UsernameToken Username="dummy2", PasswordDigest="NDc5MjNlODIyMGE4ODhiMTQyNTA0OGMzZTFjZTM1MmMzMmU0NmNiNw==", Nonce="5398e214ae99c2e50afb709a3bc423f9", Created="2019-10-14T00:00:00.000Z"',
};

export const correctContactCreateUpdateData = [
  {
    '2': 'Person0',
    '3': 'person0@example.com',
    '10569': 'efghi',
    '10519': 'efghi',
    '31': 1,
    '39': 'abc',
  },
  {
    '2': true,
    '3': 'abcde',
    '10569': 'efgh',
    '10519': 1234,
    '31': 2,
    '39': 'abc',
  },
];

export const wrongContactCreateUpdateData = [
  {
    '2': 'Person0',
    '3': 'person0@example.com',
    '10569': 'efghi',
    '10519': 'efghi',
    '31': 1,
    '39': 'abc',
  },
  {
    '2': true,
    '3': 1234,
    '10569': 'efgh',
    '10519': 1234,
    '31': 2,
    '39': 'abc',
  },
];

export const contactPayload = {
  key_id: 10569,
  contacts: correctContactCreateUpdateData,
  contact_list_id: 'dummy',
};

export const correctGroupCallPayload = {
  key_id: 'right_id',
  external_ids: ['personABC@example.com'],
};

export const groupPayloadWithWrongKeyId = {
  key_id: 'wrong_id',
  external_ids: ['efghi', 'jklmn', 'unknown', 'person4@example.com'],
};

export const groupPayloadWithWrongExternalId = {
  key_id: 'wrong_id',
  external_ids: ['efghi', 'jklmn', 'unknown', 'person4@example.com'],
};

// MOCK DATA
const businessMockData = [
  {
    description: 'Mock response from destination depicting request with a correct contact payload',
    httpReq: {
      method: 'PUT',
      url: 'https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1',
      headers: headerBlockWithCorrectAccessToken,
      data: contactPayload,
    },
    httpRes: { replyCode: 0, replyText: 'OK', data: { ids: ['138621551', 968984932] } },
  },
  {
    description:
      'Mock response from destination depicting request with a partially wrong contact payload',
    httpReq: {
      method: 'PUT',
      url: 'https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1',
      headers: headerBlockWithCorrectAccessToken,
      data: { ...contactPayload, contacts: wrongContactCreateUpdateData },
    },
    httpRes: {
      data: {
        ids: ['138621551'],
        errors: { '1234': { '2010': 'Contacts with the external id already exist: 3' } },
      },
      status: 200,
    },
  },
  {
    description: 'Mock response from destination depicting request with a wrong key_id in payload',
    httpReq: {
      method: 'PUT',
      url: 'https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1',
      headers: headerBlockWithCorrectAccessToken,
      data: { ...contactPayload, key_id: 100 },
    },
    httpRes: {
      data: { ids: [], errors: { '<NO_KEY_ID>': { '2004': 'Invalid key field id: 100' } } },
      status: 200,
    },
  },
  {
    description: 'Mock response from destination for correct group call ',
    httpReq: {
      method: 'put',
      url: 'https://api.emarsys.net/api/v2/contactlist/900337462/add',
      headers: headerBlockWithCorrectAccessToken,
      data: correctGroupCallPayload,
    },
    httpRes: {
      data: { replyCode: 0, replyText: 'OK', data: { inserted_contacts: 1, errors: [] } },
      status: 200,
    },
  },
  {
    description: 'Mock response from destination for group call with wrong key_id ',
    httpReq: {
      method: 'POST',
      url: 'https://api.emarsys.net/api/v2/contactlist/900337462/add',
      headers: headerBlockWithCorrectAccessToken,
      data: groupPayloadWithWrongKeyId,
    },
    httpRes: {
      data: { replyCode: 2004, replyText: 'Invalid key field id: 100', data: '' },
      status: 400,
    },
  },
  {
    description: 'Mock response from destination for group call with wrong key_id ',
    httpReq: {
      method: 'POST',
      url: 'https://api.emarsys.net/api/v2/contactlist/900337462/add',
      headers: headerBlockWithCorrectAccessToken,
      data: groupPayloadWithWrongExternalId,
    },
    httpRes: {
      data: {
        replyCode: 0,
        replyText: 'OK',
        data: {
          inserted_contacts: 0,
          errors: {
            efghi: { '2008': 'No contact found with the external id: 3' },
            jklmn: { '2008': 'No contact found with the external id: 3' },
            unknown: { '2008': 'No contact found with the external id: 3' },
          },
        },
      },
      status: 200,
    },
  },
  {
    description: 'Mock response from destination for correct group call, with wrong contact list ',
    httpReq: {
      method: 'POST',
      url: 'https://api.emarsys.net/api/v2/contactlist/wrong-id/add',
      headers: headerBlockWithCorrectAccessToken,
      data: correctGroupCallPayload,
    },
    httpRes: {
      data: { replyCode: 1, replyText: 'Action Wrong-id is invalid.', data: '' },
      status: 400,
    },
  },
];

export const networkCallsData = [...businessMockData];
