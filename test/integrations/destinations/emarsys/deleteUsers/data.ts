import crypto from 'crypto';

const buf = Buffer.from('5398e214ae99c2e50afb709a3bc423f9', 'hex');
export const mockFns = (_) => {
  jest.spyOn(Date.prototype, 'toISOString').mockReturnValueOnce('2023-10-14T00:00:00.000Z');
  // @ts-ignore
  jest.spyOn(crypto, 'randomBytes').mockReturnValue(buf);
};

const commonEventMap = [
  {
    from: 'Order Completed',
    to: 'purchase',
  },
  {
    from: 'Order Completed',
    to: 'purchase',
  },
];

const commonFieldMap = [
  {
    rudderProperty: 'email',
    emersysProperty: '3',
  },
  {
    rudderProperty: 'lastName',
    emersysProperty: '2',
  },
  {
    rudderProperty: 'firstName',
    emersysProperty: '1',
  },
  {
    rudderProperty: 'custom-field',
    emersysProperty: 'custom_id',
  },
];

export const data = [
  {
    name: 'emarsys',
    description: 'Missing emersysUsername key',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'EMARSYS',
            userAttributes: [
              {
                userId: '1234',
                phone: '1234567890',
                email: 'abc@xyc.com',
              },
            ],
            config: {
              discardEmptyProperties: true,
              emersysUsername: undefined,
              emersysUserSecret: 'dummySecret',
              emersysCustomIdentifier: '',
              defaultContactList: 'dummy',
              eventsMapping: commonEventMap,
              fieldMapping: commonFieldMap,
              oneTrustCookieCategories: [
                {
                  oneTrustCookieCategory: 'Marketing',
                },
              ],
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 400,
        body: [
          {
            statusCode: 400,
            error: 'Either Emarsys user name or user secret is missing. Aborting',
          },
        ],
      },
    },
  },
  {
    name: 'emarsys',
    description: 'Default contact list is not configured',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'EMARSYS',
            userAttributes: [
              {
                userId: '1234',
                phone: '1234567890',
                email: 'abc@xyc.com',
                lastName: 'doe',
              },
            ],
            config: {
              discardEmptyProperties: true,
              emersysUsername: 'dummy',
              emersysUserSecret: 'dummy',
              emersysCustomIdentifier: '2',
              defaultContactList: undefined,
              eventsMapping: commonEventMap,
              fieldMapping: commonFieldMap,
              oneTrustCookieCategories: [
                {
                  oneTrustCookieCategory: 'Marketing',
                },
              ],
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 400,
        body: [
          {
            statusCode: 400,
            error: 'No audience list is configured. Aborting',
          },
        ],
      },
    },
  },
  {
    name: 'emarsys',
    description: 'custom identifier is not present in user attribute',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'EMARSYS',
            userAttributes: [
              {
                userId: '1234',
                phone: '1234567890',
                lastName: 'doe',
              },
            ],
            config: {
              discardEmptyProperties: true,
              emersysUsername: 'dummy',
              emersysUserSecret: 'dummy',
              emersysCustomIdentifier: '',
              defaultContactList: 'dummy',
              eventsMapping: commonEventMap,
              fieldMapping: commonFieldMap,
              oneTrustCookieCategories: [
                {
                  oneTrustCookieCategory: 'Marketing',
                },
              ],
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 200,
            status: 'successful',
          },
        ],
      },
    },
  },
  {
    name: 'emarsys',
    description: 'user not present for deletion',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'EMARSYS',
            userAttributes: [
              {
                userId: '1234',
                email: 'abc@gmail.com',
                phone: '1234567890',
                lastName: 'doe',
              },
            ],
            config: {
              discardEmptyProperties: true,
              emersysUsername: 'dummy',
              emersysUserSecret: 'dummy',
              emersysCustomIdentifier: '',
              defaultContactList: 'dummy',
              eventsMapping: commonEventMap,
              fieldMapping: commonFieldMap,
              oneTrustCookieCategories: [
                {
                  oneTrustCookieCategory: 'Marketing',
                },
              ],
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 200,
            status: 'successful',
          },
        ],
      },
    },
  },
].map((d) => ({ ...d, mockFns }));
