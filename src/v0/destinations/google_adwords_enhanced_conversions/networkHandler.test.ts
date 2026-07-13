import { NetworkError } from '@rudderstack/integrations-lib';
import { networkHandler } from './networkHandler';

// jest.mock calls are hoisted above the imports at compile time. The factories reference the
// `mock`-prefixed jest.fn()s only inside lazily-evaluated closures, so declaring them after
// the imports is safe.
const mockGetConversionActionId: jest.Mock = jest.fn();
const mockAddConversionAdjustMent: jest.Mock = jest.fn();

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
    sentBody.conversionAdjustments.forEach((adjustment: Record<string, unknown>) => {
      expect(adjustment.conversionAction).toBe('999');
    });
  });

  it('should throw InstrumentationError when the conversion action is not found (null response)', async () => {
    mockGetConversionActionId.mockResolvedValue(null);

    const request = {
      body: {
        JSON: {
          partialFailure: true,
          conversionAdjustments: [{ adjustmentType: 'ENHANCEMENT' }],
        },
      },
      params: { event: 'Purchase', customerId: '1234567890', accessToken: 'dummy-access-token' },
    };

    await expect(proxy(request)).rejects.toThrow(
      'Conversion Action not found, make sure the event name provided on the dashboard is exactly same as the conversion action name in Google Ads',
    );
  });

  it('should throw NetworkError with the SDK status code on a client-error response', async () => {
    mockGetConversionActionId.mockResolvedValue({
      type: 'client-error',
      statusCode: 401,
      message: 'UNAUTHENTICATED',
    });

    const request = {
      body: {
        JSON: {
          partialFailure: true,
          conversionAdjustments: [{ adjustmentType: 'ENHANCEMENT' }],
        },
      },
      params: { event: 'Purchase', customerId: '1234567890', accessToken: 'bad-token' },
    };

    await expect(proxy(request)).rejects.toThrow(NetworkError);
  });

  it('should throw NetworkError with the SDK status code on an application-error response', async () => {
    mockGetConversionActionId.mockResolvedValue({
      type: 'application-error',
      statusCode: 500,
      responseBody: { error: 'Internal error' },
    });

    const request = {
      body: {
        JSON: {
          partialFailure: true,
          conversionAdjustments: [{ adjustmentType: 'ENHANCEMENT' }],
        },
      },
      params: { event: 'Purchase', customerId: '1234567890', accessToken: 'dummy-access-token' },
    };

    await expect(proxy(request)).rejects.toThrow(NetworkError);
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

  it('should throw a NetworkError on a non-2xx status', () => {
    const destinationResponse = {
      status: 400,
      response: { error: { message: 'INVALID_ARGUMENT' } },
    };

    expect(() => responseHandler({ destinationResponse })).toThrow(NetworkError);
  });
});
