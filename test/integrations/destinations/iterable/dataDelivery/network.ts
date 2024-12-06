export const headerBlockWithCorrectAccessToken = {
  'Content-Type': 'application/json',
  api_key: 'DUMMY_API_KEY',
};

export const headerBlockWithWrongAccessToken = {
  'Content-Type': 'application/json',
  api_key: 'DUMMY_WRONG_API_KEY',
};
export const correctTrackData = {
  events: [
    {
      dataFields: {
        subject: 'resume validate',
        sendtime: '2020-01-01',
        sendlocation: 'akashdeep@gmail.com',
      },
      email: 'sayan@gmail.com',
      userId: 'abcdeeeeeeeexxxx102',
      eventName: 'Email Opened',
      createdAt: 1598631966468,
    },
    {
      dataFields: {
        subject: 'resume validate',
        sendtime: '2020-01-01',
        sendlocation: 'pradip@gmail.com',
      },
      email: 'pradip@gmail.com',
      userId: 'abcdeeeeeeeexxxx102',
      eventName: 'Email Opened',
      createdAt: 1598631966468,
    },
  ],
};

export const wrongTrackData = {
  events: [
    {
      dataFields: {
        subject: 'resume validate',
        sendtime: '2020-01-01',
        sendlocation: 'akashdeep@gmail.com',
      },
      email: 'sayan',
      userId: 'abcdeeeeeeeexxxx102',
      eventName: 'Email Opened',
      createdAt: 'abc',
    },
    {
      dataFields: {
        subject: 'resume validate',
        sendtime: '2020-01-01',
        sendlocation: 'pradip@gmail.com',
      },
      email: 'pradip@gmail.com',
      userId: 'abcdeeeeeeeexxxx102',
      eventName: 'Email Opened',
      createdAt: 1598631966468,
    },
  ],
};

export const partiallyCorrectTrackData = {
  events: [
    {
      dataFields: {
        subject: 'resume validate',
        sendtime: '2020-01-01',
        sendlocation: 'akashdeep@gmail.com',
      },
      email: 'sayan',
      userId: 'abcdeeeeeeeexxxx102',
      eventName: 'Email Opened',
      createdAt: 1598631966468,
    },
    {
      dataFields: {
        subject: 'resume validate',
        sendtime: '2020-01-01',
        sendlocation: 'pradip@gmail.com',
      },
      email: 'pradip@gmail.com',
      userId: 'abcdeeeeeeeexxxx102',
      eventName: 'Email Opened',
      createdAt: 1598631966468,
    },
  ],
};

export const correctIdentifyData = {
  users: [
    {
      email: 'manashi@website.com',
      dataFields: {
        city: 'Bangalore',
        name: 'manashi',
        email: 'manashi@website.com',
        country: 'India',
      },
      userId: 'abcdeeeeeeeexxxx102',
      preferUserId: true,
      mergeNestedObjects: true,
    },
    {
      email: 'shrouti@website.com',
      dataFields: {
        city: 'Bangalore',
        name: 'shrouti',
        email: 'shrouti@website.com',
        country: 'India',
      },
      userId: 'abcdeeeegggggxxxx102',
      preferUserId: true,
      mergeNestedObjects: true,
    },
  ],
};

export const wrongIdentifyData = {
  users: [
    {
      email: 'manashi@website.com',
      dataFields: {
        city: 'Bangalore',
        name: 'manashi',
        email: 'manashi@website.com',
        country: 'India',
      },
      userId: 'abcdeeeeeeeexxxx102',
      preferUserId: true,
      mergeNestedObjects: true,
    },
    {
      email: 'shrouti@website.com',
      dataFields: {
        city: 'Bangalore',
        name: 'shrouti',
        email: 'shrouti@website.com',
        country: 'India',
      },
      userId: 'abcdeeeegggggxxxx102',
      preferUserId: 'abc',
      mergeNestedObjects: true,
    },
  ],
};

export const partiallyCorrectIdentifyData = {
  users: [
    {
      email: 'manashi@website.com',
      dataFields: {
        city: 'Bangalore',
        name: 'manashi',
        email: 'manashi@website.com',
        country: 'India',
      },
      userId: 'abcdeeeeeeeexxxx102',
      preferUserId: true,
      mergeNestedObjects: true,
    },
    {
      email: 'shrouti',
      dataFields: {
        city: 'Bangalore',
        name: 'shrouti',
        email: 'shrouti@website.com',
        country: 'India',
      },
      userId: 'abcdeeeegggggxxxx102',
      preferUserId: true,
      mergeNestedObjects: true,
    },
  ],
};

// MOCK DATA
const businessMockData = [
  {
    description: 'Mock response from destination depicting request with a correct track payload',
    httpReq: {
      method: 'POST',
      url: 'https://api.iterable.com/api/events/trackBulk',
      headers: headerBlockWithCorrectAccessToken,
      data: correctTrackData,
    },
    httpRes: {
      data: {
        successCount: 2,
        failCount: 0,
        invalidEmails: [],
        invalidUserIds: [],
        disallowedEventNames: [],
        filteredOutFields: [],
        createdFields: [],
        failedUpdates: {
          invalidEmails: [],
          invalidUserIds: [],
          notFoundEmails: [],
          notFoundUserIds: [],
          forgottenEmails: [],
          forgottenUserIds: [],
        },
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description:
      'Mock response from destination depicting request with a partially wrong track payload',
    httpReq: {
      method: 'POST',
      url: 'https://api.iterable.com/api/events/trackBulk',
      headers: headerBlockWithCorrectAccessToken,
      data: partiallyCorrectTrackData,
    },
    httpRes: {
      data: {
        successCount: 1,
        failCount: 1,
        invalidEmails: ['sayan'],
        invalidUserIds: [],
        disallowedEventNames: [],
        filteredOutFields: [],
        createdFields: [],
        failedUpdates: {
          invalidEmails: ['sayan'],
          invalidUserIds: [],
          notFoundEmails: [],
          notFoundUserIds: [],
          forgottenEmails: [],
          forgottenUserIds: [],
        },

        status: 200,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response from destination depicting request with a wrong data',
    httpReq: {
      method: 'POST',
      url: 'https://api.iterable.com/api/events/trackBulk',
      headers: headerBlockWithCorrectAccessToken,
      data: wrongTrackData,
    },
    httpRes: {
      data: {
        msg: '[/api/events/trackBulk] Invalid JSON body',
        code: 'BadJsonBody',
        params: {
          'obj.events[1].createdAt': 'Number value expected',
        },
      },
      status: 400,
    },
  },
  {
    description:
      'Mock response from destination depicting request with a correct track payload but wrong API key',
    httpReq: {
      method: 'POST',
      url: 'https://api.iterable.com/api/events/trackBulk',
      headers: { ...headerBlockWithCorrectAccessToken, api_key: 'WRONG_API_KEY' },
      data: correctTrackData,
    },
    httpRes: {
      data: {
        msg: 'Invalid API key',
        code: 'BadApiKey',
        params: {
          ip: '152.58.182.124',
          endpoint: '/api/events/trackBulk',
        },
      },
      status: 401,
    },
  },
  {
    description: 'Mock response from destination depicting request with a correct Identify payload',
    httpReq: {
      method: 'POST',
      url: 'https://api.iterable.com/api/users/bulkUpdate',
      headers: headerBlockWithCorrectAccessToken,
      data: correctIdentifyData,
    },
    httpRes: {
      data: {
        successCount: 2,
        failCount: 0,
        invalidEmails: [],
        invalidUserIds: [],
        filteredOutFields: [],
        createdFields: [],
        noOpEmails: [],
        noOpUserIds: [],
        failedUpdates: {
          invalidEmails: [],
          invalidUserIds: [],
          notFoundEmails: [],
          notFoundUserIds: [],
          invalidDataEmails: [],
          invalidDataUserIds: [],
          conflictEmails: [],
          conflictUserIds: [],
          forgottenEmails: [],
          forgottenUserIds: [],
        },
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description:
      'Mock response from destination depicting identify request with a partially wrong track payload',
    httpReq: {
      method: 'POST',
      url: 'https://api.iterable.com/api/users/bulkUpdate',
      headers: headerBlockWithCorrectAccessToken,
      data: partiallyCorrectIdentifyData,
    },
    httpRes: {
      data: {
        successCount: 1,
        failCount: 1,
        invalidEmails: ['shrouti'],
        invalidUserIds: [],
        filteredOutFields: [],
        createdFields: [],
        noOpEmails: [],
        noOpUserIds: [],
        failedUpdates: {
          invalidEmails: ['shrouti'],
          invalidUserIds: [],
          notFoundEmails: [],
          notFoundUserIds: [],
          invalidDataEmails: [],
          invalidDataUserIds: [],
          conflictEmails: [],
          conflictUserIds: [],
          forgottenEmails: [],
          forgottenUserIds: [],
        },
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response from destination depicting identify request with a wrong data',
    httpReq: {
      method: 'POST',
      url: 'https://api.iterable.com/api/users/bulkUpdate',
      headers: headerBlockWithCorrectAccessToken,
      data: wrongIdentifyData,
    },
    httpRes: {
      data: {
        msg: '[/api/users/bulkUpdate] Invalid JSON body',
        code: 'BadJsonBody',
        params: {
          'obj.users[1].preferUserId': 'Boolean value expected',
        },
      },
      status: 400,
    },
  },
  {
    description: 'Mock response from destination depicting update email request with a wrong data',
    httpReq: {
      method: 'POST',
      url: 'https://api.iterable.com/api/users/updateEmail',
      headers: headerBlockWithCorrectAccessToken,
      data: {
        currentEmail: 'sayan',
        currentUserId: 'abcdeeeeeeeexxxx102',
        newEmail: 'sayan@gmail.com',
      },
    },
    httpRes: {
      data: {
        msg: 'Invalid currentEmail sayan',
        code: 'InvalidEmailAddressError',
        params: null,
      },
      status: 400,
    },
  },
  {
    description:
      'Mock response from destination depicting request with a correct single track payload',
    httpReq: {
      method: 'POST',
      url: 'https://api.iterable.com/api/events/track',
      headers: headerBlockWithCorrectAccessToken,
      data: {
        email: 'sayan@gmail.com',
        userId: 'abcdeeeeeeeexxxx102',
        eventName: 'Email Opened',
        id: '1234',
        createdAt: 1598631966468,
        dataFields: {
          subject: 'resume validate',
          sendtime: '2020-01-01',
          sendlocation: 'akashdeep@gmail.com',
        },
        campaignId: 0,
        templateId: 0,
        createNewFields: true,
      },
    },
    httpRes: {
      data: {
        msg: 'Event with id: 1234 tracked.',
        code: 'Success',
        params: {
          id: '1234',
        },
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description:
      'Mock response from destination depicting request with a wrong email single track payload',
    httpReq: {
      method: 'POST',
      url: 'https://api.iterable.com/api/events/track',
      headers: headerBlockWithCorrectAccessToken,
      data: {
        email: 'sayan',
        userId: 'abcdeeeeeeeexxxx102',
        eventName: 'Email Opened',
        id: '1234',
        createdAt: 1598631966468,
        dataFields: {
          subject: 'resume validate',
          sendtime: '2020-01-01',
          sendlocation: 'akashdeep@gmail.com',
        },
        campaignId: 0,
        templateId: 0,
        createNewFields: true,
      },
    },
    httpRes: {
      data: {
        msg: 'Invalid email: sayan',
        code: 'InvalidEmailAddressError',
        params: null,
      },
      status: 400,
    },
  },
  {
    description:
      'Mock response from destination depicting request with a correct catalog bulk payload',
    httpReq: {
      method: 'POST',
      url: 'https://api.iterable.com/api/catalogs/rudder-test/items',
      headers: headerBlockWithCorrectAccessToken,
      data: {
        documents: {
          Tiffany: { ruchira: 'donaldbaker@ellis.com', new_field2: 'GB' },
          ABC: { ruchira: 'abc@ellis.com', new_field2: 'GB1' },
        },
        replaceUploadedFieldsOnly: true,
      },
    },
    httpRes: {
      data: {
        error: 'NotFound',
        message: 'Catalog not found: rudder-test',
        code: 'error.catalogs.notFound',
        data: {
          args: ['rudder-test'],
        },
      },
      status: 404,
    },
  },
  {
    description:
      'Mock response from destination depicting request with a correct catalog track payload',
    httpReq: {
      method: 'POST',
      url: 'https://api.iterable.com/api/catalogs/test-ruchira/items',
      headers: headerBlockWithCorrectAccessToken,
      data: {
        documents: {
          Tiffany: { ruchira: 'donaldbaker@ellis.com', new_field2: 'GB' },
          ABC: { ruchira: 'abc@ellis.com', new_field2: 'GB1' },
        },
        replaceUploadedFieldsOnly: true,
      },
    },
    httpRes: {
      data: {
        msg: 'Request to bulk-upload documents into test-ruchira processed successfully',
        code: 'Success',
        params: null,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description:
      'Mock response from destination depicting request with a correct register device token payload with insufficient permission',
    httpReq: {
      method: 'POST',
      url: 'https://api.iterable.com/api/users/registerDeviceToken',
      headers: headerBlockWithCorrectAccessToken,
      data: {
        email: 'sayan@gmail.com',
        device: {
          token: '1234',
          platform: 'APNS',
          applicationName: 'rudder',
          dataFields: {},
        },
        userId: 'abcdeeeeeeeexxxx102',
        preferUserId: true,
      },
    },
    httpRes: {
      data: {
        msg: 'Disabled API key or insufficient privileges',
        code: 'BadApiKey',
        params: {
          ip: '103.189.130.133',
          endpoint: '/api/users/registerDeviceToken',
          apiKeyIdentifier: 'af831922',
          apiKeyType: 'ServerSide',
        },
      },
      status: 401,
    },
  },
  {
    description:
      'Mock response from destination depicting request with a correct registerbrowswer token payload with insufficient permission',
    httpReq: {
      method: 'POST',
      url: 'https://api.iterable.com/api/users/registerBrowserToken',
      headers: headerBlockWithCorrectAccessToken,
      data: {
        email: 'sayan@gmail.com',
        browserToken: '1234567',
        userId: 'abcdeeeeeeeexxxx102',
      },
    },
    httpRes: {
      data: {
        msg: 'Disabled API key or insufficient privileges',
        code: 'BadApiKey',
        params: {
          ip: '103.189.130.129',
          endpoint: '/api/users/registerBrowserToken',
          apiKeyIdentifier: 'af831922',
          apiKeyType: 'ServerSide',
        },
      },
      status: 401,
    },
  },
];

export const networkCallsData = [...businessMockData];
