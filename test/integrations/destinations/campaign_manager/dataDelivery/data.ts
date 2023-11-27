export const data = [
  {
    name: 'campaign_manager',
    description: 'Sucess insert request',
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
        status: 500,
        body: {
          output: {
            status: 500,
            message: 'Campaign Manager: Retrying during CAMPAIGN_MANAGER response transformation',
            statTags: {
              errorCategory: 'network',
              errorType: 'retryable',
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
];
