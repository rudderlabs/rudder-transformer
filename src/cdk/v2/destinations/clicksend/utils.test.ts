import { validateTrackSMSCampaignPayload, deduceSchedule, getHttpMethodForEndpoint } from './utils';

describe('ClickSend Utils', () => {
  describe('validateTrackSMSCampaignPayload', () => {
    const testCases = [
      {
        name: 'all required fields defined and non-empty',
        payload: {
          body: 'Test message',
          name: 'Test Campaign',
          list_id: '12345',
          from: 'TestSender',
        },
        expectError: false,
      },
      {
        name: 'missing body field',
        payload: {
          name: 'Test Campaign',
          list_id: '12345',
          from: 'TestSender',
        },
        expectError: true,
      },
      {
        name: 'empty from field',
        payload: {
          name: 'Test Campaign',
          list_id: '12345',
          from: '',
          body: 'Test message',
        },
        expectError: true,
      },
    ];

    testCases.forEach(({ name, payload, expectError }) => {
      it(`should ${expectError ? 'throw' : 'not throw'} when ${name}`, () => {
        const testFn = () => validateTrackSMSCampaignPayload(payload);
        if (expectError) {
          expect(testFn).toThrow(
            'All of contact list Id, name, body and from are required to trigger an sms campaign',
          );
        } else {
          expect(testFn).not.toThrow();
        }
      });
    });
  });

  describe('deduceSchedule', () => {
    const testCases = [
      {
        name: 'eventLevelSchedule is defined',
        eventLevelSchedule: 1234567890,
        timestamp: '2023-10-01T00:00:00Z',
        destConfig: {
          defaultCampaignScheduleUnit: 'minute',
          defaultCampaignSchedule: '5',
        },
        expected: 1234567890,
        expectError: false,
      },
      {
        name: 'invalid defaultCampaignScheduleUnit',
        eventLevelSchedule: null,
        timestamp: '2023-10-01T00:00:00Z',
        destConfig: {
          defaultCampaignScheduleUnit: 'hour',
          defaultCampaignSchedule: '5',
        },
        expectError: true,
        errorMessage: "Invalid delta unit. Use 'day' or 'minute'.",
      },
      {
        name: 'schedule unit is minute',
        eventLevelSchedule: null,
        timestamp: '2023-10-01T00:00:00Z',
        destConfig: {
          defaultCampaignScheduleUnit: 'minute',
          defaultCampaignSchedule: '5',
        },
        expected: new Date('2023-10-01T00:05:00Z').getTime() / 1000,
        expectError: false,
      },
      {
        name: 'schedule unit is day',
        eventLevelSchedule: null,
        timestamp: '2023-10-01T00:00:00Z',
        destConfig: {
          defaultCampaignScheduleUnit: 'day',
          defaultCampaignSchedule: '1',
        },
        expected: new Date('2023-10-02T00:00:00Z').getTime() / 1000,
        expectError: false,
      },
      {
        name: 'invalid schedule string',
        eventLevelSchedule: null,
        timestamp: '2023-10-01T00:00:00Z',
        destConfig: {
          defaultCampaignScheduleUnit: 'day',
          defaultCampaignSchedule: 'inValid',
        },
        expected: new Date('2023-10-01T00:00:00Z').getTime() / 1000,
        expectError: false,
      },
      {
        name: 'schedule with trailing invalid text and leading space',
        eventLevelSchedule: null,
        timestamp: '2023-10-01T00:00:00Z',
        destConfig: {
          defaultCampaignScheduleUnit: 'minute',
          defaultCampaignSchedule: ' 5Invalid.String  ',
        },
        expected: new Date('2023-10-01T00:05:00Z').getTime() / 1000,
        expectError: false,
      },
    ];

    testCases.forEach(
      ({
        name,
        eventLevelSchedule,
        timestamp,
        destConfig,
        expected,
        expectError,
        errorMessage,
      }) => {
        it(`should handle ${name}`, () => {
          const testFn = () => deduceSchedule(eventLevelSchedule, timestamp, destConfig);
          if (expectError) {
            expect(testFn).toThrow(errorMessage);
          } else {
            const result = testFn();
            expect(result).toBe(expected);
            expect(typeof result).toBe('number');
            expect(result.toString()).toMatch(/^\d+$/);
          }
        });
      },
    );
  });

  describe('getHttpMethodForEndpoint', () => {
    const testCases = [
      {
        name: 'contacts with ID endpoint',
        endpoint: 'https://rest.clicksend.com/v3/lists/<list-id>/contacts/<contact-id>',
        expected: 'PUT',
      },
      {
        name: 'contacts endpoint',
        endpoint: 'https://rest.clicksend.com/v3/lists/<list-id>/contacts',
        expected: 'POST',
      },
      {
        name: 'sms-campaigns endpoint',
        endpoint: 'https://rest.clicksend.com/v3/sms-campaigns/send',
        expected: 'POST',
      },
      {
        name: 'sms send endpoint',
        endpoint: 'https://rest.clicksend.com/v3/sms/send',
        expected: 'POST',
      },
    ];

    testCases.forEach(({ name, endpoint, expected }) => {
      it(`should return ${expected} for ${name}`, () => {
        expect(getHttpMethodForEndpoint(endpoint)).toBe(expected);
      });
    });
  });
});
