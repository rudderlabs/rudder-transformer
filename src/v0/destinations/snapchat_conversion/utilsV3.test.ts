import { getExtInfo } from './utilsV3';
import { RudderMessage } from '../../../types';
import moment from 'moment-timezone';

// Mock moment-timezone
jest.mock('moment-timezone');

type ExtInfoTestCase = {
  title: string;
  input: Partial<RudderMessage>;
  expected: string[] | null;
  mock?: () => void;
};

const extInfoTestCases: ExtInfoTestCase[] = [
  {
    title: 'Apple device with valid timezone',
    input: {
      context: {
        device: { type: 'ios', model: 'iPhone X' },
        app: { namespace: 'com.test.app', build: '123', version: '1.2.3' },
        os: { version: '17.0' },
        screen: { width: 1080, height: 1920, density: 3 },
        locale: 'en-IN',
        timezone: 'Asia/Kolkata',
        network: { carrier: 'Airtel' },
      },
      properties: {
        storage: 64000,
        free_storage: 32000,
        cpu_cores: 6,
      },
    },
    mock: () => {
      jest.spyOn(moment.tz, 'zone').mockReturnValue({} as any);
      (moment as any).mockReturnValue({
        tz: jest.fn().mockReturnValue({
          format: jest.fn().mockReturnValue('IST'),
        }),
      });
    },
    expected: [
      'i2',
      'com.test.app',
      '123',
      '1.2.3',
      '17.0',
      'iPhone X',
      'en-IN',
      'IST',
      'Airtel',
      '1080',
      '1920',
      '3',
      '6',
      '64000',
      '32000',
      'Asia/Kolkata',
    ],
  },

  {
    title: 'Android device with null/invalid fields',
    input: {
      context: {
        device: { type: 'Android', model: null },
        app: { namespace: null, build: null, version: null },
        os: { version: null },
        screen: { width: null, height: null, density: null },
        locale: null,
        timezone: 'Invalid/Zone',
        network: { carrier: null },
      },
      properties: {
        storage: null,
        free_storage: null,
        cpu_cores: null,
      },
    },
    mock: () => {
      jest.spyOn(moment.tz, 'zone').mockReturnValue(null);
    },
    expected: ['a2', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Invalid/Zone'],
  },

  {
    title: 'Exception thrown in moment.tz.zone',
    input: {
      context: {
        device: { type: 'ios', model: 'iPhone 14' },
        app: { namespace: 'com.example', build: 200, version: '2.0' },
        os: { version: '17.3' },
        screen: { width: 750, height: 1334, density: 2 },
        locale: 'en-GB',
        timezone: 'Europe/London',
        network: { carrier: 'Vodafone' },
      },
      properties: {
        storage: 128000,
        free_storage: 64000,
        cpu_cores: 4,
      },
    },
    mock: () => {
      jest.spyOn(moment.tz, 'zone').mockImplementation(() => {
        throw new Error('tz.zone failed');
      });
    },
    expected: [
      'i2',
      'com.example',
      '200',
      '2.0',
      '17.3',
      'iPhone 14',
      'en-GB',
      '',
      'Vodafone',
      '750',
      '1334',
      '2',
      '4',
      '128000',
      '64000',
      'Europe/London',
    ],
  },

  {
    title: 'Missing timezone field',
    input: {
      context: {
        device: { type: 'ios', model: 'iPhone SE' },
        app: { namespace: 'com.app', build: '22', version: '0.9.9' },
        os: { version: '16.0' },
        screen: { width: 640, height: 1136, density: 2 },
        locale: 'en-US',
        network: { carrier: 'Jio' },
      },
      properties: {
        storage: 32000,
        free_storage: 16000,
        cpu_cores: 2,
      },
    },
    expected: [
      'i2',
      'com.app',
      '22',
      '0.9.9',
      '16.0',
      'iPhone SE',
      'en-US',
      '',
      'Jio',
      '640',
      '1136',
      '2',
      '2',
      '32000',
      '16000',
      '',
    ],
  },
];

describe('getExtInfo', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each(extInfoTestCases)('$title', ({ input, expected, mock }) => {
    if (mock) mock();
    const result = getExtInfo(input as RudderMessage);
    expect(result).toEqual(expected);
  });
});
