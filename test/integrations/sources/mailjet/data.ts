export const data = [
  {
    name: 'mailjet',
    description: 'MailJet email open event',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            event: 'open',
            time: 1664443614,
            MessageID: 94857068804950690,
            Message_GUID: '54d6cdec-f659-4547-8926-13d9c4126b82',
            email: 'test@rudderstack.com',
            mj_campaign_id: 108760,
            mj_contact_id: 399962859,
            customcampaign: 'mj.nl=58424',
            ip: '66.249.84.231',
            geo: 'US',
            agent:
              'Mozilla/5.0 (Windows NT 5.1; rv:11.0) Gecko Firefox/11.0 (via ggpht.com GoogleImageProxy)',
            CustomID: '',
            Payload: '',
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
                    integration: { name: 'MailJet' },
                    traits: { email: 'test@rudderstack.com' },
                    ip: '66.249.84.231',
                    userAgent:
                      'Mozilla/5.0 (Windows NT 5.1; rv:11.0) Gecko Firefox/11.0 (via ggpht.com GoogleImageProxy)',
                    externalId: [{ type: 'mailjetContactId', id: 399962859 }],
                  },
                  integrations: { MailJet: false },
                  type: 'track',
                  event: 'open',
                  properties: {
                    ip: '66.249.84.231',
                    customcampaign: 'mj.nl=58424',
                    mj_campaign_id: 108760,
                    Payload: '',
                  },
                  originalTimestamp: '2022-09-29T09:26:54.000Z',
                  userId: '5b6a3426dba2cb24e4f0aeec43bee9d7',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'mailjet',
    description: 'MailJet email bounce event where input event is of type ',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            event: 'bounce',
            time: 1664444171,
            MessageID: 55169098999352350,
            Message_GUID: '447d7eab-3335-4aba-9a51-09454bc14b81',
            email: 'test@rudderstack.com',
            mj_campaign_id: 108892,
            mj_contact_id: 373142816,
            customcampaign: 'mj.nl=58486',
            blocked: false,
            hard_bounce: false,
            error_related_to: 'system',
            error: 'connection issue',
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
                    integration: { name: 'MailJet' },
                    traits: { email: 'test@rudderstack.com' },
                    externalId: [{ type: 'mailjetContactId', id: 373142816 }],
                  },
                  integrations: { MailJet: false },
                  type: 'track',
                  event: 'bounce',
                  properties: { customcampaign: 'mj.nl=58486', mj_campaign_id: 108892 },
                  originalTimestamp: '2022-09-29T09:36:11.000Z',
                  userId: '5b6a3426dba2cb24e4f0aeec43bee9d7',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'mailjet',
    description: 'MailJet email sent event',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            event: 'sent',
            time: 1664444171,
            MessageID: 92886743924596480,
            Message_GUID: '0230c73a-2b77-4aea-8ef2-ed15d0edc5fd',
            email: 'test@rudderstack.com',
            mj_campaign_id: 108892,
            mj_contact_id: 372651182,
            customcampaign: 'mj.nl=58486',
            smtp_reply:
              '250 2.0.0 OK DMARC:Quarantine 1664444171 u17-20020adfdd51000000b0022cc3f2bf13si3225188wrm.271 - gsmtp',
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
                    integration: { name: 'MailJet' },
                    traits: { email: 'test@rudderstack.com' },
                    externalId: [{ type: 'mailjetContactId', id: 372651182 }],
                  },
                  integrations: { MailJet: false },
                  type: 'track',
                  event: 'sent',
                  properties: { customcampaign: 'mj.nl=58486', mj_campaign_id: 108892 },
                  originalTimestamp: '2022-09-29T09:36:11.000Z',
                  userId: '5b6a3426dba2cb24e4f0aeec43bee9d7',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'mailjet',
    description: 'MailJet email bounce event',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            event: 'bounce',
            time: 1664444170,
            MessageID: 56013522696710744,
            Message_GUID: 'dbe4f0a3-4a5a-4784-a724-a9794d3c0444',
            email: 'test@rudderstack.com',
            mj_campaign_id: 108892,
            mj_contact_id: 373142182,
            customcampaign: 'mj.nl=58486',
            blocked: false,
            hard_bounce: false,
            error_related_to: 'system',
            error: 'connection issue',
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
                    integration: { name: 'MailJet' },
                    traits: { email: 'test@rudderstack.com' },
                    externalId: [{ type: 'mailjetContactId', id: 373142182 }],
                  },
                  integrations: { MailJet: false },
                  type: 'track',
                  event: 'bounce',
                  properties: { customcampaign: 'mj.nl=58486', mj_campaign_id: 108892 },
                  originalTimestamp: '2022-09-29T09:36:10.000Z',
                  userId: '5b6a3426dba2cb24e4f0aeec43bee9d7',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'mailjet',
    description: 'MailJet when no email is present',
    module: 'source',
    version: 'v0',
    skipGo: 'FIXME',
    input: {
      request: {
        body: [
          {
            event: 'bounce',
            time: 1664444170,
            MessageID: 56013522696710744,
            Message_GUID: 'dbe4f0a3-4a5a-4784-a724-a9794d3c0444',
            mj_campaign_id: 108892,
            mj_contact_id: 373142182,
            customcampaign: 'mj.nl=58486',
            blocked: false,
            hard_bounce: false,
            error_related_to: 'system',
            error: 'connection issue',
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
                    integration: { name: 'MailJet' },
                    externalId: [{ type: 'mailjetContactId', id: 373142182 }],
                  },
                  integrations: { MailJet: false },
                  type: 'track',
                  event: 'bounce',
                  properties: { customcampaign: 'mj.nl=58486', mj_campaign_id: 108892 },
                  originalTimestamp: '2022-09-29T09:36:10.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'mailjet',
    description: 'MailJet Multiple payloads in single request',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            event: 'open',
            time: 1704458040,
            MessageID: 987654,
            Message_GUID: '876r-oihugyf-7tfygh',
            email: 'abc@r.com',
            mj_campaign_id: 321,
            mj_contact_id: 123,
            customcampaign: 'test_campaign',
            url: 'https://www.example.com/',
            ip: 'ip_info',
            geo: 'some geo info',
            agent: 'mailjet api test',
          },
          {
            event: 'click',
            time: 1704458041,
            MessageID: 12345234567,
            Message_GUID: '12345-kjhgfd-2efv',
            email: 'abc@r.com',
            mj_campaign_id: 12,
            mj_contact_id: 32532,
            customcampaign: 'test_campaign',
            url: 'https://www.example.com/',
            ip: 'ip_info',
            geo: 'some geo info',
            agent: 'mailjet api test',
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
                    ip: 'ip_info',
                    integration: { name: 'MailJet' },
                    traits: { email: 'abc@r.com' },
                    page: { url: 'https://www.example.com/' },
                    userAgent: 'mailjet api test',
                    externalId: [{ type: 'mailjetContactId', id: 123 }],
                  },
                  integrations: { MailJet: false },
                  type: 'track',
                  event: 'open',
                  properties: {
                    customcampaign: 'test_campaign',
                    mj_campaign_id: 321,
                    ip: 'ip_info',
                    url: 'https://www.example.com/',
                  },
                  userId: '593a5aff0b445b3b77a6d9676b7ec86e',
                  originalTimestamp: '2024-01-05T12:34:00.000Z',
                },
              ],
            },
          },
          {
            output: {
              batch: [
                {
                  context: {
                    library: { name: 'unknown', version: 'unknown' },
                    page: { url: 'https://www.example.com/' },
                    integration: { name: 'MailJet' },
                    traits: { email: 'abc@r.com' },
                    userAgent: 'mailjet api test',
                    ip: 'ip_info',
                    externalId: [{ type: 'mailjetContactId', id: 32532 }],
                  },
                  integrations: { MailJet: false },
                  type: 'track',
                  event: 'click',
                  properties: {
                    customcampaign: 'test_campaign',
                    mj_campaign_id: 12,
                    ip: 'ip_info',
                    url: 'https://www.example.com/',
                  },
                  userId: '593a5aff0b445b3b77a6d9676b7ec86e',
                  originalTimestamp: '2024-01-05T12:34:01.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
];
