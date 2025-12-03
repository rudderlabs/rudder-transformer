import { hydrate } from './hydrate';
import * as network from '../../adapters/network';
import { SourceHydrationOutput, SourceHydrationRequest } from '../../types/sourceHydration';

jest.mock('../../adapters/network');

const mockHttpGET = network.httpGET as jest.MockedFunction<typeof network.httpGET>;

type SuccessResponse = SourceHydrationOutput & {
  batch: Array<{
    event?: {
      context?: {
        traits?: Record<string, unknown>;
      };
    };
  }>;
};

describe('Facebook Lead Ads Hydration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createValidInput = (leadIds: string[], accessToken: string = 'test_token') => ({
    batch: leadIds.map((leadId) => ({
      event: {
        anonymousId: leadId,
        context: {
          traits: {},
        },
      },
    })),
    source: {
      id: 'source_id',
      workspaceId: 'workspace_id',
      internalSecret: {
        pageAccessToken: accessToken,
      },
    },
  });

  describe('successful hydration', () => {
    const source = {
      id: 'source_id',
      workspaceId: 'workspace_id',
      internalSecret: {
        pageAccessToken: 'test_token',
      },
    };
    const testCases = [
      {
        name: 'should successfully hydrate single lead with field_data',
        mockResponse: {
          success: true,
          response: {
            data: {
              id: '123456',
              created_time: '2024-01-01T00:00:00Z',
              field_data: [
                { name: 'full_name', values: ['John Doe'] },
                { name: 'email', values: ['john@example.com'] },
                { name: 'phone_number', values: ['+1234567890'] },
              ],
            },
            status: 200,
          },
        },
        input: createValidInput(['123456']),
        expectedTraits: {
          full_name: 'John Doe',
          email: 'john@example.com',
          phone_number: '+1234567890',
        },
        expectedStatusCode: 200,
        verifyHttpCall: true,
      },
      {
        name: 'should handle field_data with empty values array',
        mockResponse: {
          success: true,
          response: {
            data: {
              id: '123456',
              field_data: [
                { name: 'full_name', values: ['John Doe'] },
                { name: 'empty_field', values: [] },
                { name: 'phone', values: ['+1234567890'] },
              ],
            },
            status: 200,
          },
        },
        input: createValidInput(['123456']),
        expectedTraits: {
          full_name: 'John Doe',
          phone: '+1234567890',
        },
        expectedStatusCode: 200,
      },
      {
        name: 'should only use first value from multi-value fields',
        mockResponse: {
          success: true,
          response: {
            data: {
              id: '123456',
              field_data: [
                { name: 'interests', values: ['sports', 'music', 'travel'] },
                { name: 'email', values: ['primary@example.com', 'secondary@example.com'] },
              ],
            },
            status: 200,
          },
        },
        input: createValidInput(['123456']),
        expectedTraits: {
          interests: 'sports',
          email: 'primary@example.com',
        },
        expectedStatusCode: 200,
      },
      {
        name: 'should handle lead data without field_data',
        mockResponse: {
          success: true,
          response: {
            data: {
              id: '123456',
              created_time: '2024-01-01T00:00:00Z',
            },
            status: 200,
          },
        },
        input: createValidInput(['123456']),
        expectedTraits: {},
        expectedStatusCode: 200,
      },
      {
        name: 'should preserve existing traits and merge with field_data',
        mockResponse: {
          success: true,
          response: {
            data: {
              id: '123456',
              field_data: [
                { name: 'email', values: ['john@example.com'] },
                { name: 'phone', values: ['+1234567890'] },
              ],
            },
            status: 200,
          },
        },
        input: {
          batch: [
            {
              event: {
                anonymousId: '123456',
                context: {
                  traits: {
                    existingTrait: 'value',
                    userId: 'user123',
                  },
                },
              },
            },
          ],
          source,
        },
        expectedTraits: {
          existingTrait: 'value',
          userId: 'user123',
          email: 'john@example.com',
          phone: '+1234567890',
        },
        expectedStatusCode: 200,
      },
      {
        name: 'should handle batch item without context.traits',
        mockResponse: {
          success: true,
          response: {
            data: {
              id: '123456',
              field_data: [{ name: 'email', values: ['test@example.com'] }],
            },
            status: 200,
          },
        },
        input: {
          batch: [
            {
              event: {
                anonymousId: '123456',
                context: {},
              },
            },
          ],
          source,
        },
        expectedTraits: {
          email: 'test@example.com',
        },
        expectedStatusCode: 200,
      },
      {
        name: 'should handle batch item without context',
        mockResponse: {
          success: true,
          response: {
            data: {
              id: '123456',
              field_data: [{ name: 'email', values: ['test@example.com'] }],
            },
            status: 200,
          },
        },
        input: {
          batch: [
            {
              event: {
                anonymousId: '123456',
              },
            },
          ],
          source,
        },
        expectedTraits: {
          email: 'test@example.com',
        },
        expectedStatusCode: 200,
      },
    ];

    testCases.forEach(
      ({ name, mockResponse, input, expectedTraits, expectedStatusCode, verifyHttpCall }) => {
        it(name, async () => {
          mockHttpGET.mockResolvedValue(mockResponse);

          const result = (await hydrate(input)) as SuccessResponse;

          expect(result.batch).toHaveLength(1);
          expect(result.batch[0].statusCode).toBe(expectedStatusCode);
          expect(result.batch[0].event?.context?.traits).toEqual(expectedTraits);
          expect(result.batch[0].errorMessage).toBeUndefined();

          if (verifyHttpCall) {
            expect(mockHttpGET).toHaveBeenCalledTimes(1);
            expect(mockHttpGET).toHaveBeenCalledWith(
              'https://graph.facebook.com/v24.0/123456',
              {
                params: {
                  access_token: 'test_token',
                },
              },
              {
                sourceType: 'facebook_lead_ads_native',
                feature: 'hydration',
                endpointPath: '/leadId',
                requestMethod: 'GET',
                metadata: {
                  sourceId: 'source_id',
                  workspaceId: 'workspace_id',
                },
              },
            );
          }
        });
      },
    );

    it('should handle empty batch array', async () => {
      const input = {
        batch: [],
        source: {
          internalSecret: {
            pageAccessToken: 'test_token',
          },
        },
      };

      const result = await hydrate(input);

      expect(result.batch).toEqual([]);
      expect(mockHttpGET).not.toHaveBeenCalled();
    });
  });

  it('should successfully hydrate multiple leads in parallel', async () => {
    const mockLeadData1 = {
      id: '123456',
      field_data: [{ name: 'full_name', values: ['John Doe'] }],
    };

    const mockLeadData2 = {
      id: '789012',
      field_data: [{ name: 'full_name', values: ['Jane Smith'] }],
    };

    mockHttpGET
      .mockResolvedValueOnce({
        success: true,
        response: {
          data: mockLeadData1,
          status: 200,
        },
      })
      .mockResolvedValueOnce({
        success: true,
        response: {
          data: mockLeadData2,
          status: 200,
        },
      });

    const input = createValidInput(['123456', '789012']);

    const result = (await hydrate(input)) as SuccessResponse;

    expect(result.batch).toHaveLength(2);
    expect(result.batch[0].statusCode).toBe(200);
    expect(result.batch[0].event?.context?.traits?.full_name).toBe('John Doe');
    expect(result.batch[1].statusCode).toBe(200);
    expect(result.batch[1].event?.context?.traits?.full_name).toBe('Jane Smith');

    expect(mockHttpGET).toHaveBeenCalledTimes(2);
  });

  it('should handle Facebook API errors', async () => {
    mockHttpGET.mockResolvedValue({
      success: false,
      response: {
        data: {
          error: {
            message: 'Invalid OAuth access token',
            code: 190,
          },
        },
        status: 401,
      },
    });

    const input = createValidInput(['123456']);
    const result = await hydrate(input);

    expect(result.batch).toHaveLength(1);
    expect(result.batch[0].statusCode).toBe(401);
    expect(result.batch[0].errorMessage).toBe('Invalid OAuth access token');
  });

  it('should handle mixed success and failure responses', async () => {
    const mockLeadData1 = {
      id: '123456',
      field_data: [{ name: 'full_name', values: ['John Doe'] }],
    };

    mockHttpGET
      .mockResolvedValueOnce({
        success: true,
        response: {
          data: mockLeadData1,
          status: 200,
        },
      })
      .mockResolvedValueOnce({
        success: false,
        response: {
          data: {
            error: {
              message: 'Lead not found',
            },
          },
          status: 404,
        },
      });

    const input = createValidInput(['123456', '999999']);

    const result = (await hydrate(input)) as SuccessResponse;

    expect(result.batch).toHaveLength(2);
    expect(result.batch[0].statusCode).toBe(200);
    expect(result.batch[0].event?.context?.traits?.full_name).toBe('John Doe');
    expect(result.batch[0].errorMessage).toBeUndefined();
    expect(result.batch[1].statusCode).toBe(404);
    expect(result.batch[1].errorMessage).toBe('Lead not found');
  });

  describe('Input validation', () => {
    const invalidInputTestCases: {
      name: string;
      input: SourceHydrationRequest;
      expectedError: string;
    }[] = [
      {
        name: 'should return 400 when pageAccessToken is empty',
        input: {
          batch: [
            {
              event: {
                anonymousId: '123456',
              },
            },
          ],
          source: {
            internalSecret: {
              pageAccessToken: '',
            },
          },
        },
        expectedError: 'Page access token is required',
      },
      {
        name: 'should return 400 when internalSecret is missing',
        input: {
          batch: [
            {
              event: {
                anonymousId: '123456',
              },
            },
          ],
          source: {},
        },
        expectedError: 'source.internalSecret: Required',
      },
      {
        name: 'should return 400 when batch item event is missing anonymousId',
        input: {
          batch: [
            {
              event: {
                anonymousId: '',
              },
            },
          ],
          source: {
            internalSecret: {
              pageAccessToken: 'test_token',
            },
          },
        },
        expectedError: 'anonymousId is required',
      },
    ];

    invalidInputTestCases.forEach(({ name, input, expectedError }) => {
      it(name, async () => {
        await expect(hydrate(input)).rejects.toThrow(expectedError);
        expect(mockHttpGET).not.toHaveBeenCalled();
      });
    });
  });
});
