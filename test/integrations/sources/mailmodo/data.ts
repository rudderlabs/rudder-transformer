export const data = [
  {
    name: 'mailmodo',
    description: 'test-0',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            triggerData: {
              data: {},
              triggerSource: 'CsvList',
              email: 'gouhgc@mailmodo.com',
              triggerDetails:
                'file:1a69df39hfbfg4e0b-8b5c-73776157aa37/7647792f-4ebc-4f9d-ac79-05fb0356137e',
              userId: 'd3775892hvh4f2f-b9d5-e49810eb2cae',
              journeyId: '1a69df39hgvh4e0b-8b5c-73776157aa37',
              eventProperty: {},
            },
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
                  anonymousId: 'f43848cce166e51b097cbed2851adc16ed9d4c341928f1c790215c50cefb59b0',
                  context: {
                    externalId: [
                      { id: 'd3775892hvh4f2f-b9d5-e49810eb2cae', type: 'mailmodoUserId' },
                    ],
                    traits: { email: 'gouhgc@mailmodo.com' },
                    integration: { name: 'Mailmodo', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                  },
                  event: 'CsvList',
                  integrations: { Mailmodo: false },
                  properties: {
                    'triggerData.triggerSource': 'CsvList',
                    'triggerData.triggerDetails':
                      'file:1a69df39hfbfg4e0b-8b5c-73776157aa37/7647792f-4ebc-4f9d-ac79-05fb0356137e',
                    'triggerData.journeyId': '1a69df39hgvh4e0b-8b5c-73776157aa37',
                  },
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
    name: 'mailmodo',
    description: 'test-1',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            fuuid: '27905',
            'next-step-id': 'success',
            'total-steps': '3',
            responseId: 'b9a5d224-cc5a-4e64-9800-5a3db9515fdf',
            recipientEmail: 'test.rudderlabs21997@gmail.com',
            formId: 'formosztd5',
            recordedAt: { ts: 1662695704, date: '2022-09-09', hour: 9, minute: 25 },
            submissionSource: 'amp',
            elementjbtz42: 'Everything ',
            element8jzo13: ['Reliable', 'High Quality', 'Useful'],
            recipientData: { email: 'test.rudderlabs21997@gmail.com' },
            recommend: '9',
            liking: 'upvote',
            satisfaction: '4',
            campaignId: '0b53e1bf-84ae-4198-9184-8a4d6e1fa3dd',
            campaignName: 'Campaign-testing',
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
                  anonymousId: 'a80b34ec43ca959c7b8e5116ac626c3cf8561f62616e000a01729a8a900cc0a0',
                  context: {
                    integration: { name: 'Mailmodo', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'test.rudderlabs21997@gmail.com' },
                  },
                  event: 'Form Submitted',
                  integrations: { Mailmodo: false },
                  originalTimestamp: '2022-09-09T03:55:04.000Z',
                  properties: {
                    campaignId: '0b53e1bf-84ae-4198-9184-8a4d6e1fa3dd',
                    campaignName: 'Campaign-testing',
                    'element8jzo13[0]': 'Reliable',
                    'element8jzo13[1]': 'High Quality',
                    'element8jzo13[2]': 'Useful',
                    elementjbtz42: 'Everything ',
                    formId: 'formosztd5',
                    fuuid: '27905',
                    liking: 'upvote',
                    'next-step-id': 'success',
                    recommend: '9',
                    responseId: 'b9a5d224-cc5a-4e64-9800-5a3db9515fdf',
                    satisfaction: '4',
                    submissionSource: 'amp',
                    'total-steps': '3',
                  },
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
    name: 'mailmodo',
    description: 'test-2',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            triggerData: {
              data: {},
              triggerSource: 'Manual Add To List',
              email: 'gou****@mailmodo.com',
              userId: 'd3775892-****-4f2f-b9d5-e49810eb2cae',
              journeyId: '349e986e-f56c-****-bc3b-b5f13c3e34da',
              eventProperty: {},
            },
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
                  anonymousId: '26c9ad4b531287858155ffa834be13dddc2c45df6e29af7230408953d732dd92',
                  context: {
                    externalId: [
                      { id: 'd3775892-****-4f2f-b9d5-e49810eb2cae', type: 'mailmodoUserId' },
                    ],
                    traits: { email: 'gou****@mailmodo.com' },
                    integration: { name: 'Mailmodo', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                  },
                  event: 'Manual Add To List',
                  integrations: { Mailmodo: false },
                  properties: {
                    'triggerData.triggerSource': 'Manual Add To List',
                    'triggerData.journeyId': '349e986e-f56c-****-bc3b-b5f13c3e34da',
                  },
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
    name: 'mailmodo',
    description: 'test-3',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            triggerData: {
              data: {},
              triggerSource: 'Dashboard-change in property: first_name',
              email: 'gou****@mailmodo.com',
              userId: 'cc56708d-****-****-8c07-a4bfa5a7b79b',
              journeyId: 'a78d7221-de34-47d8-81c6-5ad70cf4ee38',
              eventProperty: {},
            },
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
                  anonymousId: '26c9ad4b531287858155ffa834be13dddc2c45df6e29af7230408953d732dd92',
                  context: {
                    externalId: [
                      { id: 'cc56708d-****-****-8c07-a4bfa5a7b79b', type: 'mailmodoUserId' },
                    ],
                    traits: { email: 'gou****@mailmodo.com' },
                    integration: { name: 'Mailmodo', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                  },
                  event: 'Dashboard-change in property: first_name',
                  integrations: { Mailmodo: false },
                  properties: {
                    'triggerData.triggerSource': 'Dashboard-change in property: first_name',
                    'triggerData.journeyId': 'a78d7221-de34-47d8-81c6-5ad70cf4ee38',
                  },
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
    name: 'mailmodo',
    description: 'test-4',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            triggerData: {
              data: {},
              formSubmissionData: {
                element6ehxt3: 'Te**',
                element6jkcy4: 'Bang****',
                fuuid: '47949',
                'next-step-id': 'step7tr7n2',
                'total-steps': '3',
                responseId: '4a8bfda7-****-4a8c-9cd1-a30d30a6dab9',
                recipientEmail: 'gou****@mailmodo.com',
                formId: 'formmqxnu2',
                recordedAt: { ts: 1657097786, date: '2022-07-06', hour: 14, minute: 26 },
                submissionSource: 'amp',
              },
              email: 'gou****@mailmodo.com',
              triggerSource: 'form submission',
              userId: '11bff3e8-****-4e93-a533-fd8f9defc768',
              journeyId: '03664747-****-412e-8790-de9e9abe96a5',
              eventProperty: {},
            },
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
                  anonymousId: '26c9ad4b531287858155ffa834be13dddc2c45df6e29af7230408953d732dd92',
                  context: {
                    externalId: [
                      { id: '11bff3e8-****-4e93-a533-fd8f9defc768', type: 'mailmodoUserId' },
                    ],
                    traits: { email: 'gou****@mailmodo.com' },
                    integration: { name: 'Mailmodo', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                  },
                  event: 'form submission',
                  integrations: { Mailmodo: false },
                  originalTimestamp: '2022-07-06T08:56:26.000Z',
                  properties: {
                    'triggerData.triggerSource': 'form submission',
                    'triggerData.formSubmissionData.element6ehxt3': 'Te**',
                    'triggerData.formSubmissionData.element6jkcy4': 'Bang****',
                    'triggerData.formSubmissionData.formId': 'formmqxnu2',
                    'triggerData.formSubmissionData.fuuid': '47949',
                    'triggerData.formSubmissionData.next-step-id': 'step7tr7n2',
                    'triggerData.formSubmissionData.responseId':
                      '4a8bfda7-****-4a8c-9cd1-a30d30a6dab9',
                    'triggerData.formSubmissionData.submissionSource': 'amp',
                    'triggerData.formSubmissionData.total-steps': '3',
                    'triggerData.journeyId': '03664747-****-412e-8790-de9e9abe96a5',
                  },
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
    name: 'mailmodo',
    description: 'test-5',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            triggerData: {
              data: {},
              eventProperty: {
                Name: 'APPLE iPhone 13 (Blue, 128 GB)',
                Category: 'Mobiles',
                'Is Purchased': 'false',
                Price: '829',
                Currency: 'USD',
              },
              triggerSource: 'New Custom Event Trigger - Product Viewed',
              email: 'gou****@mailmodo.com',
              userId: 'd3775892-****-4f2f-b9d5-e49810eb2cae',
              journeyId: '3f135bf7-****-4e31-b265-f61cfe1bd423',
            },
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
                  anonymousId: '26c9ad4b531287858155ffa834be13dddc2c45df6e29af7230408953d732dd92',
                  context: {
                    externalId: [
                      { id: 'd3775892-****-4f2f-b9d5-e49810eb2cae', type: 'mailmodoUserId' },
                    ],
                    traits: { email: 'gou****@mailmodo.com' },
                    integration: { name: 'Mailmodo', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                  },
                  event: 'New Custom Event Trigger - Product Viewed',
                  integrations: { Mailmodo: false },
                  properties: {
                    'triggerData.eventProperty.Category': 'Mobiles',
                    'triggerData.eventProperty.Currency': 'USD',
                    'triggerData.eventProperty.Is Purchased': 'false',
                    'triggerData.eventProperty.Name': 'APPLE iPhone 13 (Blue, 128 GB)',
                    'triggerData.eventProperty.Price': '829',
                    'triggerData.journeyId': '3f135bf7-****-4e31-b265-f61cfe1bd423',
                    'triggerData.triggerSource': 'New Custom Event Trigger - Product Viewed',
                  },
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
    name: 'mailmodo',
    description: 'test-6',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            triggerData: {
              email: 'gou****@mailmodo.com',
              data: {},
              userId: 'd3775892-****-4f2f-b9d5-e49810eb2cae',
              journeyId: 'b1ee6bf6-****-4b5a-b7b5-0637853cd8c3',
              triggerSource: 'Api',
              eventProperty: {},
            },
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
                  anonymousId: '26c9ad4b531287858155ffa834be13dddc2c45df6e29af7230408953d732dd92',
                  context: {
                    externalId: [
                      { id: 'd3775892-****-4f2f-b9d5-e49810eb2cae', type: 'mailmodoUserId' },
                    ],
                    traits: { email: 'gou****@mailmodo.com' },
                    integration: { name: 'Mailmodo', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                  },
                  event: 'Api',
                  integrations: { Mailmodo: false },
                  properties: {
                    'triggerData.triggerSource': 'Api',
                    'triggerData.journeyId': 'b1ee6bf6-****-4b5a-b7b5-0637853cd8c3',
                  },
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
    name: 'mailmodo',
    description: 'test-7',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            eventData: { type: 'html' },
            triggerData: {
              data: {},
              triggerSource: 'CsvList',
              email: 'gou****@mailmodo.com',
              triggerDetails:
                'file:5d31c2b4-****-4a84-acd3-834cae80231b/5a61e0b8-b6f6-4d7d-abf2-90357d6638af',
              userId: 'cc56708d-****-4fea-8c07-a4bfa5a7b79b',
              journeyId: '5d31c2b4-****-4a84-acd3-834cae80231b',
              eventProperty: {},
            },
            lastCampaignEmailRef: '064c76e7-****-4780-a001-226c066aaa12',
            lastCampaignId: '31422f76-****-4a72-a630-dd6f9f615bc3',
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
                  anonymousId: '26c9ad4b531287858155ffa834be13dddc2c45df6e29af7230408953d732dd92',
                  context: {
                    externalId: [
                      { id: 'cc56708d-****-4fea-8c07-a4bfa5a7b79b', type: 'mailmodoUserId' },
                    ],
                    traits: { email: 'gou****@mailmodo.com' },
                    integration: { name: 'Mailmodo', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                  },
                  event: 'CsvList',
                  integrations: { Mailmodo: false },
                  properties: {
                    'eventData.type': 'html',
                    lastCampaignEmailRef: '064c76e7-****-4780-a001-226c066aaa12',
                    lastCampaignId: '31422f76-****-4a72-a630-dd6f9f615bc3',
                    'triggerData.journeyId': '5d31c2b4-****-4a84-acd3-834cae80231b',
                    'triggerData.triggerDetails':
                      'file:5d31c2b4-****-4a84-acd3-834cae80231b/5a61e0b8-b6f6-4d7d-abf2-90357d6638af',
                    'triggerData.triggerSource': 'CsvList',
                  },
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
    name: 'mailmodo',
    description: 'test-8',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            fuuid: '98255',
            'next-step-id': 'success',
            'total-steps': '3',
            responseId: 'ad20a980-4fce-44b6-887d-2236df514a76',
            recipientEmail: 'test@rudderstack.com',
            formId: 'formosztd5',
            recordedAt: { ts: 1662695887, date: '2022-09-09', hour: 9, minute: 28 },
            submissionSource: 'amp',
            elementjbtz42: 'peace',
            element8jzo13: ['Useful'],
            recipientData: { email: 'test@rudderstack.com', first_name: 'abcda' },
            recommend: '1',
            liking: 'downvote',
            satisfaction: '1',
            campaignId: '0b53e1bf-84ae-4198-9184-8a4d6e1fa3dd',
            campaignName: 'Campaign-testing',
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
                  anonymousId: '1c5e54849f5c711ce38fa60716fbbe44bff478f9ca250897b39cdfc2438cd1bd',
                  context: {
                    integration: { name: 'Mailmodo', version: '1.0.0' },
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { email: 'test@rudderstack.com', first_name: 'abcda' },
                  },
                  event: 'Form Submitted',
                  integrations: { Mailmodo: false },
                  originalTimestamp: '2022-09-09T03:58:07.000Z',
                  properties: {
                    fuuid: '98255',
                    'next-step-id': 'success',
                    'total-steps': '3',
                    responseId: 'ad20a980-4fce-44b6-887d-2236df514a76',
                    formId: 'formosztd5',
                    submissionSource: 'amp',
                    elementjbtz42: 'peace',
                    'element8jzo13[0]': 'Useful',
                    recommend: '1',
                    liking: 'downvote',
                    satisfaction: '1',
                    campaignId: '0b53e1bf-84ae-4198-9184-8a4d6e1fa3dd',
                    campaignName: 'Campaign-testing',
                  },
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
];
