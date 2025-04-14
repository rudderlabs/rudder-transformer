import { authHeader1, authHeader2 } from '../maskedSecrets';
import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata, transformResultBuilder } from '../../../testUtils';
import {
  destType,
  destinations,
  properties,
  traits,
  processorInstrumentationErrorStatTags,
} from '../common';

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
        method: 'POST',
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
              headers: {
                'Content-Type': 'application/json',
              },
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
        method: 'POST',
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
              endpoint: 'http://abc.com/contacts/john.doe%40example.com',
              headers: {
                'Content-Type': 'application/json',
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
        method: 'POST',
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
                'Content-Type': 'application/json',
                Authorization: authHeader1,
                h1: 'val1',
                h2: '2',
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
        method: 'POST',
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
                'Content-Type': 'application/xml',
                Authorization: authHeader2,
                h1: 'val1',
                'content-type': 'application/json',
              },
              XML: {
                payload:
                  '<?xml version="1.0" encoding="UTF-8"?><body><event>Order Completed</event><currency>USD</currency><userId>userId123</userId><properties><items><item_id>622c6f5d5cf86a4c77358033</item_id><name>Cones of Dunshire</name><price>40</price></items><items><item_id>577c6f5d5cf86a4c7735ba03</item_id><name>Five Crowns</name><price>5</price></items></properties></body>',
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
    id: 'http-configuration-test-5',
    name: destType,
    description: 'Track call with pathParams mapping',
    scenario: 'Business',
    successCriteria: 'Response should have the give paths added in the endpoint',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: destinations[7],
            message: {
              type: 'track',
              userId: 'userId123',
              event: 'Order Completed',
              properties,
            },
            metadata: generateMetadata(1),
          },
        ],
        method: 'POST',
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
              endpoint: 'http://abc.com/contacts/userId123/c1',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
                h1: 'val1',
                h2: '2',
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
    id: 'http-configuration-test-6',
    name: destType,
    description: 'Track call with query params keys containing space',
    scenario: 'Business',
    successCriteria: 'Response should contain query params with URI encoded keys',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: destinations[8],
            message: {
              type: 'track',
              userId: 'userId123',
              event: 'Order Completed',
              properties,
            },
            metadata: generateMetadata(1),
          },
        ],
        method: 'POST',
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
              endpoint: 'http://abc.com/contacts/userId123/c1',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
                h1: 'val1',
                h2: '2',
                'content-type': 'application/json',
              },
              params: {
                'user%20name': 'val1',
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
    id: 'http-configuration-test-7',
    name: destType,
    description: 'Identify call with properties mapping and form format with nested objects',
    scenario: 'Business',
    successCriteria: 'Response should be in form format with nested objects stringified',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: destinations[13],
            message: {
              type: 'identify',
              userId: 'userId123',
              anonymousId: 'anonId123',
              traits,
            },
            metadata: generateMetadata(1),
          },
        ],
        method: 'POST',
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
              endpoint: destinations[13].Config.apiUrl,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              FORM: {
                contacts: JSON.stringify({
                  first_name: 'John',
                  email: 'john.doe@example.com',
                  address: { pin_code: '123456' },
                }),
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
    id: 'http-configuration-test-8',
    name: destType,
    description:
      'Track call with bearer token, form format, post method, additional headers and properties mapping',
    scenario: 'Business',
    successCriteria:
      'Response should be in form format with post method, headers and properties mapping',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            destination: destinations[10],
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
              endpoint: destinations[10].Config.apiUrl,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: authHeader2,
                h1: 'val1',
                'content-type': 'application/json',
              },
              FORM: {
                currency: 'USD',
                event: 'Order Completed',
                userId: 'userId123',
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
    id: 'http-configuration-test-9',
    name: destType,
    description: 'Track call with bearer token, form url encoded format',
    scenario: 'Business',
    successCriteria:
      'Response should be in form format with post method, headers and properties mapping',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            destination: destinations[11],
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
              endpoint: destinations[11].Config.apiUrl,
              headers: {
                Authorization: authHeader2,
                h1: 'val1',
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              FORM: {
                currency: 'USD',
                event: 'Order Completed',
                userId: 'userId123',
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
    id: 'http-configuration-test-10',
    name: destType,
    description: 'empty body',
    scenario: 'Business',
    successCriteria:
      'Response should be in form format with post method, headers and properties mapping',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            destination: destinations[12],
            message: {},
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
              endpoint: destinations[12].Config.apiUrl,
              headers: {
                Authorization: authHeader2,
                h1: 'val1',
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              FORM: {},
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'http-configuration-test-11',
    name: destType,
    description: 'Identify call with default properties mapping',
    scenario: 'Business',
    successCriteria: 'Response should be in json format with default properties mapping',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: destinations[14],
            message: {
              type: 'identify',
              userId: 'userId123',
              anonymousId: 'anonId123',
            },
            metadata: generateMetadata(1),
          },
        ],
        method: 'POST',
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
              endpoint: destinations[14].Config.apiUrl,
              headers: {
                'Content-Type': 'application/json',
              },
              JSON: {
                type: 'identify',
                userId: 'userId123',
                anonymousId: 'anonId123',
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
