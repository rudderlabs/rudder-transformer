export const data = [
  {
    name: 'ortto',
    description: 'Simple track call',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            activity: {
              id: "00651b946bfef7e80478efee",
              field_id: "act::s-all",
              created: "2023-10-03T04:11:23Z",
              attr: {
                "str::is": "API",
                "str::s-ctx": "Subscribed via API"
              }
            },
            contact: {
              contact_id: "00651b946baa9be6b2edad00",
              email: "abhi@example.com"
            },
            id: "00651b946cef87c7af64f4f3",
            time: "2023-10-03T04:11:24.25726779Z",
            webhook_id: "651b8aec8002153e16319fd3"
          },
        ],
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  context: {
                    library: { name: 'unknown', version: 'unknown' },
                    integration: { name: 'ortto' },
                    traits: { email: 'abhi@example.com' },
                  },
                  integrations: { ortto: false },
                  type: 'track',
                  anonymousId: '26b811de-7ed3-448e-a2db-dfb31279dae3',
                  messageId: '00651b946cef87c7af64f4f3',
                  originalTimestamp: '2023-10-03T04:11:24.25726779Z',
                  properties: {
                    'activity.id': '00651b946bfef7e80478efee',
                    'activity.field_id': 'act::s-all',
                    'activity.created': '2023-10-03T04:11:23Z',
                    'activity.attr.str::is': 'API',
                    'activity.attr.str::s-ctx': 'Subscribed via API',
                    webhook_id: '651b8aec8002153e16319fd3',
                  },
                },
              ],
            },
          },
        ],
      },
    },
  }
]