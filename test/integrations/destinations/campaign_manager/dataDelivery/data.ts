export const data = [
  {
    name: 'campaign_manager',
    description: 'Sucess insert request V0',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint:
            'https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/437689/conversions/batchinsert',
          headers: {
            Authorization: 'Bearer dummyApiKey',
            'Content-Type': 'application/json',
          },
          params: {},
          body: {
            JSON: {
              kind: 'dfareporting#conversionsBatchInsertRequest',
              encryptionInfo: {
                kind: 'dfareporting#encryptionInfo',
                encryptionSource: 'AD_SERVING',
                encryptionEntityId: '3564523',
                encryptionEntityType: 'DCM_ACCOUNT',
              },
              conversions: [
                {
                  timestampMicros: '1668624722000000',
                  floodlightConfigurationId: '213123123',
                  ordinal: '1',
                  floodlightActivityId: '456543345245',
                  value: 7,
                  gclid: '123',
                  limitAdTracking: true,
                  childDirectedTreatment: true,
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[CAMPAIGN_MANAGER Response Handler] - Request Processed Successfully',
            destinationResponse: {
              response: {
                hasFailures: false,
                status: [
                  {
                    conversion: {
                      timestampMicros: '1668624722000000',
                      floodlightConfigurationId: '213123123',
                      ordinal: '1',
                      floodlightActivityId: '456543345245',
                      value: 7,
                      gclid: '123',
                      limitAdTracking: true,
                      childDirectedTreatment: true,
                    },
                    kind: 'dfareporting#conversionStatus',
                  },
                ],
                kind: 'dfareporting#conversionsBatchInsertResponse',
              },
              status: 200,
            },
          },
        },
      },
    },
  },
  {
    name: 'campaign_manager',
    description: 'Failure insert request',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint:
            'https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/437690/conversions/batchinsert',
          headers: {
            Authorization: 'Bearer dummyApiKey',
            'Content-Type': 'application/json',
          },
          params: {},
          body: {
            JSON: {
              kind: 'dfareporting#conversionsBatchInsertRequest',
              encryptionInfo: {
                kind: 'dfareporting#encryptionInfo',
                encryptionSource: 'AD_SERVING',
                encryptionEntityId: '3564523',
                encryptionEntityType: 'DCM_ACCOUNT',
              },
              conversions: [
                {
                  timestampMicros: '1668624722000000',
                  floodlightConfigurationId: '213123123',
                  ordinal: '1',
                  floodlightActivityId: '456543345245',
                  value: 7,
                  gclid: '123',
                  limitAdTracking: true,
                  childDirectedTreatment: true,
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            status: 400,
            message: 'Campaign Manager: Aborting during CAMPAIGN_MANAGER response transformation',
            statTags: {
              errorCategory: 'network',
              errorType: 'aborted',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
            },
            destinationResponse: {
              response: {
                hasFailures: true,
                status: [
                  {
                    conversion: {
                      timestampMicros: '1668624722000000',
                      floodlightConfigurationId: '213123123',
                      ordinal: '1',
                      floodlightActivityId: '456543345245',
                      value: 7,
                      gclid: '123',
                      limitAdTracking: true,
                      childDirectedTreatment: true,
                    },
                    errors: [
                      {
                        code: 'NOT_FOUND',
                        message: 'Floodlight config id: 213123123 was not found.',
                        kind: 'dfareporting#conversionError',
                      },
                    ],
                    kind: 'dfareporting#conversionStatus',
                  },
                ],
                kind: 'dfareporting#conversionsBatchInsertResponse',
              },
              status: 200,
            },
          },
        },
      },
    },
  },
  {
    name: 'campaign_manager',
    description: 'Failure insert request Aborted',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint:
            'https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/437691/conversions/batchinsert',
          headers: {
            Authorization: 'Bearer dummyApiKey',
            'Content-Type': 'application/json',
          },
          params: {},
          body: {
            JSON: {
              kind: 'dfareporting#conversionsBatchInsertRequest',
              encryptionInfo: {
                kind: 'dfareporting#encryptionInfo',
                encryptionSource: 'AD_SERVING',
                encryptionEntityId: '3564523',
                encryptionEntityType: 'DCM_ACCOUNT',
              },
              conversions: [
                {
                  timestampMicros: '1668624722000000',
                  floodlightConfigurationId: '213123123',
                  ordinal: '1',
                  floodlightActivityId: '456543345245',
                  value: 7,
                  gclid: '123',
                  limitAdTracking: true,
                  childDirectedTreatment: true,
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            status: 400,
            message: 'Campaign Manager: Aborting during CAMPAIGN_MANAGER response transformation',
            statTags: {
              errorCategory: 'network',
              errorType: 'aborted',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
            },
            destinationResponse: {
              response: {
                hasFailures: true,
                status: [
                  {
                    conversion: {
                      timestampMicros: '1668624722000000',
                      floodlightConfigurationId: '213123123',
                      ordinal: '1',
                      floodlightActivityId: '456543345245',
                      value: 7,
                      gclid: '123',
                      limitAdTracking: true,
                      childDirectedTreatment: true,
                    },
                    errors: [
                      {
                        code: 'INVALID_ARGUMENT',
                        message: 'Floodlight config id: 213123123 was not found.',
                        kind: 'dfareporting#conversionError',
                      },
                    ],
                    kind: 'dfareporting#conversionStatus',
                  },
                ],
                kind: 'dfareporting#conversionsBatchInsertResponse',
              },
              status: 200,
            },
          },
        },
      },
    },
  },
  {
    name: 'campaign_manager',
    description: 'Sucess and fail insert request v1',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint:
            'https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/437692/conversions/batchinsert',
          headers: {
            Authorization: 'Bearer dummyApiKey',
            'Content-Type': 'application/json',
          },
          params: {},
          body: {
            JSON: {
              kind: 'dfareporting#conversionsBatchInsertRequest',
              conversions: [
                {
                  timestampMicros: '1668624722000000',
                  floodlightConfigurationId: '213123123',
                  ordinal: '1',
                  floodlightActivityId: '456543345245',
                  value: 7,
                  gclid: '123',
                  limitAdTracking: true,
                  childDirectedTreatment: true,
                },
                {
                  timestampMicros: '1668624722000000',
                  floodlightConfigurationId: '213123123',
                  ordinal: '1',
                  floodlightActivityId: '456543345245',
                  value: 8,
                  gclid: '123',
                  limitAdTracking: true,
                  childDirectedTreatment: true,
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          metadata: [
            {
              jobId: 2,
              attemptNum: 0,
              userId: '',
              sourceId: '2Vsge2uWYdrLfG7pZb5Y82eo4lr',
              destinationId: '2RHh08uOsXqE9KvCDg3hoaeuK2L',
              workspaceId: '2Csl0lSTbuM3qyHdaOQB2GcDH8o',
              secret: {
                access_token: 'secret',
                refresh_token: 'refresh',
                developer_token: 'developer_Token',
              },
            },
            {
              jobId: 3,
              attemptNum: 1,
              userId: '',
              sourceId: '2Vsge2uWYdrLfG7pZb5Y82eo4lr',
              destinationId: '2RHh08uOsXqE9KvCDg3hoaeuK2L',
              workspaceId: '2Csl0lSTbuM3qyHdaOQB2GcDH8o',
              secret: {
                access_token: 'secret',
                refresh_token: 'refresh',
                developer_token: 'developer_Token',
              },
            },
          ],
          files: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[CAMPAIGN_MANAGER Response V1 Handler] - Request Processed Successfully',
            destinationResponse: {
              response: {
                hasFailures: true,
                status: [
                  {
                    conversion: {
                      timestampMicros: '1668624722000000',
                      floodlightConfigurationId: '213123123',
                      ordinal: '1',
                      floodlightActivityId: '456543345245',
                      value: 7,
                      gclid: '123',
                      limitAdTracking: true,
                      childDirectedTreatment: true,
                    },
                    kind: 'dfareporting#conversionStatus',
                    errors: [
                      {
                        code: 'INVALID_ARGUMENT',
                        kind: 'dfareporting#conversionError',
                        message: 'Floodlight config id: 213123123 was not found.',
                      },
                    ],
                  },
                  {
                    conversion: {
                      timestampMicros: '1668624722000000',
                      floodlightConfigurationId: '213123123',
                      ordinal: '1',
                      floodlightActivityId: '456543345245',
                      value: 8,
                      gclid: '123',
                      limitAdTracking: true,
                      childDirectedTreatment: true,
                    },
                    kind: 'dfareporting#conversionStatus',
                  },
                ],
                kind: 'dfareporting#conversionsBatchInsertResponse',
              },
              status: 200,
              rudderJobMetadata: [
                {
                  jobId: 2,
                  attemptNum: 0,
                  userId: '',
                  sourceId: '2Vsge2uWYdrLfG7pZb5Y82eo4lr',
                  destinationId: '2RHh08uOsXqE9KvCDg3hoaeuK2L',
                  workspaceId: '2Csl0lSTbuM3qyHdaOQB2GcDH8o',
                  secret: {
                    access_token: 'secret',
                    refresh_token: 'refresh',
                    developer_token: 'developer_Token',
                  },
                },
                {
                  jobId: 3,
                  attemptNum: 1,
                  userId: '',
                  sourceId: '2Vsge2uWYdrLfG7pZb5Y82eo4lr',
                  destinationId: '2RHh08uOsXqE9KvCDg3hoaeuK2L',
                  workspaceId: '2Csl0lSTbuM3qyHdaOQB2GcDH8o',
                  secret: {
                    access_token: 'secret',
                    refresh_token: 'refresh',
                    developer_token: 'developer_Token',
                  },
                },
              ],
            },
            response: [
              {
                error: 'Floodlight config id: 213123123 was not found., ',
                statusCode: 400,
                metadata: {
                  attemptNum: 0,
                  destinationId: '2RHh08uOsXqE9KvCDg3hoaeuK2L',
                  jobId: 2,
                  secret: {
                    access_token: 'secret',
                    developer_token: 'developer_Token',
                    refresh_token: 'refresh',
                  },
                  sourceId: '2Vsge2uWYdrLfG7pZb5Y82eo4lr',
                  userId: '',
                  workspaceId: '2Csl0lSTbuM3qyHdaOQB2GcDH8o',
                },
              },
              {
                error: 'success',
                metadata: {
                  attemptNum: 1,
                  destinationId: '2RHh08uOsXqE9KvCDg3hoaeuK2L',
                  jobId: 3,
                  secret: {
                    access_token: 'secret',
                    developer_token: 'developer_Token',
                    refresh_token: 'refresh',
                  },
                  sourceId: '2Vsge2uWYdrLfG7pZb5Y82eo4lr',
                  userId: '',
                  workspaceId: '2Csl0lSTbuM3qyHdaOQB2GcDH8o',
                },
                statusCode: 200,
              },
            ],
          },
        },
      },
    },
  },
  {
    name: 'campaign_manager',
    description: 'Sucess insert request v1',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint:
            'https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/43770/conversions/batchinsert',
          headers: {
            Authorization: 'Bearer dummyApiKey',
            'Content-Type': 'application/json',
          },
          params: {},
          body: {
            JSON: {
              kind: 'dfareporting#conversionsBatchInsertRequest',
              encryptionInfo: {
                kind: 'dfareporting#encryptionInfo',
                encryptionSource: 'AD_SERVING',
                encryptionEntityId: '3564523',
                encryptionEntityType: 'DCM_ACCOUNT',
              },
              conversions: [
                {
                  timestampMicros: '1668624722000000',
                  floodlightConfigurationId: '213123123',
                  ordinal: '1',
                  floodlightActivityId: '456543345245',
                  value: 7,
                  gclid: '123',
                  limitAdTracking: true,
                  childDirectedTreatment: true,
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          metadata: {
            jobId: 2,
            attemptNum: 0,
            userId: '',
            sourceId: '2Vsge2uWYdrLfG7pZb5Y82eo4lr',
            destinationId: '2RHh08uOsXqE9KvCDg3hoaeuK2L',
            workspaceId: '2Csl0lSTbuM3qyHdaOQB2GcDH8o',
            secret: {
              access_token: 'secret',
              refresh_token: 'refresh',
              developer_token: 'developer_Token',
            },
          },
          files: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[CAMPAIGN_MANAGER Response V1 Handler] - Request Processed Successfully',
            destinationResponse: {
              response: {
                hasFailures: false,
                status: [
                  {
                    conversion: {
                      timestampMicros: '1668624722000000',
                      floodlightConfigurationId: '213123123',
                      ordinal: '1',
                      floodlightActivityId: '456543345245',
                      value: 7,
                      gclid: '123',
                      limitAdTracking: true,
                      childDirectedTreatment: true,
                    },
                    kind: 'dfareporting#conversionStatus',
                  },
                ],
                kind: 'dfareporting#conversionsBatchInsertResponse',
              },
              status: 200,
              rudderJobMetadata: {
                jobId: 2,
                attemptNum: 0,
                userId: '',
                sourceId: '2Vsge2uWYdrLfG7pZb5Y82eo4lr',
                destinationId: '2RHh08uOsXqE9KvCDg3hoaeuK2L',
                workspaceId: '2Csl0lSTbuM3qyHdaOQB2GcDH8o',
                secret: {
                  access_token: 'secret',
                  refresh_token: 'refresh',
                  developer_token: 'developer_Token',
                },
              },
            },
            response: [
              {
                error: 'success',
                statusCode: 200,
              },
            ],
          },
        },
      },
    },
  },
];
