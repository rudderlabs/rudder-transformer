import {
  generateMetadata,
  generatePayloadForDelivery,
  generateV1PayloadForDelivery,
} from '../../../testUtils';
import { conversion1, headers, encryptionInfo, getEndpointBatchInsert, secret } from './data';

export const successScenarioV0 = [{
  id: 'campaign_manager_success_scenario_v0',
  name: 'campaign_manager',
  description: 'Successfull delivery request to deliver to the destination',
  scenario: 'Business',
  successCriteria:
    'Response from destination should not contain any failures for the sent conversion, and the status code should be 200',
  feature: 'dataDelivery',
  module: 'destination',
  version: 'v0',
  input: {
    request: {
      body: generatePayloadForDelivery(
        {
          endpoint: getEndpointBatchInsert('437689'),
          headers,
          JSON: {
            kind: 'dfareporting#conversionsBatchInsertRequest',
            encryptionInfo,
            conversions: [conversion1],
          },
        },
        null as any,
      ),
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
                  conversion: conversion1,
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
}];

export const successScenarioV1 = [
  {
    name: 'campaign_manager',
    description: 'Successfull delivery request to deliver to the destination',
    scenario: 'Business',
    successCriteria:
      'Response from destination should not contain any failures for the sent conversion, and the status code should be 200, one job is sent and it should be successfull',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateV1PayloadForDelivery(
          {
            endpoint: getEndpointBatchInsert('43770'),
            headers,
            JSON: {
              kind: 'dfareporting#conversionsBatchInsertRequest',
              encryptionInfo,
              conversions: [conversion1],
            },
          },
          [generateMetadata(2)],
          null as any,
        ),
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
                    conversion: conversion1,
                    kind: 'dfareporting#conversionStatus',
                  },
                ],
                kind: 'dfareporting#conversionsBatchInsertResponse',
              },
              status: 200,
              rudderJobMetadata: [generateMetadata(2, secret)],
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
