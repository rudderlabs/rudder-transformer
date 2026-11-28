import {
  InstrumentationError,
  NetworkError,
  RetryableError,
  ThrottledError,
} from '@rudderstack/integrations-lib';
import { handleHttpRequest } from '../../../adapters/network';
import { getDestinationVersion } from '../../../util/utils';
import { BASE_PATH, MARKETPLACE_HEADERS } from './frameworkConfig';
import type { ZendeskInput, ZendeskMessage } from './types';

// Legacy helpers remain authoritative while the v1 fallback is active.
// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,import/extensions
const { getBaseEndpoint } = require('./config.js');

export type ZendeskClient = {
  baseUrl: string;
  headers: Record<string, string>;
  destinationId: string;
  subdomain: string;
  accountId?: string;
  request: (method: string, path: string, body?: Record<string, unknown>) => Promise<any>;
};

export const createClient = (input: ZendeskInput): ZendeskClient => {
  const { Config, ID, version } = input.destination;
  const oauth = getDestinationVersion(version) >= 2;
  const token = input.metadata?.secret?.accessToken;
  const headers = {
    'Content-Type': 'application/json',
    ...MARKETPLACE_HEADERS,
    Authorization: oauth
      ? `Bearer ${token}`
      : `Basic ${Buffer.from(`${Config.email}/token:${Config.apiToken}`).toString('base64')}`,
  };
  const baseUrl: string = getBaseEndpoint(Config.domain);
  return {
    baseUrl,
    headers,
    destinationId: ID,
    subdomain: Config.domain,
    accountId: oauth ? Config.rudderAccountId : undefined,
    async request(method, path, body) {
      const endpoint = path.startsWith('https://') ? path : `${baseUrl}${path}`;
      const relativePath = new URL(endpoint).pathname.slice(BASE_PATH.length);
      const statTags = {
        destType: 'zendesk',
        feature: 'transformation',
        module: 'router',
        requestMethod: method.toUpperCase(),
        endpointPath: `${BASE_PATH}${relativePath.split('?')[0].replace(/\d+/g, ':id')}`,
        metadata: input.metadata,
      };
      const { processedResponse } =
        body === undefined
          ? await handleHttpRequest(method, endpoint, { headers }, statTags)
          : await handleHttpRequest(method, endpoint, body, { headers }, statTags);
      if (processedResponse.status >= 200 && processedResponse.status < 300) {
        return processedResponse.response;
      }
      const { status, response } = processedResponse;
      const reason = `Zendesk ${method.toUpperCase()} ${path} failed with status ${status}`;
      if (status === 401 && oauth) {
        throw new NetworkError(reason, status, {}, response, 'REFRESH_TOKEN');
      }
      if (status === 429) throw new ThrottledError(reason);
      if (status >= 500) throw new RetryableError(reason, status);
      throw new NetworkError(reason, status, {}, response);
    },
  };
};

// Zendesk supplies absolute next_page links for offset and cursor pagination. Never follow
// a link outside this account's endpoint or to a different resource.
export const zendeskPageUrl = (next: string, baseUrl: string, path: string): string | undefined => {
  try {
    const url = new URL(next, baseUrl);
    const base = new URL(baseUrl);
    if (
      url.origin !== base.origin ||
      url.username ||
      url.password ||
      url.hash ||
      ![`${base.pathname}${path}`, `${base.pathname}${path.replace(/\.json$/, '')}`].includes(
        url.pathname,
      )
    )
      return undefined;
    return url.href;
  } catch {
    return undefined;
  }
};

export const makeDeliveryRequest = (
  client: ZendeskClient,
  path: string,
  body: Record<string, unknown>,
) => ({
  body,
  endpoint: `${client.baseUrl}${path}`,
  endpointPath: `/${path.replace(/\d+/g, ':id')}`,
  method: 'POST',
  headers: client.headers,
});

export const traitsOf = (message: ZendeskMessage): Record<string, any> =>
  message.traits || message.context?.traits || {};

export const requireUserId = (message: ZendeskMessage): void => {
  if (!message.userId)
    throw new InstrumentationError(`UserId is a mandatory field for ${message.type}`);
};

export const findUser = async (client: ZendeskClient, email?: string): Promise<any> => {
  if (!email) return undefined;
  const result = await client.request(
    'get',
    `users/search.json?query=${encodeURIComponent(email)}`,
  );
  return result?.users?.[0];
};

export const createUser = async (
  client: ZendeskClient,
  message: ZendeskMessage,
  config: ZendeskInput['destination']['Config'],
  traits: Record<string, any>,
): Promise<any> => {
  const response = await client.request('post', 'users/create_or_update.json', {
    user: {
      name: traits.name,
      email: traits.email,
      external_id: message.userId,
      ...(config.createUsersAsVerified ? { verified: true } : {}),
    },
  });
  if (!response?.user?.id) throw new NetworkError('Zendesk did not return a user ID', 500);
  return response.user;
};
