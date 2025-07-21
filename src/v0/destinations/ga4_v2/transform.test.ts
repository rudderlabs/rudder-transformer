import { process } from './transform';
import { ProcessorTransformationRequest } from '../../../types';
import { handleCustomMappings } from './customMappingsHandler';
import { processEvents as ga4Process } from '../ga4/transform';

// Mock dependencies
jest.mock('./customMappingsHandler');
jest.mock('../ga4/transform');
jest.mock('../ga4/utils');

describe('process', () => {
  const mockHandleCustomMappings = handleCustomMappings as jest.Mock;
  const mockGa4Process = ga4Process as jest.Mock;

  beforeEach(() => {
    jest.restoreAllMocks();

    jest.clearAllMocks();
  });

  const testCases = [
    {
      name: 'should process track events with custom mappings',
      input: {
        message: {
          type: 'track',
          event: 'test_event',
        },
        destination: {
          Config: {
            configData: JSON.stringify({
              PROPERTY: 'test-property',
              DATA_STREAM: { type: 'gtag', value: 'G-123456' },
              MEASUREMENT_PROTOCOL_SECRET: 'secret',
            }),
          },
        },
      } as unknown as ProcessorTransformationRequest,
      expectedConfig: {
        propertyId: 'test-property',
        typesOfClient: 'gtag',
        measurementId: 'G-123456',
        apiSecret: 'secret',
        configData: expect.any(String),
      },
      shouldCallCustomMappings: true,
      shouldCallGa4Process: false,
    },
    {
      name: 'should process non-track events with ga4Process',
      input: {
        message: {
          type: 'identify',
        },
        destination: {
          Config: {
            configData: JSON.stringify({
              PROPERTY: 'test-property',
              DATA_STREAM: { type: 'firebase', value: 'app-id' },
              MEASUREMENT_PROTOCOL_SECRET: 'secret',
            }),
          },
        },
      } as unknown as ProcessorTransformationRequest,
      expectedConfig: {
        propertyId: 'test-property',
        typesOfClient: 'firebase',
        firebaseAppId: 'app-id',
        apiSecret: 'secret',
        configData: expect.any(String),
      },
      shouldCallCustomMappings: false,
      shouldCallGa4Process: true,
    },
  ];

  test.each(testCases)(
    '$name',
    ({ input, expectedConfig, shouldCallCustomMappings, shouldCallGa4Process }) => {
      process(input);

      if (shouldCallCustomMappings) {
        expect(mockHandleCustomMappings).toHaveBeenCalledWith(
          input.message,
          expect.objectContaining(expectedConfig),
        );
      } else {
        expect(mockHandleCustomMappings).not.toHaveBeenCalled();
      }

      if (shouldCallGa4Process) {
        expect(mockGa4Process).toHaveBeenCalledWith({
          event: expect.objectContaining({
            ...input,
            destination: expect.objectContaining({
              ...input.destination,
              Config: expect.objectContaining(expectedConfig),
            }),
          }),
          destType: 'ga4_v2',
        });
      } else {
        expect(mockGa4Process).not.toHaveBeenCalled();
      }
    },
  );

  const errorTestCases = [
    {
      name: 'should throw error when message type is missing',
      input: {
        message: {},
        destination: {
          Config: {
            configData: JSON.stringify({
              PROPERTY: 'test-property',
              DATA_STREAM: { type: 'gtag', value: 'G-123456' },
              MEASUREMENT_PROTOCOL_SECRET: 'secret',
            }),
          },
        },
      } as unknown as ProcessorTransformationRequest,
      expectedError: 'Message Type is not present. Aborting message.',
    },
    {
      name: 'should throw error when configData is not a string',
      input: {
        message: { type: 'track' },
        destination: {
          Config: {
            configData: { invalid: 'object' },
          },
        },
      } as unknown as ProcessorTransformationRequest,
      expectedError: 'Config data is not a string',
    },
  ];

  test.each(errorTestCases)('$name', ({ input, expectedError }) => {
    expect(() => process(input)).toThrow(expectedError);
  });
});
