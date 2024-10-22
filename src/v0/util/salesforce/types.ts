export type AuthInfo = {
  authorizationFlow: string;
  authorizationData: {
    token: string;
    instanceUrl: string;
  };
};

export interface Salesforce {
  collectAuthorizationInfo: (event: any) => Promise<AuthInfo>;
  getAuthHeader: (authorizationData: { token: string }) => { Authorization: string };
  responseHandler: (destResponse: any, sourceMessage: string, authKey?: string) => any;
}
