import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';

const params = {
  destination: 'clevertap',
};
const headers = {
  'X-CleverTap-Account-Id': '476550467',
  'X-CleverTap-Passcode': 'dummyPassCode',
  'Content-Type': 'application/json',
};

const statTags = {
  destType: 'CLEVERTAP',
  destinationId: 'default-destinationId',
  errorCategory: 'network',
  errorType: 'aborted',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
};

export const V1BusinessTestScenarion: ProxyV1TestData[] = [
  {
    id: 'clevertap_business_0',
    scenario: 'business',
    successCriteria: 'should return 200 status code with success message',
    name: 'clevertap',
    description: '[business]:: create an user through identify call',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            params,
            headers,
            JSON: {
              d: [
                {
                  type: 'profile',
                  profileData: {
                    Email: 'jamesDoe@gmail.com',
                    Name: 'James Doe',
                    Phone: '92374162212',
                    Gender: 'M',
                    Employed: true,
                    DOB: '1614775793',
                    Education: 'Science',
                    Married: 'Y',
                    'Customer Type': 'Prime',
                    graduate: true,
                    msg_push: true,
                    msgSms: true,
                    msgemail: true,
                    msgwhatsapp: false,
                    custom_tags: JSON.stringify(['Test_User', 'Interested_User', 'DIY_Hobby']),
                    custom_mappings: JSON.stringify({ Office: 'Trastkiv', Country: 'Russia' }),
                    address: JSON.stringify({
                      city: 'kolkata',
                      country: 'India',
                      postalCode: 789223,
                      state: 'WB',
                      street: '',
                    }),
                  },
                  identity: 'anon_id',
                },
              ],
            },
            endpoint: 'https://api.clevertap.com/1/upload/test1',
          },
          [generateMetadata(123)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Request Processed Successfully',
            response: [
              {
                metadata: generateMetadata(123),
                error: JSON.stringify({ status: 'success', processed: 1, unprocessed: [] }),
                statusCode: 200,
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'clevertap_business_1',
    scenario: 'business',
    successCriteria: 'should return 401 status code with error message',
    name: 'clevertap',
    description: '[business]:: event failed due to invalid credentials',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            params,
            headers: {
              'X-CleverTap-Account-Id': 'fakeId123',
              'X-CleverTap-Passcode': 'fakePasscode123',
              'Content-Type': 'application/json',
            },
            JSON: {
              d: [
                {
                  identity: 'anon-id-new',
                  type: 'event',
                  evtName: 'Web Page Viewed: Rudder',
                  evtData: {
                    title: 'Home',
                    path: '/',
                  },
                },
              ],
            },
            endpoint: 'https://api.clevertap.com/1/upload/test2',
          },
          [generateMetadata(123)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 401,
            message: 'Request failed  with status: 401',
            response: [
              {
                metadata: generateMetadata(123),
                error: JSON.stringify({ status: 'fail', error: 'Invalid Credentials', code: 401 }),
                statusCode: 401,
              },
            ],
            statTags,
          },
        },
      },
    },
  },
  {
    id: 'clevertap_business_2',
    scenario: 'business',
    successCriteria: 'should return 401 status code with error message',
    name: 'clevertap',
    description: '[business]:: event failed due to invalid credentials',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            params,
            headers: {
              'X-CleverTap-Account-Id': '476550467',
              'X-CleverTap-Passcode': 'dummyPassCode',
              'Content-Type': 'application/json',
            },
            JSON: {
              d: [
                {
                  identity: 'anon-id-new',
                  type: 'event',
                  evtData: {
                    title: 'Home',
                    path: '/',
                  },
                },
              ],
            },
            endpoint: 'https://api.clevertap.com/1/upload/test3',
          },
          [generateMetadata(123)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message: 'Request failed  with status: 200',
            response: [
              {
                metadata: generateMetadata(123),
                error: JSON.stringify({ status: 'fail', processed: 0, unprocessed: [] }),
                statusCode: 400,
              },
            ],
            statTags,
          },
        },
      },
    },
  },
  {
    id: 'clevertap_business_3',
    scenario: 'business',
    successCriteria: 'should return 200 status code with success message',
    name: 'clevertap',
    description: '[business]:: create an user through identify call',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            params,
            headers,
            JSON: {
              d: [
                {
                  identity: 'testUser1',
                  type: 'profile',
                  profileData: {
                    Name: 'Test User1',
                    Email: 'test1@testMail.com',
                  },
                },
                {
                  evtData: {
                    name: 1234,
                    revenue: 4.99,
                  },
                  type: 'event',
                  identity: 'user123',
                },
                {
                  identity: 'testUser2',
                  type: 'profile',
                  profileData: {
                    Name: 'Test User2',
                    Email: 'test2@testMail.com',
                  },
                },
              ],
            },
            endpoint: 'https://api.clevertap.com/1/upload/test4',
          },
          [generateMetadata(123)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            statTags,
            status: 400,
            message: 'Request failed  with status: 200',
            response: [
              {
                metadata: generateMetadata(123),
                error: JSON.stringify({
                  status: 'partial',
                  processed: 2,
                  unprocessed: [
                    {
                      status: 'fail',
                      code: 509,
                      error:
                        'Event Name is incorrect. ErrorCode: 509 - Event name is mandatory. Skipped record number : 2',
                      record: {
                        evtData: { name: 1234, revenue: 4.99 },
                        type: 'event',
                        identity: 'user123',
                      },
                    },
                  ],
                }),
                statusCode: 400,
              },
            ],
          },
        },
      },
    },
  },
];
