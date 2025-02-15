import { getContactEndpoint, destType, CordialConfig } from './config';
import { handleHttpRequest } from '../../../../adapters/network';

interface ProcessedResponse {
  status: number;
  response?: {
    _id?: string;
    [key: string]: any;
  };
}

export async function checkIfContactExists(
  config: CordialConfig,
  contactId?: string,
  email?: string,
): Promise<boolean> {
  const basicAuth = Buffer.from(`${config.apiKey}:`).toString('base64');
  const endpoint = getContactEndpoint(config, contactId, email);
  const { processedResponse } = await handleHttpRequest(
    'get',
    endpoint,
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    },
    {
      destType,
      feature: 'transformation',
      requestMethod: 'GET',
      endpointPath: contactId ? '/contacts' : '/contacts/email',
      module: 'router',
    },
  );

  return (
      // eslint-disable-next-line no-underscore-dangle
    processedResponse.status === 200 && !!(processedResponse as ProcessedResponse).response?._id
  );
}
