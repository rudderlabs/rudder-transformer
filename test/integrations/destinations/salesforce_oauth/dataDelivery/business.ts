import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload } from '../../../testUtils';
import {
  commonRequestParameters,
  proxyMetdata,
  reqMetadataArray,
} from '../../salesforce/dataDelivery/business';

const statTags = {
  aborted: {
    destType: 'SALESFORCE_OAUTH',
    destinationId: 'dummyDestinationId',
    errorCategory: 'network',
    errorType: 'aborted',
    feature: 'dataDelivery',
    implementation: 'native',
    module: 'destination',
    workspaceId: 'dummyWorkspaceId',
  },
  retryable: {
    destType: 'SALESFORCE_OAUTH',
    destinationId: 'dummyDestinationId',
    errorCategory: 'network',
    errorType: 'retryable',
    feature: 'dataDelivery',
    implementation: 'native',
    module: 'destination',
    workspaceId: 'dummyWorkspaceId',
  },
  throttled: {
    destType: 'SALESFORCE_OAUTH',
    destinationId: 'dummyDestinationId',
    errorCategory: 'network',
    errorType: 'throttled',
    feature: 'dataDelivery',
    implementation: 'native',
    module: 'destination',
    workspaceId: 'dummyWorkspaceId',
  },
};

export const testScenarios: ProxyV1TestData[] = [
  {
    id: 'salesforce_v1_scenario_6',
    name: 'salesforce_oauth',
    description: '[Proxy v1 API] :: Test for invalid grant scenario due to authentication failure',
    successCriteria:
      'Should return 400 with error message "invalid_grant" due to "authentication failure"',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            endpoint: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/6',
          },
          reqMetadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              'Salesforce Request Failed: "400" due to "{"error":"invalid_grant","error_description":"authentication failure"}", (Aborted) during salesforce_oauth Response Handling',
            response: [
              {
                error: '{"error":"invalid_grant","error_description":"authentication failure"}',
                metadata: proxyMetdata,
                statusCode: 400,
              },
            ],
            statTags: statTags.aborted,
            status: 400,
          },
        },
      },
    },
  },
];
