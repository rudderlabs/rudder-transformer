export const data = [
  {
    name: 'formsort',
    description: 'when we receive finalized as false',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            answers: {
              yes: true,
              enter_email: 'test@user.com',
              enter_name: '2022-11-17',
              yes_or_no: false,
            },
            responder_uuid: '66a8e5bb-67e1-47ec-b55f-a26fd4be2dc7',
            flow_label: 'new-flow-2022-11-25',
            variant_label: 'main',
            variant_uuid: '0828efa7-7215-4e7d-a7ab-6c1079010cea',
            finalized: false,
            created_at: '2022-11-25T14:41:22+00:00',
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
                    integration: { name: 'Formsort' },
                    page: { title: 'new-flow-2022-11-25' },
                    variantLabel: 'main',
                    variantUuid: '0828efa7-7215-4e7d-a7ab-6c1079010cea',
                  },
                  integrations: { Formsort: false },
                  type: 'track',
                  userId: '66a8e5bb-67e1-47ec-b55f-a26fd4be2dc7',
                  originalTimestamp: '2022-11-25T14:41:22+00:00',
                  properties: {
                    yes: true,
                    enter_email: 'test@user.com',
                    enter_name: '2022-11-17',
                    yes_or_no: false,
                  },
                  event: 'FlowLoaded',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'formsort',
    description: 'when we receive finalized as true',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            answers: {
              yes: true,
              enter_email: 'test@user.com',
              enter_name: '2022-11-17',
              yes_or_no: false,
            },
            responder_uuid: '66a8e5bb-67e1-47ec-b55f-a26fd4be2dc7',
            flow_label: 'new-flow-2022-11-25',
            variant_label: 'main',
            variant_uuid: '0828efa7-7215-4e7d-a7ab-6c1079010cea',
            finalized: true,
            created_at: '2022-11-25T14:41:22+00:00',
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
                    integration: { name: 'Formsort' },
                    page: { title: 'new-flow-2022-11-25' },
                    variantLabel: 'main',
                    variantUuid: '0828efa7-7215-4e7d-a7ab-6c1079010cea',
                  },
                  integrations: { Formsort: false },
                  type: 'track',
                  userId: '66a8e5bb-67e1-47ec-b55f-a26fd4be2dc7',
                  originalTimestamp: '2022-11-25T14:41:22+00:00',
                  properties: {
                    yes: true,
                    enter_email: 'test@user.com',
                    enter_name: '2022-11-17',
                    yes_or_no: false,
                  },
                  event: 'FlowFinalized',
                },
              ],
            },
          },
        ],
      },
    },
  },
];
