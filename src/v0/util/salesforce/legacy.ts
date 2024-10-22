import { handleHttpRequest } from '../../../adapters/network';
import {
  SF_TOKEN_REQUEST_URL,
  SF_TOKEN_REQUEST_URL_SANDBOX,
} from '../../destinations/salesforce/config';
import Cache from '../cache';
import { AuthInfo, Salesforce } from './types';
import * as common from './common';

export default class Legacy implements Salesforce {
  private readonly cache: Cache;

  constructor(ttl: number) {
    this.cache = new Cache(ttl);
  }

  async getAccessToken({ destination, metadata }: { destination: any; metadata: any }) {
    const accessTokenKey = destination.ID;

    return this.cache.get(accessTokenKey, async () => {
      let SF_TOKEN_URL;
      if (destination.Config.sandbox) {
        SF_TOKEN_URL = SF_TOKEN_REQUEST_URL_SANDBOX;
      } else {
        SF_TOKEN_URL = SF_TOKEN_REQUEST_URL;
      }
      const authUrl = `${SF_TOKEN_URL}?username=${
        destination.Config.userName
      }&password=${encodeURIComponent(destination.Config.password)}${encodeURIComponent(
        destination.Config.initialAccessToken,
      )}&client_id=${destination.Config.consumerKey}&client_secret=${
        destination.Config.consumerSecret
      }&grant_type=password`;
      const { httpResponse, processedResponse } = await handleHttpRequest(
        'post',
        authUrl,
        {},
        {},
        {
          destType: 'salesforce',
          feature: 'transformation',
          endpointPath: '/services/oauth2/token',
          requestMethod: 'POST',
          module: 'router',
          metadata,
        },
      );
      // @ts-expect-error: types not defined
      // If the request fails, throwing error.
      if (!httpResponse.success) {
        this.responseHandler(
          processedResponse,
          `:- authentication failed during fetching access token.`,
          accessTokenKey,
        );
      }
      // @ts-expect-error: types not defined
      const token = httpResponse.response.data;
      // If the httpResponse.success is true it will not come, It's an extra security for developer's.
      if (!token.access_token || !token.instance_url) {
        this.responseHandler(
          processedResponse,
          `:- authentication failed could not retrieve authorization token.`,
          accessTokenKey,
        );
      }
      return {
        token: `Bearer ${token.access_token}`,
        instanceUrl: token.instance_url,
      };
    });
  }

  async collectAuthorizationInfo(event: any): Promise<AuthInfo> {
    const tokenInfo = await this.getAccessToken(event);
    return {
      authorizationFlow: event.destination.DestinationDefinition.Name.toLowerCase(),
      authorizationData: tokenInfo,
    };
  }

  getAuthHeader(authorizationData: { token: string }): { Authorization: string } {
    return {
      Authorization: authorizationData.token,
    };
  }

  responseHandler(destResponse: any, sourceMessage: string, authKey?: string): any {
    const { response, status } = destResponse;
    const matchErrorCode = (errorCode) =>
      response && Array.isArray(response) && response.some((resp) => resp?.errorCode === errorCode);
    if (status === 401 && authKey && matchErrorCode('INVALID_SESSION_ID')) {
      this.cache.del(authKey);
      common.handleAuthError('INVALID_SESSION_ID', '', sourceMessage, destResponse, status);
      return;
    }
    common.responseHandler(destResponse, sourceMessage);
  }
}
