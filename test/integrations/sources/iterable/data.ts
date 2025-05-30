export const data = [
  {
    name: 'iterable',
    description: 'test-0',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'test@rudderstack.com',
                eventName: 'emailSubscribe',
                dataFields: {
                  profileUpdatedAt: '2022-04-19 03:33:50 +00:00',
                  publicIdString: 'ad474bf7-e785-480f-b9d0-861b85ab5bf5',
                  signupSource: 'WebForm',
                  email: 'test@rudderstack.com',
                  createdAt: '2022-04-19 03:33:50 +00:00',
                  messageTypeIds: [],
                  emailListIds: [1589748],
                  channelIds: [],
                },
              }),
            },
            source: {},
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
                  userId: '5b6a3426dba2cb24e4f0aeec43bee9d7',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'test@rudderstack.com' },
                  },
                  event: 'emailSubscribe',
                  integrations: { Iterable: false },
                  properties: {
                    channelIds: [],
                    createdAt: '2022-04-19 03:33:50 +00:00',
                    emailListIds: [1589748],
                    messageTypeIds: [],
                    profileUpdatedAt: '2022-04-19 03:33:50 +00:00',
                    publicIdString: 'ad474bf7-e785-480f-b9d0-861b85ab5bf5',
                    signupSource: 'WebForm',
                  },
                  receivedAt: '2022-04-19T03:33:50.000Z',
                  timestamp: '2022-04-19T03:33:50.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-1',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                eventName: 'emailSubscribe',
                dataFields: {
                  profileUpdatedAt: '2022-04-19 03:33:50 +00:00',
                  publicIdString: 'ad474bf7-e785-480f-b9d0-861b85ab5bf5',
                  signupSource: 'WebForm',
                  email: 'test@abcd.com',
                  createdAt: '2022-04-19 03:33:50 +00:00',
                  messageTypeIds: [],
                  emailListIds: [1589748],
                  channelIds: [],
                },
              }),
            },
            source: {},
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
            error: 'Unknwon event type from Iterable',
            statTags: {
              destinationId: 'Non determinable',
              errorCategory: 'transformation',
              implementation: 'native',
              module: 'source',
              srcType: 'iterable',
              workspaceId: 'Non determinable',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-2',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'test@ruddstack.com',
                eventTitle: 'smsReceived',
                dataFields: {
                  fromPhoneNumber: '+16503926753',
                  toPhoneNumber: '+14155824541',
                  smsMessage: 'Message text',
                  email: 'docs@iterable.com',
                  createdAt: '2016-12-05 22:51:25 +00:00',
                },
              }),
            },
            source: {},
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
            error: 'Unknwon event type from Iterable',
            statTags: {
              destinationId: 'Non determinable',
              errorCategory: 'transformation',
              implementation: 'native',
              module: 'source',
              srcType: 'iterable',
              workspaceId: 'Non determinable',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-3',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'test@rudderstack.com',
                eventName: 'inAppSendSkip',
              }),
            },
            source: {},
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
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'test@rudderstack.com' },
                  },
                  event: 'inAppSendSkip',
                  integrations: { Iterable: false },
                  type: 'track',
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
    name: 'iterable',
    description: 'test-4',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'test@rudderstack.com',
                eventName: 'emailSend',
                dataFields: {
                  contentId: 331201,
                  email: 'test@rudderstack.com',
                  createdAt: '2016-12-02 20:21:04 +00:00',
                  campaignId: 59667,
                  templateId: 93849,
                  messageId: 'd0aa7801f91f4824997a631f3ed583c3',
                  emailSubject: 'My subject',
                  campaignName: 'My campaign name',
                  workflowId: null,
                  workflowName: null,
                  templateName: 'My template name',
                  channelId: 3420,
                  messageTypeId: 3866,
                  experimentId: null,
                  emailId: 'c59667:t93849:docs@iterable.com',
                },
              }),
            },
            source: {},
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
                  userId: '5b6a3426dba2cb24e4f0aeec43bee9d7',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'test@rudderstack.com' },
                  },
                  event: 'emailSend',
                  integrations: { Iterable: false },
                  properties: {
                    contentId: 331201,
                    createdAt: '2016-12-02 20:21:04 +00:00',
                    campaignId: 59667,
                    templateId: 93849,
                    messageId: 'd0aa7801f91f4824997a631f3ed583c3',
                    emailSubject: 'My subject',
                    campaignName: 'My campaign name',
                    workflowId: null,
                    workflowName: null,
                    templateName: 'My template name',
                    channelId: 3420,
                    messageTypeId: 3866,
                    experimentId: null,
                    emailId: 'c59667:t93849:docs@iterable.com',
                  },
                  receivedAt: '2016-12-02T20:21:04.000Z',
                  timestamp: '2016-12-02T20:21:04.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-5',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'invalid_email@iterable.com',
                eventName: 'emailBounce',
                dataFields: {
                  emailSubject: 'My subject',
                  campaignName: 'My campaign name',
                  workflowId: null,
                  workflowName: null,
                  templateName: 'My template name',
                  channelId: 2598,
                  messageTypeId: 2870,
                  experimentId: null,
                  recipientState: 'HardBounce',
                  templateId: 167484,
                  email: 'invalid_email@iterable.com',
                  createdAt: '2017-05-15 23:59:47 +00:00',
                  campaignId: 114746,
                  messageId: 'd0aa7801f91f4824997a631f3ed583c3',
                  emailId: 'c114746:t167484:invalid_email@iterable.com',
                },
              }),
            },
            source: {},
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
                  userId: 'b053765f5d0d23b0d5e4dd960be9513f',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'invalid_email@iterable.com' },
                  },
                  event: 'emailBounce',
                  integrations: { Iterable: false },
                  properties: {
                    emailSubject: 'My subject',
                    campaignName: 'My campaign name',
                    workflowId: null,
                    workflowName: null,
                    templateName: 'My template name',
                    channelId: 2598,
                    messageTypeId: 2870,
                    experimentId: null,
                    recipientState: 'HardBounce',
                    templateId: 167484,
                    createdAt: '2017-05-15 23:59:47 +00:00',
                    campaignId: 114746,
                    messageId: 'd0aa7801f91f4824997a631f3ed583c3',
                    emailId: 'c114746:t167484:invalid_email@iterable.com',
                  },
                  receivedAt: '2017-05-15T23:59:47.000Z',
                  timestamp: '2017-05-15T23:59:47.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-6',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'emailClick',
                dataFields: {
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36',
                  ip: '162.245.22.184',
                  templateId: 93849,
                  userAgentDevice: 'Mac',
                  url: 'https://www.iterable.com',
                  canonicalUrlId: '3145668988',
                  city: 'San Francisco',
                  region: 'CA',
                  email: 'docs@iterable.com',
                  createdAt: '2016-12-02 20:31:39 +00:00',
                  campaignId: 59667,
                  messageId: 'd0aa7801f91f4824997a631f3ed583c3',
                  emailSubject: 'My subject',
                  campaignName: 'My campaign name',
                  workflowId: null,
                  workflowName: null,
                  templateName: 'My template name',
                  channelId: 3420,
                  messageTypeId: 3866,
                  experimentId: null,
                  linkUrl: 'https://www.iterable.com',
                  linkId: '3145668988',
                  emailId: 'c59667:t93849:docs@iterable.com',
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'emailClick',
                  integrations: { Iterable: false },
                  properties: {
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36',
                    ip: '162.245.22.184',
                    templateId: 93849,
                    userAgentDevice: 'Mac',
                    url: 'https://www.iterable.com',
                    canonicalUrlId: '3145668988',
                    city: 'San Francisco',
                    region: 'CA',
                    createdAt: '2016-12-02 20:31:39 +00:00',
                    campaignId: 59667,
                    messageId: 'd0aa7801f91f4824997a631f3ed583c3',
                    emailSubject: 'My subject',
                    campaignName: 'My campaign name',
                    workflowId: null,
                    workflowName: null,
                    templateName: 'My template name',
                    channelId: 3420,
                    messageTypeId: 3866,
                    experimentId: null,
                    linkUrl: 'https://www.iterable.com',
                    linkId: '3145668988',
                    emailId: 'c59667:t93849:docs@iterable.com',
                  },
                  receivedAt: '2016-12-02T20:31:39.000Z',
                  timestamp: '2016-12-02T20:31:39.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-7',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'emailComplaint',
                dataFields: {
                  recipientState: 'Complaint',
                  templateId: 79190,
                  email: 'docs@iterable.com',
                  createdAt: '2016-12-09 18:52:19 +00:00',
                  campaignId: 49313,
                  messageId: 'd3c44d47b4994306b4db8d16a94db025',
                  emailSubject: 'My subject',
                  campaignName: 'My campaign name',
                  workflowId: null,
                  workflowName: null,
                  templateName: 'test template',
                  channelId: 3420,
                  messageTypeId: 3866,
                  experimentId: null,
                  emailId: 'c49313:t79190:docs@iterable.com',
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'emailComplaint',
                  integrations: { Iterable: false },
                  properties: {
                    recipientState: 'Complaint',
                    templateId: 79190,
                    createdAt: '2016-12-09 18:52:19 +00:00',
                    campaignId: 49313,
                    messageId: 'd3c44d47b4994306b4db8d16a94db025',
                    emailSubject: 'My subject',
                    campaignName: 'My campaign name',
                    workflowId: null,
                    workflowName: null,
                    templateName: 'test template',
                    channelId: 3420,
                    messageTypeId: 3866,
                    experimentId: null,
                    emailId: 'c49313:t79190:docs@iterable.com',
                  },
                  receivedAt: '2016-12-09T18:52:19.000Z',
                  timestamp: '2016-12-09T18:52:19.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-8',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'emailOpen',
                dataFields: {
                  userAgent:
                    'Mozilla/5.0 (Windows NT 5.1; rv:11.0) Gecko Firefox/11.0 (via ggpht.com GoogleImageProxy)',
                  proxySource: 'Gmail',
                  ip: '66.249.84.204',
                  templateId: 79190,
                  device: 'Gmail',
                  email: 'docs@iterable.com',
                  createdAt: '2016-12-02 18:51:45 +00:00',
                  campaignId: 49313,
                  messageId: '210badf49fe54f2591d64ad0d055f4fb',
                  emailSubject: 'My subject',
                  campaignName: 'My campaign name',
                  workflowId: null,
                  workflowName: null,
                  templateName: 'My template name',
                  channelId: 3420,
                  messageTypeId: 3866,
                  experimentId: null,
                  emailId: 'c49313:t79190:docs@iterable.com',
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'emailOpen',
                  integrations: { Iterable: false },
                  properties: {
                    userAgent:
                      'Mozilla/5.0 (Windows NT 5.1; rv:11.0) Gecko Firefox/11.0 (via ggpht.com GoogleImageProxy)',
                    proxySource: 'Gmail',
                    ip: '66.249.84.204',
                    templateId: 79190,
                    device: 'Gmail',
                    createdAt: '2016-12-02 18:51:45 +00:00',
                    campaignId: 49313,
                    messageId: '210badf49fe54f2591d64ad0d055f4fb',
                    emailSubject: 'My subject',
                    campaignName: 'My campaign name',
                    workflowId: null,
                    workflowName: null,
                    templateName: 'My template name',
                    channelId: 3420,
                    messageTypeId: 3866,
                    experimentId: null,
                    emailId: 'c49313:t79190:docs@iterable.com',
                  },
                  receivedAt: '2016-12-02T18:51:45.000Z',
                  timestamp: '2016-12-02T18:51:45.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-9',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'emailSendSkip',
                dataFields: {
                  createdAt: '2019-08-07 18:56:10 +00:00',
                  reason: 'DuplicateMarketingMessage',
                  campaignId: 721398,
                  messageId: '98430abe1b9842c991ce221010121553',
                  email: 'docs@iterable.com',
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'emailSendSkip',
                  integrations: { Iterable: false },
                  properties: {
                    createdAt: '2019-08-07 18:56:10 +00:00',
                    reason: 'DuplicateMarketingMessage',
                    campaignId: 721398,
                    messageId: '98430abe1b9842c991ce221010121553',
                  },
                  receivedAt: '2019-08-07T18:56:10.000Z',
                  timestamp: '2019-08-07T18:56:10.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-10',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'test@rudderstack.com',
                eventName: 'emailSubscribe',
                dataFields: {
                  profileUpdatedAt: '2022-04-19 03:33:50 +00:00',
                  publicIdString: 'ad474bf7-e785-480f-b9d0-861b85ab5bf5',
                  signupSource: 'WebForm',
                  email: 'test@abcd.com',
                  createdAt: '2022-04-19 03:33:50 +00:00',
                  messageTypeIds: [],
                  emailListIds: [1589748],
                  channelIds: [],
                },
              }),
            },
            source: {},
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
                  userId: '5b6a3426dba2cb24e4f0aeec43bee9d7',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'test@rudderstack.com' },
                  },
                  event: 'emailSubscribe',
                  integrations: { Iterable: false },
                  properties: {
                    channelIds: [],
                    createdAt: '2022-04-19 03:33:50 +00:00',
                    emailListIds: [1589748],
                    messageTypeIds: [],
                    profileUpdatedAt: '2022-04-19 03:33:50 +00:00',
                    publicIdString: 'ad474bf7-e785-480f-b9d0-861b85ab5bf5',
                    signupSource: 'WebForm',
                  },
                  receivedAt: '2022-04-19T03:33:50.000Z',
                  timestamp: '2022-04-19T03:33:50.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-11',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'emailUnSubscribe',
                dataFields: {
                  campaignId: 1089024,
                  messageId: 'bf008db8ab194b65816398c05bf30f99',
                  emailId: 'c1089024:t1526112:docs@iterable.com',
                  workflowName: 'My test workflow',
                  messageTypeIds: [],
                  locale: null,
                  templateId: 1526112,
                  emailSubject: 'Upcoming events!',
                  labels: [],
                  unsubSource: 'EmailLink',
                  createdAt: '2020-03-20 23:34:15 +00:00',
                  templateName: 'My test template',
                  emailListIds: [],
                  messageTypeId: 31082,
                  experimentId: null,
                  channelIds: [27447],
                  campaignName: 'My test campaign',
                  workflowId: 76786,
                  email: 'docs@iterable.com',
                  channelId: 27447,
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'emailUnSubscribe',
                  integrations: { Iterable: false },
                  properties: {
                    campaignId: 1089024,
                    messageId: 'bf008db8ab194b65816398c05bf30f99',
                    emailId: 'c1089024:t1526112:docs@iterable.com',
                    workflowName: 'My test workflow',
                    messageTypeIds: [],
                    locale: null,
                    templateId: 1526112,
                    emailSubject: 'Upcoming events!',
                    labels: [],
                    unsubSource: 'EmailLink',
                    createdAt: '2020-03-20 23:34:15 +00:00',
                    templateName: 'My test template',
                    emailListIds: [],
                    messageTypeId: 31082,
                    experimentId: null,
                    channelIds: [27447],
                    campaignName: 'My test campaign',
                    workflowId: 76786,
                    channelId: 27447,
                  },
                  receivedAt: '2020-03-20T23:34:15.000Z',
                  timestamp: '2020-03-20T23:34:15.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-12',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                userId: '1',
                eventName: 'hostedUnsubscribeClick',
                dataFields: {
                  country: 'United States',
                  city: 'San Jose',
                  campaignId: 1074721,
                  ip: '192.168.0.1',
                  userAgentDevice: 'Mac',
                  messageId: 'ceb3d4d929fc406ca93b28a0ef1efff1',
                  emailId: 'c1074721:t1506266:docs@iterable.com',
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
                  workflowName: 'My workflow',
                  locale: null,
                  templateId: 1506266,
                  emailSubject: 'My email subject',
                  url: 'https://iterable.com',
                  labels: [],
                  createdAt: '2020-03-21 00:24:08 +00:00',
                  templateName: 'My email template',
                  messageTypeId: 13406,
                  experimentId: null,
                  region: 'CA',
                  campaignName: 'My email campaign',
                  workflowId: 60102,
                  email: 'docs@iterable.com',
                  channelId: 12466,
                },
              }),
            },
            source: {},
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
                  userId: '1',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'hostedUnsubscribeClick',
                  integrations: { Iterable: false },
                  properties: {
                    country: 'United States',
                    city: 'San Jose',
                    campaignId: 1074721,
                    ip: '192.168.0.1',
                    userAgentDevice: 'Mac',
                    messageId: 'ceb3d4d929fc406ca93b28a0ef1efff1',
                    emailId: 'c1074721:t1506266:docs@iterable.com',
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
                    workflowName: 'My workflow',
                    locale: null,
                    templateId: 1506266,
                    emailSubject: 'My email subject',
                    url: 'https://iterable.com',
                    labels: [],
                    createdAt: '2020-03-21 00:24:08 +00:00',
                    templateName: 'My email template',
                    messageTypeId: 13406,
                    experimentId: null,
                    region: 'CA',
                    campaignName: 'My email campaign',
                    workflowId: 60102,
                    channelId: 12466,
                  },
                  receivedAt: '2020-03-21T00:24:08.000Z',
                  timestamp: '2020-03-21T00:24:08.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-13',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'inAppClick',
                dataFields: {
                  email: 'docs@iterable.com',
                  createdAt: '2018-03-27 00:44:40 +00:00',
                  campaignId: 269450,
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'inAppClick',
                  integrations: { Iterable: false },
                  properties: {
                    createdAt: '2018-03-27 00:44:40 +00:00',
                    campaignId: 269450,
                  },
                  receivedAt: '2018-03-27T00:44:40.000Z',
                  timestamp: '2018-03-27T00:44:40.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-14',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'inAppOpen',
                dataFields: {
                  email: 'docs@iterable.com',
                  createdAt: '2018-03-27 00:44:30 +00:00',
                  campaignId: 269450,
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'inAppOpen',
                  integrations: { Iterable: false },
                  properties: {
                    createdAt: '2018-03-27 00:44:30 +00:00',
                    campaignId: 269450,
                  },
                  receivedAt: '2018-03-27T00:44:30.000Z',
                  timestamp: '2018-03-27T00:44:30.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-15',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'inAppSend',
                dataFields: {
                  messageContext: { saveToInbox: false, trigger: 'immediate' },
                  campaignId: 732678,
                  contentId: 18997,
                  messageId: 'vA16d48VVi4LQ5hMuZuquKzL0BXTdQJJUMJRjKnL1',
                  workflowName: null,
                  emailId: 'c732678:t1032729:docs@iterable.com',
                  locale: null,
                  templateId: 1032729,
                  inAppBody: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML',
                  expiresAt: '2019-08-08 22:37:40 +00:00',
                  labels: [],
                  createdAt: '2019-08-07 22:37:40 +00:00',
                  templateName: 'My template name',
                  messageTypeId: 14381,
                  experimentId: null,
                  campaignName: 'My campaign name',
                  workflowId: null,
                  channelId: 13353,
                  email: 'docs@iterable.com',
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'inAppSend',
                  integrations: { Iterable: false },
                  properties: {
                    messageContext: { saveToInbox: false, trigger: 'immediate' },
                    campaignId: 732678,
                    contentId: 18997,
                    messageId: 'vA16d48VVi4LQ5hMuZuquKzL0BXTdQJJUMJRjKnL1',
                    workflowName: null,
                    emailId: 'c732678:t1032729:docs@iterable.com',
                    locale: null,
                    templateId: 1032729,
                    inAppBody: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML',
                    expiresAt: '2019-08-08 22:37:40 +00:00',
                    labels: [],
                    createdAt: '2019-08-07 22:37:40 +00:00',
                    templateName: 'My template name',
                    messageTypeId: 14381,
                    experimentId: null,
                    campaignName: 'My campaign name',
                    workflowId: null,
                    channelId: 13353,
                  },
                  receivedAt: '2019-08-07T22:37:40.000Z',
                  timestamp: '2019-08-07T22:37:40.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-16',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'inAppSendSkip',
                dataFields: {
                  messageContext: { saveToInbox: false, trigger: 'immediate' },
                  campaignId: 732678,
                  contentId: 18997,
                  messageId: 'vA16d48VVi4LQ5hMuZuquKzL0BXTdQJJUMJRjKnL1',
                  workflowName: null,
                  emailId: 'c732678:t1032729:docs@iterable.com',
                  locale: null,
                  templateId: 1032729,
                  inAppBody: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML',
                  expiresAt: '2019-08-08 22:37:40 +00:00',
                  labels: [],
                  createdAt: '2019-08-07 22:37:40 +00:00',
                  templateName: 'My template name',
                  messageTypeId: 14381,
                  experimentId: null,
                  campaignName: 'My campaign name',
                  workflowId: null,
                  channelId: 13353,
                  email: 'docs@iterable.com',
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'inAppSendSkip',
                  integrations: { Iterable: false },
                  properties: {
                    messageContext: { saveToInbox: false, trigger: 'immediate' },
                    campaignId: 732678,
                    contentId: 18997,
                    messageId: 'vA16d48VVi4LQ5hMuZuquKzL0BXTdQJJUMJRjKnL1',
                    workflowName: null,
                    emailId: 'c732678:t1032729:docs@iterable.com',
                    locale: null,
                    templateId: 1032729,
                    inAppBody: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML',
                    expiresAt: '2019-08-08 22:37:40 +00:00',
                    labels: [],
                    createdAt: '2019-08-07 22:37:40 +00:00',
                    templateName: 'My template name',
                    messageTypeId: 14381,
                    experimentId: null,
                    campaignName: 'My campaign name',
                    workflowId: null,
                    channelId: 13353,
                  },
                  receivedAt: '2019-08-07T22:37:40.000Z',
                  timestamp: '2019-08-07T22:37:40.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-17',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'pushBounce',
                dataFields: {
                  platformEndpoint: '<Platform endpoint>',
                  email: 'docs@iterable.com',
                  createdAt: '2016-12-10 01:00:38 +00:00',
                  campaignId: 74768,
                  templateId: 113554,
                  pushMessage: 'Push message text',
                  campaignName: 'My campaign name',
                  workflowId: null,
                  workflowName: null,
                  templateName: 'My template name',
                  channelId: 2203,
                  messageTypeId: 2439,
                  experimentId: null,
                  payload: { path: 'yourpath/subpath' },
                  sound: '',
                  badge: null,
                  contentAvailable: false,
                  deeplink: null,
                  locale: null,
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'pushBounce',
                  integrations: { Iterable: false },
                  properties: {
                    platformEndpoint: '<Platform endpoint>',
                    createdAt: '2016-12-10 01:00:38 +00:00',
                    campaignId: 74768,
                    templateId: 113554,
                    pushMessage: 'Push message text',
                    campaignName: 'My campaign name',
                    workflowId: null,
                    workflowName: null,
                    templateName: 'My template name',
                    channelId: 2203,
                    messageTypeId: 2439,
                    experimentId: null,
                    payload: { path: 'yourpath/subpath' },
                    sound: '',
                    badge: null,
                    contentAvailable: false,
                    deeplink: null,
                    locale: null,
                  },
                  receivedAt: '2016-12-10T01:00:38.000Z',
                  timestamp: '2016-12-10T01:00:38.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-18',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'pushOpen',
                dataFields: {
                  appAlreadyRunning: false,
                  email: 'docs@iterable.com',
                  createdAt: '2016-12-08 01:25:22 +00:00',
                  campaignId: 74768,
                  templateId: 113554,
                  pushMessage: 'Push message text',
                  campaignName: 'My campaign name',
                  workflowId: null,
                  workflowName: null,
                  templateName: 'My template name',
                  channelId: 2203,
                  messageTypeId: 2439,
                  experimentId: null,
                  payload: { path: 'shop_home' },
                  sound: null,
                  badge: null,
                  contentAvailable: false,
                  deeplink: null,
                  locale: null,
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'pushOpen',
                  integrations: { Iterable: false },
                  properties: {
                    appAlreadyRunning: false,
                    createdAt: '2016-12-08 01:25:22 +00:00',
                    campaignId: 74768,
                    templateId: 113554,
                    pushMessage: 'Push message text',
                    campaignName: 'My campaign name',
                    workflowId: null,
                    workflowName: null,
                    templateName: 'My template name',
                    channelId: 2203,
                    messageTypeId: 2439,
                    experimentId: null,
                    payload: { path: 'shop_home' },
                    sound: null,
                    badge: null,
                    contentAvailable: false,
                    deeplink: null,
                    locale: null,
                  },
                  receivedAt: '2016-12-08T01:25:22.000Z',
                  timestamp: '2016-12-08T01:25:22.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-19',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'pushSend',
                dataFields: {
                  contentId: 6724,
                  platformEndpoint: '<Platform endpoint>',
                  email: 'docs@iterable.com',
                  createdAt: '2016-12-08 00:53:11 +00:00',
                  campaignId: 74758,
                  templateId: 113541,
                  messageId: '73f2d3f13cd04db0b56c6143b179adc5',
                  pushMessage: 'Push message text',
                  campaignName: 'My campaign name',
                  workflowId: null,
                  workflowName: null,
                  templateName: 'My template name',
                  channelId: 1744,
                  messageTypeId: 1759,
                  experimentId: null,
                  payload: { a: '2' },
                  sound: '',
                  badge: '',
                  contentAvailable: false,
                  deeplink: null,
                  locale: null,
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'pushSend',
                  integrations: { Iterable: false },
                  properties: {
                    contentId: 6724,
                    platformEndpoint: '<Platform endpoint>',
                    createdAt: '2016-12-08 00:53:11 +00:00',
                    campaignId: 74758,
                    templateId: 113541,
                    messageId: '73f2d3f13cd04db0b56c6143b179adc5',
                    pushMessage: 'Push message text',
                    campaignName: 'My campaign name',
                    workflowId: null,
                    workflowName: null,
                    templateName: 'My template name',
                    channelId: 1744,
                    messageTypeId: 1759,
                    experimentId: null,
                    payload: { a: '2' },
                    sound: '',
                    badge: '',
                    contentAvailable: false,
                    deeplink: null,
                    locale: null,
                  },
                  receivedAt: '2016-12-08T00:53:11.000Z',
                  timestamp: '2016-12-08T00:53:11.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-20',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'pushSendSkip',
                dataFields: {
                  createdAt: '2019-08-07 22:28:51 +00:00',
                  reason: 'DuplicateMarketingMessage',
                  campaignId: 732667,
                  messageId: '8306ae0c74324635b7554947c5ec0e56',
                  email: 'docs@iterable.com',
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'pushSendSkip',
                  integrations: { Iterable: false },
                  properties: {
                    createdAt: '2019-08-07 22:28:51 +00:00',
                    reason: 'DuplicateMarketingMessage',
                    campaignId: 732667,
                    messageId: '8306ae0c74324635b7554947c5ec0e56',
                  },
                  receivedAt: '2019-08-07T22:28:51.000Z',
                  timestamp: '2019-08-07T22:28:51.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-21',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'pushUninstall',
                dataFields: {
                  isGhostPush: false,
                  platformEndpoint: '<Platform endpoint>',
                  email: 'docs@iterable.com',
                  createdAt: '2016-12-09 20:50:54 +00:00',
                  campaignId: 74768,
                  templateId: 113554,
                  messageId: '73f2d3f13cd04db0b56c6143b179adc5',
                  pushMessage: 'Push message text',
                  campaignName: 'My campaign name',
                  workflowId: null,
                  workflowName: null,
                  templateName: 'My template name',
                  channelId: 2203,
                  messageTypeId: 2439,
                  experimentId: null,
                  payload: { path: 'your_folder/30' },
                  sound: '',
                  badge: null,
                  contentAvailable: false,
                  deeplink: null,
                  locale: null,
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'pushUninstall',
                  integrations: { Iterable: false },
                  properties: {
                    isGhostPush: false,
                    platformEndpoint: '<Platform endpoint>',
                    createdAt: '2016-12-09 20:50:54 +00:00',
                    campaignId: 74768,
                    templateId: 113554,
                    messageId: '73f2d3f13cd04db0b56c6143b179adc5',
                    pushMessage: 'Push message text',
                    campaignName: 'My campaign name',
                    workflowId: null,
                    workflowName: null,
                    templateName: 'My template name',
                    channelId: 2203,
                    messageTypeId: 2439,
                    experimentId: null,
                    payload: { path: 'your_folder/30' },
                    sound: '',
                    badge: null,
                    contentAvailable: false,
                    deeplink: null,
                    locale: null,
                  },
                  receivedAt: '2016-12-09T20:50:54.000Z',
                  timestamp: '2016-12-09T20:50:54.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-22',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'smsBounce',
                dataFields: {
                  smsProviderResponse: {
                    status: 404,
                    message:
                      'The requested resource /2010-04-01/Accounts/ACCOUNT_NUMBER/Messages.json was not found',
                    code: 20404,
                    more_info: 'https://www.twilio.com/docs/errors/20404',
                  },
                  email: 'docs@iterable.com',
                  createdAt: '2016-12-05 22:43:24 +00:00',
                  campaignId: 74003,
                  templateId: 112561,
                  smsMessage: "Here is example message, please respond with 'received'",
                  campaignName: 'My campaign name',
                  workflowId: null,
                  workflowName: null,
                  templateName: 'My template name',
                  channelId: 4270,
                  messageTypeId: 4769,
                  experimentId: null,
                  fromPhoneNumberId: 268,
                  imageUrl: null,
                  locale: null,
                  emailId: 'c74003:t112561:docs@iterable.com',
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'smsBounce',
                  integrations: { Iterable: false },
                  properties: {
                    smsProviderResponse: {
                      status: 404,
                      message:
                        'The requested resource /2010-04-01/Accounts/ACCOUNT_NUMBER/Messages.json was not found',
                      code: 20404,
                      more_info: 'https://www.twilio.com/docs/errors/20404',
                    },
                    createdAt: '2016-12-05 22:43:24 +00:00',
                    campaignId: 74003,
                    templateId: 112561,
                    smsMessage: "Here is example message, please respond with 'received'",
                    campaignName: 'My campaign name',
                    workflowId: null,
                    workflowName: null,
                    templateName: 'My template name',
                    channelId: 4270,
                    messageTypeId: 4769,
                    experimentId: null,
                    fromPhoneNumberId: 268,
                    imageUrl: null,
                    locale: null,
                    emailId: 'c74003:t112561:docs@iterable.com',
                  },
                  receivedAt: '2016-12-05T22:43:24.000Z',
                  timestamp: '2016-12-05T22:43:24.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-23',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'smsClick',
                dataFields: {
                  campaignId: 1234567,
                  campaignName: 'My test campaign',
                  workflowId: null,
                  workflowName: null,
                  templateName: 'My template',
                  locale: null,
                  channelId: 98765,
                  messageTypeId: 43210,
                  experimentId: null,
                  labels: [],
                  smsMessage: 'Test SMS! https://www.example.com',
                  fromPhoneNumberId: 1234,
                  imageUrl: null,
                  clickedUrl: 'https://www.example.com',
                  email: 'docs@iterable.com',
                  createdAt: '2022-03-10 05:00:14 +00:00',
                  templateId: 1112222,
                  messageId: 'ebd8f3cfc1f74353b423c5e0f3dd8b39',
                  emailId: 'c1234567:t9876543:docs@iterable.com',
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'smsClick',
                  integrations: { Iterable: false },
                  properties: {
                    campaignId: 1234567,
                    campaignName: 'My test campaign',
                    workflowId: null,
                    workflowName: null,
                    templateName: 'My template',
                    locale: null,
                    channelId: 98765,
                    messageTypeId: 43210,
                    experimentId: null,
                    labels: [],
                    smsMessage: 'Test SMS! https://www.example.com',
                    fromPhoneNumberId: 1234,
                    imageUrl: null,
                    clickedUrl: 'https://www.example.com',
                    createdAt: '2022-03-10 05:00:14 +00:00',
                    templateId: 1112222,
                    messageId: 'ebd8f3cfc1f74353b423c5e0f3dd8b39',
                    emailId: 'c1234567:t9876543:docs@iterable.com',
                  },
                  receivedAt: '2022-03-10T05:00:14.000Z',
                  timestamp: '2022-03-10T05:00:14.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-24',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'smsReceived',
                dataFields: {
                  fromPhoneNumber: '+16503926753',
                  toPhoneNumber: '+14155824541',
                  smsMessage: 'Message text',
                  email: 'docs@iterable.com',
                  createdAt: '2016-12-05 22:51:25 +00:00',
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'smsReceived',
                  integrations: { Iterable: false },
                  properties: {
                    fromPhoneNumber: '+16503926753',
                    toPhoneNumber: '+14155824541',
                    smsMessage: 'Message text',
                    createdAt: '2016-12-05 22:51:25 +00:00',
                  },
                  receivedAt: '2016-12-05T22:51:25.000Z',
                  timestamp: '2016-12-05T22:51:25.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-25',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'smsSend',
                dataFields: {
                  toPhoneNumber: '+16503926753',
                  fromSMSSenderId: 258,
                  contentId: 2086,
                  email: 'docs@iterable.com',
                  createdAt: '2016-12-05 21:50:32 +00:00',
                  campaignId: 73974,
                  templateId: 112523,
                  smsMessage: 'Message text',
                  campaignName: 'My campaign name',
                  workflowId: null,
                  workflowName: null,
                  templateName: 'My template name',
                  channelId: 4270,
                  messageTypeId: 4769,
                  experimentId: null,
                  fromPhoneNumberId: 258,
                  imageUrl: null,
                  locale: null,
                  emailId: 'c73974:t112523:docs@iterable.com',
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'smsSend',
                  integrations: { Iterable: false },
                  properties: {
                    toPhoneNumber: '+16503926753',
                    fromSMSSenderId: 258,
                    contentId: 2086,
                    createdAt: '2016-12-05 21:50:32 +00:00',
                    campaignId: 73974,
                    templateId: 112523,
                    smsMessage: 'Message text',
                    campaignName: 'My campaign name',
                    workflowId: null,
                    workflowName: null,
                    templateName: 'My template name',
                    channelId: 4270,
                    messageTypeId: 4769,
                    experimentId: null,
                    fromPhoneNumberId: 258,
                    imageUrl: null,
                    locale: null,
                    emailId: 'c73974:t112523:docs@iterable.com',
                  },
                  receivedAt: '2016-12-05T21:50:32.000Z',
                  timestamp: '2016-12-05T21:50:32.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-26',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'smsSendSkip',
                dataFields: {
                  createdAt: '2019-08-07 18:49:48 +00:00',
                  reason: 'DuplicateMarketingMessage',
                  campaignId: 729390,
                  messageId: '2c780bf42f26485db0fc6571d2e0f6a0',
                  email: 'docs@iterable.com',
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'smsSendSkip',
                  integrations: { Iterable: false },
                  properties: {
                    createdAt: '2019-08-07 18:49:48 +00:00',
                    reason: 'DuplicateMarketingMessage',
                    campaignId: 729390,
                    messageId: '2c780bf42f26485db0fc6571d2e0f6a0',
                  },
                  receivedAt: '2019-08-07T18:49:48.000Z',
                  timestamp: '2019-08-07T18:49:48.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-27',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'emailSend',
                dataFields: {
                  contentId: 274222,
                  email: 'docs@iterable.com',
                  createdAt: '2016-12-02 18:51:40 +00:00',
                  campaignId: 49313,
                  transactionalData: {
                    __comment:
                      'transactionalData lists the fields contained in the dataFields property of the API call or event used to trigger the email, campaign, or workflow. transactionalData must contain no more than 12k characters in total.',
                  },
                  templateId: 79190,
                  messageId: '210badf49fe54f2591d64ad0d055f4fb',
                  emailSubject: 'My subject',
                  campaignName: 'My campaign name',
                  workflowId: null,
                  workflowName: null,
                  templateName: 'My template name',
                  channelId: 3420,
                  messageTypeId: 3866,
                  experimentId: null,
                  emailId: 'c49313:t79190:docs@iterable.com',
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'emailSend',
                  integrations: { Iterable: false },
                  properties: {
                    contentId: 274222,
                    createdAt: '2016-12-02 18:51:40 +00:00',
                    campaignId: 49313,
                    transactionalData: {
                      __comment:
                        'transactionalData lists the fields contained in the dataFields property of the API call or event used to trigger the email, campaign, or workflow. transactionalData must contain no more than 12k characters in total.',
                    },
                    templateId: 79190,
                    messageId: '210badf49fe54f2591d64ad0d055f4fb',
                    emailSubject: 'My subject',
                    campaignName: 'My campaign name',
                    workflowId: null,
                    workflowName: null,
                    templateName: 'My template name',
                    channelId: 3420,
                    messageTypeId: 3866,
                    experimentId: null,
                    emailId: 'c49313:t79190:docs@iterable.com',
                  },
                  receivedAt: '2016-12-02T18:51:40.000Z',
                  timestamp: '2016-12-02T18:51:40.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-28',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'webPushSend',
                dataFields: {
                  campaignId: 723636,
                  browserToken:
                    'cZn_inqLGPk:APA91bHsn5jo0-4V55RB38eCeLHj8ZXVJYciU7k6Kipbit3lrRlEe2Dt6bNzR4lSf6r2YNVdWY8l90hV0jmb_Y7y5ufcJ68xNI7wbsH6Q2jbEghA_Qo4kWbtu6A4NZN4gxc1xsEbyh7b',
                  contentId: 3681,
                  messageId: 'af4c726ae76b48c7871b6d0d7760d47c',
                  workflowName: 'My workflow name',
                  emailId: 'c723636:t1020396:docs@iterable.com',
                  locale: null,
                  webPushIcon: null,
                  templateId: 1020396,
                  labels: [],
                  createdAt: '2019-08-07 23:43:02 +00:00',
                  templateName: 'My template name',
                  webPushMessage: '',
                  messageTypeId: 9106,
                  webPushBody: null,
                  experimentId: null,
                  webPushClickAction: null,
                  campaignName: 'My campaign name',
                  workflowId: 53505,
                  channelId: 8539,
                  email: 'docs@iterable.com',
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'webPushSend',
                  integrations: { Iterable: false },
                  properties: {
                    campaignId: 723636,
                    browserToken:
                      'cZn_inqLGPk:APA91bHsn5jo0-4V55RB38eCeLHj8ZXVJYciU7k6Kipbit3lrRlEe2Dt6bNzR4lSf6r2YNVdWY8l90hV0jmb_Y7y5ufcJ68xNI7wbsH6Q2jbEghA_Qo4kWbtu6A4NZN4gxc1xsEbyh7b',
                    contentId: 3681,
                    messageId: 'af4c726ae76b48c7871b6d0d7760d47c',
                    workflowName: 'My workflow name',
                    emailId: 'c723636:t1020396:docs@iterable.com',
                    locale: null,
                    webPushIcon: null,
                    templateId: 1020396,
                    labels: [],
                    createdAt: '2019-08-07 23:43:02 +00:00',
                    templateName: 'My template name',
                    webPushMessage: '',
                    messageTypeId: 9106,
                    webPushBody: null,
                    experimentId: null,
                    webPushClickAction: null,
                    campaignName: 'My campaign name',
                    workflowId: 53505,
                    channelId: 8539,
                  },
                  receivedAt: '2019-08-07T23:43:02.000Z',
                  timestamp: '2019-08-07T23:43:02.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'test-29',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                email: 'docs@iterable.com',
                eventName: 'webPushSendSkip',
                dataFields: {
                  createdAt: '2019-08-07 23:43:48 +00:00',
                  reason: 'DuplicateMarketingMessage',
                  campaignId: 723636,
                  messageId: '4238c918b20a41dfbe9a910275b76f12',
                  email: 'docs@iterable.com',
                },
              }),
            },
            source: {},
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
                  userId: '0e13848b1c7e27eb5d88c5d35b70783e',
                  context: {
                    integration: { name: 'Iterable', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'docs@iterable.com' },
                  },
                  event: 'webPushSendSkip',
                  integrations: { Iterable: false },
                  properties: {
                    createdAt: '2019-08-07 23:43:48 +00:00',
                    reason: 'DuplicateMarketingMessage',
                    campaignId: 723636,
                    messageId: '4238c918b20a41dfbe9a910275b76f12',
                  },
                  receivedAt: '2019-08-07T23:43:48.000Z',
                  timestamp: '2019-08-07T23:43:48.000Z',
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
].map((tc) => ({
  ...tc,
  overrideReceivedAt: true,
}));
