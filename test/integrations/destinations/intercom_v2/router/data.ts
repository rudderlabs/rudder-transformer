import { secret1 } from '../maskedSecrets';
import { MessageType, RouterTransformationRequest, RudderMessage } from '../../../../../src/types';
import { generateMetadata } from '../../../testUtils';
import {
  anonymousId,
  channel,
  companyTraits,
  destination,
  destinationApiServerAU,
  destinationApiServerEU,
  detachUserCompanyUserTraits,
  headers,
  originalTimestamp,
  properties,
  RouterInstrumentationErrorStatTags,
  RouterNetworkErrorStatTags,
  timestamp,
  userTraits,
} from '../common';
import { RouterTestData } from '../../../testTypes';
import { rETLRecordV2RouterRequest } from './rETL';

const routerRequest1: RouterTransformationRequest = {
  input: [
    {
      destination,
      message: {
        userId: 'user-id-1',
        channel,
        context: {
          traits: {
            ...userTraits,
            company: {
              id: 'company id',
              name: 'Test Company',
            },
          },
        },
        type: 'identify',
        integrations: { All: true },
        originalTimestamp,
        timestamp,
      },
      metadata: generateMetadata(1),
    },
    {
      destination,
      message: {
        userId: 'user-id-1',
        channel,
        context: {
          traits: userTraits,
        },
        properties: properties,
        event: 'Product Viewed',
        type: 'track',
        originalTimestamp,
        timestamp,
        integrations: {
          All: true,
          intercom: {
            id: 'id-by-intercom',
          },
        },
      },
      metadata: generateMetadata(2),
    },
    {
      destination,
      message: {
        groupId: 'rudderlabs',
        channel,
        traits: {
          ...companyTraits,
          tags: ['tag-1', 'tag-2'],
        },
        type: 'group',
        originalTimestamp,
        timestamp,
      },
      metadata: generateMetadata(3),
    },
    {
      destination,
      message: {
        groupId: 'rudderlabs',
        channel,
        traits: {
          ...companyTraits,
          isOpenSource: true,
        },
        type: 'group',
        originalTimestamp,
        timestamp,
      },
      metadata: generateMetadata(4),
    },
    {
      destination,
      message: {
        userId: 'user-id-1',
        channel,
        context: {
          traits: {
            ...userTraits,
          },
        },
        type: 'identify',
        integrations: { All: true },
        originalTimestamp,
        timestamp,
      },
      metadata: {
        ...generateMetadata(5),
        secret: {
          accessToken: secret1,
        },
      },
    },
    {
      destination,
      message: {
        groupId: 'rudderlabs',
        channel,
        traits: {
          ...companyTraits,
          tags: ['tag-3'],
        },
        type: 'group',
        originalTimestamp,
        timestamp,
      },
      metadata: generateMetadata(6),
    },
  ],
  destType: 'intercom_v2',
};

// eu server and send anonymous id true
const routerRequest2: RouterTransformationRequest = {
  input: [
    {
      destination: destinationApiServerEU,
      message: {
        anonymousId,
        channel,
        context: {
          traits: userTraits,
        },
        type: 'identify',
        integrations: { All: true },
        originalTimestamp,
        timestamp,
      },
      metadata: generateMetadata(1),
    },
    {
      destination: destinationApiServerEU,
      message: {
        anonymousId,
        channel,
        context: {
          traits: userTraits,
        },
        properties: properties,
        event: 'Product Viewed',
        type: 'track',
        originalTimestamp,
        timestamp,
      },
      metadata: generateMetadata(2),
    },
  ],
  destType: 'intercom_v2',
};

// au server and when contact found in intercom
const routerRequest3: RouterTransformationRequest = {
  input: [
    {
      destination: destinationApiServerAU,
      message: {
        userId: 'known-user-id-1',
        channel,
        context: {
          traits: userTraits,
        },
        type: 'identify',
        integrations: {
          All: true,
          Intercom: {
            lookup: 'userId',
          },
        },
        originalTimestamp,
        timestamp,
      },
      metadata: generateMetadata(1),
    },
    {
      destination: destinationApiServerAU,
      message: {
        groupId: 'rudderlabs',
        channel,
        traits: companyTraits,
        type: 'group',
        originalTimestamp,
        timestamp,
      },
      metadata: generateMetadata(2),
    },
    {
      destination: destinationApiServerAU,
      message: {
        groupId: 'rudderlabs',
        channel,
        traits: {
          ...companyTraits,
          email: 'known-user-2-company@gmail.com',
        },
        type: 'group',
        originalTimestamp,
        timestamp,
      },
      metadata: generateMetadata(3),
    },
    {
      destination: destinationApiServerAU,
      message: {
        userId: 'known-user-id-1',
        channel,
        context: {
          traits: { ...userTraits, external_id: 'known-user-id-1' },
        },
        type: 'identify',
        integrations: {
          All: true,
          Intercom: {
            lookup: 'external_id',
          },
        },
        originalTimestamp,
        timestamp,
      },
      metadata: generateMetadata(4),
    },
  ],
  destType: 'intercom_v2',
};

// detach user and company
const routerRequest4: RouterTransformationRequest = {
  input: [
    {
      destination,
      message: {
        userId: 'detach-company-user-id',
        channel,
        context: {
          traits: {
            ...detachUserCompanyUserTraits,
            company: {
              id: 'company id',
              name: 'Test Company',
              remove: true,
            },
          },
        },
        type: 'identify',
        integrations: { All: true },
        originalTimestamp,
        timestamp,
      },
      metadata: generateMetadata(1),
    },
    {
      destination: destination,
      message: {
        userId: 'detach-company-user-id',
        channel,
        context: {
          traits: {
            ...detachUserCompanyUserTraits,
            company: {
              id: 'unavailable company id',
              name: 'Test Company',
              remove: true,
            },
          },
        },
        type: 'identify',
        integrations: { All: true },
        originalTimestamp,
        timestamp,
      },
      metadata: generateMetadata(2),
    },
    {
      destination: destination,
      message: {
        userId: 'detach-company-user-id',
        channel,
        context: {
          traits: {
            ...detachUserCompanyUserTraits,
            company: {
              id: 'other company id',
              name: 'Test Company',
              remove: true,
            },
          },
        },
        type: 'identify',
        integrations: { All: true },
        originalTimestamp,
        timestamp,
      },
      metadata: generateMetadata(3),
    },
  ],
  destType: 'intercom_v2',
};

// validation
const routerRequest5: RouterTransformationRequest = {
  input: [
    {
      destination,
      message: {
        channel,
        context: {
          traits: {
            ...userTraits,
            email: null,
          },
        },
        type: 'identify',
        integrations: { All: true },
        originalTimestamp,
        timestamp,
      },
      metadata: generateMetadata(1),
    },
    {
      destination,
      message: {
        channel,
        context: {
          traits: {
            ...userTraits,
            email: null,
          },
        },
        event: 'Product Viewed',
        type: 'track',
        integrations: { All: true },
        originalTimestamp,
        timestamp,
      },
      metadata: generateMetadata(2),
    },
    {
      destination,
      message: {
        channel,
        context: {
          traits: {
            ...userTraits,
          },
        },
        type: 'track',
        integrations: { All: true },
        originalTimestamp,
        timestamp,
      },
      metadata: generateMetadata(3),
    },
    {
      destination,
      message: {
        channel,
        context: {
          traits: {
            ...companyTraits,
          },
        },
        type: 'group',
        integrations: { All: true },
        originalTimestamp,
        timestamp,
      },
      metadata: generateMetadata(4),
    },
    {
      destination,
      message: {
        channel,
        context: {
          traits: {
            ...companyTraits,
          },
        },
        type: 'dummyGroupType' as MessageType,
        integrations: { All: true },
        originalTimestamp,
        timestamp,
      },
      metadata: generateMetadata(5),
    },
  ],
  destType: 'intercom_v2',
};

export const data: RouterTestData[] = [
  {
    id: 'INTERCOM-V2-router-test-1',
    scenario: 'Framework',
    successCriteria:
      'Some events should be transformed successfully and some should fail for apiVersion v2',
    name: 'intercom_v2',
    description: 'INTERCOM V2 router tests',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: routerRequest1,
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              batchedRequest: {
                body: {
                  JSON: {
                    email: 'test@rudderlabs.com',
                    external_id: 'user-id-1',
                    name: 'John Snow',
                    owner_id: 13,
                    phone: '+91 9999999999',
                    custom_attributes: {
                      address: 'california usa',
                      age: 23,
                    },
                  },
                  XML: {},
                  FORM: {},
                  JSON_ARRAY: {},
                },
                endpoint: 'https://api.intercom.io/contacts',
                files: {},
                headers,
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: destination,
              metadata: [generateMetadata(1)],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    created_at: 1700628164,
                    email: 'test@rudderlabs.com',
                    event_name: 'Product Viewed',
                    metadata: {
                      price: {
                        amount: 3000,
                        currency: 'USD',
                      },
                      revenue: {
                        amount: 1232,
                        currency: 'inr',
                        test: 123,
                      },
                    },
                    user_id: 'user-id-1',
                    id: 'id-by-intercom',
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api.intercom.io/events',
                files: {},
                headers,
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: destination,
              metadata: [generateMetadata(2)],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  JSON: {
                    company_id: 'rudderlabs',
                    name: 'RudderStack',
                    size: 500,
                    website: 'www.rudderstack.com',
                    industry: 'CDP',
                    plan: 'enterprise',
                    remote_created_at: 1726132233,
                  },
                  XML: {},
                  FORM: {},
                  JSON_ARRAY: {},
                },
                endpoint: 'https://api.intercom.io/companies',
                files: {},
                headers,
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: destination,
              metadata: [generateMetadata(3)],
              statusCode: 299,
            },
            {
              batched: false,
              error:
                'Unable to Create or Update Company due to : {"type":"error.list","request_id":"request_id-1","errors":[{"code":"parameter_invalid","message":"Custom attribute \'isOpenSource\' does not exist"}]}',
              statTags: {
                ...RouterInstrumentationErrorStatTags,
              },
              destination,
              metadata: [generateMetadata(4)],
              statusCode: 400,
            },
            {
              batched: false,
              error: JSON.stringify({
                message: 'Unable to search contact due to',
                destinationResponse: JSON.stringify({
                  type: 'error.list',
                  request_id: 'request_id-1',
                  errors: [
                    {
                      code: 'unauthorized',
                      message: 'Access Token Invalid',
                    },
                  ],
                }),
              }),
              statTags: {
                ...RouterNetworkErrorStatTags,
                errorType: 'retryable',
                meta: 'invalidAuthToken',
              },
              destination,
              metadata: [
                {
                  ...generateMetadata(5),
                  secret: {
                    accessToken: secret1,
                  },
                },
              ],
              statusCode: 400,
            },
            {
              batched: false,
              error:
                'Unable to Add or Update the Tag to Company due to : {"type":"error.list","request_id":"req-1234","errors":[{"code":"company_not_found","message":"Company Not Found"}]}',
              statTags: {
                ...RouterInstrumentationErrorStatTags,
              },
              destination,
              metadata: [generateMetadata(6)],
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
  {
    id: 'INTERCOM-V2-router-test-2',
    scenario: 'Framework',
    successCriteria: 'Events should be transformed successfully for apiVersion v2',
    name: 'intercom_v2',
    description:
      'INTERCOM V2 router tests with sendAnonymousId true for apiVersion v2 and eu apiServer',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: routerRequest2,
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.eu.intercom.io/contacts',
                headers,
                params: {},
                body: {
                  JSON: {
                    email: 'test@rudderlabs.com',
                    external_id: 'test-anonymous-id',
                    name: 'John Snow',
                    owner_id: 13,
                    phone: '+91 9999999999',
                    custom_attributes: {
                      address: 'california usa',
                      age: 23,
                    },
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 200,
              destination: destinationApiServerEU,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.eu.intercom.io/events',
                headers,
                params: {},
                body: {
                  JSON: {
                    created_at: 1700628164,
                    email: 'test@rudderlabs.com',
                    event_name: 'Product Viewed',
                    metadata: {
                      price: {
                        amount: 3000,
                        currency: 'USD',
                      },
                      revenue: {
                        amount: 1232,
                        currency: 'inr',
                        test: 123,
                      },
                    },
                    user_id: 'test-anonymous-id',
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(2)],
              batched: false,
              statusCode: 200,
              destination: destinationApiServerEU,
            },
          ],
        },
      },
    },
  },
  {
    id: 'INTERCOM-V2-router-test-3',
    scenario: 'Framework',
    successCriteria: 'Events should be transformed successfully for apiVersion v2',
    name: 'intercom_v2',
    description:
      'INTERCOM V2 router tests when contact is found in intercom for au apiServer and apiVersion v2',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: routerRequest3,
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              batchedRequest: {
                body: {
                  JSON: {
                    email: 'test@rudderlabs.com',
                    external_id: 'known-user-id-1',
                    name: 'John Snow',
                    owner_id: 13,
                    phone: '+91 9999999999',
                    custom_attributes: {
                      address: 'california usa',
                      age: 23,
                    },
                  },
                  XML: {},
                  FORM: {},
                  JSON_ARRAY: {},
                },
                endpoint:
                  'https://api.au.intercom.io/contacts/contact-id-by-intercom-known-user-id-1',
                files: {},
                headers,
                method: 'PUT',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: destinationApiServerAU,
              metadata: [generateMetadata(1)],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  JSON: {
                    id: 'au-company-id-by-intercom',
                  },
                  XML: {},
                  FORM: {},
                  JSON_ARRAY: {},
                },
                endpoint:
                  'https://api.au.intercom.io/contacts/au-contact-id-by-intercom-known-email/companies',
                files: {},
                headers,
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: destinationApiServerAU,
              metadata: [generateMetadata(2)],
              statusCode: 299,
            },
            {
              batched: false,
              error:
                'Unable to attach Contact or User to Company due to : {"type":"error.list","request_id":"req-1234","errors":[{"code":"company_not_found","message":"Company Not Found"}]}',
              statTags: {
                ...RouterInstrumentationErrorStatTags,
              },
              destination: destinationApiServerAU,
              metadata: [generateMetadata(3)],
              statusCode: 400,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  JSON: {
                    email: 'test@rudderlabs.com',
                    external_id: 'known-user-id-1',
                    name: 'John Snow',
                    owner_id: 13,
                    phone: '+91 9999999999',
                    custom_attributes: {
                      address: 'california usa',
                      age: 23,
                    },
                  },
                  XML: {},
                  FORM: {},
                  JSON_ARRAY: {},
                },
                endpoint:
                  'https://api.au.intercom.io/contacts/contact-id-by-intercom-known-user-id-1',
                files: {},
                headers,
                method: 'PUT',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: destinationApiServerAU,
              metadata: [generateMetadata(4)],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    id: 'INTERCOM-V2-router-test-4',
    scenario: 'Framework',
    successCriteria:
      'Some identify events should be transformed successfully and some should fail for apiVersion v2',
    name: 'intercom',
    description:
      'INTERCOM V2 router tests for detaching contact from company in intercom for apiVersion v2',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: routerRequest4,
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              batchedRequest: {
                body: {
                  JSON: {
                    email: 'detach-user-company@rudderlabs.com',
                    external_id: 'detach-company-user-id',
                    name: 'John Snow',
                    owner_id: 13,
                    phone: '+91 9999999999',
                    custom_attributes: {
                      address: 'california usa',
                      age: 23,
                    },
                  },
                  XML: {},
                  FORM: {},
                  JSON_ARRAY: {},
                },
                endpoint:
                  'https://api.intercom.io/contacts/contact-id-by-intercom-detached-from-company',
                files: {},
                headers,
                method: 'PUT',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: destination,
              metadata: [generateMetadata(1)],
              statusCode: 200,
            },
            {
              batched: false,
              error:
                'Unable to get company id due to : {"type":"error.list","request_id":"req123","errors":[{"code":"company_not_found","message":"Company Not Found"}]}',
              statTags: RouterInstrumentationErrorStatTags,
              destination: destination,
              metadata: [generateMetadata(2)],
              statusCode: 400,
            },
            {
              batched: false,
              error:
                'Unable to detach contact and company due to : {"type":"error.list","request_id":"req123","errors":[{"code":"company_not_found","message":"Company Not Found"}]}',
              statTags: RouterInstrumentationErrorStatTags,
              destination: destination,
              metadata: [generateMetadata(3)],
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
  {
    id: 'INTERCOM-V2-router-test-5',
    scenario: 'Framework',
    successCriteria: 'validation should pass for apiVersion v2',
    name: 'intercom_v2',
    description: 'INTERCOM V2 router validation tests',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: routerRequest5,
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              error: 'Either email or userId is required for Identify call',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
              metadata: [generateMetadata(1)],
              statusCode: 400,
            },
            {
              batched: false,
              error: 'Either email or userId or id is required for Track call',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
              metadata: [generateMetadata(2)],
              statusCode: 400,
            },
            {
              batched: false,
              error: 'Missing required value from "event"',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
              metadata: [generateMetadata(3)],
              statusCode: 400,
            },
            {
              batched: false,
              error: 'Missing required value from "groupId"',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
              metadata: [generateMetadata(4)],
              statusCode: 400,
            },
            {
              batched: false,
              error: 'message type dummygrouptype is not supported.',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
              metadata: [generateMetadata(5)],
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
  {
    id: 'INTERCOM-V2-router-test-6',
    scenario: 'Framework',
    successCriteria: 'Some events should be transformed successfully and some should fail for rETL',
    name: 'intercom_v2',
    description: 'INTERCOM V2 rETL tests',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: rETLRecordV2RouterRequest,
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              batchedRequest: {
                body: {
                  JSON: {
                    email: 'test-rETL-unavailable@gmail.com',
                    external_id: 'rEtl_external_id',
                  },
                  XML: {},
                  FORM: {},
                  JSON_ARRAY: {},
                },
                endpoint: 'https://api.intercom.io/contacts',
                files: {},
                headers,
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: destination,
              metadata: [generateMetadata(1)],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  JSON: {
                    external_id: 'rEtl_external_id',
                  },
                  XML: {},
                  FORM: {},
                  JSON_ARRAY: {},
                },
                endpoint: 'https://api.intercom.io/contacts/retl-available-contact-id',
                files: {},
                headers,
                method: 'PUT',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: destination,
              metadata: [generateMetadata(2)],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  JSON: {},
                  XML: {},
                  FORM: {},
                  JSON_ARRAY: {},
                },
                endpoint: 'https://api.intercom.io/contacts/retl-available-contact-id',
                files: {},
                headers,
                method: 'DELETE',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: destination,
              metadata: [generateMetadata(3)],
              statusCode: 200,
            },
            {
              batched: false,
              error: 'Contact is not present. Aborting.',
              statTags: {
                ...RouterInstrumentationErrorStatTags,
                errorType: 'configuration',
              },
              destination,
              metadata: [generateMetadata(4)],
              statusCode: 400,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  JSON: {
                    external_id: 'rEtl_external_id',
                  },
                  XML: {},
                  FORM: {},
                  JSON_ARRAY: {},
                },
                endpoint: 'https://api.intercom.io/contacts/retl-available-contact-id',
                files: {},
                headers,
                method: 'PUT',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: destination,
              metadata: [generateMetadata(5)],
              statusCode: 200,
            },
            {
              batched: false,
              error: 'action dummyaction is not supported.',
              statTags: {
                ...RouterInstrumentationErrorStatTags,
              },
              destination,
              metadata: [generateMetadata(6)],
              statusCode: 400,
            },
            {
              batched: false,
              error: 'Missing lookup field or lookup field value for searchContact',
              statTags: {
                ...RouterInstrumentationErrorStatTags,
              },
              destination,
              metadata: [generateMetadata(7)],
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
];
