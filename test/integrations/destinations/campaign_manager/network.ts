const Data = [
  {
    httpReq: {
      method: 'post',
      url: 'https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/437689/conversions/batchinsert',
      data: {
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
      headers: {
        Authorization: 'Bearer dummyApiKey',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      data: {
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
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/437690/conversions/batchinsert',
      data: {
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
      headers: {
        Authorization: 'Bearer dummyApiKey',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      data: {
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
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/43770/conversions/batchinsert',
      data: {
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
      headers: {
        Authorization: 'Bearer dummyApiKey',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      data: {
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
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/437692/conversions/batchinsert',
      data: {
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
      headers: {
        Authorization: 'Bearer dummyApiKey',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      data: {
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
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/437691/conversions/batchinsert',
      data: {
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
      headers: {
        Authorization: 'Bearer dummyApiKey',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      data: {
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
      statusText: 'OK',
    },
  },
];
export const networkCallsData = [...Data];
