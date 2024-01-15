import lodash from 'lodash';
import { getBatchedRequest } from '../../../testUtils';

const destination = {
  Config: {
    devKey: 'ef1d42390426e3f7c90ac78272e74344',
    androidAppId: 'com.rudderlabs.javascript',
  },
  Enabled: true,
};

export function getDestination(overrides: object): object {
  return lodash.merge({}, destination, overrides);
}

export const data = [
  {
    name: 'af',
    description: 'Test 0', //TODO: we need a better description
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                context: {
                  externalId: [{ type: 'appsflyerExternalId', id: 'afUid' }],
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  traits: {
                    anonymousId: '12345',
                  },
                  ip: '0.0.0.0',
                  os: { name: 'android', version: '' },
                },
                type: 'page',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                properties: { path: '', referrer: '', search: '', title: '', url: '' },
                name: 'ApplicationLoaded',
                integrations: { AF: { af_uid: 'afUid' } },
              },
              metadata: { jobId: 2, userId: 'u1' },
              destination: destination,
            },
            {
              message: {
                context: {
                  externalId: [{ type: 'appsflyerExternalId', id: 'afUid' }],
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  ip: '0.0.0.0',
                  os: { name: 'android', version: '' },
                },
                type: 'track',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                event: 'test track event HS',
                properties: {
                  user_actual_role: 'system_admin, system_user',
                  user_actual_id: 12345,
                },
                integrations: { AF: { af_uid: 'afUid' } },
              },
              metadata: { jobId: 3, userId: 'u1' },
              destination: destination,
            },
            {
              message: {
                context: {
                  externalId: [{ type: 'appsflyerExternalId', id: 'afUid' }],
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  traits: {
                    anonymousId: '12345',
                  },
                  ip: '0.0.0.0',
                  os: { name: 'android', version: '' },
                },
                type: 'page',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                properties: { path: '', referrer: '', search: '', title: '', url: '' },
                name: 'ApplicationLoaded',
                integrations: { AF: { af_uid: 'afUid' } },
              },
              metadata: { jobId: 4, userId: 'u1' },
              destination: getDestination({
                Config: {
                  sharingFilter: 'hey',
                },
              }),
            },
          ],
          destType: 'af',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: getBatchedRequest({
                endpoint: 'https://api2.appsflyer.com/inappevent/com.rudderlabs.javascript',
                headers: {
                  'Content-Type': 'application/json',
                  authentication: 'ef1d42390426e3f7c90ac78272e74344',
                },
                body: {
                  JSON: {
                    app_version_name: '1.0.0',
                    bundleIdentifier: 'com.rudderlabs.javascript',
                    customer_user_id: '12345',
                    eventValue: '{"path":"","referrer":"","search":"","title":"","url":""}',
                    eventName: 'page',
                    appsflyer_id: 'afUid',
                    os: '',
                    ip: '0.0.0.0',
                  },
                },
              }),
              metadata: [{ jobId: 2, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: destination,
            },
            {
              batchedRequest: getBatchedRequest({
                endpoint: 'https://api2.appsflyer.com/inappevent/com.rudderlabs.javascript',
                headers: {
                  'Content-Type': 'application/json',
                  authentication: 'ef1d42390426e3f7c90ac78272e74344',
                },
                body: {
                  JSON: {
                    app_version_name: '1.0.0',
                    bundleIdentifier: 'com.rudderlabs.javascript',
                    customer_user_id: '12345',
                    eventValue:
                      '{"properties":{"user_actual_role":"system_admin, system_user","user_actual_id":12345}}',
                    eventName: 'test track event HS',
                    appsflyer_id: 'afUid',
                    os: '',
                    ip: '0.0.0.0',
                  },
                },
              }),
              metadata: [{ jobId: 3, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: destination,
            },
            {
              batchedRequest: getBatchedRequest({
                endpoint: 'https://api2.appsflyer.com/inappevent/com.rudderlabs.javascript',
                headers: {
                  'Content-Type': 'application/json',
                  authentication: 'ef1d42390426e3f7c90ac78272e74344',
                },
                body: {
                  JSON: {
                    app_version_name: '1.0.0',
                    bundleIdentifier: 'com.rudderlabs.javascript',
                    customer_user_id: '12345',
                    eventValue: '{"path":"","referrer":"","search":"","title":"","url":""}',
                    eventName: 'page',
                    appsflyer_id: 'afUid',
                    os: '',
                    ip: '0.0.0.0',
                    sharing_filter: 'hey',
                  },
                },
              }),
              metadata: [{ jobId: 4, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: getDestination({
                Config: {
                  sharingFilter: 'hey',
                },
              }),
            },
          ],
        },
      },
    },
  },
];
