const { prepareRequestDetails } = require('./utils');

const buildLegacyUrl = (endpoint, uploadTag, event, accessToken) =>
  `${endpoint}?upload_tag=${uploadTag}&data=%5B${encodeURIComponent(
    JSON.stringify(event),
  )}%5D&access_token=${accessToken}`;

const serializeRequestUrl = (request) =>
  `${request.endpoint}?${new URLSearchParams(request.params).toString()}`;

describe('prepareRequestDetails', () => {
  test.each([
    {
      name: 'default upload tag',
      payload: {},
      accessToken: 'access-token',
    },
    {
      name: 'reserved characters in values',
      payload: { upload_tag: 'custom tag & source' },
      accessToken: 'token+/=',
    },
  ])('preserves the outbound query values for $name', ({ payload, accessToken }) => {
    const destination = { Config: { accessToken } };
    const event = {
      event_name: 'Purchase: completed',
      custom_data: { value: 'a b&c', currency: 'USD' },
    };
    const eventSetId = 'event-set-id';
    const [request] = prepareRequestDetails(destination, [event], [eventSetId], payload);
    const legacyUrl = new URL(
      buildLegacyUrl(request.endpoint, payload.upload_tag || 'rudderstack', event, accessToken),
    );
    const serializedUrl = new URL(serializeRequestUrl(request));

    expect(request.endpoint).toBe(`https://graph.facebook.com/v16.0/${eventSetId}/events`);
    expect(request.params).toEqual({
      upload_tag: payload.upload_tag || 'rudderstack',
      data: JSON.stringify([event]),
      access_token: accessToken,
    });
    expect(serializedUrl.searchParams.get('data')).toBe(legacyUrl.searchParams.get('data'));
    expect(serializedUrl.searchParams.get('upload_tag')).toBe(payload.upload_tag || 'rudderstack');
    expect(serializedUrl.searchParams.get('access_token')).toBe(accessToken);
    expect(serializedUrl.toString()).not.toContain('%25');
  });
});
