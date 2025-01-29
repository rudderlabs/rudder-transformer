import { NetworkError, PlatformError } from '@rudderstack/integrations-lib';
import { XMLBuilder } from 'fast-xml-parser';
import { ENDPOINTS } from './config';
import { getDynamicErrorType } from '../../../../adapters/utils/networkUtils';
import Cache from '../../../../v0/util/cache';
import { handleHttpRequest } from '../../../../adapters/network';
import { JSON_MIME_TYPE } from '../../../../v0/util/constant';
import { isHttpStatusSuccess } from '../../../../v0/util';

export const accessTokenCache = new Cache(1000);
export const getAccessToken = async ({ clientId, clientSecret, subDomain }, metadata) => {
  const { processedResponse: processedResponseSfmc } = await handleHttpRequest(
    'post',
    `https://${subDomain}.${ENDPOINTS.GET_TOKEN}`,
    {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    },
    {
      'Content-Type': JSON_MIME_TYPE,
    },
    {
      destType: 'sfmc',
      feature: 'transformation',
      endpointPath: '/token',
      requestMethod: 'POST',
      module: 'router',
      metadata,
    },
  );

  if (!isHttpStatusSuccess(processedResponseSfmc.status)) {
    throw new NetworkError(
      'Could not retrieve access token',
      processedResponseSfmc.status || 400,
      {
        errorType: getDynamicErrorType(processedResponseSfmc.status || 400),
      },
      processedResponseSfmc.response,
    );
  }

  return processedResponseSfmc.response.access_token;
};

export const getEndpoint = (
  config: {
    objectType: string;
    dataExtensionKey: string;
    action: string;
  },
  subDomain: string,
  identifiers: any,
) => {
  if (config.objectType === 'dataExtension') {
    if (config.action === 'delete') {
      return `https://${subDomain}.soap.marketingcloudapis.com/Service.asmx`;
    }
    const result = Object.entries(identifiers)
      .map(([key, value]) => `${key}:${value}`)
      .join();
    return `https://${subDomain}.${ENDPOINTS.DATA_EXTENSION}${config.dataExtensionKey}/rows/${result}`;
  }
  if (config.objectType === 'contact') {
    if (config.action === 'delete') {
      return `https://${subDomain}.${ENDPOINTS.DELETE_CONTACT}`;
    }
    return `https://${subDomain}.${ENDPOINTS.UPSERT_CONTACT}`;
  }
  throw new PlatformError(
    `Something went wrong. Can't generate endpoint for action:${config.action} and objectType:${config.objectType} combination`,
  );
};

export const getMethod = ({ action, objectType }) => {
  if (objectType === 'contact') {
    if (action === 'update') {
      return 'PATCH';
    }
    return 'POST';
  }
  return 'PUT';
};

/**
 * Builds the payload for upserting a contact in SFMC
 * @param {Object} message - The incoming message
 * @param {Object} identifiers - The identifiers for the contact
 * @param {Object} fields - The fields for the contact
 * @returns {Object} - The payload for upserting the contact
 */
export const buildContactPayload = ({ fields, identifiers }) => {
  // Group fields by top-level category
  const groupedFields = Object.entries(fields).reduce((acc, [key, value]) => {
    const [category, field] = key.split('.');
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ name: field, value });
    return acc;
  }, {});
  // Build the final attributeSets structure
  const attributeSets = Object.entries(groupedFields).map(([name, values]) => ({
    name,
    items: [
      {
        values,
      },
    ],
  }));
  // Construct the contact body object
  return {
    contactKey: identifiers.contactKey,
    attributeSets,
  };
};

export const buildDataExtensionPayloadForDelete = (
  message: any,
  dataExtensionKey: string,
  accessToken: string,
) => {
  const jsonToXml = new XMLBuilder({ ignoreAttributes: false });
  const headers = { fueloauth: { '#text': accessToken } };
  const [key, value] = Object.entries(message.identifiers)[0];
  return jsonToXml.build({
    's:Envelope': {
      's:Header': headers,
      '@_xmlns:s': 'http://www.w3.org/2003/05/soap-envelope',
      '@_xmlns:a': 'http://schemas.xmlsoap.org/ws/2004/08/addressing',
      '@_xmlns:u':
        'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
      's:Body': {
        '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        '@_xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
        DeleteRequest: {
          '@_xmlns': 'http://exacttarget.com/wsdl/partnerAPI',
          Objects: {
            CustomerKey: dataExtensionKey,
            Keys: {
              Key: {
                Name: key,
                Value: value,
              },
            },
            '@_xsi:type': 'DataExtensionObject',
          },
        },
      },
    },
  });
};
