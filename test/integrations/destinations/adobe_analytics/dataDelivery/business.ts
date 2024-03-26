import { ProxyMetdata } from '../../../../../src/types';
import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload } from '../../../testUtils';

const statTags = {
  aborted: {
    destType: 'ADOBE_ANALYTICS',
    destinationId: 'dummyDestinationId',
    errorCategory: 'dataValidation',
    errorType: 'instrumentation',
    feature: 'dataDelivery',
    implementation: 'native',
    module: 'destination',
    workspaceId: 'dummyWorkspaceId',
  },
};

export const proxyMetdata: ProxyMetdata = {
  jobId: 1,
  attemptNum: 1,
  userId: 'dummyUserId',
  sourceId: 'dummySourceId',
  destinationId: 'dummyDestinationId',
  workspaceId: 'dummyWorkspaceId',
  secret: {},
  dontBatch: false,
};
const headers = {
  'Content-Type': 'application/xml',
};

export const reqMetadataArray = [proxyMetdata];

const failureRequestParameters = {
  XML: {
    payload:
      '<?xml version="1.0" encoding="utf-8"?><request><browserHeight>1794</browserHeight><browserWidth>1080</browserWidth><campaign>sales campaign</campaign><channel>web</channel><currencyCode>USD</currencyCode><ipaddress>127.0.0.1</ipaddress><language>en-US</language><userAgent>Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)</userAgent><referrer>https://www.google.com/search?q=estore+bestseller</referrer><marketingcloudorgid/><events>prodView</events><products>Games;;11;148.39</products><reportSuiteID>failureReport</reportSuiteID></request>',
  },
  params: {},
};

const successRequestParameters = {
  XML: {
    payload:
      '<?xml version="1.0" encoding="utf-8"?><request><ipaddress>127.0.1.0</ipaddress><pageUrl>www.google.co.in</pageUrl><pageName>Google</pageName><visitorID>id1110011</visitorID><events>prodView</events><products>Games;Monopoly;1;14.00,Games;UNO;2;6.90</products><reportSuiteID>successreport</reportSuiteID></request>',
  },
  params: {},
};

export const testScenariosForV1API: ProxyV1TestData[] = [
  {
    id: 'adobe_analytics_v1_scenario_1',
    name: 'adobe_analytics',
    description: '[Proxy v1 API] :: Test for Failure response from Adobe Analytics with reason',
    successCriteria: 'Should return a 400 status code with reason',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...failureRequestParameters,
            headers,
            endpoint: 'https://adobe.failure.omtrdc.net/b/ss//6',
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
            status: 400,
            statTags: statTags.aborted,
            message:
              '[ADOBE_ANALYTICS Response Handler] Request failed for destination adobe_analytics : NO pagename OR pageurl',
            response: [
              {
                error:
                  '[ADOBE_ANALYTICS Response Handler] Request failed for destination adobe_analytics : NO pagename OR pageurl',
                metadata: proxyMetdata,
                statusCode: 400,
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'adobe_analytics_v1_scenario_2',
    name: 'adobe_analytics',
    description:
      '[Proxy v1 API] :: Test for Failure response from Adobe Analytics without reason (Generic error)',
    successCriteria: 'Should return a 400 status code with a general error',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...failureRequestParameters,
            headers,
            endpoint: 'https://adobe.failure2.omtrdc.net/b/ss//6',
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
            status: 400,
            statTags: statTags.aborted,
            message:
              '[ADOBE_ANALYTICS Response Handler] Request failed for destination adobe_analytics with a general error',
            response: [
              {
                error:
                  '[ADOBE_ANALYTICS Response Handler] Request failed for destination adobe_analytics with a general error',
                metadata: proxyMetdata,
                statusCode: 400,
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'adobe_analytics_v1_scenario_3',
    name: 'adobe_analytics',
    description: '[Proxy v1 API] :: Test for Success response from Adobe Analytics',
    successCriteria: 'Should return a 200 status code with status SUCCESS',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...successRequestParameters,
            headers,
            endpoint: 'https://adobe.success.omtrdc.net/b/ss//6',
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
            status: 200,
            message: '[ADOBE_ANALYTICS] - Request Processed Successfully',
            response: [
              {
                error: '"<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?><status>SUCCESS</status>"',
                metadata: proxyMetdata,
                statusCode: 200,
              },
            ],
          },
        },
      },
    },
  },
];
