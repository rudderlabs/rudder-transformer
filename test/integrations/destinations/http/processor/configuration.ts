import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata, transformResultBuilder } from '../../../testUtils';
import { destType, destinations, properties, traits } from '../common';

export const configuration: ProcessorTestData[] = [
  {
    id: 'http-configuration-test-1',
    name: destType,
    description: 'Identify call with properties mapping',
    scenario: 'Business',
    successCriteria: 'Response should be in json format with properties mapping',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: destinations[0],
            message: {
              type: 'identify',
              userId: 'userId123',
              anonymousId: 'anonId123',
              traits,
            },
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              userId: '',
              endpoint: destinations[0].Config.apiUrl,
              JSON: {
                contacts: {
                  first_name: 'John',
                  email: 'john.doe@example.com',
                  address: {
                    pin_code: '123456',
                  },
                },
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'http-configuration-test-2',
    name: destType,
    description: 'Identify call with api key auth, delete method and path params',
    scenario: 'Business',
    successCriteria: 'Response should contain delete method and api key auth',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: destinations[2],
            message: {
              type: 'identify',
              userId: 'userId123',
              anonymousId: 'anonId123',
              traits,
            },
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'DELETE',
              userId: '',
              endpoint: 'http://abc.com/contacts/john.doe@example.com/',
              headers: {
                'x-api-key': 'test-api-key',
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'http-configuration-test-3',
    name: destType,
    description: 'Track call with basic auth, get method, headers and query params mapping',
    scenario: 'Business',
    successCriteria: 'Response should contain get method, headers and query params mapping',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: destinations[1],
            message: {
              type: 'track',
              userId: 'userId123',
              event: 'Order Completed',
              properties,
            },
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'GET',
              userId: '',
              endpoint: destinations[1].Config.apiUrl,
              headers: {
                Authorization: 'Basic dGVzdC11c2VyOg==',
                h1: 'val1',
                h2: 2,
                'content-type': 'application/json',
              },
              params: {
                q1: 'val1',
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'http-configuration-test-4',
    name: destType,
    description:
      'Track call with bearer token, xml format, post method, additional headers and properties mapping',
    scenario: 'Business',
    successCriteria:
      'Response should be in xml format with post method, headers and properties mapping',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: destinations[4],
            message: {
              type: 'track',
              userId: 'userId123',
              event: 'Order Completed',
              properties,
            },
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              userId: '',
              endpoint: destinations[4].Config.apiUrl,
              headers: {
                Authorization: 'Bearer test-token',
                h1: 'val1',
                'content-type': 'application/json',
              },
              XML: {
                payload:
                  '<?xml version="1.0" encoding="UTF-8"?><event>Order Completed</event><currency>USD</currency><userId>userId123</userId><properties><items><item_id>622c6f5d5cf86a4c77358033</item_id><name>Cones of Dunshire</name><price>40</price><item_id>577c6f5d5cf86a4c7735ba03</item_id><name>Five Crowns</name><price>5</price></items></properties>',
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
