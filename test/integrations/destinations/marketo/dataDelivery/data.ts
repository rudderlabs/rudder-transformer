export const data = [
  {
    name: 'marketo',
    description: 'Test 0',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://mktId.mktorest.com/rest/v1/leads.json/test1',
          method: 'POST',
          userId: '',
          headers: {
            Authorization: 'Bearer test_token_1',
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              action: 'createOrUpdate',
              input: [
                {
                  City: 'Tokyo',
                  Country: 'JP',
                  Email: 'gabi29@gmail.com',
                  PostalCode: '100-0001',
                  Title: 'Owner',
                  id: 1328328,
                  userId: 'gabi_userId_45',
                },
              ],
              lookupField: 'id',
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'marketo',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        message: 'Request Processed Successfully',
        destinationResponse: {
          response: {
            requestId: '664#17dae8c3d48',
            result: [
              {
                id: 1328328,
                status: 'updated',
              },
            ],
            success: true,
          },
          status: 200,
        },
      },
    },
  },
  {
    name: 'marketo',
    description: 'Test 1',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://mktId.mktorest.com/rest/v1/leads.json/test2',
          method: 'POST',
          userId: '',
          headers: {
            Authorization: 'Bearer test_token_2',
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              action: 'createOrUpdate',
              input: [
                {
                  City: 'Tokyo',
                  Country: 'JP',
                  Email: 'gabi29@gmail.com',
                  PostalCode: '100-0001',
                  Title: 'Owner',
                  id: 1328328,
                  userId: 'gabi_userId_45',
                },
              ],
              lookupField: 'id',
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'marketo',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        message:
          'Request Failed for marketo, Access token invalid (Retryable).during Marketo Response Handling',
        destinationResponse: {
          response: {
            requestId: 'a61c#17daea5968a',
            success: false,
            errors: [
              {
                code: '601',
                message: 'Access token invalid',
              },
            ],
          },
          status: 200,
        },
        statTags: {
          destType: 'MARKETO',
          errorCategory: 'network',
          destinationId: 'Non-determininable',
          workspaceId: 'Non-determininable',
          errorType: 'retryable',
          feature: 'dataDelivery',
          implementation: 'native',
          module: 'destination',
        },
      },
    },
  },
  {
    name: 'marketo',
    description: 'Test 2',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://mktId.mktorest.com/rest/v1/leads.json/test3',
          method: 'POST',
          userId: '',
          headers: {
            Authorization: 'Bearer test_token_3',
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              action: 'createOrUpdate',
              input: [
                {
                  City: 'Tokyo',
                  Country: 'JP',
                  Email: 'gabi29@gmail.com',
                  PostalCode: '100-0001',
                  Title: 'Owner',
                  id: 1328328,
                  userId: 'gabi_userId_45',
                },
              ],
              lookupField: 'id',
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'marketo',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        message:
          'Request Failed for marketo, Requested resource not found (Aborted).during Marketo Response Handling',
        destinationResponse: {
          response: {
            requestId: 'a61c#17daea5968a',
            success: false,
            errors: [
              {
                code: '610',
                message: 'Requested resource not found',
              },
            ],
          },
          status: 200,
        },
        statTags: {
          destType: 'MARKETO',
          errorCategory: 'network',
          destinationId: 'Non-determininable',
          workspaceId: 'Non-determininable',
          errorType: 'aborted',
          feature: 'dataDelivery',
          implementation: 'native',
          module: 'destination',
        },
      },
    },
  },
  {
    name: 'marketo',
    description: 'Test 3',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://mktId.mktorest.com/rest/v1/leads.json/test4',
          method: 'POST',
          userId: '',
          headers: {
            Authorization: 'Bearer test_token_4',
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              action: 'createOrUpdate',
              input: [
                {
                  City: 'Tokyo',
                  Country: 'JP',
                  Email: 'gabi29@gmail.com',
                  PostalCode: '100-0001',
                  Title: 'Owner',
                  id: 1328328,
                  userId: 'gabi_userId_45',
                },
              ],
              lookupField: 'id',
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'marketo',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        message: 'Request failed  with status: 500',
        destinationResponse: {
          response: '',
          status: 500,
        },
        statTags: {
          destType: 'MARKETO',
          errorCategory: 'network',
          destinationId: 'Non-determininable',
          workspaceId: 'Non-determininable',
          errorType: 'retryable',
          feature: 'dataDelivery',
          implementation: 'native',
          module: 'destination',
        },
      },
    },
  },
  {
    name: 'marketo',
    description: 'Test 4',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://mktId.mktorest.com/rest/v1/leads.json/test5',
          method: 'POST',
          userId: '',
          headers: {
            Authorization: 'Bearer test_token_5',
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              action: 'createOrUpdate',
              input: [
                {
                  City: 'Tokyo',
                  Country: 'JP',
                  Email: 'gabi29@gmail.com',
                  PostalCode: '100-0001',
                  Title: 'Owner',
                  id: 1328328,
                  userId: 'gabi_userId_45',
                },
              ],
              lookupField: 'id',
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'marketo',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        message: 'Request failed  with status: 500',
        destinationResponse: {
          response: '',
          status: 500,
        },
        statTags: {
          destType: 'MARKETO',
          errorCategory: 'network',
          destinationId: 'Non-determininable',
          workspaceId: 'Non-determininable',
          errorType: 'retryable',
          feature: 'dataDelivery',
          implementation: 'native',
          module: 'destination',
        },
      },
    },
  },
  {
    name: 'marketo',
    description: 'Test 5',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://mktId.mktorest.com/rest/v1/leads.json/test6',
          method: 'POST',
          userId: '',
          headers: {
            Authorization: 'Bearer test_token_6',
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              action: 'createOrUpdate',
              input: [
                {
                  City: 'Tokyo',
                  Country: 'JP',
                  Email: 'gabi29@gmail.com',
                  PostalCode: '100-0001',
                  Title: 'Owner',
                  id: 1328328,
                  userId: 'gabi_userId_45',
                },
              ],
              lookupField: 'id',
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'marketo',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        message: 'Request failed  with status: 400',
        destinationResponse: {
          response: '[[ENOTFOUND] :: DNS lookup failed]',
          status: 400,
        },
        statTags: {
          destType: 'MARKETO',
          errorCategory: 'network',
          destinationId: 'Non-determininable',
          workspaceId: 'Non-determininable',
          errorType: 'aborted',
          feature: 'dataDelivery',
          implementation: 'native',
          module: 'destination',
        },
      },
    },
  },
  {
    name: 'marketo',
    description: 'Test 6',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://unhandled_exception_in_proxy_req.mktorest.com/rest/v1/leads.json',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer access_token_success',
          },
          body: {
            JSON: {
              action: 'createOrUpdate',
              input: [
                {
                  Email: '0c7b8b80-9c43-4f8e-b2d2-5e2448a25040@j.mail',
                  FirstName: 'A',
                  LastName: 'M',
                  id: 4,
                  userId: 'e17c5a5e-5e2f-430b-b497-fe3f1ea3a704',
                },
              ],
              lookupField: 'id',
            },
            XML: {},
            JSON_ARRAY: {},
            FORM: {},
          },
          files: {},
          params: {
            destination: 'marketo',
          },
        },
      },
    },
    output: {
      response: {
        status: 400,
        message: 'Error occurred during Marketo Response Handling -> problem',
        destinationResponse: {
          response: {
            requestId: '142e4#1835b117b76',
            success: false,
            errors: [
              {
                code: 'random_marketo_code',
                message: 'problem',
              },
            ],
          },
          status: 200,
        },
        statTags: {
          destType: 'MARKETO',
          errorCategory: 'network',
          destinationId: 'Non-determininable',
          workspaceId: 'Non-determininable',
          errorType: 'aborted',
          feature: 'dataDelivery',
          implementation: 'native',
          meta: 'unhandledStatusCode',
          module: 'destination',
        },
      },
    },
  },
];
