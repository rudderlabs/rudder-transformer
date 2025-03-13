import { generateMetadata } from '../../../testUtils';
import {
  Destination,
  RouterTransformationRequest,
  RouterTransformationRequestData,
} from '../../../../../src/types';
import { secret1 } from '../maskedSecrets';

const destination: Destination = {
  ID: '123',
  Name: 'klaviyo',
  DestinationDefinition: {
    ID: '123',
    Name: 'klaviyo',
    DisplayName: 'klaviyo',
    Config: {},
  },
  Config: {
    privateApiKey: secret1,
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};
const destinationV2: Destination = {
  ID: '123',
  Name: 'klaviyo',
  DestinationDefinition: {
    ID: '123',
    Name: 'klaviyo',
    DisplayName: 'klaviyo',
    Config: {},
  },
  Config: {
    privateApiKey: secret1,
    apiVersion: 'v2',
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};
const getRequest = (apiVersion) => {
  return [
    {
      destination: apiVersion === 'v2' ? destinationV2 : destination,
      metadata: generateMetadata(1),
      message: {
        type: 'identify',
        sentAt: '2021-01-03T17:02:53.195Z',
        userId: 'test',
        channel: 'web',
        context: {
          os: { name: '', version: '' },
          app: {
            name: 'RudderLabs JavaScript SDK',
            build: '1.0.0',
            version: '1.1.11',
            namespace: 'com.rudderlabs.javascript',
          },
          traits: {
            firstName: 'Test',
            lastName: 'Rudderlabs',
            email: 'test_1@rudderstack.com',
            phone: '+12 345 578 900',
            userId: 'Testc',
            title: 'Developer',
            organization: 'Rudder',
            city: 'Tokyo',
            region: 'Kanto',
            country: 'JP',
            zip: '100-0001',
            Flagged: false,
            Residence: 'Shibuya',
            properties: { consent: ['email', 'sms'] },
          },
          locale: 'en-US',
          screen: { density: 2 },
          library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
          campaign: {},
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
        },
        rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
        messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
        anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
        integrations: { All: true },
        originalTimestamp: '2021-01-03T17:02:53.193Z',
      },
    },
    {
      destination: apiVersion === 'v2' ? destinationV2 : destination,
      metadata: generateMetadata(2),
      message: {
        type: 'identify',
        sentAt: '2021-01-03T17:02:53.195Z',
        userId: 'test',
        channel: 'web',
        context: {
          os: { name: '', version: '' },
          app: {
            name: 'RudderLabs JavaScript SDK',
            build: '1.0.0',
            version: '1.1.11',
            namespace: 'com.rudderlabs.javascript',
          },
          traits: {
            firstName: 'Test',
            lastName: 'Rudderlabs',
            email: 'test@rudderstack.com',
            phone: '+12 345 578 900',
            userId: 'test',
            title: 'Developer',
            organization: 'Rudder',
            city: 'Tokyo',
            region: 'Kanto',
            country: 'JP',
            zip: '100-0001',
            Flagged: false,
            Residence: 'Shibuya',
            properties: { listId: 'XUepkK', subscribe: true, consent: ['email', 'sms'] },
          },
          locale: 'en-US',
          screen: { density: 2 },
          library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
          campaign: {},
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
        },
        rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
        messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
        anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
        integrations: { All: true },
        originalTimestamp: '2021-01-03T17:02:53.193Z',
      },
    },
    {
      destination: apiVersion === 'v2' ? destinationV2 : destination,
      metadata: generateMetadata(3),
      message: {
        userId: 'user123',
        type: 'group',
        groupId: 'XUepkK',
        traits: {
          email: 'test@rudderstack.com',
          phone: '+12 345 678 900',
          subscribe: true,
          consent: ['email'],
        },
        context: {
          ip: '14.5.67.21',
          library: { name: 'http' },
        },
        timestamp: '2020-01-21T00:21:34.208Z',
      },
    },
    {
      destination: apiVersion === 'v2' ? destinationV2 : destination,
      metadata: generateMetadata(4),
      message: {
        userId: 'user123',
        type: 'random',
        groupId: 'XUepkK',
        traits: { subscribe: true },
        context: {
          traits: {
            email: 'test@rudderstack.com',
            phone: '+12 345 678 900',
            consent: 'email',
          },
          ip: '14.5.67.21',
          library: { name: 'http' },
        },
        timestamp: '2020-01-21T00:21:34.208Z',
      },
    },
    {
      destination: apiVersion === 'v2' ? destinationV2 : destination,
      metadata: generateMetadata(5),
      message: {
        userId: 'user123',
        type: 'group',
        groupId: '',
        traits: { subscribe: true },
        context: {
          traits: {
            email: 'test@rudderstack.com',
            phone: '+12 345 678 900',
            consent: 'email',
          },
          ip: '14.5.67.21',
          library: { name: 'http' },
        },
        timestamp: '2020-01-21T00:21:34.208Z',
      },
    },
  ];
};
export const routerRequest: RouterTransformationRequest = {
  input: getRequest('v1') as unknown as RouterTransformationRequestData[],
  destType: 'klaviyo',
};
export const routerRequestV2: RouterTransformationRequest = {
  input: getRequest('v2') as unknown as RouterTransformationRequestData[],
  destType: 'klaviyo',
};
