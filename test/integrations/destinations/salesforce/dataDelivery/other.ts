import { generateProxyV1Payload } from '../../../testUtils';
import { externalIDSearchedData, reqMetadataArray, proxyMetdata } from './business';

export const otherSalesforceScenariosV1 = [
    {
        id: 'salesforce_v1_scenario_7',
        name: 'salesforce',
        description: '[Proxy v1 API] :: Test for a valid request - External ID search',
        successCriteria: 'Should return 200 with list of matching records with External ID',
        scenario: 'Business',
        feature: 'dataDelivery',
        module: 'destination',
        version: 'v1',
        input: {
          request: {
            body: generateProxyV1Payload(
              {
                ...externalIDSearchedData,
                endpoint:
                  'https://rudderstack.my.salesforce.com/services/data/v50.0/parameterizedSearch/?q=123&sobject=object_name&in=External_ID__c&object_name.fields=id,External_ID__c',
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
                message: 'Request for destination: salesforce Processed Successfully',
                response: [
                  {
                    error:
                      '{"searchRecords":[{"attributes":{"type":"object_name","url":"/services/data/v50.0/sobjects/object_name/a0J75100002w97gEAA"},"Id":"a0J75100002w97gEAA","External_ID__c":"external_id"},{"attributes":{"type":"object_name","url":"/services/data/v50.0/sobjects/object_name/a0J75200002w9ZsEAI"},"Id":"a0J75200002w9ZsEAI","External_ID__c":"external_id TEST"}]}',
                    metadata: proxyMetdata,
                    statusCode: 200,
                  },
                ],
                status: 200,
              },
            },
          },
        },
      },
]