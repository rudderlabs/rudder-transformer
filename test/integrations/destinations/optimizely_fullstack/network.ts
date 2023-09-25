const deleteNwData = [
  {
    httpReq: {
      method: 'get',
      url: 'https://cdn.optimizely.com/datafiles/abc.json',
    },
    httpRes: {
      status: 200,
      statusText: 'OK',
      data: {
        accountId: 'test_account_id',
        projectId: 'test_project_id',
        revision: '45',
        attributes: [
          {
            id: 'test_attribute_id_1',
            key: 'gender',
          },
          {
            id: 'test_attribute_id_2',
            key: 'name',
          },
          {
            id: 'test_attribute_id_3',
            key: 'userId',
          },
          {
            id: 'test_attribute_id_4',
            key: 'anonymousId',
          },
          {
            id: 'test_attribute_id_5',
            key: 'company',
          },
        ],
        audiences: [
          {
            id: '$opt_test_audience',
            name: 'Optimizely-Generated Audience for Backwards Compatibility',
            conditions:
              '["or", {"match": "exact", "name": "$opt_test_attribute", "type": "custom_attribute", "value": "$opt_test_value"}]',
          },
        ],
        version: '4',
        events: [
          {
            id: 'test_event_id_1',
            experimentIds: ['test_experiment_id'],
            key: 'Product Added',
          },
          {
            id: 'test_event_id_2',
            experimentIds: ['test_experiment_id'],
            key: 'Product Removed',
          },
          {
            id: 'test_event_id_3',
            experimentIds: ['test_experiment_id'],
            key: 'Order Placed',
          },
          {
            id: 'test_event_id_4',
            experimentIds: ['test_experiment_id'],
            key: 'Viewed Meal page',
          },
          {
            id: 'test_event_id_5',
            experimentIds: ['test_experiment_id'],
            key: 'Viewed food page',
          },
          {
            id: 'test_event_id_6',
            experimentIds: ['test_experiment_id'],
            key: 'Viewed Main screen',
          },
          {
            id: 'test_event_id_7',
            experimentIds: ['test_experiment_id'],
            key: 'Home',
          },
          {
            id: 'test_event_id_8',
            experimentIds: ['test_experiment_id'],
            key: 'Index',
          },
        ],
        anonymizeIP: true,
        botFiltering: false,
        typedAudiences: [],
        variables: [],
        environmentKey: 'production',
        sdkKey: 'test_sdk_key',
        featureFlags: [
          {
            id: 'test_feature_flag_id',
            key: 'testfeature',
            experimentIds: ['test_experiment_id'],
            rolloutId: 'test_rollout_id',
            variables: [
              {
                id: 'test_variable_id',
                key: 'sort_method',
                type: 'string',
                defaultValue: 'alphabetical',
              },
            ],
          },
        ],
        rollouts: [
          {
            id: 'test_rollout_id',
            experiments: [
              {
                forcedVariations: {},
                id: 'test_experiment_id',
                key: 'test_experiment_key',
                status: 'Running',
                trafficAllocation: [
                  {
                    entityId: 'test_variation_id',
                    endOfRange: 10000,
                  },
                ],
                variations: [
                  {
                    id: 'test_variation_id',
                    key: 'test_variation_key',
                    variables: [
                      {
                        id: 'test_variable_id',
                        value: 'alphabetical',
                      },
                    ],
                    featureEnabled: true,
                  },
                ],
                layerId: 'test_layer_id',
                audienceIds: [],
              },
            ],
          },
        ],
        experiments: [
          {
            forcedVariations: {},
            id: 'test_experiment_id',
            key: 'test_experiment_key',
            status: 'Running',
            trafficAllocation: [
              {
                entityId: 'test_variation_id_1',
                endOfRange: 5000,
              },
              {
                entityId: 'test_variation_id_2',
                endOfRange: 10000,
              },
            ],
            variations: [
              {
                id: 'test_variation_id_1',
                key: 'variation_1',
                variables: [
                  {
                    id: 'test_variable_id',
                    value: 'popular_first',
                  },
                ],
                featureEnabled: true,
              },
              {
                id: 'test_variation_id_2',
                key: 'variation_2',
                variables: [
                  {
                    id: 'test_variable_id',
                    value: 'popular_first',
                  },
                ],
                featureEnabled: true,
              },
            ],
            layerId: 'test_layer_id',
            audienceIds: [],
          },
        ],
        groups: [],
      },
    },
  },
  {
    httpReq: {
      method: 'get',
      url: 'https://cdn.optimizely.com/datafiles/wrong_cdn.json',
    },
    httpRes: {
      status: 404,
      statusText: 'Not Found',
      data: {
        code: 'document_not_found',
        message: 'document_not_found',
      },
    },
  },
];
export const networkCallsData = [...deleteNwData];
