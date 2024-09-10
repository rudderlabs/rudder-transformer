export const data = [
  {
    name: 'pagerduty',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                channel: 'web',
                type: 'track',
                event: 'Github CI/CD Triggered',
                messageId: '9116b734-7e6b-4497-ab51-c16744d4487e',
                userId: 'user@45',
                properties: {
                  source: 'rudder-webapp',
                  customDetails: { 'ping time': '1500ms', 'load avg': 0.75 },
                  imageURLs: [
                    {
                      src: 'https://static.s4be.cochrane.org/app/uploads/2017/04/shutterstock_531145954.jpg',
                      alt: 'first image',
                    },
                    {
                      src: 'https://chart.googleapis.com/chart?chs=600x400&chd=t:6,2,9,5,2,5,7,4,8,2,1&cht=lc&chds=a&chxt=y&chm=D,0033FF,0,0,5,1',
                      alt: 'second image',
                    },
                    { alt: 'third image' },
                  ],
                  linkURLs: [
                    {
                      href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error',
                      text: 'Js Object Error',
                    },
                    {
                      href: 'https://www.techtarget.com/whatis/definition/stack-overflow#:~:text=A%20stack%20overflow%20is%20a,been%20allocated%20to%20that%20stack',
                      text: 'Stack Overflow Error',
                    },
                    { text: 'Destructure Error' },
                  ],
                },
                integrations: { pagerduty: { type: 'changeEvent' } },
              },
              metadata: { jobId: 1, userId: 'u1' },
              destination: {
                Config: {
                  routingKey: '9552b56325dc490bd0139be85f7b8fac',
                  dedupKeyFieldIdentifier: 'properties.dedupKey',
                },
              },
            },
            {
              message: {
                channel: 'web',
                type: 'track',
                event: 'apiSecret is not present',
                messageId: '9116b734-7e6b-4497-ab51-c16744d4487e',
                userId: 'user@45',
                properties: {
                  action: 'acknowledge',
                  dedupKey: '9116b734-7e6b-4497-ab51-c16744d4487e',
                  severity: 'critical',
                  component: 'ui',
                  source: 'rudder-webapp',
                  group: 'destination',
                  class: 'connection settings',
                  customDetails: { 'ping time': '1500ms', 'load avg': 0.75 },
                  imageURLs: [
                    {
                      src: 'https://static.s4be.cochrane.org/app/uploads/2017/04/shutterstock_531145954.jpg',
                      alt: 'first image',
                    },
                    {
                      src: 'https://chart.googleapis.com/chart?chs=600x400&chd=t:6,2,9,5,2,5,7,4,8,2,1&cht=lc&chds=a&chxt=y&chm=D,0033FF,0,0,5,1',
                      alt: 'second image',
                    },
                    { alt: 'third image' },
                  ],
                  linkURLs: [
                    {
                      href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error',
                      text: 'Js Object Error',
                    },
                    {
                      href: 'https://www.techtarget.com/whatis/definition/stack-overflow#:~:text=A%20stack%20overflow%20is%20a,been%20allocated%20to%20that%20stack',
                      text: 'Stack Overflow Error',
                    },
                    { text: 'Destructure Error' },
                  ],
                },
              },
              metadata: { jobId: 2, userId: 'u1' },
              destination: {
                Config: {
                  routingKey: '9552b56325dc490bd0139be85f7b8fac',
                  dedupKeyFieldIdentifier: 'properties.dedupKey',
                },
              },
            },
            {
              message: {
                channel: 'web',
                type: 'track',
                event: 'apiSecret is not present',
                messageId: '9116b734-7e6b-4497-ab51-c16744d4487e',
                userId: 'user@45',
                originalTimestamp: '2021-12-20T10:26:33.451Z',
                properties: {
                  action: 'trigger',
                  dedupKey: '9116b734-7e6b-4497-ab51-c16744d4487e',
                  severity: 'critical',
                  component: 'ui',
                  source: 'rudder-webapp',
                  group: 'destination',
                  class: 'connection settings',
                  customDetails: { 'ping time': '1500ms', 'load avg': 0.75 },
                  imageURLs: [
                    {
                      src: 'https://static.s4be.cochrane.org/app/uploads/2017/04/shutterstock_531145954.jpg',
                      alt: 'first image',
                    },
                    {
                      src: 'https://chart.googleapis.com/chart?chs=600x400&chd=t:6,2,9,5,2,5,7,4,8,2,1&cht=lc&chds=a&chxt=y&chm=D,0033FF,0,0,5,1',
                      alt: 'second image',
                    },
                    { alt: 'third image' },
                  ],
                  linkURLs: [
                    {
                      href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error',
                      text: 'Js Object Error',
                    },
                    {
                      href: 'https://www.techtarget.com/whatis/definition/stack-overflow#:~:text=A%20stack%20overflow%20is%20a,been%20allocated%20to%20that%20stack',
                      text: 'Stack Overflow Error',
                    },
                    { text: 'Destructure Error' },
                  ],
                },
              },
              metadata: { jobId: 3, userId: 'u1' },
              destination: {
                Config: {
                  routingKey: '9552b56325dc490bd0139be85f7b8fac',
                  dedupKeyFieldIdentifier: 'properties.dedupKey',
                },
              },
            },
          ],
          destType: 'pagerduty',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              batchedRequest: {
                body: {
                  XML: {},
                  FORM: {},
                  JSON: {
                    links: [
                      {
                        href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error',
                        text: 'Js Object Error',
                      },
                      {
                        href: 'https://www.techtarget.com/whatis/definition/stack-overflow#:~:text=A%20stack%20overflow%20is%20a,been%20allocated%20to%20that%20stack',
                        text: 'Stack Overflow Error',
                      },
                    ],
                    images: [
                      {
                        alt: 'first image',
                        src: 'https://static.s4be.cochrane.org/app/uploads/2017/04/shutterstock_531145954.jpg',
                      },
                      {
                        alt: 'second image',
                        src: 'https://chart.googleapis.com/chart?chs=600x400&chd=t:6,2,9,5,2,5,7,4,8,2,1&cht=lc&chds=a&chxt=y&chm=D,0033FF,0,0,5,1',
                      },
                    ],
                    payload: {
                      source: 'rudder-webapp',
                      summary: 'Github CI/CD Triggered',
                      custom_details: { 'load avg': 0.75, 'ping time': '1500ms' },
                    },
                    routing_key: '9552b56325dc490bd0139be85f7b8fac',
                  },
                  JSON_ARRAY: {},
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                headers: { 'Content-Type': 'application/json' },
                version: '1',
                endpoint: 'https://events.pagerduty.com/v2/change/enqueue',
              },
              destination: {
                Config: {
                  routingKey: '9552b56325dc490bd0139be85f7b8fac',
                  dedupKeyFieldIdentifier: 'properties.dedupKey',
                },
              },
              metadata: [{ jobId: 1, userId: 'u1' }],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  XML: {},
                  FORM: {},
                  JSON: {
                    dedup_key: '9116b734-7e6b-4497-ab51-c16744d4487e',
                    routing_key: '9552b56325dc490bd0139be85f7b8fac',
                    event_action: 'acknowledge',
                  },
                  JSON_ARRAY: {},
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                headers: { 'Content-Type': 'application/json' },
                version: '1',
                endpoint: 'https://events.pagerduty.com/v2/enqueue',
              },
              destination: {
                Config: {
                  routingKey: '9552b56325dc490bd0139be85f7b8fac',
                  dedupKeyFieldIdentifier: 'properties.dedupKey',
                },
              },
              metadata: [{ jobId: 2, userId: 'u1' }],
              statusCode: 200,
            },
            {
              batched: false,
              error: 'Events must be sent within ninety days of their occurrence',
              metadata: [{ jobId: 3, userId: 'u1' }],
              statusCode: 400,
              statTags: {
                destType: 'PAGERDUTY',
                feature: 'router',
                module: 'destination',
                implementation: 'native',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
              },
              destination: {
                Config: {
                  routingKey: '9552b56325dc490bd0139be85f7b8fac',
                  dedupKeyFieldIdentifier: 'properties.dedupKey',
                },
              },
            },
          ],
        },
      },
    },
    mockFns: (_) => {
      jest.spyOn(Date, 'now').mockImplementation(() => {
        return new Date('2023-12-20T10:26:33.451Z').valueOf();
      });
    },
  },
];
