import { RudderMessage } from '../../../types';
import { flattenJson, getFieldValueFromMessage } from '../../util';
import { getAirshipTimestamp, convertToAirshipTimestamp, prepareAttributePayload } from './utils';

type timestampTc = {
  description: string;
  input: string | number;
  output?: string;
  error?: string;
};

describe('Airship utils - getAirshipTimestamp', () => {
  const timestampCases: timestampTc[] = [
    {
      description: 'should return the same timestamp',
      input: '2025-01-23T12:00:00Z',
      output: '2025-01-23T12:00:00Z',
    },
    {
      description: 'should remove milliseconds',
      input: '2025-01-23T12:00:00.123Z',
      output: '2025-01-23T12:00:00Z',
    },
    {
      description: 'should remove milliseconds - 2',
      input: '2025-01-23T12:00:00.123456Z',
      output: '2025-01-23T12:00:00Z',
    },
    {
      description: 'should return with correct format when T is present but Z is not present',
      input: '2025-01-23T12:00:00',
      output: '2025-01-23T12:00:00Z',
    },
    {
      description: 'should return with correct format when T & Z is not present',
      input: '2025-01-23 12:00:00',
      output: '2025-01-23T12:00:00Z',
    },
    {
      description: 'should throw error when timestamp is not supported',
      input: 'abcd',
      error: 'timestamp is not supported: abcd',
    },
    {
      description:
        'should return with correct format when timestamp contains microseconds without Z',
      input: '2025-01-23T12:00:00.123456',
      output: '2025-01-23T12:00:00Z',
    },
  ];

  test.each(timestampCases)('getAirshipTimestamp - $description', ({ input, output, error }) => {
    const message = {
      timestamp: input,
    } as RudderMessage;
    if (error) {
      expect(() => getAirshipTimestamp(message)).toThrow(error);
    } else {
      const timestamp = getAirshipTimestamp(message);
      expect(timestamp).toBe(output);
    }
  });
});

describe('Airship utils - prepareAttributePayload', () => {
  const commonContextProps = {
    app: {
      build: '1',
      name: 'Polarsteps',
      namespace: 'com.polarsteps.Polarsteps',
      version: '8.2.11',
    },
    device: {
      attTrackingStatus: 0,
      id: '1d89c859-76c6-4374-ac0a-e32dee541e12',
      manufacturer: 'Apple',
      model: 'arm64',
      name: 'iPhone 14 Pro Max',
      type: 'iOS',
    },
    library: {
      name: 'rudder-ios-library',
      version: '1.31.0',
    },
    locale: 'en-US',
    network: {
      cellular: false,
      wifi: true,
    },
    os: {
      name: 'iOS',
      version: '17.0',
    },
    screen: {
      density: 3,
      height: 932,
      width: 430,
    },
    sessionId: 1736246350,
    timezone: 'Europe/Amsterdam',
  };
  const commonEventProps = {
    anonymousId: 'd00de6f3-2ea3-44bd-8fc5-0c318cb0b9d9',
    channel: 'mobile',
    messageId: 'b95d29ee-f9c8-486c-b9ef-acf231759612',
    originalTimestamp: '2025-01-07T10:57:38.768Z',
    receivedAt: '2025-01-07T10:57:49.882Z',
    request_ip: '77.248.183.43',
    rudderId: 'b931e94b-3b22-462c-8b58-243cb4b37366',
    sentAt: '2025-01-07T10:57:47.707Z',
    userId: '1c5577e3-8d2d-4ecd-9361-88c2bfb254c5',
  };
  const timestampAttributes = [{ timestampAttribute: 'af_install_time' }];
  it('should return the correct attribute payload when jsonAttributes is not present in integrations object ', () => {
    const message = {
      ...commonEventProps,
      context: {
        ...commonContextProps,
        traits: {
          af_install_time: '2024-12-09 12:26:29.643',
          af_status: 'Organic',
          firstName: 'Orcun',
          lastName: 'Test',
          widgets_installed: ['no_widgets_installed', 'widgets_installed'],
        },
      },
      event: 'identify',
      integrations: {
        All: true,
      },
      type: 'identify',
    };

    const expectedAttributePayload = {
      attributes: [
        {
          action: 'set',
          key: 'af_install_time',
          value: '2024-12-09T12:26:29Z',
          timestamp: '2025-01-07T10:57:38Z',
        },
        { action: 'set', key: 'af_status', value: 'Organic', timestamp: '2025-01-07T10:57:38Z' },
        { action: 'set', key: 'first_name', value: 'Orcun', timestamp: '2025-01-07T10:57:38Z' },
        { action: 'set', key: 'last_name', value: 'Test', timestamp: '2025-01-07T10:57:38Z' },
        {
          action: 'set',
          key: 'widgets_installed[0]',
          value: 'no_widgets_installed',
          timestamp: '2025-01-07T10:57:38Z',
        },
        {
          action: 'set',
          key: 'widgets_installed[1]',
          value: 'widgets_installed',
          timestamp: '2025-01-07T10:57:38Z',
        },
      ],
    };

    const traits = getFieldValueFromMessage(message, 'traits');
    const flattenedTraits = flattenJson(traits);
    // @ts-expect-error error with type
    const attributePayload = prepareAttributePayload(flattenedTraits, message, timestampAttributes);
    expect(attributePayload).toEqual(expectedAttributePayload);
  });

  it('should throw error when jsonAttributes is present in integrations object and jsonAttribute(widgets_installed#123) is array', () => {
    const message = {
      ...commonEventProps,
      context: {
        ...commonContextProps,
        traits: {
          af_install_time: '2024-12-09 12:26:29.643',
          af_status: 'Organic',
          firstName: 'Orcun',
          lastName: 'Test',
          widgets_installed: ['no_widgets_installed', 'widgets_installed'],
        },
      },
      event: 'identify',
      integrations: {
        All: true,
        AIRSHIP: {
          JSONAttributes: {
            'widgets_installed#123': ['no_widgets_installed', 'widgets_installed'],
          },
        },
      },
      type: 'identify',
    };

    const traits = getFieldValueFromMessage(message, 'traits');
    const flattenedTraits = flattenJson(traits);
    // @ts-expect-error error with type
    expect(() => prepareAttributePayload(flattenedTraits, message, timestampAttributes)).toThrow(
      'JsonAttribute as array is not supported for widgets_installed#123 in Airship',
    );
  });

  it('should return the correct attribute payload when jsonAttributes is present in integrations object and jsonAttribute(widgets_installed#123) is object', () => {
    const message = {
      ...commonEventProps,
      context: {
        ...commonContextProps,
        traits: {
          af_install_time: '2024-12-09 12:26:29.643',
          af_status: 'Organic',
          firstName: 'Orcun',
          lastName: 'Test',
        },
      },
      event: 'identify',
      integrations: {
        All: true,
        AIRSHIP: {
          JSONAttributes: {
            'widgets_installed#123': {
              widgets: ['no_widgets_installed', 'widgets_installed'],
            },
          },
        },
      },
      type: 'identify',
    };

    const expectedAttributePayload = {
      attributes: [
        {
          action: 'set',
          key: 'af_install_time',
          value: '2024-12-09T12:26:29Z',
          timestamp: '2025-01-07T10:57:38Z',
        },
        { action: 'set', key: 'af_status', value: 'Organic', timestamp: '2025-01-07T10:57:38Z' },
        { action: 'set', key: 'first_name', value: 'Orcun', timestamp: '2025-01-07T10:57:38Z' },
        { action: 'set', key: 'last_name', value: 'Test', timestamp: '2025-01-07T10:57:38Z' },
        {
          action: 'set',
          key: 'widgets_installed#123',
          value: {
            widgets: ['no_widgets_installed', 'widgets_installed'],
          },
          timestamp: '2025-01-07T10:57:38Z',
        },
      ],
    };

    const traits = getFieldValueFromMessage(message, 'traits');
    const flattenedTraits = flattenJson(traits);
    // @ts-expect-error error with type
    const attributePayload = prepareAttributePayload(flattenedTraits, message, timestampAttributes);
    expect(attributePayload).toEqual(expectedAttributePayload);
  });

  it('should return the correct attribute payload when jsonAttributes is present in integrations object and jsonAttribute(data) is object & traits include an object', () => {
    const message = {
      ...commonEventProps,
      context: {
        ...commonContextProps,
        traits: {
          af_install_time: '2024-12-09 12:26:29.643',
          af_status: 'Organic',
          firstName: 'Orcun',
          lastName: 'Test',
          data: {
            recordId: '123',
            recordType: 'user',
          },
        },
      },
      event: 'identify',
      integrations: {
        All: true,
        AIRSHIP: {
          JSONAttributes: {
            'widgets_installed#123': {
              widgets: ['no_widgets_installed', 'widgets_installed'],
            },
          },
        },
      },
      type: 'identify',
    };

    const expectedAttributePayload = {
      attributes: [
        {
          action: 'set',
          key: 'af_install_time',
          value: '2024-12-09T12:26:29Z',
          timestamp: '2025-01-07T10:57:38Z',
        },
        { action: 'set', key: 'af_status', value: 'Organic', timestamp: '2025-01-07T10:57:38Z' },
        { action: 'set', key: 'first_name', value: 'Orcun', timestamp: '2025-01-07T10:57:38Z' },
        { action: 'set', key: 'last_name', value: 'Test', timestamp: '2025-01-07T10:57:38Z' },
        {
          action: 'set',
          key: 'data_recordId',
          value: '123',
          timestamp: '2025-01-07T10:57:38Z',
        },
        {
          action: 'set',
          key: 'data_recordType',
          value: 'user',
          timestamp: '2025-01-07T10:57:38Z',
        },
        {
          action: 'set',
          key: 'widgets_installed#123',
          value: {
            widgets: ['no_widgets_installed', 'widgets_installed'],
          },
          timestamp: '2025-01-07T10:57:38Z',
        },
      ],
    };

    const traits = getFieldValueFromMessage(message, 'traits');
    const flattenedTraits = flattenJson(traits);
    // @ts-expect-error error with type
    const attributePayload = prepareAttributePayload(flattenedTraits, message, timestampAttributes);
    expect(attributePayload).toEqual(expectedAttributePayload);
  });

  it('should return the correct attribute payload when jsonAttributes is present in integrations object and jsonAttribute(widgets_installed#123) is object & traits include an object', () => {
    const message = {
      ...commonEventProps,
      context: {
        ...commonContextProps,
        traits: {
          af_install_time: '2024-12-09 12:26:29.643',
          af_status: 'Organic',
          firstName: 'Orcun',
          lastName: 'Test',
          data: {
            recordId: '123',
            recordType: 'user',
          },
          widgets_installed: ['no_widgets_installed', 'widgets_installed'],
        },
      },
      event: 'identify',
      integrations: {
        All: true,
        AIRSHIP: {
          JSONAttributes: {
            'widgets_installed#123': {
              widgets: ['no_widgets_installed', 'widgets_installed'],
            },
          },
        },
      },
      type: 'identify',
    };

    const expectedAttributePayload = {
      attributes: [
        {
          action: 'set',
          key: 'af_install_time',
          value: '2024-12-09T12:26:29Z',
          timestamp: '2025-01-07T10:57:38Z',
        },
        { action: 'set', key: 'af_status', value: 'Organic', timestamp: '2025-01-07T10:57:38Z' },
        { action: 'set', key: 'first_name', value: 'Orcun', timestamp: '2025-01-07T10:57:38Z' },
        { action: 'set', key: 'last_name', value: 'Test', timestamp: '2025-01-07T10:57:38Z' },
        {
          action: 'set',
          key: 'data_recordId',
          value: '123',
          timestamp: '2025-01-07T10:57:38Z',
        },
        {
          action: 'set',
          key: 'data_recordType',
          value: 'user',
          timestamp: '2025-01-07T10:57:38Z',
        },
        {
          action: 'set',
          key: 'widgets_installed#123',
          value: {
            widgets: ['no_widgets_installed', 'widgets_installed'],
          },
          timestamp: '2025-01-07T10:57:38Z',
        },
      ],
    };

    const traits = getFieldValueFromMessage(message, 'traits');
    const flattenedTraits = flattenJson(traits);
    // @ts-expect-error error with type
    const attributePayload = prepareAttributePayload(flattenedTraits, message, timestampAttributes);
    expect(attributePayload).toEqual(expectedAttributePayload);
  });
});

describe('Airship utils - convertToAirshipTimestamp', () => {
  const timestampCases: timestampTc[] = [
    {
      description: 'should return the same timestamp',
      input: '2025-01-23T12:00:00Z',
      output: '2025-01-23T12:00:00Z',
    },
    {
      description: 'should remove milliseconds',
      input: '2025-01-23T12:00:00.123Z',
      output: '2025-01-23T12:00:00Z',
    },
    {
      description: 'should remove milliseconds - 2',
      input: '2025-01-23T12:00:00.123456Z',
      output: '2025-01-23T12:00:00Z',
    },
    {
      description: 'should return with correct format when T is present but Z is not present',
      input: '2025-01-23T12:00:00',
      output: '2025-01-23T12:00:00Z',
    },
    {
      description: 'should return with correct format when T & Z is not present',
      input: '2025-01-23 12:00:00',
      output: '2025-01-23T12:00:00Z',
    },
    {
      description: 'should throw error when timestamp is not supported',
      input: 'abcd',
      error: 'timestamp is not supported: abcd',
    },
    {
      description:
        'should return with correct format when timestamp contains microseconds without Z',
      input: '2025-01-23T12:00:00.123456',
      output: '2025-01-23T12:00:00Z',
    },
    {
      description: 'should return the correct timestamp when epoch second is passed',
      input: 1742887180,
      output: '2025-03-25T07:19:40Z',
    },
    {
      description: 'should return the correct timestamp when epoch milisecond is passed',
      input: '1742887326657',
      output: '2025-03-25T07:22:06Z',
    },
    {
      description: 'should return the correct timestamp when epoch microsecond is passed',
      input: '1742974069043000',
      output: '2025-03-26T07:27:49Z',
    },
    {
      description: 'should return formatted date time when date time string is passed',
      input: '2025-03-27 16:00:48 +0100',
      output: '2025-03-27T16:00:48Z',
    },
    {
      description: 'should throw an error when incorrect epoch second is passed',
      input: '17428871802',
      error: 'timestamp is not supported: 17428871802',
    },
  ];

  test.each(timestampCases)(
    'convertToAirshipTimestamp - $description',
    ({ input, output, error }) => {
      if (error) {
        expect(() => convertToAirshipTimestamp(input)).toThrow(error);
      } else {
        const timestamp = convertToAirshipTimestamp(input);
        expect(timestamp).toBe(output);
      }
    },
  );
});
