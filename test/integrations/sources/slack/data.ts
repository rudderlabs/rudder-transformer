export const data = [
  {
    name: 'slack',
    description: 'Webhook url verificatin event',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            token: 'Jhj5dZrVaK7ZwHHjRyZWjbDl',
            challenge: '3eZbrw1aB10FEMAGAZd4FyFQ',
            type: 'url_verification',
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
            outputToSource: {
              body: 'eyJjaGFsbGVuZ2UiOiIzZVpicncxYUIxMEZFTUFHQVpkNEZ5RlEifQ==',
              contentType: 'application/json',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'slack',
    description: 'Team joined event',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            event: {
              type: 'team_join',
              user: {
                id: 'W012CDE',
                name: 'johnd',
                real_name: 'John Doe',
              },
            },
            type: 'event_callback',
            event_id: 'Ev06TJ0NG5',
            event_time: 1709441309,
            token: 'REm276ggfh72Lq',
            team_id: 'T0GFJL5J7',
            context_team_id: 'T0GFJL5J7',
            context_enterprise_id: null,
            api_app_id: 'B02SJMHRR',
            authorizations: [
              {
                enterprise_id: null,
                team_id: 'T0GFJL5J7',
                user_id: 'U04G7H550',
                is_bot: true,
                is_enterprise_install: false,
              },
            ],
            is_ext_shared_channel: false,
            event_context: 'eJldCI65436EUEpMSFhgfhg76joiQzAxRTRQTEIxMzUifQ',
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
                    library: {
                      name: 'unknown',
                      version: 'unknown',
                    },
                    integration: {
                      name: 'SLACK',
                    },
                    externalId: [
                      {
                        type: 'slackUserId',
                        id: 'W012CDE',
                      },
                    ],
                  },
                  integrations: {
                    SLACK: false,
                  },
                  type: 'identify',
                  event: 'Team Join',
                  anonymousId: '2bc5ae2825a712d3d154cbdacb86ac16c278',
                  originalTimestamp: '2024-03-03T04:48:29.000Z',
                  sentAt: '2024-03-03T04:48:29.000Z',
                  properties: {
                    type: 'team_join',
                    user: {
                      id: 'W012CDE',
                      name: 'johnd',
                      real_name: 'John Doe',
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'slack',
    description: 'Message event',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            event: {
              user: 'U04G7H550',
              type: 'message',
              ts: '1709441309.308399',
              client_msg_id: '834r664e-ec75-445d-t5c6-b873a07y9c81',
              text: 'What is the pricing of product X',
              team: 'T0GFJL5J7',
              thread_ts: '1709407304.839329',
              parent_user_id: 'U06P6LQTPV',
              blocks: [
                {
                  type: 'rich_text',
                  block_id: 'xGKJl',
                  elements: [
                    {
                      type: 'rich_text_section',
                      elements: [
                        {
                          type: 'text',
                          text: 'What is the pricing of product X',
                        },
                        {
                          type: 'channel',
                          channel_id: 'C03CDQTPI65',
                        },
                        {
                          type: 'text',
                          text: ' to do this',
                        },
                      ],
                    },
                  ],
                },
              ],
              channel: 'C03CDQTPI65',
              event_ts: '1709441309.308399',
              channel_type: 'channel',
            },
            type: 'event_callback',
            event_id: 'EvY5JTJ0NG5',
            event_time: 1709441309,
            token: 'REm2987dqtpi72Lq',
            team_id: 'T0GFJL5J7',
            context_team_id: 'T01gqtPIL5J7',
            context_enterprise_id: null,
            api_app_id: 'A04QTPIHRR',
            authorizations: [
              {
                enterprise_id: null,
                team_id: 'T0GFJL5J7',
                user_id: 'W012CDE',
                is_bot: true,
                is_enterprise_install: false,
              },
            ],
            is_ext_shared_channel: false,
            event_context: '4-wd6joiQfdgTRQTpIzdfifQ',
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
                    library: {
                      name: 'unknown',
                      version: 'unknown',
                    },
                    integration: {
                      name: 'SLACK',
                    },
                    externalId: [
                      {
                        type: 'slackUserId',
                        id: 'U04G7H550',
                      },
                    ],
                  },
                  integrations: {
                    SLACK: false,
                  },
                  type: 'track',
                  event: 'Message',
                  anonymousId: '7509c04f547b05afb6838aa742f4910263d6',
                  originalTimestamp: '2024-03-03T04:48:29.308Z',
                  sentAt: '2024-03-03T04:48:29.000Z',
                  properties: {
                    user: 'U04G7H550',
                    type: 'message',
                    ts: '1709441309.308399',
                    client_msg_id: '834r664e-ec75-445d-t5c6-b873a07y9c81',
                    text: 'What is the pricing of product X',
                    team: 'T0GFJL5J7',
                    thread_ts: '1709407304.839329',
                    parent_user_id: 'U06P6LQTPV',
                    blocks: [
                      {
                        type: 'rich_text',
                        block_id: 'xGKJl',
                        elements: [
                          {
                            type: 'rich_text_section',
                            elements: [
                              {
                                type: 'text',
                                text: 'What is the pricing of product X',
                              },
                              {
                                type: 'channel',
                                channel_id: 'C03CDQTPI65',
                              },
                              {
                                type: 'text',
                                text: ' to do this',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                    channel: 'C03CDQTPI65',
                    event_ts: '1709441309.308399',
                    channel_type: 'channel',
                  },
                },
              ],
            },
          },
        ],
      },
    },
  },
];
