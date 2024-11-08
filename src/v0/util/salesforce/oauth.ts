import { isDefinedAndNotNull, OAuthSecretError } from '@rudderstack/integrations-lib';
import { AuthInfo, Salesforce } from './types';
import * as common from './common';
import { getAuthErrCategoryFromStCode } from '..';

export default class OAuth implements Salesforce {
  errorResponseHandler(destResponse: any, sourceMessage: string) {
    const { response, status } = destResponse;
    const matchErrorCode = (errorCode) =>
      response && Array.isArray(response) && response.some((resp) => resp?.errorCode === errorCode);
    if (status === 401 && matchErrorCode('INVALID_SESSION_ID')) {
      const authErrCategory = getAuthErrCategoryFromStCode(status);
      common.handleAuthError(
        'INVALID_SESSION_ID',
        authErrCategory,
        sourceMessage,
        destResponse,
        status,
      );
      return;
    }
    common.errorResponseHandler(destResponse, sourceMessage);
  }

  async getAccessToken({ metadata }: { metadata: any }) {
    if (!isDefinedAndNotNull(metadata?.secret)) {
      throw new OAuthSecretError('secret is undefined/null');
    }
    return {
      token: metadata.secret?.access_token,
      instanceUrl: metadata.secret?.instance_url,
    };
  }

  async collectAuthorizationInfo(event: any): Promise<AuthInfo> {
    const tokenInfo = await this.getAccessToken(event);
    return {
      authorizationFlow: event.destination.DestinationDefinition.Name.toLowerCase(),
      authorizationData: tokenInfo,
    };
  }

  getAuthHeader(authorizationData: { token: string }): { Authorization: string } {
    return { Authorization: `Bearer ${authorizationData.token}` };
  }
}
