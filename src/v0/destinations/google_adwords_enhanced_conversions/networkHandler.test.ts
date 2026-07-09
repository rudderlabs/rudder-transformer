const { NetworkError } = require('@rudderstack/integrations-lib');

const mockGetConversionActionId = jest.fn();
const mockAddConversionAdjustMent = jest.fn();

jest.mock('@rudderstack/integrations-lib', () => ({
  ...jest.requireActual('@rudderstack/integrations-lib'),
  GoogleAdsSDK: {
    GoogleAds: jest.fn().mockImplementation(() => ({
      getConversionActionId: mockGetConversionActionId,
      addConversionAdjustMent: mockAddConversionAdjustMent,
    })),
  },
}));

jest.mock('../../util/googleUtils', () => ({
  ...jest.requireActual('../../util/googleUtils'),
  getDeveloperToken: () => 'dummy-developer-token',
}));

const { networkHandler } = require('./networkHandler');

describe('google adwords enhanced conversions - proxy', () => {
  const { proxy } = new networkHandler();

  beforeEach(() => {
    mockGetConversionActionId.mockReset().mockResolvedValue('999');
    mockAddConversionAdjustMent
      .mockReset()
      .mockResolvedValue({ statusCode: 200, responseBody: {} });
  });

  it('sets the resolved conversionAction on every adjustment in a batched request', async () => {
    const request = {
      body: {
        JSON: {
          partialFailure: true,
          conversionAdjustments: [
            { adjustmentType: 'ENHANCEMENT', orderId: '1' },
            { adjustmentType: 'ENHANCEMENT', orderId: '2' },
            { adjustmentType: 'ENHANCEMENT', orderId: '3' },
          ],
        },
      },
      params: {
        event: 'Page View',
        customerId: '1234567890',
        accessToken: 'dummy-access-token',
        loginCustomerId: '11',
        subAccount: true,
      },
    };

    await proxy(request);

    const sentBody = mockAddConversionAdjustMent.mock.calls[0][0];
    expect(sentBody.conversionAdjustments).toHaveLength(3);
    sentBody.conversionAdjustments.forEach((adjustment) => {
      expect(adjustment.conversionAction).toBe('999');
    });
  });
});

describe('google adwords enhanced conversions - responseHandler', () => {
  const { responseHandler } = new networkHandler();

  it('should treat a 200 response with an undefined body as success (no partial failure)', () => {
    // Google Ads returns a 200 with an empty/absent body when an upload fully
    // succeeds. Previously this crashed while destructuring partialFailureError.
    const destinationResponse = { status: 200, response: undefined };

    const result = responseHandler({ destinationResponse });

    expect(result).toEqual({
      status: 200,
      message: 'Request Processed Successfully',
      destinationResponse,
    });
  });

  it('should treat a 200 response with a partialFailureError of code 0 as success', () => {
    const destinationResponse = {
      status: 200,
      response: { partialFailureError: { code: 0 } },
    };

    const result = responseHandler({ destinationResponse });

    expect(result).toEqual({
      status: 200,
      message: 'Request Processed Successfully',
      destinationResponse,
    });
  });

  it('should throw a NetworkError when a 200 response carries a non-zero partialFailureError', () => {
    const destinationResponse = {
      status: 200,
      response: { partialFailureError: { code: 3, message: 'partial failure' } },
    };

    expect(() => responseHandler({ destinationResponse })).toThrow(NetworkError);
  });
});
