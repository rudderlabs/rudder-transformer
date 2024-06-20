const { validateTrackSMSCampaignPayload } = require('./utils');

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
