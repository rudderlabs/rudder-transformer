import { getBatchedRequest } from '../../../testUtils';
import lodash from 'lodash';

const destination = {
  ID: '1zzHtStW2ZPlullmz6L7DGnmk9V',
  Name: 'algolia-dev',
  Config: {
    apiKey: 'apiKey',
    applicationId: 'appId',
    eventTypeSettings: [
      { from: 'product clicked', to: 'click' },
      { from: 'product list viewed', to: 'view' },
    ],
  },
};

function getDestination(overrides: object): object {
  return lodash.merge({}, destination, overrides);
}

export const data = [
  {
    name: 'algolia',
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
                type: 'track',
                event: 'product list viewed',
                userId: 'test-user-id1',
                properties: {
                  index: 'products',
                  queryId: '43b15df305339e827f0ac0bdc5ebcaa7',
                  products: [
                    { objectId: 'ecommerce-sample-data-919', position: 7 },
                    { objectId: '9780439784542', position: 8 },
                  ],
                },
              },
              metadata: { jobId: 1, userId: 'u1' },
              destination: destination,
            },
            {
              message: {
                type: 'track',
                event: 'product clicked',
                userId: 'test-user-id1',
                properties: { index: 'products', filters: ['field1:hello', 'val1:val2'] },
              },
              metadata: { jobId: 2, userId: 'u1' },
              destination: destination,
            },
            {
              message: {
                type: 'track',
                event: 'product clicked',
                userId: 'testuserId1',
                properties: { filters: ['field1:hello', 'val1:val2'] },
              },
              metadata: { jobId: 3, userId: 'u1' },
              destination: destination,
            },
          ],
          destType: 'algolia',
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
              batched: false,
              destination: destination,
              error: 'Missing required value from "properties.index"',
              metadata: [{ jobId: 3, userId: 'u1' }],
              statTags: {
                destType: 'ALGOLIA',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 400,
            },
            {
              batchedRequest: getBatchedRequest({
                endpoint: 'https://insights.algolia.io/1/events',
                headers: { 'X-Algolia-Application-Id': 'appId', 'X-Algolia-API-Key': 'apiKey' },
                body: {
                  JSON: {
                    events: [
                      {
                        index: 'products',
                        userToken: 'test-user-id1',
                        queryID: '43b15df305339e827f0ac0bdc5ebcaa7',
                        eventName: 'product list viewed',
                        eventType: 'view',
                        objectIDs: ['ecommerce-sample-data-919', '9780439784542'],
                      },
                      {
                        index: 'products',
                        userToken: 'test-user-id1',
                        filters: ['field1:hello', 'val1:val2'],
                        eventName: 'product clicked',
                        eventType: 'click',
                      },
                    ],
                  },
                },
              }),
              metadata: [
                { jobId: 1, userId: 'u1' },
                { jobId: 2, userId: 'u1' },
              ],
              batched: true,
              statusCode: 200,
              destination: destination,
            },
          ],
        },
      },
    },
  },
  {
    name: 'algolia',
    description: 'Test 1', //TODO: we need a better description
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                event: 'Product List Viewed',
                userId: 'anonymous',
                properties: {
                  index: 'ecm_stg_product',
                  list_id: 1100000063100,
                  queryId: 'eafb6ef1081263626abce46671147dc0',
                  products: [
                    {
                      mpn: '190RF14X20',
                      sku: '1367585787601',
                      name: '14" x 20" Stamped Face Return Air Filter Grille with Removable Face - White',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '168782',
                      pim_id: '1367585787601',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 1,
                      list_name: 'Grilles',
                      product_id: '49765',
                      location_id: 1,
                      bu_product_num: '49765',
                    },
                    {
                      mpn: '190RF20X20',
                      sku: '1367585788656',
                      name: '20" x 20" Stamped Face Return Air Filter Grille with Removable Face - White',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '168790',
                      pim_id: '1367585788656',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 2,
                      list_name: 'Grilles',
                      product_id: '49773',
                      location_id: 1,
                      bu_product_num: '49773',
                    },
                    {
                      mpn: '210VM10X04',
                      sku: '1367585790735',
                      name: '10" x 4" Bar Type Supply Sidewall/Ceiling Register - White',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '300529',
                      pim_id: '1367585790735',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 3,
                      list_name: 'Grilles',
                      product_id: '300529A',
                      location_id: 1,
                      bu_product_num: '300529A',
                    },
                  ],
                  eventName: 'productListView',
                  eventType: 'view',
                  list_name: 'Grilles',
                  objectIds: ['1367585787601', '1367585788656', '1367585790735'],
                  positions: [1, 2, 3],
                  userToken: 'anonymous',
                },
              },
              destination: getDestination({
                Config: {
                  eventTypeSettings: [
                    { from: 'productClicked', to: 'click' },
                    { from: 'product list filtered', to: 'click' },
                    { from: 'Product List Viewed', to: 'view' },
                    { from: 'Order Completed', to: 'conversion' },
                    { from: 'Product Added', to: 'click' },
                  ],
                },
              }),
              metadata: {
                jobId: 12,
                userId: 'u1',
              },
            },
          ],
          destType: 'algolia',
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
              batched: true,
              batchedRequest: getBatchedRequest({
                body: {
                  JSON: {
                    events: [
                      {
                        eventName: 'product list viewed',
                        eventType: 'view',
                        index: 'ecm_stg_product',
                        objectIDs: ['1367585787601', '1367585788656', '1367585790735'],
                        queryID: 'eafb6ef1081263626abce46671147dc0',
                        userToken: 'anonymous',
                      },
                    ],
                  },
                },
                endpoint: 'https://insights.algolia.io/1/events',
                headers: { 'X-Algolia-API-Key': 'apiKey', 'X-Algolia-Application-Id': 'appId' },
              }),
              destination: getDestination({
                Config: {
                  eventTypeSettings: [
                    { from: 'productClicked', to: 'click' },
                    { from: 'product list filtered', to: 'click' },
                    { from: 'Product List Viewed', to: 'view' },
                    { from: 'Order Completed', to: 'conversion' },
                    { from: 'Product Added', to: 'click' },
                  ],
                },
              }),
              metadata: [
                {
                  jobId: 12,
                  userId: 'u1',
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
];
