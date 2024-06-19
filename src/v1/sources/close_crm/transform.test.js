const { process } = require('./transform');

// mock a specific function from the module
jest.mock('../../../v0/util', () => {
  const originalModule = jest.requireActual('../../../v0/util');
  return {
    ...originalModule,
    generateUUID: jest.fn(() => 'generated_uuid'),
  };
});

describe('Transform.js Tests', () => {
  it(`should transform the event`, () => {
    const data = {
      input: {
        event: {
          event: {
            date_created: '2019-01-15T12:48:23.395000',
            meta: {
              request_method: 'PUT',
              request_path: '/api/v1/opportunity/object_id/',
            },
            id: 'ev_123',
            action: 'updated',
            date_updated: '2019-01-15T12:48:23.395000',
            changed_fields: [
              'confidence',
              'date_updated',
              'status_id',
              'status_label',
              'status_type',
            ],
            previous_data: {
              status_type: 'active',
              confidence: 70,
              date_updated: '2019-01-15T12:47:39.873000+00:00',
              status_id: 'stat_123',
              status_label: 'Active',
            },
            organization_id: 'orga_123',
            data: {
              contact_name: 'Mr. Jones',
              user_name: 'Joe Kemp',
              value_period: 'one_time',
              updated_by_name: 'Joe Kemp',
              date_created: '2019-01-15T12:41:24.496000+00:00',
              user_id: 'user_123',
              updated_by: 'user_123',
              value_currency: 'USD',
              organization_id: 'orga_123',
              status_label: 'Won',
              contact_id: 'cont_123',
              status_type: 'won',
              created_by_name: 'Joe Kemp',
              id: 'id_12',
              lead_name: 'KLine',
              date_lost: null,
              note: '',
              date_updated: '2019-01-15T12:48:23.392000+00:00',
              status_id: 'stat_12',
              value: 100000,
              created_by: 'user_123',
              value_formatted: '$1,000',
              date_won: '2019-01-15',
              lead_id: 'lead_123',
              confidence: 100,
            },
            request_id: 'req_123',
            object_id: 'object_id',
            user_id: 'user_123',
            object_type: 'opportunity',
            lead_id: 'lead_123',
          },
          subscription_id: 'whsub_123',
        },
        source: {},
      },
      output: {
        context: {
          library: {
            name: 'unknown',
            version: 'unknown',
          },
          integration: {
            name: 'CloseCRM',
          },
        },
        integrations: {
          CloseCRM: false,
        },
        type: 'track',
        event: 'opportunity updated',
        messageId: 'ev_123',
        userId: 'lead_123',
        originalTimestamp: '2019-01-TuT12:48:23.395+00:00',
        properties: {
          date_created: '2019-01-15T12:48:23.395000',
          meta: {
            request_method: 'PUT',
            request_path: '/api/v1/opportunity/object_id/',
          },
          id: 'ev_123',
          action: 'updated',
          date_updated: '2019-01-15T12:48:23.395000',
          organization_id: 'orga_123',
          data: {
            contact_name: 'Mr. Jones',
            user_name: 'Joe Kemp',
            value_period: 'one_time',
            updated_by_name: 'Joe Kemp',
            date_created: '2019-01-15T12:41:24.496000+00:00',
            user_id: 'user_123',
            updated_by: 'user_123',
            value_currency: 'USD',
            organization_id: 'orga_123',
            status_label: 'Won',
            contact_id: 'cont_123',
            status_type: 'won',
            created_by_name: 'Joe Kemp',
            id: 'id_12',
            lead_name: 'KLine',
            note: '',
            date_updated: '2019-01-15T12:48:23.392000+00:00',
            status_id: 'stat_12',
            value: 100000,
            created_by: 'user_123',
            value_formatted: '$1,000',
            date_won: '2019-01-15',
            lead_id: 'lead_123',
            confidence: 100,
          },
          request_id: 'req_123',
          object_id: 'object_id',
          user_id: 'user_123',
          object_type: 'opportunity',
          lead_id: 'lead_123',
          subscription_id: 'whsub_123',
        },
      },
    };
    const output = process(data.input);
    expect(output).toEqual(data.output);
  });
  it(`should transform the event for null lead_id`, () => {
    const data = {
      input: {
        event: {
          subscription_id: 'whsub_123',
          event: {
            id: 'ev_123',
            date_created: '2024-06-13T03:53:33.917000',
            date_updated: '2024-06-13T03:53:33.917000',
            organization_id: 'orga_123',
            user_id: 'user_123',
            request_id: 'req_123',
            api_key_id: null,
            oauth_client_id: null,
            oauth_scope: null,
            object_type: 'group',
            object_id: 'group_123',
            lead_id: null,
            action: 'created',
            changed_fields: [],
            meta: {
              request_path: '/api/v1/graphql/',
              request_method: 'POST',
            },
            data: {
              id: 'group_123',
              name: 'Test group',
              members: [
                {
                  user_id: 'user_123',
                },
              ],
            },
            previous_data: {},
          },
        },
        source: {},
      },
      output: {
        anonymousId: 'generated_uuid',
        context: {
          integration: {
            name: 'CloseCRM',
          },
          library: {
            name: 'unknown',
            version: 'unknown',
          },
        },
        event: 'group created',
        integrations: {
          CloseCRM: false,
        },
        messageId: 'ev_123',
        originalTimestamp: '2024-06-ThT03:53:33.917+00:00',
        properties: {
          action: 'created',
          data: {
            id: 'group_123',
            members: [
              {
                user_id: 'user_123',
              },
            ],
            name: 'Test group',
          },
          date_created: '2024-06-13T03:53:33.917000',
          date_updated: '2024-06-13T03:53:33.917000',
          id: 'ev_123',
          meta: {
            request_method: 'POST',
            request_path: '/api/v1/graphql/',
          },
          object_id: 'group_123',
          object_type: 'group',
          organization_id: 'orga_123',
          request_id: 'req_123',
          subscription_id: 'whsub_123',
          user_id: 'user_123',
        },
        type: 'track',
      },
    };
    const output = process(data.input);
    expect(output).toEqual(data.output);
  });
});
