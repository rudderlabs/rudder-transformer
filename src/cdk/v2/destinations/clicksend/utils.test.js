const {
  validateTrackSMSCampaignPayload,
  deduceSchedule,
  getHttpMethodForEndpoint,
} = require('./utils');

describe('validateTrackSMSCampaignPayload', () => {
  // payload with all required fields defined and non-empty does not throw an error
  it('should not throw an error when all required fields are defined and non-empty', () => {
    const payload = {
      body: 'Test message',
      name: 'Test Campaign',
      list_id: '12345',
      from: 'TestSender',
    };
    expect(() => validateTrackSMSCampaignPayload(payload)).not.toThrow();
  });

  // payload with body field missing throws an error
  it('should throw an error when body field is missing', () => {
    const payload = {
      name: 'Test Campaign',
      list_id: '12345',
      from: 'TestSender',
    };
    expect(() => validateTrackSMSCampaignPayload(payload)).toThrow(
      'All of contact list Id, name, body and from are required to trigger an sms campaign',
    );
  });

  it('should throw an error when from field is empty string', () => {
    const payload = {
      name: 'Test Campaign',
      list_id: '12345',
      from: '',
      body: 'Test message',
    };
    expect(() => validateTrackSMSCampaignPayload(payload)).toThrow(
      'All of contact list Id, name, body and from are required to trigger an sms campaign',
    );
  });
});

describe('deduceSchedule', () => {
  // returns eventLevelSchedule if it is defined, not null, and not empty
  it('should return eventLevelSchedule when it is defined, not null, and not empty', () => {
    const eventLevelSchedule = 1234567890;
    const timestamp = '2023-10-01T00:00:00Z';
    const destConfig = { defaultCampaignScheduleUnit: 'minute', defaultCampaignSchedule: '5' };

    const result = deduceSchedule(eventLevelSchedule, timestamp, destConfig);

    expect(result).toBe(eventLevelSchedule);
  });

  // throws error for invalid defaultCampaignScheduleUnit
  it('should throw error when defaultCampaignScheduleUnit is invalid', () => {
    const eventLevelSchedule = null;
    const timestamp = '2023-10-01T00:00:00Z';
    const destConfig = { defaultCampaignScheduleUnit: 'hour', defaultCampaignSchedule: '5' };

    expect(() => {
      deduceSchedule(eventLevelSchedule, timestamp, destConfig);
    }).toThrow("Invalid delta unit. Use 'day' or 'minute'.");
  });

  // calculates future timestamp correctly when defaultCampaignScheduleUnit is 'minute'
  it('should calculate future timestamp correctly when defaultCampaignScheduleUnit is minute', () => {
    const eventLevelSchedule = null;
    const timestamp = '2023-10-01T00:00:00Z';
    const destConfig = { defaultCampaignScheduleUnit: 'minute', defaultCampaignSchedule: '5' };

    const result = deduceSchedule(eventLevelSchedule, timestamp, destConfig);

    const expectedTimestamp = new Date('2023-10-01T00:05:00Z').getTime() / 1000;

    expect(result).toBe(expectedTimestamp);
  });

  // calculates future timestamp correctly when defaultCampaignScheduleUnit is 'day'
  it('should calculate future timestamp correctly when defaultCampaignScheduleUnit is day', () => {
    const eventLevelSchedule = null;
    const timestamp = '2023-10-01T00:00:00Z';
    const destConfig = { defaultCampaignScheduleUnit: 'day', defaultCampaignSchedule: '1' };

    const result = deduceSchedule(eventLevelSchedule, timestamp, destConfig);

    const expectedTimestamp = new Date('2023-10-02T00:00:00Z').getTime() / 1000;

    expect(result).toBe(expectedTimestamp);
  });

  it('should calculate timestamp when defaultCampaignSchedule in some invalid string', () => {
    const eventLevelSchedule = null;
    const timestamp = '2023-10-01T00:00:00Z';
    const destConfig = { defaultCampaignScheduleUnit: 'day', defaultCampaignSchedule: 'inValid' };

    const result = deduceSchedule(eventLevelSchedule, timestamp, destConfig);
    const expectedTimestamp = new Date('2023-10-01T00:00:00Z').getTime() / 1000;

    expect(result).toBe(expectedTimestamp);
  });

  it('should calculate timestamp when defaultCampaignSchedule has trailing invalid text and/or leading space', () => {
    const eventLevelSchedule = null;
    const timestamp = '2023-10-01T00:00:00Z';
    const destConfig = {
      defaultCampaignScheduleUnit: 'minute',
      defaultCampaignSchedule: ' 5Invalid.String  ',
    };

    const result = deduceSchedule(eventLevelSchedule, timestamp, destConfig);
    const expectedTimestamp = new Date('2023-10-01T00:05:00Z').getTime() / 1000;

    expect(result).toBe(expectedTimestamp);
  });

  // returns UNIX timestamp in seconds
  it('should return UNIX timestamp in seconds', () => {
    const eventLevelSchedule = null;
    const timestamp = '2023-10-01T00:00:00Z';
    const destConfig = { defaultCampaignScheduleUnit: 'minute', defaultCampaignSchedule: '5' };

    const result = deduceSchedule(eventLevelSchedule, timestamp, destConfig);

    expect(typeof result).toBe('number');
    expect(result.toString()).toMatch(/^\d+$/);
  });
});

describe('getHttpMethodForEndpoint', () => {
  // returns 'PUT' for endpoint matching /contacts/{id}
  it('should return PUT when endpoint matches /contacts/{id}', () => {
    const endpoint = 'https://rest.clicksend.com/v3/lists/<list-id>/contacts/<contact-id>';
    const result = getHttpMethodForEndpoint(endpoint);
    expect(result).toBe('PUT');
  });

  // handles empty string as endpoint
  it('should return POST when endpoint is an empty string', () => {
    const endpoint = 'https://rest.clicksend.com/v3/lists/<list-id>/contacts';
    const result = getHttpMethodForEndpoint(endpoint);
    expect(result).toBe('POST');
  });

  it('should return POST when endpoint is an empty string', () => {
    const endpoint = 'https://rest.clicksend.com/v3/sms-campaigns/send';
    const result = getHttpMethodForEndpoint(endpoint);
    expect(result).toBe('POST');
  });

  it('should return POST when endpoint is an empty string', () => {
    const endpoint = 'https://rest.clicksend.com/v3/sms/send';
    const result = getHttpMethodForEndpoint(endpoint);
    expect(result).toBe('POST');
  });
});
