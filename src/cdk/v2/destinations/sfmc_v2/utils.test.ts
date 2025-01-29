import {
  getAccessToken,
  getEndpoint,
  getMethod,
  buildContactPayload,
  buildDataExtensionPayloadForDelete,
  accessTokenCache,
} from './utils';
import { ENDPOINTS } from './config';
import { PlatformError, NetworkError } from '@rudderstack/integrations-lib';
import { handleHttpRequest } from '../../../../../src/adapters/network';
import MockAxiosAdapter from 'axios-mock-adapter';
import axios from 'axios';

describe('SFMC V2 Utils', () => {
  describe('getAccessToken tests', () => {
    it('should retrieve access token successfully', async () => {
      const mockAdapter = new MockAxiosAdapter(axios, { onNoMatch: 'throwException' });
      const validResponse = {
        access_token: 'validAccessToken',
        token_type: 'Bearer',
        expires_in: 1079,
        scope:
          'offline documents_and_images_read saved_content_read journeys_execute journeys_read journeys_write list_and_subscribers_read list_and_subscribers_write data_extensions_read data_extensions_write accounts_read users_read ott_channels_read journeys_aspr e360_analytics_provisioning_view',
        soap_instance_url: 'https://mcvgkqz3c1chrbsz586k90s41hp8.soap.marketingcloudapis.com/',
        rest_instance_url: 'https://mcvgkqz3c1chrbsz586k90s41hp8.rest.marketingcloudapis.com/',
      };
      mockAdapter
        .onPost('https://subDomain.auth.marketingcloudapis.com/v2/token')
        .reply(200, validResponse);
      const token = await getAccessToken(
        { clientId: 'clientId', clientSecret: 'clientSecret', subDomain: 'subDomain' },
        {},
      );
      expect(token).toEqual('validAccessToken');
    });

    it('should throw NetworkError if access token retrieval fails', async () => {
      const mockAdapter = new MockAxiosAdapter(axios, { onNoMatch: 'throwException' });
      const errorResponse = {
        error: 'invalid_client',
        error_description:
          'Invalid client ID. Use the client ID in Marketing Cloud Installed Packages.',
        error_uri: 'https://developer.salesforce.com/docs',
      };
      mockAdapter
        .onPost('https://subDomain.auth.marketingcloudapis.com/v2/token')
        .reply(401, errorResponse);
      try {
        const token = await getAccessToken(
          { clientId: 'clientId', clientSecret: 'clientSecret', subDomain: 'subDomain' },
          {},
        );
      } catch (err) {
        expect(err).toEqual(new NetworkError('Could not retrieve access token', 401));
      }
    });
  });
  describe('getEndpoint tests', () => {
    it('should return SOAP endpoint when objectType is dataExtension and action is delete', () => {
      const config = {
        objectType: 'dataExtension',
        dataExtensionKey: 'DE123',
        action: 'delete',
      };
      const subDomain = 'test';
      const identifiers = {};

      const result = getEndpoint(config, subDomain, identifiers);

      expect(result).toBe('https://test.soap.marketingcloudapis.com/Service.asmx');
    });
    it('should return REST endpoint for data extension with identifiers when objectType is dataExtension and action is not delete', () => {
      const config = {
        objectType: 'dataExtension',
        dataExtensionKey: 'DE123',
        action: 'upsert',
      };
      const subDomain = 'test';
      const identifiers = { id: '123', name: 'JohnDoe' };

      const result = getEndpoint(config, subDomain, identifiers);

      expect(result).toBe(
        'https://test.rest.marketingcloudapis.com/hub/v1/dataevents/key:DE123/rows/id:123,name:JohnDoe',
      );
    });
    it('should return correct endpoint when objectType is contact and action is delete', () => {
      const config = {
        objectType: 'contact',
        dataExtensionKey: 'DE123',
        action: 'delete',
      };
      const subDomain = 'test';
      const identifiers = { id: '123' };

      const result = getEndpoint(config, subDomain, identifiers);
      expect(result).toBe(`https://test.${ENDPOINTS.DELETE_CONTACT}`);
    });
    it('should return upsert contact endpoint when objectType is contact and action is not delete', () => {
      const config = {
        objectType: 'contact',
        dataExtensionKey: '',
        action: 'upsert',
      };
      const subDomain = 'test';
      const identifiers = {};

      const result = getEndpoint(config, subDomain, identifiers);

      expect(result).toBe(`https://test.${ENDPOINTS.UPSERT_CONTACT}`);
    });
    it('should throw PlatformError when objectType is invalid', () => {
      const config = {
        objectType: 'invalidType',
        dataExtensionKey: 'DE123',
        action: 'delete',
      };
      const subDomain = 'test';
      const identifiers = { id: '123' };

      expect(() => getEndpoint(config, subDomain, identifiers)).toThrow(PlatformError);
    });
  });
  describe('getMethod tests', () => {
    it('should return PATCH for contact update', () => {
      const result = getMethod({ action: 'update', objectType: 'contact' });
      expect(result).toBe('PATCH');
    });

    it('should return POST for contact create', () => {
      const result = getMethod({ action: 'create', objectType: 'contact' });
      expect(result).toBe('POST');
    });

    it('should return PUT for non-contact objects', () => {
      const result = getMethod({ action: 'update', objectType: 'non-contact' });
      expect(result).toBe('PUT');
    });
  });
  describe('buildContactPayload tests', () => {
    it('should return a valid contact payload', () => {
      const message = {
        fields: {
          'trait1.key1': 'value1',
          'trait1.key2': 'value2',
          'trait2.key1': 'value3',
        },
        identifiers: {
          contactKey: 'contact-123',
        },
      };
      const result = buildContactPayload(message);
      expect(result).toEqual({
        contactKey: 'contact-123',
        attributeSets: [
          {
            name: 'trait1',
            items: [
              {
                values: [
                  { name: 'key1', value: 'value1' },
                  { name: 'key2', value: 'value2' },
                ],
              },
            ],
          },
          {
            name: 'trait2',
            items: [
              {
                values: [{ name: 'key1', value: 'value3' }],
              },
            ],
          },
        ],
      });
    });
    it('should handle empty fields', () => {
      const message = {
        fields: {},
        identifiers: {
          contactKey: 'contact-123',
        },
      };
      const result = buildContactPayload(message);
      expect(result).toEqual({
        contactKey: 'contact-123',
        attributeSets: [],
      });
    });
  });
  describe('buildDataExtensionPayloadForDelete tests', () => {
    // Successfully builds XML payload with valid message, dataExtensionKey and accessToken
    it('should build valid XML payload when given valid inputs', () => {
      const message = {
        identifiers: {
          email: 'test@test.com',
        },
      };

      const dataExtensionKey = 'test_de';

      const accessToken = 'test_token';

      const result = buildDataExtensionPayloadForDelete(message, dataExtensionKey, accessToken);

      expect(result).toEqual(expect.stringContaining('<s:Envelope'));
      expect(result).toEqual(expect.stringContaining('<s:Header>'));
      expect(result).toEqual(expect.stringContaining('<fueloauth>test_token</fueloauth>'));
      expect(result).toEqual(expect.stringContaining('<CustomerKey>test_de</CustomerKey>'));
      expect(result).toEqual(expect.stringContaining('<Name>email</Name>'));
      expect(result).toEqual(expect.stringContaining('<Value>test@test.com</Value>'));
    });
    // Properly structures SOAP envelope with required namespaces
    it('should structure SOAP envelope with correct namespaces and headers when given valid inputs', () => {
      const message = {
        identifiers: {
          email: 'test@example.com',
        },
      };

      const dataExtensionKey = 'example_de_key';
      const accessToken = 'example_access_token';

      const result = buildDataExtensionPayloadForDelete(message, dataExtensionKey, accessToken);

      expect(result).toEqual(expect.stringContaining('<s:Envelope'));
      expect(result).toEqual(expect.stringContaining('<s:Header>'));
      expect(result).toEqual(
        expect.stringContaining('<fueloauth>example_access_token</fueloauth>'),
      );
      expect(result).toEqual(expect.stringContaining('<CustomerKey>example_de_key</CustomerKey>'));
      expect(result).toEqual(expect.stringContaining('<Name>email</Name>'));
      expect(result).toEqual(expect.stringContaining('<Value>test@example.com</Value>'));
      expect(result).toEqual(expect.stringContaining('http://www.w3.org/2003/05/soap-envelope'));
      expect(result).toEqual(
        expect.stringContaining('http://schemas.xmlsoap.org/ws/2004/08/addressing'),
      );
      expect(result).toEqual(
        expect.stringContaining(
          'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
        ),
      );
    });
  });
});
