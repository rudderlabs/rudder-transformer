const axios = require('axios');
const { enhanceRequestOptions } = require('../../../adapters/network');
const { prepareRequestDetails } = require('./utils');

const buildLegacyUrl = (endpoint, uploadTag, event, accessToken) =>
  `${endpoint}?upload_tag=${uploadTag}&data=%5B${encodeURIComponent(
    JSON.stringify(event),
  )}%5D&access_token=${accessToken}`;

const serializeRequestUrl = (request) =>
  axios.getUri(
    enhanceRequestOptions({
      url: request.endpoint,
      params: request.params,
      paramsSerializer: request.paramsSerializer,
    }),
  );

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
    const legacyUrl = buildLegacyUrl(
      request.endpoint,
      payload.upload_tag || 'rudderstack',
      event,
      accessToken,
    );
    const serializedUrl = serializeRequestUrl(request);

    expect(request.endpoint).toBe(`https://graph.facebook.com/v16.0/${eventSetId}/events`);
    expect(request.params).toEqual({
      upload_tag: payload.upload_tag || 'rudderstack',
      data: `%5B${encodeURIComponent(JSON.stringify(event))}%5D`,
      access_token: accessToken,
    });
    expect(serializedUrl).toBe(legacyUrl);
  });
});
