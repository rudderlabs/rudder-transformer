import isEqual from 'lodash/isEqual';
import MockAxiosAdapter from 'axios-mock-adapter';
import { networkCallsData } from './network';

export const mockFacebookPixelNetworkResponses = (mockAdapter: MockAxiosAdapter) => {
  mockAdapter.resetHandlers();
  mockAdapter.onPost().reply((config) => {
    const matchedMock = networkCallsData.find(
      ({ httpReq }) =>
        httpReq.url === config.url &&
        httpReq.data === config.data &&
        isEqual(httpReq.params, config.params),
    );

    if (!matchedMock) {
      return [404, { error: 'No matching Facebook Pixel request mock' }];
    }

    const { status, data } = matchedMock.httpRes;
    return [status, data];
  });
};
