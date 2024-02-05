import { endpoint, commonOutputHeaders } from '../processor/commonConfig';
const commonParams = {
  xml: 1,
  amtlist: '12500|12500',
  qlist: '|5',
  ord: 'SampleOrderId',
  tr: 'SampleRanSiteID',
  land: '20240129_1200',
};
export const data = [
  {
    name: 'rakuten',
    description: 'Test 0: Failure response from rakuten for invalid mid',
    feature: 'dataDelivery',
    module: 'destination',
    scenario: 'Framework',
    version: 'v0',
    input: {
      request: {
        body: {
          method: 'GET',
          endpoint,
          headers: commonOutputHeaders,
          params: {
            mid: 'invalid_mid',
            ...commonParams,
          },
          userId: '',
        },
      },
    },
    output: {
      response: {
        status: 400,
        statTags: {
          errorCategory: 'network',
          errorType: 'configuration',
          destType: 'RAKUTEN',
          module: 'destination',
          implementation: 'native',
          feature: 'dataDelivery',
          destinationId: 'dummyDestId',
          workspaceId: 'dummyWorkspaceId',
        },
        destinationResponse: {
          response:
            '<!doctype html><html lang="en"><head><title>HTTP Status 400 – Bad Request</title></head><body><h1>HTTP Status 400 – Bad Request</h1></body></html>',
          status: 400,
          rudderJobMetadata: [
            {
              jobId: 2,
              attemptNum: 0,
              userId: '',
              sourceId: 'dummySourceId',
              destinationId: 'dummyDestId',
              workspaceId: 'dummyWorkspaceId',
            },
          ],
        },
        authErrorCategory: '',
        message: 'Request failed with status: 400 due to invalid Marketing Id',
      },
    },
  },
  {
    name: 'rakuten',
    description: 'Test 1: Failure response from rakuten for access denied for rakuten mid',
    feature: 'dataDelivery',
    scenario: 'Framework',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          method: 'GET',
          endpoint,
          headers: commonOutputHeaders,
          params: {
            mid: 'access_denied_for_mid',
            ...commonParams,
          },
          userId: '',
        },
      },
    },
    output: {
      response: {
        status: 400,
        statTags: {
          errorCategory: 'network',
          errorType: 'configuration',
          destType: 'RAKUTEN',
          module: 'destination',
          implementation: 'native',
          feature: 'dataDelivery',
          destinationId: 'dummyDestId',
          workspaceId: 'dummyWorkspaceId',
        },
        destinationResponse: {
          response: '<response><error>Access denied</error></response>',
          status: 200,
          rudderJobMetadata: [
            {
              jobId: 2,
              attemptNum: 0,
              userId: '',
              sourceId: 'dummySourceId',
              destinationId: 'dummyDestId',
              workspaceId: 'dummyWorkspaceId',
            },
          ],
        },
        authErrorCategory: '',
        message:
          'Request failed with status: 200 due to Access denied. Can you try to enable pixel tracking for this mid.',
      },
    },
  },
  {
    name: 'rakuten',
    description: 'Test 2: Failure response from rakuten for bad records>0',
    feature: 'dataDelivery',
    scenario: 'Framework',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          method: 'GET',
          endpoint,
          headers: commonOutputHeaders,
          params: {
            mid: 'valid_mid_with_bad_records',
            ...commonParams,
          },
          userId: '',
        },
      },
    },
    output: {
      response: {
        status: 400,
        statTags: {
          errorCategory: 'network',
          errorType: 'aborted',
          destType: 'RAKUTEN',
          module: 'destination',
          implementation: 'native',
          feature: 'dataDelivery',
          destinationId: 'dummyDestId',
          workspaceId: 'dummyWorkspaceId',
        },
        destinationResponse: {
          response:
            '<response><unique_id>143407391431</unique_id><summary><transactions><good>0</good><bad>3</bad></transactions></summary></response>',
          status: 200,
          rudderJobMetadata: [
            {
              jobId: 2,
              attemptNum: 0,
              userId: '',
              sourceId: 'dummySourceId',
              destinationId: 'dummyDestId',
              workspaceId: 'dummyWorkspaceId',
            },
          ],
        },
        authErrorCategory: '',
        message: 'Request failed with status: 200 with number of bad records 3',
      },
    },
  },
  {
    name: 'rakuten',
    description: 'Test 3: Success response from rakuten with good records > 0',
    feature: 'dataDelivery',
    scenario: 'Framework',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          method: 'GET',
          endpoint,
          headers: commonOutputHeaders,
          params: {
            mid: 'valid_mid_with_good_records',
            ...commonParams,
          },
          userId: '',
        },
      },
    },
    output: {
      response: {
        status: 200,
        destinationResponse:
          '<response><unique_id>uniqueId</unique_id><summary><transactions><good>3</good><bad>0</bad></transactions></summary></response>',
        message: '[RAKUTEN Response Handler] - Request Processed Successfully',
      },
    },
  },
];
