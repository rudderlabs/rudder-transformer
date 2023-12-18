export const data = [
  {
    name: 'pagerduty',
    description: 'No Message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              sentAt: '2022-10-11T13:10:54.877+05:30',
              userId: 'user@45',
              rudderId: 'caae04c5-959f-467b-a293-86f6c62d59e6',
              messageId: 'b6ce7f31-5d76-4240-94d2-3eea020ef791',
              timestamp: '2022-10-11T13:10:52.137+05:30',
              receivedAt: '2022-10-11T13:10:52.138+05:30',
              request_ip: '[::1]',
              originalTimestamp: '2022-10-11T13:10:54.877+05:30',
            },
            destination: { Config: { routingKey: '9552b56325dc490bd0139be85f7b8fac' } },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event type is required',
            statTags: {
              destType: 'PAGERDUTY',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'pagerduty',
    description: 'Routing Key is not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              sentAt: '2022-10-11T13:10:54.877+05:30',
              userId: 'user@45',
              context: {},
              rudderId: 'caae04c5-959f-467b-a293-86f6c62d59e6',
              messageId: 'b6ce7f31-5d76-4240-94d2-3eea020ef791',
              timestamp: '2022-10-11T13:10:52.137+05:30',
              receivedAt: '2022-10-11T13:10:52.138+05:30',
              request_ip: '[::1]',
              originalTimestamp: '2022-10-11T13:10:54.877+05:30',
            },
            destination: { Config: {} },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Routing Key Is Required',
            statTags: {
              destType: 'PAGERDUTY',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'pagerduty',
    description: 'Unsupported Event type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'alias',
              sentAt: '2022-10-11T13:10:54.877+05:30',
              userId: 'user@45',
              context: {},
              rudderId: 'caae04c5-959f-467b-a293-86f6c62d59e6',
              messageId: 'b6ce7f31-5d76-4240-94d2-3eea020ef791',
              timestamp: '2022-10-11T13:10:52.137+05:30',
              receivedAt: '2022-10-11T13:10:52.138+05:30',
              request_ip: '[::1]',
              originalTimestamp: '2022-10-11T13:10:54.877+05:30',
            },
            destination: { Config: { routingKey: '9552b56325dc490bd0139be85f7b8fac' } },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event type alias is not supported',
            statTags: {
              destType: 'PAGERDUTY',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'pagerduty',
    description: 'event name is not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              type: 'track',
              messageId: '9116b734-7e6b-4497-ab51-c16744d4487e',
              userId: 'user@45',
              properties: {},
            },
            destination: { Config: { routingKey: '9552b56325dc490bd0139be85f7b8fac' } },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event name is required',
            statTags: {
              destType: 'PAGERDUTY',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'pagerduty',
    description: 'Parameter source is not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              type: 'track',
              event: 'Event name is required',
              messageId: '9116b734-7e6b-4497-ab51-c16744d4487e',
              userId: 'user@45',
              properties: { dedupKey: '9116b734-7e6b-4497-ab51-c16744d4487e' },
            },
            destination: { Config: { routingKey: '9552b56325dc490bd0139be85f7b8fac' } },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Missing required value from "properties.source"',
            statTags: {
              destType: 'PAGERDUTY',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'pagerduty',
    description: 'dedup_key is not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              type: 'track',
              event: 'Event name is required',
              messageId: '9116b734-7e6b-4497-ab51-c16744d4487e',
              userId: 'user@45',
              properties: { action: 'resolve' },
            },
            destination: {
              Config: {
                routingKey: '9552b56325dc490bd0139be85f7b8fac',
                dedupKeyFieldIdentifier: 'properties.dedupKey',
              },
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'dedup_key required for resolve events',
            statTags: {
              destType: 'PAGERDUTY',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'pagerduty',
    description: 'Timestamp older then 90 days',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
            destination: {
              Config: {
                routingKey: '9552b56325dc490bd0139be85f7b8fac',
                dedupKeyFieldIdentifier: 'properties.dedupKey',
              },
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Events must be sent within ninety days of their occurrence',
            statTags: {
              destType: 'PAGERDUTY',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'pagerduty',
    description: 'Trigger event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              type: 'track',
              event: 'apiSecret is not present',
              messageId: '9116b734-7e6b-4497-ab51-c16744d4487e',
              userId: 'user@45',
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
            destination: {
              Config: {
                routingKey: '9552b56325dc490bd0139be85f7b8fac',
                dedupKeyFieldIdentifier: 'properties.dedupKey',
              },
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
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
                    class: 'connection settings',
                    group: 'destination',
                    source: 'rudder-webapp',
                    summary: 'apiSecret is not present',
                    severity: 'critical',
                    component: 'ui',
                    custom_details: { 'ping time': '1500ms', 'load avg': 0.75 },
                  },
                  dedup_key: '9116b734-7e6b-4497-ab51-c16744d4487e',
                  routing_key: '9552b56325dc490bd0139be85f7b8fac',
                  event_action: 'trigger',
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'pagerduty',
    description: 'Acknowledge event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
            destination: {
              Config: {
                routingKey: '9552b56325dc490bd0139be85f7b8fac',
                dedupKeyFieldIdentifier: 'properties.dedupKey',
              },
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'pagerduty',
    description: 'Resolve event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              type: 'track',
              event: 'apiSecret is not present',
              messageId: '9116b734-7e6b-4497-ab51-c16744d4487e',
              userId: 'user@45',
              properties: {
                action: 'resolve',
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
            destination: {
              Config: {
                routingKey: '9552b56325dc490bd0139be85f7b8fac',
                dedupKeyFieldIdentifier: 'properties.dedupKey',
              },
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  dedup_key: '9116b734-7e6b-4497-ab51-c16744d4487e',
                  routing_key: '9552b56325dc490bd0139be85f7b8fac',
                  event_action: 'resolve',
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'pagerduty',
    description: 'Change event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
            destination: {
              Config: {
                routingKey: '9552b56325dc490bd0139be85f7b8fac',
                dedupKeyFieldIdentifier: 'properties.dedupKey',
              },
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
